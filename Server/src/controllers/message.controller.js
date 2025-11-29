// src/controllers/message.controller.js

import { getDb } from '../libs/mongoClient.js';
import { MESSAGE_COLLECTION } from '../models/message.model.js';
import { CONVERSATION_COLLECTION } from '../models/conversation.model.js';
import { USER_COLLECTION } from '../models/user.model.js';
import { ObjectId } from 'mongodb';
import { formatMessages, formatMessage, createSendersMap, normalizeSenderId } from '../utils/response.formatter.js';

// Get Socket.IO instance - will be set by server.js
let ioInstance = null;
export function setSocketIOInstance(io) {
    ioInstance = io;
}

/**
 * Get messages for a conversation
 */
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { limit = 50, before } = req.query;
        const userId = req.userId;
        const db = getDb();

        console.log('[getMessages] Fetching messages for conversation:', conversationId, 'userId:', userId);
        console.log('[getMessages] Database connection:', db ? 'OK' : 'FAILED');

        // Verify user is a participant
        let conversation;
        try {
            conversation = await db.collection(CONVERSATION_COLLECTION)
                .findOne({ _id: new ObjectId(conversationId) });
            console.log('[getMessages] Conversation found:', conversation ? 'YES' : 'NO');
        } catch (err) {
            console.error('[getMessages] Invalid conversationId format:', err);
            console.error('[getMessages] Error details:', {
                message: err.message,
                conversationId,
                userId
            });
            return res.status(400).json({ message: 'Invalid conversation ID format', error: err.message });
        }

        if (!conversation) {
            console.log('[getMessages] Conversation not found:', conversationId);
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.some(p => p.toString() === userId)) {
            console.log('[getMessages] Access denied - user not a participant');
            return res.status(403).json({ message: 'Access denied' });
        }

        // Build query - conversationId is stored as string in messages collection
        const query = { 
            conversationId: conversationId.toString() // Ensure it's a string
        };
        if (before) {
            try {
                query.createdAt = { $lt: new Date(before) };
            } catch (err) {
                console.error('[getMessages] Invalid before date:', err);
            }
        }

        console.log('[getMessages] Query:', JSON.stringify(query));

        // Get messages
        let messages = [];
        try {
            const cursor = db.collection(MESSAGE_COLLECTION).find(query);
            
            // Try sorting by createdAt first, fallback to seqNo if createdAt doesn't exist
            try {
                messages = await cursor
                    .sort({ createdAt: -1 })
                    .limit(parseInt(limit) || 50)
                    .toArray();
            } catch (sortErr) {
                console.warn('[getMessages] Error sorting by createdAt, trying seqNo:', sortErr);
                // Fallback to seqNo if createdAt doesn't exist
                messages = await db.collection(MESSAGE_COLLECTION)
                    .find(query)
                    .sort({ seqNo: -1 })
                    .limit(parseInt(limit) || 50)
                    .toArray();
            }
        } catch (err) {
            console.error('[getMessages] Error querying messages:', err);
            console.error('[getMessages] Error details:', {
                message: err.message,
                stack: err.stack,
                conversationId,
                query
            });
            throw err;
        }

        console.log('[getMessages] Found', messages.length, 'messages');

        // Get unique sender IDs and normalize them
        const senderIds = [...new Set(messages.map(m => normalizeSenderId(m.senderId)).filter(Boolean))];
        
        console.log('[getMessages] Unique senderIds:', senderIds);
        
        // Fetch all senders in one query
        let senders = [];
        if (senderIds.length > 0) {
          try {
            const objectIds = senderIds
              .map(id => {
                try {
                  return id instanceof ObjectId ? id : new ObjectId(id);
                } catch (e) {
                  console.error('[getMessages] Invalid senderId format:', id);
                  return null;
                }
              })
              .filter(Boolean);
            
            if (objectIds.length > 0) {
              senders = await db.collection(USER_COLLECTION)
                  .find({ _id: { $in: objectIds } })
                  .toArray();
              
              console.log('[getMessages] Found', senders.length, 'senders out of', objectIds.length, 'requested');
            }
          } catch (err) {
            console.error('[getMessages] Error fetching senders:', err);
            senders = [];
          }
        }

        // Create senders map for efficient lookup
        const sendersMap = createSendersMap(senders);
        console.log('[getMessages] Senders map size:', sendersMap.size);

        // Reverse messages to get chronological order (oldest first)
        const reversedMessages = messages.reverse();
        console.log('[getMessages] Reversed messages count:', reversedMessages.length);

        // Format messages using the formatter utility
        let formattedMessages;
        try {
            formattedMessages = formatMessages(reversedMessages, sendersMap);
            console.log('[getMessages] formatMessages result type:', typeof formattedMessages, 'isArray:', Array.isArray(formattedMessages));
        } catch (formatError) {
            console.error('[getMessages] Error in formatMessages:', formatError);
            console.error('[getMessages] Format error stack:', formatError.stack);
            return res.status(500).json({ 
                message: 'Failed to format messages',
                error: formatError.message
            });
        }
        
        if (!formattedMessages || !Array.isArray(formattedMessages)) {
            console.error('[getMessages] formatMessages returned invalid result:', typeof formattedMessages, formattedMessages);
            // Fallback: format manually
            console.log('[getMessages] Attempting manual formatting as fallback');
            formattedMessages = reversedMessages.map(msg => {
                const senderId = msg.senderId?.toString() || msg.senderId;
                const sender = sendersMap.get(senderId);
                return {
                    id: msg._id?.toString() || '',
                    conversationId: msg.conversationId?.toString() || msg.conversationId || '',
                    senderId: senderId || '',
                    senderName: sender?.username || sender?.email || 'Unknown',
                    senderAvatar: sender?.profilePicUrl || null,
                    text: msg.body || msg.text || '',
                    type: msg.type || 'text',
                    timestamp: msg.createdAt?.toISOString() || new Date().toISOString(),
                    editedAt: msg.editedAt?.toISOString() || null,
                    readBy: Array.isArray(msg.readBy) ? msg.readBy.map(id => id?.toString() || id) : [],
                    attachments: msg.attachments || [],
                    status: 'sent',
                };
            });
        }

        console.log('[getMessages] Returning', formattedMessages.length, 'formatted messages');
        
        // Prevent caching for dynamic message data
        res.set({
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
        });
        
        res.json({ messages: formattedMessages });
    } catch (error) {
        console.error('[getMessages] ========== ERROR ==========');
        console.error('[getMessages] Error message:', error.message);
        console.error('[getMessages] Error name:', error.name);
        console.error('[getMessages] Error stack:', error.stack);
        console.error('[getMessages] ConversationId:', conversationId);
        console.error('[getMessages] UserId:', userId);
        console.error('[getMessages] ==========================');
        
        res.status(500).json({ 
            message: 'Failed to fetch messages',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            details: process.env.NODE_ENV === 'development' ? {
                name: error.name,
                stack: error.stack
            } : undefined
        });
    }
};

