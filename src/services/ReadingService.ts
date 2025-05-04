
import { supabase } from '@/integrations/supabase/client';
import { ReadingPosition } from '../types/bible.types';

export async function saveReadingPosition(
  versionId: string,
  bookId: string,
  chapterNumber: number,
  verseNumber: number = 1
): Promise<boolean> {
  try {
    console.log(`Saving reading position: ${versionId} ${bookId} ${chapterNumber}:${verseNumber}`);
    
    // Check if the user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.log('User not authenticated, storing in localStorage');
      
      // Store in localStorage for non-authenticated users
      localStorage.setItem('last_reading_position', JSON.stringify({
        version_id: versionId,
        book_id: bookId,
        chapter_number: chapterNumber,
        verse_number: verseNumber,
        timestamp: new Date().toISOString()
      }));
      return true;
    }
    
    // For authenticated users, update their profile
    const readingPosition: ReadingPosition = {
      version_id: versionId,
      book_id: bookId,
      chapter_number: chapterNumber,
      verse_number: verseNumber,
      timestamp: new Date().toISOString()
    };

    const { error } = await supabase
      .from('user_profiles')
      .update({
        reading_position: readingPosition
      })
      .eq('user_id', session.session.user.id);
      
    if (error) {
      throw new Error(`Error saving reading position: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveReadingPosition:', error);
    return false;
  }
}

export async function getLastReadingPosition(): Promise<ReadingPosition | null> {
  try {
    // Check if the user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.log('User not authenticated, getting from localStorage');
      
      // Get from localStorage for non-authenticated users
      const storedPosition = localStorage.getItem('last_reading_position');
      if (!storedPosition) return null;
      
      return JSON.parse(storedPosition) as ReadingPosition;
    }
    
    // For authenticated users, get from their profile
    const { data, error } = await supabase
      .from('user_profiles')
      .select('reading_position')
      .eq('user_id', session.session.user.id)
      .single();
      
    if (error || !data?.reading_position) {
      console.log('No reading position found in profile');
      return null;
    }
    
    return data.reading_position as ReadingPosition;
  } catch (error) {
    console.error('Error in getLastReadingPosition:', error);
    return null;
  }
}

export async function clearReadingPosition(): Promise<boolean> {
  try {
    // Check if the user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      // Remove from localStorage for non-authenticated users
      localStorage.removeItem('last_reading_position');
      return true;
    }
    
    // For authenticated users, update their profile
    const { error } = await supabase
      .from('user_profiles')
      .update({
        reading_position: null
      })
      .eq('user_id', session.session.user.id);
      
    if (error) {
      throw new Error(`Error clearing reading position: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in clearReadingPosition:', error);
    return false;
  }
}
