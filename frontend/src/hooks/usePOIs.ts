import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPOIs, getVisitOrder, getReviews, getAlternative } from '@/lib/api/pois';
import type { VisitOrderRequest } from '@/lib/types';

export function usePOIs(tripId: string | undefined, radiusKm?: number) {
  return useQuery({
    queryKey: ['pois', tripId, radiusKm],
    queryFn: () => getPOIs(tripId!, radiusKm),
    enabled: !!tripId,
  });
}

export function useVisitOrder(tripId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: VisitOrderRequest) => getVisitOrder(tripId!, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pois', tripId] });
    },
  });
}

export function useReviews(placeId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', placeId],
    queryFn: () => getReviews(placeId!),
    enabled: !!placeId,
  });
}

export function useAlternative() {
  return useMutation({
    mutationFn: (placeId: string) => getAlternative(placeId),
  });
}
