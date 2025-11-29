// server/src/sockets/socketAuth.js
import { verifyIdToken } from '../libs/firebaseAdmin.js';

export default async function socketAuth(socket, next) {
  try {
    const token = socket.handshake?.auth?.token || socket.handshake?.query?.token;
    if (!token) {
      // Reject connection if no token provided
      return next(new Error('Authentication token required'));
    }

    const decoded = await verifyIdToken(token);
    // attach minimal user info
    socket.user = {
      uid: decoded.uid,
      email: decoded.email,
      firebase: decoded
    };

    // success
    return next();
  } catch (err) {
    // helpful debug logging (remove or reduce in production)
    console.error('socketAuth error:', err?.code ?? err?.message ?? err);
    return next(new Error('Authentication error'));
  }
}
