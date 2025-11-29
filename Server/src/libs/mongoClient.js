// src/libs/mongoClient.js
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.MONGO_DB || "PulseChat";

let client = null;
let db = null;

export async function connectMongo() {
  if (db) return db;

  try {
    console.log("[MONGO] Starting connection…");

    client = new MongoClient(MONGO_URI, {
      maxPoolSize: 20,
      writeConcern: { w: "majority" },
    });

    await client.connect();
    console.log("[MONGO] Connected to server");

    db = client.db(DB_NAME);

    await ensureIndexes(db);

    console.log(`[MONGO] Database ready (${DB_NAME})`);
    return db;
  } catch (err) {
    console.error("[MONGO INIT ERROR]");
    console.error(err);
    throw err;
  }
}

export function getDb() {
  if (!db) throw new Error("Mongo is not connected. Call connectMongo() first.");
  return db;
}

export async function closeMongo() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

async function ensureIndexes(db) {
  try {
    console.log("[MONGO] Ensuring indexes…");

    // messages: compound index for pagination by conversation (latest first)
    await db.collection("messages").createIndex({ conversationId: 1, seqNo: -1 });

    // messages: index on createdAt for admin queries / TTL-like sorting
    await db.collection("messages").createIndex({ createdAt: -1 });

    // presence TTL index — create only if server is running as a replica set
    try {
      // This will throw if not a replset
      await db.admin().command({ replSetGetStatus: 1 });
      // If we reach here, it's a replica set — create TTL index
      await db.collection("presence").createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
      console.log("[MONGO] TTL index created for 'presence.expireAt' (replica set detected)");
    } catch (e) {
      console.warn("[MONGO] Skipping TTL index (no replica set detected)");
    }

    // counters collection: do not try to create an _id index (Mongo creates it automatically).
    // If you need additional indexes for counters, create them here. For now, keep counters simple.
    // Example (commented): await db.collection('counters').createIndex({ someField: 1 }, { unique: true });

    console.log("[MONGO] Indexes ensured");
  } catch (err) {
    console.error("[MONGO INDEX ERROR]");
    console.error(err);
  }
}
