import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  Trophy, 
  Sparkles, 
  ArrowRight,
  Lightbulb,
  Smartphone,
  Users,
  RotateCcw,
  Eye,
  PartyPopper,
  Coffee,
  ClipboardCheck,
  Award,
  Zap
} from 'lucide-react';

interface TestStep {
  id: string;
  text: string;
  detail?: string;
  whereToClick?: string;
  expectedResult?: string;
}

interface TestScenario {
  id: string;
  title: string;
  emoji: string;
  duration: string;
  description: string;
  color: string;
  steps: TestStep[];
}

const SCENARIOS: TestScenario[] = [
  {
    id: 'scenario-1',
    title: 'Escenario 1: Soy el equipo de RSA Inver',
    emoji: '💼',
    duration: '5 min',
    description: 'Te pondrás en la piel de tu equipo comercial. Crearás un nuevo cliente inversor, le asignarás un piso de inversión y simularás el progreso de la operación.',
    color: 'amber',
    steps: [
      {
        id: 's1-1',
        text: 'Asegúrate de estar en el modo "Personal RSA Inver (Admin)"',
        detail: 'Mira en la cabecera (parte superior negra). Verás dos botones grandes: "Personal RSA Inver (Admin)" en dorado, y "Portal del Inversor" en azul.',
        whereToClick: 'Cabecera negra superior',
        expectedResult: 'El botón dorado "Personal RSA Inver" debe estar resaltado.'
      },
      {
        id: 's1-2',
        text: 'Ve a la pestaña "Gestión de Operaciones"',
        detail: 'Justo debajo de los botones de rol verás la barra de pestañas. Pulsa la primera.',
        whereToClick: 'Barra de pestañas superior',
        expectedResult: 'Deberías ver el formulario "Dar de Alta a Cliente Inversor".'
      },
      {
        id: 's1-3',
        text: 'Da de alta a un nuevo inversor de prueba: TÚ MISMO',
        detail: 'En el panel izquierdo, escribe estos datos:\n• Usuario: tu_nombre\n• Clave: 1234\n• Empresa: Mi Inversora SL\n• Nombre completo: Tu Nombre Completo\n• Email: tu@email.com\n• Teléfono: tu número\n\nLuego pulsa "Generar Credenciales & Inversor".',
        whereToClick: 'Panel izquierdo "1. Dar de Alta a Cliente Inversor"',
        expectedResult: 'Aparecerá un mensaje de confirmación. Tu nombre aparecerá en la lista de inversores.'
      },
      {
        id: 's1-4',
        text: 'Asígnate un piso de inversión a ti mismo',
        detail: 'En el panel derecho ("2. Registrar Oferta"):\n• Selecciona TU usuario en el desplegable.\n• Título: "Piso C/ Mayor 25, Madrid - 3 hab"\n• Banco: Aliseda Inmobiliaria\n• Importe ofertado: 175000\n• Precio salida: 220000\n• Fase inicial: "1. Oferta Enviada al Banco"\n• Notas: "Lanzada al asset manager José García"',
        whereToClick: 'Panel derecho "2. Registrar Oferta"',
        expectedResult: 'Aparecerá la nueva ficha del piso en la sección de "Gestión Activa de Operaciones" abajo.'
      },
      {
        id: 's1-5',
        text: 'Cambia la fase de TU expediente: Ofértala como aceptada',
        detail: 'Busca tu nuevo piso en la lista de operaciones (el que acabas de crear). En el desplegable "Cambiar Fase del Activo", selecciona "2. Oferta Aceptada en Precio".',
        whereToClick: 'Desplegable de Fase de tu nueva operación',
        expectedResult: '🎉 Aparecerá un toast verde en la esquina superior derecha avisando que se ha enviado un email + WhatsApp automático al cliente. La campanita 🔔 mostrará un nuevo aviso.'
      },
      {
        id: 's1-6',
        text: 'Añade una documentación que falta',
        detail: 'En la misma ficha, en la sección "Documentación para la compra requerida", escribe en el campo de texto: "DNI compulsado del titular" y pulsa el botón ➕. Añade otro: "Justificante de fondos (3 últimas nóminas)".',
        whereToClick: 'Sección "Documentación requerida" de tu operación',
        expectedResult: 'Aparecerán los dos documentos como pendientes (en color ámbar).'
      },
      {
        id: 's1-7',
        text: 'Pon una fecha de notaría',
        detail: 'En la sección de la derecha, en el campo "Cita en Notaría / Fecha de Firma", escribe: "12 de Mayo de 2026 a las 10:00h en Notaría García-López, C/Velázquez 32". Haz clic fuera del campo para confirmarlo.',
        whereToClick: 'Campo de Cita en Notaría',
        expectedResult: 'Quedará registrado y se generará un evento en el historial.'
      },
      {
        id: 's1-8',
        text: 'Abre el Historial de Cambios de la operación',
        detail: 'Al final de la tarjeta verás "Historial de Cambios (X eventos)". Pulsa para desplegarlo y verás la cronología completa de lo que has hecho con fecha y hora exactas.',
        whereToClick: 'Sección colapsable "Historial de Cambios"',
        expectedResult: 'Verás todos tus cambios ordenados de más reciente a más antiguo.'
      },
      {
        id: 's1-9',
        text: 'Descarga el expediente en PDF',
        detail: 'Al final de la ficha, pulsa el botón blanco "Exportar Expediente (PDF)".',
        whereToClick: 'Botón "Exportar Expediente (PDF)" al final de la operación',
        expectedResult: 'Se descargará un PDF profesional con todos los datos del expediente, listo para imprimir o adjuntar a un email.'
      },
      {
        id: 's1-10',
        text: 'Mira la campanita de notificaciones 🔔',
        detail: 'En la cabecera negra, verás una campanita con un número en rojo. Pulsa para abrir el panel y haz clic en cualquier aviso para leer el email completo que se "envió" automáticamente.',
        whereToClick: 'Icono de campana en la cabecera',
        expectedResult: 'Verás todos los emails generados automáticamente cuando cambias fases. Comprueba lo profesional que se ve el texto.'
      }
    ]
  },
  {
    id: 'scenario-2',
    title: 'Escenario 2: Soy el cliente inversor (TÚ MISMO)',
    emoji: '👤',
    duration: '3 min',
    description: 'Ahora cambia al lado del cliente. Verás exactamente lo que ven tus inversores cuando entran con su usuario y clave. Es importante para que entiendas su experiencia.',
    color: 'blue',
    steps: [
      {
        id: 's2-1',
        text: 'Pulsa "Portal del Inversor" en la cabecera',
        detail: 'Cambia al modo cliente con el botón azul de la cabecera.',
        whereToClick: 'Botón "Portal del Inversor" en cabecera',
        expectedResult: 'La interfaz cambiará a la vista del inversor.'
      },
      {
        id: 's2-2',
        text: 'Inicia sesión con TU usuario',
        detail: 'Si te aparece el formulario de login, escribe el usuario y clave que te creaste en el escenario anterior (ej. tu_nombre / 1234). O usa el desplegable de la cabecera para elegirte.',
        whereToClick: 'Formulario de login o desplegable de usuarios',
        expectedResult: 'Verás la pantalla de bienvenida con tu nombre destacado en dorado.'
      },
      {
        id: 's2-3',
        text: 'Lee el mensaje verde tranquilizador',
        detail: 'Verás un cartel verde que dice "✓ No necesitas instalar absolutamente nada". Es el mensaje exacto que verán tus clientes para que sepan que pueden usar la web sin descargar nada.',
        whereToClick: 'Cartel verde tras la bienvenida',
        expectedResult: 'Quedarás convencido de que el cliente NO se asustará por temas técnicos.'
      },
      {
        id: 's2-4',
        text: 'Mira el embudo visual de tu operación',
        detail: 'Baja hasta tu piso "C/ Mayor 25". Verás los 6 círculos del progreso (Enviada → Aceptada → Doc → ... → Notaría). El que está activo tendrá un círculo dorado pulsante.',
        whereToClick: 'Tarjeta de tu piso',
        expectedResult: 'Verás claramente en qué fase está tu compra, sin necesidad de leer texto técnico.'
      },
      {
        id: 's2-5',
        text: 'Marca un documento como "Entregado"',
        detail: 'En la sección "Documentación Requerida para este Expediente" verás los 2 docs pendientes que añadiste antes. Haz clic en el "DNI compulsado" para marcarlo como entregado.',
        whereToClick: 'Documento pendiente en la lista',
        expectedResult: 'Cambiará a verde y quedará tachado. ¡Esto también queda registrado en el historial!'
      },
      {
        id: 's2-6',
        text: 'Pulsa el botón "¿Cómo adjuntar nueva documentación?"',
        detail: 'Te mostrará el email institucional al que el cliente debe enviar sus PDFs con la referencia del expediente.',
        whereToClick: 'Enlace inferior dentro de la sección de documentación',
        expectedResult: 'Aparecerá un cuadro amarillo con instrucciones claras y el email destacado.'
      },
      {
        id: 's2-7',
        text: 'Mira tu historial como cliente',
        detail: 'Despliega el "Historial de Cambios" al final de la tarjeta. Verás los mismos eventos que vio el admin, pero presentados de forma amigable.',
        whereToClick: 'Sección colapsable de historial en la tarjeta',
        expectedResult: 'Tendrás transparencia total de lo que ha pasado con tu compra.'
      },
      {
        id: 's2-8',
        text: 'Descarga TU resumen completo en PDF',
        detail: 'Arriba a la derecha verás un botón negro "Descargar mi Resumen (PDF)". Púlsalo.',
        whereToClick: 'Botón "Descargar mi Resumen" en la cabecera del listado',
        expectedResult: 'Se descargará un PDF elegante con todos tus expedientes y KPIs. Esto es lo que tu cliente puede llevar a su asesor fiscal o gestor.'
      }
    ]
  },
  {
    id: 'scenario-3',
    title: 'Escenario 3: Análisis ejecutivo y reportes',
    emoji: '📊',
    duration: '2 min',
    description: 'Vuelve al modo admin y descubre cómo controlar todo el negocio desde el cuadro de mando analítico.',
    color: 'emerald',
    steps: [
      {
        id: 's3-1',
        text: 'Vuelve a "Personal RSA Inver (Admin)"',
        detail: 'Pulsa el botón dorado de la cabecera.',
        whereToClick: 'Botón Admin en cabecera',
        expectedResult: 'Vuelves al modo de gestión interna.'
      },
      {
        id: 's3-2',
        text: 'Pulsa la pestaña "Cuadro de Mando Analítico"',
        detail: 'En la barra de pestañas, la segunda opción.',
        whereToClick: 'Pestaña "Cuadro de Mando Analítico"',
        expectedResult: 'Verás un dashboard ejecutivo con KPIs, embudo de conversión, alertas urgentes y rankings.'
      },
      {
        id: 's3-3',
        text: 'Mira los 4 KPIs principales arriba',
        detail: 'Total operaciones, Volumen ofertado, Operaciones cerradas, Tasa de conversión.',
        whereToClick: '4 tarjetas superiores',
        expectedResult: 'Tendrás un golpe de vista del estado de tu negocio.'
      },
      {
        id: 's3-4',
        text: 'Revisa el Embudo de Conversión',
        detail: 'Verás cuántas ofertas hay en cada fase. Las barras se rellenan proporcionalmente.',
        whereToClick: 'Sección central "Embudo de Conversión"',
        expectedResult: 'Sabrás dónde están los cuellos de botella de tu negocio (ej. muchas ofertas atascadas en "Falta documentación").'
      },
      {
        id: 's3-5',
        text: 'Mira el Ranking de Bancos y Inversores',
        detail: 'Abajo verás qué servicer te da más volumen y qué inversores son los más activos.',
        whereToClick: 'Sección inferior de rankings',
        expectedResult: 'Información estratégica para enfocar tus esfuerzos comerciales.'
      },
      {
        id: 's3-6',
        text: 'Descarga el informe completo en PDF',
        detail: 'Arriba a la derecha pulsa el botón negro "Exportar Informe (PDF)".',
        whereToClick: 'Botón "Exportar Informe (PDF)" en la cabecera',
        expectedResult: 'Tendrás un informe ejecutivo profesional para reuniones con socios o inversores.'
      },
      {
        id: 's3-7',
        text: 'Visita la pestaña "📡 Cómo poner la web online"',
        detail: 'La tercera pestaña. Te mostrará la guía completa para desplegarlo en internet.',
        whereToClick: 'Pestaña verde "Cómo poner la web online"',
        expectedResult: 'Tendrás todos los pasos, costes y proveedores recomendados para hacerlo realidad.'
      }
    ]
  }
];

