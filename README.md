# GHUMO.AI— Tourism Guide & Trip Planner

An end-to-end trip-planning platform that takes a source, destination, budget, and number of days, and returns a complete, budget-honest itinerary: transport cost estimates, budget-fit point-of-interest (POI) discovery, an optimised same-day visit order, feasible stopovers on multi-leg routes, review-informed alternatives, an AI-generated virtual tourism guide, and a live expense breakdown.

Built for Smart India Hackathon 2025 · Problem Statement: *Tourism Guide and Trip Planner*

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Why This Stack](#why-this-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Caching Strategy](#caching-strategy)
- [API Overview](#api-overview)
- [Feature Roadmap: MVP → Phase 3](#feature-roadmap-mvp--phase-3)
- [Open Questions / Known Gaps](#open-questions--known-gaps)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Planning a trip today means juggling four or five disconnected tools — a maps app, a review site, a couple of travel blogs, and a spreadsheet for tracking spend. YatraSaathi collapses that into a single, budget-first flow:

1. Enter a source, destination, budget, and number of days.
2. Get transport options with real, estimated costs.
3. Get a shortlist of nearby POIs that actually fit the budget and time available.
4. Get those POIs sequenced into a realistic, time-window-aware visiting order.
5. Get stopovers surfaced automatically on longer routes, with nearby stays.
6. Decide what to skip using real reviews, with instant alternatives on rejection.
7. Learn about a destination's culture and history through an AI-narrated guide.
8. Track actual spend against the original budget as the trip happens.

## Core Features

| ID | Feature | Description |
|----|---------|-------------|
| FR-01 | Trip Planning (A → B) | Specify a source and destination; the system determines feasible transport modes. |
| FR-02 | Personal Vehicle Cost Estimate | Estimated fuel, toll, and distance-based cost when a personal vehicle is selected. |
| FR-03 | Alternative Transport Recommendation | Train/bus/flight/cab alternatives matching trip duration when no personal vehicle is used. |
| FR-04 | Budget-Based Destination Planning | Total budget + number of days drive which destinations, POIs, and stays are shown. |
| FR-05 | Radius-Based POI Discovery | Nearby locations within a user-specified radius, each tagged with closing time. |
| FR-06 | Visit Order Recommendation | An ordered same-day visiting timeline that respects opening/closing times and travel time. |
| FR-07 | Stopover Recommendation | Feasible stopovers along a multi-leg route, with nearby places and budget-matched stays. |
| FR-08 | Reviews & Alternatives | Online reviews per place; instant alternative suggestion if a place is declined. |
| FR-09 | Virtual Tourism Guide | Blog and/or audio content on a destination's cultural and historical heritage. |
| FR-10 | Expense Breakdown | Categorised breakdown of spend, with an alert if projected spend exceeds budget. |

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + TypeScript (Next.js) |
| Backend | Python + FastAPI |
| Database | PostgreSQL + PostGIS |
| Cache | Redis |
| Sequencing algorithm | Google OR-Tools (TSP with time windows) |
| Maps / Places | Google Maps Platform (Places, Directions, Distance Matrix) |
| Virtual guide | LLM API (text) + TTS API (audio) |
| Auth | Firebase Auth or JWT via `fastapi-users` |
| Deployment | Docker + Docker Compose (Render/Railway for demo) |

## Why This Stack

This isn't a plain CRUD app — the hard parts are geospatial (radius search, route-corridor stopover detection), combinatorial (visit-order sequencing is a TSP-with-time-windows problem), and generative (the virtual guide). That combination points at Python/FastAPI + PostGIS + OR-Tools over the generic alternatives:

- **vs. MERN (MongoDB + Express + Node):** MongoDB's `2dsphere` index only supports point-radius queries, not the corridor/route-based stopover logic in FR-07. Node also has no equivalent to OR-Tools, so you'd end up calling out to a Python microservice anyway — two stacks instead of one.
- **vs. Java + Spring Boot:** Spring Boot + Hibernate Spatial can match PostGIS feature-for-feature, but the boilerplate (DTOs, repositories, config classes) costs hours a hackathon build window doesn't have. Stronger choice for a longer production build with a larger team.
- **vs. Firebase/Supabase-only (no custom backend):** Fine for POI listing and basic reads, but FR-06 (constrained sequencing) and FR-09 (generative content) need real compute that can't be expressed as a BaaS query — a custom service ends up being added anyway.

PostGIS's `ST_DWithin` covers FR-05 (radius search) and route-corridor queries cover FR-07 (stopovers) natively — this is the single biggest differentiator in the stack.

## System Architecture

```
Client Apps (Web / Mobile)
        │
        ▼
 API Gateway / Auth
        │
   ┌────┴─────────────────────────────────────────────┐
   ▼            ▼             ▼            ▼           ▼
Trip Planning  Budget &   Recommendation  Stopover &  Reviews
  Service    Cost Engine     Engine      Route Svc   Aggregator
   │            │             │            │           │
   └─────┬──────┴──────┬──────┴──────┬─────┴─────┬─────┘
         ▼             ▼             ▼           ▼
   Virtual Tourism   Expense      Data Layer   External APIs
   Guide Service    Tracking    (Postgres/PostGIS,  (Maps/Places,
                                  Redis cache)    Stays, Fares,
                                                    Reviews)
```

**Request flow:** input trip → budget/POI filter (PostGIS) → visit-order solve (OR-Tools) → stopover detection → review check → expense log.

### Component Notes

- **API Gateway / Auth** — single entry point for client apps; handles authentication and request routing.
- **Trip Planning Service** — orchestrates source/destination input, transport mode selection, and overall trip state.
- **Budget & Cost Engine** — computes personal-vehicle cost estimates and enforces budget constraints on downstream recommendations.
- **Recommendation Engine** — generates POI suggestions, visit ordering/timelines, and alternative-location suggestions.
- **Stopover & Route Service** — computes route legs and identifies candidate stopovers.
- **Reviews Aggregator** — fetches and aggregates review data.
- **Virtual Tourism Guide Service** — serves blog and audio content tied to destinations/POIs.
- **Expense Tracking & Breakdown** — records costs and produces the spend breakdown.
- **Data Layer** — persistent user/trip data, guide content store, recommendation cache.
- **External Integrations** — Maps/Places, hotel/stay booking, transport/fare data, reviews APIs.

## Project Structure

```
yatrasaathi/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entrypoint
│   │   ├── api/                   # Route handlers per FR grouping
│   │   │   ├── trips.py           # FR-01, FR-02, FR-03
│   │   │   ├── recommendations.py # FR-04, FR-05, FR-06
│   │   │   ├── stopovers.py       # FR-07
│   │   │   ├── reviews.py         # FR-08
│   │   │   ├── guide.py           # FR-09
│   │   │   └── expenses.py        # FR-10
│   │   ├── services/
│   │   │   ├── budget_engine.py
│   │   │   ├── sequencing.py      # OR-Tools TSP-with-time-windows
│   │   │   ├── geo.py             # PostGIS queries
│   │   │   └── guide_generator.py # LLM + TTS calls
│   │   ├── models/                # SQLAlchemy models
│   │   ├── db/                    # session, migrations (Alembic)
│   │   └── core/                  # config, auth, caching
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/ (or app/ for Next.js App Router)
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (frontend, if running outside Docker)
- Python 3.11+ (backend, if running outside Docker)
- A Google Maps Platform API key (Places, Directions, Distance Matrix)
- An LLM API key and TTS API key/credentials for the virtual guide

### Run with Docker Compose

```bash
git clone https://github.com/<your-org>/yatrasaathi.git
cd yatrasaathi
cp .env.example .env        # fill in API keys and secrets
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API docs (Swagger): `http://localhost:8000/docs`

### Run locally without Docker

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head          # apply DB migrations (requires PostGIS-enabled Postgres)
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (PostGIS extension enabled) |
| `REDIS_URL` | Redis connection string |
| `GOOGLE_MAPS_API_KEY` | Places / Directions / Distance Matrix |
| `LLM_API_KEY` | Virtual guide text generation |
| `TTS_API_KEY` | Virtual guide audio narration |
| `JWT_SECRET` / `FIREBASE_CONFIG` | Auth |
| `REVIEWS_API_KEY` | Reviews aggregation source |

See `.env.example` for the full list.

## Caching Strategy

Redis holds anything expensive to compute but stable moment-to-moment. Source-of-truth data (expense records, user accounts, confirmed bookings) always stays in Postgres.

| What | Cache key pattern | TTL |
|---|---|---|
| POI list for destination + radius + budget | `poi:{destination_id}:{radius}:{budget_bucket}` | 15–30 min |
| OR-Tools visit-order solution | `sequence:{poi_set_hash}:{date}` | 15–30 min |
| Distance Matrix / Directions results | `route:{origin}:{dest}` | a few hours |
| Places API details (ratings, hours, photos) | `place:{place_id}` | a few hours |
| Stopover candidates along a route | `stopovers:{route_hash}` | a few hours |
| Active trip's running budget/expense totals | `trip:{trip_id}:live_totals` | trip duration |
| Unconfirmed itinerary draft | `trip:{trip_id}:draft` | trip duration |

## API Overview

All endpoints are versioned under `/api/v1`. Full interactive documentation is available at `/docs` (Swagger UI) once the backend is running.

| Endpoint (indicative) | Method | Maps to |
|---|---|---|
| `/trips` | `POST` | FR-01 |
| `/trips/{id}/transport-cost` | `GET` | FR-02, FR-03 |
| `/trips/{id}/pois` | `GET` | FR-04, FR-05 |
| `/trips/{id}/visit-order` | `POST` | FR-06 |
| `/trips/{id}/stopovers` | `GET` | FR-07 |
| `/places/{id}/reviews` | `GET` | FR-08 |
| `/places/{id}/alternatives` | `GET` | FR-08 |
| `/guide/{destination_id}` | `GET` | FR-09 |
| `/trips/{id}/expenses` | `GET`/`POST` | FR-10 |

## Feature Roadmap: MVP → Phase 3

**MVP** — core loop: plan a route, set a budget, get a same-day itinerary, track spend.
- Trip planning (A → B) + personal vehicle cost estimate
- Budget & day-count based POI recommendations
- Visit-order / timeline generation (single day)
- Basic expense breakdown

**Phase 2** — route-level intelligence, depends on MVP's recommendation/budget logic.
- Alternative transport recommendations
- Stopover detection with nearby places
- Stay/hotel recommendation at stopovers (budget-based)
- Online reviews display + alternative-location suggestion on rejection

**Phase 3** — engagement and retention.
- Multi-day itinerary optimisation
- Virtual Tourism Guide (blogs + audio narration)
- Full trip cost analytics & insights
- Personalised (ML-based) recommendations

## Open Questions / Known Gaps

These need stakeholder input before detailed design/estimation on the relevant piece:

- **Data sources:** which maps/geolocation, hotel/stay inventory, and review provider(s) will be used, and at what licensing cost at scale?
- **Cost calculation:** what feeds the personal-vehicle estimate (fuel price source, vehicle type, tolls)? Single-currency only, or multi-currency for international trips?
- **Sequencing:** how should the system handle a POI that's already closed or about to close when the itinerary is generated?
- **Virtual guide:** who authors/curates content — in-house, licensed, or crowd-sourced? What languages/accessibility formats are required?
- **Edge cases:** what's the fallback when nothing fits the stated budget? How is data handled from a privacy/retention standpoint? Is offline/low-connectivity support required mid-trip?
- **Scope:** are group trips with a shared budget/itinerary in scope? Are in-app bookings/payments in scope, or does the app only recommend and hand off to third-party booking flows?

## Contributing

1. Fork the repo and create a feature branch: `git checkout -b feature/your-feature`
2. Follow the existing structure — new FR-aligned logic goes in `backend/app/services/`, new routes in `backend/app/api/`.
3. Add/update tests under `backend/tests/`.
4. Open a PR with a clear description of which FR(s) it addresses.

## License

Add your chosen license here (e.g. MIT) before publishing the repository.
