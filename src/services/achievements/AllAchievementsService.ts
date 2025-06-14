
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/types/bible.types';

/**
 * Get all available achievements with user progress
 */
export async function getAllAvailableAchievements(): Promise<Achievement[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    // Get all achievements from the database
    const { data: achievementsData, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .order('category', { ascending: true })
      .order('points', { ascending: true });

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
      return [];
    }

    if (!userId) {
      // For guest users, return all achievements with default progress
      return achievementsData.map(achievement => ({
        ...achievement,
        category: achievement.category as 'book' | 'streak' | 'milestone' | 'special',
        requirement_type: achievement.requirement_type as 'book_completion' | 'streak_days' | 'chapters_read' | 'verses_saved',
        progress: 0,
        total: parseInt(achievement.requirement_value || '1') || 1,
        maxProgress: parseInt(achievement.requirement_value || '1') || 1,
        unlocked: false,
        earned: false,
        is_completed: false,
        earned_at: null,
        unlockedAt: null
      }));
    }

    // For authenticated users, get user progress for each achievement
    const { data: userProgressData, error: progressError } = await supabase
      .from('user_achievements')
      .select('achievement_id, progress, is_completed, earned_at')
      .eq('user_id', userId);

    if (progressError) {
      console.error('Error fetching user progress:', progressError);
    }

    // Create a lookup for user progress
    const progressLookup = (userProgressData || []).reduce((acc, progress) => {
      acc[progress.achievement_id] = progress;
      return acc;
    }, {} as Record<string, any>);

    // Transform data to match Achievement interface
    return achievementsData.map(achievement => {
      const userProgress = progressLookup[achievement.id];
      
      return {
        ...achievement,
        category: achievement.category as 'book' | 'streak' | 'milestone' | 'special',
        requirement_type: achievement.requirement_type as 'book_completion' | 'streak_days' | 'chapters_read' | 'verses_saved',
        progress: userProgress?.progress || 0,
        total: parseInt(achievement.requirement_value || '1') || 1,
        maxProgress: parseInt(achievement.requirement_value || '1') || 1,
        unlocked: userProgress?.is_completed || false,
        earned: userProgress?.is_completed || false,
        is_completed: userProgress?.is_completed || false,
        earned_at: userProgress?.earned_at,
        unlockedAt: userProgress?.earned_at
      };
    });
    
  } catch (error) {
    console.error('Error getting all available achievements:', error);
    return [];
  }
}
