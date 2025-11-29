// src/controllers/user.controller.js

import { getDb } from '../libs/mongoClient.js';
import { USER_COLLECTION } from '../models/user.model.js';
import { ObjectId } from 'mongodb';

/**
 * Search users
 */
export const searchUsers = async (req, res) => {
    try {
        const { query, limit = 20 } = req.query;
        const userId = req.userId;
        const db = getDb();

        if (!query || query.trim().length === 0) {
            return res.json({ users: [] });
        }

        const searchRegex = new RegExp(query.trim(), 'i');
        
        const users = await db.collection(USER_COLLECTION)
            .find({
                _id: { $ne: new ObjectId(userId) },
                $or: [
                    { username: searchRegex },
                    { email: searchRegex },
                ]
            })
            .limit(parseInt(limit))
            .toArray();

        const formattedUsers = users.map(user => ({
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            profilePicUrl: user.profilePicUrl,
            statusText: user.statusText,
            isOnline: false, // Will be updated by presence service
        }));

        res.json({ users: formattedUsers });
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Failed to search users' });
    }
};

/**
 * Get user profile
 */
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.userId;
        const db = getDb();

        const user = await db.collection(USER_COLLECTION)
            .findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check privacy settings
        const isSelf = userId === currentUserId;
        const privacySettings = user.privacySettings || {};

        const profile = {
            id: user._id.toString(),
            username: user.username,
            email: isSelf ? user.email : undefined,
            profilePicUrl: user.profilePicUrl,
            statusText: user.statusText,
            createdAt: user.createdAt.toISOString(),
            lastActive: isSelf || privacySettings.lastSeen === 'everyone' 
                ? user.lastActive?.toISOString() 
                : undefined,
        };

        res.json({ user: profile });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, statusText, profilePicUrl, privacySettings } = req.body;
        const db = getDb();

        const updates = {};
        if (username !== undefined) updates.username = username;
        if (statusText !== undefined) updates.statusText = statusText;
        if (profilePicUrl !== undefined) updates.profilePicUrl = profilePicUrl;
        if (privacySettings !== undefined) updates.privacySettings = privacySettings;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        updates.updatedAt = new Date();

        await db.collection(USER_COLLECTION)
            .updateOne(
                { _id: new ObjectId(userId) },
                { $set: updates }
            );

        // Fetch updated user
        const updatedUser = await db.collection(USER_COLLECTION)
            .findOne({ _id: new ObjectId(userId) });

        res.json({
            user: {
                _id: updatedUser._id.toString(),
                username: updatedUser.username,
                email: updatedUser.email,
                profilePicUrl: updatedUser.profilePicUrl,
                statusText: updatedUser.statusText,
                privacySettings: updatedUser.privacySettings,
            },
            message: 'Profile updated successfully',
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};



