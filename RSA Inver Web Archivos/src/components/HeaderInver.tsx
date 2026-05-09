import React from 'react';
import { Building2, ShieldCheck, UserCheck, Users, RefreshCw, Smartphone, BarChart3, Briefcase, Rocket, Package } from 'lucide-react';
import { InvestorUser, AppNotification } from '../types/inver';
import { NotificationCenter } from './NotificationCenter';
import { getSupabaseCredentials } from '../utils/supabaseClient';

export type AdminSection = 'operations' | 'stats' | 'deployment' | 'materials';

interface HeaderInverProps {
  currentRole: 'admin' | 'investor';
  setRole: (r: 'admin' | 'investor') => void;
  investors: InvestorUser[];
  loggedInvestorId: string;
  setLoggedInvestorId: (id: string) => void;
  resetDatabase: () => void;
  notifications: AppNotification[];
  markNotifAsRead: (id: string) => void;
  markAllNotifsAsRead: () => void;
  deleteNotif: (id: string) => void;
  // Sección activa solo cuando rol es admin
  adminSection: AdminSection;
  setAdminSection: (s: AdminSection) => void;
}

export const HeaderInver: React.FC<HeaderInverProps> = ({
  currentRole,
  setRole,
  investors,
  loggedInvestorId,
  setLoggedInvestorId,
  resetDatabase,
  notifications,
  markNotifAsRead,
  markAllNotifsAsRead,
  deleteNotif,
  adminSection,
  setAdminSection
}) => {
  const currentInv = investors.find(i => i.id === loggedInvestorId);
  const creds = getSupabaseCredentials();

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
          
          {/* Logo & Corporate Tag */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 p-2.5 rounded-xl font-black shadow-inner flex items-center justify-center">
              <Building2 className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white font-serif">
                  RSA INVER
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                  Bank Assets
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light">
                Portal de Gestión y Seguimiento de Operaciones Inmobiliarias
              </p>
            </div>
          </div>

          {/* Role switcher */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
            
            {/* Admin Toggle */}
            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Personal RSA Inver (Admin)</span>
            </button>

            {/* Investor Portal Toggle */}
            <button
              onClick={() => setRole('investor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'investor'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span>Portal del Inversor</span>
            </button>

            {/* Quick selector when on investor view */}
            {currentRole === 'investor' && (
              <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
                <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                <select
                  value={loggedInvestorId}
                  onChange={(e) => setLoggedInvestorId(e.target.value)}
                  className="bg-slate-900 text-amber-400 text-xs font-bold rounded px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer max-w-[140px] truncate"
                  title="Simulador: Elige qué cliente inversor ha iniciado sesión"
                >
                  {investors.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.fullName} ({inv.username})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Notification center */}
            <NotificationCenter
              notifications={notifications}
              investors={investors}
              filterByInvestorId={currentRole === 'investor' ? loggedInvestorId : undefined}
              markAsRead={markNotifAsRead}
              markAllAsRead={markAllNotifsAsRead}
              deleteNotification={deleteNotif}
              variant={currentRole}
            />

            {/* Reset Database Button */}
            <button
              onClick={resetDatabase}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors border border-slate-800"
              title="Restablecer base de datos inicial con activos de prueba"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* AUDITORÍA VISUAL EN TIEMPO REAL (REQUISITO 3, 4 Y 6) */}
            <div className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-[10px] text-slate-300 font-mono space-y-0.5">
              <div>URL Vercel: <strong className={creds.url ? "text-emerald-400" : "text-rose-400"}>{creds.url ? "SÍ" : "NO"}</strong></div>
              <div>Key Vercel: <strong className={creds.anonKey ? "text-emerald-400" : "text-rose-400"}>{creds.anonKey ? "SÍ" : "NO"}</strong></div>
            </div>

          </div>

        </div>

        {/* Admin Sub-Navigation tabs */}
        {currentRole === 'admin' && (
          <div className="border-t border-slate-800 py-2 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setAdminSection('operations')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                adminSection === 'operations'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Gestión de Operaciones</span>
            </button>

            <button
              onClick={() => setAdminSection('stats')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                adminSection === 'stats'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Cuadro de Mando Analítico</span>
            </button>

            <button
              onClick={() => setAdminSection('deployment')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                adminSection === 'deployment'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>📡 Cómo poner la web online</span>
            </button>

            <button
              onClick={() => setAdminSection('materials')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                adminSection === 'materials'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>📦 Materiales para Imprimir</span>
            </button>
          </div>
        )}

        {/* Info Banner Operativo */}
        <div className="bg-amber-500/5 border-t border-amber-500/10 py-2 text-center md:text-left flex flex-col md:flex-row items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center md:justify-start text-[11px]">
            <span className="flex items-center gap-1 text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <strong>Acceso Socio/Equipo:</strong> Entran a la web desde cualquier PC/Mac sin instalar nada.
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="text-slate-300">
              <strong>Acceso Inversores:</strong> Entran con su usuario/clave solo cuando vosotros los dais de alta.
            </span>
          </div>

          {currentRole === 'investor' && currentInv && (
            <div className="text-slate-400 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Usuario actual: <strong className="text-white">{currentInv.username}</strong> | Clave: <strong className="text-amber-400">{currentInv.password}</strong>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
