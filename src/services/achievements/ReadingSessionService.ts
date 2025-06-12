
import { supabase } from '@/integrations/supabase/client';

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
