
import { supabase } from '@/integrations/supabase/client';
import { BookContent, BibleVerse, BibleChapter } from '@/types/bible.types';
import { getBookChapters } from './BibleBooksService';

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
    console.info(`Fetching chapter: Book=${bookId}, Chapter=${chapterNumber}, Version=${versionId}`);
    
    // Get the chapter ID first
    const { data: chapterData, error: chapterError } = await supabase
      .from('bible_chapters')
      .select('*')
      .eq('book_id', bookId)
      .eq('chapter_number', chapterNumber)
      .eq('version_id', versionId)
      .maybeSingle();
      
    if (chapterError || !chapterData) {
      console.error('Error fetching chapter:', chapterError);
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
    
    // Get the book name
    const { data: bookData } = await supabase
      .from('bible_books')
      .select('name')
      .eq('book_id', bookId)
      .eq('version_id', versionId)
      .maybeSingle();
      
    const bookName = bookData?.name || bookId;
    
    // Create the content object
    const content: BookContent = {
      id: chapterData.id,
      book_id: bookId,
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
 * Search the Bible for specific text
 * @param query Search query
 * @param versionId Bible version ID
 * @param limit Maximum number of results to return
 * @returns Promise resolving to array of matching verses
 */
export const searchBibleVerses = async (
  query: string, 
  versionId: string = 'kja', 
  limit: number = 20
): Promise<BibleVerse[]> => {
  if (!query || query.trim().length < 3) {
    return [];
  }
  
  try {
    console.log(`Searching Bible for "${query}" in version ${versionId}`);
    
    // For basic search, we use the ILIKE operator to perform case-insensitive search
    const { data, error } = await supabase
      .from('bible_verses')
      .select('*')
      .eq('version_id', versionId)
      .ilike('text', `%${query}%`)
      .limit(limit);
      
    if (error) {
      console.error('Error searching Bible:', error);
      return [];
    }
    
    console.log(`Search results for "${query}":`, data?.length || 0);
    
    // Create a lookup of book names for better display
    const bookIds = [...new Set(data.map(verse => verse.book_id))];
    
    const { data: books } = await supabase
      .from('bible_books')
      .select('book_id, name')
      .eq('version_id', versionId)
      .in('book_id', bookIds);
      
    const bookNames = (books || []).reduce((acc: Record<string, string>, book) => {
      acc[book.book_id] = book.name;
      return acc;
    }, {});
    
    // Transform the response
    return data.map(verse => ({
      ...verse,
      book_name: bookNames[verse.book_id] || verse.book_id
    }));
  } catch (error) {
    console.error('Error in searchBible:', error);
    return [];
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
    const content = await getBookContent(bookId, chapterNumber, versionId);
    
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
