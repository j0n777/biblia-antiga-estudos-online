
import { supabase } from '@/integrations/supabase/client';

/**
 * Complete a Bible study
 * @param studyId Bible study ID
 * @returns Promise resolving to boolean indicating success
 */
export async function completeStudy(studyId: string): Promise<boolean> {
  try {
    // First check if the user has already completed this study
    const userId = await getCurrentUserId();
    const { data: existingData } = await supabase
      .from('user_study_progress')
      .select('*')
      .eq('study_id', studyId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (existingData) {
      console.log('Study already completed');
      return true;
    }
    
    // If not, mark as complete
    const { error } = await supabase
      .from('user_study_progress')
      .insert({
        study_id: studyId,
        user_id: userId,
        completed_at: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Error completing study:', error);
      return false;
    }
    
    // Update user points
    const { data: studyData } = await supabase
      .from('bible_studies')
      .select('points')
      .eq('id', studyId)
      .single();
    
    if (studyData?.points) {
      await updateUserPoints(studyData.points);
    }
    
    return true;
  } catch (error) {
    console.error('Error completing study:', error);
    return false;
  }
}

/**
 * Get all completed studies for the current user
 * @returns Promise resolving to array of completed study IDs
 */
export async function getCompletedStudies(): Promise<string[]> {
  try {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('user_study_progress')
      .select('study_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return (data || []).map(item => item.study_id);
  } catch (error) {
    console.error('Error getting completed studies:', error);
    return [];
  }
}

/**
 * Get current user ID
 * @returns Promise resolving to user ID
 */
async function getCurrentUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  
  if (data.session?.user?.id) {
    return data.session.user.id;
  }
  
  // For non-authenticated users, use a guest ID stored in localStorage
  const guestId = localStorage.getItem('guestId') || `guest-${Date.now()}`;
  localStorage.setItem('guestId', guestId);
  
  return guestId;
}

/**
 * Update user points
 * @param points Points to add
 * @returns Promise resolving to boolean indicating success
 */
async function updateUserPoints(points: number): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    
    // Check if user exists in profile
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('experience_points, id')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileData) {
      // Update existing points
      const { error } = await supabase
        .from('user_profiles')
        .update({
          experience_points: (profileData.experience_points || 0) + points,
        })
        .eq('id', userId);
      
      if (error) throw error;
    } else {
      // Create new profile with initial points
      // Fix: Use correct schema for user_profiles table (id instead of user_id)
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId, // Use id instead of user_id
          experience_points: points,
        });
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user points:', error);
    return false;
  }
}
