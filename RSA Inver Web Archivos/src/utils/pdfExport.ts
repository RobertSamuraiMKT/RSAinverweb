import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssetOffer, InvestorUser, PHASE_LABELS } from '../types/inver';
import { formatHistoryDate } from './history';

// Colores corporativos RSA Inver
const COLOR_AMBER = [217, 119, 6] as [number, number, number]; // amber-600
const COLOR_DARK = [15, 23, 42] as [number, number, number]; // slate-900
const COLOR_GRAY = [100, 116, 139] as [number, number, number]; // slate-500

/**
 * Añade la cabecera corporativa y devuelve la posición Y donde continuar
 */
function addHeader(doc: jsPDF, title: string, subtitle: string): number {
  // Banda dorada superior
  doc.setFillColor(...COLOR_AMBER);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 6, 'F');

  // Logo y nombre
  doc.setFillColor(...COLOR_DARK);
  doc.roundedRect(14, 12, 12, 12, 2, 2, 'F');
  doc.setTextColor(...COLOR_AMBER);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('R', 17.5, 21);

  doc.setTextColor(...COLOR_DARK);
  doc.setFontSize(18);
  doc.text('RSA INVER', 30, 19);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_GRAY);
  doc.text('Bank Assets · Inversión Inmobiliaria', 30, 24);

  // Título del informe (derecha)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text(title, doc.internal.pageSize.getWidth() - 14, 17, { align: 'right' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_GRAY);
  doc.text(subtitle, doc.internal.pageSize.getWidth() - 14, 22, { align: 'right' });

  // Línea separadora
  doc.setDrawColor(...COLOR_AMBER);
  doc.setLineWidth(0.4);
  doc.line(14, 28, doc.internal.pageSize.getWidth() - 14, 28);

  return 35;
}

/**
 * Añade el pie de página con número de página
 */
