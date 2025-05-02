import { supabase } from '@/integrations/supabase/client';
import { Achievement, DailyChallenge, UserProfile, LeaderboardEntry } from '../types/bible.types';
import { toast } from '@/hooks/use-toast';
import { saveReadingPosition } from './ReadingService';

// Get user achievements
export const getUserAchievements = async (): Promise<Achievement[]> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    return [];
  }

  // Since we can't directly query user_achievements from the current types,
  // let's use a raw query approach
  const { data, error } = await supabase
    .from('user_profiles')
    .select(`*`)
    .eq('id', session.session.user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return [];
  }

  // For now, return mock achievements until the database schema is properly set up
  return [
    {
      id: '1',
      name: 'Leitor Iniciante',
      description: '7 dias consecutivos de leitura',
      icon: '🔥',
      points: 50,
      category: 'streak',
      unlocked: data.streak_count >= 7,
      progress: data.streak_count,
      maxProgress: 7,
      unlockedAt: data.streak_count >= 7 ? new Date() : undefined,
    },
    {
      id: '2',
      name: '100 Versículos',
      description: 'Você leu 100 versículos',
      icon: '📊',
      points: 20,
      category: 'milestone',
      unlocked: false,
      progress: 0,
      maxProgress: 100,
    }
  ];
};

// Get daily challenges
export const getDailyChallenges = async (): Promise<DailyChallenge[]> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    return [];
  }

  // Returning mock challenges until the database tables are properly set up
  return [
    {
      id: '1',
      name: 'Sabedoria Diária',
      description: 'Leia um capítulo de Provérbios',
      icon: '📖',
      points: 10,
      book_category: 'wisdom',
      chapters_required: 1,
      progress: 0,
      completed: false
    },
    {
      id: '2',
      name: 'Louvor Diário',
      description: 'Leia um capítulo de Salmos',
      icon: '🙏',
      points: 10,
      book_category: 'psalms',
      chapters_required: 1,
      progress: 0,
      completed: false
    }
  ];
};

// Track reading progress
export const trackReading = async (
  versionId: string, 
  bookId: string, 
  chapterNumber: number, 
  verseNumber: number
): Promise<void> => {
  // First, save the reading position in localStorage
  saveReadingPosition(versionId, bookId, chapterNumber, verseNumber);
  
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    return;
  }
  
  // For now, just update the streak data in user_profiles
  try {
    // Update streak
    await updateUserStreak();
  } catch (error) {
    console.error('Error tracking reading progress:', error);
  }
};

// Function to update user streak
const updateUserStreak = async (): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) return;
  
  const userId = session.session.user.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  try {
    // Get user profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('streak_count, last_streak_date')
      .eq('id', userId)
      .single();
    
    if (!userProfile) return;
    
    let newStreakCount = userProfile.streak_count || 0;
    const lastDate = userProfile.last_streak_date ? new Date(userProfile.last_streak_date) : null;
    
    // Check if we need to update streak
    if (!lastDate) {
      // First time reading
      newStreakCount = 1;
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastDateNoTime = new Date(lastDate);
      lastDateNoTime.setHours(0, 0, 0, 0);
      
      if (lastDateNoTime.getTime() === yesterday.getTime()) {
        // Reading on consecutive day
        newStreakCount += 1;
      } else if (lastDateNoTime.getTime() < yesterday.getTime()) {
        // Streak broken
        newStreakCount = 1;
      }
      // If already read today, keep streak the same
    }
    
    // Update profile
    await supabase
      .from('user_profiles')
      .update({ 
        streak_count: newStreakCount, 
        last_streak_date: today.toISOString().split('T')[0] 
      })
      .eq('id', userId);
      
    // Check for streak achievements
    if (newStreakCount === 7 || newStreakCount === 30 || 
        newStreakCount === 90 || newStreakCount === 365) {
      // Notify user about streak milestone
      toast({
        title: "🎉 Nova Conquista de Streak!",
        description: `Você conseguiu uma sequência de ${newStreakCount} dias de leitura!`,
      });
    }
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};

// Get user profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.session.user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return {
    ...data,
    last_streak_date: data.last_streak_date ? new Date(data.last_streak_date) : undefined
  };
};

// Get leaderboard
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  // Return empty array for now until the database schema is set up
  return [];
};

// Update user profile
export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<boolean> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    return false;
  }

  const { error } = await supabase
    .from('user_profiles')
    .update(profile)
    .eq('id', session.session.user.id);

  if (error) {
    console.error('Error updating user profile:', error);
    return false;
  }

  return true;
};
