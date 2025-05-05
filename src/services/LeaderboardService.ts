
import { supabase } from '@/integrations/supabase/client';
import { LeaderboardEntry } from '@/types/bible.types';

/**
 * Get leaderboard data
 * @returns Promise resolving to array of leaderboard entries
 */
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
      },
      {
        id: '6',
        user_id: '6',
        nickname: 'RaquelPaz',
        display_name: 'Raquel Paz',
        avatar_url: null,
        experience_points: 620,
        streak_count: 12,
        achievements_count: 6,
        rank: 6
      },
      {
        id: '7',
        user_id: '7',
        nickname: 'TiagoLuz',
        display_name: 'Tiago Luz',
        avatar_url: null,
        experience_points: 580,
        streak_count: 9,
        achievements_count: 8,
        rank: 7
      },
      {
        id: '8',
        user_id: '8',
        nickname: 'IsabelaGraça',
        display_name: 'Isabela Graça',
        avatar_url: null,
        experience_points: 520,
        streak_count: 7,
        achievements_count: 5,
        rank: 8
      },
      {
        id: '9',
        user_id: '9',
        nickname: 'MateusSábio',
        display_name: 'Mateus Sábio',
        avatar_url: null,
        experience_points: 490,
        streak_count: 8,
        achievements_count: 6,
        rank: 9
      },
      {
        id: '10',
        user_id: '10',
        nickname: 'DéboraFé',
        display_name: 'Débora Fé',
        avatar_url: null,
        experience_points: 450,
        streak_count: 5,
        achievements_count: 4,
        rank: 10
      }
    ];
    
    return mockLeaderboard;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}
