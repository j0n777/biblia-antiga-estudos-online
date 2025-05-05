
import { supabase } from '@/integrations/supabase/client';
import { DailyChallenge } from '@/types/bible.types';
import { getUserProfile } from '@/services/ProfileService';
import { updateUserProfile } from '@/services/ProfileService';

/**
 * Get daily challenges for the user
 * @returns Promise resolving to array of daily challenges
 */
export async function getDailyChallenges(): Promise<DailyChallenge[]> {
  try {
    const userProfile = await getUserProfile();
    
    if (!userProfile?.id) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('daily_challenges')
      .select('*')
      .gt('expires_at', new Date().toISOString()) // Only get unexpired challenges
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    // Get user completed challenges to mark them
    const { data: userChallenges, error: userError } = await supabase
      .from('user_challenge_progress')
      .select('*')
      .eq('user_id', userProfile.id);
      
    if (userError) {
      throw userError;
    }
    
    // Mark challenges as completed if the user has completed them
    const challenges = data.map((challenge) => {
      const completed = userChallenges?.some(
        (uc) => uc.challenge_id === challenge.id && uc.completed_at
      ) || false;
      
      // Calculate progress if available
      const userProgress = userChallenges?.find(
        (uc) => uc.challenge_id === challenge.id
      );
      
      const progress = userProgress?.progress || 0;
      
      return {
        ...challenge,
        completed,
        progress
      } as DailyChallenge;
    });
    
    return challenges;
  } catch (error) {
    console.error('Error getting daily challenges:', error);
    return [];
  }
}

/**
 * Mark a challenge as complete
 * @param challengeId Challenge ID
 * @param userId User ID (optional, will use current user if not provided)
 * @returns Promise resolving to true if successful
 */
export async function markChallengeComplete(challengeId: string, points: number = 10): Promise<boolean> {
  try {
    const userProfile = await getUserProfile();
    
    if (!userProfile?.id) {
      return false;
    }
    
    // Update or insert the challenge completion
    const { error } = await supabase
      .from('user_challenge_progress')
      .upsert({
        user_id: userProfile.id,
        challenge_id: challengeId,
        completed_at: new Date().toISOString(),
        progress: 100 // Full completion
      });
      
    if (error) {
      throw error;
    }
    
    // Award points to the user
    if (points > 0) {
      const currentXP = userProfile.experience_points || 0;
      await updateUserProfile({
        experience_points: currentXP + points
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error marking challenge complete:', error);
    return false;
  }
}

/**
 * Update challenge progress
 * @param challengeId Challenge ID
 * @param progress Progress amount (0-100)
 * @returns Promise resolving to true if successful
 */
export async function updateChallengeProgress(challengeId: string, progress: number): Promise<boolean> {
  try {
    const userProfile = await getUserProfile();
    
    if (!userProfile?.id) {
      return false;
    }
    
    // Ensure progress is between 0 and 100
    const validProgress = Math.max(0, Math.min(100, progress));
    
    // Get current progress
    const { data: currentData, error: fetchError } = await supabase
      .from('user_challenge_progress')
      .select('*')
      .eq('user_id', userProfile.id)
      .eq('challenge_id', challengeId)
      .maybeSingle();
      
    if (fetchError) {
      throw fetchError;
    }
    
    // Determine if this update completes the challenge
    const isCompleted = validProgress >= 100;
    const completedAt = isCompleted ? new Date().toISOString() : null;
    
    // Update or insert the challenge progress
    const { error } = await supabase
      .from('user_challenge_progress')
      .upsert({
        user_id: userProfile.id,
        challenge_id: challengeId,
        progress: validProgress,
        completed_at: completedAt
      });
      
    if (error) {
      throw error;
    }
    
    // If this update completes the challenge and it wasn't complete before, award points
    if (isCompleted && (!currentData || !currentData.completed_at)) {
      // Get the challenge to determine how many points to award
      const { data: challengeData } = await supabase
        .from('daily_challenges')
        .select('points')
        .eq('id', challengeId)
        .single();
        
      if (challengeData && challengeData.points) {
        const currentXP = userProfile.experience_points || 0;
        await updateUserProfile({
          experience_points: currentXP + challengeData.points
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    return false;
  }
}
