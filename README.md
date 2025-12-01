# 🎓 PulseChat – Real‑Time Communication Platform

<div align="center">

<!-- Inline SVG logo based on `Client/src/components/layout/Logo.tsx` -->
<svg width="120" height="120" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M12 9C8.13401 9 5 12.134 5 16V29C5 32.866 8.13401 36 12 36H16.5L20 41L18 36H36C39.866 36 43 32.866 43 29V16C43 12.134 39.866 9 36 9H12Z"
    stroke="#00DDFF"
    stroke-width="2.5"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M16.5 36L20 41L18 36H16.5Z"
    fill="#00DDFF"
    stroke="#00DDFF"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M13 24 H 15 L 16.5 18 L 19 30 L 21.5 20 L 24 28 L 26.5 24 H 30 L 32 20 L 34 28 L 36 24"
    stroke="#00DDFF"
    stroke-width="2.5"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![MinIO](https://img.shields.io/badge/MinIO-FF4F00?style=for-the-badge&logo=minio&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

> 🌟 Stay connected with real‑time chat, calls, communities, and rich media – all powered by modern web tech.

## 📚 Overview

PulseChat is a modern, full‑stack communication platform that provides real‑time messaging, calls, communities, and ephemeral status updates. It combines a rich, animated React + TypeScript frontend with a secure Node.js/Express backend, Firebase authentication, Socket.IO real‑time events, and MongoDB/MinIO for persistent conversations and media.

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 💬 Real‑Time Chat & Media
- 🔁 Live one‑to‑one and group messaging  
- 📎 Rich attachments (images, files, etc.)  
- ✅ Read receipts and message status  
- ✍️ Typing indicators  
- 📌 Pin and 📥 archive conversations  

### 🧑‍🤝‍🧑 Communities
- 🏘️ Community spaces with member lists  
- 🧵 Channels / conversation groups  
- ➕ Join / ➖ leave flows  
- 👀 Community detail views  

</td>
<td width="50%">

### 📶 Presence & Status
- 🟢 Online / offline presence  
- 🕒 Last seen and presence indicators  
- 📸 Ephemeral status updates (text + media)  
- 👁️ Status view tracking  

### 📞 Calls & Activity
- 📱 Voice/video call logs (metadata, duration)  
- 📊 Activity and notification handling  
- 🧾 Detailed call history per conversation  

</td>
</tr>
</table>

## 🛠️ Tech Stack

<details>
<summary><b>🔷 Frontend Technologies</b></summary>

- ⚛️ **React 18 + TypeScript** – SPA UI and component logic  
- ⚡ **Vite 7** – Dev server, bundler, and HMR  
- 🎨 **Tailwind CSS 3** – Utility‑first styling and design system  
- 🧱 **Custom UI + Radix‑style components** – Buttons, inputs, dialogs, sheets, menus, etc. under `src/components/ui`  
- 🛣️ **React Router 6** – Client‑side routing for pages under `src/pages`  
- 🎭 **Framer Motion** – Micro‑interactions and animated sections (landing, transitions)  
- 🔥 **Firebase Client SDK** – Authentication and token retrieval on the client  
- 📡 **Socket.IO Client** – Real‑time connection to the Node backend  
- 🌐 **Fetch‑based API client** – Typed wrappers in `services/api.client.ts` with token + refresh logic  

</details>

<details>
<summary><b>🔷 Backend Technologies</b></summary>

- 🟢 **Node.js** – Runtime environment  
- 🚂 **Express.js** – HTTP server, middleware, routing under `/api/v1`  
- 🍃 **MongoDB** – Primary datastore (users, conversations, messages, status, communities, call logs, media)  
- 📦 **MinIO** – S3‑compatible object storage for uploaded media/files  
- 🔥 **Firebase Admin SDK** – Verifies Firebase tokens from clients  
- 📡 **Socket.IO** – Real‑time events for messages, presence, typing, etc.  
- 🧰 **Nodemon** – Development reloading for the server  
- 🧪 **Jest/Vitest‑style tests (unit folder)** – Unit tests for server logic (where implemented)  

</details>

<details>
<summary><b>🧩 Shared & Tooling</b></summary>

- 🧾 **TypeScript** – Static typing across the client and parts of the tooling  
- 🧹 **Prettier / formatting scripts** – Code formatting via package scripts  
- 🧱 **Feature‑based architecture** – Vertical slices for `auth`, `conversations`, `messages`, `status`, `communities`, `calls`, `uploads`, etc.  
- 🧪 **Vitest** – Test runner configured in the client for component and hook tests  
- 🧩 **ES Modules** – Native ESM on the server (`"type": "module"`)  

</details>

## 📁 Project Structure

```ascii
PulseChat/
├── 📱 Client/                     # Frontend (React + TS + Vite)
│   ├── src/
│   │   ├── 🧩 components/         # Layout, chat UI, landing, primitives, ui
│   │   ├── 🧬 features/           # auth, conversations, messages, status, calls, communities, uploads
│   │   ├── 🧠 hooks/              # Reusable hooks
│   │   ├── 🛰️ services/           # api client, websocket, notifications
│   │   ├── 🧳 store/              # Global state
│   │   ├── 🧾 types/              # Shared TS types
│   │   ├── ⚙️ config/             # Env config (apiUrl, wsUrl, Firebase)
│   │   ├── 🧭 routes/             # Router configuration
│   │   ├── 📄 pages/              # Page components (Home, Chat, Settings, etc.)
│   │   ├── 🎨 styles/             # Global CSS / Tailwind
│   │   ├── 🛠️ utils/              # Helpers & utilities
│   │   ├── ⚛️ App.tsx
│   │   └── 🚀 main.tsx
│   ├── 🌐 public/
│   └── 📦 package.json
│
├── ⚙️ Server/                     # Backend (Node + Express + Socket.IO)
│   ├── src/
│   │   ├── 🧠 controllers/        # Route handlers (auth, messages, status, users, etc.)
│   │   ├── 🛣️ routes/             # `/api/v1/*` endpoints
│   │   ├── 📊 models/             # MongoDB models
│   │   ├── 🛡️ middlewares/        # Auth, Firebase verification
│   │   ├── 🔗 libs/               # Mongo, MinIO, Firebase setup
│   │   ├── 📡 sockets/            # Socket.IO setup & events
│   │   ├── 🧰 services/           # Business logic, presence
│   │   ├── ⚙️ config/             # Configuration
│   │   ├── 🔧 utils/              # Encryption, tokens, response formatting
│   │   ├── 🧵 workers/            # Background jobs
│   │   └── 🚀 server.js           # Server entrypoint
│   └── 📦 package.json
└── 📝 README.md
```

## 🏗️ Architecture & Flows

### 🌐 System Overview

At a high level, PulseChat is composed of:

- **Client (SPA)** – React + TypeScript app served by Vite, talking to REST APIs and Socket.IO.  
- **API Server** – Node.js + Express app exposing `/api/v1/*` endpoints and a `/health` check.  
- **Real‑Time Layer** – Socket.IO server running on the same HTTP server as Express.  
- **Data & Storage** – MongoDB for structured data and MinIO for file/media storage.  
- **Auth Layer** – Firebase Authentication (client) + Firebase Admin (server) for token verification.  

```ascii
[ React SPA ]  <--HTTP/WS-->  [ Express + Socket.IO ]  <--->  [ MongoDB ]
      |                                   |                    [ MinIO  ]
      |                                   |
      '---------- Firebase Auth ----------'
```

### 🧩 Frontend Architecture (Client)

- **Feature‑first structure** under `src/features`:
  - `auth` – Sign‑in, sign‑up, verifying email, session handling, hooks like `useAuth`.
  - `conversations` – Conversation list, search, creation, pin/archive operations.
  - `messages` – Message list, input, attachment picker, typing indicator, message API/hook.
  - `status` – Story‑like user status creation, listing, and view tracking.
  - `communities` – Community discovery, join/leave, channels and detail views.
  - `calls` – Call logs with metadata and status transitions.
  - `uploads` – File upload service and drag‑and‑drop components.
- **UI & layout**:
  - `components/ui` – Reusable primitives (buttons, inputs, dialogs, sheets, dropdowns, etc.).
  - `components/chat` – Sidebar, chat list panel, sections (calls, status, communities, archived, starred).
  - `components/layout` – `Logo`, header, footer, and top‑level layout wrappers.
- **State & services**:
  - `services/api.client.ts` – Fetch wrapper with `Authorization` header, error handling, and token refresh.
  - `services/websocket` – Socket.IO client, connection lifecycle helpers, reconnection strategy.
  - `store` – Centralized slices such as presence, notifications, etc.
  - `contexts/ThemeContext.tsx` – Theming, dark/light mode, and persisted preferences.

### ⚙️ Backend Architecture (Server)

- **Routing layer** (`src/routes`):
  - `auth.routes.js` – Login/register, social auth, token refresh, current user, logout, tutorial completion.
  - `conversation.routes.js` – Conversation listing, detail, create, pin, archive, delete.
  - `message.routes.js` – Conversation messages, send, edit, delete, mark as read.
  - `user.routes.js` – Search users, get user profile, update own profile.
  - `media.routes.js` – Upload file, get metadata, serve file, delete file.
  - `status.routes.js` – Status list, create, view status, delete.
  - `community.routes.js` – List communities, get one, create, join, leave.
  - `call.routes.js` – Get call logs, initiate a call, update call status.
  - `health.routes.js` – Health diagnostics and readiness checks.
- **Controllers** (`src/controllers`):
  - Encapsulate HTTP logic: validate inputs, call services/models, and build JSON responses.
  - Some controllers (e.g., messages and conversations) also interact with Socket.IO to emit real‑time events on writes.
- **Real‑time** (`src/sockets`):
  - `socketAuth.js` – Validates incoming Socket.IO connections against Firebase tokens.
  - `socketHandler.js` – Registers connection handlers, joins users to rooms (e.g., conversation rooms), and wires individual event modules.
- **Data layer** (`src/models`, `src/libs/mongoClient.js`):
  - Models for `user`, `conversation`, `message`, `status`, `community`, `callLog`, `media`, etc.
  - Reusable Mongo connection and initialization logic.
- **Storage & media** (`src/libs/minioClient.js` + `media.controller.js`):
  - Handles file uploads to MinIO and maps object keys to URLs returned to the frontend.
- **Security/helpers**:
  - `auth.middleware.js` – Protects most `/api/v1` routes.
  - `firebaseAuth.middleware.js` – Where deeper Firebase token introspection is needed.
  - `utils/encryption.utils.js`, `utils/token.utils.js` – Token creation/verification and encryption helpers.

### 🔐 Authentication Flow (High Level)

1. **User signs in** with Firebase on the client (email/password or provider).  
2. Client obtains Firebase ID token and/or backend access token (depending on your exact setup).  
3. For **REST APIs**:
   - Client calls `/api/v1/auth/login` or social auth, receives access/refresh tokens.
   - Subsequent requests include `Authorization: Bearer <accessToken>`; `auth.middleware.js` validates the token and sets `req.user`.  
4. For **WebSockets**:
   - Client Socket.IO connects to `ws://localhost:4000` with `auth: { token: <firebaseIdToken> }`.
   - `socketAuth.js` verifies the token via Firebase Admin and attaches the user to the socket.

### ⚡ Real‑Time Messaging Flow

**Sending a message**

1. Client calls `POST /api/v1/messages/conversation/:conversationId` with the message payload.  
2. `message.controller.js` validates the request, saves the message to MongoDB, and links any media.  
3. The controller emits a Socket.IO event (for example `message:new`) to all sockets joined to that conversation room.  
4. Connected clients listen for that event, append the new message locally, update unread counts and conversation previews.  

**Marking as read & presence**

1. Client calls `POST /api/v1/messages/conversation/:conversationId/read`.  
2. Backend updates the read state for that user and may emit an event like `conversation:read` to other participants.  
3. Presence service updates `online/offline` state and broadcasts presence updates over Socket.IO (e.g., `presence:update`).  


## 🚀 Getting Started

### ⚙️ Prerequisites

- 💻 Node.js (v18 or higher)  
- 🍃 MongoDB instance  
- 📦 MinIO (or S3‑compatible storage)  
- 🔥 Firebase project & service account  

### 🎨 Frontend Setup (`Client/`)

```bash
# Navigate to client
cd Client

# Install dependencies
pnpm install   # or npm install

# Configure environment
cp .env.example .env   # if available
# VITE_API_URL=http://localhost:4000/api/v1
# VITE_WS_URL=ws://localhost:4000
# VITE_FIREBASE_* = your Firebase config

# Start development server
pnpm dev       # or npm run dev
```

### ⚙️ Backend Setup (`Server/`)

```bash
# Navigate to server
cd Server

# Install dependencies
npm install

# Configure environment
cp .env.example .env   # if available, or create .env
# PORT=4000
# MONGODB_URI=your_mongodb_uri
# MINIO_* and FIREBASE_* settings

# Start server
npm run dev
```

## 🔑 Environment Variables

<details>
<summary><b>🎨 Frontend (.env)</b></summary>

```env
VITE_API_URL=http://localhost:4000/api/v1
VITE_WS_URL=ws://localhost:4000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

</details>

<details>
<summary><b>⚙️ Backend (.env)</b></summary>

```env
PORT=4000
MONGODB_URI=your_mongodb_uri
MINIO_ENDPOINT=your_minio_endpoint
MINIO_PORT=9000
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
MINIO_BUCKET=your_bucket
FIREBASE_SERVICE_ACCOUNT=./secrets/serviceAccount.json.json
```

</details>

## 📝 API Routes (High‑Level)

| Route prefix              | Description                                              |
|---------------------------|----------------------------------------------------------|
| 🔐 `/api/v1/auth`         | Authentication & token refresh                           |
| 💬 `/api/v1/messages`     | Message CRUD, read receipts                              |
| 💭 `/api/v1/conversations`| Conversation management (create, pin, archive, delete)   |
| 👤 `/api/v1/users`        | User search & profile management                         |
| 📸 `/api/v1/media`        | File upload, metadata, and deletion                      |
| 📡 `/api/v1/status`       | Status creation, view, and deletion                      |
| 🏘️ `/api/v1/communities` | Community listing, detail, join/leave                   |
| 📞 `/api/v1/calls`        | Call logs & status updates                               |
| ❤️ `/health`              | Health checks for monitoring                             |

## 🤝 Contributing

1. 🍴 Fork the repository  
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)  
3. 💾 Commit your changes (`git commit -m "Add some AmazingFeature"`)  
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)  
5. 🔄 Open a Pull Request  

## 📄 License

This project is licensed under the MIT License (or your chosen license). See the `LICENSE` file if present, or update this section accordingly.

## 👨‍💻 Authors

**Yash Parmar**  
- 🌐 [GitHub](https://github.com/Yashparmar1125)  
- 💼 [LinkedIn](https://linkedin.com/in/yashparmar1125)  
- 📧 [Email](mailto:yashparmar11y@gmail.com)

> Add more authors here if this is a team project, following the same pattern.

## 🙏 Acknowledgments

- 🌟 All contributors who help improve PulseChat  
- 💡 Open‑source community for libraries and tools  
- 🎨 Design inspiration and UI resources  

---

<div align="center">
  
### 🌟 Star this repo if you find it helpful! 🌟

</div>


