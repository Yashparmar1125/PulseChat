# PULSE Chat - Frontend

A production-ready chat application frontend built with React, TypeScript, and Vite.

## Project Structure

```
pulsechat-frontend/
├─ public/                 # Static assets
│  ├─ favicon.ico
│  ├─ manifest.json
│  ├─ robots.txt
│  └─ assets/             # Static images, icons, fonts
├─ src/
│  ├─ assets/             # Local images, SVGs, fonts imported as modules
│  ├─ components/          # Global, shared presentational components
│  │  ├─ ui/              # Buttons, inputs, modals, icons, Avatar, Badge
│  │  ├─ layout/          # Header, Footer, Sidebar, Responsive wrappers
│  │  ├─ primitives/      # Small re-usable primitives (Text, Box)
│  │  └─ landing/         # Landing page components
│  ├─ features/           # Feature modules (vertical slices)
│  │  ├─ auth/            # Authentication feature
│  │  ├─ conversations/   # Conversation management
│  │  ├─ messages/        # Message handling
│  │  ├─ presence/        # User presence
│  │  └─ uploads/         # File uploads
│  ├─ hooks/              # App-wide hooks
│  ├─ services/           # Side-effect services
│  │  ├─ websocket/       # WebSocket connection
│  │  ├─ notifications.service.ts
│  │  └─ api.client.ts    # API client wrapper
│  ├─ store/              # Global state management
│  ├─ utils/              # Pure helper functions
│  ├─ config/             # Environment config, feature flags
│  ├─ routes/             # Route definitions
│  ├─ pages/              # Page-level components
│  ├─ styles/             # Global CSS / Tailwind config
│  ├─ types/               # Global TypeScript types
│  ├─ i18n/               # Translations
│  ├─ App.tsx
│  └─ main.tsx            # Entry point
├─ .env.example
├─ package.json
├─ tsconfig.json
├─ tailwind.config.ts
└─ vite.config.ts
```

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- Framer Motion
- Radix UI

