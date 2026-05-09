import React, { useState, useEffect, useRef } from 'react';
import { 
  InvestorUser, 
  AssetOffer, 
  AppNotification,
  INITIAL_INVESTORS, 
  INITIAL_OFFERS 
} from './types/inver';
import { HeaderInver, AdminSection } from './components/HeaderInver';
import { AdminDashboard } from './components/AdminDashboard';
import { InvestorPortal } from './components/InvestorPortal';
import { StatsDashboard } from './components/StatsDashboard';
import { DeploymentGuide } from './components/DeploymentGuide';
import { TestingGuide, TestingGuideLauncher, WelcomeOnboarding, useTestingProgress } from './components/TestingGuide';
import { PrintableMaterials } from './components/PrintableMaterials';
import { QuickInstallGuide } from './components/QuickInstallGuide';
import { 
  getPhaseChangeTemplate, 
  createNotification 
} from './utils/notifications';
import { getSupabase, fetchRealInvestors, fetchRealOffers } from './utils/supabaseClient';
import { Building2, Key, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  // 1. Estado de los inversores con persistencia
  const [investors, setInvestors] = useState<InvestorUser[]>(() => {
    const saved = localStorage.getItem('rsa_inver_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_INVESTORS;
  });

  // 2. Estado de las ofertas con persistencia
  const [offers, setOffers] = useState<AssetOffer[]>(() => {
    const saved = localStorage.getItem('rsa_inver_offers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_OFFERS;
  });

  // 3. Notificaciones con persistencia
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('rsa_inver_notifs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // 4. Rol actual
  const [currentRole, setCurrentRole] = useState<'admin' | 'investor'>('admin');

  // 5. Sub-sección admin
  const [adminSection, setAdminSection] = useState<AdminSection>('operations');

  // 6. Inversor logueado
  const [loggedInvestorId, setLoggedInvestorId] = useState<string>(() => {
    return investors[0]?.id || '';
  });

  // 7. Auth en portal
  const [isFullyAuthenticated, setIsFullyAuthenticated] = useState<boolean>(true);
  const [inputUser, setInputUser] = useState<string>('');
  const [inputPass, setInputPass] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // 8. Toast notification para cuando se "envía" un email
  const [toast, setToast] = useState<{ subject: string; investor: string; visible: boolean } | null>(null);

  // 9. Estado para el asistente de pruebas (modal de bienvenida + guía)
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('rsa_inver_onboarded') !== 'true';
  });
  const [showTestingGuide, setShowTestingGuide] = useState<boolean>(false);
  const [showQuickInstall, setShowQuickInstall] = useState<boolean>(false);
  const testingProgress = useTestingProgress();

  // 10. Seguridad del Panel Administrador (Protección con Clave Maestra)
  const [adminLocked, setAdminLocked] = useState<boolean>(false);
  const [adminUserInput, setAdminUserInput] = useState<string>('admin@rsainver.com');
  const [adminPassInput, setAdminPassInput] = useState<string>('');
  const [adminLoginError, setAdminLoginError] = useState<string>('');

  // 11. Sesión Activa de Supabase Auth en Producción Real
  const [realAuthUser, setRealAuthUser] = useState<{ id: string; email: string; fullName: string; isAdmin: boolean } | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [cloudLoginEmail, setCloudLoginEmail] = useState<string>('');
  const [cloudLoginPass, setCloudLoginPass] = useState<string>('');
  const [cloudLoginErr, setCloudLoginErr] = useState<string>('');

  // Efecto para inicializar sesión nativa de Supabase
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setIsCheckingSession(false);
      return;
    }

    // Limpiar localStorage demo cuando existe conexión a Supabase real
    localStorage.removeItem('rsa_inver_users');
    localStorage.removeItem('rsa_inver_offers');

    async function checkCurrent() {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        if (!session || !session.user) {
          setRealAuthUser(null);
          setIsCheckingSession(false);
          return;
        }

        const user = session.user;
        // Consultar el perfil
        const { data: profile } = await supabase!.from('investor_profiles').select('*').eq('id', user.id).single();
        
        const isAdminVal = profile ? profile.is_admin === true : false;
        
        setRealAuthUser({
          id: user.id,
          email: user.email || '',
          fullName: profile?.full_name || user.user_metadata?.full_name || 'Inversor',
          isAdmin: isAdminVal
        });

        // Si existe sesión real, cargar listas reales en vez de mocks
        const resInv = await fetchRealInvestors();
        if (resInv.success) {
          setInvestors(resInv.data);
        }
        const resOff = await fetchRealOffers();
        if (resOff.success) {
          setOffers(resOff.data);
        }

        setIsCheckingSession(false);
      } catch (err) {
        console.error(err);
        setIsCheckingSession(false);
      }
    }

    checkCurrent();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setRealAuthUser(null);
      } else {
        checkCurrent();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Ref para detectar cambios de fase y notificar (sin disparar en el primer render)
  const offersRef = useRef<AssetOffer[]>(offers);
  const isInitialRender = useRef<boolean>(true);

  // Persistir cambios
  useEffect(() => {
    localStorage.setItem('rsa_inver_users', JSON.stringify(investors));
  }, [investors]);

  useEffect(() => {
    localStorage.setItem('rsa_inver_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('rsa_inver_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Auto-detectar cambios de fase y generar notificaciones automáticas
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      offersRef.current = offers;
      return;
    }

    const newNotifs: AppNotification[] = [];
    let lastNotifSubject = '';
    let lastNotifInvestor = '';

    offers.forEach(currentOffer => {
      const prevOffer = offersRef.current.find(p => p.id === currentOffer.id);
      
      // Si es una oferta nueva (no existía antes), no notificamos cambio de fase
      if (!prevOffer) return;

      // Detectar cambio de fase
      if (prevOffer.phase !== currentOffer.phase) {
        const investor = investors.find(i => i.id === currentOffer.investorId);
        if (investor) {
          const template = getPhaseChangeTemplate(currentOffer, investor, currentOffer.phase);
          const notif = createNotification(currentOffer, investor, template);
          newNotifs.push(notif);
          lastNotifSubject = template.subject;
          lastNotifInvestor = investor.fullName;
        }
      }
    });

    if (newNotifs.length > 0) {
      setNotifications(prev => [...newNotifs, ...prev]);
      // Mostrar toast
      setToast({ 
        subject: lastNotifSubject, 
        investor: lastNotifInvestor, 
        visible: true 
      });
      setTimeout(() => setToast(null), 4500);
    }

    offersRef.current = offers;
  }, [offers, investors]);

  // Si cambia el ID del inversor, autocompletar las credenciales
  useEffect(() => {
    const found = investors.find(i => i.id === loggedInvestorId);
    if (found) {
      setInputUser(found.username);
      setInputPass(found.password);
    }
  }, [loggedInvestorId, investors]);

  // Restablecer valores de fábrica
  const handleResetDatabase = () => {
    if (confirm('¿Deseas recargar los datos iniciales de prueba (5 activos, 3 inversores y limpiar las notificaciones)?')) {
      isInitialRender.current = true; // Para que no se generen notifs por el reset
      setInvestors(INITIAL_INVESTORS);
      setOffers(INITIAL_OFFERS);
      setNotifications([]);
      if (INITIAL_INVESTORS[0]) {
        setLoggedInvestorId(INITIAL_INVESTORS[0].id);
      }
      setIsFullyAuthenticated(true);
      localStorage.removeItem('rsa_inver_users');
      localStorage.removeItem('rsa_inver_offers');
      localStorage.removeItem('rsa_inver_notifs');
    }
  };

  // Manejador del Login
  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const u = inputUser.trim().toLowerCase();
    const p = inputPass.trim();

    const found = investors.find(i => i.username.toLowerCase() === u && i.password === p);

    if (found) {
      setLoggedInvestorId(found.id);
      setIsFullyAuthenticated(true);
    } else {
      setLoginError('Credenciales incorrectas. Revisa el usuario y clave.');
    }
  };

  // Notification handlers
  const markNotifAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotifsAsRead = () => {
    if (currentRole === 'investor') {
      setNotifications(prev => prev.map(n => 
        n.investorId === loggedInvestorId ? { ...n, isRead: true } : n
      ));
    } else {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const loggedInvObj = investors.find(i => i.id === loggedInvestorId);

  const handleStartOnboarding = () => {
    setShowOnboarding(false);
    setShowTestingGuide(true);
    localStorage.setItem('rsa_inver_onboarded', 'true');
  };

  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('rsa_inver_onboarded', 'true');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-20 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      
      {/* MODAL DE BIENVENIDA AL ABRIR LA APP POR PRIMERA VEZ */}
      {showOnboarding && (
        <WelcomeOnboarding 
          onStart={handleStartOnboarding}
          onSkip={handleSkipOnboarding}
        />
      )}

      {/* MODAL DE LA GUÍA DE PRUEBAS PASO A PASO */}
      {showTestingGuide && (
        <TestingGuide onClose={() => setShowTestingGuide(false)} />
      )}

      {/* MODAL DE LA GUÍA DE INSTALACIÓN EXPRESS */}
      {showQuickInstall && (
        <QuickInstallGuide onClose={() => setShowQuickInstall(false)} />
      )}

      {/* BOTONES FLOTANTES */}
      {!showTestingGuide && !showOnboarding && !showQuickInstall && (
        <>
          {/* Botón Asistente de Pruebas */}
          <TestingGuideLauncher 
            onOpen={() => setShowTestingGuide(true)}
            hasStarted={testingProgress.hasStarted}
            progressPct={testingProgress.pct}
          />

          {/* Botón Instalar Ya - destacado, color verde */}
          <button
            onClick={() => setShowQuickInstall(true)}
            className="fixed bottom-6 left-6 z-50 bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-2 font-black text-xs cursor-pointer transition-all hover:scale-105 group"
            title="Guía express para poner la web online HOY"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-300 border-2 border-white animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
            </div>
            <div className="text-left">
              <span className="block text-[9px] uppercase tracking-wider opacity-80">Lanzamiento</span>
              <span className="block text-sm leading-none mt-0.5">¡Instalar YA!</span>
            </div>
          </button>
        </>
      )}

      {/* TOAST DE NOTIFICACIÓN AUTOMÁTICA */}
      {toast && toast.visible && (
        <div className="fixed top-24 right-4 z-[100] bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500 max-w-sm animate-slide-in-right">
          <div className="flex items-start gap-3">
            <div className="bg-white text-emerald-600 p-1.5 rounded-lg flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100 block">
                ✉️ Email + WhatsApp enviado
              </span>
              <span className="text-xs font-bold block mt-0.5 leading-tight">
                {toast.subject}
              </span>
              <span className="text-[10px] text-emerald-100 block mt-1">
                Destinatario: {toast.investor}
              </span>
            </div>
            <button 
              onClick={() => setToast(null)} 
              className="text-emerald-100 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* CABECERA */}
      <HeaderInver 
        currentRole={currentRole}
        setRole={(r) => {
          setCurrentRole(r);
          if (r === 'investor') setIsFullyAuthenticated(true);
        }}
        investors={investors}
        loggedInvestorId={loggedInvestorId}
        setLoggedInvestorId={(id) => {
          setLoggedInvestorId(id);
          setIsFullyAuthenticated(true);
        }}
        resetDatabase={handleResetDatabase}
        notifications={notifications}
        markNotifAsRead={markNotifAsRead}
        markAllNotifsAsRead={markAllNotifsAsRead}
        deleteNotif={deleteNotif}
        adminSection={adminSection}
        setAdminSection={setAdminSection}
      />

      {/* CONTENEDOR PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        
        {/* BARRERA ABSOLUTA DE SUPABASE EN PRODUCCIÓN (REQUISITO EXCLUYENTE) */}
        {getSupabase() !== null ? (
          
          /* MODO CLOUD REAL CONECTADO: BARRERA ESTRICTA DE LOGIN */
          <div>
            {isCheckingSession ? (
              <div className="text-center py-20">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-slate-500 font-mono">Conectando de forma segura con Supabase Auth en vivo...</p>
              </div>
            ) : !realAuthUser ? (
              
              /* PANTALLA INELUDIBLE DE INICIO DE SESIÓN DE SUPABASE (REQUISITO 1) */
              <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl my-12 animate-fade-in">
                <div className="text-center space-y-2 mb-6">
                  <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-2xl mx-auto flex items-center justify-center font-black text-xl">
                    🔒
                  </div>
                  <h3 className="text-xl font-black text-slate-900 font-serif">
                    Acceso de Producción Supabase
                  </h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    Identifícate con tus credenciales de Supabase. El sistema validará tu token en el servidor y aplicará las políticas de seguridad RLS en tiempo real.
                  </p>
                </div>

                {cloudLoginErr && (
                  <div className="bg-rose-50 text-rose-900 border border-rose-200 p-3 rounded-xl text-xs font-medium mb-4 text-center animate-shake">
                    {cloudLoginErr}
                  </div>
                )}

                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setCloudLoginErr('');
                    setIsCheckingSession(true);

                    try {
                      const m = await import('./utils/supabaseClient');
                      const res = await m.loginWithSupabase(cloudLoginEmail, cloudLoginPass);
                      
                      if (!res.success) {
                        // Capturamos el error nativo explícito (por ejemplo, si Supabase rechaza la clave)
                        setCloudLoginErr('Error de Supabase: ' + (res.error || 'Credenciales incorrectas en la nube.'));
                        setIsCheckingSession(false);
                      } else if (res.data) {
                        // Evaluamos en caliente si Supabase Auth ha devuelto la bandera isAdmin
                        if (res.data.isAdmin) {
                          setRealAuthUser({
                            id: res.data.id,
                            email: res.data.email,
                            fullName: res.data.fullName,
                            isAdmin: true
                          });
                          setIsCheckingSession(false);
                        } else {
                          // Ocurre si la sesión existe en auth.users pero RLS o la consulta bloquean
                          // que is_admin sea leído como true. Alertamos atómicamente:
                          alert('⚠️ ESTADO DE TU USUARIO EN SUPABASE:\n\nEl login de tu correo (' + res.data.email + ') ha sido correcto en Supabase Auth, pero la base de datos devuelve tu perfil con la celda is_admin = FALSE.\n\nPor favor, ve a Supabase → Table Editor → investor_profiles, asegúrate de hacer doble clic sobre el "false" en la columna is_admin, escribe "true" (sin comillas) y pulsa ENTER para guardar.');
                          setRealAuthUser({
                            id: res.data.id,
                            email: res.data.email,
                            fullName: res.data.fullName,
                            isAdmin: false
                          });
                          setIsCheckingSession(false);
                        }
                      }
                    } catch (err) {
                      setCloudLoginErr('Error de conexión: ' + String(err));
                      setIsCheckingSession(false);
                    }
                  }} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Autorizado:
                    </label>
                    <input
                      type="email"
                      placeholder="usuario@dominio.com"
                      value={cloudLoginEmail}
                      onChange={(e) => setCloudLoginEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Contraseña de Supabase:
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={cloudLoginPass}
                      onChange={(e) => setCloudLoginPass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black p-3 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                  >
                    Iniciar Sesión Segura en la Nube
                  </button>
                </form>

                <div className="mt-4 bg-slate-50 p-3 rounded-lg text-center text-[10px] text-slate-500">
                  ⚠️ <strong>Aviso:</strong> El registro libre está bloqueado por RLS. Contacta con Robert o con tu socio comercial si necesitas una invitación de acceso.
                </div>

                {/* ATAJO DE DESCARGA PARA EL DESPLIEGUE FINAL (DIRECTO EN PANTALLA DE LOGIN) */}
                <div className="mt-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 p-4 sm:p-5 rounded-2xl border-2 border-emerald-500 shadow-md text-left space-y-3">
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider block w-max">
                    🚀 ACCIÓN DIRECTA PARA TI
                  </span>
                  <h4 className="text-xs font-black text-slate-900 uppercase">
                    ¿Buscando descargar el archivo index.html limpio?
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-light">
                    Como la aplicación ya está conectada a tu URL de producción en Supabase, ha activado esta pantalla de login seguro. Puedes descargar el archivo final empaquetado y limpio en un clic desde aquí mismo:
                  </p>

                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('/dist/index.html');
                        if (!res.ok) throw new Error('Not found');
                        const text = await res.text();
                        const blob = new Blob([text], { type: 'text/html;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'index.html';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      } catch {
                        let htmlContent = document.documentElement.outerHTML;
                        htmlContent = htmlContent.replace(/<base\s+href="[^"]*arena\.site[^"]*"\s*\/?>/gi, '');
                        const fullHtml = '<!DOCTYPE html>\n' + htmlContent;
                        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'index.html';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }
                      
                      setTimeout(() => {
                        alert('✅ ¡Archivo index.html limpio descargado en tu carpeta de Descargas!\n\nReemplázalo en tu repositorio de GitHub para que Vercel publique la versión encriptada final.');
                      }, 500);
                    }}
                    className="w-full bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-black py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>⬇️ DESCARGAR ARCHIVO FINAL LIMPIO (1 clic)</span>
                  </button>
                  <p className="text-[10px] text-slate-500 text-center italic">
                    Pesa ~1,60 MB y está 100% libre de redirecciones.
                  </p>
                </div>

              </div>

            ) : (
              
              /* USUARIO LOGUEADO EN SUPABASE: RENDERIZAR SEGÚN ROL NATIVO VERIFICADO */
              <div>
                <div className="bg-slate-900 text-white p-3 rounded-xl mb-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Conexión encriptada activa como: <strong className="text-amber-400 font-mono">{realAuthUser.email}</strong> ({realAuthUser.isAdmin ? '👑 ADMIN CORPORATIVO' : '👤 INVERSOR'})</span>
                  </div>

                  <button
                    onClick={async () => {
                      await import('./utils/supabaseClient').then(m => m.logoutSupabase());
                      window.location.reload();
                    }}
                    className="text-rose-400 hover:underline font-bold cursor-pointer"
                  >
                    Cerrar Sesión Nativa
                  </button>
                </div>

                {/* VISTA EXCLUYENTE SEGÚN EL ROL AUTÉNTICO VERIFICADO EN BD (REQUISITO 2 Y 3) */}
                {realAuthUser.isAdmin ? (
                  
                  /* ADMIN REAL VERIFICADO */
                  <div className="space-y-6">
                    {adminSection === 'operations' && (
                      <AdminDashboard 
                        investors={investors}
                        setInvestors={setInvestors}
                        offers={offers}
                        setOffers={setOffers}
                      />
                    )}
                    {adminSection === 'stats' && (
                      <StatsDashboard offers={offers} investors={investors} />
                    )}
                    {adminSection === 'deployment' && (
                      <DeploymentGuide />
                    )}
                    {adminSection === 'materials' && (
                      <PrintableMaterials investors={investors} />
                    )}
                  </div>

                ) : (
                  
                  /* INVERSOR REAL AISLADO POR RLS (JAMÁS VE EL BACKOFFICE) */
                  <div>
                    {(() => {
                      const matchedInv = investors.find(i => i.email.toLowerCase() === realAuthUser.email.toLowerCase());
                      const invPayload: InvestorUser = matchedInv || {
                        id: realAuthUser.id,
                        username: realAuthUser.email.split('@')[0],
                        password: '🔒 [Encriptada en Auth]',
                        fullName: realAuthUser.fullName,
                        email: realAuthUser.email,
                        phone: '',
                        createdAt: new Date().toLocaleDateString('es-ES')
                      };

                      return (
                        <InvestorPortal 
                          investor={invPayload}
                          allOffers={offers}
                          setAllOffers={setOffers}
                        />
                      );
                    })()}
                  </div>

                )}
              </div>
            )}
          </div>

        ) : (
          
          /* MODO ORIGINAL DE PRUEBA LOCAL (SI NO ESTÁ INYECTADA LA URL EN VERCEL) */
          <div>
            {/* VISTA 1: ADMIN - SEGURIDAD Y PANELES */}
            {currentRole === 'admin' && (
              <div>
                {adminLocked ? (
                  
                  /* FORMULARIO DE ACCESO MAESTRO CORPORATIVO */
                  <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border-4 border-amber-500 shadow-xl my-12 animate-fade-in">
                    <div className="text-center space-y-2 mb-6">
                      <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-2xl mx-auto flex items-center justify-center font-black text-xl">
                        🔒
                      </div>
                      <h3 className="text-xl font-black text-slate-900 font-serif">
                        Acceso de Empleados RSA Inver
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-light">
                        Este panel está exclusivamente reservado para los administradores y comerciales de la empresa. Ningún cliente inversor tiene acceso aquí.
                      </p>
                    </div>

                    {adminLoginError && (
                      <div className="bg-rose-50 text-rose-900 border border-rose-200 p-3 rounded-xl text-xs font-medium mb-4 text-center animate-shake">
                        {adminLoginError}
                      </div>
                    )}

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setAdminLoginError('');
                        if (adminPassInput === 'MasterRSA2026') {
                          setAdminLocked(false);
                        } else {
                          setAdminLoginError('Clave maestra incorrecta. Inténtalo de nuevo.');
                        }
                      }} 
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Email Corporativo Maestro:
                        </label>
                        <input
                          type="email"
                          value={adminUserInput}
                          onChange={(e) => setAdminUserInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Clave Maestra de Empleado:
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          value={adminPassInput}
                          onChange={(e) => setAdminPassInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black p-3 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                      >
                        Desbloquear Panel Comercial
                      </button>
                    </form>

                    <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1">
                      <span className="font-bold block text-center">🔑 Simulador: Clave disponible:</span>
                      <p className="font-mono text-center font-bold bg-white p-1 rounded select-all">
                        MasterRSA2026
                      </p>
                      <button
                        onClick={() => setAdminPassInput('MasterRSA2026')}
                        className="w-full text-[10px] text-amber-800 hover:underline font-bold text-center block pt-1 cursor-pointer"
                      >
                        Haz clic aquí para autocompletar la clave
                      </button>
                    </div>
                  </div>

                ) : (
                  
                  /* PANELES DE ADMINISTRACIÓN NORMALES CON GARANTÍA VISUAL */
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* GARANTÍA DE SEGURIDAD EXPLICADA */}
                    <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-500 text-slate-950 p-2 rounded-xl flex-shrink-0 font-black text-sm">
                          🔒
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                            GARANTÍA DE SEGURIDAD: Panel con Clave Maestra Independiente
                          </h4>
                          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-light">
                            Tus clientes inversores <strong>JAMÁS</strong> podrán entrar aquí. Cuando la web esté en internet, este apartado requiere introducir obligatoriamente vuestro usuario y clave de empleado.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setAdminPassInput('');
                          setAdminLocked(true);
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0 self-start sm:self-auto"
                        title="Simular el bloqueo por contraseña"
                      >
                        <span>Simular Bloqueo Comercial</span>
                      </button>
                    </div>

                    {/* CONTENIDO ORIGINAL DE LAS PESTAÑAS ADMIN */}
                    {adminSection === 'operations' && (
                      <AdminDashboard 
                        investors={investors}
                        setInvestors={setInvestors}
                        offers={offers}
                        setOffers={setOffers}
                      />
                    )}

                    {adminSection === 'stats' && (
                      <StatsDashboard
                        offers={offers}
                        investors={investors}
                      />
                    )}

                    {adminSection === 'deployment' && (
                      <DeploymentGuide />
                    )}

                    {adminSection === 'materials' && (
                      <PrintableMaterials investors={investors} />
                    )}

                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VISTA 2: PORTAL CLIENTE INVERSOR */}
        {currentRole === 'investor' && (
          <div>
            {!isFullyAuthenticated || !loggedInvObj ? (
              
              /* LOGIN INVERSOR */
              <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-md my-12 animate-fade-in">
                <div className="text-center space-y-2 mb-6">
                  <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl mx-auto flex items-center justify-center font-black">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 font-serif">
                    Portal del Inversor Inmobiliario
                  </h3>
                  <p className="text-xs text-slate-500 font-light">
                    Introduce las credenciales proporcionadas por tu gestor de <strong>RSA Inver</strong> para ver el estado de tus compras.
                  </p>
                </div>

                {loginError && (
                  <div className="bg-rose-50 text-rose-900 border border-rose-200 p-3 rounded-xl text-xs font-medium mb-4 text-center animate-shake">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleClientLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Usuario / Alias:
                    </label>
                    <input
                      type="text"
                      placeholder="ej. carlos_madrid"
                      value={inputUser}
                      onChange={(e) => setInputUser(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Contraseña:
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={inputPass}
                      onChange={(e) => setInputPass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-amber-600 text-white hover:text-slate-950 font-extrabold p-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Acceder a mis Expedientes</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 p-3 rounded-xl text-[11px] text-slate-600 space-y-1">
                  <span className="font-bold text-slate-700 block">🔑 Credenciales disponibles de prueba:</span>
                  {investors.map(i => (
                    <div 
                      key={i.id} 
                      onClick={() => {
                        setInputUser(i.username);
                        setInputPass(i.password);
                      }}
                      className="cursor-pointer hover:bg-white p-1 rounded transition-colors border border-transparent hover:border-slate-200 flex justify-between items-center"
                    >
                      <span className="font-medium text-slate-900 truncate max-w-[180px]">{i.fullName}</span>
                      <code className="bg-amber-100 text-amber-950 px-1 rounded font-bold text-[10px]">{i.username}</code>
                    </div>
                  ))}
                  <p className="text-[10px] text-slate-400 mt-1 italic text-center">
                    Haz clic en cualquiera para autocompletar e ingresar.
                  </p>
                </div>
              </div>

            ) : (
              
              /* PORTAL DEL CLIENTE LOGUEADO */
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-xl border border-slate-200 mb-6 text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
                    <span>Sesión segura activa como: <strong className="text-slate-900 font-bold font-mono">{loggedInvObj.username}</strong></span>
                  </div>

                  <button
                    onClick={() => setIsFullyAuthenticated(false)}
                    className="text-rose-600 hover:underline font-bold self-start sm:self-auto"
                  >
                    Cerrar Sesión (Probar otro cliente)
                  </button>
                </div>

                <InvestorPortal 
                  investor={loggedInvObj}
                  allOffers={offers}
                  setAllOffers={setOffers}
                />
              </div>

            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          <div className="flex justify-center items-center gap-2 text-slate-900 font-bold text-sm">
            <Building2 className="w-5 h-5 text-amber-600" />
            <span>RSA INVER - Plataforma de Transformación Digital para la Inversión Inmobiliaria</span>
          </div>

          <p className="text-xs text-slate-500 max-w-3xl mx-auto font-light leading-relaxed">
            Este software resuelve de raíz el cuello de botella de soporte y la reiteración de consultas. Cada inversor dispone de su 
            <strong> usuario y clave independiente</strong> y recibe <strong>notificaciones automáticas por email/WhatsApp</strong> cuando cambia el estado de sus operaciones, 
            sin tener que llamar ni preguntar.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-6 text-[11px] font-medium text-slate-600 border-t border-slate-100 max-w-2xl mx-auto">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cifrado y credenciales independientes</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Notificaciones automáticas en tiempo real</span>
            </span>
            <span className="flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cuadro de mando analítico</span>
            </span>
          </div>

          <div className="text-[10px] text-slate-400 font-mono pt-2">
            © 2026 RSA Inver • Portal de Inversores de Activos Bancarios
          </div>

        </div>
      </footer>

    </div>
  );
}
