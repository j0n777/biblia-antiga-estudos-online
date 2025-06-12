
import { supabase } from '@/integrations/supabase/client';

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
