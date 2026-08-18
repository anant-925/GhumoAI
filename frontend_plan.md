# GhumoAI — Frontend Implementation Plan
*For the Frontend Team · Next.js 15 + TypeScript + Supabase Auth*

---

## Confirmed Decisions

| Decision | Choice |
|---|---|
| Framework | **Next.js 15** (App Router) + TypeScript |
| Auth | **Supabase Auth** (JS client — `@supabase/supabase-js`) |
| Maps | **Leaflet** with **OpenStreetMap** tiles (free, no key) |
| Data fetching | **TanStack Query v5** (React Query) |
| Animations | **Framer Motion** |
| Design system | Custom Vanilla CSS + CSS variables (dark-mode first) |
| Icons | **Lucide React** |
| Charts (Phase 3) | **Recharts** |
| HTTP client | **Axios** |

---

## How to Get Your API Keys

### Supabase (Auth + DB) — needed from Phase 0
1. The backend team will set up the Supabase project and share:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Create a `.env.local` file and paste these in
3. The Supabase JS client handles all auth token management automatically

---

## Project Structure (Frontend)

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout: fonts, providers, navbar
│   │   ├── page.tsx                 # Landing page (Hero, Features, CTA)
│   │   ├── globals.css              # Design system: CSS variables, typography, animations
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx       # Login page
│   │   │   └── register/page.tsx    # Register page
│   │   ├── plan/
│   │   │   └── page.tsx             # Multi-step trip planner
│   │   ├── trip/
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Active trip dashboard
│   │   │       └── stopovers/page.tsx  # Stopover view
│   │   ├── guide/
│   │   │   └── [destination]/page.tsx  # Virtual tourism guide
│   │   └── analytics/
│   │       └── [tripId]/page.tsx    # Trip analytics
│   ├── components/
│   │   ├── ui/                      # Base reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── map/
│   │   │   └── MapView.tsx          # Leaflet map with SSR guard
│   │   ├── trip/
│   │   │   ├── TripForm.tsx         # Multi-step form (Steps 1-4)
│   │   │   ├── POICard.tsx
│   │   │   ├── ItineraryTimeline.tsx
│   │   │   ├── TransportSelector.tsx
│   │   │   └── StopoverCard.tsx
│   │   ├── expense/
│   │   │   ├── ExpenseTracker.tsx
│   │   │   └── BudgetMeter.tsx
│   │   └── guide/
│   │       ├── GuideArticle.tsx
│   │       └── AudioPlayer.tsx
│   ├── hooks/
│   │   ├── useTrip.ts               # TanStack Query hooks for trip data
│   │   ├── usePOIs.ts
│   │   ├── useExpenses.ts
│   │   └── useAuth.ts               # Supabase auth state hook
│   ├── lib/
│   │   ├── api.ts                   # Axios instance + interceptors
│   │   ├── supabase.ts              # Supabase client init
│   │   └── types.ts                 # Shared TypeScript interfaces (mirror backend schemas)
│   └── providers/
│       ├── QueryProvider.tsx        # TanStack Query provider
│       └── AuthProvider.tsx         # Supabase auth context
├── public/
│   └── images/
├── .env.local.example
├── package.json
└── next.config.ts
```

---

## Design System (Define Before Any Component)

> [!IMPORTANT]
> Build the design system in `globals.css` **first** — before any page or component. Every component must use CSS variables from here, never hardcoded colors.

### Color Palette (Dark-mode first, India-inspired)

```css
/* globals.css */
:root {
  /* Brand — deep saffron-to-violet gradient palette */
  --color-brand-primary: #FF6B35;      /* Saffron orange */
  --color-brand-secondary: #7C3AED;    /* Deep violet */
  --color-brand-accent: #06B6D4;       /* Cyan accent */

  /* Surface */
  --color-bg-base: #0A0A0F;            /* Near-black */
  --color-bg-surface: #13131A;         /* Card backgrounds */
  --color-bg-elevated: #1C1C28;        /* Elevated panels */
  --color-bg-overlay: rgba(255,255,255,0.04);

  /* Text */
  --color-text-primary: #F0F0FF;
  --color-text-secondary: #8B8BA7;
  --color-text-muted: #4A4A6A;

  /* Borders */
  --color-border: rgba(255,255,255,0.08);
  --color-border-accent: rgba(255,107,53,0.3);

  /* Semantic */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;

  /* Gradients */
  --gradient-brand: linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%);
  --gradient-card: linear-gradient(145deg, #13131A 0%, #1C1C28 100%);
  --gradient-hero: radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.3) 0%, transparent 70%);

  /* Spacing */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;  --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;

  /* Border radius */
  --radius-sm: 6px; --radius-md: 12px; --radius-lg: 20px; --radius-full: 9999px;

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(0,0,0,0.4);
  --shadow-glow: 0 0 40px rgba(255,107,53,0.15);

  /* Typography */
  --font-sans: 'Outfit', sans-serif;
  --font-display: 'Sora', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Animations

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255,107,53,0.2); }
  50%       { box-shadow: 0 0 40px rgba(255,107,53,0.5); }
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
.animate-pulse-glow  { animation: pulse-glow 2s ease-in-out infinite; }
```

---

## Shared TypeScript Types (`src/lib/types.ts`)

> [!NOTE]
> These mirror the backend API response schemas. Define these once and import everywhere. Update when backend schema changes.

```typescript
export interface Trip {
  id: string;
  source: string;
  destination: string;
  source_lat: number; source_lng: number;
  dest_lat: number;   dest_lng: number;
  budget: number;
  days: number;
  transport_mode: 'personal_vehicle' | 'train' | 'bus' | 'flight' | 'cab';
  created_at: string;
}

