import { supabase } from '@/integrations/supabase/client';
import { ReadingPosition } from '../types/bible.types';

export const saveReadingPosition = async (
  versionId: string,
  bookId: string,
  chapter: number, 
  verse: number
): Promise<boolean> => {
  try {
    const timestamp = new Date().toISOString();
    
    // Save in user profile if user is authenticated
    // Otherwise save in localStorage
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData?.session?.user) {
      // User is authenticated, save to their profile
      const { error } = await supabase
        .from('user_profiles')
        .update({
          last_reading_position: { versionId, bookId, chapter, verse, timestamp }
        })
        .eq('id', sessionData.session.user.id);
        
      if (error) {
        console.error('Error saving reading position to profile:', error);
        // Fall back to localStorage if server update fails
        saveLocalReadingPosition(versionId, bookId, chapter, verse);
        return false;
      }
      return true;
    } else {
      // No authenticated user, save to localStorage
      saveLocalReadingPosition(versionId, bookId, chapter, verse);
      return true;
    }
  } catch (error) {
    console.error('Error in saveReadingPosition:', error);
    // Fall back to localStorage
    saveLocalReadingPosition(versionId, bookId, chapter, verse);
    return false;
  }
};

export const getLastReadingPosition = async (): Promise<ReadingPosition | null> => {
  try {
    // Check if there's an authenticated user
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData?.session?.user) {
      // User is authenticated, get from their profile
      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('last_reading_position')
        .eq('id', sessionData.session.user.id)
        .single();
        
      if (error || !profileData?.last_reading_position) {
        // Fall back to localStorage if no server data
        return getLocalReadingPosition();
      }
      
      return profileData.last_reading_position as ReadingPosition;
    } else {
      // No authenticated user, get from localStorage
      return getLocalReadingPosition();
    }
  } catch (error) {
    console.error('Error in getLastReadingPosition:', error);
    // Fall back to localStorage
    return getLocalReadingPosition();
  }
};

export const clearReadingPosition = (): void => {
  try {
    localStorage.removeItem('bible_reading_position');
  } catch (error) {
    console.error('Error in clearReadingPosition:', error);
  }
};

// Helper functions for localStorage
const saveLocalReadingPosition = (
  versionId: string,
  bookId: string,
  chapter: number,
  verse: number
): void => {
  try {
    const position: ReadingPosition = {
      version_id: versionId,
      book_id: bookId,
      chapter,
      verse,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('bible_reading_position', JSON.stringify(position));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const getLocalReadingPosition = (): ReadingPosition | null => {
  try {
    const saved = localStorage.getItem('bible_reading_position');
    if (!saved) return null;
    return JSON.parse(saved) as ReadingPosition;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};
