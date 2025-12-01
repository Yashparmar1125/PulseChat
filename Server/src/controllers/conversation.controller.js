// src/controllers/conversation.controller.js

import { getDb } from '../libs/mongoClient.js';
import { CONVERSATION_COLLECTION } from '../models/conversation.model.js';
import { MESSAGE_COLLECTION } from '../models/message.model.js';
import { USER_COLLECTION } from '../models/user.model.js';
import { ObjectId } from 'mongodb';

// Get Socket.IO instance - will be set by server.js
let ioInstance = null;
export function setSocketIOInstance(io) {
    ioInstance = io;
}

/**
 * Get all conversations for the current user
 */
export const getConversations = async (req, res) => {
    try {
        const userId = req.userId; // From authMiddleware
        const db = getDb();
        
        // Find all conversations where user is a participant
        const conversations = await db.collection(CONVERSATION_COLLECTION)
            .find({
                participants: userId
            })
            .sort({ updatedAt: -1 })
            .toArray();

        // Get presence status for all participants across all conversations
        const allParticipantIds = [...new Set(conversations.flatMap(conv => conv.participants))];
        const presenceRecords = await db.collection('presence')
            .find({ _id: { $in: allParticipantIds.map(id => new ObjectId(id)) } })
            .toArray();
        const presenceMap = new Map();
        presenceRecords.forEach(p => {
            const now = new Date();
            // Check if user is online: status is 'online' and expireAt is in the future (or doesn't exist)
            const isOnline = p.status === 'online' && (!p.expireAt || new Date(p.expireAt) > now);
            // Store with both ObjectId and string keys for lookup
            const idStr = p._id.toString();
            presenceMap.set(idStr, isOnline);
            // Also store with ObjectId key if needed
            if (p._id instanceof ObjectId) {
                presenceMap.set(p._id.toString(), isOnline);
            }
        });
        
        // Also check for participants that might not have presence records yet
        // (they might be online but haven't been stored yet)
        console.log('[getConversations] Presence check:', {
            totalParticipants: allParticipantIds.length,
            presenceRecordsFound: presenceRecords.length,
            presenceMapSize: presenceMap.size
        });

        // Enrich conversations with last message and participant details
        const enrichedConversations = await Promise.all(
            conversations.map(async (conv) => {
                // Get last message
                const lastMessage = await db.collection(MESSAGE_COLLECTION)
                    .findOne(
                        { conversationId: conv._id.toString() },
                        { sort: { createdAt: -1 } }
                    );

                // Get ALL participant details (including current user for sender lookup)
                const allParticipantIds = conv.participants.map(id => new ObjectId(id));
                const allParticipants = await db.collection(USER_COLLECTION)
                    .find({ _id: { $in: allParticipantIds } })
                    .toArray();

                // Separate participants (excluding current user) for the response
                const participants = allParticipants.filter(p => p._id.toString() !== userId);

                // Calculate unread count - messages not sent by current user AND not read by current user
                const unreadCount = await db.collection(MESSAGE_COLLECTION)
                    .countDocuments({
                        conversationId: conv._id.toString(),
                        senderId: { $ne: userId },
                        readBy: { $nin: [userId] } // userId is NOT in the readBy array
                    });

                // Determine conversation name
                let name = conv.name;
                if (!name && conv.type === 'private') {
                    if (participants.length === 1) {
                        name = participants[0].username || participants[0].email;
                    }
                }

                return {
                    id: conv._id.toString(),
                    name: name || 'Unnamed Conversation',
                    avatar: conv.avatar || (participants[0]?.profilePicUrl),
                    lastMessage: lastMessage ? (() => {
                        // Find sender in ALL participants (including current user)
                        const senderIdStr = lastMessage.senderId?.toString() || lastMessage.senderId;
                        let sender = allParticipants.find(p => 
                            p._id.toString() === senderIdStr || 
                            p._id.toString() === lastMessage.senderId
                        );
                        
                        // If sender not found in participants, fetch separately
                        if (!sender && senderIdStr) {
                            // This shouldn't happen, but as a fallback, we could fetch the sender
                            // For now, we'll just log it
                            console.warn('[getConversations] Sender not found in participants for lastMessage:', senderIdStr);
                        }
                        
                        // If sender is current user, use "You" as senderName
                        const isCurrentUser = senderIdStr === userId;
                        
                        return {
                            id: lastMessage._id.toString(),
                            text: lastMessage.body || '',
                            senderId: senderIdStr,
                            senderName: isCurrentUser 
                                ? 'You' 
                                : (sender?.username || sender?.email || 'Unknown'),
                            timestamp: lastMessage.createdAt.toISOString(),
                            type: lastMessage.type || 'text',
                        };
                    })() : undefined,
                    unreadCount,
                    isPinned: conv.pinnedBy?.includes(userId) || false,
                    isArchived: conv.archivedBy?.includes(userId) || false,
                    isGroup: conv.type === 'group',
                    participants: participants.map(p => {
                        const participantId = p._id.toString();
                        const isOnline = presenceMap.get(participantId) || false;
                        return {
                            id: participantId,
                            name: p.username,
                            avatar: p.profilePicUrl,
                            email: p.email,
                            isOnline: isOnline,
                        };
                    }),
                    updatedAt: conv.updatedAt?.toISOString() || conv.createdAt.toISOString(),
                    createdAt: conv.createdAt.toISOString(),
                };
            })
        );

        res.json({ conversations: enrichedConversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Failed to fetch conversations' });
    }
};

/**
 * Get a single conversation by ID
 */
export const getConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.userId;
        const db = getDb();

        const conversation = await db.collection(CONVERSATION_COLLECTION)
            .findOne({ _id: new ObjectId(conversationId) });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Check if user is a participant
        if (!conversation.participants.some(p => p.toString() === userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Get participant details
        const participantIds = conversation.participants
            .map(id => new ObjectId(id));

        const participants = await db.collection(USER_COLLECTION)
            .find({ _id: { $in: participantIds } })
            .toArray();

        let name = conversation.name;
        if (!name && conversation.type === 'private') {
            const otherParticipant = participants.find(p => p._id.toString() !== userId);
            name = otherParticipant?.username || otherParticipant?.email || 'Unknown';
        }

        res.json({
            id: conversation._id.toString(),
            name: name || 'Unnamed Conversation',
            avatar: conversation.avatar,
            isGroup: conversation.type === 'group',
            participants: participants.map(p => ({
                id: p._id.toString(),
                name: p.username,
                avatar: p.profilePicUrl,
                email: p.email,
            })),
            createdAt: conversation.createdAt.toISOString(),
            updatedAt: conversation.updatedAt?.toISOString() || conversation.createdAt.toISOString(),
        });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ message: 'Failed to fetch conversation' });
    }
};

