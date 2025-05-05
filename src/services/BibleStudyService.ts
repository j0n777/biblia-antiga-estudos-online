
import { supabase } from '@/integrations/supabase/client';
import { BibleStudy, UserStudyProgress } from '@/types/bible.types';
import { getUserProfile, updateUserProfile } from '@/services';

/**
 * Fetches all available Bible studies
 * @returns Promise resolving to array of Bible studies
 */
export async function getAllBibleStudies(): Promise<BibleStudy[]> {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data as BibleStudy[];
  } catch (error) {
    console.error('Error fetching Bible studies:', error);
    return [];
  }
}

/**
 * Searches for Bible studies
 * @param query Search query
 * @returns Promise resolving to array of Bible studies
 */
export async function searchBibleStudies(query: string): Promise<BibleStudy[]> {
  try {
    if (!query || query.trim().length < 2) {
      return getAllBibleStudies(); // Return all studies when no query
    }
    
    // Since Bible studies might have complex JSON structure and textSearch might not work,
    // we'll do a simple SQL ILIKE search instead on title_key
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .ilike('title_key', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (error) {
      throw error;
    }
    
    return data as BibleStudy[];
  } catch (error) {
    console.error('Error searching Bible studies:', error);
    return [];
  }
}

/**
 * Gets a Bible study by ID
 * @param studyId Study ID
 * @returns Promise resolving to Bible study or null
 */
export async function getBibleStudy(studyId: string): Promise<BibleStudy | null> {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .eq('id', studyId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data as BibleStudy;
  } catch (error) {
    console.error('Error fetching Bible study:', error);
    return null;
  }
}

/**
 * Gets user's study progress
 * @returns Promise resolving to array of user study progress
 */
export async function getUserStudyProgress(): Promise<UserStudyProgress[]> {
  try {
    const profile = await getUserProfile();
    if (!profile?.id || profile.id.startsWith('guest-')) {
      // Guest user, return local storage data or empty array
      const storedProgress = localStorage.getItem('study_progress');
      return storedProgress ? JSON.parse(storedProgress) : [];
    }
    
    const { data, error } = await supabase
      .from('user_study_progress')
      .select('*')
      .eq('user_id', profile.id);
      
    if (error) {
      throw error;
    }
    
    return data as UserStudyProgress[];
  } catch (error) {
    console.error('Error fetching user study progress:', error);
    return [];
  }
}

/**
 * Marks a study as completed
 * @param studyId Study ID
 * @param points Points earned
 * @returns Promise resolving to true if successful
 */
export async function completeStudy(studyId: string, points: number = 10): Promise<boolean> {
  try {
    const profile = await getUserProfile();
    
    if (!profile?.id || profile.id.startsWith('guest-')) {
      // Guest user, save to local storage
      const storedProgress = JSON.parse(localStorage.getItem('study_progress') || '[]');
      const existingProgress = storedProgress.find((p: UserStudyProgress) => p.study_id === studyId);
      
      if (existingProgress) {
        // Update existing progress
        existingProgress.completed_at = new Date().toISOString();
        existingProgress.points_earned = points;
      } else {
        // Add new progress
        storedProgress.push({
          id: `local-${Date.now()}`,
          study_id: studyId,
          user_id: profile?.id || 'local',
          completed_at: new Date().toISOString(),
          points_earned: points
        });
      }
      
      localStorage.setItem('study_progress', JSON.stringify(storedProgress));
      
      // Update user XP
      const currentXP = profile.experience_points || 0;
      await updateUserProfile({
        experience_points: currentXP + points
      });
      
      return true;
    }
    
    // Authenticated user, save to database
    const { data, error } = await supabase
      .from('user_study_progress')
      .upsert({
        study_id: studyId,
        user_id: profile.id,
        completed_at: new Date().toISOString(),
        points_earned: points
      }, { onConflict: 'study_id,user_id' });
      
    if (error) {
      throw error;
    }
    
    // Update user XP
    const currentXP = profile.experience_points || 0;
    await updateUserProfile({
      experience_points: currentXP + points
    });
    
    return true;
  } catch (error) {
    console.error('Error completing study:', error);
    return false;
  }
}
