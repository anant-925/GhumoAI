import type { User, AuthResponse } from '@/lib/types';

export const MOCK_USER: User = {
  id: 'mock-user-001',
  email: 'traveler@ghumoai.com',
  name: 'Arjun Sharma',
  avatar_url: undefined,
  created_at: '2025-06-15T10:00:00Z',
};

export const MOCK_AUTH_RESPONSE: AuthResponse = {
  user: MOCK_USER,
  session: {
    access_token: 'mock-jwt-token-xyz',
    refresh_token: 'mock-refresh-token-xyz',
    expires_at: Date.now() + 3600 * 1000,
  },
};
