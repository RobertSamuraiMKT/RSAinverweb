import React, { useState } from 'react';
import { HistoryEntry, HistoryEventType } from '../types/inver';
import { formatHistoryDate } from '../utils/history';
import { 
  Clock, 
  PlusCircle, 
  ArrowRightLeft, 
  ShieldCheck, 
  ShieldAlert,
  FileText, 
  CheckSquare, 
  Square, 
  Trash2, 
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  History
} from 'lucide-react';

interface HistoryTimelineProps {
  history: HistoryEntry[];
  variant?: 'full' | 'compact';
  startCollapsed?: boolean;
}

const getIconForType = (type: HistoryEventType) => {
  switch (type) {
    case 'created': return <PlusCircle className="w-3.5 h-3.5" />;
    case 'phase_changed': return <ArrowRightLeft className="w-3.5 h-3.5" />;
    case 'pbc_approved': return <ShieldCheck className="w-3.5 h-3.5" />;
    case 'pbc_revoked': return <ShieldAlert className="w-3.5 h-3.5" />;
    case 'doc_added': return <FileText className="w-3.5 h-3.5" />;
    case 'doc_provided': return <CheckSquare className="w-3.5 h-3.5" />;
    case 'doc_pending': return <Square className="w-3.5 h-3.5" />;
    case 'doc_removed': return <Trash2 className="w-3.5 h-3.5" />;
    case 'signing_scheduled':
    case 'signing_updated': return <Calendar className="w-3.5 h-3.5" />;
    case 'note_updated': return <MessageSquare className="w-3.5 h-3.5" />;
    default: return <Clock className="w-3.5 h-3.5" />;
  }
};

const getColorForType = (type: HistoryEventType) => {
  switch (type) {
    case 'created': return { bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-300' };
    case 'phase_changed': return { bg: 'bg-indigo-100', text: 'text-indigo-700', ring: 'ring-indigo-300' };
    case 'pbc_approved': return { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-300' };
    case 'pbc_revoked': return { bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-300' };
    case 'doc_added': return { bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-300' };
    case 'doc_provided': return { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-300' };
    case 'doc_pending': return { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-300' };
    case 'doc_removed': return { bg: 'bg-rose-100', text: 'text-rose-700', ring: 'ring-rose-300' };
    case 'signing_scheduled': 
    case 'signing_updated': return { bg: 'bg-teal-100', text: 'text-teal-700', ring: 'ring-teal-300' };
    case 'note_updated': return { bg: 'bg-purple-100', text: 'text-purple-700', ring: 'ring-purple-300' };
    default: return { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-300' };
  }
};

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ 
  history, 
  variant = 'full',
  startCollapsed = false 
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(startCollapsed);

  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-50 p-4 rounded-xl text-center text-xs text-slate-500 font-light border border-slate-200">
        Sin movimientos registrados todavía.
      </div>
    );
  }

  // Ordenar de más reciente a más antiguo
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);
  const visibleHistory = collapsed ? sortedHistory.slice(0, 3) : sortedHistory;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      
      {/* Cabecera con toggle */}
      <div 
        onClick={() => setCollapsed(!collapsed)}
        className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Historial de Cambios ({history.length} eventos)
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-700 p-0.5">
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Timeline vertical */}
      <div className={`${variant === 'full' ? 'p-4' : 'p-3'} max-h-[400px] overflow-y-auto`}>
        <div className="relative">
          {/* Línea vertical de fondo */}
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-200" />

          <div className="space-y-3">
            {visibleHistory.map((entry, idx) => {
              const colors = getColorForType(entry.type);
              const isLatest = idx === 0;
              return (
                <div key={entry.id} className="flex items-start gap-3 relative">
                  {/* Bullet con icono */}
                  <div className={`relative z-10 w-6 h-6 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center flex-shrink-0 ring-2 ring-white ${isLatest ? `ring-offset-1 ${colors.ring}` : ''}`}>
                    {getIconForType(entry.type)}
                  </div>

                  {/* Contenido del evento */}
                  <div className={`flex-1 min-w-0 pb-2 ${variant === 'full' ? 'bg-slate-50/50 p-2.5 rounded-lg border border-slate-100' : ''}`}>
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <span className={`text-xs font-bold ${colors.text} leading-tight`}>
                        {entry.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{formatHistoryDate(entry.timestamp)}</span>
                      </span>
                    </div>

                    {variant === 'full' && (
                      <p className="text-[11px] text-slate-600 mt-1 font-light leading-tight">
                        {entry.description}
                      </p>
                    )}

                    {/* Cambio antes/después */}
                    {entry.fromValue && entry.toValue && variant === 'full' && (
                      <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                        <span className="bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-mono line-through">
                          {entry.fromValue.replace(/^\d+\.\s*/, '')}
                        </span>
                        <ArrowRightLeft className="w-2.5 h-2.5 text-slate-400" />
                        <span className={`${colors.bg} ${colors.text} px-1.5 py-0.2 rounded font-mono font-bold`}>
                          {entry.toValue.replace(/^\d+\.\s*/, '')}
                        </span>
                      </div>
                    )}

                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
                      <span>👤</span>
                      <span className="italic">{entry.user}</span>
                      {isLatest && (
                        <span className="ml-1 bg-amber-100 text-amber-800 px-1 rounded font-bold not-italic text-[9px]">
                          MÁS RECIENTE
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {collapsed && sortedHistory.length > 3 && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full mt-2 text-[11px] text-amber-700 hover:text-amber-900 font-bold underline text-center"
          >
            Ver los {sortedHistory.length - 3} eventos anteriores
          </button>
        )}
      </div>

    </div>
  );
};
