// src/libs/firebaseAdmin.js
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let initialized = false;

export function initFirebaseAdmin() {
  if (initialized) return admin;

  try {
    // 1. Service Account File (Preferred)
    const svcPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (svcPath && fs.existsSync(path.resolve(svcPath))) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(path.resolve(svcPath), 'utf8')
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      initialized = true;
      return admin;
    }

    // 2. Environment-style service account
    const {
      FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY
    } = process.env;

    if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          // Safe replace: handles both single-line and escaped newline keys
          privateKey: FIREBASE_PRIVATE_KEY.split(String.raw`\n`).join("\n"),
        }),
      });

      initialized = true;
      return admin;
    }

    // 3. Default credentials (GCP / Cloud Run / etc)
    admin.initializeApp();
    initialized = true;
    return admin;

  } catch (err) {
    console.error("[FIREBASE ADMIN INIT FAILED]");
    console.error(err);
    throw err;
  }
}

// --- Verify ID token (v13-compatible)
export async function verifyIdToken(idToken, checkRevoked = false) {
  const adm = initFirebaseAdmin();
  return adm.auth().verifyIdToken(idToken, checkRevoked);
}
