import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  username: string;
  created_at: string;
  last_login?: string;
  profile_image_url?: string;
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
    console.log('Starting user registration for:', username);
    
    // Use secure RPC function for registration
    const { data, error } = await supabase
      .rpc('register_user', {
        p_username: username,
        p_clicks: passwordClicks as any
      })
      .single();

    if (error) {
      console.error('Registration error:', error);
      if (error.code === '23505') { // unique constraint violation
        return { success: false, error: 'Username already exists' };
      }
      return { success: false, error: 'Registration failed. Please try again.' };
    }

    if (!data) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }

    // Store session in localStorage
    localStorage.setItem('auth_token', data.session_token);
    localStorage.setItem('user_id', data.user_id);

    console.log('User registration successful:', data.user_id);
    return { 
      success: true, 
      user: {
        id: data.user_id,
        username: data.username,
        created_at: data.created_at,
        last_login: data.last_login,
        profile_image_url: data.profile_image_url
      },
      sessionToken: data.session_token
    };

  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please check your connection and try again.' };
  }
};

/**
 * Login user with visual password
 */
export const loginUser = async (username: string, passwordClicks: PasswordClick[]): Promise<AuthResponse> => {
  try {
    console.log('Starting user login for:', username);
    
    // Use secure RPC function for login
    const { data, error } = await supabase
      .rpc('login_with_visual_password', {
        p_username: username,
        p_clicks: passwordClicks as any
      })
      .single();

    if (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }

    if (!data) {
      return { success: false, error: 'Invalid username or click pattern' };
    }

    // Store session in localStorage
    localStorage.setItem('auth_token', data.session_token);
    localStorage.setItem('user_id', data.user_id);

    console.log('User login successful:', data.user_id);
    return { 
      success: true, 
      user: {
        id: data.user_id,
        username: data.username,
        created_at: data.created_at,
        last_login: data.last_login,
        profile_image_url: data.profile_image_url
      },
      sessionToken: data.session_token
    };

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed. Please check your connection and try again.' };
  }
};

/**
 * Update user profile image
 */
export const updateUserProfileImage = async (userId: string, imageUrl: string | null): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ profile_image_url: imageUrl })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile image:', error);
      return { success: false, error: 'Failed to update profile image' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Profile image update error:', error);
    return { success: false, error: 'Failed to update profile image' };
  }
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

    // Get user data using secure RPC
    const { data: user } = await supabase
      .rpc('get_user_public', { p_user_id: userId })
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
        last_login: user.last_login,
        profile_image_url: user.profile_image_url
      }
    };

  } catch (error) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    return { isAuthenticated: false };
  }
};
