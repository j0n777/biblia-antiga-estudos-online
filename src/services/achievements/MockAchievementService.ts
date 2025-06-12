
import { Achievement } from '@/types/bible.types';

/**
 * Mock achievements for guest users
 */
export function getMockAchievements(): Achievement[] {
  return [
    {
      id: '1',
      name: 'first_chapter',
      title: 'Primeiro Capítulo',
      description: 'Leu seu primeiro capítulo',
      icon: '📚',
      category: 'milestone',
      points: 10,
      requirement_type: 'chapters_read',
      requirement_value: '1',
      progress: 0,
      total: 1,
      maxProgress: 1,
      unlocked: false,
      earned: false,
      is_completed: false
    },
    {
      id: '2',
      name: 'streak_7',
      title: 'Semana Sagrada',
      description: 'Leu por 7 dias consecutivos',
      icon: '🔥',
      category: 'streak',
      points: 50,
      requirement_type: 'streak_days',
      requirement_value: '7',
      progress: 0,
      total: 7,
      maxProgress: 7,
      unlocked: false,
      earned: false,
      is_completed: false
    }
  ];
}
