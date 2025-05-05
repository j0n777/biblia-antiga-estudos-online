
import { supabase } from '@/integrations/supabase/client';
import { SavedVerse } from '@/types/bible.types';
import { getBibleBooks } from './BibleDataService';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Get saved verses
 * @returns Promise resolving to array of saved verses
 */
export async function getSavedVerses(): Promise<SavedVerse[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      // Get from localStorage for non-authenticated users
      const savedVerses = localStorage.getItem('saved_verses');
      if (!savedVerses) return [];
      
      return JSON.parse(savedVerses);
    }
    
    // For authenticated users, get from database
    const { data, error } = await supabase
      .from('saved_verses')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching saved verses:', error);
      return [];
    }
    
    return data as SavedVerse[];
  } catch (error) {
    console.error('Error getting saved verses:', error);
    return [];
  }
}

/**
 * Save a verse to user's collection
 * @param bookId Bible book ID
 * @param chapterNumber Chapter number
 * @param verseNumber Verse number
 * @param versionId Bible version ID
 * @param color Highlight color
 * @returns Promise resolving to success status
 */
export async function saveVerse(
  bookId: string,
  chapterNumber: number,
  verseNumber: number,
  versionId: string = 'kja',
  color: string = 'yellow'
): Promise<boolean> {
  try {
    console.log(`Saving verse: ${bookId} ${chapterNumber}:${verseNumber} (${versionId})`);
    
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.log('User not authenticated, storing in localStorage');
      
      // Store in localStorage for non-authenticated users
      const savedVerses = JSON.parse(localStorage.getItem('saved_verses') || '[]');
      
      // Check if verse is already saved
      const verseIndex = savedVerses.findIndex((v: any) => 
        v.book_id === bookId && 
        v.chapter_number === chapterNumber && 
        v.verse_number === verseNumber
      );
      
      if (verseIndex >= 0) {
        // Update existing saved verse
        savedVerses[verseIndex].color = color;
      } else {
        // Add new saved verse
        savedVerses.push({
          id: 'local-' + Date.now(),
          book_id: bookId,
          chapter_number: chapterNumber,
          verse_number: verseNumber,
          version_id: versionId,
          highlight_color: color,
          saved_at: new Date().toISOString()
        });
      }
      
      localStorage.setItem('saved_verses', JSON.stringify(savedVerses));
      return true;
    }
    
    // For authenticated users, save in database
    const { data, error } = await supabase
      .from('saved_verses')
      .upsert({
        user_id: session.session.user.id,
        book_id: bookId,
        chapter_number: chapterNumber,
        verse_number: verseNumber,
        version_id: versionId,
        highlight_color: color,
        saved_at: new Date().toISOString()
      }, { onConflict: 'user_id, book_id, chapter_number, verse_number' });
      
    if (error) {
      console.error('Error saving verse:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving verse:', error);
    return false;
  }
}
