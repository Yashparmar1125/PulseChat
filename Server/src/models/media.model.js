// src/models/media.model.js

import { getDb } from '../libs/mongoClient.js';

const COLLECTION_NAME = 'media';

export async function initMediaModel() {
  const db = getDb();
  const mediaCollection = db.collection(COLLECTION_NAME);

  // Index on the unique MinIO object key
  await mediaCollection.createIndex({ objectKey: 1 }, { unique: true });
  await mediaCollection.createIndex({ uploadedAt: -1 }); 

  console.log('Media Model Initialized.');
}

export { COLLECTION_NAME as MEDIA_COLLECTION };