// src/sockets/handlers.js

import { 
    setPresenceOnline, 
    setPresenceOffline, 
    handleMarkRead 
  } from '../services/presence.service.js'; 
  import { createMessage } from '../services/message.service.js';
  import { getDb } from '../libs/mongoClient.js';
  import { USER_COLLECTION } from '../models/user.model.js';
  import { ObjectId } from 'mongodb';
  import { formatMessage } from '../utils/response.formatter.js';
  
  // Helper to get MongoDB user ID from Firebase UID
  async function getMongoUserId(firebaseUid) {
    if (!firebaseUid) return null;
    const db = getDb();
    const user = await db.collection(USER_COLLECTION).findOne({ firebaseUid });
    return user?._id?.toString() || null;
  }
  
  // Export a function that accepts the global 'io' instance to handle broadcasting
  export const registerSocketHandlers = (io) => {
    
    io.on('connection', async (socket) => {
      const firebaseUid = socket.user?.uid ?? null;
      console.log('socket connected', socket.id, 'firebaseUid=', firebaseUid);
      
      // Get MongoDB user ID
      let mongoUserId = null;
      if (firebaseUid) {
        mongoUserId = await getMongoUserId(firebaseUid);
        if (!mongoUserId) {
          console.error('No MongoDB user found for Firebase UID:', firebaseUid);
          socket.disconnect();
          return;
        }
        // Store mongoUserId on socket for easy access
        socket.mongoUserId = mongoUserId;
      } else {
        socket.disconnect();
        return;
      }
  
      // Initial presence check
      if (mongoUserId) {
        await setPresenceOnline(io, mongoUserId, socket.id).catch(e => console.error('presence set error', e));
        // Join user-specific room for targeted messaging
        socket.join(`user:${mongoUserId}`);
        console.log(`socket ${socket.id} joined user room: user:${mongoUserId}`);
      }
  
      // Client heartbeat
      socket.on('presence:heartbeat', async () => {
        if (!mongoUserId) return;
        await setPresenceOnline(io, mongoUserId, socket.id).catch(e => console.error('presence heartbeat error', e));
      });
  
      // Join conversation room
      socket.on('join', (conversationId, ack) => {
        try {
          if (!conversationId) {
            if (typeof ack === 'function') ack({ ok: false, error: 'conversationId required' });
            return;
          }
  
          // TODO: validate membership (security)
          socket.join(`conv:${conversationId}`);
          console.log(`socket ${socket.id} joined conv:${conversationId}`);
  
          if (typeof ack === 'function') ack({ ok: true });
        } catch (err) {
          console.error('join error', err);
          if (typeof ack === 'function') ack({ ok: false, error: err.message });
        }
      });
  
      // Leave conversation room
      socket.on('leave', (conversationId) => {
        if (!conversationId) return;
        socket.leave(`conv:${conversationId}`);
        console.log(`socket ${socket.id} left conv:${conversationId}`);
      });
  
      // Typing indicator
      socket.on('typing', async ({ conversationId, isTyping }) => {
        if (!conversationId || !mongoUserId) {
          console.log('[typing] Missing conversationId or mongoUserId:', { conversationId, mongoUserId });
          return;
        }
        const roomName = `conv:${conversationId}`;
        console.log(`[typing] Broadcasting typing event to room: ${roomName}, userId: ${mongoUserId}, isTyping: ${isTyping}`);
        
        const typingEvent = { 
          conversationId, 
          userId: mongoUserId.toString(), 
          isTyping: !!isTyping 
        };
        
        // Broadcast to conversation room (for active chat view)
        io.to(roomName).emit('typing', typingEvent);
        
        // Also broadcast to conversation participants' user rooms (for conversation list updates)
        try {
          const dbInstance = getDb();
          const conversation = await dbInstance.collection(CONVERSATION_COLLECTION).findOne({ 
            _id: new ObjectId(conversationId) 
          });
          
          if (conversation && conversation.participants) {
            const participantIds = conversation.participants.map(p => p.toString());
            console.log('[typing] Emitting typing event to participants:', participantIds);
            
            // Emit to each participant's user room (excluding sender for conversation list)
            participantIds.forEach(participantId => {
              if (participantId !== mongoUserId.toString()) {
                io.to(`user:${participantId}`).emit('typing', typingEvent);
              }
            });
          }
        } catch (err) {
          console.error('[typing] Error fetching conversation participants:', err);
          // Continue even if this fails - the room broadcast above will still work
        }
      });
  
      // Send Message
      socket.on('send_message', async (payload, ack) => {
        try {
          if (!payload || !payload.conversationId) {
            return ack?.({ ok: false, error: 'conversationId required' });
          }
  
          const senderId = mongoUserId;
          if (!senderId) {
            return ack?.({ ok: false, error: 'unauthenticated' });
          }

          // Get sender info for the message
          const dbInstance = getDb();
          let sender;
          try {
            sender = await dbInstance.collection(USER_COLLECTION).findOne({ _id: new ObjectId(senderId) });
          } catch (err) {
            console.error('[send_message] Error finding sender:', err, 'senderId:', senderId);
            return ack?.({ ok: false, error: 'Invalid sender ID format' });
          }
          
          if (!sender) {
            console.error('[send_message] Sender not found for ID:', senderId);
            return ack?.({ ok: false, error: 'sender not found' });
          }
  
          // TODO: validate membership (security)
          const persisted = await createMessage({
            conversationId: payload.conversationId,
            senderId: senderId,
            body: payload.body,
            attachments: payload.attachments || [],
            type: payload.type || 'text',
            clientTs: payload.clientTs || Date.now()
          });
  
          // Acknowledgement to sender
          ack?.({
            ok: true,
            tempId: payload.tempId || null,
            messageId: persisted._id.toString(),
            seqNo: persisted.seqNo,
            serverTs: persisted.createdAt.toISOString()
          });
  
          // Format message using standard formatter
          const outgoing = formatMessage(persisted, sender);
          
          console.log('[send_message] Broadcasting message to room:', `conv:${persisted.conversationId}`);
          console.log('[send_message] Message details:', {
            id: outgoing.id,
            conversationId: outgoing.conversationId,
            senderId: outgoing.senderId,
            senderName: outgoing.senderName,
            text: outgoing.text?.substring(0, 50)
          });

          // Broadcast to room (including sender for consistency)
          const roomName = `conv:${persisted.conversationId}`;
          const socketsInRoom = await io.in(roomName).fetchSockets();
          console.log('[send_message] Sockets in room:', roomName, 'count:', socketsInRoom.length);
          
          io.to(roomName).emit('message', outgoing);
          
          // Emit conversation:message event ONLY to conversation participants
          // Get conversation participants and emit to their user-specific rooms
          const conversation = await dbInstance.collection(CONVERSATION_COLLECTION).findOne({ 
            _id: new ObjectId(persisted.conversationId) 
          });
          
          if (conversation && conversation.participants) {
            const participantIds = conversation.participants.map(p => p.toString());
            console.log('[send_message] Emitting conversation:message to participants:', participantIds);
            
            const conversationMessageEvent = {
              conversationId: persisted.conversationId,
              message: outgoing,
              timestamp: outgoing.timestamp
            };
            
            // Emit to each participant's user room
            participantIds.forEach(participantId => {
              io.to(`user:${participantId}`).emit('conversation:message', conversationMessageEvent);
            });
            
            console.log('[send_message] ✅ Message broadcasted to room and conversation:message event emitted to participants');
            console.log('[send_message] conversation:message event:', {
              conversationId: conversationMessageEvent.conversationId,
              messageId: conversationMessageEvent.message.id,
              participants: participantIds.length
            });
          } else {
            console.warn('[send_message] Conversation not found or has no participants, skipping conversation:message broadcast');
          }
  
        } catch (err) {
          console.error('send_message error', err);
          ack?.({ ok: false, error: err.message || 'internal error' });
        }
      });
  
      // Mark Read
      socket.on('mark_read', async (data, ack) => {
        try {
          if (!mongoUserId) {
            return ack?.({ ok: false, error: 'unauthenticated' });
          }
          // Pass the io instance and MongoDB user ID to the service
          await handleMarkRead(io, mongoUserId, data); 
          ack?.({ ok: true });
        } catch (err) {
          console.error('mark_read error', err);
          ack?.({ ok: false, error: err.message });
        }
      });
  
      // Disconnect
      socket.on('disconnect', (reason) => {
        console.log('socket disconnected', socket.id, reason);
        if (mongoUserId) {
          setPresenceOffline(io, mongoUserId).catch(e => console.error('presence offline error', e));
        }
      });
    });
  };