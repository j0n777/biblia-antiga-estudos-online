import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/bible.types';

/**
 * Get user profile
 * @returns Promise resolving to user profile or null
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.log('User not authenticated, getting from localStorage');
      
      // Get from localStorage for non-authenticated users
      const profile = localStorage.getItem('user_profile');
      if (!profile) {
        // Create default profile for first-time users
        const defaultProfile: UserProfile = {
          id: 'guest-' + new Date().getTime(),
          display_name: 'Visitante',
          nickname: 'guest',
          experience_points: 0,
          streak_count: 0,
          streak_record: 0,
          last_streak_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          font_size: 'medium',
          reading_position: null
        };
        
        localStorage.setItem('user_profile', JSON.stringify(defaultProfile));
        return defaultProfile;
      }
      
      return JSON.parse(profile) as UserProfile;
    }
    
    // For authenticated users, get profile from database
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.session.user.id)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return createGuestProfile();
    }
    
    if (!data) {
      console.log('No profile found for user, creating a new one');
      return await createNewUserProfile(session.session.user.id);
    }
    
    // Transform database data to UserProfile type
    // Adding default values for properties that might be missing from database
    return {
      ...data,
      streak_record: data.streak_record || 0,
      reading_position: data.reading_position || null
    } as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Create a guest profile
 * @returns Guest profile
 */
const createGuestProfile = (): UserProfile => {
  const defaultProfile: UserProfile = {
    id: 'guest-' + new Date().getTime(),
    display_name: 'Visitante',
    nickname: 'guest',
    experience_points: 0,
    streak_count: 0,
    streak_record: 0,
    last_streak_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    font_size: 'medium',
    reading_position: null
  };
  
  return defaultProfile;
};

/**
 * Create a new user profile
 * @param userId User ID
 * @returns New user profile
 */
const createNewUserProfile = async (userId: string): Promise<UserProfile> => {
  const newProfile: UserProfile = {
    id: userId,
    user_id: userId,
    display_name: userId,
    nickname: userId,
    experience_points: 0,
    streak_count: 0,
    streak_record: 0,
    last_streak_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    font_size: 'medium',
    reading_position: null
  };
  
  await supabase
    .from('user_profiles')
    .insert(newProfile);
    
  return newProfile;
};

/**
 * Update user profile
 * @param updates Partial user profile with fields to update
 * @returns Promise resolving to success status
 */
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<boolean> {
  try {
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    // For non-authenticated users, update localStorage
    if (!session?.session?.user) {
      console.log('User not authenticated, updating localStorage');
      
      const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      
      return true;
    }

    if (!updates.id) {
      updates.id = session.session.user.id;
    }
    
    // For authenticated users, update in database
    const { error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.session.user.id);
      
    if (error) {
      throw new Error(`Profile update error: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}
