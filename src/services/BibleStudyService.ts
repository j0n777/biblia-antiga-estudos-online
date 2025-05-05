
import { supabase } from '@/integrations/supabase/client';
import { BibleStudy, UserStudyProgress } from '@/types/bible.types';

/**
 * Get all Bible studies
 * @returns Promise resolving to array of BibleStudy objects
 */
export async function getAllBibleStudies(): Promise<BibleStudy[]> {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    // Type casting to match our expected BibleStudy interface
    return (data || []) as unknown as BibleStudy[];
  } catch (error) {
    console.error('Error fetching Bible studies:', error);
    return [];
  }
}

/**
 * Get a Bible study by ID
 * @param id Bible study ID
 * @returns Promise resolving to BibleStudy object or null if not found
 */
export async function getBibleStudyById(id: string): Promise<BibleStudy | null> {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Type casting to match our expected BibleStudy interface
    return data as unknown as BibleStudy;
  } catch (error) {
    console.error('Error fetching Bible study:', error);
    return null;
  }
}

/**
 * Search Bible studies
 * @param query Search query
 * @returns Promise resolving to array of BibleStudy objects
 */
export async function searchBibleStudies(query: string): Promise<BibleStudy[]> {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    // Type casting to match our expected BibleStudy interface
    return (data || []) as unknown as BibleStudy[];
  } catch (error) {
    console.error('Error searching Bible studies:', error);
    return [];
  }
}

/**
 * Get completed Bible studies for the current user
 * @returns Promise resolving to array of study IDs that have been completed
 */
export async function getCompletedStudies(): Promise<string[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return [];
    
    const { data, error } = await supabase
      .from('user_study_progress')
      .select('study_id')
      .eq('user_id', session.session.user.id);
      
    if (error) throw error;
    
    return data?.map(p => p.study_id) || [];
  } catch (error) {
    console.error('Error fetching completed studies:', error);
    return [];
  }
}

/**
 * Get progress for user's studies
 * @returns Promise resolving to array of UserStudyProgress objects
 */
export async function getUserStudyProgress(): Promise<UserStudyProgress[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return [];
    
    const { data, error } = await supabase
      .from('user_study_progress')
      .select('*')
      .eq('user_id', session.session.user.id);
      
    if (error) throw error;
    
    return data as UserStudyProgress[];
  } catch (error) {
    console.error('Error fetching user study progress:', error);
    return [];
  }
}

/**
 * Mark a Bible study as completed
 * @param studyId Bible study ID to mark as completed
 * @returns Promise resolving to boolean indicating success
 */
export async function completeStudy(studyId: string): Promise<boolean> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return false;
    
    // Get study to get points information
    const { data: studyData, error: studyError } = await supabase
      .from('bible_studies')
      .select('points')
      .eq('id', studyId)
      .single();
    
    if (studyError) throw studyError;
    
    const points = studyData?.points || 10;
    
    // Check if already completed
    const { data: existingProgress, error: checkError } = await supabase
      .from('user_study_progress')
      .select('id')
      .eq('user_id', session.session.user.id)
      .eq('study_id', studyId);
      
    if (checkError) throw checkError;
    
    if (existingProgress && existingProgress.length > 0) {
      // Already completed
      return true;
    }
    
    // Insert progress record
    const { error: insertError } = await supabase
      .from('user_study_progress')
      .insert({
        user_id: session.session.user.id,
        study_id: studyId,
        points_earned: points
      });
      
    if (insertError) throw insertError;
    
    // Update user XP
    // Fix the type error by casting points to number or using a proper parameter
    const { error: updateError } = await supabase.rpc('increment', { 
      points: points // Make sure points is passed as a named parameter
    });
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error completing Bible study:', error);
    return false;
  }
}

/**
 * Check if a Bible study has been completed by the current user
 * @param studyId Bible study ID
 * @returns Promise resolving to boolean indicating completion status
 */
export async function isStudyCompleted(studyId: string): Promise<boolean> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return false;
    
    const { data, error } = await supabase
      .from('user_study_progress')
      .select('id')
      .eq('user_id', session.session.user.id)
      .eq('study_id', studyId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is expected if not completed
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking study completion status:', error);
    return false;
  }
}

/**
 * Get localized study content
 * Helper function to get properly localized content from a study
 * @param study Bible study object
 * @param language Language code
 * @returns Localized content string
 */
export function getStudyContent(study: BibleStudy, language: string = 'en'): string {
  if (!study || !study.content) return '';
  
  if (typeof study.content === 'string') {
    return study.content;
  }
  
  // If content is an object with direct language keys
  if (typeof study.content === 'object' && study.content[language]) {
    return study.content[language];
  }
  
  // If content has a content field which is language-specific
  if (typeof study.content === 'object' && 
      study.content.content) {
    // Safely check if content exists and is an object
    const contentObj = study.content.content;
    if (!contentObj) return '';
    
    // Use null check and typeof check for safety
    if (typeof contentObj === 'object') {
      return contentObj[language] || contentObj['en'] || '';
    }
    return '';
  }
  
  return '';
}