const STORAGE_KEY = 'rsa_inver_test_progress';

export const TestingGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeScenario, setActiveScenario] = useState<string>(SCENARIOS[0].id);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedSteps));
  }, [completedSteps]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const resetProgress = () => {
    if (confirm('¿Reiniciar todo el progreso de la guía de pruebas?')) {
      setCompletedSteps({});
    }
  };

  const currentScenario = SCENARIOS.find(s => s.id === activeScenario)!;
  const totalSteps = SCENARIOS.reduce((sum, s) => sum + s.steps.length, 0);
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progress = Math.round((completedCount / totalSteps) * 100);

  const scenarioCompletedCount = currentScenario.steps.filter(s => completedSteps[s.id]).length;
  const allScenarioComplete = scenarioCompletedCount === currentScenario.steps.length;

  const allDone = completedCount === totalSteps;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/85 backdrop-blur-sm overflow-y-auto p-4 animate-fade-in">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl my-4 overflow-hidden border-4 border-amber-500">
        
        {/* CABECERA */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-6 md:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-colors"
            title="Cerrar guía (puedes volver cuando quieras)"
          >
            ✕
          </button>

          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300 mb-3">
            <PlayCircle className="w-3.5 h-3.5" />
            <span>ASISTENTE DE PRUEBAS GUIADAS</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight font-serif">
            ¡Vamos a probarlo todo paso a paso!
          </h2>
          <p className="text-slate-300 text-sm mt-2 max-w-2xl font-light">
            Te guiaré por <strong className="text-amber-400">3 escenarios reales</strong> para que conozcas la herramienta como la palma de tu mano antes de enseñársela a tu equipo o a tus clientes. Tardarás unos <strong className="text-amber-400">10 minutos en total</strong>.
          </p>

          {/* BARRA DE PROGRESO GLOBAL */}
          <div className="mt-5 bg-slate-950/50 p-3 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-300">
                Tu progreso de pruebas: <strong className="text-amber-400">{completedCount} / {totalSteps} pasos</strong>
              </span>
              <span className="text-xs font-black text-amber-400">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* MENSAJE DE FELICITACIÓN AL TERMINAR TODO */}
        {allDone && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 text-center">
            <PartyPopper className="w-10 h-10 mx-auto mb-2 animate-bounce" />
            <h3 className="text-xl font-black">¡Felicidades! Conoces la herramienta a la perfección 🎉</h3>
            <p className="text-sm font-light mt-1">
              Ya estás listo para presentárselo a tu equipo y empezar el despliegue. ¡Vas a ahorrar muchísimas llamadas y WhatsApps!
            </p>
          </div>
        )}

        {/* SELECTOR DE ESCENARIOS */}
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SCENARIOS.map((scenario) => {
              const completedInScenario = scenario.steps.filter(s => completedSteps[s.id]).length;
              const totalInScenario = scenario.steps.length;
              const scenarioProgress = (completedInScenario / totalInScenario) * 100;
              const isActive = activeScenario === scenario.id;
              const isComplete = completedInScenario === totalInScenario;

              return (
                <button
                  key={scenario.id}
                  onClick={() => setActiveScenario(scenario.id)}
                  className={`text-left p-3 rounded-xl border-2 transition-all cursor-pointer relative ${
                    isActive 
                      ? 'bg-white border-amber-500 shadow-md scale-[1.02]' 
                      : 'bg-white/60 border-slate-200 hover:border-amber-300 hover:bg-white'
                  }`}
                >
                  {isComplete && (
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{scenario.emoji}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      ⏱ {scenario.duration}
                    </span>
                  </div>
                  <h4 className={`text-sm font-black leading-tight ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                    {scenario.title}
                  </h4>
                  
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isComplete ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${scenarioProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      {completedInScenario}/{totalInScenario}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENIDO DEL ESCENARIO ACTIVO */}
        <div className="p-6 md:p-8 bg-white">
          
          {/* DESCRIPCIÓN DEL ESCENARIO */}
          <div className="mb-5 pb-4 border-b border-slate-100">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{currentScenario.emoji}</div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{currentScenario.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-1">
                  {currentScenario.description}
                </p>
              </div>
            </div>
          </div>

          {/* LISTA DE PASOS */}
          <div className="space-y-3">
            {currentScenario.steps.map((step, idx) => {
              const isDone = completedSteps[step.id];
              return (
                <div 
                  key={step.id}
                  className={`border-2 rounded-2xl p-4 transition-all ${
                    isDone 
                      ? 'bg-emerald-50/60 border-emerald-300' 
                      : 'bg-white border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleStep(step.id)}
                      className={`flex-shrink-0 mt-0.5 transition-transform hover:scale-110 cursor-pointer ${
                        isDone ? 'text-emerald-600' : 'text-slate-300 hover:text-amber-500'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-7 h-7" />
                      ) : (
                        <Circle className="w-7 h-7" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h4 className={`text-sm font-black leading-tight ${
                          isDone ? 'text-emerald-900 line-through' : 'text-slate-900'
                        }`}>
                          <span className="text-amber-600 mr-1">Paso {idx + 1}:</span>
                          {step.text}
                        </h4>
                      </div>

                      {step.detail && (
                        <div className={`mt-2 text-xs leading-relaxed whitespace-pre-line ${
                          isDone ? 'text-slate-500' : 'text-slate-700'
                        }`}>
                          {step.detail}
                        </div>
                      )}

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                        {step.whereToClick && (
                          <div className="bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg flex items-start gap-1.5">
                            <span className="font-bold text-amber-800 flex-shrink-0">📍 Dónde:</span>
                            <span className="text-amber-900">{step.whereToClick}</span>
                          </div>
                        )}
                        {step.expectedResult && (
                          <div className="bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg flex items-start gap-1.5">
                            <span className="font-bold text-blue-800 flex-shrink-0">✓ Esperas:</span>
                            <span className="text-blue-900">{step.expectedResult}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTONES DE NAVEGACIÓN ENTRE ESCENARIOS */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={resetProgress}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
              title="Reiniciar todos los pasos completados"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reiniciar progreso</span>
            </button>

            {allScenarioComplete && (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>¡Escenario completado!</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {SCENARIOS.findIndex(s => s.id === activeScenario) > 0 && (
                <button
                  onClick={() => {
                    const idx = SCENARIOS.findIndex(s => s.id === activeScenario);
                    setActiveScenario(SCENARIOS[idx - 1].id);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer"
                >
                  ← Anterior
                </button>
              )}

              {SCENARIOS.findIndex(s => s.id === activeScenario) < SCENARIOS.length - 1 && (
                <button
                  onClick={() => {
                    const idx = SCENARIOS.findIndex(s => s.id === activeScenario);
                    setActiveScenario(SCENARIOS[idx + 1].id);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Siguiente escenario</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* FOOTER MOTIVACIONAL */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 text-center">
          <p className="text-xs text-slate-600 font-light">
            💡 <strong>Consejo:</strong> Puedes cerrar esta guía con la X superior y abrirla cuando quieras desde el botón "Probar la app" en la cabecera. Tu progreso queda guardado.
          </p>
        </div>

      </div>
    </div>
  );
};

/**
 * BOTÓN FLOTANTE / DE LANZAMIENTO de la guía
 */
export const TestingGuideLauncher: React.FC<{ onOpen: () => void; hasStarted: boolean; progressPct: number }> = ({ 
  onOpen, 
  hasStarted, 
  progressPct 
}) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-2 font-black text-xs cursor-pointer transition-all hover:scale-105 group"
      title="Abrir guía de pruebas paso a paso"
    >
      <div className="relative">
        {hasStarted ? (
          <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-amber-400 text-[10px] font-black border-2 border-white">
            {progressPct}%
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-amber-400 border-2 border-white animate-pulse">
            <PlayCircle className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="text-left">
        <span className="block text-[9px] uppercase tracking-wider opacity-80">Asistente</span>
        <span className="block text-sm leading-none mt-0.5">
          {hasStarted ? 'Continuar pruebas' : 'Probar la app'}
        </span>
      </div>
    </button>
  );
};

/**
 * MODAL DE BIENVENIDA inicial - Aparece la primera vez que se abre la app
 */
export const WelcomeOnboarding: React.FC<{ onStart: () => void; onSkip: () => void }> = ({ onStart, onSkip }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/85 backdrop-blur-sm overflow-y-auto p-4 animate-fade-in flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-500 my-4">
        
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white p-8 text-center relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={onSkip}
              className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1"
            >
              <span>Saltar tutorial</span>
              <span>✕</span>
            </button>
          </div>

          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 text-slate-950 rounded-2xl mb-3">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          <h1 className="text-3xl md:text-4xl font-black font-serif tracking-tight">
            ¡Bienvenido a tu plataforma!
          </h1>
          <p className="text-slate-300 text-sm mt-2 font-light max-w-xl mx-auto">
            Antes de enseñársela a tus clientes o a tu equipo, vamos a probarla juntos en <strong className="text-amber-400">10 minutos</strong>. Te guiaré paso a paso por todo lo que necesitas saber.
          </p>
        </div>

        <div className="p-8 space-y-5">
          
          <h3 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-amber-600" />
            <span>¿Qué vamos a hacer juntos?</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
              <Users className="w-5 h-5 text-amber-700 mb-1" />
              <strong className="text-xs text-slate-900 block">1. Como tu equipo</strong>
              <span className="text-[11px] text-slate-600 leading-tight">Crearás clientes, asignarás pisos y simularás el avance de operaciones.</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
              <Smartphone className="w-5 h-5 text-blue-700 mb-1" />
              <strong className="text-xs text-slate-900 block">2. Como tu cliente</strong>
              <span className="text-[11px] text-slate-600 leading-tight">Verás exactamente lo que ven los inversores cuando entran a su portal privado.</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              <Trophy className="w-5 h-5 text-emerald-700 mb-1" />
              <strong className="text-xs text-slate-900 block">3. Como ejecutivo</strong>
              <span className="text-[11px] text-slate-600 leading-tight">Analizarás tu cartera con KPIs y descargarás informes en PDF.</span>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
            <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Antes de empezar, una advertencia importante:</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Esta versión que tienes ahora es una <strong>maqueta funcional 100% completa</strong> que guarda los datos en este navegador. Es perfecta para probarla y enseñársela a un cliente piloto. Para uso real con todos tus clientes, hay que desplegarla en internet (te explico cómo en la pestaña <strong>"📡 Cómo poner la web online"</strong>).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              onClick={onStart}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <PlayCircle className="w-5 h-5" />
              <span>¡Empezar el tutorial guiado!</span>
            </button>
            <button
              onClick={onSkip}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Prefiero explorar por mi cuenta</span>
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400 italic">
            Puedes abrir el tutorial cuando quieras desde el botón dorado de la esquina inferior derecha.
          </p>

        </div>

      </div>
    </div>
  );
};

/**
 * Helper para calcular el progreso desde fuera del componente
 */
export const useTestingProgress = () => {
  const [progress, setProgress] = useState<{ completed: number; total: number; pct: number; hasStarted: boolean }>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let completed = 0;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        completed = Object.values(parsed).filter(Boolean).length;
      } catch (e) { /* ignore */ }
    }
    const total = SCENARIOS.reduce((sum, s) => sum + s.steps.length, 0);
    return { completed, total, pct: Math.round((completed / total) * 100), hasStarted: completed > 0 };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      let completed = 0;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          completed = Object.values(parsed).filter(Boolean).length;
        } catch (e) { /* ignore */ }
      }
      const total = SCENARIOS.reduce((sum, s) => sum + s.steps.length, 0);
      setProgress({ completed, total, pct: Math.round((completed / total) * 100), hasStarted: completed > 0 });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return progress;
};

// Export Coffee y Zap aunque no se usen (preparados por si se quieren incluir más adelante)
export { Coffee, Zap };
