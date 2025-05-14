
import { supabase } from '@/integrations/supabase/client';
import { isUserAuthenticated } from '../AuthService';
import { ReadingHistory } from '@/types/bible.types';

/**
 * Track reading progress
 * @param versionId Bible version ID
 * @param bookId Bible book ID
 * @param chapterNumber Chapter number
 * @param verseNumber Verse number or string
 * @returns Promise resolving to success status
 */
export async function trackReading(
  versionId: string,
  bookId: string,
  chapterNumber: number,
  verseNumber: number | string = 1
): Promise<boolean> {
  try {
    // Ensure verseNumber is a number for consistent storage
    const verseNum = typeof verseNumber === 'string' ? parseInt(verseNumber, 10) : verseNumber;
    
    console.log(`Tracking reading: ${versionId} ${bookId} ${chapterNumber}:${verseNum}`);
    
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.log('User not authenticated, storing in localStorage');
      
      // Store in localStorage for non-authenticated users
      const readingHistory = JSON.parse(localStorage.getItem('reading_history') || '[]');
      readingHistory.push({
        version_id: versionId,
        book_id: bookId,
        chapter_number: chapterNumber,
        verse_number: verseNum,
        timestamp: new Date().toISOString()
      });
      
      // Limit history size
      if (readingHistory.length > 100) {
        readingHistory.shift();
      }
      
      localStorage.setItem('reading_history', JSON.stringify(readingHistory));
      
      // Update reading position for quick access
      const lastPosition = {
        version_id: versionId,
        book_id: bookId,
        chapter: chapterNumber,
        verse: verseNum,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('last_reading_position', JSON.stringify(lastPosition));
      
      return true;
    }
    
    // TODO: Track reading progress in the database for logged in users
    
    return true;
  } catch (error) {
    console.error('Error tracking reading:', error);
    return false;
  }
}

/**
 * Get user's reading history
 * Retrieves history from localStorage for all users
 * 
 * @param limit Number of entries to return
 * @returns Promise resolving to an array of reading history entries
 */
export const getReadingHistory = async (limit: number = 10): Promise<ReadingHistory[]> => {
  try {
    // Get from localStorage
    const historyJson = localStorage.getItem('reading_history');
    if (!historyJson) return [];
    
    const history: ReadingHistory[] = JSON.parse(historyJson);
    return history.slice(0, limit);
  } catch (error) {
    console.error('Error getting reading history:', error);
    return [];
  }
};

/**
 * Clear user's reading history
 * Removes history from localStorage
 * 
 * @returns Promise resolving to true if cleared successfully
 */
export const clearReadingHistory = async (): Promise<boolean> => {
  try {
    // Remove from localStorage
    localStorage.removeItem('reading_history');
    return true;
  } catch (error) {
    console.error('Error clearing reading history:', error);
    return false;
  }
};
