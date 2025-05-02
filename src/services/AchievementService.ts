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

  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      id,
      progress,
      unlocked_at,
      achievements (
        id,
        name,
        description,
        icon,
        points,
        category,
        requirement_type,
        requirement_value
      )
    `)
    .eq('user_id', session.session.user.id);

  if (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }

  return data.map(item => ({
    id: item.achievements.id,
    name: item.achievements.name,
    description: item.achievements.description,
    icon: item.achievements.icon,
    points: item.achievements.points,
    category: item.achievements.category as Achievement['category'],
    unlocked: item.unlocked_at !== null,
    progress: item.progress || 0,
    maxProgress: item.achievements.requirement_value,
    unlockedAt: item.unlocked_at ? new Date(item.unlocked_at) : undefined,
  }));
};

// Get daily challenges
export const getDailyChallenges = async (): Promise<DailyChallenge[]> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    return [];
  }

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('user_daily_challenges')
    .select(`
      progress,
      completed,
      daily_challenges (
        id,
        name,
        description,
        icon,
        points,
        book_category,
        chapters_required
      )
    `)
    .eq('user_id', session.session.user.id)
    .eq('date', today);

  if (error) {
    console.error('Error fetching daily challenges:', error);
    return [];
  }

  return data.map(item => ({
    id: item.daily_challenges.id,
    name: item.daily_challenges.name,
    description: item.daily_challenges.description,
    icon: item.daily_challenges.icon,
    points: item.daily_challenges.points,
    book_category: item.daily_challenges.book_category,
    chapters_required: item.daily_challenges.chapters_required,
    progress: item.progress,
    completed: item.completed
  }));
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
  
  const today = new Date().toISOString().split('T')[0];
  const userId = session.session.user.id;
  
  try {
    // Record the verse read
    const { data: existingRecord, error: fetchError } = await supabase
      .from('user_reading_history')
      .select('id, verses_read')
      .eq('user_id', userId)
      .eq('date', today)
      .eq('version_id', versionId)
      .eq('book_id', bookId)
      .eq('chapter_number', chapterNumber)
      .maybeSingle();
      
    if (fetchError) {
      throw fetchError;
    }
    
    if (existingRecord) {
      // Update existing record if verse isn't already recorded
      if (!existingRecord.verses_read.includes(verseNumber)) {
        await supabase
          .from('user_reading_history')
          .update({ 
            verses_read: [...existingRecord.verses_read, verseNumber] 
          })
          .eq('id', existingRecord.id);
      }
    } else {
      // Create new record
      await supabase
        .from('user_reading_history')
        .insert({
          user_id: userId,
          version_id: versionId,
          book_id: bookId,
          chapter_number: chapterNumber,
          verses_read: [verseNumber]
        });
    }
    
    // Update streak
    await updateUserStreak();
    
    // Check for achievements
    await checkAchievements();
    
    // Update daily challenges
    await updateDailyChallenges(bookId, chapterNumber);
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
      checkStreakAchievement(newStreakCount);
    }
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};

const checkStreakAchievement = async (streakCount: number): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) return;
  
  const userId = session.session.user.id;
  
  try {
    // Find the achievement for this streak count
    const { data: achievements } = await supabase
      .from('achievements')
      .select('id, points')
      .eq('requirement_type', 'consecutive_days')
      .eq('requirement_value', streakCount)
      .single();
      
    if (!achievements) return;
    
    // Check if already unlocked
    const { data: userAchievement } = await supabase
      .from('user_achievements')
      .select('id, unlocked_at')
      .eq('user_id', userId)
      .eq('achievement_id', achievements.id)
      .maybeSingle();
      
    // Already unlocked
    if (userAchievement?.unlocked_at) return;
    
    // Unlock the achievement
    await supabase
      .from('user_achievements')
      .update({ 
        unlocked_at: new Date().toISOString(),
        progress: streakCount
      })
      .eq('user_id', userId)
      .eq('achievement_id', achievements.id);
      
    // Add points to user
    await supabase
      .from('user_profiles')
      .update({ 
        experience_points: supabase.rpc('increment', { 
          amount: achievements.points 
        })
      })
      .eq('id', userId);
      
    // Notify user
    toast({
      title: "🎉 Nova Conquista Desbloqueada!",
      description: `Você conseguiu uma sequência de ${streakCount} dias de leitura!`,
    });
  } catch (error) {
    console.error('Error checking streak achievement:', error);
  }
};

// Function to check for achievements
const checkAchievements = async (): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) return;
  
  const userId = session.session.user.id;
  
  try {
    // Get total verses read
    const { data: versesCountResult } = await supabase
      .rpc('count_total_verses_read', { user_id_param: userId });
      
    const totalVersesRead = versesCountResult || 0;
    
    // Check for milestone achievements
    const { data: milestones } = await supabase
      .from('achievements')
      .select('id, requirement_value, points')
      .eq('category', 'milestone')
      .eq('requirement_type', 'verses_read')
      .lte('requirement_value', totalVersesRead)
      .order('requirement_value', { ascending: false });
      
    if (milestones && milestones.length > 0) {
      // Check highest milestone that hasn't been unlocked yet
      for (const milestone of milestones) {
        const { data: userAchievement } = await supabase
          .from('user_achievements')
          .select('unlocked_at, progress')
          .eq('user_id', userId)
          .eq('achievement_id', milestone.id)
          .single();
          
        if (!userAchievement?.unlocked_at) {
          // Unlock this achievement
          await supabase
            .from('user_achievements')
            .update({ 
              unlocked_at: new Date().toISOString(),
              progress: milestone.requirement_value
            })
            .eq('user_id', userId)
            .eq('achievement_id', milestone.id);
            
          // Add points to user
          await supabase
            .from('user_profiles')
            .update({ 
              experience_points: supabase.rpc('increment', { 
                amount: milestone.points 
              }) 
            })
            .eq('id', userId);
            
          // Notify user
          toast({
            title: "🎉 Nova Conquista Desbloqueada!",
            description: `Você leu ${milestone.requirement_value} versículos!`,
          });
          
          // Only unlock one achievement at a time
          break;
        } else if (userAchievement.progress < totalVersesRead) {
          // Update progress
          await supabase
            .from('user_achievements')
            .update({ progress: totalVersesRead })
            .eq('user_id', userId)
            .eq('achievement_id', milestone.id);
        }
      }
    }
    
    // We could add more achievement checks here (book completion, testament progress, etc)
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
};

// Function to update daily challenges
const updateDailyChallenges = async (bookId: string, chapterNumber: number): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) return;
  
  const userId = session.session.user.id;
  const today = new Date().toISOString().split('T')[0];
  
  try {
    // Get book info to determine testament and type
    const { data: bookInfo } = await supabase
      .from('bible_books')
      .select('testament')
      .eq('book_id', bookId)
      .single();
      
    if (!bookInfo) return;
    
    // Check if this book/chapter qualifies for any challenge
    const isPsalms = bookId === 'ps';
    const isProverbs = bookId === 'pr';
    const isNewTestament = bookInfo.testament === 'new';
    
    // Get today's challenges
    const { data: challenges } = await supabase
      .from('user_daily_challenges')
      .select(`
        id, 
        progress, 
        completed, 
        daily_challenges (
          id, 
          book_category,
          chapters_required,
          points
        )
      `)
      .eq('user_id', userId)
      .eq('date', today);
      
    if (!challenges || challenges.length === 0) return;
    
    for (const challenge of challenges) {
      // Skip if already completed
      if (challenge.completed) continue;
      
      // Check if this chapter applies to the challenge
      let appliesTo = false;
      
      switch (challenge.daily_challenges.book_category) {
        case 'psalms':
          appliesTo = isPsalms;
          break;
        case 'wisdom':
          appliesTo = isProverbs;
          break;
        case 'new':
          appliesTo = isNewTestament;
          break;
        default:
          appliesTo = false;
      }
      
      if (appliesTo) {
        const newProgress = (challenge.progress || 0) + 1;
        const isNowCompleted = newProgress >= challenge.daily_challenges.chapters_required;
        
        // Update challenge
        await supabase
          .from('user_daily_challenges')
          .update({ 
            progress: newProgress,
            completed: isNowCompleted
          })
          .eq('id', challenge.id);
          
        // If completed, award points
        if (isNowCompleted) {
          await supabase
            .from('user_profiles')
            .update({ 
              experience_points: supabase.rpc('increment', { 
                amount: challenge.daily_challenges.points 
              }) 
            })
            .eq('id', userId);
            
          // Notify user
          toast({
            title: "✅ Desafio Concluído!",
            description: `Você completou um desafio diário e ganhou ${challenge.daily_challenges.points} pontos!`,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error updating daily challenges:', error);
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
  const { data, error } = await supabase
    .from('user_leaderboards')
    .select('*')
    .order('experience_points', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data;
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
