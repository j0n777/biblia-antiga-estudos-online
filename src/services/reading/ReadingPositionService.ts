
import { ReadingPosition } from '@/types/bible.types';
import { isUserAuthenticated } from '../AuthService';

/**
 * Save user's reading position
 * @param versionId Bible version ID
 * @param bookId Bible book ID
 * @param chapter Chapter number
 * @param verse Verse number
 * @returns Promise resolving to success status
 */
export async function saveReadingPosition(
  versionId: string,
  bookId: string,
  chapter: number,
  verse: number | string = 1
): Promise<boolean> {
  try {
    // Ensure verse is a number
    const verseNumber = typeof verse === 'string' ? parseInt(verse, 10) : verse;
    
    const readingPosition: ReadingPosition = {
      version_id: versionId,
      book_id: bookId,
      chapter: chapter,
      verse: verseNumber,
      timestamp: new Date().toISOString()
    };
    
    const isAuth = await isUserAuthenticated();
    
    if (!isAuth) {
      // Store in localStorage for non-authenticated users
      localStorage.setItem('last_reading_position', JSON.stringify(readingPosition));
      return true;
    }
    
    // For authenticated users (to be implemented)
    // Fallback to localStorage for now
    localStorage.setItem('last_reading_position', JSON.stringify(readingPosition));
    
    return true;
  } catch (error) {
    console.error('Error saving reading position:', error);
    return false;
  }
}

/**
 * Get user's last reading position
 * @returns Promise resolving to reading position
 */
export async function getLastReadingPosition(): Promise<ReadingPosition | null> {
  try {
    const isAuth = await isUserAuthenticated();
    
    if (!isAuth) {
      // Get position from localStorage
      const position = localStorage.getItem('last_reading_position');
      if (!position) return null;
      
      try {
        const parsedPosition = JSON.parse(position);
        
        // Ensure numeric properties are proper numbers
        const validatedPosition: ReadingPosition = {
          ...parsedPosition,
          chapter: Number(parsedPosition.chapter),
          verse: Number(parsedPosition.verse)
        };
        
        return validatedPosition;
      } catch (e) {
        console.error('Error parsing reading position:', e);
        return null;
      }
    }
    
    // For authenticated users (to be implemented)
    return null;
  } catch (error) {
    console.error('Error getting last reading position:', error);
    return null;
  }
}

/**
 * Clear user's reading position
 * @returns Promise resolving to success status
 */
export async function clearReadingPosition(): Promise<boolean> {
  try {
    const isAuth = await isUserAuthenticated();
    
    if (!isAuth) {
      localStorage.removeItem('last_reading_position');
      return true;
    }
    
    // For authenticated users (to be implemented)
    return true;
  } catch (error) {
    console.error('Error clearing reading position:', error);
    return false;
  }
}
