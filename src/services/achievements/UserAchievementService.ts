
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/types/bible.types';
import { getMockAchievements } from './MockAchievementService';

/**
 * Get user's achievements with progress
 */
export async function getUserAchievements(): Promise<Achievement[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      // Return mock achievements for guest users
      return getMockAchievements();
    }

    // Get all achievements with user progress
    const { data: achievementsData, error: achievementsError } = await supabase
      .from('achievements')
      .select(`
        *,
        user_achievements!left(
          progress,
          is_completed,
          earned_at
        )
      `)
      .order('category', { ascending: true })
      .order('points', { ascending: true });

    if (achievementsError) {
      console.error('Error fetching user achievements:', achievementsError);
      return [];
    }

    // Transform data to match Achievement interface
    return achievementsData.map(achievement => ({
      ...achievement,
      category: achievement.category as 'book' | 'streak' | 'milestone' | 'special',
      requirement_type: achievement.requirement_type as 'book_completion' | 'streak_days' | 'chapters_read' | 'verses_saved',
      progress: achievement.user_achievements?.[0]?.progress || 0,
      total: parseInt(achievement.requirement_value || '1') || 1,
      maxProgress: parseInt(achievement.requirement_value || '1') || 1,
      unlocked: achievement.user_achievements?.[0]?.is_completed || false,
      earned: achievement.user_achievements?.[0]?.is_completed || false,
      is_completed: achievement.user_achievements?.[0]?.is_completed || false,
      earned_at: achievement.user_achievements?.[0]?.earned_at,
      unlockedAt: achievement.user_achievements?.[0]?.earned_at
    }));
    
  } catch (error) {
    console.error('Error getting user achievements:', error);
    return [];
  }
}
