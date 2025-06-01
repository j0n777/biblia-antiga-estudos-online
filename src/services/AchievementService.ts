
import { supabase } from '@/integrations/supabase/client';
import { Achievement, DailyChallenge } from '@/types/bible.types';
import { getUserProfile } from './ProfileService';
import { getReadingHistory } from './reading/ReadingHistoryService';
import { getSavedVerses } from './VersesService';

/**
 * Calculate real achievements based on user data
 * @returns Promise resolving to array of achievements with real progress
 */
export async function getUserAchievements(): Promise<Achievement[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    // Get user data for calculations
    const readingHistory = await getReadingHistory();
    const savedVerses = await getSavedVerses();
    
    // Calculate reading streak
    const currentStreak = calculateReadingStreak(readingHistory);
    const totalDaysRead = getTotalUniqueDaysRead(readingHistory);
    const uniqueBooksRead = getUniqueBooksRead(readingHistory);
    const totalChaptersRead = readingHistory.length;
    
    const achievements: Achievement[] = [
      {
        id: '1',
        name: 'Primeiro Passo',
        title: 'Primeiro Passo',
        description: 'Leu seu primeiro capítulo',
        icon: '📚',
        progress: Math.min(totalChaptersRead, 1),
        total: 1,
        points: 10,
        unlocked: totalChaptersRead >= 1,
        unlockedAt: totalChaptersRead >= 1 ? new Date().toISOString() : null,
        earned: totalChaptersRead >= 1,
        category: 'reading',
        earned_at: totalChaptersRead >= 1 ? new Date().toISOString() : undefined,
        maxProgress: 1
      },
      {
        id: '2',
        name: 'Estudante Dedicado',
        title: 'Estudante Dedicado', 
        description: 'Leu por 7 dias seguidos',
        icon: '🔥',
        progress: currentStreak,
        total: 7,
        points: 50,
        unlocked: currentStreak >= 7,
        unlockedAt: currentStreak >= 7 ? new Date().toISOString() : null,
        earned: currentStreak >= 7,
        category: 'streak',
        earned_at: currentStreak >= 7 ? new Date().toISOString() : undefined,
        maxProgress: 7
      },
      {
        id: '3',
        name: 'Explorador Bíblico',
        title: 'Explorador Bíblico',
        description: 'Leu 10 capítulos diferentes',
        icon: '🧭',
        progress: Math.min(totalChaptersRead, 10),
        total: 10,
        points: 30,
        unlocked: totalChaptersRead >= 10,
        unlockedAt: totalChaptersRead >= 10 ? new Date().toISOString() : null,
        earned: totalChaptersRead >= 10,
        category: 'milestone',
        earned_at: totalChaptersRead >= 10 ? new Date().toISOString() : undefined,
        maxProgress: 10
      },
      {
        id: '4',
        name: 'Colecionador de Versículos',
        title: 'Colecionador de Versículos',
        description: 'Salvou 5 versículos',
        icon: '📝',
        progress: Math.min(savedVerses.length, 5),
        total: 5,
        points: 25,
        unlocked: savedVerses.length >= 5,
        unlockedAt: savedVerses.length >= 5 ? new Date().toISOString() : null,
        earned: savedVerses.length >= 5,
        category: 'verses',
        earned_at: savedVerses.length >= 5 ? new Date().toISOString() : undefined,
        maxProgress: 5
      },
      {
        id: '5',
        name: 'Leitor Diverso',
        title: 'Leitor Diverso',
        description: 'Leu pelo menos 5 livros diferentes',
        icon: '📖',
        progress: Math.min(uniqueBooksRead, 5),
        total: 5,
        points: 40,
        unlocked: uniqueBooksRead >= 5,
        unlockedAt: uniqueBooksRead >= 5 ? new Date().toISOString() : null,
        earned: uniqueBooksRead >= 5,
        category: 'diversity',
        earned_at: uniqueBooksRead >= 5 ? new Date().toISOString() : undefined,
        maxProgress: 5
      },
      {
        id: '6',
        name: 'Maratonista',
        title: 'Maratonista',
        description: 'Leu por 30 dias seguidos',
        icon: '🏃',
        progress: currentStreak,
        total: 30,
        points: 200,
        unlocked: currentStreak >= 30,
        unlockedAt: currentStreak >= 30 ? new Date().toISOString() : null,
        earned: currentStreak >= 30,
        category: 'streak',
        earned_at: currentStreak >= 30 ? new Date().toISOString() : undefined,
        maxProgress: 30
      },
      {
        id: '7',
        name: 'Leitor Assíduo',
        title: 'Leitor Assíduo',
        description: 'Leu em 30 dias diferentes',
        icon: '📅',
        progress: Math.min(totalDaysRead, 30),
        total: 30,
        points: 150,
        unlocked: totalDaysRead >= 30,
        unlockedAt: totalDaysRead >= 30 ? new Date().toISOString() : null,
        earned: totalDaysRead >= 30,
        category: 'consistency',
        earned_at: totalDaysRead >= 30 ? new Date().toISOString() : undefined,
        maxProgress: 30
      }
    ];

    return achievements;
    
  } catch (error) {
    console.error('Error getting user achievements:', error);
    return [];
  }
}

/**
 * Calculate current reading streak based on reading history
 */
function calculateReadingStreak(history: any[]): number {
  if (history.length === 0) return 0;
  
  const dates = [...new Set(history.map(entry => 
    new Date(entry.timestamp).toDateString()
  ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let streak = 0;
  const today = new Date().toDateString();
  
  for (let i = 0; i < dates.length; i++) {
    const currentDate = new Date(dates[i]);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (currentDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Get total unique days user has read
 */
function getTotalUniqueDaysRead(history: any[]): number {
  const uniqueDates = new Set(history.map(entry => 
    new Date(entry.timestamp).toDateString()
  ));
  return uniqueDates.size;
}

/**
 * Get number of unique books read
 */
function getUniqueBooksRead(history: any[]): number {
  const uniqueBooks = new Set(history.map(entry => entry.book_id));
  return uniqueBooks.size;
}