/**
 * Create a new conversation
 */
export const createConversation = async (req, res) => {
    try {
        const { participantIds, name, type = 'private' } = req.body;
        const userId = req.userId;
        const db = getDb();

        if (!participantIds || !Array.isArray(participantIds)) {
            return res.status(400).json({ message: 'participantIds array is required' });
        }

        // For private conversations, check if one already exists
        if (type === 'private' && participantIds.length === 1) {
            const existing = await db.collection(CONVERSATION_COLLECTION)
                .findOne({
                    type: 'private',
                    participants: { $all: [userId, participantIds[0]] }
                });

            if (existing) {
                // Return existing conversation ID (not an error, just return it)
                return res.json({
                    id: existing._id.toString(),
                    message: 'Conversation already exists',
                    existing: true,
                });
            }
        }

        // Validate all participants exist
        const allParticipantIds = [...new Set([userId, ...participantIds])];
        const participants = await db.collection(USER_COLLECTION)
            .find({ _id: { $in: allParticipantIds.map(id => new ObjectId(id)) } })
            .toArray();

        if (participants.length !== allParticipantIds.length) {
            return res.status(400).json({ message: 'One or more participants not found' });
        }

        const newConversation = {
            type,
            name: type === 'group' ? name : undefined,
            participants: allParticipantIds,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userId,
            pinnedBy: [],
            archivedBy: [],
        };

        const result = await db.collection(CONVERSATION_COLLECTION)
            .insertOne(newConversation);

        const newConversationId = result.insertedId.toString();
        
        // Broadcast conversation update to all participants
        if (ioInstance) {
            try {
                // Notify all participants about the new conversation
                allParticipantIds.forEach(participantId => {
                    ioInstance.emit('conversation:update', {
                        conversationId: newConversationId,
                        type: 'created',
                        userId: participantId.toString()
                    });
                });
                console.log('[createConversation] Broadcasted conversation update to participants');
            } catch (wsError) {
                console.error('[createConversation] Error broadcasting conversation update:', wsError);
            }
        }
        
        res.status(201).json({
            id: newConversationId,
            message: 'Conversation created successfully',
        });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ message: 'Failed to create conversation' });
    }
};

