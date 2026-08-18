# GhumoAI — Backend Implementation Plan
*For the Backend Team (this device) · FastAPI + Supabase + Redis + Gemini*

---

## Confirmed Decisions

| Decision | Choice |
|---|---|
| Maps / Geocoding | **OpenStreetMap (Nominatim + OSRM)** — free, no key; code structured to swap in Google Maps API later |
| LLM (Virtual Guide) | **Google Gemini API** (`google-generativeai` SDK) |
| Auth | **Supabase Auth** (built-in JWT — no separate Firebase setup needed) |
| Database | **Supabase** managed PostgreSQL 15 + PostGIS (free tier) |
| Cache | **Upstash Redis** — managed, free tier, zero infra setup |
| Sequencing | **Google OR-Tools** (`ortools` PyPI package) |

> [!TIP]
> Supabase gives you PostgreSQL + PostGIS + Auth + Storage in one free-tier service. This eliminates the need for a separate Firebase project and a self-hosted Redis (using Upstash for Redis instead).

---

## How to Get Your API Keys (as you reach each phase)

### 1. Supabase (DB + Auth) — needed from Phase 0
1. Go to [supabase.com](https://supabase.com) → **Start your project** → sign in with GitHub
2. Create a new project → choose a region close to India (e.g., `ap-south-1`)
3. Note down from **Settings → API**:
   - `SUPABASE_URL` (e.g., `https://xxxx.supabase.co`)
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Enable PostGIS: go to **SQL Editor** → run `CREATE EXTENSION IF NOT EXISTS postgis;`

### 2. Upstash Redis — needed from Phase 0
1. Go to [upstash.com](https://upstash.com) → create a free Redis database
2. Select region: `ap-southeast-1` (Singapore, lowest latency for India)
3. Note down: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### 3. Gemini API — needed from Phase 3
1. Go to [aistudio.google.com](https://aistudio.google.com) → **Get API Key**
2. Create a new key in a Google Cloud project
3. Note down: `GEMINI_API_KEY`

### 4. Google Maps Platform — for later (after prototype)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Enable: **Places API**, **Directions API**, **Distance Matrix API**
3. Create credentials → API key
4. Note down: `GOOGLE_MAPS_API_KEY`
5. In the codebase, swap the `geo.py` service from Nominatim/OSRM to Google Maps by changing a single config flag

---

## Project Structure (Backend)

```
backend/
├── app/
│   ├── main.py                  # FastAPI app, CORS, router registration
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py              # Auth endpoints (login, register, me)
│   │   ├── trips.py             # FR-01, FR-02, FR-03
│   │   ├── recommendations.py   # FR-04, FR-05, FR-06
│   │   ├── stopovers.py         # FR-07
│   │   ├── reviews.py           # FR-08
│   │   ├── guide.py             # FR-09
│   │   └── expenses.py          # FR-10
│   ├── services/
│   │   ├── geo.py               # Nominatim geocoding + OSRM routing (→ Google Maps later)
│   │   ├── budget_engine.py     # Fuel/toll cost calc, budget constraint filter
│   │   ├── sequencing.py        # OR-Tools TSP-with-time-windows solver
│   │   ├── stopover_engine.py   # PostGIS corridor query
│   │   ├── guide_generator.py   # Gemini API prompt + response handling
│   │   └── cache.py             # Redis helper (get/set/invalidate)
│   ├── models/
│   │   ├── trip.py              # Pydantic schemas: Trip, TripLeg, POI
│   │   ├── expense.py           # Pydantic schemas: Expense, BudgetSummary
│   │   ├── user.py              # Pydantic schemas: User, AuthToken
│   │   └── guide.py             # Pydantic schemas: GuideContent
│   ├── db/
│   │   ├── client.py            # Supabase Python client init
│   │   ├── migrations/          # SQL migration files (run in Supabase SQL Editor)
│   │   │   ├── 001_trips.sql
│   │   │   ├── 002_pois.sql
│   │   │   ├── 003_expenses.sql
│   │   │   └── 004_guide_content.sql
│   │   └── seed.py              # Optional: seed POI data for demo
│   └── core/
│       ├── config.py            # Settings loaded from .env
│       ├── auth.py              # JWT verification via Supabase public key
│       ├── deps.py              # FastAPI dependency injectors (get_db, get_current_user)
│       └── errors.py            # Custom HTTP exception handlers
├── tests/
│   ├── test_trips.py
│   ├── test_recommendations.py
│   └── test_sequencing.py
├── .env.example
├── requirements.txt
└── Dockerfile
```

---

## Phase 0 — Scaffolding
*~2 hours · Do this first*

### Step-by-step

1. **Create the directory structure** above
2. **`requirements.txt`** — pin these versions:
   ```
   fastapi==0.115.0
   uvicorn[standard]==0.30.6
   pydantic==2.7.4
   pydantic-settings==2.3.4
   supabase==2.7.4          # Supabase Python client
   psycopg2-binary==2.9.9   # Direct Postgres connection for PostGIS queries
   asyncpg==0.29.0          # Async Postgres driver
   sqlalchemy==2.0.31       # ORM (optional, can use raw SQL for PostGIS)
   redis==5.0.7             # Redis client (Upstash compatible)
   ortools==9.10.4067       # Google OR-Tools
   google-generativeai==0.7.2  # Gemini SDK
   httpx==0.27.0            # Async HTTP client (for Nominatim/OSRM calls)
   python-jose[cryptography]==3.3.0  # JWT verification
   python-dotenv==1.0.1
   pytest==8.2.2
   pytest-asyncio==0.23.7
   ```

3. **`app/core/config.py`** — load `.env`:
   ```python
   from pydantic_settings import BaseSettings
   class Settings(BaseSettings):
       supabase_url: str
       supabase_anon_key: str
       supabase_service_role_key: str
       upstash_redis_url: str
       upstash_redis_token: str
       gemini_api_key: str = ""
       google_maps_api_key: str = ""   # empty until Phase 3/4
       use_google_maps: bool = False    # flip to True when key is available
       class Config:
           env_file = ".env"
   settings = Settings()
   ```

4. **`app/main.py`** — FastAPI skeleton with CORS:
   ```python
   from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   app = FastAPI(title="GhumoAI API", version="1.0.0")
   app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], ...)
   # Register routers (add as each phase builds them)
   ```

5. **Database migrations** — run these SQL files in **Supabase SQL Editor**:

   **`001_trips.sql`**
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;

   CREATE TABLE trips (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     source TEXT NOT NULL,
     destination TEXT NOT NULL,
     source_geom GEOGRAPHY(Point, 4326),
     dest_geom GEOGRAPHY(Point, 4326),
     budget NUMERIC NOT NULL,
     days INTEGER NOT NULL,
     transport_mode TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

   **`002_pois.sql`**
   ```sql
   CREATE TABLE pois (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     category TEXT,
     geom GEOGRAPHY(Point, 4326),
     lat DOUBLE PRECISION,
     lng DOUBLE PRECISION,
     open_time TIME,
     close_time TIME,
     estimated_cost NUMERIC,
     rating NUMERIC,
     visit_order INTEGER,
     external_id TEXT,     -- Google Place ID or OSM node ID
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   CREATE INDEX pois_geom_idx ON pois USING GIST(geom);
   ```

   **`003_expenses.sql`**
   ```sql
   CREATE TYPE expense_category AS ENUM ('transport','food','stay','entry_fee','misc');
   CREATE TABLE expenses (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
     category expense_category NOT NULL,
     amount NUMERIC NOT NULL,
     description TEXT,
     logged_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

6. **Verify**: Run `uvicorn app.main:app --reload` → open `http://localhost:8000/docs` — Swagger UI should load.

---

## Phase 1 — MVP APIs
*~6 hours · Core loop: plan a trip, get POIs, get itinerary, track spend*

### FR-01 & FR-02 — Trip Creation + Personal Vehicle Cost

**`app/api/trips.py`**

```python
# POST /api/v1/trips
# Body: { source, destination, budget, days, transport_mode }
# → Geocodes source/destination via Nominatim
# → Stores trip in Supabase
# → Returns trip_id + geocoded coordinates

# GET /api/v1/trips/{id}/transport-cost
# → Fetches trip from DB
# → Calls budget_engine.estimate_vehicle_cost(distance_km)
# → Returns { fuel_cost, toll_estimate, total_estimate }
```

**`app/services/geo.py`** (Nominatim + OSRM, no key needed)

```python
async def geocode(place_name: str) -> tuple[float, float]:
    """Nominatim geocoding: place name → (lat, lng)"""
    # GET https://nominatim.openstreetmap.org/search?q=<place>&format=json

async def get_route_distance(origin: tuple, dest: tuple) -> float:
    """OSRM routing: returns distance_km between two (lat,lng) points"""
    # GET http://router.project-osrm.org/route/v1/driving/{lng},{lat};{lng},{lat}

async def get_pois_in_radius(lat, lng, radius_km, budget_per_poi) -> list[POI]:
    """PostGIS ST_DWithin query on Supabase"""
    # Uses asyncpg direct connection for raw PostGIS query
    # SELECT * FROM pois WHERE ST_DWithin(geom, ST_MakePoint($1,$2), $3)
    # AND estimated_cost <= $4
```

**`app/services/budget_engine.py`**

```python
FUEL_PRICE_INR_PER_LITRE = 96.0   # Configurable
AVG_MILEAGE_KM_PER_LITRE = 15.0
TOLL_RATE_INR_PER_KM = 1.5         # Approximate national highway rate

def estimate_vehicle_cost(distance_km: float) -> dict:
    fuel = (distance_km / AVG_MILEAGE_KM_PER_LITRE) * FUEL_PRICE_INR_PER_LITRE
    toll = distance_km * TOLL_RATE_INR_PER_KM
    return {"fuel_cost": fuel, "toll_estimate": toll, "total_estimate": fuel + toll}
```

### FR-04, FR-05 — Budget + Radius POI Discovery

**`app/api/recommendations.py`**

```python
# GET /api/v1/trips/{id}/pois?radius_km=10
# → Fetches trip's destination lat/lng
# → Calls geo.get_pois_in_radius(lat, lng, radius_km, budget_per_day)
# → Returns list of POIs with estimated costs, hours, ratings
```

> [!NOTE]
> For the prototype, seed initial POI data using `db/seed.py` which pulls from **Overpass API** (OpenStreetMap's free query API for tourist attractions). No API key needed.

**`app/db/seed.py`** — Overpass API query for tourist POIs:
```python
# Query: [out:json]; node["tourism"~"attraction|museum|viewpoint"](around:10000, lat, lng); out;
# Parse response → insert into pois table with estimated costs (heuristic based on category)
```

### FR-06 — Visit Order (OR-Tools Sequencing)

**`app/services/sequencing.py`**

```python
from ortools.constraint_solver import routing_enums_pb2, pywrapcp

def solve_visit_order(pois: list[POI], start_time: time = time(9, 0)) -> list[POI]:
    """
    Solves TSP with time windows using OR-Tools.
    Each POI has: (lat, lng), open_time, close_time, avg_visit_duration_minutes
    Returns: ordered list of POIs with estimated arrival_time per POI
    """
```

**`app/api/recommendations.py`** (extend)
```python
# POST /api/v1/trips/{id}/visit-order
# Body: { poi_ids: [uuid, ...], start_time: "09:00" }
# → Fetches POIs from DB
# → Calls sequencing.solve_visit_order(pois)
# → Saves visit_order on each POI row
# → Returns ordered list with arrival_time estimates
```

### FR-10 — Expense Tracking

**`app/api/expenses.py`**

```python
# POST /api/v1/trips/{id}/expenses
# Body: { category, amount, description }
# → Inserts expense row

# GET /api/v1/trips/{id}/expenses
# → Returns list of expenses + budget summary:
#   { total_spent, total_budget, remaining, by_category: {...} }
```

### Auth — Supabase JWT Verification

**`app/core/auth.py`**

```python
from jose import jwt
# Supabase signs JWTs with its own secret (SUPABASE_JWT_SECRET from dashboard)
# Verify token on every protected endpoint using FastAPI dependency

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = jwt.decode(token, settings.supabase_jwt_secret, algorithms=["HS256"])
    return payload["sub"]  # user_id
```

**`app/api/auth.py`**

```python
# POST /api/v1/auth/register  → calls supabase.auth.sign_up()
# POST /api/v1/auth/login     → calls supabase.auth.sign_in_with_password()
# GET  /api/v1/auth/me        → returns current user from JWT
```

---

## Phase 2 — Route Intelligence & Reviews
*~5 hours*

### FR-03 — Alternative Transport Recommendations

**`app/services/transport.py`** (new file)
```python
# For each mode (train/bus/flight), return estimated:
# - cost range (INR)
# - duration estimate
# - availability flag
#
# Data source for prototype: static fare tables + OSRM distance
# (real: IRCTC API / flight search APIs — plug in later)
```

### FR-07 — Stopover Detection (PostGIS corridor query)

**`app/services/stopover_engine.py`**

```python
async def find_stopovers(route_geom_wkt: str, radius_km: float = 5.0) -> list[POI]:
    """
    PostGIS corridor query:
    SELECT * FROM pois
    WHERE ST_DWithin(
      geom,
      ST_GeomFromText($1, 4326)::geography,   -- route linestring
      $2 * 1000                                -- radius in metres
    )
    """
```

**`app/api/stopovers.py`**

```python
# GET /api/v1/trips/{id}/stopovers?radius_km=5
# → Fetches route geometry from OSRM (source → destination polyline)
# → Converts polyline to WKT LineString
# → Calls stopover_engine.find_stopovers(route_wkt, radius_km)
# → Returns stopover POIs with nearby stay suggestions (budget-matched)
```

### FR-08 — Reviews & Alternatives

**`app/services/reviews.py`**

```python
# Prototype: scrape/aggregate from Google Places API (if key available)
#            OR use static review data seeded from OSM + generate summary via Gemini
async def get_reviews(external_id: str) -> list[Review]: ...
async def get_alternative(poi_id: UUID, trip_id: UUID) -> POI:
    # Fetch next-best POI from same category + within budget
```

---

## Phase 3 — Virtual Guide
*~4 hours*

### FR-09 — Gemini-powered Virtual Tourism Guide

**`app/services/guide_generator.py`**

```python
import google.generativeai as genai

GUIDE_PROMPT = """
You are a cultural and heritage tourism expert for India.
Write a rich, engaging 500-word travel guide for {destination}.
Include:
1. Historical background
2. Key cultural highlights
3. Must-see monuments and their significance
4. Local cuisine recommendations
5. Best times to visit each attraction
Format as structured blog content with headers.
"""

async def generate_guide(destination: str) -> str:
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = await model.generate_content_async(
        GUIDE_PROMPT.format(destination=destination)
    )
    return response.text

# Cache result in Redis: key = f"guide:{destination}", TTL = 24h
```

**`app/api/guide.py`**

```python
# GET /api/v1/guide/{destination}
# → Check Redis cache first
# → If miss: call guide_generator.generate_guide(destination)
# → Store in Redis + Supabase guide_content table
# → Return { destination, content_markdown, generated_at }
```

---

## API Contract (Share this with the Frontend Team)

> [!IMPORTANT]
> The frontend team must use exactly these endpoint signatures. Both teams should agree on these before Phase 1 coding starts.

### Base URL
- Development: `http://localhost:8000/api/v1`
- All protected endpoints require: `Authorization: Bearer <supabase_jwt_token>`

### Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Register new user |
| `POST` | `/auth/login` | ❌ | Login → returns JWT |
| `GET` | `/auth/me` | ✅ | Current user info |
| `POST` | `/trips` | ✅ | Create trip |
| `GET` | `/trips/{id}` | ✅ | Get trip details |
| `GET` | `/trips/{id}/transport-cost` | ✅ | FR-02: vehicle cost estimate |
| `GET` | `/trips/{id}/pois?radius_km=10` | ✅ | FR-04/05: POI list |
| `POST` | `/trips/{id}/visit-order` | ✅ | FR-06: sequenced itinerary |
| `GET` | `/trips/{id}/stopovers` | ✅ | FR-07: stopovers |
| `GET` | `/places/{id}/reviews` | ✅ | FR-08: reviews |
| `GET` | `/places/{id}/alternatives` | ✅ | FR-08: reject & replace |
| `GET` | `/guide/{destination}` | ❌ | FR-09: virtual guide |
| `POST` | `/trips/{id}/expenses` | ✅ | FR-10: log expense |
| `GET` | `/trips/{id}/expenses` | ✅ | FR-10: expense breakdown |

### Key Response Schemas (share these with frontend)

**Trip**
```json
{
  "id": "uuid",
  "source": "Delhi",
  "destination": "Jaipur",
  "source_lat": 28.6139, "source_lng": 77.2090,
  "dest_lat": 26.9124, "dest_lng": 75.7873,
  "budget": 5000,
  "days": 2,
  "transport_mode": "personal_vehicle",
  "created_at": "2025-01-01T10:00:00Z"
}
```

**POI**
```json
{
  "id": "uuid",
  "name": "Amber Fort",
  "category": "monument",
  "lat": 26.9855, "lng": 75.8513,
  "open_time": "08:00", "close_time": "17:30",
  "estimated_cost": 200,
  "rating": 4.7,
  "visit_order": 1,
  "estimated_arrival": "09:15"
}
```

**Expense Summary**
```json
{
  "total_spent": 1800,
  "total_budget": 5000,
  "remaining": 3200,
  "by_category": {
    "transport": 800,
    "food": 500,
    "entry_fee": 400,
    "stay": 100,
    "misc": 0
  }
}
```

---

## Development Commands

```bash
# Clone and setup
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Copy env and fill in Supabase + Upstash credentials
cp .env.example .env

# Run migrations (paste SQL files in Supabase SQL Editor)

# Start dev server
uvicorn app.main:app --reload --port 8000

# Run tests
pytest tests/ -v
```

---

## Environment Variables (`.env.example`)

```env
# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Redis (Upstash)
UPSTASH_REDIS_URL=https://xxxx.upstash.io
UPSTASH_REDIS_TOKEN=your_token

# Gemini (Phase 3)
GEMINI_API_KEY=

# Google Maps (Phase 4 - future)
GOOGLE_MAPS_API_KEY=
USE_GOOGLE_MAPS=false

# App
CORS_ORIGINS=http://localhost:3000
```

---

## Execution Order (Backend)

```
Phase 0: Scaffolding + Supabase setup + DB migrations    ← Start here
    ↓
Phase 1a: geo.py (Nominatim) + budget_engine.py
    ↓
Phase 1b: trips.py API (POST /trips, GET /transport-cost)
    ↓
Phase 1c: sequencing.py (OR-Tools) + recommendations.py API
    ↓
Phase 1d: expenses.py API + auth.py
    ↓
Phase 2: stopover_engine.py + stopovers.py + reviews.py
    ↓
Phase 3: guide_generator.py (Gemini) + guide.py API
```

> [!TIP]
> After each sub-phase, test in Swagger at `http://localhost:8000/docs` before moving on. Share the Swagger URL with the frontend team so they can test API calls without needing the full frontend running.
