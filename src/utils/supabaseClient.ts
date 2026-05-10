import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { InvestorUser, AssetOffer, OfferPhase, MissingDoc, HistoryEntry, HistoryEventType } from '../types/inver';

export const ADMIN_EMAILS = ['rsa@rsainver.com'];

export function isAdminEmail(email?: string | null): boolean {
  return ADMIN_EMAILS.includes((email || '').trim().toLowerCase());
}

// Obtener o configurar las credenciales de Supabase
export function getSupabaseCredentials() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metaEnv = (import.meta as any).env || {};
  
  // REQUISITO 1 Y 2: Valores leídos EXCLUSIVAMENTE desde variables de entorno inyectadas por Vercel.
  // Se ignora de forma absoluta y total cualquier valor guardado en localStorage.
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

  console.log('🔒 [AUDITORÍA SUPABASE CLIENT] Variables de entorno Vercel detectadas:');
  console.log('  • VITE_SUPABASE_URL cargada:', envUrl ? 'SÍ' : 'NO', envUrl);
  console.log('  • VITE_SUPABASE_ANON_KEY cargada:', envKey ? 'SÍ' : 'NO', envKey.substring(0, 10) + '...');

  return { url: envUrl.trim(), anonKey: envKey.trim() };
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  localStorage.setItem('rsa_supabase_url', url.trim());
  localStorage.setItem('rsa_supabase_anon_key', anonKey.trim());
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseInstance;
}

// ============================================================================
// FUNCIONES REALES CONTRA SUPABASE AUTH Y BASE DE DATOS (RLS APLICADO)
// ============================================================================

/**
 * Registra un nuevo perfil de Inversor en Supabase Auth y en la tabla investor_profiles
 */
export async function createRealInvestorProfile(inv: Omit<InvestorUser, 'id'>): Promise<{ success: boolean; data?: InvestorUser; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, error: 'Credenciales de Supabase no configuradas. Usa el panel superior para conectarte a tu proyecto.' };
  }

  // 1. Con "Allow new users to sign up" desactivado en producción, el frontend no puede 
  //    usar signUp libremente. Informamos atómicamente a los operadores:
  alert('🔒 MODO PRIVADO DE SUPABASE ACTIVADO:\n\nPara garantizar máxima seguridad, el registro público desde internet está desactivado en la nube.\n\nPor favor, añade el correo del inversor (' + inv.email + ') directamente desde tu consola backend de Supabase (Authentication → Users → Invite / Create User).\n\nNuestro trigger interno en PostgreSQL mapeará su perfil de inmediato al iniciar sesión.');

  return { 
    success: false, 
    error: 'Alta libre inhabilitada en frontend. Usa tu panel backend de Supabase para añadir el usuario de forma segura.' 
  };
}

/**
 * Lee todos los perfiles disponibles (Solo los administradores o el propio usuario obtendrán datos según RLS)
 */
