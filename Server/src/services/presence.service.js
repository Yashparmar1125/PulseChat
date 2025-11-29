// src/services/presence.service.js

import { getDb } from '../libs/mongoClient.js';
import { ObjectId } from 'mongodb';

const PRESENCE_TTL_SECONDS = 30;

// Set user online and broadcast presence update
export const setPresenceOnline = async (io, mongoUserId, socketId) => {
  const db = getDb();
  const expireAt = new Date(Date.now() + PRESENCE_TTL_SECONDS * 1000);
  // Ensure mongoUserId is converted to ObjectId for consistent storage
  const userIdObj = mongoUserId instanceof ObjectId ? mongoUserId : new ObjectId(mongoUserId);
  
  await db.collection('presence').updateOne(
    { _id: userIdObj },
    {
      $set: { status: 'online', socketId, expireAt, updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true }
  );
  
  // Broadcast presence update to all connected clients
  io.emit('presence:update', {
    userId: mongoUserId.toString(),
    isOnline: true,
    lastActive: new Date().toISOString()
  });
};

export const setPresenceOffline = async (io, mongoUserId) => {
  const db = getDb();
  // Ensure mongoUserId is converted to ObjectId for consistent storage
  const userIdObj = mongoUserId instanceof ObjectId ? mongoUserId : new ObjectId(mongoUserId);
  
  await db.collection('presence').updateOne(
    { _id: userIdObj },
    { $set: { status: 'offline', lastSeen: new Date(), socketId: null, updatedAt: new Date() } }
  );
  
  // Broadcast presence update to all connected clients
  io.emit('presence:update', {
    userId: mongoUserId.toString(),
    isOnline: false,
    lastSeen: new Date().toISOString()
  });
};

// Handle mark as read - update read receipts and broadcast
export const handleMarkRead = async (io, mongoUserId, { conversationId, messageIds }) => {
  if (!conversationId) return;
  const db = getDb();

  // If messageIds provided, mark specific messages as read
  if (messageIds && Array.isArray(messageIds) && messageIds.length > 0) {
    const messageObjectIds = messageIds.map(id => {
      try {
        return new ObjectId(id);
      } catch (err) {
        console.error('[handleMarkRead] Invalid message ID format:', id);
        return null;
      }
    }).filter(Boolean);
    
    if (messageObjectIds.length === 0) {
      console.warn('[handleMarkRead] No valid message IDs provided');
      return;
    }
    
    // Update messages to add this user to readBy array
    const updateResult = await db.collection('messages').updateMany(
      { 
        _id: { $in: messageObjectIds },
        conversationId: conversationId,
        senderId: { $ne: mongoUserId } // Don't mark own messages as read
      },
      { 
        $addToSet: { readBy: mongoUserId }
      }
    );
    
    console.log(`[handleMarkRead] Updated ${updateResult.modifiedCount} messages as read for user ${mongoUserId}`);
    
    // Broadcast read receipts to conversation room (including sender)
    io.to(`conv:${conversationId}`).emit('message_read', {
      conversationId,
      messageIds: messageIds,
      readerId: mongoUserId.toString(),
      readAt: new Date().toISOString()
    });
    
    // Emit conversation:read event ONLY to conversation participants
    const db = getDb();
    const conversation = await db.collection('conversations').findOne({ 
      _id: new ObjectId(conversationId) 
    });
    
    if (conversation && conversation.participants) {
      const participantIds = conversation.participants.map(p => p.toString());
      console.log('[handleMarkRead] Emitting conversation:read to participants:', participantIds);
      
      const conversationReadEvent = {
        conversationId,
        readerId: mongoUserId.toString(),
        readCount: updateResult.modifiedCount
      };
      
      // Emit to each participant's user room
      participantIds.forEach(participantId => {
        io.to(`user:${participantId}`).emit('conversation:read', conversationReadEvent);
      });
    } else {
      console.warn('[handleMarkRead] Conversation not found or has no participants, skipping conversation:read broadcast');
    }
  } else {
    // Legacy: if lastSeqNo provided, mark all messages up to that seqNo as read
    // This is for backward compatibility
    const { lastSeqNo } = { lastSeqNo: null };
    if (typeof lastSeqNo === 'number') {
      await db.collection('readReceipts').updateOne(
        { conversationId, userId: mongoUserId },
        { $set: { lastReadSeq: lastSeqNo, readAt: new Date() } },
        { upsert: true }
      );

      io.to(`conv:${conversationId}`).emit('receipt', { 
        conversationId, 
        userId: mongoUserId, 
        lastReadSeq: lastSeqNo, 
        readAt: new Date().toISOString() 
      });
    }
  }
};