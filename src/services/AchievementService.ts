
import { supabase } from '@/integrations/supabase/client';
import { Achievement, DailyChallenge, UserProfile, LeaderboardEntry } from '@/types/bible.types';
import { getSavedVerses } from '@/services/BibleStudyService';

// Export the getSavedVerses function
export { getSavedVerses };

// Add export for checking if user is authenticated
export const isUserAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session?.user;
};

// Mock achievements for development
export async function getUserAchievements(): Promise<Achievement[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      // Return mock achievements for non-authenticated users
      return [
        {
          id: '1',
          name: 'Primeiro Passo',
          description: 'Leu seu primeiro capítulo',
          icon: '📚',
          progress: 1,
          total: 1,
          target: 1,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
          points: 10,
          earned: true,
          category: 'reading',
          earned_at: new Date().toISOString(),
          maxProgress: 1
        },
        {
          id: '2',
          name: 'Estudante Dedicado',
          description: 'Leu por 7 dias seguidos',
          icon: '🔥',
          progress: 3,
          total: 7,
          target: 7,
          unlocked: false,
          unlockedAt: null,
          points: 50,
          earned: false,
          category: 'streak',
          earned_at: undefined,
          maxProgress: 7
        },
      ];
    }
    
    // TODO: Replace with actual database calls for logged in users
    return [
      {
        id: '1',
        name: 'Primeiro Passo',
        description: 'Leu seu primeiro capítulo',
        icon: '📚',
        progress: 1,
        total: 1,
        target: 1,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        points: 10,
        earned: true,
        category: 'reading',
        earned_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Estudante Dedicado',
        description: 'Leu por 7 dias seguidos',
        icon: '🔥',
        progress: 5,
        total: 7,
        target: 7,
        unlocked: false,
        unlockedAt: null,
        points: 50,
        earned: false,
        category: 'streak',
        earned_at: undefined
      },
      {
        id: '3',
        name: 'Explorador Bíblico',
        description: 'Leu 10 capítulos diferentes',
        icon: '🧭',
        progress: 8,
        total: 10,
        target: 10,
        unlocked: false,
        unlockedAt: null,
        points: 30,
        earned: false,
        category: 'milestone',
        earned_at: undefined
      },
      {
        id: '4',
        name: 'Antigo Testamento',
        description: 'Completou um livro do Antigo Testamento',
        icon: '📜',
        progress: 1,
        total: 1,
        target: 1,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        points: 100,
        earned: true,
        category: 'testament',
        earned_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Novo Testamento',
        description: 'Completou um livro do Novo Testamento',
        icon: '✝️',
        progress: 1,
        total: 1,
        target: 1,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        points: 100,
        earned: true,
        category: 'testament',
        earned_at: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Maratonista',
        description: 'Leu por 30 dias seguidos',
        icon: '🏃',
        progress: 17,
        total: 30,
        target: 30,
        unlocked: false,
        unlockedAt: null,
        points: 200,
        earned: false,
        category: 'streak',
        earned_at: undefined
      }
    ];
    
  } catch (error) {
    console.error('Error getting user achievements:', error);
    return [];
  }
}

