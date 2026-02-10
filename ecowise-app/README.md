# EcoWise - AI-Powered Eco-Smart Travel Planner

EcoWise helps travelers plan sustainable trips with AI-assisted recommendations, carbon impact insights, and eco-friendly alternatives. The demo showcases an NLP prompt flow, model reasoning panels, and synthetic itinerary generation for a hackathon-ready experience.

## Features
- NLP trip brief: enter a prompt and generate ranked eco-friendly itineraries.
- Carbon impact insights: per-trip CO2 estimates and reduction cues.
- Sustainable options: rail-first routes, verified green stays, local-first activities.
- Demo-ready backend: mock API routes for auth and trip generation.
- Light/Dark themes with consistent styling.

## Demo Credentials
- User: `demo`
- Password: `1234`
- Or use "Skip login (demo)" on the login page.

## Quick Start (Frontend + Mock API)
From the `ecowise-app/client` folder:

```bash
npm install
npm run dev
```

Open http://localhost:3000

The mock backend is built into Next.js route handlers:
- `/api/auth/me` returns a demo user.
- `/api/plan` accepts the prompt and returns synthetic plans.
- `/api/trips` provides demo saved trips.

## Optional: Real Backend
If you want to use the Node/Express backend, run it separately and set:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Tech Stack
- Next.js (React)
- Node.js / Express (optional backend)
- MongoDB (optional backend)
- NLP + recommendation logic (demo stubs)
- Carbon estimation stubs

## Screens
- `/` Home
- `/trips` Demo library
- `/dashboard/trips` Planner + NLP prompt
- `/dashboard/saved-trips` Saved trips

## Notes for Judges
The demo uses synthetic data to show the end-to-end AI flow. The prompt debugger highlights missing fields, and the UI shows reasoning, scoring, and impact metrics.
