
import { supabase } from '@/integrations/supabase/client';
import { UserStudyProgress } from '@/types/bible.types';

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
    // Fix the type error by using a properly typed parameter
    const { error: updateError } = await supabase.rpc('increment', { 
      points // Make sure this matches the expected parameter name in the RPC function
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
