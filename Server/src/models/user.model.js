// src/models/user.model.js

import { getDb } from '../libs/mongoClient.js';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'users';

export async function initUserModel() {
  const db = getDb();
  const usersCollection = db.collection(COLLECTION_NAME);

  // Drop existing unique index on username if it exists (to allow duplicates)
  try {
    await usersCollection.dropIndex('username_1');
    console.log('Dropped existing unique index on username');
  } catch (error) {
    // Index might not exist, which is fine
    if (error.code !== 27) { // 27 = IndexNotFound
      console.warn('Error dropping username index:', error.message);
    }
  }

  // Drop existing email index if it exists (to recreate with correct properties)
  try {
    await usersCollection.dropIndex('email_1');
    console.log('Dropped existing index on email');
  } catch (error) {
    // Index might not exist, which is fine
    if (error.code !== 27) { // 27 = IndexNotFound
      console.warn('Error dropping email index:', error.message);
    }
  }

  // Indexes for fast lookups
  await usersCollection.createIndex({ firebaseUid: 1 }, { unique: true });
  
  // Username index - NOT unique (allows duplicates)
  await usersCollection.createIndex({ username: 1 }, { sparse: true });
  
  // Email index - UNIQUE (one email per user)
  await usersCollection.createIndex({ email: 1 }, { unique: true, sparse: true });

  console.log('User Model Initialized.');
}

export async function findOrCreateUser(firebaseUid, userData) {
  const db = getDb();
  const usersCollection = db.collection(COLLECTION_NAME);
  
  const existingUser = await usersCollection.findOne({ firebaseUid });

  if (existingUser) {
    await usersCollection.updateOne(
        { _id: existingUser._id },
        { $set: { lastActive: new Date(), lastLogin: new Date() } }
    );
    return { ...existingUser, lastActive: new Date() };
  }

  const newUser = {
    firebaseUid,
    email: userData.email,
    username: userData.displayName || `user_${firebaseUid.substring(0, 8)}`,
    profilePicUrl: userData.photoURL || null,
    statusText: 'Hey there! I am using PulseChat.',
    createdAt: new Date(),
    lastActive: new Date(),
    lastLogin: new Date(),
    refreshToken: null, // Will be set by issueTokensAndSaveRefresh
    
    // Default Privacy Settings
    privacySettings: {
      lastSeen: 'everyone', // 'everyone', 'my_contacts', 'nobody'
      profilePhoto: 'everyone',
      status: 'everyone',
      readReceipts: true,
    },
    fcmTokens: [], 
  };

  try {
    const result = await usersCollection.insertOne(newUser);
    return { ...newUser, _id: result.insertedId };
  } catch (error) {
    // Handle duplicate email error (shouldn't happen with Firebase, but just in case)
    if (error.code === 11000 && error.keyPattern?.email) {
      // Email already exists, try to find the user by email
      const existingUserByEmail = await usersCollection.findOne({ email: userData.email });
      if (existingUserByEmail) {
        // Update last login and return existing user
        await usersCollection.updateOne(
          { _id: existingUserByEmail._id },
          { $set: { lastActive: new Date(), lastLogin: new Date() } }
        );
        return { ...existingUserByEmail, lastActive: new Date() };
      }
    }
    throw error;
  }
}

export { COLLECTION_NAME as USER_COLLECTION };