// Get user's daily challenges
export async function getDailyChallenges(): Promise<DailyChallenge[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      // Return mock challenges for non-authenticated users
      return [
        {
          id: '1',
          name: 'Desafio do Salmo',
          title: 'Desafio do Salmo',
          description: 'Leia o Salmo 23',
          icon: '🌟',
          target_book_id: 'PSA',
          target_chapter: 23,
          chapters_required: 1,
          progress: 0,
          completed: false,
          points: 20,
          expires_at: new Date(Date.now() + 86400000).toISOString(),
          expiry: new Date(Date.now() + 86400000).toISOString()
        },
        {
          id: '2',
          name: 'Desafio do Novo Testamento',
          title: 'Desafio do Novo Testamento',
          description: 'Leia 3 capítulos dos Evangelhos',
          icon: '📖',
          target_book_id: null,
          target_chapter: null,
          chapters_required: 3,
          progress: 1,
          completed: false,
          points: 30,
          expires_at: new Date(Date.now() + 86400000).toISOString(),
          expiry: new Date(Date.now() + 86400000).toISOString()
        }
      ];
    }
    
    // TODO: Replace with actual database calls
    return [
      {
        id: '1',
        name: 'Desafio do Salmo',
        title: 'Desafio do Salmo',
        description: 'Leia o Salmo 23',
        icon: '🌟',
        target_book_id: 'PSA',
        target_chapter: 23,
        chapters_required: 1,
        progress: 0,
        completed: false,
        points: 20,
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        expiry: new Date(Date.now() + 86400000).toISOString()
      },
      {
        id: '2',
        name: 'Desafio do Novo Testamento',
        title: 'Desafio do Novo Testamento',
        description: 'Leia 3 capítulos dos Evangelhos',
        icon: '📖',
        target_book_id: null,
        target_chapter: null,
        chapters_required: 3,
        progress: 1,
        completed: false,
        points: 30,
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        expiry: new Date(Date.now() + 86400000).toISOString()
      },
      {
        id: '3',
        name: 'Desafio de Provérbios',
        title: 'Desafio de Provérbios',
        description: 'Leia o Provérbios 3',
        icon: '🧠',
        target_book_id: 'PRO',
        target_chapter: 3,
        chapters_required: 1,
        progress: 1,
        completed: true,
        points: 25,
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        expiry: new Date(Date.now() + 86400000).toISOString()
      }
    ];
    
  } catch (error) {
    console.error('Error getting daily challenges:', error);
    return [];
  }
}

// Track reading progress
export async function trackReading(
  versionId: string,
  bookId: string,
  chapterNumber: number,
  verseNumber: number = 1
): Promise<boolean> {
  try {
    console.log(`Tracking reading: ${versionId} ${bookId} ${chapterNumber}:${verseNumber}`);
    
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.log('User not authenticated, storing in localStorage');
      
      // Store in localStorage for non-authenticated users
      const readingHistory = JSON.parse(localStorage.getItem('reading_history') || '[]');
      readingHistory.push({
        version_id: versionId,
        book_id: bookId,
        chapter_number: chapterNumber,
        verse_number: verseNumber,
        timestamp: new Date().toISOString()
      });
      
      // Limit history size
      if (readingHistory.length > 100) {
        readingHistory.shift();
      }
      
      localStorage.setItem('reading_history', JSON.stringify(readingHistory));
      return true;
    }
    
    // TODO: Track reading progress in the database for logged in users
    
    return true;
  } catch (error) {
    console.error('Error tracking reading:', error);
    return false;
  }
}

// Track reading streak
export async function getReadingStreak(): Promise<{ current: number; record: number }> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      // Get from localStorage for non-authenticated users
      const streak = localStorage.getItem('reading_streak');
      if (!streak) return { current: 0, record: 0 };
      
      const { current, record } = JSON.parse(streak);
      return { current, record };
    }
    
    // TODO: Replace with actual database calls
    
    // Mock streak data
    return { current: 7, record: 14 };
  } catch (error) {
    console.error('Error getting reading streak:', error);
    return { current: 0, record: 0 };
  }
}

