import React, { useState } from 'react';
import { 
  Rocket, 
  Globe, 
  Folder, 
  Download, 
  Cloud, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  HelpCircle,
  Apple,
  Coffee,
  Lightbulb,
  PartyPopper,
  Clock,
  Banknote
} from 'lucide-react';

interface QuickInstallGuideProps {
  onClose: () => void;
}

export const QuickInstallGuide: React.FC<QuickInstallGuideProps> = ({ onClose }) => {
  const [activePath, setActivePath] = useState<'fast' | 'self'>('fast');
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('✓ Copiado al portapapeles');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/85 backdrop-blur-sm overflow-y-auto p-4 animate-fade-in">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl my-4 overflow-hidden border-4 border-amber-500">
        
        {/* CABECERA */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-6 md:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-colors"
            title="Cerrar"
          >
            ✕
          </button>

          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300 mb-3">
            <Rocket className="w-3.5 h-3.5" />
            <span>GUÍA EXPRESS PERSONALIZADA</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight font-serif">
            ¡Vamos a instalarlo HOY mismo!
          </h2>
          <p className="text-slate-300 text-sm mt-2 max-w-3xl font-light">
            Te respondo a tus preguntas exactas: <strong className="text-amber-400">qué descargar, dónde guardarlo y cómo crear el subdominio en rsainver.com</strong>. Sin tecnicismos.
          </p>

          {/* RESPUESTAS RÁPIDAS A TUS PREGUNTAS */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="bg-emerald-500/15 border border-emerald-500/30 p-3 rounded-xl">
              <span className="text-emerald-400 font-black block mb-0.5">¿Subdominio?</span>
              <span className="text-slate-200 font-light">SÍ, crearás <code className="bg-slate-950 px-1 rounded text-amber-400">portal.rsainver.com</code></span>
            </div>
            <div className="bg-amber-500/15 border border-amber-500/30 p-3 rounded-xl">
              <span className="text-amber-400 font-black block mb-0.5">¿Descargar nada?</span>
              <span className="text-slate-200 font-light">NO. Todo se hace desde la web del navegador.</span>
            </div>
            <div className="bg-blue-500/15 border border-blue-500/30 p-3 rounded-xl">
              <span className="text-blue-400 font-black block mb-0.5">¿Carpeta en tu Mac?</span>
              <span className="text-slate-200 font-light">NO. La app vive en internet, no en tu Mac.</span>
            </div>
          </div>
        </div>

        {/* SELECTOR DE RUTA */}
        <div className="bg-slate-50 p-4 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            ¿Cómo prefieres hacerlo?
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              onClick={() => setActivePath('fast')}
              className={`p-4 rounded-2xl border-2 transition-all text-left cursor-pointer ${
                activePath === 'fast' 
                  ? 'bg-emerald-50 border-emerald-500 shadow-md' 
                  : 'bg-white border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <span className="text-sm font-black text-slate-900">Opción 1: La rápida (RECOMENDADA)</span>
                </div>
                {activePath === 'fast' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </div>
              <p className="text-xs text-slate-600 leading-tight">
                <strong>Contratas un freelance por 80-150 €</strong>. Le mandas esto por WhatsApp y en 24h te lo deja funcionando. <strong className="text-emerald-700">Tú solo encargas y pagas.</strong>
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10px]">
                <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">⏱ 0 minutos tuyos</span>
                <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">💰 80-150 €</span>
              </div>
            </button>

            <button
              onClick={() => setActivePath('self')}
              className={`p-4 rounded-2xl border-2 transition-all text-left cursor-pointer ${
                activePath === 'self' 
                  ? 'bg-amber-50 border-amber-500 shadow-md' 
                  : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛠️</span>
                  <span className="text-sm font-black text-slate-900">Opción 2: Lo hago yo mismo</span>
                </div>
                {activePath === 'self' && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
              </div>
              <p className="text-xs text-slate-600 leading-tight">
                Te explico cómo descargar, configurar y subir todo desde tu Mac. <strong>Necesitas seguir 5 pasos técnicos sencillos en 1-2 horas.</strong>
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10px]">
                <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">⏱ 1-2 horas</span>
                <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">💰 Gratis (solo dominio)</span>
              </div>
            </button>
          </div>
        </div>

        {/* CONTENIDO SEGÚN LA RUTA */}
        <div className="p-6 md:p-8">
          
          {activePath === 'fast' && <FastPath copyText={copyText} expandedStep={expandedStep} setExpandedStep={setExpandedStep} />}
          {activePath === 'self' && <SelfPath copyText={copyText} expandedStep={expandedStep} setExpandedStep={setExpandedStep} />}

        </div>

      </div>
    </div>
  );
};

// =====================================================================
// RUTA 1: LA RÁPIDA (CONTRATAR FREELANCE)
// =====================================================================
const FastPath: React.FC<{
  copyText: (text: string) => void;
  expandedStep: number | null;
  setExpandedStep: (n: number | null) => void;
}> = ({ copyText }) => {
  const briefingText = `Hola! 

Necesito que despliegues una aplicación web React + Vite + TypeScript en internet. La aplicación es una plataforma de gestión inmobiliaria.

LO QUE NECESITO:
1. Subir el código a un repositorio en GitHub.
2. Desplegar en Vercel (plan gratuito).
3. Conectar con mi subdominio: portal.rsainver.com
4. Configurar HTTPS automático.

CONFIGURACIÓN DEL DOMINIO:
- Mi dominio principal es rsainver.com (ya lo tengo).
- Quiero un subdominio "portal.rsainver.com".
- Te facilitaré los accesos a mi proveedor de dominio.

PRESUPUESTO Y TIEMPO:
- Pago por tu trabajo: a convenir (rango habitual 80-150 €).
- Plazo: 24-48 horas.

ARCHIVO DE LA APP:
Te lo enviaré yo (es un archivo dist.zip con la web ya compilada lista para subir).

¡Gracias!`;

  return (
    <div className="space-y-6">
      
      {/* MENSAJE INICIAL */}
      <div className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="bg-emerald-600 text-white p-2 rounded-xl flex-shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-emerald-900 mb-1">
              ¡La opción más inteligente para ti!
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Como no eres informático, te ahorras dolores de cabeza pagando a alguien que lo haga en 1 día. Cuesta menos que una cena de 4 personas y te quitas el problema para siempre. <strong>Yo te he preparado todo lo que tienes que enviarle al freelance.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* PASO 1: CONTRATAR FREELANCE */}
      <div className="bg-white border-2 border-amber-300 rounded-2xl overflow-hidden">
        <div className="bg-amber-500 text-slate-950 p-4 flex items-center gap-3">
          <div className="bg-slate-950 text-amber-400 w-9 h-9 rounded-full flex items-center justify-center font-black text-lg">1</div>
          <div>
            <h3 className="text-base font-black">Contrata a un freelance en Malt.es</h3>
            <p className="text-xs font-medium opacity-80">Tiempo: 15 minutos · Coste: 80-150 €</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">¿Qué hacer?</h4>
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">A</span>
                <span>Entra en <a href="https://www.malt.es" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold">malt.es</a> y crea una cuenta gratuita.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">B</span>
                <span>En el buscador escribe: <code className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-900">React Vercel deploy</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">C</span>
                <span>Filtra por valoración (5 estrellas) y precio (hasta 200 €).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">D</span>
                <span>Contacta a 2-3 freelances enviándoles el mensaje preparado abajo. ⬇️</span>
              </li>
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wider">📩 Mensaje listo para enviar al freelance:</span>
              <button
                onClick={() => copyText(briefingText)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copiar mensaje</span>
              </button>
            </div>
            <pre className="text-[11px] text-slate-700 whitespace-pre-wrap font-mono leading-relaxed bg-white p-3 rounded border border-amber-200 max-h-48 overflow-y-auto">
              {briefingText}
            </pre>
          </div>

          <a
            href="https://www.malt.es/s?q=react+vercel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-amber-600 text-white hover:text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir Malt.es ahora</span>
          </a>
        </div>
      </div>

      {/* PASO 2: ENVIAR EL ARCHIVO */}
      <div className="bg-white border-2 border-blue-300 rounded-2xl overflow-hidden">
        <div className="bg-blue-500 text-white p-4 flex items-center gap-3">
          <div className="bg-blue-900 text-blue-300 w-9 h-9 rounded-full flex items-center justify-center font-black text-lg">2</div>
          <div>
            <h3 className="text-base font-black">Descarga el archivo ZIP de la app</h3>
            <p className="text-xs font-medium opacity-80">Tiempo: 2 minutos · Lo enviarás al freelance</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-sm text-slate-700">
            <strong className="text-blue-900 block mb-1">⚠️ MUY IMPORTANTE:</strong>
            La aplicación que estás viendo ahora ya está empaquetada y lista para subir a internet. <strong>No tienes que instalar nada en tu Mac.</strong> Solo tienes que pedirme el archivo o descargarlo:
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-600" />
              <span>¿Dónde guardarlo en tu Mac?</span>
            </h4>
            <ol className="space-y-1.5 text-sm text-slate-700">
              <li>1. Crea una carpeta nueva en tu <strong>Escritorio</strong> llamada <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold">RSA Inver Web</code></li>
              <li>2. Guarda dentro el archivo <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold">rsa-inver.zip</code></li>
              <li>3. ¡Listo! Solo eso. No tienes que abrirlo ni descomprimirlo.</li>
            </ol>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 inline mr-1" />
            <strong>Consejo:</strong> Cuando contactes al freelance, le envías ese archivo ZIP por WeTransfer o Google Drive. Él se encargará de todo lo demás.
          </div>
        </div>
      </div>

      {/* PASO 3: SUBDOMINIO */}
      <div className="bg-white border-2 border-purple-300 rounded-2xl overflow-hidden">
        <div className="bg-purple-500 text-white p-4 flex items-center gap-3">
          <div className="bg-purple-900 text-purple-300 w-9 h-9 rounded-full flex items-center justify-center font-black text-lg">3</div>
          <div>
            <h3 className="text-base font-black">Crear el subdominio portal.rsainver.com</h3>
            <p className="text-xs font-medium opacity-80">Tiempo: 5 minutos · Lo hará el freelance contigo</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-purple-900 mb-2">✅ Sí, vas a crear un subdominio. Aquí lo importante:</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span><strong>Tu dominio principal:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-bold">rsainver.com</code> (donde tienes tu web actual). Sigue funcionando igual.</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span><strong>Tu nuevo subdominio:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-bold text-purple-900">portal.rsainver.com</code> (donde irá la nueva app de inversores).</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span><strong>¿Coste extra?</strong> NO. Los subdominios son gratis cuando ya tienes el dominio principal.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>¿Quién lo hace? El freelance, pero necesita esto de ti:</span>
            </h4>
            <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
              <li>Dile dónde compraste tu dominio rsainver.com (ej. GoDaddy, Hostinger, IONOS...)</li>
              <li>Dale acceso temporal a tu cuenta del proveedor (o le pasas las claves).</li>
              <li>Él añadirá un "registro DNS tipo CNAME" que apunta portal.rsainver.com → Vercel.</li>
              <li>En 5-30 minutos, la web estará accesible en tu subdominio nuevo.</li>
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
            <Sparkles className="w-4 h-4 inline mr-1" />
            <strong>Si te da reparo dar tus claves:</strong> Crea un usuario nuevo en tu proveedor solo para el freelance, con permisos limitados. Después lo eliminas. Así estás 100% seguro.
          </div>
        </div>
      </div>

      {/* PASO 4: PROBARLO */}
      <div className="bg-white border-2 border-emerald-300 rounded-2xl overflow-hidden">
        <div className="bg-emerald-500 text-white p-4 flex items-center gap-3">
          <div className="bg-emerald-900 text-emerald-300 w-9 h-9 rounded-full flex items-center justify-center font-black text-lg">4</div>
          <div>
            <h3 className="text-base font-black">Probar que todo funciona</h3>
            <p className="text-xs font-medium opacity-80">Tiempo: 5 minutos · Lo haces tú al recibir confirmación</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <ol className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Abre Safari o Chrome en tu Mac.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Escribe: <code className="bg-slate-100 px-2 py-0.5 rounded font-bold">portal.rsainver.com</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Verás esta misma aplicación, pero en tu propio dominio profesional. 🎉</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Comparte el enlace con tu equipo y empieza a dar de alta a tus clientes.</span>
            </li>
          </ol>

          <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-xl text-center">
            <PartyPopper className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-base font-black text-emerald-900">¡LISTO! La web está online.</p>
            <p className="text-xs text-emerald-700 mt-1">
              A partir de aquí, ya puedes generar los manuales y enviarlos a tus clientes.
            </p>
          </div>
        </div>
      </div>

      {/* RESUMEN ECONÓMICO */}
      <div className="bg-gradient-to-r from-slate-900 to-amber-950 text-white p-6 rounded-2xl">
        <h3 className="text-base font-black mb-3 flex items-center gap-2">
          <Banknote className="w-5 h-5 text-amber-400" />
          <span>Resumen de costes y tiempo</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white/10 p-3 rounded-xl">
            <Clock className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-xs text-slate-300 block">Tu tiempo total:</span>
            <span className="text-lg font-black text-white">~30 minutos</span>
            <span className="text-[10px] text-slate-400 block">(Buscar freelance + enviar archivo)</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <Banknote className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-xs text-slate-300 block">Coste único:</span>
            <span className="text-lg font-black text-white">80 - 150 €</span>
            <span className="text-[10px] text-slate-400 block">(Pago al freelance)</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <Cloud className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-xs text-slate-300 block">Coste mensual:</span>
            <span className="text-lg font-black text-emerald-400">0 € / mes</span>
            <span className="text-[10px] text-slate-400 block">(Vercel gratis hasta 100+ clientes)</span>
          </div>
        </div>
      </div>

    </div>
  );
};

// =====================================================================
// RUTA 2: HACERLO TÚ MISMO
// =====================================================================
const SelfPath: React.FC<{
  copyText: (text: string) => void;
  expandedStep: number | null;
  setExpandedStep: (n: number | null) => void;
}> = ({ expandedStep, setExpandedStep }) => {

  const steps = [
    {
      num: 1,
      title: 'Descargar el archivo de la app en tu Mac',
      duration: '5 min',
      icon: Download,
      content: (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-sm text-slate-700">
            <strong className="text-blue-900 block mb-1">📦 ¿Qué descargo y dónde lo guardo?</strong>
            La aplicación que estás viendo ahora ya está empaquetada en un archivo único llamado <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-bold">index.html</code> (o un ZIP con todos los archivos). Te lo proporciono yo.
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-600" />
              <span>Pasos en tu Mac:</span>
            </h4>
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">1</span>
                <span>Abre <strong>Finder</strong> en tu Mac.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">2</span>
                <span>Ve a <strong>Escritorio</strong> y crea una carpeta nueva: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold">RSA Inver Web</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">3</span>
                <span>Guarda dentro el archivo <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold">index.html</code> que te proporcionaré.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">4</span>
                <span>¡Eso es todo en este paso! No tienes que abrirlo ni hacer doble clic.</span>
              </li>
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
            <Apple className="w-4 h-4 inline mr-1" />
            <strong>Tip Mac:</strong> Si quieres ver una vista previa de cómo queda la web antes de subirla, haz <strong>doble clic</strong> en el archivo index.html. Se abrirá en tu navegador y podrás verla funcionar localmente (solo tú la verás).
          </div>
        </div>
      )
    },
    {
      num: 2,
      title: 'Crear cuenta gratis en Vercel',
      duration: '10 min',
      icon: Cloud,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-700">
            <strong>Vercel</strong> es como un "Dropbox para webs": subes tu archivo y lo aloja en internet 24/7 gratis. Es lo que usan empresas como Notion o McDonald's.
          </p>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">1</span>
                <span>Ve a <a href="https://vercel.com/signup" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold">vercel.com/signup</a></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">2</span>
                <span>Crea una cuenta con tu email (recomendado) o con tu GitHub si tienes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">3</span>
                <span>Confirma el email que te llegue.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">4</span>
                <span>En el panel de Vercel, busca el botón <strong>"Add New..."</strong> arriba a la derecha y selecciona <strong>"Project"</strong>.</span>
              </li>
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
            <Coffee className="w-4 h-4 inline mr-1" />
            <strong>Tómate un café:</strong> Este paso es donde la mayoría de gente no técnica se atasca. Si te bloqueas más de 15 minutos, mejor pasa a la <strong>Opción 1 (contratar freelance)</strong> de la pestaña anterior.
          </div>
        </div>
      )
    },
    {
      num: 3,
      title: 'Subir el archivo a Vercel',
      duration: '15 min',
      icon: Cloud,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-700">
            Vercel tiene una opción para subir el archivo arrastrándolo. Es la forma más fácil.
          </p>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">1</span>
                <span>En el panel de Vercel, busca <strong>"Deploy"</strong> o <strong>"Drop a folder"</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">2</span>
                <span><strong>Arrastra la carpeta entera</strong> "RSA Inver Web" desde tu Escritorio al navegador.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">3</span>
                <span>Espera 30-60 segundos a que se suba todo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">4</span>
                <span>Vercel te dará una URL temporal tipo <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold">rsa-inver.vercel.app</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">5</span>
                <span>Haz clic en esa URL. ¡Tu app ya está en internet! 🎉 Pero todavía no en TU dominio.</span>
              </li>
            </ol>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 inline mr-1" />
            <strong>¡Buena señal!</strong> Si ves la app funcionando en una URL tipo <em>algo.vercel.app</em>, has hecho el 70% del trabajo.
          </div>
        </div>
      )
    },
    {
      num: 4,
      title: 'Crear el subdominio portal.rsainver.com',
      duration: '20 min',
      icon: Globe,
      content: (
        <div className="space-y-3">
          <div className="bg-purple-50 border-2 border-purple-300 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-purple-900 mb-2">📌 Respuesta a tu pregunta:</h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>SÍ, vas a crear un subdominio</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-bold text-purple-900">portal.rsainver.com</code>. Tu web actual <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-bold">rsainver.com</code> seguirá funcionando IGUAL. Es como tener una nueva habitación en tu casa: la entrada principal sigue siendo la misma.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Pasos exactos:</h4>
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">1</span>
                <span>En Vercel, abre tu proyecto recién subido.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">2</span>
                <span>Ve a <strong>Settings → Domains</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">3</span>
                <span>Escribe <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold">portal.rsainver.com</code> y pulsa <strong>"Add"</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">4</span>
                <span>Vercel te mostrará un <strong>"valor CNAME"</strong> (algo tipo <code className="bg-white px-1 rounded text-[10px]">cname.vercel-dns.com</code>).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">5</span>
                <span><strong>COPIA</strong> ese valor.</span>
              </li>
            </ol>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-amber-900 mb-2">🔑 Ahora ve a tu proveedor de dominio:</h4>
            <p className="text-xs text-slate-700 mb-2">
              ¿Dónde compraste rsainver.com? (GoDaddy, Hostinger, IONOS, Namecheap, DonDominio...). Entra a tu cuenta de ese proveedor.
            </p>
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">A</span>
                <span>Busca la sección <strong>"DNS"</strong> o <strong>"Administrar dominio"</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">B</span>
                <span>Añade un nuevo registro con estos valores:
                  <div className="mt-1 bg-slate-900 text-amber-300 p-2 rounded font-mono text-xs space-y-0.5">
                    <div>Tipo: <strong className="text-white">CNAME</strong></div>
                    <div>Nombre/Host: <strong className="text-white">portal</strong></div>
                    <div>Valor: <strong className="text-white">cname.vercel-dns.com</strong></div>
                    <div>TTL: <strong className="text-white">3600</strong> (o "auto")</div>
                  </div>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">C</span>
                <span>Guarda los cambios y espera entre 5 minutos y 1 hora a que se propague.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">D</span>
                <span>Vercel detectará automáticamente el cambio y activará HTTPS gratis.</span>
              </li>
            </ol>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-900">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            <strong>Si no sabes dónde compraste el dominio:</strong> Mira en tu email "rsainver" para encontrar la factura del proveedor. Si no, escribe a <strong>quien gestiona tu web rsainver.com</strong> y pídele que añada ese registro CNAME por ti (le tomará 2 minutos).
          </div>
        </div>
      )
    },
    {
      num: 5,
      title: 'Probar y compartir',
      duration: '5 min',
      icon: PartyPopper,
      content: (
        <div className="space-y-3">
          <ol className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Espera 30 minutos a que se active el dominio (puede tardar hasta 1h).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Abre Safari/Chrome en tu Mac y escribe: <code className="bg-slate-100 px-2 py-0.5 rounded font-bold">portal.rsainver.com</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Si lo ves funcionar, ¡estás online! 🎉</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Vuelve a la pestaña <strong>"📦 Materiales para Imprimir"</strong>, configura ahí tu URL real, y empieza a generar manuales para tus clientes.</span>
            </li>
          </ol>

          <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-xl text-center">
            <PartyPopper className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-base font-black text-emerald-900">¡FELICIDADES! La web está online.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      
      {/* MENSAJE INICIAL */}
      <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="bg-amber-600 text-white p-2 rounded-xl flex-shrink-0">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-amber-900 mb-1">
              Antes de empezar, una recomendación honesta:
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Si nunca has tocado configuraciones DNS o servidores, <strong>te va a costar 1-2 horas</strong> y posiblemente alguna llamada al soporte de tu proveedor de dominio. Es perfectamente factible, pero <strong>la opción del freelance es más rápida y por menos de 150 € te lo dejan listo</strong>. Tú decides.
            </p>
          </div>
        </div>
      </div>

      {/* PASOS COLAPSABLES */}
      {steps.map((step) => {
        const Icon = step.icon;
        const isExpanded = expandedStep === step.num;
        return (
          <div 
            key={step.num} 
            className={`bg-white border-2 rounded-2xl overflow-hidden transition-all ${
              isExpanded ? 'border-amber-400 shadow-md' : 'border-slate-200'
            }`}
          >
            <button
              onClick={() => setExpandedStep(isExpanded ? null : step.num)}
              className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                  isExpanded ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                }`}>
                  {step.num}
                </div>
                <div className="text-left">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-amber-600" />
                    <span>{step.title}</span>
                  </h3>
                  <p className="text-xs text-slate-500">⏱ {step.duration}</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isExpanded && (
              <div className="p-5 border-t border-slate-200 bg-slate-50/50">
                {step.content}
              </div>
            )}
          </div>
        );
      })}

      {/* AYUDA FINAL */}
      <div className="bg-blue-50 border-2 border-blue-300 p-5 rounded-2xl">
        <h3 className="text-base font-black text-blue-900 mb-2 flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          <span>¿Te has atascado en algún paso?</span>
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed mb-3">
          No te preocupes. Es totalmente normal si nunca has hecho esto. Mi consejo: <strong>cambia ahora a la "Opción 1: La rápida"</strong> y contrata un freelance. En menos tiempo del que llevas leyendo, ya lo tendrás funcionando.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://www.malt.es/s?q=react+vercel"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Buscar freelance</span>
          </a>
          <a
            href="https://vercel.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Documentación Vercel</span>
          </a>
        </div>
      </div>

    </div>
  );
};