function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Línea
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

    doc.setFontSize(7);
    doc.setTextColor(...COLOR_GRAY);
    doc.setFont('helvetica', 'normal');
    
    // Izquierda: copyright
    doc.text('© RSA Inver - Documento confidencial generado automáticamente', 14, pageHeight - 7);
    
    // Centro: fecha
    const dateStr = new Date().toLocaleDateString('es-ES', { 
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    doc.text(`Generado: ${dateStr}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
    
    // Derecha: paginación
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
  }
}

/**
 * INFORME EJECUTIVO DE CARTERA (para Admin)
 * Resume todas las operaciones, KPIs, y desglose por inversor
 */
export function exportPortfolioReport(offers: AssetOffer[], investors: InvestorUser[]) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  
  let y = addHeader(doc, 'Informe Ejecutivo de Cartera', `${offers.length} operaciones · ${investors.length} inversores`);

  // === SECCIÓN: KPIs PRINCIPALES ===
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Indicadores Clave de Negocio (KPIs)', 14, y);
  y += 6;

  const totalOffered = offers.reduce((s, o) => s + o.offerAmount, 0);
  const totalOriginal = offers.reduce((s, o) => s + o.originalPrice, 0);
  const closed = offers.filter(o => o.phase === 'firma_fijada');
  const closedAmount = closed.reduce((s, o) => s + o.offerAmount, 0);
  const successRate = offers.length > 0 ? Math.round((closed.length / offers.length) * 100) : 0;
  const savings = totalOriginal - totalOffered;

  // Tarjetas KPI - dibujar manualmente como rectángulos
  const kpis = [
    { label: 'Operaciones', value: `${offers.length}`, sub: `${offers.length - offers.filter(o => o.phase === 'oferta_rechazada').length} activas` },
    { label: 'Volumen Ofertado', value: `${(totalOffered / 1000).toFixed(0)}k€`, sub: `Salida: ${(totalOriginal / 1000).toFixed(0)}k€` },
    { label: 'Cerradas (Firma)', value: `${closed.length}`, sub: `${(closedAmount / 1000).toFixed(0)}k€ formalizados` },
    { label: 'Tasa de Éxito', value: `${successRate}%`, sub: `Ahorro: ${(savings / 1000).toFixed(0)}k€` }
  ];

  const cardW = 44;
  const cardH = 22;
  const startX = 14;
  kpis.forEach((kpi, idx) => {
    const x = startX + idx * (cardW + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, cardW, cardH, 2, 2, 'FD');

    doc.setFontSize(7);
    doc.setTextColor(...COLOR_GRAY);
    doc.setFont('helvetica', 'bold');
    doc.text(kpi.label.toUpperCase(), x + 3, y + 5);

    doc.setFontSize(14);
    doc.setTextColor(...COLOR_DARK);
    doc.setFont('helvetica', 'bold');
    doc.text(kpi.value, x + 3, y + 13);

    doc.setFontSize(6.5);
    doc.setTextColor(...COLOR_GRAY);
    doc.setFont('helvetica', 'normal');
    doc.text(kpi.sub, x + 3, y + 18);
  });

  y += cardH + 8;

  // === SECCIÓN: DISTRIBUCIÓN POR FASE ===
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Distribución por Fase del Embudo', 14, y);
  y += 4;

  const phaseRows: string[][] = [];
  Object.entries(PHASE_LABELS).forEach(([phaseKey, phaseInfo]) => {
    const count = offers.filter(o => o.phase === phaseKey).length;
    const pct = offers.length > 0 ? ((count / offers.length) * 100).toFixed(1) : '0.0';
    const amount = offers.filter(o => o.phase === phaseKey).reduce((s, o) => s + o.offerAmount, 0);
    if (count > 0) {
      phaseRows.push([
        phaseInfo.label.replace(/^\d+\.\s*/, ''),
        count.toString(),
        `${pct}%`,
        `${amount.toLocaleString()} €`
      ]);
    }
  });

  autoTable(doc, {
    startY: y,
    head: [['Fase', 'Cantidad', '% del total', 'Volumen']],
    body: phaseRows,
    theme: 'striped',
    headStyles: { fillColor: COLOR_DARK, textColor: 255, fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: COLOR_DARK },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 }
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // === SECCIÓN: TABLA DE OPERACIONES ACTIVAS ===
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Detalle de Operaciones', 14, y);
  y += 4;

  const offerRows = offers.map(o => {
    const inv = investors.find(i => i.id === o.investorId);
    return [
      o.reference,
      o.assetTitle.length > 35 ? o.assetTitle.substring(0, 35) + '...' : o.assetTitle,
      inv?.fullName || '-',
      o.bankOrServicer,
      `${o.offerAmount.toLocaleString()} €`,
      PHASE_LABELS[o.phase].label.replace(/^\d+\.\s*/, ''),
      o.pbcPassed ? 'OK' : '-',
      o.signingDate ? '✓' : '-'
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['Ref.', 'Activo', 'Inversor', 'Servicer', 'Importe', 'Fase', 'PBC', 'Firma']],
    body: offerRows,
    theme: 'grid',
    headStyles: { fillColor: COLOR_AMBER, textColor: 255, fontSize: 7, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7, textColor: COLOR_DARK },
    alternateRowStyles: { fillColor: [254, 252, 232] },
    columnStyles: {
      0: { cellWidth: 22, fontStyle: 'bold' },
      4: { halign: 'right', fontStyle: 'bold' },
      6: { halign: 'center' },
      7: { halign: 'center' }
    },
    margin: { left: 14, right: 14 }
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // === SECCIÓN: RESUMEN POR INVERSOR ===
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Resumen por Inversor', 14, y);
  y += 4;

  const investorRows = investors.map(inv => {
    const myOffers = offers.filter(o => o.investorId === inv.id);
    const myClosed = myOffers.filter(o => o.phase === 'firma_fijada').length;
    const myAmount = myOffers.reduce((s, o) => s + o.offerAmount, 0);
    return [
      inv.fullName,
      inv.companyName || 'Particular',
      inv.email,
      myOffers.length.toString(),
      myClosed.toString(),
      `${myAmount.toLocaleString()} €`
    ];
  }).sort((a, b) => parseFloat(b[5].replace(/[^\d]/g, '')) - parseFloat(a[5].replace(/[^\d]/g, '')));

  autoTable(doc, {
    startY: y,
    head: [['Inversor', 'Empresa', 'Email', 'Operaciones', 'Cerradas', 'Volumen']],
    body: investorRows,
    theme: 'grid',
    headStyles: { fillColor: COLOR_DARK, textColor: 255, fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: COLOR_DARK },
    columnStyles: {
      3: { halign: 'center' },
      4: { halign: 'center', fontStyle: 'bold' },
      5: { halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: 14, right: 14 }
  });

  // Footer
  addFooter(doc);

  // Guardar
  const filename = `RSA_Inver_Informe_Cartera_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

/**
 * INFORME INDIVIDUAL DE EXPEDIENTE (para Inversor o Admin)
 * Detalle completo de una sola operación incluyendo timeline
 */
export function exportSingleOfferReport(offer: AssetOffer, investor: InvestorUser) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  
  let y = addHeader(
    doc, 
    `Expediente ${offer.reference}`, 
    investor.fullName
  );

  // === DATOS PRINCIPALES DEL ACTIVO ===
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, y, 182, 24, 2, 2, 'F');
  
  doc.setTextColor(217, 119, 6);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('ACTIVO INMOBILIARIO', 18, y + 6);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text(offer.assetTitle.substring(0, 60), 18, y + 12);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text(`Servicer: ${offer.bankOrServicer}  ·  Lanzada: ${offer.dateSubmitted}  ·  Ref: ${offer.reference}`, 18, y + 18);

  // Importe destacado a la derecha
  doc.setTextColor(217, 119, 6);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${offer.offerAmount.toLocaleString()} €`, 192, y + 14, { align: 'right' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text(`Salida: ${offer.originalPrice.toLocaleString()} €`, 192, y + 19, { align: 'right' });

  y += 30;

  // === DATOS DEL INVERSOR ===
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Datos del Inversor', 14, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    body: [
      ['Nombre completo', investor.fullName],
      ['Empresa / Grupo', investor.companyName || 'Particular'],
      ['Email de contacto', investor.email],
      ['Teléfono / WhatsApp', investor.phone],
      ['Usuario de portal', investor.username]
    ],
    theme: 'plain',
    bodyStyles: { fontSize: 8, textColor: COLOR_DARK },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50, textColor: COLOR_GRAY },
      1: { fontStyle: 'normal' }
    },
    margin: { left: 14, right: 14 }
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  // === ESTADO ACTUAL ===
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Estado Actual del Expediente', 14, y);
  y += 5;

  const phaseInfo = PHASE_LABELS[offer.phase];
  
  autoTable(doc, {
    startY: y,
    body: [
      ['Fase actual', phaseInfo.label],
      ['Descripción', phaseInfo.desc],
      ['PBC / Compliance', offer.pbcPassed ? '✓ APROBADO' : '⌛ Pendiente'],
      ['Cita en Notaría', offer.signingDate || 'No programada todavía'],
      ['Última nota', offer.notes || 'Sin notas']
    ],
    theme: 'plain',
    bodyStyles: { fontSize: 8, textColor: COLOR_DARK },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50, textColor: COLOR_GRAY },
      1: { fontStyle: 'normal' }
    },
    margin: { left: 14, right: 14 }
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  // === DOCUMENTACIÓN ===
  if (offer.missingDocs.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLOR_DARK);
    doc.text(`Documentación Requerida (${offer.missingDocs.length})`, 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [['Documento', 'Estado']],
      body: offer.missingDocs.map(d => [d.name, d.isProvided ? '✓ Entregado' : '⌛ Pendiente']),
      theme: 'striped',
      headStyles: { fillColor: COLOR_AMBER, textColor: 255, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8, textColor: COLOR_DARK },
      columnStyles: {
        1: { halign: 'center', cellWidth: 35, fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14 }
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  }

  // === HISTORIAL / TIMELINE ===
  if (offer.history && offer.history.length > 0) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLOR_DARK);
    doc.text(`Historial Auditable de Cambios (${offer.history.length} eventos)`, 14, y);
    y += 4;

    const sortedHistory = [...offer.history].sort((a, b) => b.timestamp - a.timestamp);

    autoTable(doc, {
      startY: y,
      head: [['Fecha y Hora', 'Evento', 'Detalle', 'Usuario']],
      body: sortedHistory.map(h => [
        formatHistoryDate(h.timestamp),
        h.title,
        h.description,
        h.user
      ]),
      theme: 'grid',
      headStyles: { fillColor: COLOR_DARK, textColor: 255, fontSize: 7, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7, textColor: COLOR_DARK, valign: 'top' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 32, fontStyle: 'bold' },
        1: { cellWidth: 45, fontStyle: 'bold', textColor: COLOR_AMBER },
        3: { cellWidth: 35, fontSize: 6 }
      },
      margin: { left: 14, right: 14 }
    });
  }

  // Footer
  addFooter(doc);

  const filename = `RSA_Inver_Expediente_${offer.reference}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

/**
 * INFORME PARA UN ÚNICO INVERSOR (todos sus expedientes)
 * Útil para enviarle un resumen mensual al cliente
 */
export function exportInvestorReport(investor: InvestorUser, offers: AssetOffer[]) {
  const myOffers = offers.filter(o => o.investorId === investor.id);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  let y = addHeader(
    doc, 
    'Resumen de Operaciones', 
    `${investor.fullName} · ${myOffers.length} expedientes`
  );

  // === BLOQUE INVERSOR ===
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, y, 182, 22, 2, 2, 'F');
  
  doc.setTextColor(217, 119, 6);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('INVERSOR', 18, y + 6);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text(investor.fullName, 18, y + 12);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text(`${investor.companyName || 'Particular'}  ·  ${investor.email}  ·  ${investor.phone}`, 18, y + 18);

  y += 28;

  // === KPIs DEL INVERSOR ===
  const totalAmount = myOffers.reduce((s, o) => s + o.offerAmount, 0);
  const closed = myOffers.filter(o => o.phase === 'firma_fijada').length;
  const inProgress = myOffers.filter(o => o.phase !== 'firma_fijada' && o.phase !== 'oferta_rechazada').length;

  const myKpis = [
    { label: 'Operaciones', value: myOffers.length.toString() },
    { label: 'En curso', value: inProgress.toString() },
    { label: 'Cerradas', value: closed.toString() },
    { label: 'Volumen total', value: `${(totalAmount / 1000).toFixed(0)}k€` }
  ];

  const cardW = 44;
  const cardH = 18;
  myKpis.forEach((k, idx) => {
    const x = 14 + idx * (cardW + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, cardW, cardH, 2, 2, 'FD');

    doc.setFontSize(7);
    doc.setTextColor(...COLOR_GRAY);
    doc.setFont('helvetica', 'bold');
    doc.text(k.label.toUpperCase(), x + 3, y + 5);

    doc.setFontSize(13);
    doc.setTextColor(...COLOR_AMBER);
    doc.setFont('helvetica', 'bold');
    doc.text(k.value, x + 3, y + 13);
  });

  y += cardH + 8;

  // === TABLA DE EXPEDIENTES ===
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Mis Expedientes Activos', 14, y);
  y += 4;

  if (myOffers.length === 0) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...COLOR_GRAY);
    doc.text('Sin operaciones registradas todavía.', 14, y + 5);
  } else {
    autoTable(doc, {
      startY: y,
      head: [['Ref.', 'Activo', 'Servicer', 'Importe', 'Fase actual', 'PBC', 'Firma']],
      body: myOffers.map(o => [
        o.reference,
        o.assetTitle.length > 35 ? o.assetTitle.substring(0, 35) + '...' : o.assetTitle,
        o.bankOrServicer,
        `${o.offerAmount.toLocaleString()} €`,
        PHASE_LABELS[o.phase].label.replace(/^\d+\.\s*/, ''),
        o.pbcPassed ? 'OK' : '-',
        o.signingDate ? '✓' : '-'
      ]),
      theme: 'grid',
      headStyles: { fillColor: COLOR_AMBER, textColor: 255, fontSize: 7, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7, textColor: COLOR_DARK },
      alternateRowStyles: { fillColor: [254, 252, 232] },
      columnStyles: {
        0: { cellWidth: 22, fontStyle: 'bold' },
        3: { halign: 'right', fontStyle: 'bold' },
        5: { halign: 'center' },
        6: { halign: 'center' }
      },
      margin: { left: 14, right: 14 }
    });
  }

  addFooter(doc);

  const filename = `RSA_Inver_Resumen_${investor.username}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