export interface POI {
  id: string;
  name: string;
  category: 'monument' | 'museum' | 'viewpoint' | 'restaurant' | 'park' | 'religious' | 'other';
  lat: number; lng: number;
  open_time: string;   // "08:00"
  close_time: string;  // "17:30"
  estimated_cost: number;
  rating: number;
  visit_order: number;
  estimated_arrival?: string;
}

export interface ExpenseSummary {
  total_spent: number;
  total_budget: number;
  remaining: number;
  by_category: {
    transport: number; food: number; stay: number;
    entry_fee: number; misc: number;
  };
}

export interface Stopover {
  id: string;
  name: string;
  lat: number; lng: number;
  distance_from_route_km: number;
  nearby_stays: Stay[];
}

export interface Stay {
  name: string; rating: number;
  price_per_night: number; booking_url?: string;
}

export interface GuideContent {
  destination: string;
  content_markdown: string;
  generated_at: string;
}
```

---

## Auth Flow (Supabase)

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// src/hooks/useAuth.ts
// - supabase.auth.signUp({ email, password })
// - supabase.auth.signInWithPassword({ email, password })
// - supabase.auth.signOut()
// - supabase.auth.getSession() → JWT token for API calls
```

**Protected route pattern** — wrap with a `middleware.ts` that checks Supabase session:
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// Redirect to /login if no session on protected routes (/plan, /trip/*, /guide/*)
```

---

## Phase 0 — Scaffolding + Design System
*~2 hours*

### Commands (run in `/frontend`)

```bash
npx -y create-next-app@latest ./ --typescript --app --tailwind=false --eslint --src-dir --import-alias "@/*"
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @tanstack/react-query axios
npm install framer-motion lucide-react
npm install leaflet react-leaflet @types/leaflet   # Maps
npm install recharts                               # Charts (Phase 3)
```

### Deliverables
- `globals.css` with full design system (tokens, animations, base styles)
- `layout.tsx` with Google Fonts (`Outfit`, `Sora`) loaded via `<link>` in `<head>`
- `AuthProvider.tsx` + `QueryProvider.tsx` wrapping the layout
- `Navbar.tsx` with GhumoAI logo + auth state (Login/Logout button)
- Placeholder pages for all routes (just "Coming soon" with the design system applied)

---

## Phase 1 — MVP Pages
*~6 hours*

### Landing Page (`app/page.tsx`)

**Sections:**
1. **Hero** — full-viewport height, animated gradient background, floating particle effect (CSS only), headline "Your AI-Powered Travel Companion for India", sub-headline, "Plan My Trip →" CTA button
2. **Features grid** — 4 cards showcasing FR-01, FR-05, FR-06, FR-10 with animated icons
3. **How it works** — 4-step numbered flow (Enter → Discover → Sequence → Track)
4. **Demo destinations** — horizontal scroll of 6 popular Indian destinations with hover parallax

### Planner Page (`app/plan/page.tsx`)

**Multi-step form with progress indicator:**

```
Step 1: Trip Details        Step 2: Transport       Step 3: Discover POIs    Step 4: Your Itinerary
[Source] [Destination]  →  [Mode cards with     →  [Map + POI list       →  [Timeline view
[Budget] [Days]            cost estimates]          with checkboxes]         with arrival times]
[Next →]                   [Continue →]             [Generate Itinerary →]   [Save Trip →]
```

**Step 1 — `TripForm.tsx`**
- Animated input fields with floating labels
- Source/destination auto-complete (call backend geocoding on blur)
- Budget slider with live INR formatting
- Day counter with + / - controls

**Step 2 — `TransportSelector.tsx`**
- Transport mode cards: 🚗 Personal Vehicle · 🚂 Train · 🚌 Bus · ✈️ Flight
- Each card shows estimated cost from `GET /trips/{id}/transport-cost`
- Selected card gets a glowing border animation

**Step 3 — POI Discovery**
- Left panel: `POICard.tsx` list (scrollable, with filter by category)
- Right panel: `MapView.tsx` with Leaflet map + markers
- Each POI card: name, category badge, rating stars, estimated cost, open hours
- "Add to Itinerary" checkbox per POI

**Step 4 — `ItineraryTimeline.tsx`**
- Vertical timeline with hour markers
- Each slot: POI name, estimated arrival time, visit duration, travel time to next
- Drag-to-reorder (optional — nice to have for demo)
- "Save & Start Trip →" button

### `MapView.tsx` — Leaflet Map Component

```tsx
// IMPORTANT: Leaflet must be loaded client-side only (no SSR)
'use client'
import dynamic from 'next/dynamic'
// Wrap in dynamic() with ssr: false
// Tiles: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
// Markers: custom SVG pins using L.divIcon
// Route polyline: decode OSRM route geometry → draw on map
```

### Trip Dashboard (`app/trip/[id]/page.tsx`)

**Layout: 2-column on desktop, stacked on mobile**

Left column:
- Day-tabs (Day 1, Day 2, ...) with itinerary per day
- `ItineraryTimeline.tsx` for the active day

Right column:
- `BudgetMeter.tsx` — circular progress with remaining budget in center
- `ExpenseTracker.tsx`:
  - Log expense form (category, amount, description)
  - Expense list grouped by category
  - Budget alert banner when > 80% spent (amber) or over budget (red, pulsing)

---

## Phase 2 — Stopovers & Reviews
*~4 hours*

### Stopovers (`app/trip/[id]/stopovers/page.tsx`)

- Map view showing route polyline + stopover markers (different color)
- `StopoverCard.tsx` per stopover:
  - Place name, distance from route
  - Nearby stays list with price per night + booking CTA
  - "Add to Itinerary" / "Skip" buttons with slide-out animation

### Reviews + Reject & Replace (integrated into Step 3 of planner)

- Each `POICard.tsx` gets a "See Reviews" expand section:
  - Star rating breakdown (5★ → 1★ bar chart)
  - 3 review excerpts with reviewer name + date
  - **"Not interested → Show alternative"** button
  - On click: animate card out, animate new POI card in (Framer Motion layout animation)

### `ReviewPanel.tsx`

```tsx
// Props: placeId, onReject: () => void
// Fetches GET /places/{id}/reviews
// On reject: fetches GET /places/{id}/alternatives
// → replaces current POI in parent state
```

---

## Phase 3 — Virtual Guide + Analytics
*~4 hours*

### Virtual Guide (`app/guide/[destination]/page.tsx`)

**Full-page immersive layout:**
- Hero section: destination name as large display text over a gradient + generated image
- Sticky side-panel: "In this guide" table of contents (auto-generated from markdown headers)
- Main content: `GuideArticle.tsx` — render AI-generated markdown as rich HTML
  - Custom styled blockquotes, headers, bullet lists using design system tokens
- `AudioPlayer.tsx` — mini sticky audio player at bottom (if TTS is available)
- "Plan a trip to {destination}" CTA button at bottom

### Analytics (`app/analytics/[tripId]/page.tsx`)

- **Doughnut chart** (Recharts): spend by category (transport / food / stay / entry_fee / misc)
- **Bar chart**: daily spend vs. daily budget allocation
- **Summary stats**: total saved, most expensive category, number of places visited
- **Timeline card list**: every expense in chronological order with category icon

---

## Working Independently from Backend

> [!NOTE]
> The frontend team can start immediately using **mock data** while the backend is being built. Follow this pattern:

```typescript
// src/lib/api.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export async function getPOIs(tripId: string): Promise<POI[]> {
  if (USE_MOCK) return MOCK_POIS  // import from src/lib/mocks.ts
  const { data } = await axios.get(`/trips/${tripId}/pois`)
  return data
}
```

Create `src/lib/mocks.ts` with realistic sample data for Delhi → Jaipur trip so every UI component can be fully developed and styled before the backend is ready.

**Integration handoff checklist:**
- [ ] Backend `/docs` Swagger URL shared with frontend team
- [ ] All endpoint response schemas match `src/lib/types.ts`
- [ ] Supabase project URL + anon key shared
- [ ] CORS configured on backend to allow `http://localhost:3000`
- [ ] Set `NEXT_PUBLIC_USE_MOCK=false` to switch to real API

