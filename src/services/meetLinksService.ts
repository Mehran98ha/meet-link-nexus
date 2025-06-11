
import { supabase } from '@/integrations/supabase/client';

export interface MeetLink {
  id: string;
  url: string;
  name: string;
  creator: string;
  creator_id: string;
  notes: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface CreateMeetLinkData {
  url: string;
  name: string;
  creator: string;
  notes?: string;
}

export interface UpdateMeetLinkData {
  url?: string;
  name?: string;
  notes?: string;
}

/**
 * Get current user ID from localStorage
 */
const getCurrentUserId = (): string | null => {
  return localStorage.getItem('user_id');
};

/**
 * Fetch all meet links
 */
export const fetchMeetLinks = async (): Promise<MeetLink[]> => {
  const { data, error } = await supabase
    .from('meet_links')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch meet links: ${error.message}`);
  }

  return data || [];
};

/**
 * Create a new meet link
 */
export const createMeetLink = async (linkData: CreateMeetLinkData): Promise<MeetLink> => {
  const userId = getCurrentUserId();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('meet_links')
    .insert([{
      ...linkData,
      creator_id: userId,
      user_id: userId,
      notes: linkData.notes || ''
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create meet link: ${error.message}`);
  }

  return data;
};

/**
 * Update a meet link (creator only)
 */
export const updateMeetLink = async (id: string, updates: UpdateMeetLinkData): Promise<MeetLink> => {
  const userId = getCurrentUserId();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('meet_links')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('❌ You are not authorized to edit this link. Only the creator can modify it.');
    }
    throw new Error(`Failed to update meet link: ${error.message}`);
  }

  return data;
};

/**
 * Delete a meet link (creator only)
 */
export const deleteMeetLink = async (id: string): Promise<void> => {
  const userId = getCurrentUserId();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  const { error } = await supabase
    .from('meet_links')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('❌ You are not authorized to delete this link. Only the creator can remove it.');
    }
    throw new Error(`Failed to delete meet link: ${error.message}`);
  }
};

/**
 * Check if current user can edit a link
 */
export const canEditLink = (link: MeetLink): boolean => {
  const currentUserId = getCurrentUserId();
  return link.user_id === currentUserId || link.creator_id === currentUserId;
};
