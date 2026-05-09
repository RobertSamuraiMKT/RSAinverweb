export type OfferPhase = 
  | 'oferta_enviada' 
  | 'oferta_aceptada' 
  | 'doc_pendiente' 
  | 'doc_completa' 
  | 'pbc_ok' 
  | 'firma_fijada'
  | 'oferta_rechazada';

export interface MissingDoc {
  id: string;
  name: string;
  isProvided: boolean;
}

export type HistoryEventType = 
  | 'created' 
  | 'phase_changed' 
  | 'pbc_approved' 
  | 'pbc_revoked'
  | 'doc_added' 
  | 'doc_provided' 
  | 'doc_pending' 
  | 'doc_removed'
  | 'signing_scheduled' 
  | 'signing_updated'
  | 'note_updated';

export interface HistoryEntry {
  id: string;
  timestamp: number; // ms
  type: HistoryEventType;
  title: string; // título corto del evento
  description: string; // detalle ampliado
  user: string; // quién lo registró ('Sistema RSA Inver', 'Cliente Inversor', etc.)
  fromValue?: string; // estado anterior
  toValue?: string; // estado nuevo
}

export interface AssetOffer {
  id: string;
  investorId: string;
  assetTitle: string; // ej. "Piso Calle Alcalá 412, Madrid"
  bankOrServicer: string; // ej. "Aliseda", "Anticipa", "Solvia", "Haya Real Estate"
  offerAmount: number;
  originalPrice: number;
  phase: OfferPhase;
  dateSubmitted: string;
  missingDocs: MissingDoc[];
  pbcPassed: boolean;
  signingDate?: string; // Fecha y hora si existe
  notes: string; // Notas internas o para el cliente
  reference: string; // REF del inmueble
  history: HistoryEntry[]; // Auditoría de cambios cronológicos
}

export interface InvestorUser {
  id: string;
  username: string; // ej. "carlos.inver"
  password: string; // Clave para que entre
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  createdAt: string;
}

export type NotificationChannel = 'email' | 'whatsapp' | 'portal';

export interface AppNotification {
  id: string;
  investorId: string;
  offerId: string;
  assetTitle: string;
  reference: string;
  message: string;
  subject: string;
  phase?: OfferPhase;
  channels: NotificationChannel[]; // por dónde se enviaría
  isRead: boolean;
  createdAt: number; // Timestamp en ms
  type: 'phase_change' | 'doc_request' | 'pbc_approved' | 'signing_scheduled' | 'note_update' | 'general';
}

// Datos iniciales de prueba para que la app esté completamente llena de contenido listo para ser usado por RSA Inver
export const INITIAL_INVESTORS: InvestorUser[] = [
  {
    id: 'inv-1',
    username: 'carlos_madrid',
    password: 'rsa2026',
    fullName: 'Carlos Mendoza Silva',
    email: 'carlos.mendoza@inversionescms.com',
    phone: '+34 611 223 344',
    companyName: 'Mendoza Properties SL',
    createdAt: '10 Ene 2026'
  },
  {
    id: 'inv-2',
    username: 'martina_capital',
    password: 'rsa2026',
    fullName: 'Martina Valls Puig',
    email: 'mvalls@patrimonialvalls.es',
    phone: '+34 644 556 677',
    companyName: 'Inversiones Valls & Asoc',
    createdAt: '15 Ene 2026'
  },
  {
    id: 'inv-3',
    username: 'grupo_norte',
    password: 'rsa2026',
    fullName: 'Javier Echevarría',
    email: 'direccion@gruponorteinver.com',
    phone: '+34 688 990 011',
    companyName: 'Grupo Norte Activos',
    createdAt: '02 Feb 2026'
  }
];

// Helper para generar timestamps realistas a partir de una fecha base
const tsFromDate = (dateStr: string, hour: number = 10, min: number = 0): number => {
  const d = new Date(dateStr);
  d.setHours(hour, min, 0, 0);
  return d.getTime();
};

