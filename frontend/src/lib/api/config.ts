import axios from 'axios';

// ---------- Environment flags ----------
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

// ---------- Axios instance ----------
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Auth interceptor: attach Supabase JWT token to every request
apiClient.interceptors.request.use(async (config) => {
  // Only import supabase on the client side and when not in mock mode
  if (!USE_MOCK && typeof window !== 'undefined') {
    const { createClient } = await import('@/lib/supabase');
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  }
  return config;
});

// Response interceptor: normalize error shape
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = {
      message: error.response?.data?.detail || error.message || 'Something went wrong',
      status: error.response?.status || 500,
      code: error.code,
    };
    return Promise.reject(apiError);
  }
);

// ---------- Mock helpers ----------

/**
 * Simulate network delay for mock mode so loading/skeleton states are visible
 */
export async function simulateDelay(ms: number = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simulate a random failure (for testing error states)
 * Set NEXT_PUBLIC_MOCK_ERRORS=true to enable
 */
export function shouldSimulateError(): boolean {
  if (process.env.NEXT_PUBLIC_MOCK_ERRORS !== 'true') return false;
  return Math.random() < 0.1; // 10% error rate
}
