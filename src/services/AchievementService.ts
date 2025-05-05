
import { supabase } from '@/integrations/supabase/client';
import { Achievement, DailyChallenge } from '@/types/bible.types';
import { getUserProfile } from './ProfileService';

/**
 * Get user's achievements
 * @returns Promise resolving to array of achievements
 */
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
