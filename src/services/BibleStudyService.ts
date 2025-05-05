
// This file contains functions for interacting with Bible studies data
import { supabase } from '@/integrations/supabase/client';
import { BibleStudy, UserStudyProgress } from '@/types/bible.types';

/**
 * Get all available Bible studies
 */
export async function getAllBibleStudies(): Promise<BibleStudy[]> {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Type casting to match our expected BibleStudy interface
    return (data || []) as unknown as BibleStudy[];
  } catch (error) {
    console.error('Error fetching Bible studies:', error);
    return [];
  }
}

/**
 * Get a specific Bible study by ID
 */
export async function getBibleStudyById(studyId: string): Promise<BibleStudy | null> {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .eq('id', studyId)
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
 * Search for Bible studies by query
 */
export async function searchBibleStudies(query: string): Promise<BibleStudy[]> {
  if (!query.trim()) return [];

  try {
    // Search in both title and content
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .or(`title.en.ilike.%${query}%,title.pt.ilike.%${query}%,content.content.en.ilike.%${query}%,content.content.pt.ilike.%${query}%`)
      
    if (error) throw error;
    
    // Type casting to match our expected BibleStudy interface
    return (data || []) as unknown as BibleStudy[];
  } catch (error) {
    console.error('Error searching Bible studies:', error);
    return [];
  }
}

/**
 * Get user's progress on Bible studies
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
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user study progress:', error);
    return [];
  }
}

/**
 * Mark a Bible study as completed (renamed from markStudyCompleted to completeStudy)
 */
export async function completeStudy(studyId: string): Promise<boolean> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return false;
    
    // Get the study details
    const study = await getBibleStudyById(studyId);
    if (!study) return false;
    
    // Check if this study is already completed
    const { data: existing } = await supabase
      .from('user_study_progress')
      .select('id')
      .eq('user_id', session.session.user.id)
      .eq('study_id', studyId)
      .single();
      
    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from('user_study_progress')
        .update({
          completed_at: new Date().toISOString(),
          points_earned: study.points || 10
        })
        .eq('id', existing.id);
        
      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from('user_study_progress')
        .insert({
          user_id: session.session.user.id,
          study_id: studyId,
          completed_at: new Date().toISOString(),
          points_earned: study.points || 10
        });
        
      if (error) throw error;
    }
    
    // Update the user's experience points
    await updateUserExperiencePoints(study.points || 10);
    
    return true;
  } catch (error) {
    console.error('Error marking study as completed:', error);
    return false;
  }
}

/**
 * Update user's experience points
 */
async function updateUserExperiencePoints(points: number): Promise<void> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;
    
    // Get current user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('experience_points')
      .eq('id', session.session.user.id)
      .single();
      
    if (!profile) return;
    
    // Update profile with new points
    await supabase
      .from('user_profiles')
      .update({
        experience_points: (profile.experience_points || 0) + points
      })
      .eq('id', session.session.user.id);
  } catch (error) {
    console.error('Error updating user experience points:', error);
  }
}

/**
 * Helper function to get localized study content
 */
export function getLocalizedStudyContent(study: BibleStudy, language: string = 'en'): string {
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
      study.content.content && 
      typeof study.content.content === 'object') {
    // Add null checks using optional chaining
    return study.content.content?.[language] || study.content.content?.['en'] || '';
  }
  
  return '';
}
