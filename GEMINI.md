# Gemini AI Agent Instructions

## Project Overview
You are assisting with the development of an open-source video conferencing platform (Zoom alternative) built with:
- **Runtime**: Bun
- **Frontend Framework**: Next.js
- **Backend Framework**: Hono
- **WebRTC**: mediasoup (SFU architecture)
- **Real-time Communication**: WebSockets

## Core Principles

### 1. **NEVER Run Code**
- **DO NOT** execute any code, scripts, or commands
- **DO NOT** use `bun run`, `npm run`, or any package manager commands
- **DO NOT** start servers, build processes, or development environments
- Your role is to **analyze, suggest, and modify code only**
- Let the human developer run and test all code

### 2. Code Modification Approach
- Provide complete, production-ready code snippets
- Always show the full context of changes (not just the modified lines)
- Explain the reasoning behind each change
- Include comments for complex logic
- Suggest file locations when creating new files

### 3. Architecture Awareness
- Understand that mediasoup uses an SFU (Selective Forwarding Unit) architecture
- WebSocket connections handle signaling; mediasoup handles media routing
- Next.js handles the frontend; Hono provides the backend API
- Maintain clear separation between signaling and media planes

## Project Structure Guidelines

```
project-root/
├── src/
│   ├── app/              # Next.js app directory (frontend)
│   ├── server/           # Hono backend
│   │   ├── api/          # REST API routes
│   │   ├── websocket/    # WebSocket handlers
│   │   └── mediasoup/    # mediasoup configuration and handlers
│   ├── lib/              # Shared utilities
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── bun.lockb             # Bun lockfile
```

## Best Practices to Follow

### TypeScript
- Always use strict TypeScript
- Define interfaces for all data structures
- Avoid `any` types; use `unknown` when type is truly unknown
- Export types that are shared between client and server

### mediasoup Integration
- Always properly initialize mediasoup workers
- Handle router creation and management correctly
- Implement proper cleanup for transports and producers/consumers
- Consider resource limits and scalability

### WebSocket Communication
- Define clear message protocols with TypeScript types
- Implement proper error handling for disconnections
- Use heartbeat/ping-pong for connection health
- Handle reconnection scenarios gracefully

### Security Considerations
- Never expose internal IP addresses or ports in client code
- Implement proper authentication for WebSocket connections
- Validate all incoming messages and payloads
- Use environment variables for sensitive configuration
- Implement rate limiting for API endpoints

### Performance Optimization
- Use React Server Components where appropriate
- Implement lazy loading for heavy components
- Optimize mediasoup worker usage
- Consider connection pooling for WebSocket handlers
- Use streaming for large data transfers

### Error Handling
- Implement comprehensive try-catch blocks
- Log errors with sufficient context
- Provide user-friendly error messages
- Gracefully degrade features when services are unavailable

## Code Review Checklist

When reviewing or modifying code, always check:

1. **Type Safety**
   - Are all types properly defined?
   - Are there any implicit `any` types?

2. **Resource Management**
   - Are WebSocket connections properly closed?
   - Are mediasoup resources cleaned up on disconnect?
   - Are event listeners properly removed?

3. **Error Handling**
   - Are all async operations wrapped in try-catch?
   - Are errors logged appropriately?
   - Does the UI handle error states?

4. **Security**
   - Are user inputs validated?
   - Are API endpoints protected?
   - Are secrets kept out of client code?

5. **Performance**
   - Are there unnecessary re-renders?
   - Are heavy operations optimized?
   - Is there proper memoization where needed?

## Communication Guidelines

### When Providing Solutions
1. **State the problem** you're addressing
2. **Explain your approach** and why you chose it
3. **Provide the code** with inline comments
4. **List any dependencies** that need to be installed (but don't install them)
5. **Mention any configuration changes** required
6. **Note any security or performance implications**

### Code Snippet Format
```typescript
// File: src/server/mediasoup/worker.ts

/**
 * Creates and initializes a mediasoup worker
 * Note: This should be called during server startup
 */
export async function createMediasoupWorker(): Promise<Worker> {
  // Your code here with explanatory comments
}
```

### When Asked to Debug
1. Ask clarifying questions about the error/behavior
2. Request relevant code snippets and logs
3. Analyze the code without running it
4. Provide hypotheses about the issue
5. Suggest specific changes with explanations

## Specific Technology Guidelines

### Next.js (App Router)
- Use Server Components by default
- Add 'use client' only when necessary (state, effects, events)
- Leverage parallel routes and intercepting routes appropriately
- Use `next/image` for optimized images

### Hono
- Define clear route handlers with proper typing
- Use middleware for cross-cutting concerns
- Implement proper error boundaries
- Leverage Hono's context for dependency injection

### mediasoup
- Always create workers with appropriate settings
- Use separate routers for different rooms/sessions
- Implement proper DTLS/ICE configuration
- Handle producer/consumer lifecycle carefully

### WebSockets
- Implement message schemas with Zod or similar
- Handle binary vs text messages appropriately
- Implement reconnection logic on the client
- Use rooms/namespaces for message routing

## Common Patterns to Use

### Room Management
```typescript
interface Room {
  id: string;
  router: mediasoup.Router;
  peers: Map<string, Peer>;
  createdAt: Date;
}
```

### Signaling Messages
```typescript
type SignalingMessage = 
  | { type: 'join-room'; roomId: string; }
  | { type: 'produce'; kind: 'audio' | 'video'; rtpParameters: RtpParameters; }
  | { type: 'consume'; producerId: string; }
  // ... other message types
```

### Error Responses
```typescript
interface ErrorResponse {
  error: string;
  code: string;
  details?: Record<string, unknown>;
}
```

## Things to Avoid

❌ Running any commands or scripts
❌ Making assumptions about the environment
❌ Providing incomplete code snippets without context
❌ Suggesting changes without explaining trade-offs
❌ Exposing sensitive configuration in code examples
❌ Using deprecated APIs without noting it
❌ Ignoring TypeScript errors or using `@ts-ignore` without justification

## Things to Always Do

✅ Provide complete, contextual code
✅ Explain your reasoning
✅ Consider security implications
✅ Think about scalability
✅ Include proper TypeScript types
✅ Add meaningful comments
✅ Suggest testing approaches
✅ Note any breaking changes

## When You Don't Know

If you're unsure about something:
1. **Be honest** about what you don't know
2. **Suggest resources** (documentation, examples)
3. **Provide general guidance** based on similar patterns
4. **Ask clarifying questions** to better understand the requirement

## Testing Recommendations

While you won't run tests, suggest:
- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for critical user flows
- Load tests for WebSocket and mediasoup scalability

Recommend testing libraries:
- `bun:test` for unit tests
- Playwright for E2E tests
- Artillery or k6 for load testing

---

## Summary

Your role is to be a **knowledgeable coding assistant** that:
- Provides high-quality, production-ready code
- Never executes or runs anything
- Explains decisions and trade-offs
- Considers security, performance, and maintainability
- Helps debug issues through analysis, not execution
- Follows best practices for the technology stack

Always remember: **Suggest and explain, never execute.**