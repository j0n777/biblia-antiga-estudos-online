
import { supabase } from '@/integrations/supabase/client';
import { LeaderboardEntry } from '@/types/bible.types';

/**
 * Get leaderboard entries
 * @param limit Number of entries to return
 * @returns Promise resolving to leaderboard entries
 */
export async function getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
  try {
    // For authenticated users, get from database
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, display_name, nickname, experience_points, streak_count, avatar_url')
      .order('experience_points', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
    
    // Add rank to each entry
    const rankedEntries: LeaderboardEntry[] = data.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
    
    return rankedEntries;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

/**
 * Get user's rank on the leaderboard
 * @param userId User ID
 * @returns Promise resolving to user's rank or null if not found
 */
export async function getUserRank(userId: string): Promise<number | null> {
  try {
    // Get user's points
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('experience_points')
      .eq('id', userId)
      .single();
      
    if (userError || !userData) {
      console.error('Error getting user data:', userError);
      return null;
    }
    
    // Count users with more points
    const { count, error: countError } = await supabase
      .from('user_profiles')
      .select('id', { count: 'exact' })
      .gt('experience_points', userData.experience_points);
      
    if (countError) {
      console.error('Error counting users:', countError);
      return null;
    }
    
    // Rank is count + 1
    return (count || 0) + 1;
  } catch (error) {
    console.error('Error getting user rank:', error);
    return null;
  }
}
