# Troubleshooting Guide

## "Failed to fetch" Error During Login/Signup

If you're getting "Failed to fetch" errors, follow these steps:

### 1. Check Backend Server is Running

```bash
cd Server
npm run dev
```

You should see:
```
✅ Server listening on http://localhost:4000
📡 API endpoints available at http://localhost:4000/api/v1
🔌 WebSocket available at ws://localhost:4000
💚 Health check: http://localhost:4000/health
```

### 2. Test Backend Connection

Open your browser and visit:
- `http://localhost:4000/health` - Should return health status
- `http://localhost:4000/api/v1/auth/login` - Should return an error (expected, but confirms route exists)

### 3. Check Frontend Configuration

Verify your `.env` file in `Client/` directory has:
```env
VITE_API_URL=http://localhost:4000/api/v1
VITE_WS_URL=ws://localhost:4000
```

Or check `Client/src/config/index.ts` - it defaults to:
- API: `http://localhost:4000/api/v1`
- WebSocket: `ws://localhost:4000`

### 4. Check Port Conflicts

- **Backend**: Should run on port `4000`
- **Frontend**: Should run on port `8080` (Vite default)

If port 4000 is in use, change it in `Server/.env`:
```env
PORT=4001
```

And update frontend config accordingly.

### 5. Check CORS Configuration

The backend CORS is configured to allow:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:8080`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:8080`

If your frontend runs on a different port, add it to `Server/src/server.js` CORS configuration.

### 6. Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: Look for detailed error messages
- **Network tab**: Check if requests are being made and what the response is

### 7. Common Issues

#### Issue: "Cannot connect to server"
**Solution**: Backend server is not running. Start it with `npm run dev` in the Server directory.

#### Issue: CORS error
**Solution**: 
1. Check frontend URL is in allowed origins
2. Verify CORS headers in `Server/src/server.js`

#### Issue: 401 Unauthorized
**Solution**: This is normal for login/register endpoints. The error should be handled by the frontend.

#### Issue: 500 Internal Server Error
**Solution**: Check backend console for error logs. Common causes:
- MongoDB not connected
- Firebase not initialized
- Missing environment variables

### 8. Environment Variables Checklist

**Server/.env** should have:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/PulseChat
FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-service-account.json
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
ENCRYPTION_KEY=your-encryption-key
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
```

**Client/.env** should have:
```env
VITE_API_URL=http://localhost:4000/api/v1
VITE_WS_URL=ws://localhost:4000
VITE_FIREBASE_API_KEY=your-firebase-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 9. Test Connection Programmatically

The frontend now includes a connection test utility. Check browser console for connection test results when login fails.

### 10. Still Not Working?

1. Check both server and client are running
2. Verify no firewall is blocking connections
3. Check MongoDB is running (if using local MongoDB)
4. Verify all environment variables are set
5. Check browser console for detailed error messages
6. Check backend console for request logs