// Save a verse to user's collection
export async function saveVerse(
  bookId: string,
  chapterNumber: number,
  verseNumber: number,
  versionId: string = 'kja',
  color: string = 'yellow'
): Promise<boolean> {
  try {
    console.log(`Saving verse: ${bookId} ${chapterNumber}:${verseNumber} (${versionId})`);
    
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.log('User not authenticated, storing in localStorage');
      
      // Store in localStorage for non-authenticated users
      const savedVerses = JSON.parse(localStorage.getItem('saved_verses') || '[]');
      
      // Check if verse is already saved
      const verseIndex = savedVerses.findIndex((v: any) => 
        v.book_id === bookId && 
        v.chapter_number === chapterNumber && 
        v.verse_number === verseNumber
      );
      
      if (verseIndex >= 0) {
        // Update existing saved verse
        savedVerses[verseIndex].color = color;
      } else {
        // Add new saved verse
        savedVerses.push({
          book_id: bookId,
          chapter_number: chapterNumber,
          verse_number: verseNumber,
          version_id: versionId,
          color,
          saved_at: new Date().toISOString()
        });
      }
      
      localStorage.setItem('saved_verses', JSON.stringify(savedVerses));
      return true;
    }
    
    // TODO: Save verse in the database for logged in users
    
    return true;
  } catch (error) {
    console.error('Error saving verse:', error);
    return false;
  }
}

// Get user profile
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.log('User not authenticated, getting from localStorage');
      
      // Get from localStorage for non-authenticated users
      const profile = localStorage.getItem('user_profile');
      if (!profile) {
        // Create default profile for first-time users
        const defaultProfile: UserProfile = {
          id: 'local',
          display_name: 'Visitante',
          nickname: 'guest',
          experience_points: 0,
          streak_count: 0,
          streak_record: 0,
          last_streak_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          font_size: 'medium',
          reading_position: null
        };
        
        localStorage.setItem('user_profile', JSON.stringify(defaultProfile));
        return defaultProfile;
      }
      
      return JSON.parse(profile) as UserProfile;
    }
    
    // For authenticated users, get from database
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', session.session.user.id)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    if (!data) {
      // Create profile if it doesn't exist
      const newProfile: UserProfile = {
        id: session.session.user.id,
        user_id: session.session.user.id,
        display_name: session.session.user.email?.split('@')[0] || 'User',
        nickname: session.session.user.email?.split('@')[0] || 'User',
        experience_points: 0,
        streak_count: 0,
        streak_record: 0,
        last_streak_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        font_size: 'medium',
        reading_position: null
      };
      
      await supabase
        .from('user_profiles')
        .insert(newProfile);
        
      return newProfile;
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<boolean> {
  try {
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    // For non-authenticated users, update localStorage
    if (!session?.session?.user) {
      console.log('User not authenticated, updating localStorage');
      
      const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      
      return true;
    }

    if (!updates.id) {
      updates.id = session.session.user.id;
    }
    
    // For authenticated users, update in database
    const { error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', session.session.user.id);
      
    if (error) {
      throw new Error(`Profile update error: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

// Get leaderboard data
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    // TODO: Replace with actual database calls
    
    // Mock leaderboard data
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        id: '1',
        user_id: '1',
        nickname: 'JoãoB123',
        display_name: 'João da Bíblia',
        avatar_url: null,
        experience_points: 1240,
        streak_count: 32,
        achievements_count: 15,
        rank: 1
      },
      {
        id: '2',
        user_id: '2',
        nickname: 'MariaSalmos',
        display_name: 'Maria dos Salmos',
        avatar_url: null,
        experience_points: 980,
        streak_count: 25,
        achievements_count: 12,
        rank: 2
      },
      {
        id: '3',
        user_id: '3',
        nickname: 'PedroDaFé',
        display_name: 'Pedro da Fé',
        avatar_url: null,
        experience_points: 870,
        streak_count: 18,
        achievements_count: 10,
        rank: 3
      },
      {
        id: '4',
        user_id: '4',
        nickname: 'AnaSapiência',
        display_name: 'Ana Sapiência',
        avatar_url: null,
        experience_points: 740,
        streak_count: 14,
        achievements_count: 8,
        rank: 4
      },
      {
        id: '5',
        user_id: '5',
        nickname: 'Lucas123',
        display_name: 'Lucas',
        avatar_url: null,
        experience_points: 650,
        streak_count: 10,
        achievements_count: 7,
        rank: 5
      }
    ];
    
    return mockLeaderboard;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

