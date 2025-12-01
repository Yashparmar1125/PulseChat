// src/controllers/status.controller.js

import { getDb } from '../libs/mongoClient.js';
import { STATUS_COLLECTION } from '../models/status.model.js';
import { USER_COLLECTION } from '../models/user.model.js';
import { ObjectId } from 'mongodb';

/**
 * Get statuses from contacts
 */
export const getStatuses = async (req, res) => {
    try {
        const userId = req.userId;
        const db = getDb();

        // Get user's contacts (for now, get all users - can be improved with contacts list)
        const user = await db.collection(USER_COLLECTION)
            .findOne({ _id: new ObjectId(userId) });

        // Get statuses from last 24 hours
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);

        const statuses = await db.collection(STATUS_COLLECTION)
            .find({
                createdAt: { $gte: oneDayAgo },
            })
            .sort({ createdAt: -1 })
            .toArray();

        // Group by user
        const statusMap = new Map();
        for (const status of statuses) {
            const userId = status.userId.toString();
            if (!statusMap.has(userId)) {
                statusMap.set(userId, []);
            }
            statusMap.get(userId).push({
                id: status._id.toString(),
                text: status.text,
                mediaUrl: status.mediaUrl,
                type: status.type,
                createdAt: status.createdAt.toISOString(),
                views: status.views || [],
            });
        }

        // Get user details for each status
        const userIds = Array.from(statusMap.keys());
        const users = await db.collection(USER_COLLECTION)
            .find({ _id: { $in: userIds.map(id => new ObjectId(id)) } })
            .toArray();

        const formattedStatuses = users.map(user => ({
            userId: user._id.toString(),
            username: user.username,
            profilePicUrl: user.profilePicUrl,
            statuses: statusMap.get(user._id.toString()) || [],
        }));

        res.json({ statuses: formattedStatuses });
    } catch (error) {
        console.error('Error fetching statuses:', error);
        res.status(500).json({ message: 'Failed to fetch statuses' });
    }
};

/**
 * Create a status
 */
export const createStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const { text, mediaUrl, type = 'text' } = req.body;
        const db = getDb();

        if (!text && !mediaUrl) {
            return res.status(400).json({ message: 'Text or mediaUrl is required' });
        }

        const newStatus = {
            userId: new ObjectId(userId),
            text: text || '',
            mediaUrl: mediaUrl || null,
            type,
            views: [],
            createdAt: new Date(),
        };

        const result = await db.collection(STATUS_COLLECTION)
            .insertOne(newStatus);

        res.status(201).json({
            id: result.insertedId.toString(),
            message: 'Status created successfully',
        });
    } catch (error) {
        console.error('Error creating status:', error);
        res.status(500).json({ message: 'Failed to create status' });
    }
};

/**
 * View a status (mark as viewed)
 */
export const viewStatus = async (req, res) => {
    try {
        const { statusId } = req.params;
        const userId = req.userId;
        const db = getDb();

        const status = await db.collection(STATUS_COLLECTION)
            .findOne({ _id: new ObjectId(statusId) });

        if (!status) {
            return res.status(404).json({ message: 'Status not found' });
        }

        // Add user to views if not already viewed
        if (!status.views?.includes(userId)) {
            await db.collection(STATUS_COLLECTION)
                .updateOne(
                    { _id: new ObjectId(statusId) },
                    { $addToSet: { views: userId } }
                );
        }

        res.json({ message: 'Status viewed' });
    } catch (error) {
        console.error('Error viewing status:', error);
        res.status(500).json({ message: 'Failed to view status' });
    }
};

/**
 * Delete a status
 */
export const deleteStatus = async (req, res) => {
    try {
        const { statusId } = req.params;
        const userId = req.userId;
        const db = getDb();

        const status = await db.collection(STATUS_COLLECTION)
            .findOne({ _id: new ObjectId(statusId) });

        if (!status) {
            return res.status(404).json({ message: 'Status not found' });
        }

        if (status.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You can only delete your own status' });
        }

        await db.collection(STATUS_COLLECTION)
            .deleteOne({ _id: new ObjectId(statusId) });

        res.json({ message: 'Status deleted successfully' });
    } catch (error) {
        console.error('Error deleting status:', error);
        res.status(500).json({ message: 'Failed to delete status' });
    }
};






