
import { supabase } from '@/integrations/supabase/client';
import { BibleStudy } from '@/types/bible.types';

/**
 * Get user's completed studies
 * @returns Promise resolving to array of study IDs that the user has completed
 */
export async function getCompletedStudies(): Promise<string[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      // User not logged in, get from localStorage
      const completedStudies = localStorage.getItem('completed_studies');
      if (!completedStudies) return [];
      
      return JSON.parse(completedStudies);
    }
    
    // User is logged in, get from database
    const { data, error } = await supabase
      .from('user_bible_studies')
      .select('study_id')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching completed studies:', error);
      return [];
    }
    
    return data.map(item => item.study_id);
  } catch (error) {
    console.error('Error getting completed studies:', error);
    return [];
  }
}

/**
 * Get user's study progress
 * @returns Promise resolving to array of BibleStudy objects with completion status
 */
export async function getUserStudyProgress(): Promise<BibleStudy[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      // User not logged in
      return [];
    }
    
    // Join bible_studies with user_bible_studies to get completion status
    const { data, error } = await supabase
      .from('bible_studies')
      .select(`
        *,
        user_bible_studies!inner(
          completed_at,
          user_id
        )
      `)
      .eq('user_bible_studies.user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user study progress:', error);
      return [];
    }
    
    return data as unknown as BibleStudy[];
  } catch (error) {
    console.error('Error getting user study progress:', error);
    return [];
  }
}

/**
 * Mark a study as completed for the user
 * @param studyId Study ID
 * @returns Promise resolving to success status
 */
export async function completeStudy(studyId: string): Promise<boolean> {
  try {
    console.log(`Completing study: ${studyId}`);
    
    // Get the study to determine points
    const { data: studyData, error: studyError } = await supabase
      .from('bible_studies')
      .select('points')
      .eq('id', studyId)
      .single();
      
    if (studyError) {
      console.error('Error fetching study:', studyError);
      return false;
    }
    
    const points = studyData.points || 5;
    
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.log('User not authenticated, storing in localStorage');
      
      // Store in localStorage for non-authenticated users
      const completedStudies = JSON.parse(localStorage.getItem('completed_studies') || '[]');
      
      // Check if study is already completed
      if (!completedStudies.includes(studyId)) {
        completedStudies.push(studyId);
        localStorage.setItem('completed_studies', JSON.stringify(completedStudies));
      }
      
      return true;
    }
    
    const userId = session.session.user.id;
    
    // Insert completion record
    const { error: insertError } = await supabase
      .from('user_bible_studies')
      .upsert({
        user_id: userId,
        study_id: studyId,
        completed_at: new Date().toISOString()
      });
      
    if (insertError) throw insertError;
    
    // Update user XP
    const { error: updateError } = await supabase.rpc('increment_user_points', { 
      points_increment: points 
    });
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error completing study:', error);
    return false;
  }
}
