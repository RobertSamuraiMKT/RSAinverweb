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
        
        {/* VISTA 1: ADMIN - Operaciones o Estadísticas */}
        {currentRole === 'admin' && adminSection === 'operations' && (
          <AdminDashboard 
            investors={investors}
            setInvestors={setInvestors}
            offers={offers}
            setOffers={setOffers}
          />
        )}

        {currentRole === 'admin' && adminSection === 'stats' && (
          <StatsDashboard
            offers={offers}
            investors={investors}
          />
        )}

        {currentRole === 'admin' && adminSection === 'deployment' && (
          <DeploymentGuide />
        )}

        {currentRole === 'admin' && adminSection === 'materials' && (
          <PrintableMaterials investors={investors} />
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
