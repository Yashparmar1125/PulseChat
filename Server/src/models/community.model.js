// src/models/community.model.js

import { getDb } from '../libs/mongoClient.js';

const COLLECTION_NAME = 'communities';

export async function initCommunityModel() {
  const db = getDb();
  const communityCollection = db.collection(COLLECTION_NAME);

  // Index on name for unique identification
  await communityCollection.createIndex({ name: 1 }, { unique: true }); 
  
  // Index on members for fast querying by user membership
  await communityCollection.createIndex({ members: 1 });

  console.log('Community Model Initialized.');
}

export { COLLECTION_NAME as COMMUNITY_COLLECTION };