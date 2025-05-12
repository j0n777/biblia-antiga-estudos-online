
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/bible.types';

/**
 * Get user profile
 * @returns Promise resolving to user profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session) {
      // Get guest profile from localStorage if not authenticated
      const guestProfile = localStorage.getItem('guestProfile');
      
      if (guestProfile) {
        return JSON.parse(guestProfile);
      }
      
      // Set system language as default
      const browserLang = navigator.language.toLowerCase().split('-')[0];
      let defaultVersion = 'kja';
      
      // Set default version based on browser language
      if (browserLang === 'en') {
        defaultVersion = 'kjv';
      } else if (browserLang === 'es') {
        defaultVersion = 'rvr';
      } else if (browserLang === 'fr') {
        defaultVersion = 'apee';
      } else if (browserLang === 'ar') {
        defaultVersion = 'svd';
      }
      
      // Create default guest profile
      const defaultProfile: UserProfile = {
        id: `guest-${Date.now()}`,
        display_name: 'Guest',
        nickname: 'Guest',
        experience_points: 0,
        streak_count: 0,
        streak_record: 0,
        last_streak_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        font_size: 'medium',
        reading_position: null,
        preferred_bible_version: defaultVersion,
        preferred_language: browserLang,
        daily_reading_goal: 15,
        has_completed_onboarding: false
      };
      
      // Save to localStorage
      localStorage.setItem('guestProfile', JSON.stringify(defaultProfile));
      return defaultProfile;
    }
    
    // Get user profile from database
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.session.user.id)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('User profile not found');
    }
    
    // Ensure all required properties exist with defaults if needed
    const profile: UserProfile = {
      id: data.id || session.session.user.id,
      display_name: data.display_name || '',
      nickname: data.nickname || '',
      experience_points: data.experience_points || 0,
      streak_count: data.streak_count || 0,
      streak_record: data.streak_count || 0, // Use streak_count as fallback for streak_record
      last_streak_date: data.last_streak_date,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      font_size: (data.font_size as 'small' | 'medium' | 'large') || 'medium',
      reading_position: data.reading_position || null,
      preferred_bible_version: data.preferred_bible_version || 'kja',
      preferred_language: data.preferred_language || navigator.language.toLowerCase().split('-')[0],
      daily_reading_goal: data.daily_reading_goal || 15,
      has_completed_onboarding: data.has_completed_onboarding || false,
      // Optional fields that may or may not be present in the database
      avatar_url: data.avatar_url,
      country: data.country,
      birth_year: data.birth_year,
      email: data.email,
      phone: data.phone,
      username: data.username
    };
    
    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    
    // Return default profile if there's an error
    const browserLang = navigator.language.toLowerCase().split('-')[0];
    let defaultVersion = 'kja';
    
    // Set default version based on browser language
    if (browserLang === 'en') {
      defaultVersion = 'kjv';
    } else if (browserLang === 'es') {
      defaultVersion = 'rvr';
    } else if (browserLang === 'fr') {
      defaultVersion = 'apee';
    } else if (browserLang === 'ar') {
      defaultVersion = 'svd';
    }
    
    const defaultProfile: UserProfile = {
      id: `guest-${Date.now()}`,
      display_name: 'Guest',
      nickname: 'Guest',
      experience_points: 0,
      streak_count: 0,
      streak_record: 0,
      last_streak_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      font_size: 'medium',
      reading_position: null,
      preferred_bible_version: defaultVersion,
      preferred_language: browserLang,
      daily_reading_goal: 15,
      has_completed_onboarding: false
    };
    
    return defaultProfile;
  }
}

/**
 * Update user profile
 * @param profile User profile data
 * @returns Promise resolving to success status
 */
export async function updateUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      console.warn('Cannot update profile: User not authenticated');
      
      // For guest users, update the localStorage profile
      const guestProfile = localStorage.getItem('guestProfile');
      if (guestProfile) {
        const updatedProfile = { ...JSON.parse(guestProfile), ...profile, updated_at: new Date().toISOString() };
        localStorage.setItem('guestProfile', JSON.stringify(updatedProfile));
        return true;
      }
      
      return false;
    }
    
    const { error } = await supabase
      .from('user_profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.session.user.id);
      
    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}
