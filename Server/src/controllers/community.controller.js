// src/controllers/community.controller.js

import { getDb } from '../libs/mongoClient.js';
import { COMMUNITY_COLLECTION } from '../models/community.model.js';
import { CONVERSATION_COLLECTION } from '../models/conversation.model.js';
import { USER_COLLECTION } from '../models/user.model.js';
import { ObjectId } from 'mongodb';

/**
 * Get all communities user is part of
 */
export const getCommunities = async (req, res) => {
    try {
        const userId = req.userId;
        const db = getDb();

        const communities = await db.collection(COMMUNITY_COLLECTION)
            .find({
                members: userId,
            })
            .sort({ createdAt: -1 })
            .toArray();

        const formattedCommunities = communities.map(community => ({
            id: community._id.toString(),
            name: community.name,
            description: community.description,
            avatar: community.avatar,
            memberCount: community.members?.length || 0,
            createdAt: community.createdAt.toISOString(),
        }));

        res.json({ communities: formattedCommunities });
    } catch (error) {
        console.error('Error fetching communities:', error);
        res.status(500).json({ message: 'Failed to fetch communities' });
    }
};

/**
 * Get a single community
 */
export const getCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.userId;
        const db = getDb();

        const community = await db.collection(COMMUNITY_COLLECTION)
            .findOne({ _id: new ObjectId(communityId) });

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        if (!community.members?.includes(userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Get member details
        const memberIds = community.members.map(id => new ObjectId(id));
        const members = await db.collection(USER_COLLECTION)
            .find({ _id: { $in: memberIds } })
            .toArray();

        // Get channels
        const channels = await db.collection(CONVERSATION_COLLECTION)
            .find({
                type: 'community_channel',
                communityId: communityId,
            })
            .toArray();

        res.json({
            id: community._id.toString(),
            name: community.name,
            description: community.description,
            avatar: community.avatar,
            members: members.map(m => ({
                id: m._id.toString(),
                username: m.username,
                profilePicUrl: m.profilePicUrl,
            })),
            channels: channels.map(c => ({
                id: c._id.toString(),
                name: c.name,
                description: c.description,
            })),
            createdAt: community.createdAt.toISOString(),
        });
    } catch (error) {
        console.error('Error fetching community:', error);
        res.status(500).json({ message: 'Failed to fetch community' });
    }
};

/**
 * Create a community
 */
export const createCommunity = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, description, avatar } = req.body;
        const db = getDb();

        if (!name) {
            return res.status(400).json({ message: 'Community name is required' });
        }

        const newCommunity = {
            name,
            description: description || '',
            avatar: avatar || null,
            createdBy: userId,
            members: [userId], // Creator is automatically a member
            admins: [userId], // Creator is automatically an admin
            createdAt: new Date(),
        };

        const result = await db.collection(COMMUNITY_COLLECTION)
            .insertOne(newCommunity);

        res.status(201).json({
            id: result.insertedId.toString(),
            message: 'Community created successfully',
        });
    } catch (error) {
        console.error('Error creating community:', error);
        res.status(500).json({ message: 'Failed to create community' });
    }
};

/**
 * Join a community
 */
export const joinCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.userId;
        const db = getDb();

        const community = await db.collection(COMMUNITY_COLLECTION)
            .findOne({ _id: new ObjectId(communityId) });

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        if (community.members?.includes(userId)) {
            return res.status(400).json({ message: 'Already a member' });
        }

        await db.collection(COMMUNITY_COLLECTION)
            .updateOne(
                { _id: new ObjectId(communityId) },
                { $addToSet: { members: userId } }
            );

        res.json({ message: 'Joined community successfully' });
    } catch (error) {
        console.error('Error joining community:', error);
        res.status(500).json({ message: 'Failed to join community' });
    }
};

/**
 * Leave a community
 */
export const leaveCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.userId;
        const db = getDb();

        const community = await db.collection(COMMUNITY_COLLECTION)
            .findOne({ _id: new ObjectId(communityId) });

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        if (!community.members?.includes(userId)) {
            return res.status(400).json({ message: 'Not a member' });
        }

        await db.collection(COMMUNITY_COLLECTION)
            .updateOne(
                { _id: new ObjectId(communityId) },
                { 
                    $pull: { members: userId, admins: userId }
                }
            );

        res.json({ message: 'Left community successfully' });
    } catch (error) {
        console.error('Error leaving community:', error);
        res.status(500).json({ message: 'Failed to leave community' });
    }
};






