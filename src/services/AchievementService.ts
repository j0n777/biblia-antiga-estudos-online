
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
          title: 'Primeiro Passo',
          description: 'Leu seu primeiro capítulo',
          icon: '📚',
          progress: 1,
          total: 1,
          points: 10,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
          earned: true,
          category: 'reading',
          earned_at: new Date().toISOString(),
          maxProgress: 1
        },
        {
          id: '2',
          name: 'Estudante Dedicado',
          title: 'Estudante Dedicado',
          description: 'Leu por 7 dias seguidos',
          icon: '🔥',
          progress: 3,
          total: 7,
          points: 50,
          unlocked: false,
          unlockedAt: null,
          earned: false,
          category: 'streak',
          maxProgress: 7
        },
      ];
    }
    
    // TODO: Replace with actual database calls for logged in users
    return [
      {
        id: '1',
        title: 'Primeiro Passo',
        name: 'Primeiro Passo',
        description: 'Leu seu primeiro capítulo',
        icon: '📚',
        progress: 1,
        total: 1,
        points: 10,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        earned: true,
        category: 'reading',
        earned_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Estudante Dedicado',
        name: 'Estudante Dedicado',
        description: 'Leu por 7 dias seguidos',
        icon: '🔥',
        progress: 5,
        total: 7,
        points: 50,
        unlocked: false,
        category: 'streak'
      },
      {
        id: '3',
        title: 'Explorador Bíblico',
        name: 'Explorador Bíblico',
        description: 'Leu 10 capítulos diferentes',
        icon: '🧭',
        progress: 8,
        total: 10,
        points: 30,
        unlocked: false,
        category: 'milestone'
      },
      {
        id: '4',
        title: 'Antigo Testamento',
        name: 'Antigo Testamento',
        description: 'Completou um livro do Antigo Testamento',
        icon: '📜',
        progress: 1,
        total: 1,
        points: 100,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        earned: true,
        category: 'testament',
        earned_at: new Date().toISOString()
      },
      {
        id: '5',
        title: 'Novo Testamento',
        name: 'Novo Testamento',
        description: 'Completou um livro do Novo Testamento',
        icon: '✝️',
        progress: 1,
        total: 1,
        points: 100,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        earned: true,
        category: 'testament',
        earned_at: new Date().toISOString()
      },
      {
        id: '6',
        title: 'Maratonista',
        name: 'Maratonista',
        description: 'Leu por 30 dias seguidos',
        icon: '🏃',
        progress: 17,
        total: 30,
        points: 200,
        unlocked: false,
        category: 'streak'
      }
    ];
    
  } catch (error) {
    console.error('Error getting user achievements:', error);
    return [];
  }
}
