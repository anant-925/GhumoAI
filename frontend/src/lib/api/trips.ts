import type { Trip, CreateTripRequest, TransportCost } from '@/lib/types';
import { USE_MOCK, apiClient, simulateDelay } from './config';
import { MOCK_TRIP, MOCK_TRANSPORT_COSTS } from '@/lib/mock/trips';

/**
 * Create a new trip.
 * POST /trips
 */
export async function createTrip(data: CreateTripRequest): Promise<Trip> {
  if (USE_MOCK) {
    await simulateDelay(1200);
    return {
      ...MOCK_TRIP,
      id: `trip-${Date.now()}`,
      source: data.source,
      destination: data.destination,
      budget: data.budget,
      days: data.days,
      transport_mode: data.transport_mode,
      created_at: new Date().toISOString(),
    };
  }

  const { data: trip } = await apiClient.post<Trip>('/trips', data);
  return trip;
}

/**
 * Get trip details by ID.
 * GET /trips/{id}
 */
export async function getTrip(tripId: string): Promise<Trip> {
  if (USE_MOCK) {
    await simulateDelay(600);
    return { ...MOCK_TRIP, id: tripId };
  }

  const { data: trip } = await apiClient.get<Trip>(`/trips/${tripId}`);
  return trip;
}

/**
 * Get transport cost estimate for a trip.
 * GET /trips/{id}/transport-cost
 */
export async function getTransportCost(tripId: string): Promise<TransportCost> {
  if (USE_MOCK) {
    await simulateDelay(700);
    // Return cost for the mock trip's transport mode
    return MOCK_TRANSPORT_COSTS['personal_vehicle'];
  }

  const { data: cost } = await apiClient.get<TransportCost>(`/trips/${tripId}/transport-cost`);
  return cost;
}

/**
 * Get transport cost estimates for all modes (mock helper).
 * Used in the TransportSelector to show costs for each option.
 */
export async function getAllTransportCosts(tripId: string): Promise<Record<string, TransportCost>> {
  if (USE_MOCK) {
    await simulateDelay(900);
    return MOCK_TRANSPORT_COSTS;
  }

  // In real mode, call the endpoint for each transport mode
  // Backend could expose a single endpoint for this, or we call per-mode
  const { data: cost } = await apiClient.get<TransportCost>(`/trips/${tripId}/transport-cost`);
  return { personal_vehicle: cost };
}
