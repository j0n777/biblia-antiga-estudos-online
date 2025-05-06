import { supabase } from '@/integrations/supabase/client';
import { ReadingPosition, ReadingHistory } from '@/types/bible.types';
import { getUserProfile } from './ProfileService';
import { updateUserProfile } from './ProfileService';

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
      verse: verse,
      timestamp: new Date().toISOString()
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
      reading_position: readingPosition
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

/**
 * Get reading history for the current user
 * @param limit Number of records to return (default 20)
 * @returns Promise resolving to array of ReadingHistory objects
 */
export async function getReadingHistory(limit: number = 20): Promise<ReadingHistory[]> {
  try {
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      // For non-authenticated users, get from localStorage
      const historyStr = localStorage.getItem('reading_history');
      if (!historyStr) return [];
      
      try {
        const history = JSON.parse(historyStr) as ReadingHistory[];
        // Sort by timestamp, most recent first
        return history.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ).slice(0, limit);
      } catch (error) {
        console.error('Error parsing reading history:', error);
        return [];
      }
    }
    
    // For authenticated users, get from database
    const { data, error } = await supabase
      .from('reading_history')
      .select('*')
      .eq('user_id', session.session.user.id)
      .order('timestamp', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching reading history:', error);
      return [];
    }
    
    return data as ReadingHistory[];
  } catch (error) {
    console.error('Error getting reading history:', error);
    return [];
  }
}

/**
 * Add or update reading history entry
 * @param bookId Book ID
 * @param chapter Chapter number
 * @param verse Optional verse number
 * @returns Promise resolving to success status
 */
export async function trackReading(
  bookId: string, 
  chapter: number, 
  verse?: number
): Promise<boolean> {
  try {
    console.log(`Tracking reading: ${bookId} ${chapter}:${verse || 1}`);
    
    const timestamp = new Date().toISOString();
    const historyEntry: ReadingHistory = {
      book_id: bookId,
      chapter: chapter,
      verse: verse || 1,
      timestamp
    };
    
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      console.log('User not authenticated, storing in localStorage');
      
      // For non-authenticated users, store in localStorage
      const historyStr = localStorage.getItem('reading_history');
      let history: ReadingHistory[] = [];
      
      if (historyStr) {
        try {
          history = JSON.parse(historyStr) as ReadingHistory[];
        } catch (error) {
          console.error('Error parsing reading history:', error);
        }
      }
      
      // Add new entry
      history.unshift(historyEntry);
      
      // Keep only recent entries (e.g., last 100)
      history = history.slice(0, 100);
      
      localStorage.setItem('reading_history', JSON.stringify(history));
      return true;
    }
    
    // For authenticated users, store in database
    const { error } = await supabase
      .from('reading_history')
      .insert({
        user_id: session.session.user.id,
        ...historyEntry
      });
      
    if (error) {
      console.error('Error tracking reading:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking reading:', error);
    return false;
  }
}

export async function getLastThreeReadings(): Promise<ReadingHistory[]> {
  try {
    const history = await getReadingHistory(3);
    return history;
  } catch (error) {
    console.error('Error getting last readings:', error);
    return [];
  }
}

/**
 * Clear reading history
 * @returns Promise resolving to success status
 */
export async function clearReadingHistory(): Promise<boolean> {
  try {
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      // For non-authenticated users, clear localStorage
      localStorage.removeItem('reading_history');
      return true;
    }
    
    // For authenticated users, delete from database
    const { error } = await supabase
      .from('reading_history')
      .delete()
      .eq('user_id', session.session.user.id);
      
    if (error) {
      console.error('Error clearing reading history:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing reading history:', error);
    return false;
  }
}
