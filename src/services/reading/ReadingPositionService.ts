
import { supabase } from '@/integrations/supabase/client';
import { ReadingPosition } from '@/types/bible.types';
import { getUserProfile, updateUserProfile } from '../ProfileService';

/**
 * Save user's current reading position
 * @param versionId Bible version ID
 * @param bookId Bible book ID
 * @param chapter Chapter number
 * @param verse Verse number (optional, defaults to 1)
 * @returns Promise resolving to true if saved successfully
 */
export const saveReadingPosition = async (
  versionId: string,
  bookId: string,
  chapter: number,
  verse: number = 1
): Promise<boolean> => {
  try {
    // Create reading position object
    const readingPosition: ReadingPosition = {
      version_id: versionId,
      book_id: bookId,
      chapter: chapter,
      verse: verse
    };

    // Get user profile
    const profile = await getUserProfile();
    
    // For non-authenticated users, save to localStorage
    if (!profile?.id || profile.id === 'local' || profile.id.startsWith('guest-')) {
      localStorage.setItem('reading_position', JSON.stringify(readingPosition));
      return true;
    }

    // For authenticated users, update their profile
    const updateResult = await updateUserProfile({
      reading_position: JSON.stringify(readingPosition)
    });
    
    return updateResult;
  } catch (error) {
    console.error('Error saving reading position:', error);
    return false;
  }
};

/**
 * Get user's last reading position
 * @returns Promise resolving to the reading position, or null if not available
 */
export const getLastReadingPosition = async (): Promise<ReadingPosition | null> => {
  try {
    // Get user profile
    const profile = await getUserProfile();
    
    // For non-authenticated users, get from localStorage
    if (!profile?.id || profile.id === 'local' || profile.id.startsWith('guest-')) {
      const storedPosition = localStorage.getItem('reading_position');
      return storedPosition ? JSON.parse(storedPosition) : null;
    }

    // For authenticated users, get from their profile
    if (profile.reading_position) {
      // Handle both string and direct object formats
      if (typeof profile.reading_position === 'string') {
        return JSON.parse(profile.reading_position);
      }
      return profile.reading_position;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting reading position:', error);
    return null;
  }
};

/**
 * Clear user's reading position
 * @returns Promise resolving to true if cleared successfully
 */
export const clearReadingPosition = async (): Promise<boolean> => {
  try {
    // Get user profile
    const profile = await getUserProfile();
    
    // For non-authenticated users, remove from localStorage
    if (!profile?.id || profile.id === 'local' || profile.id.startsWith('guest-')) {
      localStorage.removeItem('reading_position');
      return true;
    }

    // For authenticated users, update their profile to remove reading position
    const updateResult = await updateUserProfile({
      reading_position: null
    });
    
    return updateResult;
  } catch (error) {
    console.error('Error clearing reading position:', error);
    return false;
  }
};
