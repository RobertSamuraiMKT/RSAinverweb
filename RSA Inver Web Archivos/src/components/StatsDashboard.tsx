import React, { useMemo } from 'react';
import { 
  AssetOffer, 
  InvestorUser, 
  OfferPhase, 
  PHASE_LABELS 
} from '../types/inver';
import { 
  TrendingUp, 
  Euro, 
  Building, 
  Target, 
  AlertTriangle, 
  Trophy,
  Activity,
  Briefcase,
  CheckCircle2,
  Clock,
  Percent,
  FileDown
} from 'lucide-react';
import { exportPortfolioReport } from '../utils/pdfExport';

interface StatsDashboardProps {
  offers: AssetOffer[];
  investors: InvestorUser[];
}

const FUNNEL_ORDER: OfferPhase[] = [
  'oferta_enviada',
  'oferta_aceptada',
  'doc_pendiente',
  'doc_completa',
  'pbc_ok',
  'firma_fijada'
];

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ offers, investors }) => {
  
  // Cálculos memoizados de todos los KPIs
  const stats = useMemo(() => {
    const totalOffers = offers.length;
    const totalAmountSubmitted = offers.reduce((sum, o) => sum + o.offerAmount, 0);
    const totalOriginalPrice = offers.reduce((sum, o) => sum + o.originalPrice, 0);
    const totalSavings = totalOriginalPrice - totalAmountSubmitted;

    const closedOffers = offers.filter(o => o.phase === 'firma_fijada');
    const totalClosedAmount = closedOffers.reduce((sum, o) => sum + o.offerAmount, 0);
    
    const rejectedCount = offers.filter(o => o.phase === 'oferta_rechazada').length;
    const activeCount = totalOffers - rejectedCount;
    
    const successRate = totalOffers > 0 
      ? Math.round((closedOffers.length / totalOffers) * 100) 
      : 0;

    // Conteo por fase para el embudo
    const phaseCounts: Record<OfferPhase, number> = {
      oferta_enviada: 0,
      oferta_aceptada: 0,
      doc_pendiente: 0,
      doc_completa: 0,
      pbc_ok: 0,
      firma_fijada: 0,
      oferta_rechazada: 0
    };
    offers.forEach(o => {
      phaseCounts[o.phase] = (phaseCounts[o.phase] || 0) + 1;
    });

    // Ranking por servicer
    const bankCounts: Record<string, { count: number; amount: number }> = {};
    offers.forEach(o => {
      if (!bankCounts[o.bankOrServicer]) {
        bankCounts[o.bankOrServicer] = { count: 0, amount: 0 };
      }
      bankCounts[o.bankOrServicer].count += 1;
      bankCounts[o.bankOrServicer].amount += o.offerAmount;
    });
    const bankRanking = Object.entries(bankCounts)
      .sort((a, b) => b[1].amount - a[1].amount);

    // Ranking por inversor
    const investorStats = investors.map(inv => {
      const myOffers = offers.filter(o => o.investorId === inv.id);
      const myClosed = myOffers.filter(o => o.phase === 'firma_fijada').length;
      const myAmount = myOffers.reduce((sum, o) => sum + o.offerAmount, 0);
      return {
        investor: inv,
        offerCount: myOffers.length,
        closedCount: myClosed,
        amount: myAmount
      };
    }).sort((a, b) => b.amount - a.amount);

    // Alertas: ofertas con docs pendientes o lanzadas hace mucho
    const docAlerts = offers.filter(o => 
      o.missingDocs.some(d => !d.isProvided) && o.phase !== 'firma_fijada'
    );

    const stuckOffers = offers.filter(o => {
      const daysAgo = (Date.now() - new Date(o.dateSubmitted).getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo > 14 && o.phase === 'oferta_enviada';
    });

    return {
      totalOffers,
      totalAmountSubmitted,
      totalOriginalPrice,
      totalSavings,
      closedOffers,
      totalClosedAmount,
      rejectedCount,
      activeCount,
      successRate,
      phaseCounts,
      bankRanking,
      investorStats,
      docAlerts,
      stuckOffers
    };
  }, [offers, investors]);

  const maxFunnelCount = Math.max(...FUNNEL_ORDER.map(p => stats.phaseCounts[p]), 1);

  return (
    <div className="space-y-6">
      
      {/* Cabecera del dashboard */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600" />
              <span>Cuadro de Mando Analítico</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Visión 360° del rendimiento de la cartera de inversión: KPIs financieros, embudo de conversión y rankings por entidad y por cliente.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportPortfolioReport(offers, investors)}
              className="bg-slate-900 hover:bg-amber-600 text-white hover:text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Genera un PDF ejecutivo con todos los KPIs y operaciones"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Exportar Informe (PDF)</span>
            </button>

            <div className="hidden sm:block bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Actualizado</span>
              <span className="text-xs font-mono font-bold text-amber-950">
                {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FILA 1: KPIs PRINCIPALES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI: Operaciones Totales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Activos</span>
          </div>
          <span className="text-3xl font-black text-slate-900 font-serif block">
            {stats.totalOffers}
          </span>
          <span className="text-xs text-slate-500 font-medium">Operaciones gestionadas</span>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-emerald-700 font-bold">✓ {stats.activeCount} activas</span>
            <span className="text-rose-700 font-bold">✗ {stats.rejectedCount} rechazadas</span>
          </div>
        </div>

        {/* KPI: Volumen Lanzado */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
              <Euro className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Volumen</span>
          </div>
          <span className="text-3xl font-black text-slate-900 font-serif block">
            {(stats.totalAmountSubmitted / 1000).toFixed(0)}<span className="text-sm font-bold text-slate-500">k€</span>
          </span>
          <span className="text-xs text-slate-500 font-medium">Total ofertado a bancos</span>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            Precio salida original: <strong className="text-slate-700">{(stats.totalOriginalPrice / 1000).toFixed(0)}k€</strong>
          </div>
        </div>

        {/* KPI: Operaciones Cerradas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Cerradas</span>
          </div>
          <span className="text-3xl font-black text-emerald-700 font-serif block">
            {stats.closedOffers.length}
          </span>
          <span className="text-xs text-slate-500 font-medium">Con firma programada</span>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-emerald-700 font-bold">
            💰 {(stats.totalClosedAmount / 1000).toFixed(0)}k€ formalizados
          </div>
        </div>

        {/* KPI: Ratio de Éxito */}
        <div className="bg-gradient-to-br from-slate-900 to-amber-950 text-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-amber-500/20 text-amber-400 p-2 rounded-lg">
              <Percent className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase font-bold text-amber-400/70">Tasa</span>
          </div>
          <span className="text-3xl font-black text-amber-400 font-serif block">
            {stats.successRate}<span className="text-sm">%</span>
          </span>
          <span className="text-xs text-slate-300 font-medium">Conversión a firma</span>
          <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-amber-300/80">
            Ahorro generado: <strong>{(stats.totalSavings / 1000).toFixed(0)}k€</strong>
          </div>
        </div>

      </div>

      {/* FILA 2: EMBUDO DE CONVERSIÓN VISUAL + ALERTAS URGENTES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* EMBUDO DE CONVERSIÓN */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-600" />
              <span>Embudo de Conversión por Fase</span>
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">
              {stats.totalOffers} totales
            </span>
          </div>

          <div className="space-y-2">
            {FUNNEL_ORDER.map((phase, idx) => {
              const count = stats.phaseCounts[phase];
              const percentage = stats.totalOffers > 0 ? (count / stats.totalOffers) * 100 : 0;
              const widthBar = stats.totalOffers > 0 ? (count / maxFunnelCount) * 100 : 0;
              const phaseInfo = PHASE_LABELS[phase];

              return (
                <div key={phase} className="group">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-black">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800">{phaseInfo.label.replace(/^\d+\.\s*/, '')}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-slate-900">{count}</span>
                      <span className="text-slate-400 text-[10px]">({percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-7 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 relative">
                    <div 
                      className={`h-full rounded-lg transition-all duration-700 ease-out flex items-center px-2 ${
                        phase === 'firma_fijada' 
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-500' 
                          : phase === 'pbc_ok'
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                          : phase === 'doc_pendiente'
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                          : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                      }`}
                      style={{ width: `${Math.max(widthBar, count > 0 ? 8 : 0)}%` }}
                    >
                      {count > 0 && widthBar > 15 && (
                        <span className="text-[10px] font-bold text-white drop-shadow-sm">
                          {count} {count === 1 ? 'oferta' : 'ofertas'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Sección rechazadas como excepción */}
            {stats.phaseCounts.oferta_rechazada > 0 && (
              <div className="pt-3 mt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                      ✗
                    </span>
                    <span className="font-bold text-rose-700">Ofertas Rechazadas</span>
                  </div>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    {stats.phaseCounts.oferta_rechazada}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ALERTAS URGENTES */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Alertas de documentación */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Alertas Urgentes</span>
            </h3>

            {stats.docAlerts.length === 0 && stats.stuckOffers.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-300 mx-auto mb-1" />
                <p className="text-xs text-slate-500 font-medium">Todo bajo control</p>
                <p className="text-[10px] text-slate-400">No hay incidencias destacadas.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {stats.docAlerts.map(o => {
                  const inv = investors.find(i => i.id === o.investorId);
                  const pendCount = o.missingDocs.filter(d => !d.isProvided).length;
                  return (
                    <div key={o.id} className="bg-amber-50 border border-amber-200 p-2 rounded-lg text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 truncate max-w-[180px]">{o.assetTitle}</span>
                        <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 rounded font-bold flex-shrink-0">
                          {pendCount} docs
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-600 block mt-0.5">
                        Cliente: <strong>{inv?.fullName || 'Desconocido'}</strong>
                      </span>
                    </div>
                  );
                })}

                {stats.stuckOffers.map(o => {
                  const inv = investors.find(i => i.id === o.investorId);
                  return (
                    <div key={o.id} className="bg-rose-50 border border-rose-200 p-2 rounded-lg text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-900 truncate max-w-[180px]">{o.assetTitle}</span>
                        <span className="bg-rose-200 text-rose-900 text-[10px] px-1.5 rounded font-bold flex-shrink-0">
                          +14 días
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-600 block mt-0.5">
                        Sin respuesta del banco. Cliente: <strong>{inv?.fullName || 'Desconocido'}</strong>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resumen rápido */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Resumen Operativo</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Inversores activos:</span>
                <strong className="text-white">{investors.length}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Ofertas con PBC OK:</span>
                <strong className="text-emerald-400">{offers.filter(o => o.pbcPassed).length}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Pendientes de doc:</span>
                <strong className="text-amber-400">{stats.docAlerts.length}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Notarías programadas:</span>
                <strong className="text-teal-400">{stats.closedOffers.length}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FILA 3: RANKING DE BANCOS Y CLIENTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ranking de Servicers/Bancos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <Building className="w-4 h-4 text-amber-600" />
            <span>Ranking por Servicer / Banco</span>
          </h3>

          {stats.bankRanking.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">Sin datos disponibles.</p>
          ) : (
            <div className="space-y-2.5">
              {stats.bankRanking.map(([bankName, data], idx) => {
                const maxAmount = stats.bankRanking[0][1].amount;
                const widthPct = (data.amount / maxAmount) * 100;
                return (
                  <div key={bankName} className="group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
                          idx === 0 ? 'bg-amber-500 text-slate-950' : 
                          idx === 1 ? 'bg-slate-300 text-slate-700' :
                          idx === 2 ? 'bg-amber-700 text-white' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-800">{bankName}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-slate-500">{data.count} ofertas</span>
                        <span className="font-black text-slate-900">{(data.amount / 1000).toFixed(0)}k€</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ranking de Inversores */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Ranking de Inversores Activos</span>
          </h3>

          {stats.investorStats.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">Sin inversores.</p>
          ) : (
            <div className="space-y-2">
              {stats.investorStats.map((s, idx) => (
                <div key={s.investor.id} className="bg-slate-50 hover:bg-slate-100 transition-colors p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                      idx === 0 ? 'bg-amber-500 text-slate-950' : 
                      idx === 1 ? 'bg-slate-300 text-slate-700' :
                      idx === 2 ? 'bg-amber-700 text-white' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {s.investor.fullName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">{s.investor.fullName}</span>
                      <span className="text-[10px] text-slate-500 font-light">{s.investor.companyName || 'Particular'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 block leading-tight font-mono">
                      {(s.amount / 1000).toFixed(0)}k€
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {s.offerCount} act. · <strong className="text-emerald-700">{s.closedCount} cerr.</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* FOOTER INFORMATIVO */}
      <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 flex-shrink-0" />
        <span>
          <strong>Tip:</strong> Estos datos se actualizan automáticamente conforme el equipo registra cambios en las fases de los expedientes. Las alertas urgentes te avisan cuando una operación lleva más de 14 días sin movimiento o tiene documentación pendiente del cliente.
        </span>
      </div>

    </div>
  );
};
