
import { ReadingPosition } from '../types/bible.types';

// Store key for localStorage
const READING_POSITION_KEY = 'bible_reading_position';

/**
 * Save the current reading position to localStorage
 */
export const saveReadingPosition = (
  versionId: string,
  bookId: string,
  chapterNumber: number,
  verseNumber?: number
): void => {
  const position: ReadingPosition = {
    version_id: versionId,
    book_id: bookId,
    chapter_number: chapterNumber,
    verse_number: verseNumber,
    timestamp: new Date()
  };
  
  localStorage.setItem(READING_POSITION_KEY, JSON.stringify(position));
};

/**
 * Get the last reading position from localStorage
 */
export const getLastReadingPosition = (): ReadingPosition | null => {
  const savedPosition = localStorage.getItem(READING_POSITION_KEY);
  
  if (!savedPosition) {
    return null;
  }
  
  try {
    const position = JSON.parse(savedPosition);
    position.timestamp = new Date(position.timestamp);
    return position;
  } catch (error) {
    console.error('Error parsing reading position:', error);
    return null;
  }
};

/**
 * Clear the reading position from localStorage
 */
export const clearReadingPosition = (): void => {
  localStorage.removeItem(READING_POSITION_KEY);
};
