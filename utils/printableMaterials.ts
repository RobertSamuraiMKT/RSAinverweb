import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InvestorUser } from '../types/inver';

// Colores corporativos RSA Inver
const COLOR_AMBER = [217, 119, 6] as [number, number, number];
const COLOR_DARK = [15, 23, 42] as [number, number, number];
const COLOR_GRAY = [100, 116, 139] as [number, number, number];

/**
 * Helper: añadir cabecera corporativa
 */
function addBrandedHeader(doc: jsPDF, title: string, subtitle: string = ''): number {
  // Banda dorada superior
  doc.setFillColor(...COLOR_AMBER);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 6, 'F');

  // Logo
  doc.setFillColor(...COLOR_DARK);
  doc.roundedRect(14, 12, 12, 12, 2, 2, 'F');
  doc.setTextColor(...COLOR_AMBER);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('R', 17.5, 21);

  doc.setTextColor(...COLOR_DARK);
  doc.setFontSize(18);
  doc.text('RSA INVER', 30, 19);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_GRAY);
  doc.text('Bank Assets · Inversión Inmobiliaria Profesional', 30, 24);

  // Título a la derecha
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text(title, doc.internal.pageSize.getWidth() - 14, 17, { align: 'right' });
  if (subtitle) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLOR_GRAY);
    doc.text(subtitle, doc.internal.pageSize.getWidth() - 14, 22, { align: 'right' });
  }

  doc.setDrawColor(...COLOR_AMBER);
  doc.setLineWidth(0.4);
  doc.line(14, 28, doc.internal.pageSize.getWidth() - 14, 28);

  return 35;
}

/**
 * Helper: pie de página corporativo
 */
function addBrandedFooter(doc: jsPDF, customText?: string) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

    doc.setFontSize(7);
    doc.setTextColor(...COLOR_GRAY);
    doc.setFont('helvetica', 'normal');
    
    doc.text(customText || '© RSA Inver - Documento confidencial', 14, pageHeight - 7);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
  }
}



