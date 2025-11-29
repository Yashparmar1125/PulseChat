// src/sockets/handlers.js

import { 
    setPresenceOnline, 
    setPresenceOffline, 
    handleMarkRead 
  } from '../services/presence.service.js'; 
  import { createMessage } from '../services/message.service.js'; // Assumed existing import
  
  // Export a function that accepts the global 'io' instance to handle broadcasting
  export const registerSocketHandlers = (io) => {
    
    io.on('connection', (socket) => {
      const uid = socket.user?.uid ?? null;
      console.log('socket connected', socket.id, 'uid=', uid);
  
      // Initial presence check
      if (uid) {
        setPresenceOnline(uid, socket.id).catch(e => console.error('presence set error', e));
      }
  
      // Client heartbeat
      socket.on('presence:heartbeat', async () => {
        if (!uid) return;
        await setPresenceOnline(uid, socket.id).catch(e => console.error('presence heartbeat error', e));
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
      socket.on('typing', ({ conversationId, isTyping }) => {
        if (!conversationId) return;
        socket.to(`conv:${conversationId}`).emit('typing', { 
          conversationId, 
          userId: uid, 
          isTyping: !!isTyping 
        });
      });
  
      // Send Message
      socket.on('send_message', async (payload, ack) => {
        try {
          if (!payload || !payload.conversationId) {
            return ack?.({ ok: false, error: 'conversationId required' });
          }
  
          const senderId = uid;
          if (!senderId) {
            return ack?.({ ok: false, error: 'unauthenticated' });
          }
  
          // TODO: validate membership (security)
          const persisted = await createMessage({
            conversationId: payload.conversationId,
            senderId,
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
  
          // Outgoing payload for other clients
          const outgoing = {
            _id: persisted._id.toString(),
            conversationId: persisted.conversationId,
            seqNo: persisted.seqNo,
            senderId: persisted.senderId,
            body: persisted.body,
            attachments: persisted.attachments,
            type: persisted.type,
            createdAt: persisted.createdAt
          };
  
          // Broadcast to room
          io.to(`conv:${persisted.conversationId}`).emit('message', outgoing);
  
        } catch (err) {
          console.error('send_message error', err);
          ack?.({ ok: false, error: err.message || 'internal error' });
        }
      });
  
      // Mark Read
      socket.on('mark_read', async (data, ack) => {
        try {
          if (!uid) {
            return ack?.({ ok: false, error: 'unauthenticated' });
          }
          // Pass the io instance down to the service for broadcasting
          await handleMarkRead(io, uid, data); 
          ack?.({ ok: true });
        } catch (err) {
          console.error('mark_read error', err);
          ack?.({ ok: false, error: err.message });
        }
      });
  
      // Disconnect
      socket.on('disconnect', (reason) => {
        console.log('socket disconnected', socket.id, reason);
        if (uid) {
          setPresenceOffline(uid).catch(e => console.error('presence offline error', e));
        }
      });
    });
  };