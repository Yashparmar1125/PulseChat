// src/repositories/message.repo.js
import { getDb } from '../libs/mongoClient.js';
import { ObjectId } from 'mongodb';

/**
 * Atomically increment and return the next seq number for a conversation.
 * Uses counters collection documents: { _id: conversationId, seq: Number }
 */
export async function nextSeq(conversationId) {
  const db = getDb();
  const res = await db.collection('counters').findOneAndUpdate(
    { _id: conversationId },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' } // return the doc after update
  );
  if (!res.value) throw new Error('Failed to allocate seq number');
  return res.value.seq;
}

/**
 * Insert a message doc into messages collection.
 * Returns inserted doc (with _id).
 */
export async function insertMessage(messageDoc) {
  const db = getDb();
  const result = await db.collection('messages').insertOne(messageDoc);
  if (!result.acknowledged) throw new Error('Failed to insert message');
  // attach insertedId
  return { ...messageDoc, _id: result.insertedId };
}

/**
 * Fetch messages for a conversation (cursor pagination).
 * - beforeSeq (exclusive): returns messages with seqNo < beforeSeq (desc order)
 */
export async function fetchMessages(conversationId, { limit = 50, beforeSeq = Number.MAX_SAFE_INTEGER } = {}) {
  const db = getDb();
  const cursor = db.collection('messages')
    .find({ conversationId, seqNo: { $lt: beforeSeq } })
    .sort({ seqNo: -1 })
    .limit(limit);
  return cursor.toArray();
}
