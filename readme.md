# Conclave

Conclave is a modern full-stack web project featuring a [Next.js](https://nextjs.org/) client and a [Hono](https://hono.dev/) server, designed for rapid development and deployment.

---

## Project Structure

```
conclave/
├── client/   # Next.js 15 app (React 19, Tailwind CSS, Geist font)
└── server/   # Hono server (TypeScript, Bun)
```

---

## Client

- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS 4
- **Font:** [Geist](https://vercel.com/font) via `next/font`
- **Linting:** ESLint with Next.js config
- **Features:**
  - App directory structure
  - Optimized font loading
  - Ready for deployment on Vercel

### Development

```sh
cd client
bun install
bun run dev
# or use npm/yarn/pnpm as preferred
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Server

- **Framework:** [Hono](https://hono.dev/) (Express-style, fast, Bun-native)
- **Language:** TypeScript
- **Dev Server:** Hot reload via Bun

### Development

```sh
cd server
bun install
bun run dev
```

The server listens on [http://localhost:3000](http://localhost:3000) by default and responds with a simple "Hello Hono!" message at the root route.

---

## Getting Started

1. **Install dependencies** for both `client` and `server`:
   ```sh
   cd client && bun install
   cd ../server && bun install
   ```
2. **Run the server**:
   ```sh
   cd server
   bun run dev
   ```
3. **Run the client**:
   ```sh
   cd ../client
   bun run dev
   ```
4. Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Customization

- Edit `client/app/page.tsx` to change the main page.
- Edit `server/src/index.ts` to modify backend routes.

---

## Deployment

- **Client:** Deploy easily to [Vercel](https://vercel.com/) or any platform supporting Next.js.
- **Server:** Deploy with [Bun](https://bun.sh/) on your preferred infrastructure.

---

## License

MIT

---

## Credits

- [Next.js](https://nextjs.org/)
- [Hono](https://hono.dev/)
- [Bun](https://bun.sh/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Geist Font](https://vercel.com/font)
