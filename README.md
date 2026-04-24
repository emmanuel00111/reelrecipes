# 🎬 ReelRecipes

Extract structured recipes from cooking videos — YouTube, TikTok, Instagram Reels, or uploaded files. AI-powered extraction via Claude, stored in Supabase, with a clean React UI.

![ReelRecipes Screenshot](docs/screenshot.png)

## Features

- 🔗 **Paste any video URL** — YouTube, TikTok, Instagram Reels
- 📁 **Upload video files** — transcribed via OpenAI Whisper
- 🤖 **AI extraction** — Claude parses transcripts into structured recipes
- 🧾 **Full recipe cards** — ingredients, step-by-step method, timers, notes
- ⏱ **In-browser timers** — tap any step timer to start a countdown
- ✅ **Checkable ingredients & steps** — cook-mode friendly
- 🔍 **Search & filter** — by name, tag, or cuisine
- 🗃 **Persistent storage** — Supabase with per-user Row Level Security
- 📚 **Collections** — group recipes into named sets (schema ready)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | Supabase (Postgres + Auth + Storage) |
| AI — extraction | Anthropic Claude (claude-sonnet-4) |
| AI — transcription | OpenAI Whisper |
| YouTube transcripts | `youtube-transcript` |
| Monorepo | npm workspaces |

## Project Structure

```
reelrecipes/
├── frontend/              # React + Vite app
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # API client, helpers
│   │   ├── pages/         # Page-level components
│   │   └── main.jsx       # Entry point
│   └── package.json
├── backend/               # Express API
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── services/      # Transcript + extraction logic
│   │   └── index.js       # Server entry point
│   └── package.json
├── supabase/
│   └── schema.sql         # Full DB schema + RLS policies
├── .env.example
└── README.md
```

## Getting Started

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- An [Anthropic API key](https://console.anthropic.com)
- An [OpenAI API key](https://platform.openai.com) (for video uploads)

### 2. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/reelrecipes.git
cd reelrecipes
cp .env.example .env
# Fill in your keys in .env
npm run install:all
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste the contents of `supabase/schema.sql`
3. Run it — this creates the `recipes` and `collections` tables with RLS
4. Copy your **Project URL** and **service_role key** into `.env`

### 4. Run locally

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### 5. Environment variables

Copy `.env.example` to `.env` and fill in:

```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/extract` | Extract recipe from a video URL |
| POST | `/api/extract/upload` | Extract from an uploaded video file |
| GET | `/api/recipes?userId=` | List all recipes for a user |
| DELETE | `/api/recipes/:id` | Delete a recipe |

### Example request

```bash
curl -X POST http://localhost:3001/api/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=...", "userId": "user-uuid", "hint": ""}'
```

## Platform Support

| Platform | Transcript method | Notes |
|---|---|---|
| YouTube | `youtube-transcript` library | Requires video to have captions |
| TikTok | User-supplied hint / 3rd-party API | See `backend/src/services/transcript.js` |
| Instagram Reels | User-supplied hint / 3rd-party API | Same as TikTok |
| Uploaded video | OpenAI Whisper | Any common video format |

For TikTok and Instagram, the app currently uses the user-provided description hint + Claude inference. To add full transcript support, integrate a scraper API (e.g. RapidAPI) in `backend/src/services/transcript.js`.

## Deployment

### Frontend — Vercel

```bash
cd frontend
npx vercel --prod
```

Set `VITE_API_URL` to your backend URL in Vercel environment variables.

### Backend — Railway / Render

```bash
# Railway
railway init && railway up

# Render: connect your GitHub repo, set root dir to /backend
```

Set all `.env` variables in the platform dashboard.

## Contributing

Pull requests welcome. Please open an issue first for major changes.

## License

MIT
