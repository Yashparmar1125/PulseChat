// src/services/message.service.js
import { nextSeq, insertMessage } from '../repositories/message.repo.js';

/**
 * Create and persist a message.
 * messagePayload: {
 *   conversationId, senderId, body, attachments (array of attachment ids/urls),
 *   type ('text'|'image'|'voice'...), clientTs (optional)
 * }
 *
 * Returns persisted message (with _id and seqNo).
 */
export async function createMessage(messagePayload) {
  const {
    conversationId,
    senderId,
    body = '',
    attachments = [],
    type = 'text',
    clientTs = Date.now()
  } = messagePayload;

  if (!conversationId) throw new Error('conversationId required');
  if (!senderId) throw new Error('senderId required');

  // allocate atomic seqNo
  const seqNo = await nextSeq(conversationId);

  const now = new Date();
  const messageDoc = {
    conversationId,
    seqNo,
    senderId,
    body,
    attachments,
    type,
    clientTs,
    createdAt: now,
    editedAt: null,
    deleted: false,
    // optional flags, reactions, metadata can be added later
  };

  const persisted = await insertMessage(messageDoc);
  return persisted;
}