export const INITIAL_OFFERS: AssetOffer[] = [
  {
    id: 'off-101',
    investorId: 'inv-1',
    assetTitle: 'Edificio Residencial 4 Viviendas - C/ Águilas 12',
    bankOrServicer: 'Aliseda Inmobiliaria',
    offerAmount: 280000,
    originalPrice: 350000,
    phase: 'firma_fijada',
    dateSubmitted: '2026-01-12',
    missingDocs: [
      { id: 'd1', name: 'DNI del administrador compulsado', isProvided: true },
      { id: 'd2', name: 'Escritura de constitución de la sociedad', isProvided: true },
      { id: 'd3', name: 'Justificante de fondos (Certificado bancario)', isProvided: true },
      { id: 'd4', name: 'Formulario KYC del Banco firmado', isProvided: true }
    ],
    pbcPassed: true,
    signingDate: '2026-03-15 a las 11:30h - Notaría Don Alberto Garrido',
    notes: 'Documentación completa y validada por el departamento de Compliance del banco. Arras preparadas y notaría confirmada.',
    reference: 'REF-ALI-8834',
    history: [
      { id: 'h1', timestamp: tsFromDate('2026-01-12', 9, 30), type: 'created', title: 'Expediente abierto', description: 'Oferta de 280.000 € lanzada a Aliseda Inmobiliaria.', user: 'Sistema RSA Inver' },
      { id: 'h2', timestamp: tsFromDate('2026-01-15', 11, 15), type: 'phase_changed', title: 'Oferta aceptada', description: 'El comité de Aliseda valida el precio.', user: 'Carlos Vera (RSA Inver)', fromValue: 'Oferta enviada', toValue: 'Oferta aceptada' },
      { id: 'h3', timestamp: tsFromDate('2026-01-16', 10, 0), type: 'doc_added', title: 'Solicitada documentación', description: 'Añadidos 4 documentos requeridos por el banco.', user: 'Carlos Vera (RSA Inver)' },
      { id: 'h4', timestamp: tsFromDate('2026-01-22', 16, 45), type: 'doc_provided', title: 'Documentación completada', description: 'El cliente ha entregado todos los documentos.', user: 'Cliente Inversor' },
      { id: 'h5', timestamp: tsFromDate('2026-02-01', 12, 0), type: 'phase_changed', title: 'Doc completa - revisión', description: 'Pasa a revisión por departamento de Compliance.', user: 'Carlos Vera (RSA Inver)', fromValue: 'Falta doc', toValue: 'Doc completa' },
      { id: 'h6', timestamp: tsFromDate('2026-02-18', 14, 20), type: 'pbc_approved', title: '✓ PBC aprobado', description: 'Compliance valida el origen de los fondos.', user: 'Aliseda Inmobiliaria' },
      { id: 'h7', timestamp: tsFromDate('2026-02-25', 17, 30), type: 'signing_scheduled', title: '📅 Notaría programada', description: 'Cita confirmada para el 15 de Marzo.', user: 'Carlos Vera (RSA Inver)', toValue: '2026-03-15 11:30h' }
    ]
  },
  {
    id: 'off-102',
    investorId: 'inv-1',
    assetTitle: 'Local Comercial 180m² - Av. Albufera 84',
    bankOrServicer: 'Haya Real Estate',
    offerAmount: 145000,
    originalPrice: 190000,
    phase: 'doc_pendiente',
    dateSubmitted: '2026-02-05',
    missingDocs: [
      { id: 'd5', name: 'Declaración de titularidad real (Acta notarial)', isProvided: false },
      { id: 'd6', name: 'Acreditación de procedencia de fondos', isProvided: true },
      { id: 'd7', name: 'Último Impuesto de Sociedades presentado', isProvided: false }
    ],
    pbcPassed: false,
    notes: 'Haya RE ha pre-aceptado el precio, pero nos exigen adjuntar la titularidad real actualizada antes de pasarlo al comité de PBC.',
    reference: 'REF-HAY-1092',
    history: [
      { id: 'h8', timestamp: tsFromDate('2026-02-05', 10, 0), type: 'created', title: 'Expediente abierto', description: 'Oferta de 145.000 € lanzada a Haya Real Estate.', user: 'Sistema RSA Inver' },
      { id: 'h9', timestamp: tsFromDate('2026-02-12', 13, 45), type: 'phase_changed', title: 'Pre-aceptación de precio', description: 'Haya solicita docs adicionales antes de aprobar.', user: 'Marta Ruiz (RSA Inver)', fromValue: 'Oferta enviada', toValue: 'Falta documentación' },
      { id: 'h10', timestamp: tsFromDate('2026-02-13', 9, 20), type: 'doc_added', title: 'Documentación solicitada', description: 'Añadidos 3 documentos requeridos por el banco.', user: 'Marta Ruiz (RSA Inver)' },
      { id: 'h11', timestamp: tsFromDate('2026-02-20', 11, 10), type: 'doc_provided', title: 'Documento entregado', description: 'Cliente aporta acreditación de fondos.', user: 'Cliente Inversor' }
    ]
  },
  {
    id: 'off-103',
    investorId: 'inv-2',
    assetTitle: 'Lote 3 Pisos Alquilados - Sector Ensanche',
    bankOrServicer: 'Anticipa / Blackstone',
    offerAmount: 310000,
    originalPrice: 380000,
    phase: 'oferta_aceptada',
    dateSubmitted: '2026-02-10',
    missingDocs: [
      { id: 'd8', name: 'DNI en vigor de Martina Valls', isProvided: true },
      { id: 'd9', name: 'Ficha de conocimiento del cliente (KYC) completa', isProvided: true }
    ],
    pbcPassed: false,
    notes: '¡Oferta aceptada formalmente por el comité! Estamos recopilando los anexos para lanzar el circuito de firmas digitales.',
    reference: 'REF-ANT-5541',
    history: [
      { id: 'h12', timestamp: tsFromDate('2026-02-10', 9, 0), type: 'created', title: 'Expediente abierto', description: 'Oferta de 310.000 € lanzada a Anticipa.', user: 'Sistema RSA Inver' },
      { id: 'h13', timestamp: tsFromDate('2026-02-21', 16, 30), type: 'phase_changed', title: '🎉 Oferta aceptada', description: 'El comité de Blackstone aprueba el importe.', user: 'Marta Ruiz (RSA Inver)', fromValue: 'Oferta enviada', toValue: 'Oferta aceptada' },
      { id: 'h14', timestamp: tsFromDate('2026-02-22', 10, 0), type: 'doc_added', title: 'Documentación KYC requerida', description: 'Añadidos 2 documentos básicos.', user: 'Marta Ruiz (RSA Inver)' },
      { id: 'h15', timestamp: tsFromDate('2026-02-23', 18, 15), type: 'doc_provided', title: 'Documentación completa', description: 'Cliente entrega DNI y ficha KYC.', user: 'Cliente Inversor' }
    ]
  },
  {
    id: 'off-104',
    investorId: 'inv-2',
    assetTitle: 'Chalet Adosado a reformar - Urb. Los Pinos',
    bankOrServicer: 'Solvia',
    offerAmount: 115000,
    originalPrice: 140000,
    phase: 'oferta_enviada',
    dateSubmitted: '2026-02-22',
    missingDocs: [],
    pbcPassed: false,
    notes: 'Lanzada oferta al gestor de Solvia. A la espera de respuesta del comité territorial que se reúne este viernes.',
    reference: 'REF-SOL-9011',
    history: [
      { id: 'h16', timestamp: tsFromDate('2026-02-22', 11, 0), type: 'created', title: 'Expediente abierto', description: 'Oferta de 115.000 € lanzada a Solvia.', user: 'Sistema RSA Inver' },
      { id: 'h17', timestamp: tsFromDate('2026-02-23', 9, 30), type: 'note_updated', title: 'Comentario añadido', description: 'Comité territorial reunido el viernes.', user: 'Carlos Vera (RSA Inver)' }
    ]
  },
  {
    id: 'off-105',
    investorId: 'inv-3',
    assetTitle: 'Nave Industrial 800m² - Polígono Centro',
    bankOrServicer: 'Servihabitat',
    offerAmount: 220000,
    originalPrice: 265000,
    phase: 'pbc_ok',
    dateSubmitted: '2026-01-28',
    missingDocs: [
      { id: 'd10', name: 'Certificado de cuenta bancaria para devolución de fianza', isProvided: true }
    ],
    pbcPassed: true,
    notes: 'Aprobado el filtro de Prevención de Blanqueo de Capitales (PBC). Solicitando minuta de compraventa al banco para fijar firma.',
    reference: 'REF-SRV-4432',
    history: [
      { id: 'h18', timestamp: tsFromDate('2026-01-28', 10, 0), type: 'created', title: 'Expediente abierto', description: 'Oferta de 220.000 € lanzada a Servihabitat.', user: 'Sistema RSA Inver' },
      { id: 'h19', timestamp: tsFromDate('2026-02-03', 12, 45), type: 'phase_changed', title: 'Oferta aceptada', description: 'Servihabitat valida precio.', user: 'Carlos Vera (RSA Inver)', fromValue: 'Oferta enviada', toValue: 'Oferta aceptada' },
      { id: 'h20', timestamp: tsFromDate('2026-02-08', 15, 20), type: 'doc_added', title: 'Documentación solicitada', description: 'Añadido 1 documento bancario.', user: 'Carlos Vera (RSA Inver)' },
      { id: 'h21', timestamp: tsFromDate('2026-02-12', 10, 30), type: 'doc_provided', title: 'Documento entregado', description: 'Cliente entrega certificado bancario.', user: 'Cliente Inversor' },
      { id: 'h22', timestamp: tsFromDate('2026-02-15', 11, 0), type: 'phase_changed', title: 'Doc completa', description: 'Pasa a revisión interna.', user: 'Carlos Vera (RSA Inver)', fromValue: 'Falta doc', toValue: 'Doc completa' },
      { id: 'h23', timestamp: tsFromDate('2026-02-24', 16, 0), type: 'pbc_approved', title: '✓ PBC aprobado', description: 'Compliance autoriza la operación.', user: 'Servihabitat' }
    ]
  }
];

