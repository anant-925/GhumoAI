import type { Stopover } from '@/lib/types';
import { USE_MOCK, apiClient, simulateDelay } from './config';
import { MOCK_STOPOVERS } from '@/lib/mock/stopovers';

/**
 * Get stopovers along the trip route.
 * GET /trips/{id}/stopovers
 */
export async function getStopovers(tripId: string): Promise<Stopover[]> {
  if (USE_MOCK) {
    await simulateDelay(900);
    return MOCK_STOPOVERS;
  }

  const { data: stopovers } = await apiClient.get<Stopover[]>(`/trips/${tripId}/stopovers`);
  return stopovers;
}
