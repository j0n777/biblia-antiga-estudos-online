
import { supabase } from '@/integrations/supabase/client';
import { Achievement, DailyChallenge, UserProfile, LeaderboardEntry } from '../types/bible.types';
import { toast } from '@/hooks/use-toast';
import { saveReadingPosition } from './ReadingService';

// Get user achievements
export const getUserAchievements = async (): Promise<Achievement[]> => {
  const { data: session } = await supabase.auth.getSession();
  
  // For now, return mock achievements until the database schema is fully set up
  return [
    {
      id: '1',
      name: 'Leitor Iniciante',
      description: '7 dias consecutivos de leitura',
      icon: '🔥',
      points: 50,
      category: 'streak',
      unlocked: session?.user ? true : false,
      progress: session?.user ? 7 : 5,
      maxProgress: 7,
      unlockedAt: session?.user ? new Date() : undefined,
    },
    {
      id: '2',
      name: '100 Versículos',
      description: 'Você leu 100 versículos',
      icon: '📊',
      points: 20,
      category: 'milestone',
      unlocked: false,
      progress: 72,
      maxProgress: 100,
    },
    {
      id: '3',
      name: 'Gênesis',
      description: 'Completou a leitura de Gênesis',
      icon: '📚',
      points: 50,
      category: 'book',
      unlocked: true,
    },
    {
      id: '4',
      name: 'Êxodo',
      description: 'Completou a leitura de Êxodo',
      icon: '📚',
      points: 50,
      category: 'book',
      unlocked: false,
      progress: 15,
      maxProgress: 40
    },
    {
      id: '5',
      name: 'Estudioso',
      description: '5 dias consecutivos de estudo',
      icon: '🔍',
      points: 30,
      category: 'challenge',
      unlocked: false,
      progress: 5,
      maxProgress: 7
    },
    {
      id: '6',
      name: 'Compartilhador',
      description: 'Compartilhou 10 versículos',
      icon: '📤',
      points: 40,
      category: 'challenge',
      unlocked: false,
      progress: 3,
      maxProgress: 10
    }
  ];
};

// Get daily challenges
export const getDailyChallenges = async (): Promise<DailyChallenge[]> => {
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
  if (!session?.session?.user) {
    // If not logged in, just update local storage and show a toast
    toast({
      title: "Progresso salvo localmente",
      description: "Crie uma conta para sincronizar seu progresso em todos os dispositivos",
      action: {
        label: "Cadastrar",
        onClick: () => window.location.href = "/auth"
      }
    });
    return;
  }
  
  try {
    // For now, just update mock data
    toast({
      title: "Progresso registrado!",
      description: "Continue lendo para ganhar mais conquistas",
    });
  } catch (error) {
    console.error('Error tracking reading progress:', error);
  }
};

// Get user profile - simplified for now
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const { data: session } = await supabase.auth.getSession();

  // If not logged in, return a default profile with randomly generated ID
  if (!session?.session?.user) {
    return {
      id: `guest-${Math.floor(Math.random() * 1000000)}`,
      display_name: "Visitante",
      experience_points: 0,
      streak_count: 0
    };
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    // Create a compatible profile object from the data
    return {
      ...data,
      experience_points: data.experience_points || 0,
      streak_count: data.streak_count || 0,
      last_streak_date: data.last_streak_date ? new Date(data.last_streak_date) : undefined
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

// Get leaderboard
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  // Return mock leaderboard entries for now
  return [
    { id: '1', nickname: 'BibleMaster', avatar_url: null, experience_points: 1250, streak_count: 45, achievements_count: 12, rank: 1 },
    { id: '2', nickname: 'FaithWalker', avatar_url: null, experience_points: 980, streak_count: 30, achievements_count: 8, rank: 2 },
    { id: '3', nickname: 'GraceSeeker', avatar_url: null, experience_points: 820, streak_count: 25, achievements_count: 7, rank: 3 },
    { id: '4', nickname: 'TruthFinder', avatar_url: null, experience_points: 750, streak_count: 22, achievements_count: 6, rank: 4 },
    { id: '5', nickname: 'LightBearer', avatar_url: null, experience_points: 610, streak_count: 15, achievements_count: 5, rank: 5 }
  ];
};

// Update user profile
export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<boolean> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    toast({
      title: "Faça login para salvar seu perfil",
      description: "Crie uma conta para salvar suas preferências",
      action: {
        label: "Cadastrar",
        onClick: () => window.location.href = "/auth"
      }
    });
    return false;
  }

  try {
    const { error } = await supabase
      .from('user_profiles')
      .update(profile)
      .eq('id', session.session.user.id);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return false;
  }
};
