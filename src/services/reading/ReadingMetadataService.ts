
import { supabase } from '@/integrations/supabase/client';
import { ReadingHistory } from '@/types/bible.types';

const LOCAL_STORAGE_KEY = 'reading_history';
const MAX_LOCAL_ENTRIES = 10;

/**
 * Record a chapter read
 * @param bookId The book ID (e.g., 'gen', 'exo')
 * @param chapterNumber The chapter number
 */
export const recordChapterRead = async (
  bookId: string,
  chapterNumber: number
): Promise<void> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    // Get current date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateString = today.toISOString();
    
    // Entry for the current reading
    const historyEntry: ReadingHistory = {
      id: `${bookId}-${chapterNumber}-${Date.now()}`,
      book_id: bookId,
      chapter_number: chapterNumber,
      created_at: new Date().toISOString(),
    };
    
    if (session?.session?.user) {
      // For signed-in users, store in user_profiles table
      // We'll track reading history in the user's profile for now
      await supabase
        .from('user_profiles')
        .update({
          last_streak_date: dateString
        })
        .eq('id', session.session.user.id);
      
      // Update streak and XP here if needed...
    }
    
    // Always store in localStorage for quick local access
    storeLocalReadingHistory(historyEntry);
  } catch (error) {
    console.error('Error recording chapter read:', error);
  }
};

/**
 * Store reading history entry in localStorage
 */
const storeLocalReadingHistory = (entry: ReadingHistory): void => {
  try {
    // Get existing history
    const historyString = localStorage.getItem(LOCAL_STORAGE_KEY);
    let history: ReadingHistory[] = [];
    
    if (historyString) {
      history = JSON.parse(historyString);
    }
    
    // Add new entry at the beginning
    history.unshift(entry);
    
    // Limit the number of entries to prevent localStorage overflow
    if (history.length > MAX_LOCAL_ENTRIES) {
      history = history.slice(0, MAX_LOCAL_ENTRIES);
    }
    
    // Save back to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error storing reading history in localStorage:', error);
  }
};

/**
 * Get the last three chapters read
 * @returns Promise resolving to array of reading history entries
 */
export const getLastThreeReadings = async (): Promise<ReadingHistory[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    // We only implement local storage version since we don't have a
    // reading_history table in the database yet
    return getLocalReadingHistory();
  } catch (error) {
    console.error('Error getting reading history:', error);
    return [];
  }
};

/**
 * Get reading history from localStorage
 */
const getLocalReadingHistory = (): ReadingHistory[] => {
  try {
    const historyString = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (historyString) {
      return JSON.parse(historyString) as ReadingHistory[];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting reading history from localStorage:', error);
    return [];
  }
};
