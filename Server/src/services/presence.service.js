// src/services/presence.service.js

import { getDb } from '../libs/mongoClient.js';
import { createMessage } from './message.service.js'; // Assumed existing import

const PRESENCE_TTL_SECONDS = 30;

// You need a way to pass the IO instance to this function for broadcasting
// We'll pass it from the socket handler
export const setPresenceOnline = async (uid, socketId) => {
  const db = getDb();
  const expireAt = new Date(Date.now() + PRESENCE_TTL_SECONDS * 1000);
  await db.collection('presence').updateOne(
    { _id: uid },
    {
      $set: { status: 'online', socketId, expireAt, updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true }
  );
};

export const setPresenceOffline = async (uid) => {
  const db = getDb();
  await db.collection('presence').updateOne(
    { _id: uid },
    { $set: { status: 'offline', lastSeen: new Date(), socketId: null } }
  );
};

// NOTE: This function needs the 'io' instance for broadcasting receipts.
// It's cleaner to keep the core DB logic here and pass the 'io' instance down from the socket handler.
export const handleMarkRead = async (io, uid, { conversationId, lastSeqNo }) => {
  if (!conversationId || typeof lastSeqNo !== 'number') return;
  const db = getDb();

  // 1. Store per-user lastRead per conversation (upsert)
  await db.collection('readReceipts').updateOne(
    { conversationId, userId: uid },
    { $set: { lastReadSeq: lastSeqNo, readAt: new Date() } },
    { upsert: true }
  );

  // 2. Notify other members in the conversation room about this read cursor
  io.to(`conv:${conversationId}`).emit('receipt', { 
    conversationId, 
    userId: uid, 
    lastReadSeq: lastSeqNo, 
    readAt: new Date() 
  });
};