import type { Trip, TransportCost } from '@/lib/types';

export const MOCK_TRIP: Trip = {
  id: 'trip-delhi-jaipur-001',
  source: 'Delhi',
  destination: 'Jaipur',
  source_lat: 28.6139,
  source_lng: 77.2090,
  dest_lat: 26.9124,
  dest_lng: 75.7873,
  budget: 5000,
  days: 2,
  transport_mode: 'personal_vehicle',
  created_at: '2025-07-01T08:00:00Z',
};

export const MOCK_TRANSPORT_COSTS: Record<string, TransportCost> = {
  personal_vehicle: {
    fuel_cost: 1200,
    toll_estimate: 450,
    total_estimate: 1650,
  },
  train: {
    fuel_cost: 0,
    toll_estimate: 0,
    total_estimate: 450,
  },
  bus: {
    fuel_cost: 0,
    toll_estimate: 0,
    total_estimate: 350,
  },
  flight: {
    fuel_cost: 0,
    toll_estimate: 0,
    total_estimate: 3500,
  },
  cab: {
    fuel_cost: 0,
    toll_estimate: 0,
    total_estimate: 2800,
  },
};
