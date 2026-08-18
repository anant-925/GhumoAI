import type { Expense, ExpenseSummary, CreateExpenseRequest } from '@/lib/types';
import { USE_MOCK, apiClient, simulateDelay } from './config';
import { MOCK_EXPENSE_SUMMARY, MOCK_EXPENSES } from '@/lib/mock/expenses';

/**
 * Get expense summary for a trip.
 * GET /trips/{id}/expenses
 */
export async function getExpenses(tripId: string): Promise<ExpenseSummary> {
  if (USE_MOCK) {
    await simulateDelay(600);
    return MOCK_EXPENSE_SUMMARY;
  }

  const { data: summary } = await apiClient.get<ExpenseSummary>(`/trips/${tripId}/expenses`);
  return summary;
}

/**
 * Log a new expense for a trip.
 * POST /trips/{id}/expenses
 */
export async function createExpense(tripId: string, data: CreateExpenseRequest): Promise<Expense> {
  if (USE_MOCK) {
    await simulateDelay(500);
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      trip_id: tripId,
      category: data.category,
      amount: data.amount,
      description: data.description,
      logged_at: new Date().toISOString(),
    };
    // Add to mock data for this session
    MOCK_EXPENSES.push(newExpense);
    return newExpense;
  }

  const { data: expense } = await apiClient.post<Expense>(`/trips/${tripId}/expenses`, data);
  return expense;
}
