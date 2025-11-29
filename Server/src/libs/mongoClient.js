// src/libs/mongoClient.js

import { MongoClient } from 'mongodb';
import config from '../config/index.js'; // Use the config from step 1

const uri = config.MONGO_URI;
const dbName = config.MONGO_DB_NAME;

// Create a single instance of the client and database connection
let client;
let db;

/**
 * Establishes the connection to MongoDB.
 */
export async function connectMongo() {
  if (db) {
    console.log('MongoDB is already connected.');
    return db;
  }
  
  try {
    console.log('Attempting to connect to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log(`MongoDB Connected successfully to database: ${dbName}`);
    return db;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Re-throw the error to be caught by the startup function in server.js
    throw err; 
  }
}

/**
 * Closes the MongoDB connection gracefully.
 */
export async function closeMongo() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed.');
    client = null;
    db = null;
  }
}

/**
 * Retrieves the current database instance.
 * @returns {object} The MongoDB database instance.
 */
export function getDb() {
  if (!db) {
    throw new Error('Database not connected. Call connectMongo() first.');
  }
  return db;
}