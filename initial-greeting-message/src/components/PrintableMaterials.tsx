import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Users, 
  CreditCard, 
  Mic2, 
  Mail,
  Sparkles,
  Printer,
  Package,
  CheckCircle2,
  Globe,
  Settings,
  Send
} from 'lucide-react';
import { InvestorUser } from '../types/inver';
import { 
  exportClientWelcomeManual, 
  exportTeamPresentationScript, 
  exportCredentialsCard,
  exportOfficePoster 
} from '../utils/printableMaterials';

interface PrintableMaterialsProps {
  investors: InvestorUser[];
}

export const PrintableMaterials: React.FC<PrintableMaterialsProps> = ({ investors }) => {
  // Estado para personalizar el dominio del portal en los PDFs
  const [portalUrl, setPortalUrl] = useState<string>(() => {
    return localStorage.getItem('rsa_inver_portal_url') || 'portal.rsainver.com';
  });
  const [selectedInvestorId, setSelectedInvestorId] = useState<string>(investors[0]?.id || '');
  const [showEmailTemplate, setShowEmailTemplate] = useState<boolean>(false);

  const handlePortalUrlChange = (val: string) => {
    setPortalUrl(val);
    localStorage.setItem('rsa_inver_portal_url', val);
  };

  const selectedInvestor = investors.find(i => i.id === selectedInvestorId);

  const emailTemplate = selectedInvestor ? `Asunto: Bienvenido al Portal RSA Inver - Sus credenciales de acceso

Estimado/a ${selectedInvestor.fullName.split(' ')[0]},

Es un placer darle la bienvenida al portal privado de RSA Inver.

A partir de ahora podrá consultar el estado de todas sus operaciones de compra de inmuebles bancarios en tiempo real, las 24 horas, desde cualquier dispositivo. No necesita instalar nada.

══════════════════════════════════════════
  SUS CREDENCIALES DE ACCESO
══════════════════════════════════════════

  🌐 Dirección web:    ${portalUrl}
  👤 Usuario:          ${selectedInvestor.username}
  🔑 Contraseña:       ${selectedInvestor.password}

══════════════════════════════════════════

📌 INSTRUCCIONES PARA ACCEDER:
  1. Abra el navegador de su dispositivo (Safari, Chrome, etc.)
  2. Escriba la dirección: ${portalUrl}
  3. Introduzca su usuario y contraseña
  4. ¡Listo! Verá el estado de sus operaciones

📎 ADJUNTAMOS:
  • Manual de Bienvenida en PDF
  • Tarjeta de Acceso (puede imprimirla)

🔒 SEGURIDAD:
Le recomendamos cambiar su contraseña tras el primer acceso. 
Sus credenciales son personales e intransferibles.

🆘 ¿NECESITA AYUDA?
Para cualquier duda, no dude en contactarme directamente o 
escribir a contacto@rsainver.com.

Reciba un cordial saludo,

[Su nombre]
RSA Inver - Bank Assets
contacto@rsainver.com` : '';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Texto copiado al portapapeles. Ya puedes pegarlo en tu correo.');
  };

  return (
    <div className="space-y-6">
      
      {/* CABECERA */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden border border-amber-500/20">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300 mb-3">
            <Package className="w-3.5 h-3.5" />
            <span>KIT DE BIENVENIDA Y MATERIALES</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight font-serif">
            Materiales para tu Equipo y Clientes
          </h2>
          <p className="text-slate-300 text-sm mt-2 max-w-3xl font-light">
            Genera documentos profesionales en PDF para entregar en mano, adjuntar por email o imprimir. Todos personalizados con tu marca <strong className="text-amber-400">RSA Inver</strong> y listos para usar en cualquier reunión o presentación.
          </p>
        </div>
      </div>

      {/* CONFIGURACIÓN DEL DOMINIO */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 text-amber-700 p-2 rounded-xl flex-shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">
              Configura la dirección de tu portal
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Esta dirección aparecerá en todos los PDFs y materiales que descargues. Cámbiala una sola vez y se aplicará a todo.
            </p>

            <div className="mt-3 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <div className="flex items-center bg-slate-50 border border-slate-300 rounded-lg overflow-hidden flex-1 max-w-md">
                <span className="bg-slate-100 text-slate-500 text-xs font-mono px-3 py-2.5 border-r border-slate-300">
                  https://
                </span>
                <input
                  type="text"
                  value={portalUrl}
                  onChange={(e) => handlePortalUrlChange(e.target.value)}
                  placeholder="portal.rsainver.com"
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-slate-500 italic">
                💡 Cuando subas la app a internet, pon aquí tu dominio real.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GRID DE MATERIALES PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* MATERIAL 1: MANUAL DE BIENVENIDA AL CLIENTE */}
        <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-xs hover:shadow-md transition-all hover:border-amber-400 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white p-3 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
              Para clientes
            </span>
          </div>

          <h3 className="text-lg font-black text-slate-900 mb-1">
            📘 Manual de Bienvenida del Cliente
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Documento elegante de 3 páginas para entregar en mano o adjuntar por email cuando das de alta a un nuevo inversor. Incluye instrucciones paso a paso, sus credenciales, y guía de instalación en cualquier dispositivo.
          </p>

          <div className="space-y-2 mb-4 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Portada profesional con bienvenida personalizada</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Tarjeta de credenciales destacada</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Instrucciones para iPhone, Android, Mac y PC</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Preguntas frecuentes y datos de contacto</span>
            </div>
          </div>

          {/* Selector de inversor para personalizar */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Personalizar para qué cliente:
            </label>
            <select
              value={selectedInvestorId}
              onChange={(e) => setSelectedInvestorId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="">📄 Versión genérica (sin nombre)</option>
              {investors.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.fullName} ({inv.username})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-auto space-y-2">
            <button
              onClick={() => exportClientWelcomeManual(selectedInvestor, portalUrl)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Manual (PDF)</span>
            </button>
            
            {selectedInvestor && (
              <button
                onClick={() => exportCredentialsCard(selectedInvestor, portalUrl)}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-amber-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Descargar solo la Tarjeta de Acceso</span>
              </button>
            )}
          </div>
        </div>

        {/* MATERIAL 2: SCRIPT DE PRESENTACIÓN AL EQUIPO */}
        <div className="bg-white rounded-2xl border-2 border-slate-300 p-6 shadow-xs hover:shadow-md transition-all hover:border-slate-400 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-amber-400 p-3 rounded-xl">
              <Mic2 className="w-6 h-6" />
            </div>
            <span className="bg-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
              Para equipo interno
            </span>
          </div>

          <h3 className="text-lg font-black text-slate-900 mb-1">
            🎤 Guion de Presentación al Equipo
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Documento confidencial de 5 páginas con un guion completo para que presentes la herramienta a tus comerciales en una reunión de 30 minutos. Incluye agenda, frases sugeridas y cómo manejar objeciones.
          </p>

          <div className="space-y-2 mb-4 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Agenda estructurada en 5 bloques de 30 minutos</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Frases textuales para abrir y cerrar la reunión</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Pasos exactos a mostrar en la demo</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Cómo responder a las 5 objeciones más típicas</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Compromisos finales para el equipo</span>
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={() => exportTeamPresentationScript(portalUrl)}
              className="w-full bg-slate-900 hover:bg-amber-600 text-white hover:text-slate-950 font-black px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Guion (PDF)</span>
            </button>
          </div>
        </div>

      </div>

      {/* MATERIAL ESPECIAL: CARTEL A4 PARA COLGAR EN OFICINA */}
      <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl border-2 border-amber-300 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white p-3 rounded-xl flex-shrink-0">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-lg font-black text-slate-900">
                  🪧 Cartel A4 para colgar en la oficina
                </h3>
                <span className="bg-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  1 hoja A4
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
                Una hoja A4 lista para imprimir y colgar en la pared de tu oficina, sala de espera o despacho. Contiene la URL del portal en grande, los pasos para clientes y para tu equipo, y el aviso destacado de "no necesita instalar nada". <strong>Perfecto para que cualquier visitante o nuevo empleado lo vea de un vistazo.</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => exportOfficePoster(portalUrl)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-black px-5 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Cartel A4</span>
          </button>
        </div>
      </div>

      {/* MATERIAL 3: PLANTILLA DE EMAIL */}
      <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-xs">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-3 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-1">
                ✉️ Plantilla de Email de Bienvenida
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                Texto profesional listo para copiar y pegar en tu cliente de correo (Gmail, Outlook, etc.) con las credenciales del cliente seleccionado. Adjunta junto a este email el Manual de Bienvenida en PDF.
              </p>
            </div>
          </div>
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            Para enviar por email
          </span>
        </div>

        {!selectedInvestor ? (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center text-xs text-amber-900">
            ⚠️ Selecciona un cliente arriba (en la sección "Manual de Bienvenida") para generar el email personalizado.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setShowEmailTemplate(!showEmailTemplate)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{showEmailTemplate ? 'Ocultar plantilla' : 'Ver plantilla del email'}</span>
              </button>
              <button
                onClick={() => copyToClipboard(emailTemplate)}
                className="bg-slate-900 hover:bg-amber-600 text-white hover:text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Copiar al portapapeles</span>
              </button>
            </div>

            {showEmailTemplate && (
              <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-4 animate-fade-in">
                <pre className="text-xs text-slate-800 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                  {emailTemplate}
                </pre>
              </div>
            )}
          </>
        )}
      </div>

      {/* INSTRUCCIONES DE ACCESO RÁPIDO - URLs PARA CADA ROL */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
          <Globe className="w-5 h-5 text-amber-600" />
          <span>Direcciones de acceso para cada perfil</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Una vez tengas la web subida a internet, comparte estos enlaces según el tipo de usuario.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Para el equipo */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-black">Para tu equipo de RSA Inver</h4>
            </div>

            <div className="space-y-2 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">URL DE ACCESO:</span>
                <div className="bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-xs text-amber-300 font-bold break-all">
                  https://{portalUrl}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">CÓMO ACCEDER:</span>
                <ol className="text-xs text-slate-300 space-y-0.5 list-decimal list-inside">
                  <li>Ir a la URL en el navegador</li>
                  <li>Pulsar "Personal RSA Inver (Admin)"</li>
                  <li>Identificarse con sus credenciales corporativas</li>
                </ol>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-2 rounded-lg text-[11px] text-amber-200">
              💡 <strong>Sugerencia:</strong> Comparte esta URL con tu equipo por WhatsApp o email interno. Pídeles que la guarden en favoritos.
            </div>
          </div>

          {/* Para el cliente */}
          <div className="bg-blue-50 text-slate-900 p-5 rounded-2xl border-2 border-blue-300">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-blue-700" />
              <h4 className="text-sm font-black text-blue-900">Para tus clientes inversores</h4>
            </div>

            <div className="space-y-2 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block mb-1">URL DE ACCESO:</span>
                <div className="bg-white border border-blue-200 rounded-lg p-2 font-mono text-xs text-slate-900 font-bold break-all">
                  https://{portalUrl}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block mb-1">CÓMO ACCEDEN:</span>
                <ol className="text-xs text-slate-700 space-y-0.5 list-decimal list-inside">
                  <li>Reciben email con sus credenciales</li>
                  <li>Pulsan "Portal del Inversor"</li>
                  <li>Introducen usuario y contraseña</li>
                  <li>¡Ven todas sus operaciones al instante!</li>
                </ol>
              </div>
            </div>

            <div className="bg-blue-100 border border-blue-300 p-2 rounded-lg text-[11px] text-blue-900">
              💡 <strong>Importante:</strong> Es la <em>misma URL</em> para todos. El sistema detecta el rol según las credenciales con las que entran.
            </div>
          </div>

        </div>
      </div>

      {/* CHECKLIST DE LANZAMIENTO */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-300 p-6">
        <h3 className="text-base font-black text-emerald-900 mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span>Checklist sugerido antes de empezar</span>
        </h3>
        <p className="text-xs text-emerald-700 mb-4">
          Sigue este orden para un lanzamiento profesional y sin sustos:
        </p>

        <div className="space-y-2">
          {[
            'Probar la app tú mismo siguiendo el Asistente de Pruebas (botón dorado abajo a la derecha).',
            'Subir la app a internet siguiendo la guía "📡 Cómo poner la web online".',
            'Configurar tu URL real arriba para que aparezca en todos los PDFs.',
            'Descargar el Guion de Presentación y leerlo antes de la reunión con tu equipo.',
            'Reunir al equipo, presentar la herramienta y dar de alta a un cliente piloto durante la reunión.',
            'Empezar con 2-3 clientes piloto de máxima confianza durante la primera semana.',
            'Generar el Manual de Bienvenida y la Tarjeta de Acceso para cada cliente.',
            'Enviar el email de bienvenida con los PDFs adjuntos.',
            'Tras 2 semanas exitosas, escalar al resto de inversores de tu cartera.'
          ].map((task, idx) => (
            <div key={idx} className="bg-white border border-emerald-200 rounded-lg p-2.5 flex items-start gap-2">
              <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-xs text-slate-700 leading-tight font-medium">{task}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PIE INFORMATIVO */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-center">
        <Printer className="w-5 h-5 text-slate-500 mx-auto mb-1" />
        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Todos los materiales se generan automáticamente con tu marca <strong>RSA Inver</strong> y los datos actuales de la plataforma. Puedes regenerarlos cuando quieras: tardará apenas 1 segundo.
        </p>
      </div>

    </div>
  );
};
