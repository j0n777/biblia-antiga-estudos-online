
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/types/bible.types';

/**
 * Get all available achievements from database
 */
export async function getAllAchievements(): Promise<Achievement[]> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('category', { ascending: true })
      .order('points', { ascending: true });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return (data || []).map(item => ({
      ...item,
      category: item.category as 'book' | 'streak' | 'milestone' | 'special',
      requirement_type: item.requirement_type as 'book_completion' | 'streak_days' | 'chapters_read' | 'verses_saved'
    }));
  } catch (error) {
    console.error('Error in getAllAchievements:', error);
    return [];
  }
}
