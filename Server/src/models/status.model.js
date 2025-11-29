// src/models/status.model.js

import { getDb } from '../libs/mongoClient.js';

const COLLECTION_NAME = 'statuses';

export async function initStatusModel() {
  const db = getDb();
  const statusCollection = db.collection(COLLECTION_NAME);

  // TTL Index: Statuses expire when expiresAt time is reached.
  await statusCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); 

  // Index on userId and creation time
  await statusCollection.createIndex({ userId: 1, createdAt: -1 });
  
  console.log('Status Model Initialized.');
}

export { COLLECTION_NAME as STATUS_COLLECTION };