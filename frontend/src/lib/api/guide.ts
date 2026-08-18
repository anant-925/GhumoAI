import type { GuideContent } from '@/lib/types';
import { USE_MOCK, apiClient, simulateDelay } from './config';
import { MOCK_GUIDE } from '@/lib/mock/guide';

/**
 * Get the virtual tourism guide for a destination.
 * GET /guide/{destination}
 */
export async function getGuide(destination: string): Promise<GuideContent> {
  if (USE_MOCK) {
    await simulateDelay(1200); // Simulate Gemini generation time
    return {
      ...MOCK_GUIDE,
      destination,
    };
  }

  const { data: guide } = await apiClient.get<GuideContent>(`/guide/${encodeURIComponent(destination)}`);
  return guide;
}
