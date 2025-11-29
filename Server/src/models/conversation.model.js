// src/models/conversation.model.js

import { getDb } from '../libs/mongoClient.js';

const COLLECTION_NAME = 'conversations';

export const CONVERSATION_TYPES = {
    PRIVATE: 'private',
    GROUP: 'group',
    COMMUNITY_CHANNEL: 'community_channel',
};

export async function initConversationModel() {
  const db = getDb();
  const conversationsCollection = db.collection(COLLECTION_NAME);

  // Index on participants for quick chat retrieval
  await conversationsCollection.createIndex({ participants: 1 });
  // Index for sorting by recent activity
  await conversationsCollection.createIndex({ updatedAt: -1 });

  console.log('Conversation Model Initialized.');
}

export { COLLECTION_NAME as CONVERSATION_COLLECTION };