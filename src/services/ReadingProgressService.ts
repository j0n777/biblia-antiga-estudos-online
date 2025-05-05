
import { supabase } from '@/integrations/supabase/client';
import { isUserAuthenticated } from './AuthService';

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
  verseNumber: number = 1
): Promise<boolean> {
  try {
    console.log(`Tracking reading: ${versionId} ${bookId} ${chapterNumber}:${verseNumber}`);
    
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
        verse_number: verseNumber,
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
        verse: verseNumber,
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
 * Track reading streak
 * @returns Promise resolving to object containing current and record streak
 */
export async function getReadingStreak(): Promise<{ current: number; record: number }> {
  try {
    const isAuth = await isUserAuthenticated();
    
    if (!isAuth) {
      // Get from localStorage for non-authenticated users
      const streak = localStorage.getItem('reading_streak');
      if (!streak) return { current: 0, record: 0 };
      
      const { current, record } = JSON.parse(streak);
      return { current, record };
    }
    
    // TODO: Replace with actual database calls
    
    // Mock streak data
    return { current: 7, record: 14 };
  } catch (error) {
    console.error('Error getting reading streak:', error);
    return { current: 0, record: 0 };
  }
}
