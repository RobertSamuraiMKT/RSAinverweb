import React, { useState, useRef, useEffect } from 'react';
import { AppNotification, InvestorUser } from '../types/inver';
import { formatRelativeTime } from '../utils/notifications';
import { 
  Bell, 
  Mail, 
  MessageCircle, 
  Smartphone, 
  X, 
  CheckCircle2,
  FileText,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Inbox
} from 'lucide-react';

interface NotificationCenterProps {
  notifications: AppNotification[];
  investors: InvestorUser[];
  filterByInvestorId?: string; // Si se pasa, filtra solo las del inversor
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  variant: 'admin' | 'investor';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  investors,
  filterByInvestorId,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  variant
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar notificaciones según el contexto
  const filteredNotifs = filterByInvestorId 
    ? notifications.filter(n => n.investorId === filterByInvestorId)
    : notifications;

  const unreadCount = filteredNotifs.filter(n => !n.isRead).length;

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getIconForType = (type: AppNotification['type']) => {
    switch (type) {
      case 'phase_change': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'doc_request': return <FileText className="w-3.5 h-3.5" />;
      case 'pbc_approved': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'signing_scheduled': return <Calendar className="w-3.5 h-3.5" />;
      default: return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const getColorForType = (type: AppNotification['type']) => {
    switch (type) {
      case 'pbc_approved': return 'bg-emerald-100 text-emerald-700';
      case 'signing_scheduled': return 'bg-teal-100 text-teal-700';
      case 'doc_request': return 'bg-amber-100 text-amber-700';
      case 'phase_change': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Botón con contador */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors cursor-pointer border ${
          variant === 'admin' 
            ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-800' 
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
        }`}
        title="Centro de notificaciones"
      >
        <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 max-h-[600px] flex flex-col animate-fade-in overflow-hidden">
          
          {/* Cabecera del panel */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h4 className="font-black text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Centro de Avisos</span>
              </h4>
              <p className="text-[10px] text-slate-400 font-light mt-0.5">
                {variant === 'admin' 
                  ? 'Avisos enviados a tus inversores' 
                  : 'Tus actualizaciones en tiempo real'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 py-1 rounded font-bold transition-colors"
                >
                  Marcar todo leído
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Banner explicativo del envío automático */}
          <div className="bg-amber-50/60 px-4 py-2 border-b border-slate-100 flex items-center gap-2 text-[10px] text-slate-600 flex-shrink-0">
            <span className="flex items-center gap-1 font-bold">
              <Mail className="w-3 h-3 text-amber-700" /> Email
            </span>
            <span className="text-slate-400">+</span>
            <span className="flex items-center gap-1 font-bold">
              <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp
            </span>
            <span className="text-slate-400">+</span>
            <span className="flex items-center gap-1 font-bold">
              <Smartphone className="w-3 h-3 text-blue-600" /> Portal
            </span>
            <span className="text-slate-500 ml-auto italic font-light">Envío simulado</span>
          </div>

          {/* Lista de notificaciones */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifs.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Sin notificaciones</p>
                <p className="text-[10px] text-slate-400 font-light mt-1">
                  {variant === 'admin' 
                    ? 'Cuando cambies la fase de un expediente, se generará un aviso aquí.' 
                    : 'Te avisaremos cuando haya novedades sobre tus operaciones.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredNotifs
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((notif) => {
                    const targetInv = investors.find(i => i.id === notif.investorId);
                    const isExpanded = expandedId === notif.id;

                    return (
                      <div 
                        key={notif.id} 
                        className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                          !notif.isRead ? 'bg-amber-50/40 border-l-4 border-amber-500' : 'bg-white'
                        }`}
                        onClick={() => {
                          if (!notif.isRead) markAsRead(notif.id);
                          setExpandedId(isExpanded ? null : notif.id);
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${getColorForType(notif.type)}`}>
                            {getIconForType(notif.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-slate-900 leading-tight truncate">
                                {notif.subject}
                              </span>
                              {!notif.isRead && (
                                <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1 animate-pulse" />
                              )}
                            </div>

                            {variant === 'admin' && targetInv && (
                              <span className="text-[10px] text-slate-500 block mt-0.5">
                                A: <strong className="text-amber-800">{targetInv.fullName}</strong> ({targetInv.email})
                              </span>
                            )}

                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              {formatRelativeTime(notif.createdAt)} · Ref. {notif.reference}
                            </span>

                            {/* Vista expandida del email completo */}
                            {isExpanded && (
                              <div className="mt-3 bg-white border border-slate-200 rounded-lg p-3 animate-fade-in">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                                  <span className="text-[10px] uppercase font-bold text-slate-500">
                                    Vista previa del mensaje
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notif.id);
                                    }}
                                    className="text-slate-300 hover:text-rose-500"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                                <pre className="text-[10px] text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                                  {notif.message}
                                </pre>
                                <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                                  {notif.channels.map(ch => (
                                    <span 
                                      key={ch} 
                                      className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold border border-emerald-200"
                                    >
                                      ✓ Enviado por {ch}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Footer informativo */}
          {filteredNotifs.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 text-[10px] text-slate-500 font-light text-center flex-shrink-0">
              💡 Haz clic en cualquier aviso para ver el email completo enviado al cliente
            </div>
          )}

        </div>
      )}

    </div>
  );
};
