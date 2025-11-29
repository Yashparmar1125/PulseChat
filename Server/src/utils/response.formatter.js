// Standardized response formatters for consistent API responses

import { ObjectId } from 'mongodb';

/**
 * Format a user document to the standard user response format
 */
export function formatUser(user) {
    if (!user) return null;
    
    return {
        id: user._id?.toString() || user.id,
        username: user.username || user.email?.split('@')[0] || 'Unknown',
        email: user.email,
        profilePicUrl: user.profilePicUrl || null,
        statusText: user.statusText || null,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        lastActive: user.lastActive?.toISOString() || null,
    };
}

/**
 * Format a message document to the standard message response format
 */
export function formatMessage(msg, sender = null) {
    if (!msg) {
        console.warn('[formatMessage] null/undefined message');
        return null;
    }
    
    try {
        const senderId = msg.senderId instanceof ObjectId 
            ? msg.senderId.toString() 
            : (msg.senderId?.toString() || msg.senderId || '');
        
        const formatted = {
            id: msg._id?.toString() || msg.id?.toString() || '',
            conversationId: msg.conversationId?.toString() || msg.conversationId || '',
            senderId: senderId,
            senderName: sender?.username || sender?.email || 'Unknown',
            senderAvatar: sender?.profilePicUrl || null,
            text: msg.body || msg.text || '',
            type: msg.type || 'text',
            timestamp: msg.createdAt?.toISOString() || msg.timestamp || new Date().toISOString(),
            editedAt: msg.editedAt?.toISOString() || null,
            readBy: Array.isArray(msg.readBy) 
                ? msg.readBy.map(id => {
                    if (id instanceof ObjectId) return id.toString();
                    if (id && typeof id.toString === 'function') return id.toString();
                    return String(id);
                }).filter(Boolean)
                : [],
            attachments: msg.attachments || [],
            status: 'sent', // Will be updated by client
        };
        
        return formatted;
    } catch (error) {
        console.error('[formatMessage] Error formatting message:', error, 'Message:', msg);
        return null;
    }
}

/**
 * Format multiple messages with sender lookup
 */
export function formatMessages(messages, sendersMap) {
    if (!Array.isArray(messages)) {
        console.error('[formatMessages] messages is not an array:', typeof messages);
        return [];
    }
    
    if (!sendersMap || !(sendersMap instanceof Map)) {
        console.error('[formatMessages] sendersMap is not a Map:', typeof sendersMap);
        return messages.map(msg => formatMessage(msg, null));
    }
    
    return messages.map(msg => {
        if (!msg) {
            console.warn('[formatMessages] null/undefined message in array');
            return null;
        }
        
        const senderId = msg.senderId instanceof ObjectId 
            ? msg.senderId.toString() 
            : (msg.senderId?.toString() || msg.senderId);
        
        const sender = sendersMap.get(senderId) || 
                      sendersMap.get(msg.senderId) ||
                      (msg.senderId instanceof ObjectId ? sendersMap.get(msg.senderId.toString()) : null);
        
        return formatMessage(msg, sender);
    }).filter(Boolean); // Remove any null entries
}

/**
 * Create a senders map from user documents
 */
export function createSendersMap(senders) {
    const map = new Map();
    
    senders.forEach(sender => {
        const idStr = sender._id?.toString() || sender.id;
        map.set(idStr, sender);
        
        // Also add ObjectId as key if available
        if (sender._id instanceof ObjectId) {
            map.set(sender._id, sender);
        }
    });
    
    return map;
}

/**
 * Normalize senderId to string for consistent lookup
 */
export function normalizeSenderId(senderId) {
    if (!senderId) return null;
    if (senderId instanceof ObjectId) return senderId.toString();
    return senderId.toString();
}

