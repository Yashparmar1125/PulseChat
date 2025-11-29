
import { verifyIdToken } from '../libs/firebaseAdmin.js';

export default async function firebaseAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    const idToken = match[1];
    const decoded = await verifyIdToken(idToken);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || null,
      firebase: decoded,
    };
    return next();
  } catch (err) {
    console.error('firebaseAuth error:', err?.message || err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
