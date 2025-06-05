
import { supabase } from '@/integrations/supabase/client';
import { ReadingHistory } from '@/types/bible.types';
import { trackReadingSession } from '@/services/AchievementService';

/**
 * Track reading and trigger achievement checks
 */
export async function trackReading(
  versionId: string,
  bookId: string,
  chapterNumber: number,
  verseNumber?: number,
  source: 'scroll' | 'click' | 'search' = 'scroll'
): Promise<void> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      // For guest users, still save to localStorage
      const guestHistory = JSON.parse(localStorage.getItem('guestReadingHistory') || '[]');
      const newEntry = {
        id: Date.now().toString(),
        version_id: versionId,
        book_id: bookId,
        chapter_number: chapterNumber,
        verse_number: verseNumber,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        source
      };
      
      guestHistory.unshift(newEntry);
      if (guestHistory.length > 100) {
        guestHistory.splice(100);
      }
      localStorage.setItem('guestReadingHistory', JSON.stringify(guestHistory));
      return;
    }

    // For authenticated users, save to database and track achievements
    const { error } = await supabase.from('reading_sessions').insert({
      user_id: userId,
      version_id: versionId,
      book_id: bookId,
      chapter_number: chapterNumber,
      verse_number: verseNumber,
      timestamp: new Date().toISOString(),
      source
    });

    if (error) {
      console.error('Error tracking reading:', error);
      return;
    }

    // Track reading session for achievements (async to not block UI)
    trackReadingSession(bookId, chapterNumber, 1).catch(error => {
      console.error('Error tracking reading session for achievements:', error);
    });

  } catch (error) {
    console.error('Error in trackReading:', error);
  }
}

/**
 * Track search click specifically
 */
export async function trackSearchClick(
  versionId: string,
  bookId: string,
  chapterNumber: number,
  verseNumber: number
): Promise<void> {
  return trackReading(versionId, bookId, chapterNumber, verseNumber, 'search');
}

/**
 * Get reading history
 */
export async function getReadingHistory(): Promise<ReadingHistory[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      // Return guest history from localStorage
      const guestHistory = JSON.parse(localStorage.getItem('guestReadingHistory') || '[]');
      return guestHistory;
    }

    const { data, error } = await supabase
      .from('reading_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error getting reading history:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      version_id: item.version_id,
      book_id: item.book_id,
      chapter_number: item.chapter_number,
      verse_number: item.verse_number,
      timestamp: item.timestamp || item.created_at,
      created_at: item.created_at,
      source: item.source
    }));

  } catch (error) {
    console.error('Error in getReadingHistory:', error);
    return [];
  }
}

/**
 * Get last three readings
 */
export async function getLastThreeReadings(): Promise<ReadingHistory[]> {
  const history = await getReadingHistory();
  return history.slice(0, 3);
}

/**
 * Clear reading history
 */
export async function clearReadingHistory(): Promise<void> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      localStorage.removeItem('guestReadingHistory');
      return;
    }

    const { error } = await supabase
      .from('reading_sessions')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing reading history:', error);
    }

  } catch (error) {
    console.error('Error in clearReadingHistory:', error);
  }
}
