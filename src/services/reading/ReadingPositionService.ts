
import { supabase } from '@/integrations/supabase/client';
import { ReadingPosition } from '@/types/bible.types';

const LOCAL_STORAGE_KEY = 'last_reading_position';

/**
 * Save the user's last reading position
 * @param versionId Bible version ID
 * @param bookId Book ID
 * @param chapterNumber Chapter number
 * @param verseNumber Optional verse number
 * @returns Promise resolving to success status
 */
export const saveReadingPosition = async (
  versionId: string,
  bookId: string,
  chapterNumber: number,
  verseNumber: number = 1
): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    // Create position object
    const position: ReadingPosition = {
      book_id: bookId,
      chapter: chapterNumber,
      verse: verseNumber,
      version_id: versionId,
      timestamp: new Date().toISOString()
    };
    
    if (session?.session?.user) {
      // We don't have a reading_position column in user_profiles yet
      // Just save to localStorage for now
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(position));
      return true;
    } else {
      // For guest users, store in localStorage only
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(position));
      return true;
    }
  } catch (error) {
    console.error('Error saving reading position:', error);
    return false;
  }
};

/**
 * Get the user's last reading position
 * @returns Promise resolving to position data or null if not found
 */
export const getLastReadingPosition = async (): Promise<ReadingPosition | null> => {
  try {
    console.info('Loading last reading position');
    
    // Check localStorage as our primary storage for now
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      try {
        const localPosition = JSON.parse(localData) as ReadingPosition;
        console.info('Retrieved reading position from localStorage:', localPosition);
        return localPosition;
      } catch (e) {
        console.error('Error parsing localStorage reading position:', e);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting reading position:', error);
    return null;
  }
};

/**
 * Clear the user's reading position
 * @returns Promise resolving to success status
 */
export const clearReadingPosition = async (): Promise<boolean> => {
  try {    
    // Always clear from localStorage
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing reading position:', error);
    return false;
  }
};
