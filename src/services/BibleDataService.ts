
import { supabase } from '@/integrations/supabase/client';
import { BibleChapter, BibleBook, BibleVersion, BibleVerse, BookContent } from '../types/bible.types';

export async function getAllBooks(versionId: string = 'kja'): Promise<BibleBook[]> {
  try {
    console.log(`Getting all books for version: ${versionId}`);
    
    const { data, error } = await supabase
      .from('bible_books')
      .select('*')
      .eq('version_id', versionId)
      .order('position');
      
    if (error) {
      throw new Error(`Error fetching Bible books: ${error.message}`);
    }
    
    // Explicitly cast the testament field to 'old' | 'new'
    return (data || []).map(book => ({
      ...book,
      testament: book.testament as 'old' | 'new'
    }));
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    return [];
  }
}

export async function getAllVersions(): Promise<BibleVersion[]> {
  try {
    const { data, error } = await supabase
      .from('bible_versions')
      .select('*')
      .not('is_original', 'eq', true);  // Do not include original language versions in the main selection
      
    if (error) {
      throw new Error(`Error fetching Bible versions: ${error.message}`);
    }
    
    // Explicitly cast the original_language field if it exists
    return (data || []).map(version => ({
      ...version,
      original_language: version.original_language as 'hebrew' | 'greek' | 'aramaic' | undefined
    }));
  } catch (error) {
    console.error('Error in getAllVersions:', error);
    return [];
  }
}

export async function getChapter(
  bookId: string, 
  chapterNumber: number, 
  versionId: string = 'kja'
): Promise<BibleChapter | null> {
  try {
    console.log(`Fetching chapter: Book=${bookId}, Chapter=${chapterNumber}, Version=${versionId}`);
    
    // First, get the chapter record
    const { data: chapterData, error: chapterError } = await supabase
      .from('bible_chapters')
      .select('id, version_id, book_id, chapter_number, verses_count')
      .eq('version_id', versionId)
      .eq('book_id', bookId)
      .eq('chapter_number', chapterNumber);
    
    if (chapterError || !chapterData || chapterData.length === 0) {
      console.error(`Error fetching chapter data: ${chapterError?.message || 'Chapter not found'}`);
      return null;
    }
    
    // Get the book name from the books table
    const { data: bookData, error: bookError } = await supabase
      .from('bible_books')
      .select('name, testament')
      .eq('version_id', versionId)
      .eq('book_id', bookId)
      .single();
    
    if (bookError || !bookData) {
      console.error(`Error fetching book data: ${bookError?.message || 'Book not found'}`);
      return null;
    }
    
    // Get the version info
    const { data: versionData, error: versionError } = await supabase
      .from('bible_versions')
      .select('*')
      .eq('id', versionId)
      .single();
    
    if (versionError || !versionData) {
      console.error(`Error fetching version data: ${versionError?.message || 'Version not found'}`);
      return null;
    }
    
    // Then get the verses for this chapter
    const { data: versesData, error: versesError } = await supabase
      .from('bible_verses')
      .select('id, verse_number, text, chapter_id')
      .eq('chapter_id', chapterData[0].id)
      .order('verse_number');
    
    if (versesError) {
      console.error(`Error fetching verses: ${versesError.message}`);
      return null;
    }
    
    // Set the original language based on the testament
    // Old Testament books are in Hebrew, New Testament in Greek
    // This is a simplification, as some parts like Daniel have Aramaic sections
    const originalLanguage = bookData.testament === 'new' ? 'greek' : 'hebrew';
    
    return {
      id: chapterData[0].id,
      version_id: chapterData[0].version_id,
      book_id: chapterData[0].book_id,
      book_name: bookData.name,
      chapter_number: chapterData[0].chapter_number,
      verses: versesData as BibleVerse[] || [],
      version: {
        ...versionData,
        original_language: versionData.original_language as 'hebrew' | 'greek' | 'aramaic'
      },
      originalLanguage,
    };
  } catch (error) {
    console.error('Error in getChapter:', error);
    return null;
  }
}

export async function searchBibleVerses(
  query: string,
  versionId: string = 'kja',
  limit: number = 50
): Promise<BibleVerse[]> {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('bible_verses')
      .select('id, chapter_id, version_id, book_id, chapter_number, verse_number, text')
      .eq('version_id', versionId)
      .textSearch('text', query)
      .limit(limit);
      
    if (error) {
      throw new Error(`Error searching Bible verses: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in searchBibleVerses:', error);
    return [];
  }
}

export const getBibleBooks = async () => {
  try {
    const { data, error } = await supabase
      .from('bible_books')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching Bible books:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBibleBooks:', error);
    return [];
  }
};

// Add the missing getBookContent function
export async function getBookContent(bookId: string, chapterNumber: number): Promise<BookContent | null> {
  try {
    // Get book name
    const { data: bookData, error: bookError } = await supabase
      .from('bible_books')
      .select('name')
      .eq('book_id', bookId)
      .single();
    
    if (bookError || !bookData) {
      console.error(`Error fetching book data: ${bookError?.message || 'Book not found'}`);
      return null;
    }
    
    // Get chapter data
    const { data: chapterData, error: chapterError } = await supabase
      .from('bible_chapters')
      .select('id')
      .eq('book_id', bookId)
      .eq('chapter_number', chapterNumber)
      .single();
    
    if (chapterError || !chapterData) {
      console.error(`Error fetching chapter data: ${chapterError?.message || 'Chapter not found'}`);
      return null;
    }
    
    // Get verses
    const { data: versesData, error: versesError } = await supabase
      .from('bible_verses')
      .select('id, verse_number, text, chapter_id')
      .eq('chapter_id', chapterData.id)
      .order('verse_number');
    
    if (versesError) {
      console.error(`Error fetching verses: ${versesError.message}`);
      return null;
    }
    
    return {
      book_id: bookId,
      book_name: bookData.name,
      chapter_number: chapterNumber,
      verses: versesData as BibleVerse[] || [],
    };
  } catch (error) {
    console.error('Error in getBookContent:', error);
    return null;
  }
}
