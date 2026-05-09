import React, { useState } from 'react';
import { 
  InvestorUser, 
  AssetOffer, 
  OfferPhase, 
  PHASE_LABELS,
  MissingDoc 
} from '../types/inver';
import { 
  logCreated,
  logPhaseChange, 
  logPbcChange, 
  logDocAdded, 
  logDocProvided, 
  logDocRemoved, 
  logSigningUpdated, 
  logNoteUpdated 
} from '../utils/history';
import { 
  UserPlus, 
  PlusCircle, 
  Building, 
  FileText, 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  FileCheck, 
  Calendar,
  Layers,
  FileQuestion,
  UserCheck,
  Download,
  FileDown
} from 'lucide-react';
import { HistoryTimeline } from './HistoryTimeline';
import { exportPortfolioReport, exportSingleOfferReport, exportInvestorReport } from '../utils/pdfExport';

interface AdminDashboardProps {
  investors: InvestorUser[];
  setInvestors: React.Dispatch<React.SetStateAction<InvestorUser[]>>;
  offers: AssetOffer[];
  setOffers: React.Dispatch<React.SetStateAction<AssetOffer[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  investors,
  setInvestors,
  offers,
  setOffers
}) => {
  // Filtro de inversor en la tabla general
  const [selectedInvestorFilter, setSelectedInvestorFilter] = useState<string>('all');

  // Estado para alta de nuevo cliente inversor
  const [newInvUsername, setNewInvUsername] = useState<string>('');
  const [newInvPassword, setNewInvPassword] = useState<string>('rsa1234');
  const [newInvFullName, setNewInvFullName] = useState<string>('');
  const [newInvEmail, setNewInvEmail] = useState<string>('');
  const [newInvPhone, setNewInvPhone] = useState<string>('');
  const [newInvCompany, setNewInvCompany] = useState<string>('');

  // Estado para lanzar un nuevo activo/oferta a un inversor
  const [targetInvestorId, setTargetInvestorId] = useState<string>(investors[0]?.id || '');
  const [newAssetTitle, setNewAssetTitle] = useState<string>('');
  const [newServicer, setNewServicer] = useState<string>('Aliseda Inmobiliaria');
  const [newOfferAmount, setNewOfferAmount] = useState<number>(100000);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(130000);
  const [newPhase, setNewPhase] = useState<OfferPhase>('oferta_enviada');
  const [newNotes, setNewNotes] = useState<string>('');

  // Formulario temporal para añadir un ítem de documentación faltante a una oferta
  const [docInputs, setDocInputs] = useState<Record<string, string>>({});

  const handleAddInvestor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvFullName.trim() || !newInvUsername.trim()) {
      alert('Por favor rellena al menos el Nombre Completo y el Usuario.');
      return;
    }

    // Verificar si el usuario ya existe
    if (investors.some(i => i.username.toLowerCase() === newInvUsername.trim().toLowerCase())) {
      alert('Ese nombre de usuario ya está registrado.');
      return;
    }

    const newUser: InvestorUser = {
      id: 'inv-' + Date.now(),
      username: newInvUsername.trim(),
      password: newInvPassword || 'rsa1234',
      fullName: newInvFullName.trim(),
      email: newInvEmail.trim() || `${newInvUsername}@inversor.com`,
      phone: newInvPhone.trim() || '+34 600 000 000',
      companyName: newInvCompany.trim() || 'Inversor Particular',
      createdAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setInvestors([newUser, ...investors]);
    setTargetInvestorId(newUser.id); // Seleccionarlo por defecto para ofertas

    // Resetear formulario
    setNewInvUsername('');
    setNewInvPassword('rsa1234');
    setNewInvFullName('');
    setNewInvEmail('');
    setNewInvPhone('');
    setNewInvCompany('');

    alert(`¡Inversor "${newUser.fullName}" dado de alta con éxito con usuario "${newUser.username}"!`);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetTitle.trim()) {
      alert('Por favor indica el título/dirección del inmueble.');
      return;
    }
    if (!targetInvestorId) {
      alert('Debes seleccionar a qué cliente inversor asociar esta oferta.');
      return;
    }

    const randRef = 'REF-' + newServicer.substring(0, 3).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);

    const newOffer: AssetOffer = {
      id: 'off-' + Date.now(),
      investorId: targetInvestorId,
      assetTitle: newAssetTitle.trim(),
      bankOrServicer: newServicer,
      offerAmount: Number(newOfferAmount) || 0,
      originalPrice: Number(newOriginalPrice) || 0,
      phase: newPhase,
      dateSubmitted: new Date().toISOString().split('T')[0],
      missingDocs: [],
      pbcPassed: newPhase === 'pbc_ok' || newPhase === 'firma_fijada',
      notes: newNotes.trim() || 'Oferta registrada en el sistema de gestión de RSA Inver.',
      reference: randRef,
      history: [logCreated(Number(newOfferAmount) || 0, newServicer)]
    };

    setOffers([newOffer, ...offers]);
    setNewAssetTitle('');
    setNewNotes('');
    alert('¡Inmueble y oferta lanzada registrada exitosamente!');
  };

  const updateOfferPhase = (offerId: string, newP: OfferPhase) => {
    setOffers(prev => prev.map(off => {
      if (off.id === offerId) {
        if (off.phase === newP) return off; // No log si no cambia
        const pbcState = newP === 'pbc_ok' || newP === 'firma_fijada' ? true : off.pbcPassed;
        const histEntry = logPhaseChange(off, off.phase, newP, 'Personal RSA Inver');
        return { 
          ...off, 
          phase: newP, 
          pbcPassed: pbcState,
          history: [...(off.history || []), histEntry]
        };
      }
      return off;
    }));
  };

  const updateOfferNotes = (offerId: string, txt: string) => {
    setOffers(prev => prev.map(off => {
      if (off.id === offerId) {
        return { ...off, notes: txt };
      }
      return off;
    }));
  };

  // Función separada que registra el cambio de notas cuando termina la edición
  const commitNotesChange = (offerId: string) => {
    setOffers(prev => prev.map(off => {
      if (off.id === offerId) {
        const histEntry = logNoteUpdated('Personal RSA Inver');
        return { ...off, history: [...(off.history || []), histEntry] };
      }
      return off;
    }));
  };

  const updateSigningDate = (offerId: string, txt: string) => {
    setOffers(prev => prev.map(off => {
      if (off.id === offerId) {
        return { ...off, signingDate: txt };
      }
      return off;
    }));
  };

  const commitSigningDate = (offerId: string, txt: string) => {
    setOffers(prev => prev.map(off => {
      if (off.id === offerId && txt.trim()) {
        const histEntry = logSigningUpdated(txt, 'Personal RSA Inver');
        return { ...off, history: [...(off.history || []), histEntry] };
      }
      return off;
    }));
  };

  const togglePbc = (offerId: string) => {
    setOffers(prev => prev.map(off => {
      if (off.id === offerId) {
        const newPbc = !off.pbcPassed;
        const histEntry = logPbcChange(newPbc, 'Personal RSA Inver');
        return { 
          ...off, 
          pbcPassed: newPbc,
          history: [...(off.history || []), histEntry]
        };
      }
      return off;
    }));
  };

  const addMissingDoc = (offerId: string) => {
    const txt = docInputs[offerId];
    if (!txt || !txt.trim()) return;

    setOffers(prev => prev.map(off => {
      if (off.id === offerId) {
        const newDoc: MissingDoc = {
          id: 'doc-' + Date.now() + Math.random(),
          name: txt.trim(),
          isProvided: false
        };
        const histEntry = logDocAdded(txt.trim(), 'Personal RSA Inver');
        return { 
          ...off, 
          missingDocs: [...off.missingDocs, newDoc],
          history: [...(off.history || []), histEntry]
        };
      }
      return off;
    }));

    setDocInputs(prev => ({ ...prev, [offerId]: '' }));
  };

  const toggleDocStatus = (offerId: string, docId: string) => {
    setOffers(prev => prev.map(off => {
      if (off.id === offerId) {
        const doc = off.missingDocs.find(d => d.id === docId);
        if (!doc) return off;
        const newProvided = !doc.isProvided;
        const histEntry = logDocProvided(doc.name, newProvided, 'Personal RSA Inver');
        return {
          ...off,
          missingDocs: off.missingDocs.map(d => d.id === docId ? { ...d, isProvided: newProvided } : d),
          history: [...(off.history || []), histEntry]
        };
      }
      return off;
    }));
  };

  const deleteMissingDoc = (offerId: string, docId: string) => {
    setOffers(prev => prev.map(off => {
      if (off.id === offerId) {
        const doc = off.missingDocs.find(d => d.id === docId);
        const histEntry = doc ? logDocRemoved(doc.name, 'Personal RSA Inver') : null;
        return {
          ...off,
          missingDocs: off.missingDocs.filter(d => d.id !== docId),
          history: histEntry ? [...(off.history || []), histEntry] : off.history
        };
      }
      return off;
    }));
  };

  const deleteOffer = (offerId: string) => {
    if (confirm('¿Estás seguro de eliminar este expediente de compra?')) {
      setOffers(prev => prev.filter(o => o.id !== offerId));
    }
  };

  // Filtrar ofertas a renderizar
  const filteredOffers = offers.filter(o => {
    if (selectedInvestorFilter === 'all') return true;
    return o.investorId === selectedInvestorFilter;
  });

  return (
    <div className="space-y-8">
      
      {/* Banner Explicativo del Panel de Trabajo de RSA Inver */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-600" />
            <span>Panel Central del Equipo Comercial (BackOffice)</span>
          </h2>
          <p className="text-slate-600 text-xs mt-1 max-w-3xl leading-relaxed">
            Aquí es donde das de alta a cada cliente para asignarle sus claves únicas. Al anotar en qué fase se encuentra cada oferta e indicar si la documentación está validada o el PBC aprobado, el cliente lo verá todo sin tener que preguntar por WhatsApp ni correo electrónico.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportPortfolioReport(offers, investors)}
            className="bg-slate-900 hover:bg-amber-600 text-white hover:text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Genera un PDF ejecutivo con todos los KPIs y operaciones"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Exportar Cartera (PDF)</span>
          </button>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 text-xs font-mono flex flex-col justify-center items-center">
            <span className="font-bold text-sm block">📊 Totales</span>
            <span>{investors.length} Inversores</span>
            <span>{offers.length} Ofertas Activas</span>
          </div>
        </div>
      </div>

      {/* FILA SUPERIOR: Formularios de ALTA INVERSOR y LANZAR NUEVA OFERTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 1. FORMULARIO ALTA DE CLIENTE INVERSOR */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4 text-slate-800">
              <UserPlus className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                1. Dar de Alta a Cliente Inversor
              </h3>
            </div>

            <form onSubmit={handleAddInvestor} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Nombre de Usuario (Acceso) *
                </label>
                <input
                  type="text"
                  placeholder="ej. inversor_bcn"
                  value={newInvUsername}
                  onChange={(e) => setNewInvUsername(e.target.value.replace(/\s+/g, '_'))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Se usarán guiones bajos en lugar de espacios.</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Clave de Acceso *
                  </label>
                  <input
                    type="text"
                    value={newInvPassword}
                    onChange={(e) => setNewInvPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono text-amber-700 font-bold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Empresa / Grupo
                  </label>
                  <input
                    type="text"
                    placeholder="Inmobiliaria SL"
                    value={newInvCompany}
                    onChange={(e) => setNewInvCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Nombre Completo / Apoderado *
                </label>
                <input
                  type="text"
                  placeholder="Carlos Mendoza Silva"
                  value={newInvFullName}
                  onChange={(e) => setNewInvFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="email@dominio.com"
                    value={newInvEmail}
                    onChange={(e) => setNewInvEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Teléfono (WhatsApp)
                  </label>
                  <input
                    type="text"
                    placeholder="+34 600..."
                    value={newInvPhone}
                    onChange={(e) => setNewInvPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-slate-900 hover:bg-amber-600 text-white hover:text-slate-950 font-bold p-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Generar Credenciales & Inversor</span>
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-2.5 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Inversores Registrados Disponibles:</span>
            <div className="max-h-24 overflow-y-auto space-y-1">
              {investors.map(i => (
                <div key={i.id} className="flex items-center justify-between text-xs bg-white p-1 px-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-800 truncate max-w-[150px]">{i.fullName}</span>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-1 rounded">{i.username}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. FORMULARIO ASIGNAR INMUEBLE Y OFERTA LANZADA */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4 text-slate-800">
              <PlusCircle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                2. Registrar Oferta Lanzada por Inmueble
              </h3>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Selecciona al Cliente Inversor de la oferta *
                </label>
                <select
                  value={targetInvestorId}
                  onChange={(e) => setTargetInvestorId(e.target.value)}
                  className="w-full bg-amber-50/50 border border-amber-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                  required
                >
                  {investors.length === 0 ? (
                    <option value="">-- Da de alta un inversor primero --</option>
                  ) : (
                    investors.map(inv => (
                      <option key={inv.id} value={inv.id}>
                        {inv.fullName} ({inv.companyName || 'Particular'}) - {inv.username}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Título y Dirección del Activo / Inmueble *
                </label>
                <input
                  type="text"
                  placeholder="ej. Edificio 12 Viviendas C/ Goya 55, Madrid"
                  value={newAssetTitle}
                  onChange={(e) => setNewAssetTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Servicer o Banco *
                  </label>
                  <select
                    value={newServicer}
                    onChange={(e) => setNewServicer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Aliseda Inmobiliaria">Aliseda Inmobiliaria</option>
                    <option value="Anticipa / Blackstone">Anticipa / Blackstone</option>
                    <option value="Haya Real Estate">Haya Real Estate</option>
                    <option value="Solvia">Solvia</option>
                    <option value="Servihabitat">Servihabitat</option>
                    <option value="Sareb">Sareb</option>
                    <option value="Altamira">Altamira</option>
                    <option value="Banco Santander">Banco Santander directa</option>
                    <option value="BBVA Activos">BBVA Activos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Importe Ofertado (€) *
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={newOfferAmount}
                    onChange={(e) => setNewOfferAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 text-center"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Precio Salida (€)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-500 text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Fase Inicial en la que se encuentra *
                  </label>
                  <select
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value as OfferPhase)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {(Object.keys(PHASE_LABELS) as OfferPhase[]).map(key => (
                      <option key={key} value={key}>
                        {PHASE_LABELS[key].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Notas Internas / Estado Inicial
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Pasada oferta a comercial territorial..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white font-bold p-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Asignar Activo y Publicar en el Portal del Cliente</span>
              </button>
            </form>
          </div>

          <p className="text-[10px] text-slate-400 mt-3 text-center bg-slate-50 p-1 rounded italic">
            El cliente podrá entrar en cualquier momento con su usuario para ver esta ficha.
          </p>
        </div>

      </div>

      {/* SECCIÓN INFERIOR: GESTIÓN DE EXPEDIENTES Y FASES DE COMPRA DE FORMA ÁGIL */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Cabecera y Filtro de Expedientes */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Gestión Activa de Operaciones Inmobiliarias (Hitos & Fases)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cambia la fase para que el inversor vea el semáforo al instante. Añade qué documentación falta para que la aporten.
            </p>
          </div>

          {/* Filtro por inversor */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            <span className="text-xs font-bold text-slate-500 pl-1">Filtrar Inversor:</span>
            <select
              value={selectedInvestorFilter}
              onChange={(e) => setSelectedInvestorFilter(e.target.value)}
              className="bg-white text-xs font-bold rounded px-2 py-1 border border-slate-300 text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">⚡ Todos los clientes ({offers.length})</option>
              {investors.map(i => (
                <option key={i.id} value={i.id}>
                  {i.fullName} ({offers.filter(o => o.investorId === i.id).length} activos)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de tarjetas de cada Inmueble/Oferta */}
        {filteredOffers.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl mt-4 border border-dashed border-slate-300">
            <FileQuestion className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">
              No se encontraron ofertas para el filtro seleccionado. Genera una en el paso 2.
            </p>
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {filteredOffers.map((off) => {
              const inv = investors.find(i => i.id === off.investorId);
              const currentPhaseObj = PHASE_LABELS[off.phase];

              return (
                <div 
                  key={off.id}
                  className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/90 hover:border-amber-300 transition-all space-y-4"
                >
                  {/* Fila 1: Datos identificativos del Inversor y el Activo */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="bg-slate-900 text-white px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                          {off.reference}
                        </span>
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                          🏦 {off.bankOrServicer}
                        </span>
                        <span className="text-slate-500">
                          Fecha alta: <strong className="text-slate-700">{off.dateSubmitted}</strong>
                        </span>
                      </div>
                      
                      <h4 className="text-base font-extrabold text-slate-900 mt-1 font-serif tracking-tight">
                        {off.assetTitle}
                      </h4>
                      
                      <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Cliente Inversor asignado:</span>
                        <strong className="text-amber-800 font-bold bg-white px-1.5 py-0.2 rounded border border-amber-200">
                          {inv ? `${inv.fullName} (${inv.username})` : 'Inversor Desconocido'}
                        </strong>
                      </div>
                    </div>

                    {/* Importes y botón eliminar */}
                    <div className="flex items-center gap-4 self-start lg:self-auto bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                          Importe Lanzado
                        </span>
                        <span className="text-lg font-mono font-black text-slate-900">
                          {off.offerAmount.toLocaleString()} €
                        </span>
                        {off.originalPrice > 0 && (
                          <span className="text-[10px] text-slate-400 block line-through">
                            Salida: {off.originalPrice.toLocaleString()} €
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => deleteOffer(off.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors self-center"
                        title="Eliminar este expediente por completo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Fila 2: Selector de FASE (EL CORAZÓN DEL PROBLEMA) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start bg-white p-3 rounded-lg border border-slate-200">
                    
                    {/* Selector de semáforo general */}
                    <div className="lg:col-span-5 space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        Cambiar Fase del Activo en Tiempo Real:
                      </label>
                      <select
                        value={off.phase}
                        onChange={(e) => updateOfferPhase(off.id, e.target.value as OfferPhase)}
                        className={`w-full p-2 rounded-lg text-xs font-black border focus:outline-none cursor-pointer transition-colors ${currentPhaseObj.color}`}
                      >
                        {(Object.keys(PHASE_LABELS) as OfferPhase[]).map(key => (
                          <option key={key} value={key} className="bg-white text-slate-900 font-medium">
                            {PHASE_LABELS[key].label}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500 font-light leading-tight mt-1">
                        👉 <em>Al cambiarlo, el inversor verá este estado al ingresar.</em>
                      </p>
                    </div>

                    {/* Notas explicativas rápidas */}
                    <div className="lg:col-span-7 space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Notas y Mensaje de Novedades para el Inversor:
                      </label>
                      <textarea
                        value={off.notes}
                        onChange={(e) => updateOfferNotes(off.id, e.target.value)}
                        onBlur={() => commitNotesChange(off.id)}
                        rows={2}
                        placeholder="Escribe aquí si se requiere presentar poderes, si hay contraoferta o detalles de la notaría..."
                        className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:bg-white"
                      />
                    </div>

                  </div>

                  {/* Fila 3: GESTIÓN DE LA DOCUMENTACIÓN FALTANTE Y COMPLIANCE (PBC) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
                    
                    {/* Lista de Documentación faltante para este piso */}
                    <div className="lg:col-span-7 bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-amber-600" />
                          <span>Documentación para la compra requerida ({off.missingDocs.length}):</span>
                        </span>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium">
                          Check para marcar entregado
                        </span>
                      </div>

                      {off.missingDocs.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-1">
                          ✓ No se ha anotado ningún documento faltante.
                        </p>
                      ) : (
                        <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                          {off.missingDocs.map((doc) => (
                            <div 
                              key={doc.id}
                              className={`flex items-center justify-between p-1 px-2 rounded text-xs transition-colors ${
                                doc.isProvided ? 'bg-emerald-50 text-emerald-900 line-through' : 'bg-amber-50 text-amber-950 font-medium'
                              }`}
                            >
                              <div 
                                onClick={() => toggleDocStatus(off.id, doc.id)} 
                                className="flex items-center gap-2 cursor-pointer flex-1"
                              >
                                {doc.isProvided ? (
                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                )}
                                <span className="truncate max-w-[280px]">{doc.name}</span>
                              </div>

                              <button
                                onClick={() => deleteMissingDoc(off.id, doc.id)}
                                className="text-slate-300 hover:text-rose-500 p-0.5 ml-1"
                                title="Borrar documento de la lista"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Añadir nuevo documento a la lista */}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex gap-1">
                        <input
                          type="text"
                          placeholder="Solicitar nuevo documento (ej. DNI, IRPF, KYC...)"
                          value={docInputs[off.id] || ''}
                          onChange={(e) => setDocInputs(prev => ({ ...prev, [off.id]: e.target.value }))}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addMissingDoc(off.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => addMissingDoc(off.id)}
                          type="button"
                          className="bg-slate-800 hover:bg-amber-600 text-white px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Hito de Compliance PBC y Fijación de Notaría */}
                    <div className="lg:col-span-5 space-y-3 bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                      
                      {/* Control de PBC */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                          Validación Compliance (PBC):
                        </span>
                        <div 
                          onClick={() => togglePbc(off.id)}
                          className={`p-2 rounded-lg text-xs font-bold flex items-center justify-between cursor-pointer border transition-all ${
                            off.pbcPassed 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                              : 'bg-slate-50 border-slate-300 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <FileCheck className={`w-4 h-4 ${off.pbcPassed ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span>{off.pbcPassed ? '✓ Filtro PBC Aprobado por el Banco' : '⌛ PBC Pendiente / En Estudio'}</span>
                          </div>
                          <span className="text-[10px] underline font-mono">
                            {off.pbcPassed ? 'Cambiar a Pendiente' : 'Aprobar PBC'}
                          </span>
                        </div>
                      </div>

                       {/* Control de Fecha de Notaría */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          <span>Cita en Notaría / Fecha de Firma:</span>
                        </label>
                        <input
                          type="text"
                          placeholder="ej. 25 de Marzo a las 10:00h en Notaría Garrido"
                          value={off.signingDate || ''}
                          onChange={(e) => updateSigningDate(off.id, e.target.value)}
                          onBlur={(e) => commitSigningDate(off.id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-teal-950 font-bold focus:outline-none placeholder-slate-400"
                        />
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          Si rellenas este campo, se destacará como aviso máximo para el cliente.
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* HISTORIAL TIMELINE DE LA OPERACIÓN */}
                  <HistoryTimeline 
                    history={off.history || []} 
                    variant="full"
                    startCollapsed={true}
                  />

                  {/* Acciones de exportación PDF */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => inv && exportSingleOfferReport(off, inv)}
                      disabled={!inv}
                      className="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-300 hover:border-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Exportar este expediente individual a PDF"
                    >
                      <Download className="w-3 h-3" />
                      <span>Exportar Expediente (PDF)</span>
                    </button>

                    {inv && (
                      <button
                        onClick={() => exportInvestorReport(inv, offers)}
                        className="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-300 hover:border-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        title={`Exportar todos los expedientes del inversor ${inv.fullName}`}
                      >
                        <FileDown className="w-3 h-3" />
                        <span>PDF de {inv.fullName.split(' ')[0]}</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
