import type { POI, VisitOrderRequest, Review } from '@/lib/types';
import { USE_MOCK, apiClient, simulateDelay } from './config';
import { MOCK_POIS, MOCK_ALTERNATIVE_POI } from '@/lib/mock/pois';
import { MOCK_REVIEWS } from '@/lib/mock/guide';

/**
 * Get POIs near the trip destination.
 * GET /trips/{id}/pois?radius_km=10
 */
export async function getPOIs(tripId: string, radiusKm: number = 10): Promise<POI[]> {
  if (USE_MOCK) {
    await simulateDelay(800);
    return MOCK_POIS;
  }

  const { data: pois } = await apiClient.get<POI[]>(`/trips/${tripId}/pois`, {
    params: { radius_km: radiusKm },
  });
  return pois;
}

/**
 * Submit selected POIs for visit order optimization.
 * POST /trips/{id}/visit-order
 */
export async function getVisitOrder(tripId: string, request: VisitOrderRequest): Promise<POI[]> {
  if (USE_MOCK) {
    await simulateDelay(1500); // Simulate OR-Tools computation time
    // Return the selected POIs in mock order with arrival times
    const selectedPOIs = MOCK_POIS.filter((p) => request.poi_ids.includes(p.id));
    return selectedPOIs.map((poi, index) => ({
      ...poi,
      visit_order: index + 1,
      estimated_arrival: `${9 + Math.floor(index * 1.5)}:${index % 2 === 0 ? '00' : '30'}`,
    }));
  }

  const { data: pois } = await apiClient.post<POI[]>(`/trips/${tripId}/visit-order`, request);
  return pois;
}

/**
 * Get reviews for a place.
 * GET /places/{id}/reviews
 */
export async function getReviews(placeId: string): Promise<Review[]> {
  if (USE_MOCK) {
    await simulateDelay(600);
    return MOCK_REVIEWS;
  }

  const { data: reviews } = await apiClient.get<Review[]>(`/places/${placeId}/reviews`);
  return reviews;
}

/**
 * Get an alternative POI (reject & replace).
 * GET /places/{id}/alternatives
 */
export async function getAlternative(placeId: string): Promise<POI> {
  if (USE_MOCK) {
    await simulateDelay(700);
    return MOCK_ALTERNATIVE_POI;
  }

  const { data: poi } = await apiClient.get<POI>(`/places/${placeId}/alternatives`);
  return poi;
}