/**
 * Send a message
 */
export const sendMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { text, type = 'text', replyToId, attachments = [] } = req.body;
        const userId = req.userId;
        const db = getDb();

        // Verify user is a participant
        const conversation = await db.collection(CONVERSATION_COLLECTION)
            .findOne({ _id: new ObjectId(conversationId) });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.some(p => p.toString() === userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Get sequence number
        const lastMessage = await db.collection(MESSAGE_COLLECTION)
            .findOne(
                { conversationId },
                { sort: { seqNo: -1 } }
            );
        const seqNo = (lastMessage?.seqNo || 0) + 1;

        // Create message
        const newMessage = {
            conversationId,
            senderId: userId,
            body: text,
            type,
            attachments,
            seqNo,
            readBy: [userId], // Sender has read their own message
            createdAt: new Date(),
            replyTo: replyToId ? new ObjectId(replyToId) : undefined,
        };

        const result = await db.collection(MESSAGE_COLLECTION)
            .insertOne(newMessage);

        // Update conversation updatedAt
        await db.collection(CONVERSATION_COLLECTION)
            .updateOne(
                { _id: new ObjectId(conversationId) },
                { $set: { updatedAt: new Date() } }
            );

        // Get sender details
        const sender = await db.collection(USER_COLLECTION)
            .findOne({ _id: new ObjectId(userId) });

        // Use formatter for consistent response
        const formattedMessage = formatMessage(
            { ...newMessage, _id: result.insertedId },
            sender
        );

        // Broadcast message via WebSocket if available
        if (ioInstance) {
            try {
                const roomName = `conv:${conversationId}`;
                console.log('[sendMessage] Broadcasting message via WebSocket to room:', roomName);
                console.log('[sendMessage] Message details:', {
                    id: formattedMessage.id,
                    conversationId: formattedMessage.conversationId,
                    senderId: formattedMessage.senderId,
                    senderName: formattedMessage.senderName,
                    text: formattedMessage.text?.substring(0, 50)
                });
                
                // Check how many sockets are in the room
                const socketsInRoom = await ioInstance.in(roomName).fetchSockets();
                console.log('[sendMessage] Sockets in room:', roomName, 'count:', socketsInRoom.length);
                
                // Broadcast to conversation room
                ioInstance.to(roomName).emit('message', formattedMessage);
                
                // Emit conversation:message event ONLY to conversation participants
                // Get conversation participants and emit to their user-specific rooms
                const participantIds = conversation.participants.map(p => p.toString());
                console.log('[sendMessage] Emitting conversation:message to participants:', participantIds);
                
                const conversationMessageEvent = {
                    conversationId: conversationId,
                    message: formattedMessage,
                    timestamp: formattedMessage.timestamp
                };
                
                // Emit to each participant's user room
                participantIds.forEach(participantId => {
                    ioInstance.to(`user:${participantId}`).emit('conversation:message', conversationMessageEvent);
                });
                
                console.log('[sendMessage] ✅ Message broadcasted successfully via REST API');
            } catch (wsError) {
                console.error('[sendMessage] ❌ Error broadcasting via WebSocket:', wsError);
                // Don't fail the request if WebSocket broadcast fails
            }
        } else {
            console.warn('[sendMessage] ⚠️ Socket.IO instance not available for broadcasting');
        }

        res.status(201).json({ message: formattedMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
};

/**
 * Update a message
 */
export const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;
        const userId = req.userId;
        const db = getDb();

        const message = await db.collection(MESSAGE_COLLECTION)
            .findOne({ _id: new ObjectId(messageId) });

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.senderId !== userId) {
            return res.status(403).json({ message: 'You can only edit your own messages' });
        }

        await db.collection(MESSAGE_COLLECTION)
            .updateOne(
                { _id: new ObjectId(messageId) },
                { 
                    $set: { 
                        body: text,
                        editedAt: new Date()
                    }
                }
            );

        res.json({ message: 'Message updated successfully' });
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ message: 'Failed to update message' });
    }
};

