import { supabase } from '@/integrations/supabase/client';
import { ReadingHistory } from '@/types/bible.types';
import { getUserProfile } from '../ProfileService';

/**
 * Track user's reading activity
 * @param bookId Bible book ID
 * @param chapter Chapter number
 * @param verse Verse number (optional)
 * @returns Promise resolving to true if tracking was successful
 */
export const trackReading = async (
  bookId: string,
  chapter: number,
  verse?: string | number | null
): Promise<boolean> => {
  try {
    console.log(`Tracking reading: ${bookId} ${chapter} ${verse}`);
    
    // Get user profile
    const profile = await getUserProfile();
    
    // Create reading history entry
    const readingEntry: ReadingHistory = {
      book_id: bookId,
      chapter: chapter,
      verse: verse ? Number(verse) : undefined,
      timestamp: new Date().toISOString()
    };
    
    // For non-authenticated users, save to localStorage
    if (!profile?.id || profile.id === 'local' || profile.id.startsWith('guest-')) {
      console.log('User not authenticated, storing in localStorage');
      
      // Get existing history from localStorage
      const historyJson = localStorage.getItem('reading_history');
      const history: ReadingHistory[] = historyJson ? JSON.parse(historyJson) : [];
      
      // Add new entry to the beginning of the array
      history.unshift(readingEntry);
      
      // Keep only the last 50 entries to avoid localStorage size limits
      const trimmedHistory = history.slice(0, 50);
      
      // Save back to localStorage
      localStorage.setItem('reading_history', JSON.stringify(trimmedHistory));
      return true;
    }
    
    // Store in localStorage for all users (as a backup)
    const historyJson = localStorage.getItem('reading_history');
    const history: ReadingHistory[] = historyJson ? JSON.parse(historyJson) : [];
    history.unshift(readingEntry);
    const trimmedHistory = history.slice(0, 50);
    localStorage.setItem('reading_history', JSON.stringify(trimmedHistory));
    
    return true;
  } catch (error) {
    console.error('Error tracking reading:', error);
    return false;
  }
};

/**
 * Get user's reading history
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
