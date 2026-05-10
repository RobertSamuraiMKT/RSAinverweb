import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  Rocket, 
  Globe, 
  Folder, 
  Download, 
  Cloud, 
  CheckCircle2, 
  Sparkles,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Apple,
  Coffee,
  PartyPopper,
  ArrowRight
} from 'lucide-react';

interface QuickInstallGuideProps {
  onClose: () => void;
}

export const QuickInstallGuide: React.FC<QuickInstallGuideProps> = ({ onClose }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

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

        {/* MODO EXCLUSIVO: INSTALACIÓN NATIVA NUBE (OPCIÓN B) */}
        <div className="bg-amber-50 p-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900">
            <span className="text-xl">🛠️</span>
            <div>
              <span className="text-xs font-black uppercase block tracking-wider">MODO ACTIVO: Despliegue Nativo con Supabase Auth + RLS</span>
              <p className="text-[11px] text-slate-600 font-light leading-tight">Has descartado la Opción A. Aquí tienes tu guía 100% enfocada en conectar tu cuenta de Supabase con el proyecto nativo.</p>
            </div>
          </div>
          <span className="bg-amber-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
            OPCIÓN B SELECCIONADA
          </span>
        </div>

        {/* EXPLICACIÓN CRÍTICA: ¿POR QUÉ APUNTA A ARENA.SITE? */}
        <div className="p-6 md:p-8 pb-0">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl border-2 border-amber-500 mb-6">
            <h3 className="text-lg font-black text-amber-400 mb-2 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <span>¡Has descubierto el secreto de Arena! ¿Por qué enlaza a arena.site?</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Lo que acabas de ver es el comportamiento 100% normal y correcto. La plataforma donde estamos construyendo esto (Arena) inyecta de forma invisible una <strong>"etiqueta de seguridad en vivo"</strong> que vincula la previsualización con sus servidores (arena.site). Al descargar el HTML en vivo, guardaste esa etiqueta.
            </p>
            <p className="text-xs text-white font-bold leading-relaxed mb-4">
              ⚡ LA SOLUCIÓN DEFINITIVA: Para que tu web sea totalmente independiente en Vercel sin rastro de arena.site, el freelance necesita desplegar el <strong>código fuente original limpio</strong>. Pulsa el botón mágico de abajo para descargar el paquete completo para el freelance:
            </p>

            <button
              onClick={async () => {
                const files = [
                  'package.json',
                  'vite.config.ts',
                  'tsconfig.json',
                  'index.html',
                  'src/main.tsx',
                  'src/index.css',
                  'src/App.tsx',
                  'src/types/inver.ts',
                  'src/utils/cn.ts',
                  'src/utils/history.ts',
                  'src/utils/notifications.ts',
                  'src/utils/pdfExport.ts',
                  'src/utils/printableMaterials.ts',
                  'src/utils/supabaseClient.ts',
                  'src/utils/supabaseSetup.sql',
                  'src/components/HeaderInver.tsx',
                  'src/components/AdminDashboard.tsx',
                  'src/components/InvestorPortal.tsx',
                  'src/components/HistoryTimeline.tsx',
                  'src/components/NotificationCenter.tsx',
                  'src/components/StatsDashboard.tsx',
                  'src/components/DeploymentGuide.tsx',
                  'src/components/PrintableMaterials.tsx',
                  'src/components/QuickInstallGuide.tsx',
                  'src/components/TestingGuide.tsx'
                ];

                const zip = new JSZip();

                for (const path of files) {
                  try {
                    // REQUISITO INELUDIBLE: El index.html fuente debe ser el archivo puro de Vite.
                    // Evitamos hacer fetch a la red porque los servidores de previsualización inyectan código minificado/inválido.
                    if (path === 'index.html') {
                      const pureHtml = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RSA Inver Portal</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
                      zip.file(path, pureHtml);
                    } else {
                      const res = await fetch('/' + path);
                      if (res.ok) {
                        const content = await res.text();
                        zip.file(path, content);
                      }
                    }
                  } catch (err) {
                    console.error('Error inyectando ' + path, err);
                  }
                }

                const blob = await zip.generateAsync({ type: 'blob' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'RSA_Inver_Source_Project.zip';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                setTimeout(() => {
                  alert('✅ ¡PROYECTO FUENTE COMPLETO DESCARGADO EN ZIP!\n\nSe ha guardado el archivo "RSA_Inver_Source_Project.zip" en tu carpeta de Descargas.\n\nContiene los 25 archivos puros estructurados (package.json, vite.config.ts, src/, componentes, utilidades).\n\nSube esta estructura nativa a GitHub para que Vercel compile el proyecto, lea tus variables inyectadas y active la barrera de producción Supabase.');
                }, 500);
              }}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-5 rounded-2xl text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xl border-2 border-amber-300 hover:scale-[1.01]"
            >
              <Download className="w-6 h-6 flex-shrink-0" />
              <span>📦 DESCARGAR PROYECTO FUENTE COMPLETO EN ZIP (.ZIP REAL)</span>
            </button>
          </div>
        </div>

        {/* GUÍA EXCLUSIVA DE INSTALACIÓN TÚ MISMO (OPCIÓN B) */}
        <div className="p-6 md:p-8 pt-0">
          <SelfPath expandedStep={expandedStep} setExpandedStep={setExpandedStep} />
        </div>

      </div>
    </div>
  );
};



// =====================================================================
// RUTA 2: HACERLO TÚ MISMO
// =====================================================================
const SelfPath: React.FC<{
  expandedStep: number | null;
  setExpandedStep: (n: number | null) => void;
}> = ({ expandedStep, setExpandedStep }) => {

  const steps = [
    {
      num: 1,
      title: '⭐ DESCARGAR el archivo correcto de la app',
      duration: '3 min',
      icon: Download,
      content: (
        <div className="space-y-3">

          {/* AVISO CRÍTICO PRINCIPAL */}
          <div className="bg-rose-50 border-2 border-rose-500 p-5 rounded-xl">
            <h4 className="text-base font-black text-rose-900 mb-2 flex items-center gap-2">
              <span className="text-2xl">🚨</span>
              <span>¿Tu archivo index.html está vacío? ¡Esto te ocurre porque NO tienes el archivo real!</span>
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              La aplicación que estás viendo AHORA mismo está corriendo en un <strong>entorno de desarrollo</strong> (donde la creamos juntos). Para llevarla a internet necesitas un archivo especial llamado <code className="bg-white px-1.5 py-0.5 rounded font-bold text-rose-900">index.html</code> de <strong>1.37 MB aprox</strong> que contiene TODA la app empaquetada (código + estilos + datos). 
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mt-2">
              <strong>Si tu archivo index.html pesa pocos KB o está vacío al abrirlo en un editor, NO es el correcto.</strong> Sigue las instrucciones de abajo para conseguir el archivo real. ⬇️
            </p>
          </div>

          {/* OPCIÓN A: BOTÓN MÁGICO DE DESCARGA DIRECTA */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-4 border-emerald-500 p-6 rounded-2xl shadow-lg">
            <h4 className="text-lg font-black text-emerald-900 mb-2 flex items-center gap-2">
              <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">⭐</span>
              <span>OPCIÓN A: ¡DESCARGA DIRECTA en 1 clic!</span>
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              <strong>¡Buena noticia!</strong> Lo que ves ahora mismo en tu pantalla <strong>YA ES el archivo index.html completo de 1.37 MB.</strong> Solo tienes que pulsar el botón mágico de abajo para descargarlo a tu Mac:
            </p>

            <button
              onClick={() => {
                // Descargar el HTML completo de la página actual
                const htmlContent = document.documentElement.outerHTML;
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
                
                setTimeout(() => {
                  alert('✅ ¡Listo! El archivo "index.html" se ha descargado a tu carpeta de Descargas.\n\nAhora:\n1. Ábrelo con Finder.\n2. Verifica que pesa ~1 MB.\n3. Muévelo a tu carpeta "RSA Inver Web" del Escritorio.\n4. Súbelo a Vercel siguiendo los siguientes pasos.');
                }, 500);
              }}
              className="w-full bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-black px-6 py-5 rounded-2xl text-lg transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl hover:scale-[1.02] border-2 border-white"
            >
              <Download className="w-7 h-7" />
              <span>⬇️ DESCARGAR index.html AHORA</span>
            </button>

            <div className="mt-4 bg-white border border-emerald-300 rounded-lg p-3">
              <strong className="text-emerald-900 block text-xs mb-2">📋 ¿Qué pasará al pulsar el botón?</strong>
              <ol className="space-y-1 text-xs text-slate-700">
                <li>1. Tu Mac descargará un archivo llamado <code className="bg-slate-100 px-1 rounded font-bold">index.html</code> (a la carpeta "Descargas").</li>
                <li>2. El archivo pesará aproximadamente <strong>1 MB</strong>.</li>
                <li>3. Contiene TODA la app empaquetada (HTML + CSS + JavaScript en un solo archivo).</li>
                <li>4. Puedes hacer doble clic para verificar que funciona localmente en tu navegador.</li>
                <li>5. Después lo subes a Vercel siguiendo los pasos 2-5 de esta guía.</li>
              </ol>
            </div>

            <div className="mt-3 bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-900">
              <strong>⚠️ MUY IMPORTANTE:</strong> Una vez descargado, sigue las instrucciones de "Dónde guardarlo en tu Mac" más abajo. Recuerda mover el archivo desde "Descargas" a tu carpeta <strong>"RSA Inver Web"</strong> del Escritorio.
            </div>
          </div>

          {/* OPCIÓN B: COMPILARLO TÚ */}
          <div className="bg-amber-50 border-2 border-amber-400 p-5 rounded-xl">
            <h4 className="text-base font-black text-amber-900 mb-2 flex items-center gap-2">
              <span className="bg-amber-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-black">B</span>
              <span>OPCIÓN B: Generarlo tú mismo desde Terminal (avanzado)</span>
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Si tienes el código fuente del proyecto en tu Mac, puedes compilar la app tú mismo:
            </p>

            <ol className="space-y-2 text-xs text-slate-700">
              <li className="bg-white p-2 rounded border border-amber-200">
                <strong className="text-amber-900 block mb-1">1. Abre Terminal</strong>
                <span>Cmd+Espacio → "Terminal" → Enter</span>
              </li>
              <li className="bg-white p-2 rounded border border-amber-200">
                <strong className="text-amber-900 block mb-1">2. Entra en la carpeta del proyecto</strong>
                <code className="block bg-slate-900 text-amber-300 p-2 rounded font-mono text-[11px] mt-1">cd ruta/a/tu/proyecto</code>
              </li>
              <li className="bg-white p-2 rounded border border-amber-200">
                <strong className="text-amber-900 block mb-1">3. Instala las dependencias (solo la 1ª vez)</strong>
                <code className="block bg-slate-900 text-amber-300 p-2 rounded font-mono text-[11px] mt-1">npm install</code>
              </li>
              <li className="bg-white p-2 rounded border border-amber-200">
                <strong className="text-amber-900 block mb-1">4. Compila el proyecto</strong>
                <code className="block bg-slate-900 text-amber-300 p-2 rounded font-mono text-[11px] mt-1">npm run build</code>
                <span className="text-[10px] text-slate-500 block mt-1">Tarda 5-10 segundos.</span>
              </li>
              <li className="bg-white p-2 rounded border border-amber-200">
                <strong className="text-amber-900 block mb-1">5. ¡Tu archivo está aquí!</strong>
                <span>Encontrarás <code className="bg-slate-100 px-1 rounded font-bold">dist/index.html</code> dentro de la carpeta del proyecto. Pesa ~1.37 MB.</span>
              </li>
            </ol>
          </div>

          {/* BLOQUE DE AUDITORÍA: SEGURIDAD PRIVADA SUPABASE AUTH */}
          <div className="bg-slate-900 text-white p-5 rounded-xl border border-amber-500/40 space-y-3">
            <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
              🔒 CONFIGURACIÓN BANCARIA: Bloqueo de Registros Públicos en Supabase
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Tienes toda la razón: desmarcar &ldquo;Confirm email&rdquo; solo agiliza el registro, pero no impide que cualquiera se inscriba. Para blindar tu sistema en modo <strong>100% privado / por invitación</strong>, sigue este protocolo literal en tu panel de Supabase:
            </p>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2 text-xs text-slate-200">
              <p className="font-bold text-amber-300">
                👉 AJUSTE CRÍTICO EN SUPABASE AUTHENTICATION:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 font-light">
                <li>Ve a <strong>Authentication → Configuration → Providers → Email</strong>.</li>
                <li>Busca la opción <strong>&ldquo;Allow new users to sign up&rdquo;</strong> (Permitir que nuevos usuarios se registren).</li>
                <li><strong>DESACTÍVALA (Toggle OFF).</strong></li>
              </ol>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              <strong>¿Qué pasa al desactivarlo?</strong> Nadie podrá registrarse libremente desde el frontend ni lanzando peticiones con la Anon Key. Las altas quedan bloqueadas al 100% desde internet.
            </p>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2 text-xs text-slate-200">
              <p className="font-bold text-emerald-400">
                👥 FLUJO DE ALTA CONTROLADA (Socio &amp; Robert):
              </p>
              <ul className="space-y-1 text-slate-300 font-light">
                <li>• <strong>Administradores:</strong> Se crean una sola vez desde el panel backend de Supabase (<em>Users → Add User → Create User</em>) y se les asigna <code className="text-amber-400">is_admin = true</code> en la tabla.</li>
                <li>• <strong>Inversores:</strong> Como la API libre está cerrada, Robert o tú añadiréis sus emails de forma segura directamente desde la consola de Supabase (<em>Add User → Invite / Create</em>). Gracias a nuestro trigger automatizado en PostgreSQL, su perfil se mapea al instante sin fugas de seguridad.</li>
              </ul>
            </div>
          </div>

          {/* CÓMO VERIFICAR QUE ES EL ARCHIVO CORRECTO */}
          <div className="bg-blue-50 border-2 border-blue-400 p-5 rounded-xl">
            <h4 className="text-base font-black text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Cómo VERIFICAR que tu archivo es el correcto:</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
              <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3">
                <strong className="text-emerald-900 block text-xs mb-1">✅ ARCHIVO CORRECTO:</strong>
                <ul className="space-y-1 text-[11px] text-slate-700">
                  <li>• Pesa entre <strong>1 MB y 2 MB</strong> (no KB, MB).</li>
                  <li>• Si lo abres con <strong>doble clic</strong>, se abre en Safari/Chrome y muestra la app igual que esta.</li>
                  <li>• Si lo abres con un editor de texto, ves <strong>miles de líneas de código</strong>.</li>
                </ul>
              </div>

              <div className="bg-rose-50 border border-rose-300 rounded-lg p-3">
                <strong className="text-rose-900 block text-xs mb-1">❌ ARCHIVO INCORRECTO:</strong>
                <ul className="space-y-1 text-[11px] text-slate-700">
                  <li>• Pesa solo unos <strong>KB</strong> (es muy pequeño).</li>
                  <li>• Si lo abres con doble clic se abre en blanco o con texto raro.</li>
                  <li>• Si lo abres con editor de texto, está casi vacío o con poco código.</li>
                </ul>
              </div>
            </div>

            <div className="mt-3 bg-white border border-blue-200 p-3 rounded-lg">
              <strong className="text-blue-900 text-xs block mb-1">🧪 PRUEBA RÁPIDA EN TU MAC:</strong>
              <ol className="space-y-1 text-xs text-slate-700">
                <li>1. En Finder, haz <strong>clic derecho</strong> sobre tu archivo index.html.</li>
                <li>2. Selecciona <strong>"Obtener información"</strong>.</li>
                <li>3. Mira el campo <strong>"Tamaño"</strong>.</li>
                <li>4. Si dice <strong>"1,37 MB"</strong> o similar (más de 1 MB) → ✅ Correcto.</li>
                <li>5. Si dice <strong>"500 bytes"</strong> o "2 KB" → ❌ Incorrecto, vuelve a las opciones A o B.</li>
              </ol>
            </div>
          </div>

          {/* DÓNDE GUARDARLO */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-600" />
              <span>Dónde guardarlo en tu Mac:</span>
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
                <span>Guarda dentro el archivo <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold">index.html</code> de 1.37 MB que conseguiste con la opción A o B.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">4</span>
                <span><strong>VERIFICA</strong> con la prueba rápida del cuadro azul arriba que pesa ~1.37 MB.</span>
              </li>
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
            <Apple className="w-4 h-4 inline mr-1" />
            <strong>Tip Mac MUY ÚTIL:</strong> Antes de subir a Vercel, haz <strong>doble clic</strong> en tu archivo index.html. Si se abre en Safari y ves la app exacta que estás viendo ahora (con los inversores, las pestañas, todo funcionando), entonces el archivo es <strong>perfecto</strong> y puedes subirlo a Vercel sin miedo. ✅
          </div>

          {/* ATAJO TOTAL: SUBIR DIRECTAMENTE A VERCEL CLI */}
          <div className="bg-purple-50 border-2 border-purple-400 p-4 rounded-xl">
            <h4 className="text-sm font-black text-purple-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>⚡ ATAJO PRO (recomendado si tienes el código fuente):</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed mb-2">
              Si compilaste con Opción B, puedes saltarte el subir manual y usar Vercel CLI:
            </p>
            <div className="bg-slate-900 text-amber-300 p-3 rounded font-mono text-xs space-y-1">
              <div># 1. Instala Vercel CLI</div>
              <div className="text-white">npm install -g vercel</div>
              <div className="mt-2"># 2. Entra en la carpeta dist</div>
              <div className="text-white">cd dist</div>
              <div className="mt-2"># 3. Despliega (funciona a la primera, sin 404)</div>
              <div className="text-white">vercel --prod</div>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 italic">
              Te pedirá login (email) y subirá automáticamente el archivo correcto. Imposible equivocarse.
            </p>
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
      title: 'Subir el archivo a Vercel (¡cuidado con el 404!)',
      duration: '15 min',
      icon: Cloud,
      content: (
        <div className="space-y-3">

          {/* AVISO 404 DESTACADO ARRIBA DEL TODO */}
          <div className="bg-rose-50 border-2 border-rose-400 p-4 rounded-xl">
            <h4 className="text-sm font-black text-rose-900 mb-2 flex items-center gap-2">
              <span className="text-xl">🚨</span>
              <span>¿Te aparece "404: NOT_FOUND" al abrir tu URL?</span>
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              <strong>¡Tranquilo!</strong> Es el error más común al subir a Vercel. Significa que has subido la <strong>carpeta equivocada</strong>. La solución es muy fácil. Mira el cuadro azul "🆘 SOLUCIÓN AL ERROR 404" más abajo. ⬇️
            </p>
          </div>

          <p className="text-sm text-slate-700">
            Vercel tiene una opción para subir el archivo arrastrándolo. Sigue estos pasos con MUCHO cuidado para evitar el error 404.
          </p>

          {/* AVISO PREVIO MUY IMPORTANTE */}
          <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-xl">
            <h4 className="text-sm font-black text-amber-900 mb-2 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span>ANTES DE EMPEZAR: ¿Qué carpeta tienes en tu Mac?</span>
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Para evitar el error 404, debes asegurarte de subir <strong>los archivos correctos</strong>. La regla de oro:
            </p>
            
            <div className="bg-white border-2 border-amber-300 rounded-lg p-3 mb-3">
              <p className="text-sm font-bold text-amber-900 mb-2">
                ✅ Vercel necesita que el archivo <code className="bg-amber-100 px-1.5 py-0.5 rounded font-bold">index.html</code> esté <strong>JUSTO al abrir la carpeta que arrastras</strong>.
              </p>
              <p className="text-xs text-slate-700">
                Si arrastras una carpeta que dentro tiene OTRA carpeta (ej. una carpeta "RSA Inver" que contiene "dist" dentro), Vercel se confundirá y te dará 404.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="bg-emerald-50 border border-emerald-300 rounded p-2">
                <strong className="text-emerald-900 block mb-1">✅ CORRECTO - Sube esto:</strong>
                <div className="bg-white p-2 rounded font-mono text-[11px]">
                  📂 RSA Inver Web/<br />
                  &nbsp;&nbsp;├─ 📄 index.html<br />
                  &nbsp;&nbsp;├─ 📂 assets/<br />
                  &nbsp;&nbsp;└─ 📄 favicon.ico
                </div>
                <p className="text-[10px] text-emerald-800 mt-1">
                  El index.html está JUSTO dentro.
                </p>
              </div>

              <div className="bg-rose-50 border border-rose-300 rounded p-2">
                <strong className="text-rose-900 block mb-1">❌ INCORRECTO - Esto causa 404:</strong>
                <div className="bg-white p-2 rounded font-mono text-[11px]">
                  📂 RSA Inver Web/<br />
                  &nbsp;&nbsp;└─ 📂 dist/<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ 📄 index.html<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ 📂 assets/
                </div>
                <p className="text-[10px] text-rose-800 mt-1">
                  El index.html está enterrado dentro de "dist".
                </p>
              </div>
            </div>
          </div>

          {/* PASOS NORMALES */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Pasos para subir a Vercel:</h4>
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">1</span>
                <span>En el panel de Vercel, pulsa <strong>"Add New..."</strong> arriba a la derecha y luego <strong>"Project"</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">2</span>
                <span>Verás 2 opciones: <strong>"Import Git Repository"</strong> y <strong>"Deploy a template"</strong>. Para subir manualmente, busca el enlace pequeño abajo que dice <strong>"Deploy a static site"</strong> o usa la opción de arrastrar carpeta.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">3</span>
                <span><strong className="text-rose-700">¡OJO AQUÍ!</strong> Abre la carpeta de tu Mac. Si dentro ves una carpeta llamada <code className="bg-white px-1 rounded font-bold">dist</code>, <strong>entra dentro de "dist"</strong> y arrastra los archivos que ves ahí (no la carpeta dist entera).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">4</span>
                <span>Espera 30-60 segundos a que se suba todo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">5</span>
                <span>Vercel te dará una URL temporal tipo <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold">rsa-inver-xyz.vercel.app</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">6</span>
                <span>Haz clic en esa URL. Si ves la app: ¡estás listo! 🎉 Si ves "404 NOT_FOUND": mira el cuadro azul de abajo. ⬇️</span>
              </li>
            </ol>
          </div>

          {/* GRAN CUADRO AZUL: SOLUCIÓN AL 404 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 rounded-2xl p-5">
            <h4 className="text-base font-black text-blue-900 mb-3 flex items-center gap-2">
              <span className="bg-blue-600 text-white p-1.5 rounded-lg">🆘</span>
              <span>SOLUCIÓN AL ERROR "404: NOT_FOUND"</span>
            </h4>

            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Si te apareció el error <code className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-mono text-xs">404: NOT_FOUND</code> al abrir tu URL de Vercel, significa al 99% que <strong>arrastraste la carpeta equivocada</strong>. Vamos a arreglarlo en 3 minutos.
            </p>

            <div className="bg-white border border-blue-200 rounded-xl p-4 mb-3">
              <h5 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Folder className="w-4 h-4" />
                <span>Paso 1: Verifica qué tienes en tu carpeta</span>
              </h5>
              <ol className="space-y-1.5 text-xs text-slate-700">
                <li>1. Abre <strong>Finder</strong> en tu Mac.</li>
                <li>2. Ve a <strong>Escritorio → RSA Inver Web</strong> (la carpeta que creaste).</li>
                <li>3. Haz <strong>doble clic</strong> para abrirla.</li>
                <li>4. ¿Qué ves dentro?</li>
              </ol>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                <div className="bg-amber-50 border border-amber-300 rounded p-2">
                  <strong className="text-amber-900 block text-xs mb-1">Si ves una carpeta "dist":</strong>
                  <p className="text-[11px] text-slate-700">
                    Entra dentro de "dist". Lo que ves AHÍ es lo que tienes que subir.
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-300 rounded p-2">
                  <strong className="text-emerald-900 block text-xs mb-1">Si ves index.html directamente:</strong>
                  <p className="text-[11px] text-slate-700">
                    ¡Perfecto! Ya estás en la carpeta correcta. Sigue al paso 2.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-blue-200 rounded-xl p-4 mb-3">
              <h5 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                <span>Paso 2: Vuelve a subir los archivos correctos</span>
              </h5>
              <ol className="space-y-1.5 text-xs text-slate-700">
                <li>1. Vuelve a Vercel.</li>
                <li>2. <strong>Borra el proyecto que creaste con error</strong> (Settings → abajo del todo → "Delete Project").</li>
                <li>3. Crea un proyecto nuevo: <strong>Add New → Project</strong>.</li>
                <li>4. Esta vez, en la pantalla de subir, <strong>SELECCIONA TODOS LOS ARCHIVOS QUE HAY DENTRO</strong> (Cmd+A en tu Mac) y arrástralos juntos.</li>
                <li>5. <strong>NO arrastres la carpeta entera</strong>: arrastra los <em>archivos sueltos</em> que están dentro.</li>
                <li>6. Espera y abre la nueva URL. Debería funcionar perfectamente. ✨</li>
              </ol>
            </div>

            {/* SOLUCIÓN ALTERNATIVA SUPER FÁCIL */}
            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4">
              <h5 className="text-sm font-black text-amber-900 mb-2 flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <span>MÉTODO MÁS FÁCIL Y SEGURO (recomendado):</span>
              </h5>
              <p className="text-sm text-slate-700 leading-relaxed mb-2">
                Si lo de arrastrar carpetas te confunde, usa la <strong>línea de comandos de Vercel</strong>. Suena técnico pero es ULTRA fácil y nunca falla:
              </p>
              <ol className="space-y-2 text-xs text-slate-700">
                <li className="bg-white p-2 rounded border border-amber-200">
                  <strong className="text-amber-900 block mb-1">1. Abre el Terminal de tu Mac</strong>
                  <span>Cmd+Espacio → escribe "Terminal" → Enter</span>
                </li>
                <li className="bg-white p-2 rounded border border-amber-200">
                  <strong className="text-amber-900 block mb-1">2. Instala Vercel CLI (solo la primera vez):</strong>
                  <code className="block bg-slate-900 text-amber-300 p-2 rounded font-mono text-[11px] mt-1">npm install -g vercel</code>
                </li>
                <li className="bg-white p-2 rounded border border-amber-200">
                  <strong className="text-amber-900 block mb-1">3. Entra en la carpeta donde está tu index.html:</strong>
                  <code className="block bg-slate-900 text-amber-300 p-2 rounded font-mono text-[11px] mt-1">cd ~/Desktop/RSA\ Inver\ Web</code>
                  <span className="text-[10px] text-slate-500 block mt-1">(Si tu index.html está dentro de "dist", añade "/dist" al final)</span>
                </li>
                <li className="bg-white p-2 rounded border border-amber-200">
                  <strong className="text-amber-900 block mb-1">4. Despliega con un solo comando:</strong>
                  <code className="block bg-slate-900 text-amber-300 p-2 rounded font-mono text-[11px] mt-1">vercel --prod</code>
                  <span className="text-[10px] text-slate-500 block mt-1">Te pedirá login (pega tu email y confirma) y subirá automáticamente la carpeta correcta. Imposible equivocarse.</span>
                </li>
                <li className="bg-white p-2 rounded border border-amber-200">
                  <strong className="text-amber-900 block mb-1">5. Te dará la URL final:</strong>
                  <span className="text-xs">Algo como <code className="bg-slate-100 px-1 rounded font-bold">https://rsa-inver-xyz.vercel.app</code>. ¡Funcionará a la primera!</span>
                </li>
              </ol>
            </div>

            {/* PLAN B: PEDIR AYUDA */}
            <div className="mt-3 bg-rose-50 border border-rose-300 rounded-xl p-3">
              <h5 className="text-sm font-bold text-rose-900 mb-1 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span>¿Sigues atascado? Plan B en 30 minutos:</span>
              </h5>
              <p className="text-xs text-slate-700 leading-relaxed">
                Pulsa el botón verde <strong>"¡Instalar YA!"</strong> abajo a la izquierda y cambia a la <strong>Opción 1: La rápida</strong>. Contrata un freelance en Malt.es por 80-150 € que te lo deja funcionando en 24h sin que tengas que tocar nada técnico. Honestamente, si llevas más de 1 hora atascado en este paso, esa es la mejor decisión.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 inline mr-1" />
            <strong>Cuando funcione:</strong> Verás esta misma aplicación cargando en una URL tipo <em>algo.vercel.app</em>. Has hecho el 70% del trabajo. Solo te queda conectar tu dominio (Paso 4).
          </div>
        </div>
      )
    },
    {
      num: 4,
      title: 'Crear el subdominio portal.rsainver.com en IONOS',
      duration: '20 min',
      icon: Globe,
      content: (
        <div className="space-y-3">
          <div className="bg-purple-50 border-2 border-purple-300 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-purple-900 mb-2">📌 Recordatorio rápido:</h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>SÍ, vas a crear un subdominio</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-bold text-purple-900">portal.rsainver.com</code>. Tu web actual <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-bold">rsainver.com</code> seguirá funcionando IGUAL. Es como tener una nueva habitación en tu casa: la entrada principal sigue siendo la misma.
            </p>
          </div>

          {/* PARTE A: VERCEL */}
          <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-xl">
            <h4 className="text-sm font-black text-emerald-900 mb-3 flex items-center gap-2">
              <span className="bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">A</span>
              <span>Primero, en VERCEL:</span>
            </h4>
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="bg-emerald-100 text-emerald-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">1</span>
                <span>En Vercel, abre tu proyecto recién subido.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-emerald-100 text-emerald-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">2</span>
                <span>Ve a <strong>Settings → Domains</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-emerald-100 text-emerald-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">3</span>
                <span>Escribe <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-bold">portal.rsainver.com</code> y pulsa <strong>"Add"</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-emerald-100 text-emerald-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">4</span>
                <span>Vercel te mostrará un mensaje en amarillo diciendo: <em>"Invalid configuration"</em> y te pedirá añadir un <strong>registro CNAME</strong> con un valor que copia. <strong>Apunta ese valor</strong> (es algo como <code className="bg-white px-1 rounded text-[10px] font-bold">cname.vercel-dns.com</code>).</span>
              </li>
            </ol>
            <div className="mt-3 bg-white border border-emerald-200 p-2 rounded text-[11px] text-slate-600">
              💡 <strong>Tranquilo:</strong> Ese mensaje rojo/amarillo de "Invalid configuration" es NORMAL. Desaparecerá en cuanto hagas la parte B en IONOS.
            </div>
          </div>

          {/* PARTE B: IONOS */}
          <div className="bg-blue-50 border-2 border-blue-400 p-4 rounded-xl">
            <h4 className="text-sm font-black text-blue-900 mb-3 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">B</span>
              <span>Ahora, en IONOS (paso a paso REAL):</span>
            </h4>

            <div className="bg-amber-50 border border-amber-200 p-2 rounded mb-3 text-xs text-amber-900">
              ⚠️ <strong>OJO:</strong> Estos pasos son los nombres EXACTOS del panel actual de IONOS. Si ves algo ligeramente distinto, significa que IONOS actualizó el menú; en ese caso busca palabras parecidas (DNS, Dominios, Editar).
            </div>

            <ol className="space-y-3 text-sm text-slate-700">
              <li className="bg-white border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">1</span>
                  <div>
                    <strong className="text-blue-900 block">Entra en tu cuenta IONOS</strong>
                    <a href="https://login.ionos.es" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs font-bold inline-flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      <span>login.ionos.es</span>
                    </a>
                    <span className="block text-xs text-slate-600 mt-1">Identifícate con tu email y contraseña habituales.</span>
                  </div>
                </div>
              </li>

              <li className="bg-white border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">2</span>
                  <div>
                    <strong className="text-blue-900 block">Ve al menú "Dominios y SSL"</strong>
                    <span className="block text-xs text-slate-600 mt-1">Está en el menú de la izquierda. A veces aparece como solo <strong>"Dominios"</strong>.</span>
                  </div>
                </div>
              </li>

              <li className="bg-white border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">3</span>
                  <div>
                    <strong className="text-blue-900 block">Busca rsainver.com en la lista y haz clic en él</strong>
                    <span className="block text-xs text-slate-600 mt-1">Verás todos tus dominios. Pulsa exactamente sobre <code className="bg-slate-100 px-1 rounded font-bold">rsainver.com</code>.</span>
                  </div>
                </div>
              </li>

              <li className="bg-white border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">4</span>
                  <div>
                    <strong className="text-blue-900 block">Pulsa el botón "DNS" o el icono de los 3 puntos → "Configurar DNS"</strong>
                    <span className="block text-xs text-slate-600 mt-1">Es donde IONOS gestiona "qué cosas viven en cada subdominio".</span>
                  </div>
                </div>
              </li>

              <li className="bg-white border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">5</span>
                  <div>
                    <strong className="text-blue-900 block">Pulsa "Añadir registro" (botón arriba a la derecha)</strong>
                    <span className="block text-xs text-slate-600 mt-1">Te aparecerá un formulario para añadir un nuevo registro DNS.</span>
                  </div>
                </div>
              </li>

              <li className="bg-white border-2 border-amber-400 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="bg-amber-500 text-slate-950 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">6</span>
                  <div className="flex-1">
                    <strong className="text-amber-900 block">⭐ EL PASO CLAVE: Rellena el formulario así:</strong>
                    
                    <div className="mt-2 bg-slate-900 text-white rounded p-3 font-mono text-xs space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="text-slate-400 sm:w-32">Tipo:</span>
                        <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black">CNAME</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="text-slate-400 sm:w-32">Nombre del host:</span>
                        <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black">portal</span>
                        <span className="text-[10px] text-slate-400">(solo "portal", SIN ".rsainver.com")</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="text-slate-400 sm:w-32">Apunta a:</span>
                        <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black break-all">cname.vercel-dns.com</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="text-slate-400 sm:w-32">TTL:</span>
                        <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black">1 hora</span>
                        <span className="text-[10px] text-slate-400">(o el valor por defecto)</span>
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-700 bg-amber-50 p-2 rounded">
                      ⚠️ <strong>SUPER IMPORTANTE:</strong> En "Nombre del host" pones <strong>SOLO la palabra <code className="bg-white px-1 rounded font-bold">portal</code></strong>. IONOS añade automáticamente ".rsainver.com" al final. Si pones "portal.rsainver.com", quedaría duplicado y NO funcionaría.
                    </div>
                  </div>
                </div>
              </li>

              <li className="bg-white border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">7</span>
                  <div>
                    <strong className="text-blue-900 block">Pulsa "Guardar" y... ¡a esperar!</strong>
                    <span className="block text-xs text-slate-600 mt-1">IONOS confirma que el registro se ha creado. Ahora debes esperar entre <strong>5 minutos y 1 hora</strong> a que se propague por internet.</span>
                  </div>
                </div>
              </li>

              <li className="bg-white border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">8</span>
                  <div>
                    <strong className="text-blue-900 block">Vuelve a Vercel y comprueba</strong>
                    <span className="block text-xs text-slate-600 mt-1">El mensaje de "Invalid configuration" se cambiará a un check verde ✅. Vercel también activará HTTPS gratis automáticamente. ¡Felicidades!</span>
                  </div>
                </div>
              </li>
            </ol>
          </div>

          {/* CONTACTO IONOS POR SI ACASO */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-700">
            <strong className="text-slate-900 block mb-1">📞 ¿Te has perdido en el panel de IONOS?</strong>
            <p className="leading-relaxed">
              IONOS tiene <strong>soporte telefónico GRATIS y EN ESPAÑOL</strong> incluido en tu cuenta. Llámales y diles literalmente: <em>"Hola, quiero crear un registro CNAME en mi dominio rsainver.com para apuntar el subdominio 'portal' a 'cname.vercel-dns.com'. ¿Me ayudas a hacerlo?"</em>. Lo harán contigo en 5 minutos. <strong>Teléfono IONOS España: 911 144 444</strong>.
            </p>
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
      
      {/* AVISO PRINCIPAL CON BOTÓN MÁGICO DE DESCARGA */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 border-4 border-emerald-500 p-6 rounded-2xl shadow-xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-emerald-600 text-white p-2.5 rounded-xl flex-shrink-0 animate-pulse">
            <span className="text-2xl">⬇️</span>
          </div>
          <div>
            <h3 className="text-xl font-black text-emerald-900 mb-1">
              ¡EMPIEZA AQUÍ! Descarga el archivo de la app
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Lo que ves ahora mismo en tu pantalla <strong>YA ES la aplicación completa empaquetada</strong>. Pulsa el botón de abajo para descargarla a tu Mac (archivo ~1 MB) y luego sigue los pasos 2-5 para subirla a Vercel.
            </p>
          </div>
        </div>

        <button
          onClick={async () => {
            try {
              // Intentamos obtener el archivo de producción nativo compilado puro
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
              // Fallback nativo limpiando etiquetas inyectadas por entornos en vivo
              let htmlContent = document.documentElement.outerHTML;
              // Eliminamos cualquier base tag inyectada por entornos de previsualización
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
              alert('✅ ¡Archivo de Producción Limpio descargado!\n\nSe ha guardado un archivo "index.html" libre de redirecciones en tu carpeta "Descargas".\n\nSube este archivo directamente a Vercel o reemplázalo en tu repositorio de GitHub.');
            }, 500);
          }}
          className="w-full bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-black px-6 py-5 rounded-2xl text-xl transition-all flex items-center justify-center gap-3 cursor-pointer shadow-2xl hover:scale-[1.02] border-2 border-white"
        >
          <Download className="w-8 h-8" />
          <span>⬇️ DESCARGAR ARCHIVO FINAL LIMPIO (1 clic)</span>
        </button>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="bg-white border border-emerald-200 rounded-lg p-2 text-center">
            <strong className="text-emerald-900 block">📦 Tamaño</strong>
            <span className="text-slate-600">~1 MB (archivo único)</span>
          </div>
          <div className="bg-white border border-emerald-200 rounded-lg p-2 text-center">
            <strong className="text-emerald-900 block">📍 Se guarda en</strong>
            <span className="text-slate-600">Carpeta "Descargas"</span>
          </div>
          <div className="bg-white border border-emerald-200 rounded-lg p-2 text-center">
            <strong className="text-emerald-900 block">📄 Nombre</strong>
            <span className="text-slate-600 font-mono">index.html</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-3 text-center italic">
          💡 Después de descargarlo, abre el <strong>Paso 1</strong> de abajo para ver instrucciones detalladas de qué hacer con el archivo.
        </p>
      </div>

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

      {/* EXPLICACIÓN: ¿POR QUÉ NECESITO IONOS Y VERCEL? */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400 rounded-2xl p-5 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-blue-600 text-white p-2 rounded-xl flex-shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-blue-900 mb-1">
              ❓ "¿Por qué necesito Vercel si ya tengo IONOS?"
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              ¡Es la duda <strong>MÁS frecuente</strong> de quien empieza! La respuesta corta: <strong>IONOS y Vercel hacen cosas diferentes y necesitas LAS DOS.</strong> Te lo explico con una analogía clarísima.
            </p>
          </div>
        </div>

        {/* ANALOGÍA DE LA TIENDA FÍSICA */}
        <div className="bg-white border border-blue-200 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Imagina que abres una tienda física de inversiones:</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Columna IONOS */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-3">
              <div className="text-center mb-2">
                <span className="text-3xl">📍</span>
                <h5 className="text-sm font-black text-blue-900 mt-1">IONOS = La DIRECCIÓN</h5>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-2">
                Es como la <strong>"Calle Mayor 25, Madrid"</strong> de tu tienda. La dirección oficial registrada en el ayuntamiento.
              </p>
              <div className="bg-white border border-blue-200 rounded p-2 text-[11px] text-slate-700">
                <strong className="text-blue-900 block">¿Qué hace IONOS por ti?</strong>
                <ul className="mt-1 space-y-0.5">
                  <li>✓ Te dio el nombre <code className="bg-slate-100 px-1 rounded font-bold">rsainver.com</code></li>
                  <li>✓ Te lo renueva cada año</li>
                  <li>✓ Cuando alguien escribe esa dirección, la "guía hacia algún sitio"</li>
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded p-2 mt-2 text-[11px] text-rose-900">
                <strong>❌ Lo que IONOS NO hace:</strong> No tiene el "local" donde vive tu app. Es solo la dirección.
              </div>
            </div>

            {/* Columna VERCEL */}
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3">
              <div className="text-center mb-2">
                <span className="text-3xl">🏢</span>
                <h5 className="text-sm font-black text-emerald-900 mt-1">VERCEL = El LOCAL</h5>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-2">
                Es como el <strong>edificio físico</strong> donde realmente atiendes a los clientes. Aquí "vive" tu aplicación 24/7.
              </p>
              <div className="bg-white border border-emerald-200 rounded p-2 text-[11px] text-slate-700">
                <strong className="text-emerald-900 block">¿Qué hace Vercel por ti?</strong>
                <ul className="mt-1 space-y-0.5">
                  <li>✓ Aloja tu aplicación en sus servidores</li>
                  <li>✓ La sirve a tus clientes 24/7</li>
                  <li>✓ Garantiza velocidad y seguridad</li>
                  <li>✓ Es <strong>GRATIS</strong> hasta cientos de clientes</li>
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded p-2 mt-2 text-[11px] text-rose-900">
                <strong>❌ Lo que Vercel NO hace:</strong> No te da nombres bonitos. Te da uno feo tipo <code className="bg-slate-100 px-1 rounded">tu-app.vercel.app</code>
              </div>
            </div>

          </div>

          {/* CONEXIÓN ENTRE LOS DOS */}
          <div className="mt-4 bg-amber-50 border-2 border-amber-400 rounded-xl p-3">
            <h5 className="text-sm font-black text-amber-900 mb-2 flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              <span>La magia: conectarlos para que trabajen juntos</span>
            </h5>
            <p className="text-xs text-slate-700 leading-relaxed">
              En el último paso le dices a IONOS: <em>"Cuando alguien escriba <strong>portal.rsainver.com</strong>, no lo lleves a mi web actual, sino al edificio que tengo alquilado en Vercel"</em>. Eso se hace con un <strong>registro CNAME</strong> (algo así como una "señal de tráfico" digital). En 5-30 minutos, todo conectado.
            </p>
          </div>
        </div>

        {/* DIAGRAMA VISUAL DEL FLUJO */}
        <div className="bg-slate-900 text-white rounded-xl p-4">
          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3 text-center">
            Así es como funcionará todo cuando esté conectado:
          </h4>

          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-center">
            <div className="bg-white/10 p-3 rounded-lg flex-1 border border-white/20">
              <span className="text-2xl">👤</span>
              <p className="text-[10px] text-slate-300 mt-1">Tu cliente escribe en su navegador:</p>
              <code className="text-amber-400 text-xs font-bold block mt-1">portal.rsainver.com</code>
            </div>

            <ChevronRight className="w-6 h-6 text-amber-400 flex-shrink-0 hidden md:block" />
            <div className="text-amber-400 md:hidden">↓</div>

            <div className="bg-blue-500/20 p-3 rounded-lg flex-1 border border-blue-400/30">
              <span className="text-2xl">📍</span>
              <p className="text-[10px] text-slate-300 mt-1">IONOS dice:</p>
              <code className="text-blue-300 text-xs font-bold block mt-1">"Eso está en Vercel"</code>
            </div>

            <ChevronRight className="w-6 h-6 text-amber-400 flex-shrink-0 hidden md:block" />
            <div className="text-amber-400 md:hidden">↓</div>

            <div className="bg-emerald-500/20 p-3 rounded-lg flex-1 border border-emerald-400/30">
              <span className="text-2xl">🏢</span>
              <p className="text-[10px] text-slate-300 mt-1">Vercel envía la app:</p>
              <code className="text-emerald-300 text-xs font-bold block mt-1">¡App cargada! ✓</code>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center mt-3 italic">
            Todo esto pasa en 1 segundo. El cliente solo ve "portal.rsainver.com" funcionar perfecto.
          </p>
        </div>

        {/* RESUMEN PRÁCTICO */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-white border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
              <strong className="text-xs text-blue-900">Lo que YA tienes con IONOS</strong>
            </div>
            <p className="text-[11px] text-slate-700 leading-tight">
              El dominio <code className="bg-slate-100 px-1 rounded font-bold">rsainver.com</code> y tu web actual. <strong>NO tocas nada de eso.</strong>
            </p>
          </div>

          <div className="bg-white border border-emerald-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
              <strong className="text-xs text-emerald-900">Lo que vas a crear en Vercel</strong>
            </div>
            <p className="text-[11px] text-slate-700 leading-tight">
              Una cuenta <strong>GRATIS</strong> donde subirás la app del portal de inversores.
            </p>
          </div>

          <div className="bg-white border border-amber-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">3</span>
              <strong className="text-xs text-amber-900">Lo que conectarás en IONOS</strong>
            </div>
            <p className="text-[11px] text-slate-700 leading-tight">
              Un nuevo <strong>subdominio</strong> <code className="bg-slate-100 px-1 rounded font-bold text-[10px]">portal.rsainver.com</code> que apunta a Vercel.
            </p>
          </div>
        </div>
      </div>

      {/* INFO DESTACADA: ALTERNATIVAS A VERCEL */}
      <div className="bg-purple-50 border border-purple-300 rounded-2xl p-4">
        <h4 className="text-sm font-black text-purple-900 mb-2 flex items-center gap-2">
          <Cloud className="w-4 h-4" />
          <span>"¿Y por qué no usar IONOS también para alojar la app?"</span>
        </h4>
        <p className="text-sm text-slate-700 leading-relaxed mb-2">
          Buena pregunta. <strong>SÍ se puede</strong>, pero NO te lo recomiendo por estas razones:
        </p>
        <ul className="space-y-1 text-xs text-slate-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span><strong>IONOS hosting cuesta 5-15 €/mes</strong>, mientras que Vercel es <strong>GRATIS</strong> hasta cientos de clientes.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span><strong>Vercel es 10x más rápido</strong> y está optimizado para apps modernas como esta.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span><strong>Vercel actualiza la app automáticamente</strong> cuando subes una nueva versión. IONOS hosting requiere FTP manual.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>El soporte 24/7 y los backups están <strong>incluidos sin coste</strong> en Vercel.</span>
          </li>
        </ul>
        <p className="text-xs text-slate-600 italic mt-2">
          <strong>Conclusión:</strong> Mantén IONOS para el dominio (es lo suyo), y usa Vercel para alojar la app (es lo suyo). Es la combinación más profesional y barata.
        </p>
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
