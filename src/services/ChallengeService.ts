
import { supabase } from '@/integrations/supabase/client';
import { DailyChallenge } from '@/types/bible.types';

/**
 * Get user's daily challenges
 * @returns Promise resolving to array of daily challenges
 */
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
          book_category: 'gospels',
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
        book_category: 'gospels',
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