// =====================================================================
// 1. MANUAL DE BIENVENIDA AL CLIENTE INVERSOR
// =====================================================================
export function exportClientWelcomeManual(investor?: InvestorUser, portalUrl: string = 'portal.rsainver.com') {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // ===== PÁGINA 1: PORTADA Y BIENVENIDA =====
  let y = addBrandedHeader(doc, 'MANUAL DE BIENVENIDA', investor ? investor.fullName : 'Cliente Inversor');

  // Portada con imagen abstracta
  doc.setFillColor(...COLOR_DARK);
  doc.roundedRect(14, y, pageWidth - 28, 80, 4, 4, 'F');

  // Banda dorada lateral
  doc.setFillColor(...COLOR_AMBER);
  doc.roundedRect(14, y, 4, 80, 2, 2, 'F');

  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BIENVENIDO/A A SU PORTAL PRIVADO', 25, y + 15);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Su inversión,', 25, y + 32);
  doc.setTextColor(...COLOR_AMBER);
  doc.text('siempre en su mano.', 25, y + 44);

  doc.setTextColor(220, 220, 220);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const introText = doc.splitTextToSize(
    'Acabamos de habilitarle el acceso a la plataforma digital de seguimiento de sus operaciones inmobiliarias. A partir de ahora podrá consultar el estado de cada compra de bancos en tiempo real, las 24 horas del día, desde cualquier dispositivo.',
    pageWidth - 50
  );
  doc.text(introText, 25, y + 56);

  y += 90;

  // 3 PASOS RÁPIDOS PARA ACCEDER
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Cómo acceder en 3 pasos sencillos', 14, y);
  y += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_GRAY);
  doc.text('No necesita instalar nada. Funciona en su móvil, tablet, Mac o PC.', 14, y);
  y += 8;

  // Paso 1
  doc.setFillColor(254, 243, 199); // amber-100
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'F');
  doc.setFillColor(...COLOR_AMBER);
  doc.circle(22, y + 11, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1', 20.3, y + 13);
  doc.setTextColor(...COLOR_DARK);
  doc.setFontSize(11);
  doc.text('Abra el navegador de su dispositivo', 32, y + 9);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_GRAY);
  doc.text('Safari, Chrome, Firefox, Edge... cualquiera que use habitualmente.', 32, y + 14);
  doc.text('No necesita descargar ninguna aplicación.', 32, y + 18);
  y += 25;

  // Paso 2
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'F');
  doc.setFillColor(...COLOR_AMBER);
  doc.circle(22, y + 11, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2', 20.3, y + 13);
  doc.setTextColor(...COLOR_DARK);
  doc.setFontSize(11);
  doc.text('Escriba la dirección web', 32, y + 9);
  doc.setFontSize(11);
  doc.setFont('courier', 'bold');
  doc.setTextColor(...COLOR_AMBER);
  doc.text(portalUrl, 32, y + 16);
  y += 25;

  // Paso 3
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'F');
  doc.setFillColor(...COLOR_AMBER);
  doc.circle(22, y + 11, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('3', 20.3, y + 13);
  doc.setTextColor(...COLOR_DARK);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Introduzca su usuario y contraseña', 32, y + 9);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_GRAY);
  doc.text('Encontrará sus credenciales en la página siguiente de este documento.', 32, y + 14);
  doc.text('Le recomendamos cambiar la contraseña tras el primer acceso.', 32, y + 18);

  addBrandedFooter(doc, '© RSA Inver - Manual de Bienvenida del Inversor');

  // ===== PÁGINA 2: CREDENCIALES Y QUE PODRÁ HACER =====
  doc.addPage();
  y = addBrandedHeader(doc, 'SUS CREDENCIALES', 'Acceso privado y seguro');

  // Caja de credenciales destacada
  doc.setFillColor(...COLOR_DARK);
  doc.roundedRect(14, y, pageWidth - 28, 55, 4, 4, 'F');

  doc.setFillColor(...COLOR_AMBER);
  doc.roundedRect(14, y, 4, 55, 2, 2, 'F');

  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('TARJETA DE ACCESO PERSONAL', 25, y + 9);

  // URL
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('DIRECCIÓN WEB DEL PORTAL', 25, y + 17);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('courier', 'bold');
  doc.text(portalUrl, 25, y + 24);

  // Usuario
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('NOMBRE DE USUARIO', 25, y + 33);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('courier', 'bold');
  doc.text(investor?.username || '________________', 25, y + 40);

  // Clave
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('CONTRASEÑA TEMPORAL', 110, y + 33);
  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(13);
  doc.setFont('courier', 'bold');
  doc.text(investor?.password || '________________', 110, y + 40);

  // Aviso de seguridad
  doc.setTextColor(255, 200, 200);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.text('IMPORTANTE: Mantenga estas credenciales en un lugar seguro y no las comparta con terceros.', 25, y + 50);

  y += 65;

  // ¿QUÉ PODRÁ HACER?
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('¿Qué podrá hacer en el portal?', 14, y);
  y += 8;

  const features = [
    { icon: 'CONSULTAR', title: 'El estado en tiempo real de sus operaciones', desc: 'Sabrá si la oferta está enviada, aceptada, en revisión o con fecha de notaría confirmada.' },
    { icon: 'REVISAR', title: 'La documentación pendiente de aportar', desc: 'El portal le indicará exactamente qué documentos faltan y a qué email enviarlos.' },
    { icon: 'VERIFICAR', title: 'El estado del filtro PBC del banco', desc: 'Conocerá si el departamento de Compliance ha aprobado el origen de los fondos.' },
    { icon: 'DESCARGAR', title: 'Informes en PDF de sus expedientes', desc: 'Podrá generar resúmenes profesionales para su asesor fiscal o gestor.' },
    { icon: 'CONSULTAR', title: 'El historial completo de cada operación', desc: 'Cada movimiento queda registrado con fecha y hora para total transparencia.' }
  ];

  features.forEach((feature) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, pageWidth - 28, 18, 2, 2, 'FD');

    doc.setFillColor(...COLOR_AMBER);
    doc.roundedRect(14, y, 28, 18, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(feature.icon, 28, y + 11, { align: 'center' });

    doc.setTextColor(...COLOR_DARK);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(feature.title, 47, y + 8);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLOR_GRAY);
    const descLines = doc.splitTextToSize(feature.desc, pageWidth - 65);
    doc.text(descLines, 47, y + 13);

    y += 21;
  });

  addBrandedFooter(doc, '© RSA Inver - Manual de Bienvenida del Inversor');

  // ===== PÁGINA 3: CÓMO INSTALARLO COMO APP + AYUDA =====
  doc.addPage();
  y = addBrandedHeader(doc, 'TENER LA APP A MANO', 'Instalación opcional en su dispositivo');

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Acceso rápido como una App', 14, y);
  y += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_GRAY);
  const txt = doc.splitTextToSize(
    'Si va a entrar al portal con frecuencia, puede añadirlo a la pantalla de inicio de su móvil o al escritorio de su ordenador. Aparecerá como una app más, sin pasar por App Store ni Play Store. Es totalmente opcional.',
    pageWidth - 28
  );
  doc.text(txt, 14, y);
  y += 12;

  // Cuadrícula de 4 dispositivos
  const devices = [
    { device: 'iPhone / iPad', browser: 'Safari', steps: '1. Abra el portal en Safari\n2. Pulse el botón Compartir abajo\n3. Seleccione "Anadir a pantalla de inicio"\n4. Pulse "Anadir" arriba a la derecha' },
    { device: 'Android', browser: 'Chrome', steps: '1. Abra el portal en Chrome\n2. Pulse los 3 puntos arriba\n3. Seleccione "Anadir a pantalla de inicio"\n4. Confirme con "Anadir"' },
    { device: 'Mac', browser: 'Safari / Chrome', steps: '1. Abra el portal en Safari\n2. Vaya al menu Archivo\n3. Seleccione "Anadir al Dock"\n4. Aparecera el icono al lado del Finder' },
    { device: 'PC Windows', browser: 'Chrome / Edge', steps: '1. Abra el portal en Chrome\n2. Pulse el icono "Instalar" junto a la URL\n3. Confirme la instalacion\n4. Aparecera en su menu de Inicio' }
  ];

  const cardW = (pageWidth - 28 - 5) / 2;
  const cardH = 38;
  devices.forEach((d, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 14 + col * (cardW + 5);
    const cardY = y + row * (cardH + 5);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(...COLOR_AMBER);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, cardY, cardW, cardH, 2, 2, 'FD');

    doc.setFillColor(...COLOR_DARK);
    doc.roundedRect(x, cardY, cardW, 8, 2, 2, 'F');
    doc.setTextColor(...COLOR_AMBER);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(d.device, x + 4, cardY + 5.5);
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`(${d.browser})`, x + cardW - 4, cardY + 5.5, { align: 'right' });

    doc.setTextColor(...COLOR_DARK);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const stepLines = doc.splitTextToSize(d.steps, cardW - 8);
    doc.text(stepLines, x + 4, cardY + 13);
  });

  y += 90;

  // PREGUNTAS FRECUENTES
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Preguntas frecuentes', 14, y);
  y += 5;

  const faqs = [
    { q: '¿Es seguro?', a: 'Si. Cada cliente tiene un usuario unico, contrasena cifrada y acceso solo a sus propias operaciones.' },
    { q: '¿Tengo que pagar algo?', a: 'No. El acceso al portal esta incluido en su servicio como cliente de RSA Inver.' },
    { q: '¿Puedo entrar desde varios dispositivos?', a: 'Por supuesto. Funciona en cualquier dispositivo conectado a internet.' },
    { q: '¿Que hago si olvido mi contrasena?', a: 'Contacte con su gestor de RSA Inver y le proporcionara una nueva clave temporal.' }
  ];

  autoTable(doc, {
    startY: y,
    body: faqs.map(f => [f.q, f.a]),
    theme: 'plain',
    bodyStyles: { fontSize: 8, textColor: COLOR_DARK },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60, textColor: COLOR_AMBER },
      1: { fontStyle: 'normal' }
    },
    margin: { left: 14, right: 14 }
  });

  // CONTACTO
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  doc.setFillColor(...COLOR_DARK);
  doc.roundedRect(14, finalY, pageWidth - 28, 30, 4, 4, 'F');

  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('¿NECESITA AYUDA?', 18, finalY + 9);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Su gestor personal de RSA Inver esta disponible para ayudarle:', 18, finalY + 16);
  doc.setFont('helvetica', 'bold');
  doc.text('Email general:', 18, finalY + 22);
  doc.setFont('helvetica', 'normal');
  doc.text('contacto@rsainver.com', 50, finalY + 22);
  doc.setFont('helvetica', 'bold');
  doc.text('Documentacion:', 18, finalY + 27);
  doc.setFont('helvetica', 'normal');
  doc.text('documentacion@rsainver.com', 50, finalY + 27);

  addBrandedFooter(doc, '© RSA Inver - Manual de Bienvenida del Inversor');

  const filename = investor 
    ? `RSA_Inver_Manual_Bienvenida_${investor.username}.pdf`
    : 'RSA_Inver_Manual_Bienvenida_Cliente.pdf';
  doc.save(filename);
}

