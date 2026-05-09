import { AssetOffer, HistoryEntry, HistoryEventType, OfferPhase, PHASE_LABELS } from '../types/inver';

/**
 * Crea una nueva entrada de historial con un timestamp actual
 */
export function createHistoryEntry(
  type: HistoryEventType,
  title: string,
  description: string,
  user: string = 'Sistema RSA Inver',
  fromValue?: string,
  toValue?: string
): HistoryEntry {
  return {
    id: 'hist-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp: Date.now(),
    type,
    title,
    description,
    user,
    fromValue,
    toValue
  };
}

/**
 * Añade una entrada de historial a una oferta y devuelve la oferta actualizada
 */
export function addHistoryToOffer(offer: AssetOffer, entry: HistoryEntry): AssetOffer {
  return {
    ...offer,
    history: [...(offer.history || []), entry]
  };
}

/**
 * Helpers especializados para los cambios más comunes
 */
export function logPhaseChange(_offer: AssetOffer, oldPhase: OfferPhase, newPhase: OfferPhase, user: string = 'Sistema RSA Inver'): HistoryEntry {
  const oldLabel = PHASE_LABELS[oldPhase].label;
  const newLabel = PHASE_LABELS[newPhase].label;
  return createHistoryEntry(
    'phase_changed',
    `Cambio de fase: ${newLabel.replace(/^\d+\.\s*/, '')}`,
    `El expediente ha pasado de "${oldLabel}" a "${newLabel}".`,
    user,
    oldLabel,
    newLabel
  );
}

export function logPbcChange(approved: boolean, user: string = 'Sistema RSA Inver'): HistoryEntry {
  return createHistoryEntry(
    approved ? 'pbc_approved' : 'pbc_revoked',
    approved ? '✓ PBC aprobado por el banco' : '⌛ PBC marcado como pendiente',
    approved 
      ? 'Compliance ha validado positivamente el origen de los fondos. Vía libre para escriturar.' 
      : 'El estado del PBC ha vuelto a estado pendiente o en revisión.',
    user
  );
}

export function logDocAdded(docName: string, user: string = 'Sistema RSA Inver'): HistoryEntry {
  return createHistoryEntry(
    'doc_added',
    `Documento solicitado: ${docName}`,
    `Se ha añadido a la lista de documentación requerida el documento "${docName}".`,
    user
  );
}

export function logDocProvided(docName: string, provided: boolean, user: string): HistoryEntry {
  return createHistoryEntry(
    provided ? 'doc_provided' : 'doc_pending',
    provided ? `✓ Documento entregado: ${docName}` : `Documento marcado como pendiente: ${docName}`,
    provided 
      ? `El documento "${docName}" ha sido marcado como entregado y validado.` 
      : `El documento "${docName}" ha vuelto al estado pendiente.`,
    user
  );
}

export function logDocRemoved(docName: string, user: string = 'Sistema RSA Inver'): HistoryEntry {
  return createHistoryEntry(
    'doc_removed',
    `Documento eliminado: ${docName}`,
    `El requerimiento "${docName}" ha sido eliminado de la lista.`,
    user
  );
}

export function logSigningUpdated(date: string, user: string = 'Sistema RSA Inver'): HistoryEntry {
  return createHistoryEntry(
    date ? 'signing_scheduled' : 'signing_updated',
    date ? '📅 Notaría programada' : 'Fecha de notaría actualizada',
    date ? `Cita en notaría confirmada para: ${date}` : 'Se ha actualizado la información de la notaría.',
    user,
    undefined,
    date
  );
}

export function logNoteUpdated(user: string = 'Sistema RSA Inver'): HistoryEntry {
  return createHistoryEntry(
    'note_updated',
    'Notas actualizadas',
    'El comercial ha actualizado los comentarios del expediente.',
    user
  );
}

export function logCreated(amount: number, bank: string): HistoryEntry {
  return createHistoryEntry(
    'created',
    'Expediente abierto',
    `Oferta de ${amount.toLocaleString()} € lanzada a ${bank}.`,
    'Sistema RSA Inver'
  );
}

/**
 * Formato corto fecha+hora
 */
export function formatHistoryDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
