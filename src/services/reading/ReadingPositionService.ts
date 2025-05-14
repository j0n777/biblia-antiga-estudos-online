
import { supabase } from '@/integrations/supabase/client';
import { ReadingPosition } from '@/types/bible.types';

const LOCAL_STORAGE_KEY = 'last_reading_position';

/**
 * Save the user's last reading position
 * @param position Reading position with book, chapter, and optional verse
 * @returns Promise resolving to success status
 */
export const saveReadingPosition = async (position: ReadingPosition): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    // Add timestamp to the position data
    const positionWithTimestamp = {
      ...position,
      timestamp: new Date().toISOString()
    };
    
    if (session?.session?.user) {
      // For signed-in users, store in database
      const { error } = await supabase
        .from('user_profiles')
        .update({
          reading_position: position  // Don't include timestamp in DB - using DB timestamp instead
        })
        .eq('id', session.session.user.id);
        
      if (error) {
        console.error('Error saving reading position:', error);
        // Fall back to localStorage if update fails
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(positionWithTimestamp));
        return false;
      }
      
      // Also save to localStorage as backup
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(positionWithTimestamp));
      return true;
    } else {
      // For guest users, store in localStorage only
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(positionWithTimestamp));
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
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session?.user) {
      // For signed-in users, try database first
      const { data, error } = await supabase
        .from('user_profiles')
        .select('reading_position')
        .eq('id', session.session.user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error getting reading position from DB:', error);
        // Fall back to localStorage
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
          const localPosition = JSON.parse(localData) as ReadingPosition;
          console.info('Retrieved reading position from localStorage:', localPosition);
          return localPosition;
        }
        return null;
      }
      
      if (data?.reading_position) {
        console.info('Retrieved reading position from DB:', data.reading_position);
        return data.reading_position as ReadingPosition;
      }
    }
    
    // Check localStorage as backup or for guest users
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
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session?.user) {
      // For signed-in users, clear in database
      const { error } = await supabase
        .from('user_profiles')
        .update({ reading_position: null })
        .eq('id', session.session.user.id);
        
      if (error) {
        console.error('Error clearing reading position in DB:', error);
      }
    }
    
    // Always clear from localStorage
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing reading position:', error);
    return false;
  }
};
