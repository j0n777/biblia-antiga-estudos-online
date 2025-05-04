
import { supabase } from '@/integrations/supabase/client';
import { BibleStudy, UserStudyProgress } from '@/types/bible.types';
import { getUserProfile, updateUserProfile } from './AchievementService';

/**
 * Fetches all available Bible studies
 * @param language Language code for the content (defaults to 'en')
 * @returns Array of Bible studies
 */
export const getAllBibleStudies = async (language = 'en'): Promise<BibleStudy[]> => {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .order('category', { ascending: true })
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching Bible studies:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllBibleStudies:', error);
    return [];
  }
};

/**
 * Fetches a specific Bible study by ID
 * @param id Bible study ID
 * @returns Bible study object or null if not found
 */
export const getBibleStudyById = async (id: string): Promise<BibleStudy | null> => {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching Bible study:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getBibleStudyById:', error);
    return null;
  }
};

/**
 * Marks a Bible study as completed by the current user
 * @param studyId Bible study ID
 * @returns True if successful, false otherwise
 */
export const completeStudy = async (studyId: string): Promise<boolean> => {
  try {
    const user = supabase.auth.getUser();
    if (!user) return false;
    
    const { data: study } = await supabase
      .from('bible_studies')
      .select('points')
      .eq('id', studyId)
      .single();
    
    if (!study) return false;
    
    // Record study completion
    const { error } = await supabase
      .from('user_study_progress')
      .insert({
        study_id: studyId,
        points_earned: study.points
      });
    
    if (error) {
      console.error('Error recording study completion:', error);
      return false;
    }
    
    // Update user's experience points
    const profile = await getUserProfile();
    if (profile) {
      const newPoints = (profile.experience_points || 0) + study.points;
      await updateUserProfile({ experience_points: newPoints });
    }
    
    return true;
  } catch (error) {
    console.error('Error in completeStudy:', error);
    return false;
  }
};

/**
 * Retrieves completed studies for the current user
 * @returns Array of completed study progress objects
 */
export const getUserCompletedStudies = async (): Promise<UserStudyProgress[]> => {
  try {
    const { data, error } = await supabase
      .from('user_study_progress')
      .select('*')
      .order('completed_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching completed studies:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserCompletedStudies:', error);
    return [];
  }
};

/**
 * Checks if a user has completed a specific study
 * @param studyId Bible study ID
 * @returns True if completed, false otherwise
 */
export const hasCompletedStudy = async (studyId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_study_progress')
      .select('id')
      .eq('study_id', studyId)
      .limit(1);
    
    if (error) {
      console.error('Error checking study completion:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error in hasCompletedStudy:', error);
    return false;
  }
};

/**
 * Fetches saved verses for the current user
 * @param limit Maximum number of verses to fetch (optional)
 * @returns Array of saved verses
 */
export const getSavedVerses = async (limit?: number): Promise<any[]> => {
  try {
    let query = supabase
      .from('saved_verses')
      .select('*')
      .order('saved_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching saved verses:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getSavedVerses:', error);
    return [];
  }
};

/**
 * Saves a verse for the current user
 * @param bookId Bible book ID
 * @param chapterNumber Chapter number
 * @param verseNumber Verse number
 * @param versionId Bible version ID
 * @param note Optional note for the verse
 * @param highlightColor Optional highlight color
 * @returns True if successful, false otherwise
 */
export const saveVerse = async (
  bookId: string,
  chapterNumber: number,
  verseNumber: number,
  versionId: string,
  note?: string,
  highlightColor = 'yellow'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('saved_verses')
      .insert({
        book_id: bookId,
        chapter_number: chapterNumber,
        verse_number: verseNumber,
        version_id: versionId,
        note,
        highlight_color: highlightColor
      });
    
    if (error) {
      console.error('Error saving verse:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveVerse:', error);
    return false;
  }
};
