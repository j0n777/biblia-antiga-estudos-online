
import { supabase } from '@/integrations/supabase/client';
import { LeaderboardEntry } from '@/types/bible.types';

/**
 * Get XP leaderboard entries
 */
export async function getXPLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, display_name, nickname, total_xp, current_streak, avatar_url')
      .order('total_xp', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error getting XP leaderboard:', error);
      return [];
    }
    
    return data.map((entry, index) => ({
      id: entry.id,
      user_id: entry.id,
      display_name: entry.display_name || '',
      nickname: entry.nickname || '',
      avatar_url: entry.avatar_url || '',
      experience_points: entry.total_xp || 0,
      total_xp: entry.total_xp || 0,
      points: entry.total_xp || 0,
      current_streak: entry.current_streak || 0,
      streak_count: entry.current_streak || 0,
      rank: index + 1
    }));
  } catch (error) {
    console.error('Error getting XP leaderboard:', error);
    return [];
  }
}

/**
 * Get streak leaderboard entries
 */
export async function getStreakLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, display_name, nickname, current_streak, total_xp, avatar_url')
      .order('current_streak', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error getting streak leaderboard:', error);
      return [];
    }
    
    return data.map((entry, index) => ({
      id: entry.id,
      user_id: entry.id,
      display_name: entry.display_name || '',
      nickname: entry.nickname || '',
      avatar_url: entry.avatar_url || '',
      experience_points: entry.total_xp || 0,
      total_xp: entry.total_xp || 0,
      points: entry.current_streak || 0,
      current_streak: entry.current_streak || 0,
      streak_count: entry.current_streak || 0,
      rank: index + 1
    }));
  } catch (error) {
    console.error('Error getting streak leaderboard:', error);
    return [];
  }
}

/**
 * Get leaderboard entries (default XP leaderboard for backward compatibility)
 */
export async function getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
  return getXPLeaderboard(limit);
}

/**
 * Get user's rank on XP leaderboard
 */
export async function getUserXPRank(userId: string): Promise<number | null> {
  try {
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('total_xp')
      .eq('id', userId)
      .single();
      
    if (userError || !userData) {
      console.error('Error getting user data:', userError);
      return null;
    }
    
    const { count, error: countError } = await supabase
      .from('user_profiles')
      .select('id', { count: 'exact' })
      .gt('total_xp', userData.total_xp || 0);
      
    if (countError) {
      console.error('Error counting users:', countError);
      return null;
    }
    
    return (count || 0) + 1;
  } catch (error) {
    console.error('Error getting user XP rank:', error);
    return null;
  }
}

/**
 * Get user's rank on streak leaderboard
 */
export async function getUserStreakRank(userId: string): Promise<number | null> {
  try {
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('current_streak')
      .eq('id', userId)
      .single();
      
    if (userError || !userData) {
      console.error('Error getting user data:', userError);
      return null;
    }
    
    const { count, error: countError } = await supabase
      .from('user_profiles')
      .select('id', { count: 'exact' })
      .gt('current_streak', userData.current_streak || 0);
      
    if (countError) {
      console.error('Error counting users:', countError);
      return null;
    }
    
    return (count || 0) + 1;
  } catch (error) {
    console.error('Error getting user streak rank:', error);
    return null;
  }
}

/**
 * Get user's rank (default XP rank for backward compatibility)
 */
export async function getUserRank(userId: string): Promise<number | null> {
  return getUserXPRank(userId);
}
