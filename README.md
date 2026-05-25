# AI News Daily Digest

A Next.js web app powered by [n8n](https://n8n.io) and [Claude](https://anthropic.com).

Fetches and summarizes the day's top AI news from 6 sources, with an interactive Claude-powered chat panel and gamification sidebar.

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in your values
2. Install dependencies: `npm install`
3. Run locally: `npm run dev`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `N8N_DIGEST_WEBHOOK_URL` | n8n webhook that returns the daily digest JSON |
| `N8N_SUBSCRIBE_WEBHOOK_URL` | n8n webhook that handles email subscriptions |
| `ANTHROPIC_API_KEY` | Anthropic API key for the chat panel |

## Deploy

Connect this repo to [Vercel](https://vercel.com) and set the environment variables in the Vercel dashboard.
