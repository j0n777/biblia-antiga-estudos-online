
import { supabase } from '@/integrations/supabase/client';
import { ReadingPosition } from '../types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';

// Save reading position (both locally and in DB if user is logged in)
export const saveReadingPosition = async (
  versionId: string, 
  bookId: string, 
  chapterNumber: number, 
  verseNumber?: number
): Promise<void> => {
  try {
    // First save to local storage so it's always available
    const position: ReadingPosition = {
      version_id: versionId,
      book_id: bookId,
      chapter_number: chapterNumber,
      verse_number: verseNumber,
      timestamp: new Date()
    };
    
    localStorage.setItem('lastReadingPosition', JSON.stringify(position));
    
    // If user is logged in, also save to database
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      // Mock database saving for now
      console.log('Saved reading position to mock database:', position);
    }
  } catch (error) {
    console.error('Error saving reading position:', error);
  }
};

// Get the default reading position based on language
export const getDefaultReadingPosition = (language: string = 'pt-BR'): ReadingPosition => {
  // Matthew 1:1 is the default verse for all languages
  const bookId = 'mt';
  const chapterNumber = 1;
  
  // Map language to version ID
  let versionId: string;
  switch (language) {
    case 'pt-BR':
      versionId = 'nvi';
      break;
    case 'en':
      versionId = 'kjv';
      break;
    case 'es':
      versionId = 'rv1960';
      break;
    case 'fr':
      versionId = 'lsg';
      break;
    case 'ar':
      versionId = 'svd';
      break;
    default:
      versionId = 'kjv';
  }
  
  return {
    version_id: versionId,
    book_id: bookId,
    chapter_number: chapterNumber,
    verse_number: 1,
    timestamp: new Date()
  };
};

// Get the last reading position
export const getLastReadingPosition = (language: string = 'pt-BR'): ReadingPosition => {
  try {
    const savedPosition = localStorage.getItem('lastReadingPosition');
    if (!savedPosition) {
      return getDefaultReadingPosition(language);
    }
    
    const position = JSON.parse(savedPosition) as ReadingPosition;
    position.timestamp = new Date(position.timestamp);
    
    return position;
  } catch (error) {
    console.error('Error getting reading position:', error);
    return getDefaultReadingPosition(language);
  }
};

// Clear reading position
export const clearReadingPosition = (): void => {
  localStorage.removeItem('lastReadingPosition');
};

// Track verses read
export const trackVersesRead = async (
  bookId: string, 
  chapterNumber: number, 
  verses: number[]
): Promise<void> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      return; // Only track for logged in users
    }
    
    // Mock implementation
    console.log(`Tracked ${verses.length} verses read`);
  } catch (error) {
    console.error('Error tracking verses read:', error);
  }
};

// Check if user has a streak and update it
export const checkAndUpdateStreak = async (): Promise<number> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      // Return mock streak for guest users
      return 0;
    }
    
    // Mock functionality for now
    return 5; // Mock streak count
  } catch (error) {
    console.error('Error updating streak:', error);
    return 0;
  }
};