// =====================================================================
// 2. SCRIPT DE PRESENTACIÓN AL EQUIPO COMERCIAL
// =====================================================================
export function exportTeamPresentationScript(portalUrl: string = 'portal.rsainver.com') {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // ===== PÁGINA 1: PORTADA =====
  let y = addBrandedHeader(doc, 'GUION DE PRESENTACION', 'Reunion interna del equipo comercial');

  doc.setFillColor(...COLOR_DARK);
  doc.roundedRect(14, y, pageWidth - 28, 70, 4, 4, 'F');
  doc.setFillColor(...COLOR_AMBER);
  doc.roundedRect(14, y, 4, 70, 2, 2, 'F');

  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PARA USO INTERNO DEL DIRECTOR / RESPONSABLE', 25, y + 12);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Como presentar el', 25, y + 28);
  doc.setTextColor(...COLOR_AMBER);
  doc.text('nuevo portal al equipo', 25, y + 40);

  doc.setTextColor(220, 220, 220);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize(
    'Este guion esta disenado para una reunion de 30 minutos con el equipo comercial. Lealo previamente y adapte los ejemplos a la realidad de su negocio. Los puntos en dorado son los mas importantes.',
    pageWidth - 50
  );
  doc.text(intro, 25, y + 50);

  y += 80;

  // RESUMEN DE LA REUNIÓN
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Estructura sugerida de la reunion (30 min)', 14, y);
  y += 7;

  const agenda = [
    ['1', 'Apertura y motivacion del cambio', '5 min'],
    ['2', 'Demostracion practica del portal admin', '10 min'],
    ['3', 'Demostracion del portal del cliente', '5 min'],
    ['4', 'Beneficios para el equipo (tiempo y profesionalidad)', '5 min'],
    ['5', 'Turno de preguntas y compromisos', '5 min']
  ];

  autoTable(doc, {
    startY: y,
    head: [['Bloque', 'Tema a tratar', 'Duracion']],
    body: agenda,
    theme: 'striped',
    headStyles: { fillColor: COLOR_AMBER, textColor: 255, fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9, textColor: COLOR_DARK },
    alternateRowStyles: { fillColor: [254, 252, 232] },
    columnStyles: {
      0: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
      2: { cellWidth: 25, halign: 'center', fontStyle: 'bold' }
    },
    margin: { left: 14, right: 14 }
  });

  addBrandedFooter(doc, '© RSA Inver - Material Interno Confidencial');

  // ===== PÁGINA 2: BLOQUE 1 - APERTURA =====
  doc.addPage();
  y = addBrandedHeader(doc, 'BLOQUE 1 (5 min)', 'Apertura y motivacion del cambio');

  doc.setFillColor(254, 243, 199);
  doc.roundedRect(14, y, pageWidth - 28, 30, 3, 3, 'F');
  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('FRASE DE APERTURA SUGERIDA:', 18, y + 8);
  doc.setTextColor(...COLOR_DARK);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  const opening = doc.splitTextToSize(
    '"Equipo, antes de empezar quiero preguntaros una cosa: ¿cuantos mensajes de WhatsApp y llamadas habeis recibido esta semana de clientes preguntandoos como va su operacion? A partir de hoy eso se acaba. Os voy a presentar la herramienta que va a cambiar nuestra forma de trabajar."',
    pageWidth - 36
  );
  doc.text(opening, 18, y + 14);
  y += 35;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Puntos clave a transmitir', 14, y);
  y += 6;

  const points = [
    { title: 'El problema actual', desc: 'Hoy perdemos horas semanales contestando a clientes la misma pregunta: "¿Como va mi compra?". Eso resta tiempo a buscar nuevas operaciones.' },
    { title: 'La solucion', desc: 'Cada cliente tendra su propio portal privado donde vera el estado de su compra en tiempo real, sin tener que llamarnos.' },
    { title: 'No reemplaza el trato personal', desc: 'Para conversaciones importantes seguimos llamando como siempre. La herramienta solo elimina las consultas operativas repetitivas.' },
    { title: 'Imagen profesional', desc: 'Reforzaremos nuestra imagen de empresa moderna y profesional frente a la competencia que sigue trabajando con Excel y WhatsApp.' },
    { title: 'Mas ventas', desc: 'Al ahorrar tiempo en soporte, podremos atender a mas clientes y cerrar mas operaciones.' }
  ];

  points.forEach((p) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(...COLOR_AMBER);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, y, pageWidth - 28, 18, 2, 2, 'FD');

    doc.setFillColor(...COLOR_AMBER);
    doc.circle(20, y + 9, 2, 'F');

    doc.setTextColor(...COLOR_DARK);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(p.title, 26, y + 7);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLOR_GRAY);
    const lines = doc.splitTextToSize(p.desc, pageWidth - 50);
    doc.text(lines, 26, y + 12);

    y += 21;
  });

  addBrandedFooter(doc, '© RSA Inver - Material Interno Confidencial');

  // ===== PÁGINA 3: BLOQUE 2 - DEMO ADMIN =====
  doc.addPage();
  y = addBrandedHeader(doc, 'BLOQUE 2 (10 min)', 'Demostracion del Portal de Administracion');

  doc.setFillColor(254, 243, 199);
  doc.roundedRect(14, y, pageWidth - 28, 22, 3, 3, 'F');
  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSICION HACIA LA DEMO:', 18, y + 8);
  doc.setTextColor(...COLOR_DARK);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  const transition = doc.splitTextToSize(
    '"Vamos a verlo en directo. Voy a abrir la web y os ensenare como dareis de alta un cliente, como registrareis sus operaciones y como cambiareis las fases. Todo en menos de 5 clics."',
    pageWidth - 36
  );
  doc.text(transition, 18, y + 13);
  y += 28;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Pasos a mostrar (en este orden)', 14, y);
  y += 6;

  const adminSteps = [
    { step: '1', title: 'Abrir el portal admin', text: `Conectarse a ${portalUrl} con usuario corporativo. Mostrar el cuadro de mando inicial.` },
    { step: '2', title: 'Dar de alta a un nuevo inversor', text: 'Usar el formulario de la izquierda. Insistir: "Cada cliente tendra su propio usuario y clave independiente".' },
    { step: '3', title: 'Asignar un piso ofertado', text: 'En el formulario de la derecha. Seleccionar inversor, escribir titulo del piso, banco, importe y fase inicial.' },
    { step: '4', title: 'Cambiar la fase de una operacion', text: 'CRITICO: Mostrar el toast verde que aparece + el aviso automatico al cliente. Esto es lo que mas impacta.' },
    { step: '5', title: 'Anadir documentacion pendiente', text: 'Demostrar que se puede solicitar al cliente cualquier documento con un clic.' },
    { step: '6', title: 'Aprobar PBC y fijar fecha de notaria', text: 'Demostrar la fluidez de los hitos finales del expediente.' },
    { step: '7', title: 'Mostrar el historial de cambios', text: 'Insistir en la trazabilidad completa para auditorias y disputas.' },
    { step: '8', title: 'Descargar PDF del expediente', text: 'Mostrar lo profesional que se ve. Decir: "Esto se puede enviar al cliente o al banco".' },
    { step: '9', title: 'Visitar el cuadro de mando analitico', text: 'KPIs globales, embudo de conversion, ranking de bancos. "Tendreis vision 360 de la cartera."' }
  ];

  autoTable(doc, {
    startY: y,
    head: [['#', 'Que mostrar', 'Que decir mientras lo muestras']],
    body: adminSteps.map(s => [s.step, s.title, s.text]),
    theme: 'grid',
    headStyles: { fillColor: COLOR_DARK, textColor: 255, fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: COLOR_DARK, valign: 'top' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', fontStyle: 'bold', textColor: COLOR_AMBER },
      1: { cellWidth: 50, fontStyle: 'bold' }
    },
    margin: { left: 14, right: 14 }
  });

  addBrandedFooter(doc, '© RSA Inver - Material Interno Confidencial');

  // ===== PÁGINA 4: BLOQUE 3 + 4 =====
  doc.addPage();
  y = addBrandedHeader(doc, 'BLOQUE 3 (5 min)', 'Demo del Portal del Cliente');

  doc.setFillColor(254, 243, 199);
  doc.roundedRect(14, y, pageWidth - 28, 22, 3, 3, 'F');
  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSICION:', 18, y + 8);
  doc.setTextColor(...COLOR_DARK);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  const trans2 = doc.splitTextToSize(
    '"Y ahora lo mas importante: vamos a ver lo que ve el cliente cuando entra. Es lo que tendreis que ensenarle vosotros."',
    pageWidth - 36
  );
  doc.text(trans2, 18, y + 13);
  y += 28;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Que mostrar al equipo', 14, y);
  y += 5;

  const clientSteps = [
    'Cambiar al modo "Portal del Inversor" en la cabecera.',
    'Hacer login con credenciales de prueba.',
    'Mostrar el embudo visual de fases (los 6 circulos numerados).',
    'Mostrar las notas y mensajes del comercial.',
    'Mostrar los documentos requeridos y como el cliente los marca como entregados.',
    'Mostrar la fecha de notaria destacada.',
    'Descargar PDF del cliente.',
    'Recordar: "El cliente NO necesita instalar nada. Solo abre el navegador y entra".'
  ];

  clientSteps.forEach((s, idx) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, pageWidth - 28, 8, 1, 1, 'F');
    doc.setFillColor(...COLOR_AMBER);
    doc.circle(20, y + 4, 1.8, 'F');
    doc.setTextColor(...COLOR_DARK);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`${idx + 1}. ${s}`, 25, y + 5.5);
    y += 9;
  });

  y += 5;

  // BLOQUE 4 - BENEFICIOS
  doc.setFillColor(...COLOR_DARK);
  doc.roundedRect(14, y, pageWidth - 28, 10, 2, 2, 'F');
  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('BLOQUE 4 (5 min) - Beneficios para el equipo', 18, y + 7);
  y += 14;

  const benefits = [
    { title: '80% menos llamadas y WhatsApps repetitivos', desc: 'Los clientes vendran al portal antes que a vosotros.' },
    { title: 'Mas tiempo para captar nuevos clientes', desc: 'El tiempo ahorrado en soporte se invierte en venta.' },
    { title: 'Imagen mucho mas profesional', desc: 'Los inversores os percibiran como una empresa de gran tamano y solvencia.' },
    { title: 'Trazabilidad legal de todo', desc: 'Cada cambio queda con fecha y hora. Util para evitar malentendidos con clientes.' },
    { title: 'Informes en PDF en un clic', desc: 'No mas perder tiempo haciendo reportes manuales.' }
  ];

  benefits.forEach((b) => {
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(14, y, pageWidth - 28, 14, 2, 2, 'F');
    doc.setTextColor(...COLOR_AMBER);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('+', 19, y + 9);
    doc.setTextColor(...COLOR_DARK);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(b.title, 25, y + 6);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLOR_GRAY);
    doc.text(b.desc, 25, y + 11);
    y += 16;
  });

  addBrandedFooter(doc, '© RSA Inver - Material Interno Confidencial');

  // ===== PÁGINA 5: BLOQUE 5 - PREGUNTAS Y COMPROMISOS =====
  doc.addPage();
  y = addBrandedHeader(doc, 'BLOQUE 5 (5 min)', 'Preguntas frecuentes y compromisos');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Posibles objeciones del equipo y como responderlas', 14, y);
  y += 5;

  const objections = [
    { q: '"Esto me va a quitar tiempo aprenderlo"', a: 'Solo son 10 minutos de tutorial. Tras el primer uso es mas rapido que mandar un mensaje por WhatsApp.' },
    { q: '"¿Y si el cliente no sabe usarlo?"', a: 'Le entregaremos un manual ilustrado en PDF. Ademas, no requiere instalar nada: solo entrar a una web con usuario y clave.' },
    { q: '"¿Y si se cae internet?"', a: 'La probabilidad es minima (uptime del 99,9%). Y si pasa, podemos seguir comunicandonos como siempre.' },
    { q: '"¿Vamos a perder el trato personal?"', a: 'Al contrario. Al ahorrar tiempo en consultas operativas, tendremos mas espacio para llamadas de calidad cuando hagan falta.' },
    { q: '"¿Tengo que dar de alta yo cada cliente?"', a: 'Solo lleva 30 segundos. Y se compensa con creces al evitar las consultas posteriores.' }
  ];

  autoTable(doc, {
    startY: y,
    head: [['Objecion del comercial', 'Respuesta sugerida']],
    body: objections.map(o => [o.q, o.a]),
    theme: 'striped',
    headStyles: { fillColor: COLOR_DARK, textColor: 255, fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: COLOR_DARK },
    alternateRowStyles: { fillColor: [254, 252, 232] },
    columnStyles: {
      0: { cellWidth: 70, fontStyle: 'bold', textColor: COLOR_AMBER }
    },
    margin: { left: 14, right: 14 }
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // COMPROMISOS DE CIERRE
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Compromisos de cierre con el equipo', 14, y);
  y += 4;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...COLOR_GRAY);
  doc.text('Pedir a cada miembro del equipo que se comprometa con estos puntos:', 14, y);
  y += 6;

  const commits = [
    'A partir del proximo lunes, dar de alta TODOS los nuevos clientes en el portal.',
    'En las primeras 2 semanas, redirigir las consultas de WhatsApp al portal: "Mira, lo tienes en tu app".',
    'Anotar las fases de TODAS las operaciones nuevas en el portal, no en Excel.',
    'Reportar cualquier mejora o error que detecten al responsable.'
  ];

  commits.forEach((c, idx) => {
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(14, y, pageWidth - 28, 12, 2, 2, 'F');
    doc.setFillColor(...COLOR_AMBER);
    doc.rect(15, y, 3, 12, 'F');
    doc.setTextColor(...COLOR_AMBER);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${idx + 1}.`, 22, y + 7.5);
    doc.setTextColor(...COLOR_DARK);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(c, 30, y + 7.5);
    y += 14;
  });

  y += 5;

  // FRASE DE CIERRE
  doc.setFillColor(...COLOR_DARK);
  doc.roundedRect(14, y, pageWidth - 28, 25, 3, 3, 'F');
  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('FRASE DE CIERRE:', 18, y + 8);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  const closing = doc.splitTextToSize(
    '"Equipo, dentro de 3 meses, los comerciales que mejor utilicen esta herramienta seran los que mas operaciones cierren. Vamos a empezar este lunes. Cualquier duda, hablamos."',
    pageWidth - 36
  );
  doc.text(closing, 18, y + 14);

  addBrandedFooter(doc, '© RSA Inver - Material Interno Confidencial');

  doc.save('RSA_Inver_Guion_Presentacion_Equipo.pdf');
}

// =====================================================================
// 3. HOJA A4 INSTRUCCIONES RÁPIDAS PARA COLGAR EN OFICINA
// =====================================================================
export function exportOfficePoster(portalUrl: string = 'portal.rsainver.com') {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Borde decorativo
  doc.setDrawColor(...COLOR_AMBER);
  doc.setLineWidth(1);
  doc.roundedRect(8, 8, pageWidth - 16, pageHeight - 16, 4, 4, 'S');
  doc.setLineWidth(0.3);
  doc.roundedRect(11, 11, pageWidth - 22, pageHeight - 22, 3, 3, 'S');

  // CABECERA GRANDE
  doc.setFillColor(...COLOR_DARK);
  doc.roundedRect(15, 15, pageWidth - 30, 32, 3, 3, 'F');
  doc.setFillColor(...COLOR_AMBER);
  doc.rect(15, 15, 6, 32, 'F');

  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('RSA INVER · BANK ASSETS', 28, 25);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('PORTAL DEL INVERSOR', 28, 36);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 220, 220);
  doc.text('Acceso 24/7 al estado de sus operaciones inmobiliarias', 28, 42);

  let y = 55;

  // URL DEL PORTAL DESTACADA
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_GRAY);
  doc.text('DIRECCIÓN WEB DEL PORTAL', pageWidth / 2, y, { align: 'center' });
  y += 7;

  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(...COLOR_AMBER);
  doc.setLineWidth(0.5);
  doc.roundedRect(25, y, pageWidth - 50, 18, 3, 3, 'FD');
  doc.setTextColor(...COLOR_DARK);
  doc.setFontSize(20);
  doc.setFont('courier', 'bold');
  doc.text(portalUrl, pageWidth / 2, y + 12, { align: 'center' });
  y += 25;

  // SECCIÓN: PARA CLIENTES INVERSORES
  doc.setFillColor(219, 234, 254); // blue-100
  doc.roundedRect(15, y, pageWidth - 30, 8, 2, 2, 'F');
  doc.setTextColor(30, 64, 175); // blue-800
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PARA CLIENTES INVERSORES', pageWidth / 2, y + 5.5, { align: 'center' });
  y += 12;

  const clientSteps = [
    { num: '1', text: 'Abra el navegador (Safari, Chrome, etc.)' },
    { num: '2', text: 'Escriba la dirección web indicada arriba' },
    { num: '3', text: 'Introduzca su USUARIO y CONTRASEÑA' },
    { num: '4', text: 'Consulte el estado de sus operaciones' }
  ];

  const stepW = (pageWidth - 30 - 9) / 4;
  clientSteps.forEach((step, idx) => {
    const x = 15 + idx * (stepW + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(219, 234, 254);
    doc.roundedRect(x, y, stepW, 30, 2, 2, 'FD');

    doc.setFillColor(30, 64, 175);
    doc.circle(x + stepW / 2, y + 8, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(step.num, x + stepW / 2, y + 10, { align: 'center' });

    doc.setTextColor(...COLOR_DARK);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(step.text, stepW - 4);
    doc.text(lines, x + stepW / 2, y + 18, { align: 'center' });
  });
  y += 35;

  // SECCIÓN: PARA EL EQUIPO
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(15, y, pageWidth - 30, 8, 2, 2, 'F');
  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PARA EL EQUIPO DE RSA INVER', pageWidth / 2, y + 5.5, { align: 'center' });
  y += 12;

  const teamSteps = [
    { num: '1', text: 'Acceder a la URL del portal' },
    { num: '2', text: 'Pulsar "Personal RSA Inver (Admin)"' },
    { num: '3', text: 'Login con credenciales corporativas' },
    { num: '4', text: 'Gestionar inversores y operaciones' }
  ];

  teamSteps.forEach((step, idx) => {
    const x = 15 + idx * (stepW + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(254, 243, 199);
    doc.roundedRect(x, y, stepW, 30, 2, 2, 'FD');

    doc.setFillColor(...COLOR_AMBER);
    doc.circle(x + stepW / 2, y + 8, 4, 'F');
    doc.setTextColor(...COLOR_DARK);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(step.num, x + stepW / 2, y + 10, { align: 'center' });

    doc.setTextColor(...COLOR_DARK);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(step.text, stepW - 4);
    doc.text(lines, x + stepW / 2, y + 18, { align: 'center' });
  });
  y += 38;

  // CARACTERÍSTICAS PRINCIPALES (chips)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_GRAY);
  doc.text('LO QUE PUEDES HACER EN EL PORTAL:', pageWidth / 2, y, { align: 'center' });
  y += 6;

  const features = [
    'Ver estado de la oferta',
    'Documentación pendiente',
    'Aprobación PBC',
    'Fecha de notaría',
    'Historial completo',
    'Descargar PDFs'
  ];

  let featX = 15;
  let featY = y;
  features.forEach((f) => {
    const textW = doc.getTextWidth(f) + 8;
    if (featX + textW > pageWidth - 15) {
      featX = 15;
      featY += 8;
    }
    doc.setFillColor(...COLOR_AMBER);
    doc.roundedRect(featX, featY, textW, 6, 2, 2, 'F');
    doc.setTextColor(...COLOR_DARK);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(`✓ ${f}`, featX + textW / 2, featY + 4, { align: 'center' });
    featX += textW + 2;
  });
  y = featY + 12;

  // ZONA DESTACADA: NO INSTALAR NADA
  doc.setFillColor(220, 252, 231); // emerald-100
  doc.setDrawColor(34, 197, 94); // emerald-500
  doc.setLineWidth(0.5);
  doc.roundedRect(15, y, pageWidth - 30, 22, 3, 3, 'FD');
  doc.setTextColor(22, 101, 52); // emerald-800
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('NO NECESITA INSTALAR NINGUNA APLICACIÓN', pageWidth / 2, y + 9, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Funciona en cualquier dispositivo: iPhone, Android, Mac, PC, iPad o Tablet', pageWidth / 2, y + 16, { align: 'center' });
  y += 27;

  // BARRA INFERIOR DE CONTACTO
  doc.setFillColor(...COLOR_DARK);
  doc.roundedRect(15, y, pageWidth - 30, 22, 3, 3, 'F');
  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('¿NECESITA AYUDA?', 25, y + 9);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Email general:', 25, y + 16);
  doc.setFont('helvetica', 'bold');
  doc.text('contacto@rsainver.com', 55, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text('Documentación:', 110, y + 16);
  doc.setFont('helvetica', 'bold');
  doc.text('documentacion@rsainver.com', 142, y + 16);

  // PIE
  doc.setTextColor(...COLOR_GRAY);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.text('© RSA Inver · Bank Assets · Inversión Inmobiliaria Profesional', pageWidth / 2, pageHeight - 13, { align: 'center' });

  doc.save('RSA_Inver_Cartel_Oficina_A4.pdf');
}

// =====================================================================
// 4. TARJETA DE CREDENCIALES INDIVIDUAL
// =====================================================================
export function exportCredentialsCard(investor: InvestorUser, portalUrl: string = 'portal.rsainver.com') {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = addBrandedHeader(doc, 'TARJETA DE ACCESO', investor.fullName);

  // Mensaje breve
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_DARK);
  const msg = doc.splitTextToSize(
    `Estimado/a ${investor.fullName.split(' ')[0]}, le adjuntamos sus credenciales personales de acceso al portal privado de RSA Inver. Conserve este documento en un lugar seguro.`,
    pageWidth - 28
  );
  doc.text(msg, 14, y);
  y += 14;

  // TARJETA TIPO BANCARIA - CARA FRONTAL
  const cardW = 130;
  const cardH = 75;
  const cardX = (pageWidth - cardW) / 2;

  // Fondo gradiente simulado
  doc.setFillColor(...COLOR_DARK);
  doc.roundedRect(cardX, y, cardW, cardH, 5, 5, 'F');

  // Banda dorada
  doc.setFillColor(...COLOR_AMBER);
  doc.roundedRect(cardX, y, cardW, 12, 5, 5, 'F');
  doc.setFillColor(...COLOR_AMBER);
  doc.rect(cardX, y + 7, cardW, 5, 'F');

  // Logo en la tarjeta
  doc.setTextColor(...COLOR_DARK);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('RSA INVER', cardX + 6, y + 9);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('PORTAL PRIVADO DEL INVERSOR', cardX + cardW - 6, y + 9, { align: 'right' });

  // Chip simulado (ornamental)
  doc.setFillColor(...COLOR_AMBER);
  doc.roundedRect(cardX + 8, y + 18, 10, 8, 1, 1, 'F');
  doc.setFillColor(...COLOR_DARK);
  doc.roundedRect(cardX + 9, y + 19, 8, 6, 0.5, 0.5, 'F');

  // URL principal grande
  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('PORTAL WEB', cardX + 6, y + 35);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('courier', 'bold');
  doc.text(portalUrl, cardX + 6, y + 41);

  // Usuario
  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('USUARIO', cardX + 6, y + 50);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('courier', 'bold');
  doc.text(investor.username, cardX + 6, y + 56);

  // Clave
  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRASENA', cardX + 75, y + 50);
  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(11);
  doc.setFont('courier', 'bold');
  doc.text(investor.password, cardX + 75, y + 56);

  // Pie de tarjeta
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'italic');
  doc.text('Acceso 24/7 desde cualquier dispositivo - Soporte: contacto@rsainver.com', cardX + cardW / 2, y + 70, { align: 'center' });

  y += cardH + 12;

  // INDICACIONES BREVES
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_DARK);
  doc.text('Como usar su tarjeta de acceso', 14, y);
  y += 6;

  const tips = [
    '1. Abra el navegador de su movil, tablet o ordenador (Safari, Chrome, etc.)',
    '2. Escriba la direccion del PORTAL WEB que aparece en la tarjeta.',
    '3. Introduzca su USUARIO y CONTRASENA.',
    '4. Acceso instantaneo al estado de todas sus operaciones inmobiliarias.'
  ];

  tips.forEach((t) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, pageWidth - 28, 9, 1, 1, 'F');
    doc.setTextColor(...COLOR_DARK);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(t, 18, y + 6);
    y += 11;
  });

  y += 5;

  // CONSEJO DE SEGURIDAD
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(...COLOR_AMBER);
  doc.roundedRect(14, y, pageWidth - 28, 18, 2, 2, 'FD');
  doc.setTextColor(...COLOR_AMBER);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CONSEJO DE SEGURIDAD', 18, y + 7);
  doc.setTextColor(...COLOR_DARK);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const sec = doc.splitTextToSize(
    'Le recomendamos cambiar su contrasena tras el primer acceso. Nunca comparta sus credenciales con terceros. Si sospecha un acceso no autorizado, contacte inmediatamente con su gestor.',
    pageWidth - 36
  );
  doc.text(sec, 18, y + 12);

  addBrandedFooter(doc, '© RSA Inver - Tarjeta de Acceso Personal');

  doc.save(`RSA_Inver_Tarjeta_Acceso_${investor.username}.pdf`);
}
