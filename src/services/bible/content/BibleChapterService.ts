
import { supabase } from '@/integrations/supabase/client';
import { BookContent, BibleChapter } from '@/types/bible.types';
import { getUserProfile } from '@/services/ProfileService';

/**
 * Get content for a specific chapter
 * @param bookId Book ID
 * @param chapterNumber Chapter number
 * @param versionId Bible version ID
 * @returns Promise resolving to chapter content
 */
export const getBookContent = async (
  bookId: string, 
  chapterNumber: number, 
  versionId: string = 'kja'
): Promise<BookContent> => {
  try {
    if (!bookId) {
      console.error("Invalid book ID provided:", bookId);
      throw new Error('Invalid book ID');
    }
    
    if (isNaN(chapterNumber) || chapterNumber <= 0) {
      console.error("Invalid chapter number:", chapterNumber);
      throw new Error('Invalid chapter number');
    }
    
    console.info(`Fetching chapter: Book=${bookId}, Chapter=${chapterNumber}, Version=${versionId}`);
    
    // Make sure bookId is lowercase as stored in database
    const normalizedBookId = bookId.toLowerCase();
    
    // Get the chapter ID first
    const { data: chapterData, error: chapterError } = await supabase
      .from('bible_chapters')
      .select('*')
      .eq('book_id', normalizedBookId)
      .eq('chapter_number', chapterNumber)
      .eq('version_id', versionId)
      .maybeSingle();
      
    if (chapterError) {
      console.error('Error fetching chapter:', chapterError);
      throw new Error('Error fetching chapter');
    }
    
    if (!chapterData) {
      console.error('Chapter not found:', { bookId: normalizedBookId, chapterNumber, versionId });
      throw new Error('Chapter not found');
    }
    
    // Get all verses for this chapter
    const { data: verses, error: versesError } = await supabase
      .from('bible_verses')
      .select('*')
      .eq('chapter_id', chapterData.id)
      .order('verse_number', { ascending: true });
      
    if (versesError) {
      console.error('Error fetching verses:', versesError);
      throw new Error('Verses not found');
    }
    
    // Get the book name for better display
    const { data: bookData } = await supabase
      .from('bible_books')
      .select('name')
      .eq('book_id', normalizedBookId)
      .eq('version_id', versionId)
      .maybeSingle();
      
    const bookName = bookData?.name || normalizedBookId;
    
    // Create the content object
    const content: BookContent = {
      id: chapterData.id,
      book_id: normalizedBookId,
      book_name: bookName,
      chapter_number: chapterNumber,
      verses: verses || []
    };
    
    return content;
  } catch (error) {
    console.error('Error in getBookContent:', error);
    throw error;
  }
};

/**
 * Get a specific chapter with all its verses
 * @param bookId Book ID
 * @param chapterNumber Chapter number
 * @param versionId Bible version ID
 * @returns Promise resolving to chapter with verses
 */
export const getChapter = async (
  bookId: string,
  chapterNumber: number,
  versionId: string = 'kja'
): Promise<BibleChapter> => {
  try {
    if (!bookId) {
      console.error("Invalid book ID provided:", bookId);
      throw new Error('Invalid book ID');
    }
    
    if (isNaN(chapterNumber) || chapterNumber <= 0) {
      console.error("Invalid chapter number:", chapterNumber);
      throw new Error('Invalid chapter number');
    }
    
    // Make sure bookId is lowercase as stored in database
    const normalizedBookId = bookId.toLowerCase();
    
    // If no version specified, get user's preferred version
    if (!versionId || versionId === 'default') {
      const userProfile = await getUserProfile();
      versionId = userProfile.preferred_bible_version || 'kja';
    }
    
    const content = await getBookContent(normalizedBookId, chapterNumber, versionId);
    
    // Convert from BookContent to BibleChapter
    const chapter: BibleChapter = {
      id: content.id,
      book_id: content.book_id,
      chapter_number: content.chapter_number,
      book_name: content.book_name,
      verses: content.verses,
      verses_count: content.verses.length,
      version_id: versionId
    };
    
    return chapter;
  } catch (error) {
    console.error(`Error getting chapter: ${bookId} ${chapterNumber}`, error);
    throw error;
  }
};
