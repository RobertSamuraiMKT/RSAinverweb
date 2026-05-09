import { 
  AssetOffer, 
  AppNotification, 
  InvestorUser, 
  OfferPhase, 
  PHASE_LABELS 
} from '../types/inver';

interface NotifTemplate {
  subject: string;
  message: string;
  type: AppNotification['type'];
}

/**
 * Genera el texto de email/whatsapp profesional para cada cambio de fase
 */
export function getPhaseChangeTemplate(
  offer: AssetOffer, 
  investor: InvestorUser, 
  newPhase: OfferPhase
): NotifTemplate {
  const phaseInfo = PHASE_LABELS[newPhase];
  const greeting = `Estimado/a ${investor.fullName.split(' ')[0]}`;

  switch (newPhase) {
    case 'oferta_enviada':
      return {
        subject: `[RSA Inver] Oferta lanzada al servicer - ${offer.reference}`,
        message: `${greeting},\n\nLe informamos que hemos lanzado oficialmente su oferta de ${offer.offerAmount.toLocaleString()} € al servicer ${offer.bankOrServicer} por el activo "${offer.assetTitle}".\n\nQuedamos a la espera de la respuesta del comité del banco. Le mantendremos informado a través del portal.\n\nAtentamente,\nEquipo RSA Inver`,
        type: 'phase_change'
      };

    case 'oferta_aceptada':
      return {
        subject: `🎉 [RSA Inver] ¡Oferta aceptada! - ${offer.reference}`,
        message: `${greeting},\n\n¡Excelentes noticias! ${offer.bankOrServicer} ha ACEPTADO formalmente su oferta de ${offer.offerAmount.toLocaleString()} € por "${offer.assetTitle}".\n\nEl siguiente paso es completar la documentación necesaria. Acceda a su portal para revisar los anexos requeridos.\n\nAtentamente,\nEquipo RSA Inver`,
        type: 'phase_change'
      };

    case 'doc_pendiente':
      return {
        subject: `⚠️ [RSA Inver] Documentación requerida - ${offer.reference}`,
        message: `${greeting},\n\nEl banco nos ha solicitado documentación adicional para continuar con la compra de "${offer.assetTitle}".\n\nPor favor, acceda a su portal privado para consultar el listado completo de documentos pendientes y poder remitírnoslos a documentacion@rsainver.com indicando la referencia ${offer.reference}.\n\nAtentamente,\nEquipo RSA Inver`,
        type: 'doc_request'
      };

    case 'doc_completa':
      return {
        subject: `✓ [RSA Inver] Documentación completa - ${offer.reference}`,
        message: `${greeting},\n\nLe confirmamos que toda la documentación de su expediente "${offer.assetTitle}" ha sido recibida y subida al sistema del banco.\n\nAhora pasa a revisión interna del departamento de Compliance (PBC).\n\nAtentamente,\nEquipo RSA Inver`,
        type: 'phase_change'
      };

    case 'pbc_ok':
      return {
        subject: `✓ [RSA Inver] PBC aprobado - ${offer.reference}`,
        message: `${greeting},\n\nLe informamos que el filtro de Prevención de Blanqueo de Capitales (PBC) de ${offer.bankOrServicer} ha sido APROBADO con éxito para "${offer.assetTitle}".\n\nEstamos solicitando la minuta de compraventa para fijar la fecha de firma en notaría.\n\nAtentamente,\nEquipo RSA Inver`,
        type: 'pbc_approved'
      };

    case 'firma_fijada':
      return {
        subject: `📅 [RSA Inver] ¡Firma de notaría programada! - ${offer.reference}`,
        message: `${greeting},\n\n¡Felicidades! La operación de compra de "${offer.assetTitle}" está lista para firmarse.\n\n📍 Cita en notaría: ${offer.signingDate || 'Por confirmar en breve'}\n\nLe rogamos revise su portal para conocer todos los detalles y traer la documentación original el día de la firma.\n\nAtentamente,\nEquipo RSA Inver`,
        type: 'signing_scheduled'
      };

    case 'oferta_rechazada':
      return {
        subject: `[RSA Inver] Oferta rechazada o contraoferta - ${offer.reference}`,
        message: `${greeting},\n\nLe informamos que ${offer.bankOrServicer} no ha aceptado la oferta presentada por "${offer.assetTitle}".\n\nLe llamaremos en breve para valorar plantear una contraoferta. Mientras tanto, puede consultar el detalle en su portal.\n\nAtentamente,\nEquipo RSA Inver`,
        type: 'phase_change'
      };

    default:
      return {
        subject: `[RSA Inver] Actualización de su expediente - ${offer.reference}`,
        message: `${greeting},\n\nSu expediente "${offer.assetTitle}" ha cambiado de estado a: ${phaseInfo.label}.\n\nAcceda al portal para ver más detalles.\n\nAtentamente,\nEquipo RSA Inver`,
        type: 'phase_change'
      };
  }
}

/**
 * Crea un objeto de notificación completo y persistible
 */
export function createNotification(
  offer: AssetOffer,
  investor: InvestorUser,
  template: NotifTemplate
): AppNotification {
  return {
    id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    investorId: investor.id,
    offerId: offer.id,
    assetTitle: offer.assetTitle,
    reference: offer.reference,
    subject: template.subject,
    message: template.message,
    phase: offer.phase,
    channels: ['email', 'whatsapp', 'portal'],
    isRead: false,
    createdAt: Date.now(),
    type: template.type
  };
}

/**
 * Devuelve un texto humanizado del tiempo transcurrido
 */
export function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Justo ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHour < 24) return `Hace ${diffHour}h`;
  if (diffDay === 1) return 'Ayer';
  if (diffDay < 7) return `Hace ${diffDay} días`;
  return new Date(timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}
