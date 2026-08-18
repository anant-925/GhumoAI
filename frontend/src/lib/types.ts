// ============================================================
// GhumoAI — Shared TypeScript Types
// Mirrors backend API response schemas exactly
// ============================================================

// ---------- Auth ----------
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// ---------- Trip ----------
export type TransportMode = 'personal_vehicle' | 'train' | 'bus' | 'flight' | 'cab';

export interface Trip {
  id: string;
  source: string;
  destination: string;
  source_lat: number;
  source_lng: number;
  dest_lat: number;
  dest_lng: number;
  budget: number;
  days: number;
  transport_mode: TransportMode;
  created_at: string;
}

export interface CreateTripRequest {
  source: string;
  destination: string;
  budget: number;
  days: number;
  transport_mode: TransportMode;
}

export interface TransportCost {
  fuel_cost: number;
  toll_estimate: number;
  total_estimate: number;
}

// ---------- POI ----------
export type POICategory =
  | 'monument'
  | 'museum'
  | 'viewpoint'
  | 'restaurant'
  | 'park'
  | 'religious'
  | 'other';

export interface POI {
  id: string;
  name: string;
  category: POICategory;
  lat: number;
  lng: number;
  open_time: string;   // "08:00"
  close_time: string;  // "17:30"
  estimated_cost: number;
  rating: number;
  visit_order: number;
  estimated_arrival?: string;
}

export interface VisitOrderRequest {
  poi_ids: string[];
  start_time: string;  // "09:00"
}

// ---------- Expenses ----------
export type ExpenseCategory = 'transport' | 'food' | 'stay' | 'entry_fee' | 'misc';

export interface Expense {
  id: string;
  trip_id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  logged_at: string;
}

export interface CreateExpenseRequest {
  category: ExpenseCategory;
  amount: number;
  description: string;
}

export interface ExpenseSummary {
  total_spent: number;
  total_budget: number;
  remaining: number;
  by_category: {
    transport: number;
    food: number;
    stay: number;
    entry_fee: number;
    misc: number;
  };
  expenses: Expense[];
}

// ---------- Stopovers ----------
export interface Stay {
  name: string;
  rating: number;
  price_per_night: number;
  booking_url?: string;
}

export interface Stopover {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distance_from_route_km: number;
  nearby_stays: Stay[];
}

// ---------- Reviews ----------
export interface Review {
  id: string;
  author_name: string;
  rating: number;
  text: string;
  created_at: string;
}

// ---------- Guide ----------
export interface GuideContent {
  destination: string;
  content_markdown: string;
  generated_at: string;
}

// ---------- Common ----------
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