export async function fetchRealInvestors(): Promise<{ success: boolean; data: InvestorUser[]; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, data: [], error: 'Supabase no conectado' };

  try {
    const { data, error } = await supabase
      .from('investor_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted: InvestorUser[] = (data || []).map(row => ({
      id: row.id,
      username: row.username,
      password: '🔒 [Encriptado en Supabase Auth]',
      fullName: row.full_name,
      email: row.email,
      phone: row.phone || '',
      companyName: row.company_name || '',
      createdAt: new Date(row.created_at).toLocaleDateString('es-ES')
    }));

    return { success: true, data: formatted };
  } catch (err: unknown) {
    return { success: false, data: [], error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Lee todas las ofertas junto con sus documentos faltantes y el historial cronológico
 * Cada inversor recibirá automáticamente SOLO las ofertas que le pertenecen gracias al RLS activado.
 */
export async function fetchRealOffers(): Promise<{ success: boolean; data: AssetOffer[]; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, data: [], error: 'Supabase no conectado' };

  try {
    // 1. Leer las ofertas
    const { data: offersData, error: offersError } = await supabase
      .from('asset_offers')
      .select('*')
      .order('created_at', { ascending: false });

    if (offersError) throw offersError;

    if (!offersData || offersData.length === 0) {
      return { success: true, data: [] };
    }

    const offerIds = offersData.map(o => o.id);

    // 2. Leer documentos faltantes para esas ofertas
    const { data: docsData, error: docsError } = await supabase
      .from('missing_docs')
      .select('*')
      .in('offer_id', offerIds);

    if (docsError) throw docsError;

    // 3. Leer historiales
    const { data: histData, error: histError } = await supabase
      .from('offer_history')
      .select('*')
      .in('offer_id', offerIds)
      .order('created_at', { ascending: true });

    if (histError) throw histError;

    // Agrupar
    const formattedOffers: AssetOffer[] = offersData.map(row => {
      const myDocs: MissingDoc[] = (docsData || [])
        .filter(d => d.offer_id === row.id)
        .map(d => ({
          id: d.id,
          name: d.name,
          isProvided: d.is_provided
        }));

      const myHist: HistoryEntry[] = (histData || [])
        .filter(h => h.offer_id === row.id)
        .map(h => ({
          id: h.id,
          timestamp: new Date(h.created_at).getTime(),
          type: h.event_type as HistoryEventType,
          title: h.title,
          description: h.description,
          user: h.registered_by,
          fromValue: h.from_value || undefined,
          toValue: h.to_value || undefined
        }));

      return {
        id: row.id,
        investorId: row.investor_id,
        assetTitle: row.asset_title,
        bankOrServicer: row.bank_or_servicer,
        offerAmount: Number(row.offer_amount),
        originalPrice: Number(row.original_price),
        phase: row.phase as OfferPhase,
        dateSubmitted: new Date(row.created_at).toISOString().split('T')[0],
        missingDocs: myDocs,
        pbcPassed: row.pbc_passed,
        signingDate: row.signing_date || undefined,
        notes: row.notes || '',
        reference: row.reference,
        history: myHist
      };
    });

    return { success: true, data: formattedOffers };
  } catch (err: unknown) {
    return { success: false, data: [], error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Crea una nueva oferta inmobiliaria en producción
 */
export async function createRealOffer(offer: Omit<AssetOffer, 'id' | 'missingDocs' | 'history'>): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase no conectado' };

  try {
    const { data, error } = await supabase
      .from('asset_offers')
      .insert([
        {
          investor_id: offer.investorId,
          asset_title: offer.assetTitle,
          bank_or_servicer: offer.bankOrServicer,
          offer_amount: offer.offerAmount,
          original_price: offer.originalPrice,
          phase: offer.phase,
          pbc_passed: offer.pbcPassed,
          signing_date: offer.signingDate || null,
          notes: offer.notes || null,
          reference: offer.reference
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Registrar hito inicial en offer_history
    if (data && data.id) {
      await supabase.from('offer_history').insert([
        {
          offer_id: data.id,
          event_type: 'created',
          title: 'Expediente abierto en Supabase',
          description: `Oferta de ${Number(offer.offerAmount).toLocaleString()} € registrada.`,
          registered_by: 'Administrador RSA Inver'
        }
      ]);
      return { success: true, data: { id: data.id } };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Actualiza la fase de una oferta en Supabase
 */
export async function updateRealOfferPhase(offerId: string, newPhase: OfferPhase, oldPhaseLabel: string, newPhaseLabel: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase no conectado' };

  try {
    const pbcState = newPhase === 'pbc_ok' || newPhase === 'firma_fijada' ? true : undefined;

    const updatePayload: { phase: string; pbc_passed?: boolean } = { phase: newPhase };
    if (pbcState !== undefined) {
      updatePayload.pbc_passed = pbcState;
    }

    const { error } = await supabase
      .from('asset_offers')
      .update(updatePayload)
      .eq('id', offerId);

    if (error) throw error;

    // Escribir en historial
    await supabase.from('offer_history').insert([
      {
        offer_id: offerId,
        event_type: 'phase_changed',
        title: `Cambio de fase: ${newPhaseLabel}`,
        description: `El estado pasó de "${oldPhaseLabel}" a "${newPhaseLabel}".`,
        registered_by: 'Administración RSA Inver',
        from_value: oldPhaseLabel,
        to_value: newPhaseLabel
      }
    ]);

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Actualiza notas o fecha de firma
 */
export async function updateRealOfferField(offerId: string, field: 'notes' | 'signing_date', value: string, titleStr: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase no conectado' };

  try {
    const { error } = await supabase
      .from('asset_offers')
      .update({ [field]: value })
      .eq('id', offerId);

    if (error) throw error;

    // Historial
    await supabase.from('offer_history').insert([
      {
        offer_id: offerId,
        event_type: field === 'notes' ? 'note_updated' : 'signing_scheduled',
        title: titleStr,
        description: `Campo actualizado en producción a: "${value}"`,
        registered_by: 'RSA Inver'
      }
    ]);

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Actualiza el check de PBC
 */
export async function updateRealPbcState(offerId: string, passed: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase no conectado' };

  try {
    const { error } = await supabase
      .from('asset_offers')
      .update({ pbc_passed: passed })
      .eq('id', offerId);

    if (error) throw error;

    await supabase.from('offer_history').insert([
      {
        offer_id: offerId,
        event_type: passed ? 'pbc_approved' : 'pbc_revoked',
        title: passed ? '✓ PBC aprobado' : '⌛ PBC pendiente',
        description: passed ? 'Origen de fondos validado por Compliance.' : 'Vuelto a estado pendiente.',
        registered_by: 'RSA Inver'
      }
    ]);

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Añade documento requerido
 */
export async function addRealMissingDoc(offerId: string, docName: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase no conectado' };

  try {
    const { error } = await supabase
      .from('missing_docs')
      .insert([
        {
          offer_id: offerId,
          name: docName,
          is_provided: false
        }
      ]);

    if (error) throw error;

    await supabase.from('offer_history').insert([
      {
        offer_id: offerId,
        event_type: 'doc_added',
        title: `Documento solicitado: ${docName}`,
        description: 'Requerido para la formalización.',
        registered_by: 'RSA Inver'
      }
    ]);

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Marca documento como aportado o pendiente
 */
export async function updateRealDocStatus(docId: string, offerId: string, docName: string, isProvided: boolean, whoStr: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase no conectado' };

  try {
    // Si el llamador es un Inversor (comienza por "Cliente" o no es el Administrador), canalizamos
    // obligatoriamente a través del nuevo RPC Seguro para cumplir con las políticas RLS impenetrables.
    if (whoStr.startsWith('Cliente')) {
      const { error: rpcError } = await supabase.rpc('mark_missing_doc_provided', {
        p_doc_id: docId,
        p_is_provided: isProvided
      });

      if (rpcError) throw rpcError;
    } else {
      // Los administradores mantienen su flujo estándar de alteración directa autorizada
      const { error } = await supabase
        .from('missing_docs')
        .update({ is_provided: isProvided })
        .eq('id', docId);

      if (error) throw error;
    }

    // Registrar traza auditable (Los inversores tienen permiso insert en offer_history para sus ofertas)
    await supabase.from('offer_history').insert([
      {
        offer_id: offerId,
        event_type: isProvided ? 'doc_provided' : 'doc_pending',
        title: isProvided ? `✓ Entregado: ${docName}` : `⌛ Pendiente: ${docName}`,
        description: `Estado del anexo actualizado.`,
        registered_by: whoStr
      }
    ]);

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Elimina una oferta y todo su cascada
 */
export async function deleteRealOffer(offerId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase no conectado' };

  try {
    const { error } = await supabase
      .from('asset_offers')
      .delete()
      .eq('id', offerId);

    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ============================================================================
// FUNCIONES DE CONTROL DE ACCESO (LOGIN, LOGOUT Y SESIONES EN PRODUCCIÓN)
// ============================================================================

export interface ActiveSessionData {
  id: string;
  email: string;
  fullName: string;
  username: string;
  isAdmin: boolean;
}

/**
 * Consulta la sesión actual y calcula el rol visual por email autorizado.
 */
export async function getCurrentSupabaseUser(): Promise<{ success: boolean; data?: ActiveSessionData; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    if (!session || !session.user) {
      return { success: true }; // No hay sesión activa, devolvemos sin data
    }

    const user = session.user;
    
    // Consultamos perfil solo para datos de presentación. El rol visual se calcula por email.
    const { data: profileData, error: profileError } = await supabase
      .from('investor_profiles')
      .select('id, email, username, full_name, is_admin')
      .eq('id', user.id)
      .single();

    const adminByEmail = isAdminEmail(user.email);

    if (profileError) {
      console.log('🔒 [AUDITORÍA RLS/AUTH] getSession - Fallo o RLS denegado:', profileError.message);
      return {
        success: true,
        data: {
          id: user.id,
          email: user.email || '',
          fullName: user.user_metadata?.full_name || 'Inversor',
          username: user.email?.split('@')[0] || 'inversor',
          isAdmin: adminByEmail
        }
      };
    }

    console.log('🔒 [AUDITORÍA RLS/AUTH] getSession - Perfil leído con éxito:');
    console.log('  • auth.user.id:', user.id);
    console.log('  • profile.id:', profileData.id);
    console.log('  • profile.email:', profileData.email);
    console.log('  • profile.is_admin devuelto por Supabase:', profileData.is_admin);
    console.log('  • admin por email:', adminByEmail);
    console.log('  • ROL CALCULADO FINAL:', adminByEmail ? 'ADMIN' : 'INVERSOR');

    return {
      success: true,
      data: {
        id: user.id,
        email: profileData.email || user.email || '',
        fullName: profileData.full_name || user.user_metadata?.full_name || 'Inversor',
        username: profileData.username || 'inversor',
        isAdmin: adminByEmail
      }
    };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Inicia sesión real con Supabase Auth (Con depuración exhaustiva en consola)
 */
export async function loginWithSupabase(email: string, pass: string): Promise<{ success: boolean; data?: ActiveSessionData; error?: string; debugLog?: string[] }> {
  const supabase = getSupabase();
  const creds = getSupabaseCredentials();
  const logs: string[] = [];

  logs.push(`URL cargada: ${creds.url ? 'SÍ' : 'NO'} (${creds.url})`);
  logs.push(`Key cargada: ${creds.anonKey ? 'SÍ' : 'NO'}`);

  if (!supabase) {
    logs.push('ERROR: Instancia de Supabase nula.');
    return { success: false, error: 'Supabase no está configurado en Vercel.', debugLog: logs };
  }

  try {
    logs.push(`Iniciando signInWithPassword para: ${email.trim()}`);
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass
    });

    if (error) {
      logs.push(`RESULTADO signInWithPassword: FALLO (${error.message})`);
      throw error;
    }

    const userId = authData.user?.id;
    logs.push(`RESULTADO signInWithPassword: ÉXITO (user.id: ${userId})`);

    if (!userId) {
      throw new Error('No se recibió el user.id tras el login');
    }

    logs.push(`Consultando tabla investor_profiles para datos de perfil...`);
    
    // REQUISITOS 1, 2, 3 Y 4: Selección explícita de columnas en Supabase
    const { data: profileData, error: profileError } = await supabase
      .from('investor_profiles')
      .select('id, email, username, full_name, is_admin')
      .eq('id', userId)
      .single();

    const adminByEmail = isAdminEmail(authData.user?.email || email);

    if (profileError) {
      logs.push(`LECTURA DE PERFIL: FALLO o RLS denegado (${profileError.message})`);
      logs.push(`ADMIN POR EMAIL: ${adminByEmail ? 'TRUE' : 'FALSE'}`);
      console.log('🔒 [AUDITORÍA LOGIN] Fallo al consultar perfil:', profileError.message);
      return {
        success: true,
        data: {
          id: userId,
          email: authData.user?.email || email,
          fullName: authData.user?.user_metadata?.full_name || 'Inversor',
          username: email.split('@')[0],
          isAdmin: adminByEmail
        },
        debugLog: logs
      };
    }

    // REQUISITO 7: Log visible/consola absoluto
    console.log('🔒 [AUDITORÍA LOGIN EXHAUSTIVO] Inicio de sesión completado:');
    console.log('  • auth.user.id:', userId);
    console.log('  • profile.id:', profileData.id);
    console.log('  • profile.email:', profileData.email);
    console.log('  • profile.is_admin devuelto en celda:', profileData.is_admin);
    console.log('  • admin por email:', adminByEmail);
    console.log('  • ROL CALCULADO FINAL:', adminByEmail ? 'ADMINISTRADOR' : 'INVERSOR');

    logs.push(`profile.is_admin leído: ${profileData.is_admin === true ? 'TRUE' : 'FALSE'}`);
    logs.push(`ADMIN POR EMAIL: ${adminByEmail ? 'TRUE' : 'FALSE'}`);
    logs.push(`ROL CALCULADO: ${adminByEmail ? 'ADMIN' : 'INVERSOR'}`);

    return {
      success: true,
      data: {
        id: userId,
        email: profileData.email || authData.user?.email || email,
        fullName: profileData.full_name || authData.user?.user_metadata?.full_name || 'Inversor',
        username: profileData.username || email.split('@')[0],
        isAdmin: adminByEmail
      },
      debugLog: logs
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logs.push(`EXCEPCIÓN CRÍTICA: ${errorMsg}`);
    return { success: false, error: errorMsg, debugLog: logs };
  }
}

/**
 * Cierra la sesión nativa
 */
export async function logoutSupabase(): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase no está configurado.' };

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
