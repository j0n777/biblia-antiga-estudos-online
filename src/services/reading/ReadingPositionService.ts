
import { ReadingPosition } from '@/types/bible.types';

/**
 * Save reading position to local storage
 * @param versionId Bible version ID
 * @param bookId Bible book ID
 * @param chapterNumber Chapter number
 * @param verseNumber Verse number
 * @returns Promise resolving to success status
 */
export async function saveReadingPosition(
  versionId: string,
  bookId: string,
  chapterNumber: number | string,
  verseNumber: number | string = 1
): Promise<boolean> {
  try {
    // Ensure numbers are parsed as integers
    const chapter = typeof chapterNumber === 'string' ? parseInt(chapterNumber, 10) : chapterNumber;
    const verse = typeof verseNumber === 'string' ? parseInt(verseNumber, 10) : verseNumber;
    
    // Log what we're saving
    console.log(`Saving reading position: ${versionId} ${bookId} ${chapter}:${verse}`);
    
    const position: ReadingPosition = {
      version_id: versionId,
      book_id: bookId,
      chapter: chapter,
      verse: verse
    };
    
    // Save to localStorage
    localStorage.setItem('last_reading_position', JSON.stringify(position));
    
    // Update last read timestamp for streak calculations
    const now = new Date().toISOString();
    localStorage.setItem('last_read_timestamp', now);
    
    return true;
  } catch (error) {
    console.error('Error saving reading position:', error);
    return false;
  }
}

/**
 * Get last reading position from local storage
 * @returns Promise resolving to reading position
 */
export async function getLastReadingPosition(): Promise<ReadingPosition | null> {
  try {
    const positionJSON = localStorage.getItem('last_reading_position');
    if (!positionJSON) return null;
    
    return JSON.parse(positionJSON) as ReadingPosition;
  } catch (error) {
    console.error('Error getting reading position:', error);
    return null;
  }
}

/**
 * Clear reading position from local storage
 * @returns Promise resolving to success status
 */
export async function clearReadingPosition(): Promise<boolean> {
  try {
    localStorage.removeItem('last_reading_position');
    return true;
  } catch (error) {
    console.error('Error clearing reading position:', error);
    return false;
  }
}
