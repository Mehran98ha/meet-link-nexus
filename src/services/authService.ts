
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  username: string;
  created_at: string;
  last_login?: string;
}

export interface PasswordClick {
  x: number;
  y: number;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
  sessionToken?: string;
}

/**
 * Register a new user with visual password
 */
export const registerUser = async (username: string, passwordClicks: PasswordClick[]): Promise<AuthResponse> => {
  try {
    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return { success: false, error: 'Username already exists' };
    }

    // Create new user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        username,
        password_clicks: passwordClicks as any,
        session_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      }])
      .select()
      .single();

    if (userError || !user) {
      return { success: false, error: userError?.message || 'Failed to create user' };
    }

    // Create session
    const sessionToken = generateSessionToken();
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .insert([{
        user_id: user.id,
        session_token: sessionToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }]);

    if (sessionError) {
      return { success: false, error: 'Failed to create session' };
    }

    // Store session in localStorage
    localStorage.setItem('auth_token', sessionToken);
    localStorage.setItem('user_id', user.id);

    return { 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
        last_login: user.last_login
      },
      sessionToken 
    };

  } catch (error) {
    return { success: false, error: 'Registration failed' };
  }
};

/**
 * Login user with visual password
 */
export const loginUser = async (username: string, passwordClicks: PasswordClick[]): Promise<AuthResponse> => {
  try {
    // Get user by username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (userError || !user) {
      return { success: false, error: 'Invalid username' };
    }

    // Verify password clicks - properly cast from Json to PasswordClick[]
    const savedClicks = user.password_clicks as unknown as PasswordClick[];
    const isValid = verifyPasswordClicks(passwordClicks, savedClicks);

    if (!isValid) {
      return { success: false, error: 'Invalid click pattern' };
    }

    // Update last login
    await supabase
      .from('users')
      .update({ 
        last_login: new Date().toISOString(),
        session_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .eq('id', user.id);

    // Create new session
    const sessionToken = generateSessionToken();
    await supabase
      .from('user_sessions')
      .insert([{
        user_id: user.id,
        session_token: sessionToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }]);

    // Store session in localStorage
    localStorage.setItem('auth_token', sessionToken);
    localStorage.setItem('user_id', user.id);

    return { 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
        last_login: user.last_login
      },
      sessionToken 
    };

  } catch (error) {
    return { success: false, error: 'Login failed' };
  }
};

/**
 * Verify password clicks against saved pattern
 */
export const verifyPasswordClicks = (inputClicks: PasswordClick[], savedClicks: PasswordClick[]): boolean => {
  if (inputClicks.length !== savedClicks.length) {
    return false;
  }

  for (let i = 0; i < inputClicks.length; i++) {
    const distance = Math.hypot(savedClicks[i].x - inputClicks[i].x, savedClicks[i].y - inputClicks[i].y);
    if (distance > 50) { // 50px tolerance
      return false;
    }
  }

  return true;
};

/**
 * Generate session token
 */
const generateSessionToken = (): string => {
  return crypto.randomUUID() + '_' + Date.now();
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
  const sessionToken = localStorage.getItem('auth_token');
  
  if (sessionToken) {
    // Remove session from database
    await supabase
      .from('user_sessions')
      .delete()
      .eq('session_token', sessionToken);
  }

  // Clear localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_id');
};

/**
 * Check if user is authenticated
 */
export const checkAuth = async (): Promise<{ isAuthenticated: boolean; user?: User }> => {
  const sessionToken = localStorage.getItem('auth_token');
  const userId = localStorage.getItem('user_id');

  if (!sessionToken || !userId) {
    return { isAuthenticated: false };
  }

  try {
    // Check if session is valid
    const { data: session } = await supabase
      .from('user_sessions')
      .select('expires_at')
      .eq('session_token', sessionToken)
      .eq('user_id', userId)
      .single();

    if (!session || new Date(session.expires_at) < new Date()) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      return { isAuthenticated: false };
    }

    // Get user data
    const { data: user } = await supabase
      .from('users')
      .select('id, username, created_at, last_login')
      .eq('id', userId)
      .single();

    if (!user) {
      return { isAuthenticated: false };
    }

    return { 
      isAuthenticated: true, 
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
        last_login: user.last_login
      }
    };

  } catch (error) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    return { isAuthenticated: false };
  }
};
