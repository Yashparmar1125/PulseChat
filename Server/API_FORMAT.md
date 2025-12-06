# API Response Format Standards

This document defines the standard request/response formats for all PulseChat API endpoints to ensure consistency between frontend and backend.

## Message Format

### GET `/api/v1/messages/conversation/:conversationId`

**Response:**
```json
{
  "messages": [
    {
      "id": "string (ObjectId)",
      "conversationId": "string (ObjectId)",
      "senderId": "string (ObjectId)",
      "senderName": "string (username or email)",
      "senderAvatar": "string | null",
      "text": "string",
      "type": "text" | "image" | "file" | "audio" | "video" | "system",
      "timestamp": "ISO 8601 string",
      "editedAt": "ISO 8601 string | null",
      "readBy": ["string (ObjectId)"],
      "attachments": [],
      "status": "sent"
    }
  ]
}
```

### POST `/api/v1/messages/conversation/:conversationId`

**Request:**
```json
{
  "text": "string",
  "type": "text",
  "replyToId": "string (optional)",
  "attachments": []
}
```

**Response:**
```json
{
  "message": {
    "id": "string",
    "conversationId": "string",
    "senderId": "string",
    "senderName": "string",
    "senderAvatar": "string | null",
    "text": "string",
    "type": "text",
    "timestamp": "ISO 8601 string",
    "readBy": ["string"],
    "attachments": [],
    "status": "sent"
  }
}
```

## Conversation Format

### GET `/api/v1/conversations`

**Response:**
```json
{
  "conversations": [
    {
      "id": "string (ObjectId)",
      "name": "string",
      "avatar": "string | null",
      "lastMessage": {
        "id": "string",
        "text": "string",
        "senderId": "string",
        "senderName": "string",
        "timestamp": "ISO 8601 string",
        "type": "text"
      } | null,
      "unreadCount": 0,
      "isPinned": false,
      "isArchived": false,
      "isGroup": false,
      "participants": [
        {
          "id": "string",
          "name": "string (username)",
          "avatar": "string | null",
          "email": "string",
          "isOnline": false
        }
      ],
      "updatedAt": "ISO 8601 string",
      "createdAt": "ISO 8601 string"
    }
  ]
}
```

## WebSocket Message Format

### Event: `message`

**Payload:**
```json
{
  "id": "string",
  "conversationId": "string",
  "senderId": "string",
  "senderName": "string",
  "senderAvatar": "string | null",
  "body": "string",
  "text": "string (same as body)",
  "type": "text",
  "createdAt": "ISO 8601 string",
  "timestamp": "ISO 8601 string (same as createdAt)",
  "readBy": [],
  "attachments": []
}
```

## Key Standards

1. **IDs**: All IDs are strings (ObjectId.toString())
2. **Timestamps**: ISO 8601 format strings
3. **Sender Names**: Always use `username` if available, fallback to `email`, never "Unknown" if user exists
4. **Status**: Messages use "sent", "delivered", "read" status (determined by client based on readBy)
5. **Null vs Undefined**: Use `null` for optional fields, not `undefined`