/**
 * Delete a message
 */
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.userId;
        const db = getDb();

        const message = await db.collection(MESSAGE_COLLECTION)
            .findOne({ _id: new ObjectId(messageId) });

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Verify user is sender or conversation admin
        if (message.senderId !== userId) {
            return res.status(403).json({ message: 'You can only delete your own messages' });
        }

        await db.collection(MESSAGE_COLLECTION)
            .deleteOne({ _id: new ObjectId(messageId) });

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Failed to delete message' });
    }
};

/**
 * Mark messages as read
 */
export const markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.userId;
        const db = getDb();

        // Verify user is a participant
        const conversation = await db.collection(CONVERSATION_COLLECTION)
            .findOne({ _id: new ObjectId(conversationId) });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.some(p => p.toString() === userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Mark all unread messages as read
        const updateResult = await db.collection(MESSAGE_COLLECTION)
            .updateMany(
                {
                    conversationId,
                    senderId: { $ne: userId },
                    readBy: { $nin: [userId] } // userId is NOT in the readBy array
                },
                {
                    $addToSet: { readBy: userId }
                }
            );

        // Broadcast read receipts via WebSocket if available
        if (ioInstance) {
            try {
                ioInstance.to(`conv:${conversationId}`).emit('message_read', {
                    conversationId,
                    messageIds: [], // Empty array means all messages in conversation
                    readerId: userId,
                    readAt: new Date().toISOString()
                });
                
                // Emit conversation:read event ONLY to conversation participants
                const participantIds = conversation.participants.map(p => p.toString());
                console.log('[markAsRead] Emitting conversation:read to participants:', participantIds);
                
                const conversationReadEvent = {
                    conversationId,
                    readerId: userId,
                    readCount: updateResult.modifiedCount
                };
                
                // Emit to each participant's user room
                participantIds.forEach(participantId => {
                    ioInstance.to(`user:${participantId}`).emit('conversation:read', conversationReadEvent);
                });
            } catch (wsError) {
                console.error('[markAsRead] Error broadcasting via WebSocket:', wsError);
            }
        }

        res.json({ 
            message: 'Messages marked as read',
            readCount: updateResult.modifiedCount 
        });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ message: 'Failed to mark messages as read' });
    }
};

