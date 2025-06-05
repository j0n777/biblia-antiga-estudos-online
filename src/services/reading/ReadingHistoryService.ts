
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

    // For authenticated users, track reading session for today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Insert or update reading session for today
    const { error } = await supabase.from('reading_sessions').upsert({
      user_id: userId,
      session_date: today,
      chapters_read: 1,
      verses_read: verseNumber ? 1 : 0,
      reading_time_minutes: 5, // Estimate 5 minutes per chapter
      xp_earned: 1
    }, {
      onConflict: 'user_id,session_date'
    });

    if (error) {
      console.error('Error tracking reading:', error);
      return;
    }

    // Also save to localStorage for reading history display
    const historyEntry = {
      id: Date.now().toString(),
      version_id: versionId,
      book_id: bookId,
      chapter_number: chapterNumber,
      verse_number: verseNumber,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      source
    };
    
    const userHistory = JSON.parse(localStorage.getItem(`userReadingHistory_${userId}`) || '[]');
    userHistory.unshift(historyEntry);
    if (userHistory.length > 100) {
      userHistory.splice(100);
    }
    localStorage.setItem(`userReadingHistory_${userId}`, JSON.stringify(userHistory));

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

    // For authenticated users, get from localStorage (since reading_sessions doesn't store the same data)
    const userHistory = JSON.parse(localStorage.getItem(`userReadingHistory_${userId}`) || '[]');
    return userHistory;

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

    localStorage.removeItem(`userReadingHistory_${userId}`);

  } catch (error) {
    console.error('Error in clearReadingHistory:', error);
  }
}
