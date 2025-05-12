
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
    
    if (!data || data.length === 0) {
      console.warn(`No books found for version: ${versionId}, trying default version`);
      // Try with default version if no books found for specified version
      const { data: defaultData, error: defaultError } = await supabase
        .from('bible_books')
        .select('*')
        .eq('version_id', 'kja')
        .order('position', { ascending: true });
        
      if (defaultError || !defaultData || defaultData.length === 0) {
        console.error('No books found for default version:', defaultError);
        return [];
      }
      
      // Transform the response to match BibleBook type
      const books: BibleBook[] = defaultData.map(book => ({
        book_id: book.book_id.toLowerCase(), // Ensure book_id is lowercase
        name: book.name || book.book_id, // Use book_id as fallback for name
        testament: book.testament,
        order: book.position || 0, // Map position to order
        chapters_count: book.chapters_count || 0,
        position: book.position || 0,
        version_id: book.version_id
      }));
      
      return books;
    }
    
    // Transform the response to match BibleBook type
    const books: BibleBook[] = data.map(book => ({
      book_id: book.book_id.toLowerCase(), // Ensure book_id is lowercase
      name: book.name || book.book_id, // Use book_id as fallback for name
      testament: book.testament,
      order: book.position || 0, // Map position to order
      chapters_count: book.chapters_count || 0,
      position: book.position || 0,
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
    if (!bookId) {
      console.error('Invalid book ID provided:', bookId);
      return [];
    }
    
    // Make sure bookId is lowercase as stored in database
    const normalizedBookId = bookId.toLowerCase();
    console.info(`Getting chapters for book: ${normalizedBookId}, version: ${versionId}`);
    
    const { data, error } = await supabase
      .from('bible_chapters')
      .select('*')
      .eq('book_id', normalizedBookId)
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
      .eq('book_id', normalizedBookId)
      .eq('version_id', versionId)
      .maybeSingle();
      
    const bookName = bookData?.name || normalizedBookId;
    
    // Transform the response to match BibleChapter type
    const chapters: BibleChapter[] = data.map(chapter => ({
      id: chapter.id,
      book_id: normalizedBookId,
      chapter_number: chapter.chapter_number,
      book_name: bookName,
      verses_count: chapter.verses_count || 0,
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
