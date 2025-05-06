
import { supabase } from '@/integrations/supabase/client';
import { BibleBook, BibleChapter } from '@/types/bible.types';

/**
 * Get all Bible books
 * @param versionId Bible version ID
 * @returns Promise resolving to array of Bible books
 */
export const getAllBooks = async (versionId: string = 'kja'): Promise<BibleBook[]> => {
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
      order: book.position || 0, // Map position to order
      chapters_count: book.chapters_count,
      position: book.position,
      version_id: book.version_id
    }));
    
    return books;
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    return [];
  }
};

/**
 * Alias for getAllBooks - to maintain compatibility with existing code
 * @param versionId Bible version ID
 * @returns Promise resolving to array of Bible books
 */
export const getBibleBooks = getAllBooks;

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
      book_name: bookName,
      verses_count: chapter.verses_count,
      version_id: versionId
    }));
    
    return chapters;
  } catch (error) {
    console.error('Error in getBookChapters:', error);
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
  const books = await getAllBooks(versionId);
  return books.filter(book => book.testament.toLowerCase() === testament);
};
