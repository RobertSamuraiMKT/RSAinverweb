import React, { useState } from 'react';
import { 
  InvestorUser, 
  AssetOffer, 
  OfferPhase, 
  PHASE_LABELS
} from '../types/inver';
import { 
  Building2, 
  AlertTriangle, 
  FileCheck, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Square, 
  HelpCircle,
  ChevronRight,
  ShieldAlert,
  Smartphone,
  Lock,
  Download,
  FileDown
} from 'lucide-react';
import { HistoryTimeline } from './HistoryTimeline';
import { exportSingleOfferReport, exportInvestorReport } from '../utils/pdfExport';
import { logDocProvided } from '../utils/history';

interface InvestorPortalProps {
  investor: InvestorUser;
  allOffers: AssetOffer[];
  setAllOffers: React.Dispatch<React.SetStateAction<AssetOffer[]>>;
}

// Fases secuenciales del embudo para la barra visual interactiva
const FUNNEL_STEPS: { phase: OfferPhase; label: string; short: string }[] = [
  { phase: 'oferta_enviada', label: 'Oferta Lanzada', short: 'Enviada' },
  { phase: 'oferta_aceptada', label: 'Aceptada en Precio', short: 'Aceptada' },
  { phase: 'doc_pendiente', label: 'Falta Doc / En Revisión', short: 'Doc Requerida' },
  { phase: 'doc_completa', label: 'Doc Completa', short: 'Doc OK' },
  { phase: 'pbc_ok', label: 'Compliance (PBC) OK', short: 'PBC Aprobado' },
  { phase: 'firma_fijada', label: 'Firma Programada', short: 'Notaría' }
];