---

## Environment Variables (`.env.local.example`)

```env
# Supabase (get from backend team)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# Mock mode (set to true for independent frontend dev)
NEXT_PUBLIC_USE_MOCK=true
```

---

## Execution Order (Frontend)

```
Phase 0: Scaffolding + design system (globals.css) + Navbar + auth pages
    ↓
Phase 1a: Landing page (wow-worthy hero + features)
    ↓
Phase 1b: Planner — Step 1 form + Step 2 transport selector
    ↓
Phase 1c: MapView (Leaflet) + POI cards (Step 3)
    ↓
Phase 1d: Itinerary timeline (Step 4) + Trip dashboard + Expense tracker
    ↓
Phase 2: Stopovers page + Review panel + Reject & Replace
    ↓
Phase 3: Virtual guide page + Analytics charts
```

---

## Key Libraries Reference

| Library | Purpose | Docs |
|---|---|---|
| `@supabase/supabase-js` | Auth + DB client | supabase.com/docs |
| `@tanstack/react-query` | Server state, caching | tanstack.com/query |
| `framer-motion` | Page/component animations | framer.com/motion |
| `react-leaflet` | Interactive maps | react-leaflet.js.org |
| `lucide-react` | Icon set | lucide.dev |
| `recharts` | Charts (analytics) | recharts.org |
| `axios` | HTTP client | axios-http.com |
