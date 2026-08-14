import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/lib/types';
import { USE_MOCK, apiClient, simulateDelay } from './config';
import { MOCK_AUTH_RESPONSE, MOCK_USER } from '@/lib/mock/auth';

/**
 * Register a new user.
 * POST /auth/register
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  if (USE_MOCK) {
    await simulateDelay(1000);
    return {
      ...MOCK_AUTH_RESPONSE,
      user: { ...MOCK_USER, email: data.email, name: data.name },
    };
  }

  // Real mode: use Supabase Auth directly
  const { createClient } = await import('@/lib/supabase');
  const supabase = createClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { data: { name: data.name } },
  });

  if (error) throw { message: error.message, status: 400, code: error.name };

  return {
    user: {
      id: authData.user!.id,
      email: authData.user!.email!,
      name: data.name,
      created_at: authData.user!.created_at,
    },
    session: {
      access_token: authData.session!.access_token,
      refresh_token: authData.session!.refresh_token,
      expires_at: authData.session!.expires_at!,
    },
  };
}

/**
 * Log in an existing user.
 * POST /auth/login
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  if (USE_MOCK) {
    await simulateDelay(800);
    return {
      ...MOCK_AUTH_RESPONSE,
      user: { ...MOCK_USER, email: data.email },
    };
  }

  const { createClient } = await import('@/lib/supabase');
  const supabase = createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) throw { message: error.message, status: 401, code: error.name };

  return {
    user: {
      id: authData.user.id,
      email: authData.user.email!,
      name: authData.user.user_metadata?.name,
      created_at: authData.user.created_at,
    },
    session: {
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_at: authData.session.expires_at!,
    },
  };
}

/**
 * Log out the current user.
 */
export async function logout(): Promise<void> {
  if (USE_MOCK) {
    await simulateDelay(300);
    return;
  }

  const { createClient } = await import('@/lib/supabase');
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw { message: error.message, status: 500 };
}

/**
 * Get current user info.
 * GET /auth/me
 */
export async function getCurrentUser(): Promise<User | null> {
  if (USE_MOCK) {
    await simulateDelay(400);
    return MOCK_USER;
  }

  const { createClient } = await import('@/lib/supabase');
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name,
    avatar_url: user.user_metadata?.avatar_url,
    created_at: user.created_at,
  };
}