export const InvestorPortal: React.FC<InvestorPortalProps> = ({
  investor,
  allOffers,
  setAllOffers
}) => {
  // Ofertas que corresponden a este inversor específico
  const myOffers = allOffers.filter(o => o.investorId === investor.id);

  // Estado local para simular la subida/entrega de documentos por parte del cliente
  const [showUploadSim, setShowUploadSim] = useState<string | null>(null);

  const toggleClientDocProvided = (offerId: string, docId: string) => {
    setAllOffers(prev => prev.map(off => {
      if (off.id === offerId) {
        const doc = off.missingDocs.find(d => d.id === docId);
        if (!doc) return off;
        const newProvided = !doc.isProvided;
        const histEntry = logDocProvided(doc.name, newProvided, `Cliente ${investor.fullName}`);
        return {
          ...off,
          missingDocs: off.missingDocs.map(d => {
            if (d.id === docId) {
              return { ...d, isProvided: newProvided };
            }
            return d;
          }),
          history: [...(off.history || []), histEntry]
        };
      }
      return off;
    }));
  };

  const getStepIndex = (p: OfferPhase) => {
    if (p === 'oferta_rechazada') return -1;
    return FUNNEL_STEPS.findIndex(s => s.phase === p);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* TARJETA DE BIENVENIDA PERSONALIZADA AL INVERSOR */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden border border-amber-500/20">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-500/20 mb-3">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Acceso Privado y Seguro</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-black tracking-tight font-serif text-white">
              Bienvenido, <span className="text-amber-400 font-sans tracking-normal">{investor.fullName}</span>
            </h2>
            
            {investor.companyName && (
              <p className="text-sm font-bold text-amber-300 mt-0.5">
                🏢 {investor.companyName}
              </p>
            )}

            <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-2xl font-light leading-relaxed">
              En este portal puedes hacer un seguimiento exhaustivo y en tiempo real de todas las ofertas que hemos lanzado a los bancos y servicers en tu nombre. 
              <strong className="text-white font-medium block mt-1">
                No necesitas llamarnos ni preguntarnos por WhatsApp cada día: cualquier avance en precio, requerimiento de Compliance o fecha de notaría aparecerá reflejado aquí al instante.
              </strong>
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 max-w-xl">
              <span>👤 Usuario: <strong className="text-slate-200 font-sans">{investor.username}</strong></span>
              <span>✉️ Email: <strong className="text-slate-200 font-sans">{investor.email}</strong></span>
              <span>📱 Tel: <strong className="text-slate-200 font-sans">{investor.phone}</strong></span>
            </div>
          </div>

          {/* Cuadro resumen de estado del cliente */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 self-stretch md:self-auto flex flex-col justify-center items-center text-center min-w-[180px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Tus Expedientes</span>
            <span className="text-4xl font-black text-white font-serif mt-1">{myOffers.length}</span>
            
            <div className="mt-3 w-full space-y-1 text-left text-[11px]">
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>PBC Aprobados:</span>
                <strong>{myOffers.filter(o => o.pbcPassed).length}</strong>
              </div>
              <div className="flex justify-between text-teal-300 font-bold">
                <span>Con Firma Fijada:</span>
                <strong>{myOffers.filter(o => o.phase === 'firma_fijada').length}</strong>
              </div>
              <div className="flex justify-between text-amber-400 font-medium">
                <span>Faltan Documentos:</span>
                <strong>{myOffers.filter(o => o.missingDocs.some(d => !d.isProvided)).length}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Info banner recordatorio */}
        <div className="mt-6 pt-3 border-t border-white/10 text-[11px] text-amber-300/80 flex items-center gap-1.5 font-light">
          <Lock className="w-3 h-3 flex-shrink-0" />
          <span>Este panel se actualiza automáticamente conforme el equipo de RSA Inver recibe novedades de las entidades bancarias.</span>
        </div>
      </div>

      {/* MENSAJE TRANQUILIZADOR: SIN INSTALACIONES */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="bg-emerald-600 text-white p-2 rounded-xl flex-shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-black text-emerald-900 mb-0.5">
            ✓ No necesitas instalar absolutamente nada
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            Esta web funciona en tu Mac, PC, iPhone, Android o tablet directamente desde el navegador. Si quieres tenerla siempre a mano: en <strong>iPhone</strong> pulsa <em>Compartir → Añadir a pantalla de inicio</em>; en <strong>Android</strong> pulsa <em>Menú ⋮ → Añadir a pantalla de inicio</em>. Aparecerá como una app más sin pasar por App Store ni Play Store.
          </p>
        </div>
      </div>

      {/* LISTADO DE INMUEBLES / OFERTAS ACTIVAS DEL CLIENTE */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-black text-slate-900 font-serif tracking-tight">
            Estado de tus Operaciones de Compra ({myOffers.length})
          </h3>

          {myOffers.length > 0 && (
            <button
              onClick={() => exportInvestorReport(investor, allOffers)}
              className="bg-slate-900 hover:bg-amber-600 text-white hover:text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-xs"
              title="Descargar un PDF con el resumen completo de tus operaciones"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Descargar mi Resumen (PDF)</span>
            </button>
          )}
        </div>

        {myOffers.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-2xs">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No tienes ofertas registradas actualmente</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed font-light">
              Si acabas de comunicarnos tu interés por un activo bancario, en breve el equipo de <strong>RSA Inver</strong> abrirá la ficha correspondiente para que veas su evolución.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {myOffers.map((off) => {
              const currentPhaseObj = PHASE_LABELS[off.phase];
              const currentStepIdx = getStepIndex(off.phase);
              const pendingDocsCount = off.missingDocs.filter(d => !d.isProvided).length;

              return (
                <div 
                  key={off.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs ${
                    off.phase === 'firma_fijada' 
                      ? 'border-teal-500 ring-2 ring-teal-500/20' 
                      : off.phase === 'oferta_rechazada'
                      ? 'border-rose-300'
                      : 'border-slate-200 hover:border-amber-400'
                  }`}
                >
                  
                  {/* CABECERA DE LA TARJETA DEL INMUEBLE */}
                  <div className="bg-slate-50 p-4 sm:px-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                        <span className="font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded text-[10px]">
                          {off.reference}
                        </span>
                        <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded text-[10px]">
                          Entidad / Servicer: {off.bankOrServicer}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          Lanzada: {off.dateSubmitted}
                        </span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-black text-slate-900 font-serif tracking-tight">
                        {off.assetTitle}
                      </h4>
                    </div>

                    <div className="text-right self-start sm:self-auto bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                        Tu Oferta Lanzada
                      </span>
                      <span className="text-xl font-mono font-black text-slate-950">
                        {off.offerAmount.toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  {/* CUERPO DE LA TARJETA */}
                  <div className="p-4 sm:p-6 space-y-6">
                    
                    {/* 1. EMBUDO INTERACTIVO DE FASES (THE FUNNEL TIMELINE) */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Progreso del Expediente en el Servicer:
                      </span>

                      {off.phase === 'oferta_rechazada' ? (
                        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-900 text-xs flex items-center gap-2 font-medium">
                          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <div>
                            <strong>Oferta Rechazada o Contraoferta:</strong> El servicer no ha validado el precio propuesto. Revisa las notas del comercial para plantear un nuevo importe.
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          {/* Línea conectora de fondo */}
                          <div className="absolute top-4 left-4 right-4 h-1 bg-slate-100 rounded-full hidden md:block" />
                          
                          {/* Línea conectora activa */}
                          <div 
                            className="absolute top-4 left-4 h-1 bg-amber-500 rounded-full transition-all duration-500 hidden md:block" 
                            style={{ 
                              width: currentStepIdx >= 0 ? `${(currentStepIdx / (FUNNEL_STEPS.length - 1)) * 100}%` : '0%' 
                            }}
                          />

                          {/* Los Nodos de las fases */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 relative z-10">
                            {FUNNEL_STEPS.map((step, idx) => {
                              const isCompleted = idx <= currentStepIdx;
                              const isCurrent = idx === currentStepIdx;

                              return (
                                <div 
                                  key={step.phase}
                                  className={`flex flex-col items-center p-2 rounded-lg text-center transition-all ${
                                    isCurrent 
                                      ? 'bg-amber-50 border-2 border-amber-500 shadow-xs scale-105' 
                                      : isCompleted 
                                      ? 'bg-emerald-50/60 border border-emerald-200' 
                                      : 'bg-slate-50/50 border border-slate-200 opacity-60'
                                  }`}
                                >
                                  {/* Icono de círculo */}
                                  <div 
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                                      isCurrent 
                                        ? 'bg-amber-500 text-slate-950 font-black animate-pulse' 
                                        : isCompleted 
                                        ? 'bg-emerald-600 text-white' 
                                        : 'bg-slate-200 text-slate-500'
                                    }`}
                                  >
                                    {isCompleted ? '✓' : idx + 1}
                                  </div>

                                  <span className={`text-[10px] font-bold block leading-tight truncate w-full ${
                                    isCurrent ? 'text-amber-950 font-black' : isCompleted ? 'text-emerald-900' : 'text-slate-500'
                                  }`}>
                                    {step.short}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Insignia y descripción del estado actual */}
                      <div className="mt-3 p-3 rounded-xl border bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 flex-shrink-0">Fase Actual:</span>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${currentPhaseObj.color}`}>
                            {currentPhaseObj.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-light italic leading-tight">
                          {currentPhaseObj.desc}
                        </p>
                      </div>
                    </div>

                    {/* 2. AVISOS CRÍTICOS: NOTARÍA Y PBC COMPLIANCE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* ESTADO DE PREVENCIÓN DE BLANQUEO (PBC) */}
                      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                        off.pbcPassed 
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
                          : 'bg-amber-50/50 border-amber-200 text-amber-950'
                      }`}>
                        <div className={`p-2 rounded-lg mt-0.5 ${off.pbcPassed ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'}`}>
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                            Filtro de Compliance (PBC)
                          </span>
                          <h5 className="text-sm font-black mt-0.5">
                            {off.pbcPassed ? '✓ Aprobado por el Banco' : '⌛ En Estudio / Pendiente'}
                          </h5>
                          <p className="text-xs font-light mt-1 opacity-90 leading-tight">
                            {off.pbcPassed 
                              ? 'El banco ha validado el origen de los fondos. Vía libre legal para escriturar.' 
                              : 'Revisando titularidad real y fondos. Aporta la documentación requerida abajo si falta alguna.'}
                          </p>
                        </div>
                      </div>

                      {/* FECHA DE FIRMA / NOTARÍA */}
                      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                        off.signingDate 
                          ? 'bg-teal-50 border-teal-400 text-teal-950 shadow-xs ring-1 ring-teal-400/30 animate-pulse' 
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        <div className={`p-2 rounded-lg mt-0.5 ${off.signingDate ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                            Cita en Notaría
                          </span>
                          <h5 className={`text-sm mt-0.5 ${off.signingDate ? 'font-black text-teal-900' : 'font-medium'}`}>
                            {off.signingDate ? '¡Fecha Confirmada!' : 'Sin fecha asignada aún'}
                          </h5>
                          <p className="text-xs font-light mt-1 text-slate-700 leading-tight">
                            {off.signingDate ? (
                              <strong className="bg-teal-100/80 px-1.5 py-0.5 rounded block text-teal-950 font-sans mt-0.5 border border-teal-200">
                                📍 {off.signingDate}
                              </strong>
                            ) : (
                              'Se fijará fecha una vez aprobados el precio, el contrato de arras y el dictamen de PBC.'
                            )}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* 3. NOTAS DE COMUNICACIÓN EN TIEMPO REAL DEL COMERCIAL */}
                    <div className="bg-amber-50/30 p-4 rounded-xl border border-amber-200/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
                        💬 Últimos Comentarios / Novedades de tu Gestor RSA Inver:
                      </span>
                      <p className="text-xs text-slate-800 font-medium whitespace-pre-line leading-relaxed">
                        {off.notes || 'Sin comentarios adicionales. El expediente sigue su curso habitual.'}
                      </p>
                    </div>

                    {/* 4. SECCIÓN DE DOCUMENTACIÓN REQUERIDA (INTERACTIVO PARA EL CLIENTE) */}
                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-amber-600" />
                            <span>Documentación Requerida para este Expediente</span>
                          </h5>
                          <p className="text-xs text-slate-500 font-light mt-0.5">
                            Marca la casilla cuando nos hayas enviado el documento para que conste como entregado.
                          </p>
                        </div>

                        {pendingDocsCount > 0 ? (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full animate-bounce inline-flex items-center gap-1 self-start sm:self-auto">
                            <ShieldAlert className="w-3 h-3" />
                            <span>¡Faltan {pendingDocsCount} documentos!</span>
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 self-start sm:self-auto">
                            ✓ Todo aportado
                          </span>
                        )}
                      </div>

                      {off.missingDocs.length === 0 ? (
                        <div className="bg-slate-50 p-3 rounded-lg text-center text-xs text-slate-400 font-light">
                          No hay requerimientos de documentación pendientes anotados para esta compra.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {off.missingDocs.map((doc) => (
                            <div 
                              key={doc.id}
                              onClick={() => toggleClientDocProvided(off.id, doc.id)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                doc.isProvided 
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 hover:bg-emerald-100/70' 
                                  : 'bg-white border-amber-200 text-slate-800 hover:bg-slate-50 shadow-2xs'
                              }`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                {doc.isProvided ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                )}
                                <span className={`text-xs truncate ${doc.isProvided ? 'line-through opacity-75' : 'font-medium'}`}>
                                  {doc.name}
                                </span>
                              </div>

                              <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                                doc.isProvided ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-100 text-amber-900'
                              }`}>
                                {doc.isProvided ? 'Entregado' : 'Pendiente'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Botón para simular subida de archivos */}
                      <div className="mt-3 text-right">
                        <button
                          onClick={() => setShowUploadSim(off.id)}
                          className="text-[11px] text-amber-700 hover:text-slate-900 font-bold underline inline-flex items-center gap-1"
                        >
                          <span>¿Cómo adjuntar nueva documentación?</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>

                        {showUploadSim === off.id && (
                          <div className="mt-2 text-left bg-amber-50/80 p-3 rounded-lg border border-amber-200 text-xs text-slate-700 animate-fade-in space-y-2">
                            <p className="font-medium">
                              📤 <strong>Canal de Recepción de Archivos:</strong>
                            </p>
                            <p className="font-light leading-tight">
                              Para garantizar la seguridad y compresión requerida por las plataformas de los bancos (Aliseda, Haya, etc.), por favor envía tus PDFs indicando la referencia <strong className="font-mono text-slate-900 font-bold bg-white px-1 py-0.2 rounded">{off.reference}</strong> al correo:
                            </p>
                            <div className="bg-white p-2 rounded border border-amber-300 font-mono text-xs font-black text-amber-950 text-center select-all">
                              documentacion@rsainver.com
                            </div>
                            <p className="text-[10px] text-slate-500 text-center">
                              Una vez recibido, nuestro equipo marcará la casilla superior como "Entregado".
                            </p>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                  {/* HISTORIAL TIMELINE DEL EXPEDIENTE PARA EL INVERSOR */}
                  <div className="px-4 sm:px-6 pb-4">
                    <HistoryTimeline 
                      history={off.history || []} 
                      variant="full"
                      startCollapsed={true}
                    />
                  </div>

                  {/* PIE DE TARJETA CON RECORDATORIO Y BOTÓN PDF */}
                  <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 font-light">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span>Inversión gestionada por <strong className="text-slate-700">RSA Inver</strong></span>
                      <span className="hidden sm:inline text-slate-300">·</span>
                      <span>No es necesario reiterar consulta por WhatsApp</span>
                    </div>

                    <button
                      onClick={() => exportSingleOfferReport(off, investor)}
                      className="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-300 hover:border-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                      title="Descargar el detalle de este expediente en PDF"
                    >
                      <Download className="w-3 h-3" />
                      <span>Descargar Expediente PDF</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECCIÓN PREGUNTAS FRECUENTES DEL INVERSOR (FAQ) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Preguntas Frecuentes sobre las Fases de Compra de Bancos</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl space-y-1">
            <strong className="text-slate-800 block">¿Cuánto tarda el servicer en aceptar una oferta?</strong>
            <p className="text-slate-600 font-light leading-tight">
              Depende de los comités territoriales. Suelen reunirse 1 o 2 veces por semana. En cuanto pulsan "Aprobado" en su intranet, el semáforo cambia aquí.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl space-y-1">
            <strong className="text-slate-800 block">¿Por qué es tan estricto el control PBC?</strong>
            <p className="text-slate-600 font-light leading-tight">
              Por ley de Prevención de Blanqueo de Capitales, las entidades bancarias exigen trazar hasta el último euro aportado antes de autorizar la firma en notaría.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl space-y-1">
            <strong className="text-slate-800 block">¿Cuándo se fija la notaría?</strong>
            <p className="text-slate-600 font-light leading-tight">
              Exclusivamente cuando el PBC está aprobado y el banco emite la "minuta de compraventa". Te avisaremos con el recuadro destacado.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
