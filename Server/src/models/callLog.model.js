// src/models/callLog.model.js

import { getDb } from '../libs/mongoClient.js';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'call_logs';

export const CALL_TYPES = {
    VOICE: 'voice',
    VIDEO: 'video',
};

export const CALL_STATUS = {
    COMPLETED: 'completed',
    MISSED: 'missed',
    CANCELED: 'canceled',
};

/**
 * Defines the structure and indexes for the Call Log collection.
 */
export async function initCallLogModel() { // <-- ENSURE 'export' IS HERE
  const db = getDb();
  const callLogCollection = db.collection(COLLECTION_NAME);

  // Index on participants and start time for fetching a user's call history
  await callLogCollection.createIndex({ participants: 1, startTime: -1 }); 
  
  console.log('CallLog Model Initialized.');
}

/**
 * Example function to log a completed or failed call.
 */
export async function createCallLog(conversationId, initiatorId, participants, type, status, startTime, endTime = null) {
    const db = getDb();
    const collection = db.collection(COLLECTION_NAME);
    
    // Calculate duration in seconds
    const durationSeconds = endTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;

    const newLog = {
        conversationId: conversationId ? new ObjectId(conversationId) : null,
        initiatorId: new ObjectId(initiatorId),
        participants: participants.map(id => new ObjectId(id)),
        type: type,
        status: status,
        startTime: startTime,
        endTime: endTime,
        duration: durationSeconds,
    };

    const result = await collection.insertOne(newLog);
    return { ...newLog, _id: result.insertedId };
}

export { COLLECTION_NAME as CALLLOG_COLLECTION };