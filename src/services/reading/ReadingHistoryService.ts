
import { supabase } from '@/integrations/supabase/client';
import { isUserAuthenticated } from '../AuthService';
import { ReadingHistory } from '@/types/bible.types';

/**
 * Track reading progress
 * @param versionId Bible version ID
 * @param bookId Bible book ID
 * @param chapterNumber Chapter number
 * @param verseNumber Verse number
 * @returns Promise resolving to success status
 */
export async function trackReading(
  versionId: string,
  bookId: string,
  chapterNumber: number,
  verseNumber: number | string = 1
): Promise<boolean> {
  try {
    // Ensure verseNumber is a number
    const verse = typeof verseNumber === 'string' ? parseInt(verseNumber, 10) : verseNumber;
    
    console.log(`Tracking reading: ${versionId} ${bookId} ${chapterNumber}:${verse}`);
    
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.log('User not authenticated, storing in localStorage');
      
      // Store in localStorage for non-authenticated users
      const readingHistory: ReadingHistory[] = JSON.parse(localStorage.getItem('reading_history') || '[]');
      readingHistory.push({
        version_id: versionId,
        book_id: bookId,
        chapter_number: chapterNumber,
        verse_number: verse,
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
        verse: verse,
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
 * @returns Promise resolving to array of reading history items
 */
export async function getReadingHistory(): Promise<ReadingHistory[]> {
  try {
    const isAuth = await isUserAuthenticated();
    
    if (!isAuth) {
      // Get history from localStorage
      const history = localStorage.getItem('reading_history');
      if (!history) return [];
      
      return JSON.parse(history) as ReadingHistory[];
    }
    
    // TODO: Get reading history from database for logged in users
    return [];
  } catch (error) {
    console.error('Error getting reading history:', error);
    return [];
  }
}

/**
 * Clear reading history
 * @returns Promise resolving to success status
 */
export async function clearReadingHistory(): Promise<boolean> {
  try {
    const isAuth = await isUserAuthenticated();
    
    if (!isAuth) {
      localStorage.removeItem('reading_history');
      return true;
    }
    
    // TODO: Clear reading history from database for logged in users
    return true;
  } catch (error) {
    console.error('Error clearing reading history:', error);
    return false;
  }
}
