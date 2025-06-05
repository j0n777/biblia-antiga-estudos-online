
import { supabase } from '@/integrations/supabase/client';
import { Achievement, UserAchievement, ReadingSession } from '@/types/bible.types';
import { getUserProfile } from './ProfileService';

/**
 * Get all available achievements from database
 */
export async function getAllAchievements(): Promise<Achievement[]> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('category', { ascending: true })
      .order('points', { ascending: true });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return (data || []).map(item => ({
      ...item,
      category: item.category as 'book' | 'streak' | 'milestone' | 'special',
      requirement_type: item.requirement_type as 'book_completion' | 'streak_days' | 'chapters_read' | 'verses_saved'
    }));
  } catch (error) {
    console.error('Error in getAllAchievements:', error);
    return [];
  }
}

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

/**
 * Track reading session and update achievements
 */
export async function trackReadingSession(bookId: string, chapterNumber: number, versesRead: number = 1): Promise<void> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) return;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Insert or update reading session for today
    const { error: sessionError } = await supabase
      .from('reading_sessions')
      .upsert({
        user_id: userId,
        session_date: today,
        chapters_read: 1,
        verses_read: versesRead,
        reading_time_minutes: 5, // Estimate 5 minutes per chapter
        xp_earned: 1
      }, {
        onConflict: 'user_id,session_date'
      });

    if (sessionError) {
      console.error('Error tracking reading session:', sessionError);
      return;
    }

    // Update user streak and XP using database function
    const { error: streakError } = await supabase.rpc('update_user_streak_and_xp', {
      user_uuid: userId
    });

    if (streakError) {
      console.error('Error updating streak and XP:', streakError);
    }

    // Check and award achievements
    const { error: achievementError } = await supabase.rpc('check_and_award_achievements', {
      user_uuid: userId
    });

    if (achievementError) {
      console.error('Error checking achievements:', achievementError);
    }

  } catch (error) {
    console.error('Error in trackReadingSession:', error);
  }
}

/**
 * Check if book is completed and award achievement
 */
export async function checkBookCompletion(bookId: string, versionId: string): Promise<void> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) return;

    // Get book info to check total chapters
    const { data: bookData, error: bookError } = await supabase
      .from('bible_books')
      .select('chapters_count')
      .eq('book_id', bookId)
      .eq('version_id', versionId)
      .single();

    if (bookError || !bookData) {
      console.error('Error fetching book data:', bookError);
      return;
    }

    // Check how many chapters user has read for this book
    const { data: historyData, error: historyError } = await supabase
      .from('reading_sessions')
      .select('chapters_read')
      .eq('user_id', userId);

    if (historyError) {
      console.error('Error fetching reading history:', historyError);
      return;
    }

    const totalChaptersRead = historyData?.reduce((sum, session) => sum + (session.chapters_read || 0), 0) || 0;

    // If user completed the book, record it
    if (totalChaptersRead >= bookData.chapters_count) {
      const { error: completionError } = await supabase
        .from('book_completions')
        .upsert({
          user_id: userId,
          book_id: bookId,
          version_id: versionId,
          chapters_completed: bookData.chapters_count
        }, {
          onConflict: 'user_id,book_id,version_id'
        });

      if (completionError) {
        console.error('Error recording book completion:', completionError);
      }
    }

  } catch (error) {
    console.error('Error in checkBookCompletion:', error);
  }
}

/**
 * Get user's current streak from database
 */
export async function getUserStreak(): Promise<{ current: number; longest: number }> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      return { current: 0, longest: 0 };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('current_streak, longest_streak')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user streak:', error);
      return { current: 0, longest: 0 };
    }

    return {
      current: data?.current_streak || 0,
      longest: data?.longest_streak || 0
    };

  } catch (error) {
    console.error('Error in getUserStreak:', error);
    return { current: 0, longest: 0 };
  }
}

/**
 * Mock achievements for guest users
 */
function getMockAchievements(): Achievement[] {
  return [
    {
      id: '1',
      name: 'first_chapter',
      title: 'Primeiro Capítulo',
      description: 'Leu seu primeiro capítulo',
      icon: '📚',
      category: 'milestone',
      points: 10,
      requirement_type: 'chapters_read',
      requirement_value: '1',
      progress: 0,
      total: 1,
      maxProgress: 1,
      unlocked: false,
      earned: false,
      is_completed: false
    },
    {
      id: '2',
      name: 'streak_7',
      title: 'Semana Sagrada',
      description: 'Leu por 7 dias consecutivos',
      icon: '🔥',
      category: 'streak',
      points: 50,
      requirement_type: 'streak_days',
      requirement_value: '7',
      progress: 0,
      total: 7,
      maxProgress: 7,
      unlocked: false,
      earned: false,
      is_completed: false
    }
  ];
}
