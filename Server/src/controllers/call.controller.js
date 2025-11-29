// src/controllers/call.controller.js

import { getDb } from '../libs/mongoClient.js';
import { CALLLOG_COLLECTION } from '../models/callLog.model.js';
import { CONVERSATION_COLLECTION } from '../models/conversation.model.js';
import { USER_COLLECTION } from '../models/user.model.js';
import { ObjectId } from 'mongodb';

/**
 * Get call logs
 */
export const getCallLogs = async (req, res) => {
    try {
        const userId = req.userId;
        const { limit = 50 } = req.query;
        const db = getDb();

        const callLogs = await db.collection(CALLLOG_COLLECTION)
            .find({
                participants: userId,
            })
            .sort({ startedAt: -1 })
            .limit(parseInt(limit))
            .toArray();

        // Get participant details
        const allParticipantIds = new Set();
        callLogs.forEach(log => {
            log.participants?.forEach(p => allParticipantIds.add(p));
        });

        const participants = await db.collection(USER_COLLECTION)
            .find({ _id: { $in: Array.from(allParticipantIds).map(id => new ObjectId(id)) } })
            .toArray();

        const participantMap = new Map(participants.map(p => [p._id.toString(), p]));

        const formattedLogs = callLogs.map(log => {
            const otherParticipants = log.participants
                .filter(p => p !== userId)
                .map(p => participantMap.get(p))
                .filter(Boolean);

            return {
                id: log._id.toString(),
                type: log.type,
                status: log.status,
                duration: log.duration || 0,
                startedAt: log.startedAt.toISOString(),
                endedAt: log.endedAt?.toISOString(),
                participants: otherParticipants.map(p => ({
                    id: p._id.toString(),
                    username: p.username,
                    profilePicUrl: p.profilePicUrl,
                })),
            };
        });

        res.json({ callLogs: formattedLogs });
    } catch (error) {
        console.error('Error fetching call logs:', error);
        res.status(500).json({ message: 'Failed to fetch call logs' });
    }
};

/**
 * Create a call log (initiate call)
 */
export const initiateCall = async (req, res) => {
    try {
        const userId = req.userId;
        const { conversationId, type = 'voice' } = req.body;
        const db = getDb();

        if (!conversationId) {
            return res.status(400).json({ message: 'conversationId is required' });
        }

        // Verify conversation exists and user is participant
        const conversation = await db.collection(CONVERSATION_COLLECTION)
            .findOne({ _id: new ObjectId(conversationId) });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.some(p => p.toString() === userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const newCall = {
            conversationId,
            type, // 'voice' or 'video'
            status: 'ringing',
            participants: conversation.participants.map(p => p.toString()),
            startedAt: new Date(),
            startedBy: userId,
        };

        const result = await db.collection(CALLLOG_COLLECTION)
            .insertOne(newCall);

        res.status(201).json({
            id: result.insertedId.toString(),
            message: 'Call initiated',
        });
    } catch (error) {
        console.error('Error initiating call:', error);
        res.status(500).json({ message: 'Failed to initiate call' });
    }
};

/**
 * Update call status (answer, end, etc.)
 */
export const updateCall = async (req, res) => {
    try {
        const { callId } = req.params;
        const { status, duration } = req.body;
        const userId = req.userId;
        const db = getDb();

        const call = await db.collection(CALLLOG_COLLECTION)
            .findOne({ _id: new ObjectId(callId) });

        if (!call) {
            return res.status(404).json({ message: 'Call not found' });
        }

        if (!call.participants?.includes(userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updates = {};
        if (status) updates.status = status;
        if (duration !== undefined) updates.duration = duration;
        if (status === 'ended' || status === 'missed' || status === 'declined') {
            updates.endedAt = new Date();
        }

        await db.collection(CALLLOG_COLLECTION)
            .updateOne(
                { _id: new ObjectId(callId) },
                { $set: updates }
            );

        res.json({ message: 'Call updated successfully' });
    } catch (error) {
        console.error('Error updating call:', error);
        res.status(500).json({ message: 'Failed to update call' });
    }
};

