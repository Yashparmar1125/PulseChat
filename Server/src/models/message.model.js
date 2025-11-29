// src/models/message.model.js

import { getDb } from '../libs/mongoClient.js';

const COLLECTION_NAME = 'messages';

export const MESSAGE_TYPES = {
    TEXT: 'text',
    IMAGE: 'image',
    DOCUMENT: 'document',
    VOICE: 'voice',
    CALL_LOG: 'call_log', // Link to a CallLog document
    SYSTEM: 'system',
};

export async function initMessageModel() {
  const db = getDb();
  const messagesCollection = db.collection(COLLECTION_NAME);

  // Drop old index if it exists (timestamp doesn't exist, we use createdAt)
  try {
    await messagesCollection.dropIndex('conversationId_1_timestamp_-1');
  } catch (err) {
    // Index might not exist, which is fine
  }

  // Index for fetching messages of a specific conversation, sorted by time
  await messagesCollection.createIndex({ conversationId: 1, createdAt: -1 }); 
  
  // Index for finding starred messages by a user
  await messagesCollection.createIndex({ 'starredBy.userId': 1 }, { sparse: true }); 

  // Index on senderId for quick lookups
  await messagesCollection.createIndex({ senderId: 1 });

  console.log('Message Model Initialized.');
}

export { COLLECTION_NAME as MESSAGE_COLLECTION };