/**
 * Archive/Unarchive a conversation
 */
export const archiveConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { archived = true } = req.body;
        const userId = req.userId;
        const db = getDb();

        const conversation = await db.collection(CONVERSATION_COLLECTION)
            .findOne({ _id: new ObjectId(conversationId) });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.some(p => p.toString() === userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const archivedBy = conversation.archivedBy || [];
        if (archived) {
            if (!archivedBy.includes(userId)) {
                archivedBy.push(userId);
            }
        } else {
            const index = archivedBy.indexOf(userId);
            if (index > -1) {
                archivedBy.splice(index, 1);
            }
        }

        await db.collection(CONVERSATION_COLLECTION)
            .updateOne(
                { _id: new ObjectId(conversationId) },
                { $set: { archivedBy, updatedAt: new Date() } }
            );

        res.json({ message: archived ? 'Conversation archived' : 'Conversation unarchived' });
    } catch (error) {
        console.error('Error archiving conversation:', error);
        res.status(500).json({ message: 'Failed to archive conversation' });
    }
};

/**
 * Pin/Unpin a conversation
 */
export const pinConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { pinned = true } = req.body;
        const userId = req.userId;
        const db = getDb();

        const conversation = await db.collection(CONVERSATION_COLLECTION)
            .findOne({ _id: new ObjectId(conversationId) });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.some(p => p.toString() === userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const pinnedBy = conversation.pinnedBy || [];
        if (pinned) {
            if (!pinnedBy.includes(userId)) {
                pinnedBy.push(userId);
            }
        } else {
            const index = pinnedBy.indexOf(userId);
            if (index > -1) {
                pinnedBy.splice(index, 1);
            }
        }

        await db.collection(CONVERSATION_COLLECTION)
            .updateOne(
                { _id: new ObjectId(conversationId) },
                { $set: { pinnedBy, updatedAt: new Date() } }
            );

        // Broadcast pin update via WebSocket if available
        if (ioInstance) {
            try {
                // Emit to all conversation participants
                const participantIds = conversation.participants.map(p => p.toString());
                participantIds.forEach(participantId => {
                    ioInstance.to(`user:${participantId}`).emit('conversation:pin', {
                        conversationId: conversationId,
                        userId: userId,
                        pinned: pinned
                    });
                });
                console.log('[pinConversation] Broadcasted pin update to participants:', participantIds);
            } catch (wsError) {
                console.error('[pinConversation] Error broadcasting via WebSocket:', wsError);
            }
        }

        res.json({ message: pinned ? 'Conversation pinned' : 'Conversation unpinned' });
    } catch (error) {
        console.error('Error pinning conversation:', error);
        res.status(500).json({ message: 'Failed to pin conversation' });
    }
};

/**
 * Delete a conversation (remove user from participants)
 */
export const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.userId;
        const db = getDb();

        const conversation = await db.collection(CONVERSATION_COLLECTION)
            .findOne({ _id: new ObjectId(conversationId) });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.some(p => p.toString() === userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // For private conversations, delete entirely
        // For group conversations, remove user from participants
        if (conversation.type === 'private') {
            await db.collection(CONVERSATION_COLLECTION)
                .deleteOne({ _id: new ObjectId(conversationId) });
        } else {
            await db.collection(CONVERSATION_COLLECTION)
                .updateOne(
                    { _id: new ObjectId(conversationId) },
                    { 
                        $pull: { participants: userId },
                        $set: { updatedAt: new Date() }
                    }
                );
        }

        res.json({ message: 'Conversation deleted' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ message: 'Failed to delete conversation' });
    }
};

