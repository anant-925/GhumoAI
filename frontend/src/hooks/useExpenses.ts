import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExpenses, createExpense } from '@/lib/api/expenses';
import type { CreateExpenseRequest } from '@/lib/types';

export function useExpenses(tripId: string | undefined) {
  return useQuery({
    queryKey: ['expenses', tripId],
    queryFn: () => getExpenses(tripId!),
    enabled: !!tripId,
  });
}

export function useCreateExpense(tripId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseRequest) => createExpense(tripId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', tripId] });
    },
  });
}