export const PHASE_LABELS: Record<OfferPhase, { label: string; desc: string; color: string; badge: string }> = {
  oferta_enviada: {
    label: '1. Oferta Enviada al Banco/Servicer',
    desc: 'La oferta ha sido comunicada formalmente al asset manager y está pendiente de respuesta del comité.',
    color: 'border-blue-500 bg-blue-50 text-blue-800',
    badge: 'bg-blue-100 text-blue-800'
  },
  oferta_aceptada: {
    label: '2. Oferta Aceptada en Precio',
    desc: 'El banco ha validado el importe económico. Se inicia el expediente de compra formal.',
    color: 'border-purple-500 bg-purple-50 text-purple-800',
    badge: 'bg-purple-100 text-purple-800'
  },
  doc_pendiente: {
    label: '3. Recopilando / Falta Documentación',
    desc: 'Falta aportar documentos imprescindibles (DNI, poderes, KYC, fondos) para pasar el control de Compliance.',
    color: 'border-amber-500 bg-amber-50 text-amber-800',
    badge: 'bg-amber-100 text-amber-800'
  },
  doc_completa: {
    label: '4. Documentación Completa',
    desc: 'Toda la documentación está subida y lista. El expediente se encuentra en revisión interna.',
    color: 'border-sky-500 bg-sky-50 text-sky-800',
    badge: 'bg-sky-100 text-sky-800'
  },
  pbc_ok: {
    label: '5. Control PBC / Compliance Aprobado',
    desc: 'El banco ha validado positivamente la procedencia de fondos (PBC superado). Autorizados para firmar.',
    color: 'border-emerald-500 bg-emerald-50 text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-800'
  },
  firma_fijada: {
    label: '6. ¡Fecha de Firma Programada!',
    desc: 'Operación cerrada en fechas. Todo coordinado en Notaría para la elevación a público.',
    color: 'border-teal-600 bg-teal-50 text-teal-900 font-bold',
    badge: 'bg-teal-100 text-teal-900 font-extrabold'
  },
  oferta_rechazada: {
    label: 'Oferta Rechazada / Contraoferta',
    desc: 'El servicer no acepta el importe propuesto. Revisa las notas para proponer una mejora.',
    color: 'border-rose-500 bg-rose-50 text-rose-800',
    badge: 'bg-rose-100 text-rose-800'
  }
};
