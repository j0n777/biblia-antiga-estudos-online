import { ReadingPosition } from '../types/bible.types';
import { supabase } from '../integrations/supabase/client';

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
  
  // Track this reading in the database if user is logged in
  trackReadingInDatabase(versionId, bookId, chapterNumber, verseNumber);
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

/**
 * Track reading in database for achievements and streaks
 */
const trackReadingInDatabase = async (
  versionId: string,
  bookId: string,
  chapterNumber: number,
  verseNumber?: number
): Promise<void> => {
  if (!verseNumber) return; // We need a verse number to track
  
  // Check if user is authenticated first
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) return;
  
  const userId = session.session.user.id;
  const today = new Date().toISOString().split('T')[0];
  
  try {
    // Check if we already have a record for this chapter today
    const { data: existingRecord, error: fetchError } = await supabase
      .from('user_reading_history')
      .select('id, verses_read')
      .eq('user_id', userId)
      .eq('date', today)
      .eq('version_id', versionId)
      .eq('book_id', bookId)
      .eq('chapter_number', chapterNumber)
      .maybeSingle();
      
    if (fetchError) {
      throw fetchError;
    }
    
    if (existingRecord) {
      // Update existing record if verse isn't already recorded
      if (!existingRecord.verses_read.includes(verseNumber)) {
        await supabase
          .from('user_reading_history')
          .update({ 
            verses_read: [...existingRecord.verses_read, verseNumber] 
          })
          .eq('id', existingRecord.id);
      }
    } else {
      // Create new record
      await supabase
        .from('user_reading_history')
        .insert({
          user_id: userId,
          version_id: versionId,
          book_id: bookId,
          chapter_number: chapterNumber,
          verses_read: [verseNumber]
        });
        
      // Update user streak on first record for the day
      updateStreakCount(userId);
    }
  } catch (error) {
    console.error('Error tracking reading:', error);
  }
};

/**
 * Update user streak count
 */
const updateStreakCount = async (userId: string): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get current streak info
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('streak_count, last_streak_date')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      throw profileError;
    }
    
    let newStreakCount = profile.streak_count || 0;
    const lastDate = profile.last_streak_date ? new Date(profile.last_streak_date) : null;
    
    // Check if we need to update streak
    if (!lastDate) {
      // First time reading
      newStreakCount = 1;
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastDateNoTime = new Date(lastDate);
      lastDateNoTime.setHours(0, 0, 0, 0);
      
      if (lastDateNoTime.getTime() === yesterday.getTime()) {
        // Reading on consecutive day
        newStreakCount += 1;
      } else if (lastDateNoTime.getTime() < yesterday.getTime()) {
        // Streak broken
        newStreakCount = 1;
      }
      // If already read today, keep streak the same
    }
    
    // Update profile
    await supabase
      .from('user_profiles')
      .update({ 
        streak_count: newStreakCount, 
        last_streak_date: today.toISOString().split('T')[0] 
      })
      .eq('id', userId);
  } catch (error) {
    console.error('Error updating streak count:', error);
  }
};
