
import { isUserAuthenticated } from '../AuthService';
import { ReadingHistory } from '@/types/bible.types';

/**
 * Track reading progress with verse tracking
 * @param versionId Bible version ID
 * @param bookId Bible book ID
 * @param chapterNumber Chapter number
 * @param verseNumber Verse number (last verse read or clicked)
 * @param source Source of the reading (scroll, click, search)
 * @returns Promise resolving to success status
 */
export async function trackReading(
  versionId: string,
  bookId: string,
  chapterNumber: number,
  verseNumber: number | string = 1,
  source: 'scroll' | 'click' | 'search' = 'scroll'
): Promise<boolean> {
  try {
    // Ensure verseNumber is a number
    const verse = typeof verseNumber === 'string' ? parseInt(verseNumber, 10) : verseNumber;
    
    console.log(`Tracking reading: ${versionId} ${bookId} ${chapterNumber}:${verse} (${source})`);
    
    // Check if user is authenticated - this uses localStorage for guest users
    const isAuth = await isUserAuthenticated();
    if (!isAuth) {
      console.log('User not authenticated, storing in localStorage');
      
      // Store in localStorage for non-authenticated users
      let readingHistory: ReadingHistory[];
      try {
        const stored = localStorage.getItem('reading_history');
        readingHistory = stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error('Error parsing reading history:', e);
        readingHistory = [];
      }
      
      // Check if we already have an entry for this book today
      const today = new Date().toDateString();
      const existingIndex = readingHistory.findIndex(entry => 
        entry.book_id === bookId && 
        new Date(entry.timestamp).toDateString() === today
      );
      
      const newEntry: ReadingHistory = {
        version_id: versionId,
        book_id: bookId,
        chapter_number: chapterNumber,
        verse_number: verse,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        source: source
      };
      
      if (existingIndex >= 0) {
        // Update existing entry with latest verse/chapter if it's further along
        const existing = readingHistory[existingIndex];
        if (chapterNumber > existing.chapter_number || 
           (chapterNumber === existing.chapter_number && verse > (existing.verse_number || 1))) {
          readingHistory[existingIndex] = newEntry;
        }
      } else {
        // Add new entry
        readingHistory.unshift(newEntry); // Add to beginning for chronological order
      }
      
      // Limit history size to last 50 entries
      if (readingHistory.length > 50) {
        readingHistory = readingHistory.slice(0, 50);
      }
      
      localStorage.setItem('reading_history', JSON.stringify(readingHistory));
      
      // Update reading position for quick access - separate from history
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
    
    // For authenticated users (not implemented yet)
    console.log('Authenticated user reading tracking not implemented yet');
    
    return true;
  } catch (error) {
    console.error('Error tracking reading:', error);
    return false;
  }
}

/**
 * Track reading from search results
 * @param versionId Bible version ID
 * @param bookId Bible book ID
 * @param chapterNumber Chapter number
 * @param verseNumber Verse number clicked
 * @returns Promise resolving to success status
 */
export async function trackSearchClick(
  versionId: string,
  bookId: string,
  chapterNumber: number,
  verseNumber: number
): Promise<boolean> {
  return trackReading(versionId, bookId, chapterNumber, verseNumber, 'search');
}

/**
 * Get user's reading history
 * @param limit Optional limit for number of entries
 * @returns Promise resolving to array of reading history items
 */
export async function getReadingHistory(limit?: number): Promise<ReadingHistory[]> {
  try {
    const isAuth = await isUserAuthenticated();
    
    if (!isAuth) {
      // Get history from localStorage
      const history = localStorage.getItem('reading_history');
      if (!history) return [];
      
      try {
        const parsedHistory = JSON.parse(history) as ReadingHistory[];
        return limit ? parsedHistory.slice(0, limit) : parsedHistory;
      } catch (e) {
        console.error('Error parsing reading history:', e);
        return [];
      }
    }
    
    // For authenticated users (not implemented yet)
    return [];
  } catch (error) {
    console.error('Error getting reading history:', error);
    return [];
  }
}

/**
 * Get last three readings for profile display
 * @returns Promise resolving to array of last 3 reading history items
 */
export async function getLastThreeReadings(): Promise<ReadingHistory[]> {
  return getReadingHistory(3);
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
    
    // For authenticated users (not implemented yet)
    return true;
  } catch (error) {
    console.error('Error clearing reading history:', error);
    return false;
  }
}
