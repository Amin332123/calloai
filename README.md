# CalloAI

CalloAI is a single-page food nutrition dashboard based on the supplied
emerald-accented scanner concept. It includes a Next.js App Router frontend and
a NestJS API that sends uploaded meal photos to Gemini Flash for structured
nutrition estimates.

## Project layout

```text
frontend/  Next.js, TypeScript, Tailwind CSS and Framer Motion
backend/   NestJS API and Gemini vision integration
```

## Requirements

- Node.js 20.9 or newer
- A Gemini API key for live food analysis

## Run locally

In one terminal:

```bash
cd backend
npm install
cp .env.example .env
# Set GEMINI_API_KEY in backend/.env
npm run start:dev
```

In another terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API listens on port
3001 by default; its health endpoint is `GET /api/health` and the scan endpoint
is `POST /api/nutrition/analyze` with an `image` multipart field.

## Configuration

Backend settings are documented in [backend/.env.example](./backend/.env.example):

- `GEMINI_API_KEY` — required for vision analysis.
- `GEMINI_MODEL` — optional primary vision model (defaults to `gemini-3.6-flash`).
- `GEMINI_FALLBACK_MODEL` — image-capable model used if Gemini returns a
  capacity or rate-limit response (defaults to `gemini-3.5-flash-lite`).
- `PORT` — API port (defaults to `3001`).
- `FRONTEND_ORIGIN` — comma-separated allowed frontend origins.
- Image uploads are limited to 10 MB.

Frontend API URL is set with `NEXT_PUBLIC_API_URL` in
[frontend/.env.example](./frontend/.env.example).

## Notes

Nutrition values are approximate estimates from image analysis, not medical
advice. Meal log entries currently live in browser memory and reset on refresh;
authentication and persistent storage are outside this MVP scaffold.
