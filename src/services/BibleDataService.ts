
import { supabase } from '@/integrations/supabase/client';
import { BibleBook, BibleChapter, BibleVerse, BookContent } from '@/types/bible.types';

/**
 * Get all Bible books
 * @param versionId Bible version ID
 * @returns Promise resolving to array of Bible books
 */
export const getBibleBooks = async (versionId: string = 'kja'): Promise<BibleBook[]> => {
  try {
    console.info(`Getting all books for version: ${versionId}`);
    
    const { data, error } = await supabase
      .from('bible_books')
      .select('*')
      .eq('version_id', versionId)
      .order('position', { ascending: true });
      
    if (error) {
      console.error('Error fetching Bible books:', error);
      return [];
    }
    
    // Transform the response to match BibleBook type
    const books: BibleBook[] = data.map(book => ({
      book_id: book.book_id,
      name: book.name,
      testament: book.testament,
      order: book.position, // Map position to order
      chapters_count: book.chapters_count,
      position: book.position,
      version_id: book.version_id
    }));
    
    return books;
  } catch (error) {
    console.error('Error in getBibleBooks:', error);
    return [];
  }
};

/**
 * Get all chapters for a specific book
 * @param bookId Book ID
 * @param versionId Bible version ID
 * @returns Promise resolving to array of chapters
 */
export const getBookChapters = async (bookId: string, versionId: string = 'kja'): Promise<BibleChapter[]> => {
  try {
    const { data, error } = await supabase
      .from('bible_chapters')
      .select('*')
      .eq('book_id', bookId)
      .eq('version_id', versionId)
      .order('chapter_number', { ascending: true });
      
    if (error) {
      console.error('Error fetching book chapters:', error);
      return [];
    }
    
    // Get the book name for better display
    const { data: bookData } = await supabase
      .from('bible_books')
      .select('name')
      .eq('book_id', bookId)
      .eq('version_id', versionId)
      .single();
      
    const bookName = bookData?.name || bookId;
    
    // Transform the response to match BibleChapter type
    const chapters: BibleChapter[] = data.map(chapter => ({
      id: chapter.id,
      book_id: chapter.book_id,
      chapter_number: chapter.chapter_number,
      book_name: bookName
    }));
    
    return chapters;
  } catch (error) {
    console.error('Error in getBookChapters:', error);
    return [];
  }
};

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
      .single();
      
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
      .single();
      
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
export const searchBible = async (
  query: string, 
  versionId: string = 'kja', 
  limit: number = 20
): Promise<BibleVerse[]> => {
  if (!query || query.trim().length < 3) {
    return [];
  }
  
  try {
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
 * Get the books of the Bible by testament
 * @param testament 'old' or 'new'
 * @param versionId Bible version ID
 * @returns Array of Bible books filtered by testament
 */
export const getBooksByTestament = async (
  testament: 'old' | 'new', 
  versionId: string = 'kja'
): Promise<BibleBook[]> => {
  const books = await getBibleBooks(versionId);
  return books.filter(book => book.testament.toLowerCase() === testament);
};
