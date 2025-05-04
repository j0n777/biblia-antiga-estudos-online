import { supabase } from '@/integrations/supabase/client';
import { Achievement, DailyChallenge, UserProfile, LeaderboardEntry } from '../types/bible.types';
import { toast } from '@/hooks/use-toast';
import { saveReadingPosition } from './ReadingService';
import { Button } from '@/components/ui/button';

// Generate random animal name
const animals = [
  'Leão', 'Tubarão', 'Lobo', 'Águia', 'Urso', 'Tigre', 'Golfinho',
  'Panda', 'Falcão', 'Raposa', 'Coelho', 'Elefante', 'Coruja',
  'Girafa', 'Gato', 'Pantera', 'Jaguar', 'Cobra', 'Tartaruga'
];

// Generate random color
const colors = [
  'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Roxo', 'Laranja',
  'Rosa', 'Marrom', 'Preto', 'Branco', 'Dourado', 'Prateado',
  'Turquesa', 'Violeta', 'Esmeralda', 'Carmesim', 'Índigo'
];

// Generate random nickname
export const generateRandomNickname = (): string => {
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return `${color} ${animal}`;
};

// Helper function to create a register button action for toast
const getRegisterAction = () => {
  return {
    altText: "Cadastrar",
    onClick: () => window.location.href = "/auth"
  };
};

// Get user achievements
export const getUserAchievements = async (): Promise<Achievement[]> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const isAuthenticated = !!sessionData?.session?.user;
  
  // For now, return mock achievements until the database schema is fully set up
  return [
    {
      id: '1',
      name: 'Leitor Iniciante',
      description: '7 dias consecutivos de leitura',
      icon: '🔥',
      progress: 5,
      total: 7,
      earned: isAuthenticated,
      category: 'streak',
      unlocked: isAuthenticated,
      maxProgress: 7,
      points: 50,
      unlockedAt: isAuthenticated ? new Date().toISOString() : undefined,
    },
    {
      id: '2',
      name: '100 Versículos',
      description: 'Você leu 100 versículos',
      icon: '📊',
      progress: 72,
      total: 100,
      earned: false,
      category: 'milestone',
      unlocked: false,
      maxProgress: 100,
      points: 20,
    },
    {
      id: '3',
      name: 'Gênesis',
      description: 'Completou a leitura de Gênesis',
      icon: '📚',
      progress: 50,
      total: 50,
      earned: true,
      category: 'book',
      unlocked: true,
      maxProgress: 50,
      points: 50,
    },
    {
      id: '4',
      name: 'Êxodo',
      description: 'Completou a leitura de Êxodo',
      icon: '📚',
      progress: 15,
      total: 40,
      earned: false,
      category: 'book',
      unlocked: false,
      maxProgress: 40,
      points: 50,
    },
    {
      id: '5',
      name: 'Estudioso',
      description: '5 dias consecutivos de estudo',
      icon: '🔍',
      progress: 5,
      total: 7,
      earned: false,
      category: 'challenge',
      unlocked: false,
      maxProgress: 7,
      points: 30,
    },
    {
      id: '6',
      name: 'Compartilhador',
      description: 'Compartilhou 10 versículos',
      icon: '📤',
      progress: 3,
      total: 10,
      earned: false,
      category: 'challenge',
      unlocked: false,
      maxProgress: 10,
      points: 40,
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
      title: 'Sabedoria Diária',
      description: 'Leia um capítulo de Provérbios',
      icon: '📖',
      points: 10,
      book_category: 'wisdom',
      chapters_required: 1,
      progress: 0,
      completed: false,
      expiry: new Date(Date.now() + 86400000).toISOString(),
    },
    {
      id: '2',
      name: 'Louvor Diário',
      title: 'Louvor Diário',
      description: 'Leia um capítulo de Salmos',
      icon: '🙏',
      points: 10,
      book_category: 'psalms',
      chapters_required: 1,
      progress: 0,
      completed: false,
      expiry: new Date(Date.now() + 86400000).toISOString(),
    }
  ];
};

