import { useQuery } from '@tanstack/react-query';
import { getTrip, getTransportCost, getAllTransportCosts } from '@/lib/api/trips';

export function useTrip(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => getTrip(tripId!),
    enabled: !!tripId,
  });
}

export function useTransportCost(tripId: string | undefined) {
  return useQuery({
    queryKey: ['transport-cost', tripId],
    queryFn: () => getTransportCost(tripId!),
    enabled: !!tripId,
  });
}

export function useAllTransportCosts(tripId: string | undefined) {
  return useQuery({
    queryKey: ['all-transport-costs', tripId],
    queryFn: () => getAllTransportCosts(tripId!),
    enabled: !!tripId,
  });
}