// Get saved verses for user
export const getSavedVerses = async (limit: number = 3): Promise<any[]> => {
  const { data: sessionData } = await supabase.auth.getSession();
  
  if (!sessionData?.session?.user) {
    // Get from local storage if not logged in
    const savedVerses = localStorage.getItem('savedVerses');
    return savedVerses ? JSON.parse(savedVerses).slice(0, limit) : [];
  }
  
  try {
    const { data, error } = await supabase
      .from('saved_verses')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .order('saved_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching saved verses:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getSavedVerses:', error);
    return [];
  }
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
  
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData?.session?.user) {
    // If not logged in, just update local storage and show a toast
    toast({
      title: "Progresso salvo localmente",
      description: "Crie uma conta para sincronizar seu progresso em todos os dispositivos",
      action: getRegisterAction()
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
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;

  // If not logged in, return a default profile with randomly generated ID and nickname
  if (!session?.user) {
    // Check if we already have a temporary guest profile in localStorage
    const storedProfile = localStorage.getItem('guestProfile');
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }

    // Create a new guest profile
    const guestProfile: UserProfile = {
      id: `guest-${Math.floor(Math.random() * 1000000)}`,
      nickname: generateRandomNickname(),
      display_name: "Visitante",
      experience_points: 0,
      streak_count: 0,
      font_size: 'medium'
    };
    
    // Store in localStorage
    localStorage.setItem('guestProfile', JSON.stringify(guestProfile));
    return guestProfile;
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    // Convert string font_size to proper type
    let fontSizeValue: 'small' | 'medium' | 'large' = 'medium';
    if (data.font_size === 'small' || data.font_size === 'medium' || data.font_size === 'large') {
      fontSizeValue = data.font_size;
    }

    // Format the date string if available
    const lastStreakDate = data.last_streak_date ? data.last_streak_date : undefined;

    // Create a compatible profile object from the data
    return {
      id: data.id,
      display_name: data.display_name,
      nickname: data.nickname || data.username,
      avatar_url: data.avatar_url,
      country: data.country,
      birth_year: data.birth_year,
      preferred_language: data.preferred_language,
      preferred_bible_version: data.preferred_bible_version,
      experience_points: data.experience_points || 0,
      streak_count: data.streak_count || 0,
      last_streak_date: lastStreakDate,
      username: data.username,
      created_at: data.created_at,
      updated_at: data.updated_at,
      email: data.email,
      phone: data.phone,
      font_size: fontSizeValue
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

// Get leaderboard
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  // First check if the user is authenticated
  const { data: sessionData } = await supabase.auth.getSession();
  const isAuthenticated = !!sessionData?.session?.user;
  
  // If authenticated, try to get real leaderboard data
  if (isAuthenticated) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, nickname, avatar_url, experience_points, streak_count')
        .order('experience_points', { ascending: false })
        .limit(10);
        
      if (!error && data && data.length > 0) {
        // Calculate achievements count (mock for now)
        return data.map((user, index) => ({
          id: user.id,
          nickname: user.nickname,
          avatar_url: user.avatar_url,
          experience_points: user.experience_points || 0,
          streak_count: user.streak_count || 0,
          achievements_count: Math.floor(Math.random() * 20),
          rank: index + 1,
          display_name: user.nickname // Add display_name as fallback
        }));
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }
  
  // Return mock leaderboard entries if no real data
  return [
    { id: '1', nickname: 'BibleMaster', display_name: 'BibleMaster', avatar_url: null, experience_points: 1250, streak_count: 45, achievements_count: 12, rank: 1 },
    { id: '2', nickname: 'FaithWalker', display_name: 'FaithWalker', avatar_url: null, experience_points: 980, streak_count: 30, achievements_count: 8, rank: 2 },
    { id: '3', nickname: 'GraceSeeker', display_name: 'GraceSeeker', avatar_url: null, experience_points: 820, streak_count: 25, achievements_count: 7, rank: 3 },
    { id: '4', nickname: 'TruthFinder', display_name: 'TruthFinder', avatar_url: null, experience_points: 750, streak_count: 22, achievements_count: 6, rank: 4 },
    { id: '5', nickname: 'LightBearer', display_name: 'LightBearer', avatar_url: null, experience_points: 610, streak_count: 15, achievements_count: 5, rank: 5 }
  ];
};

// Update user profile
export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    // Make sure profile has an id field and it's not optional
    if (!profile.id) {
      console.error('Profile update requires an id field');
      return null;
    }
    
    // Convert Date objects to strings for Supabase
    const profileToSave = { ...profile };
    
    // Ensure last_streak_date is a string if present
    if (profileToSave.last_streak_date) {
      profileToSave.last_streak_date = 
        typeof profileToSave.last_streak_date === 'string' 
          ? profileToSave.last_streak_date 
          : new Date(profileToSave.last_streak_date).toISOString();
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: profileToSave.id,
        display_name: profileToSave.display_name,
        nickname: profileToSave.nickname,
        avatar_url: profileToSave.avatar_url,
        email: profileToSave.email,
        phone: profileToSave.phone,
        country: profileToSave.country,
        birth_year: profileToSave.birth_year,
        experience_points: profileToSave.experience_points,
        streak_count: profileToSave.streak_count,
        last_streak_date: profileToSave.last_streak_date,
        preferred_language: profileToSave.preferred_language,
        preferred_bible_version: profileToSave.preferred_bible_version,
        font_size: profileToSave.font_size,
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return null;
  }
};

// Check if user is authenticated
export const isUserAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session?.user;
};

// Save a verse to user's collection
export const saveVerse = async (
  bookId: string,
  chapterNumber: number,
  verseNumber: number,
  versionId: string,
  highlight: string | null = null
): Promise<boolean> => {
  const { data: sessionData } = await supabase.auth.getSession();
  
  // Structure for the verse info
  const verseInfo = {
    book_id: bookId,
    chapter_number: chapterNumber,
    verse_number: verseNumber,
    version_id: versionId,
    highlight_color: highlight
  };
  
  // If not logged in, save to localStorage
  if (!sessionData?.session?.user) {
    try {
      const savedVerses = localStorage.getItem('savedVerses') || '[]';
      const verses = JSON.parse(savedVerses);
      verses.unshift({
        ...verseInfo,
        saved_at: new Date().toISOString(),
        id: `local-${Date.now()}`
      });
      localStorage.setItem('savedVerses', JSON.stringify(verses));
      
      toast({
        title: "Versículo salvo localmente",
        description: "Crie uma conta para sincronizar seus versículos favoritos",
        action: getRegisterAction()
      });
      return true;
    } catch (error) {
      console.error('Error saving verse locally:', error);
      return false;
    }
  } 
  
  // If logged in, save to database
  try {
    const { error } = await supabase
      .from('saved_verses')
      .insert({
        ...verseInfo,
        user_id: sessionData.session.user.id
      });
      
    if (error) {
      console.error('Error saving verse to database:', error);
      return false;
    }
    
    toast({
      title: "Versículo salvo!",
      description: "Você pode encontrar seus versículos salvos no seu perfil"
    });
    return true;
  } catch (error) {
    console.error('Error in saveVerse:', error);
    return false;
  }
};
