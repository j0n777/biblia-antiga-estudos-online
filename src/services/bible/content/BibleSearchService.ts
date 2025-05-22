
import { supabase } from '@/integrations/supabase/client';
import { BibleVerse } from '@/types/bible.types';
import { getUserProfile } from '@/services/ProfileService';

/**
 * Search the Bible for specific text
 * @param query Search query
 * @param versionId Bible version ID (if not provided, will use user's preferred version)
 * @param limit Maximum number of results to return
 * @returns Promise resolving to array of matching verses
 */
export const searchBibleVerses = async (
  query: string, 
  versionId?: string,
  limit: number = 20
): Promise<BibleVerse[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  try {
    // If no specific version is provided, get user's preferred version
    let searchBySpecificVersion = false;
    if (!versionId) {
      try {
        const userProfile = await getUserProfile();
        versionId = userProfile?.preferred_bible_version || 'kja';
      } catch (error) {
        console.error('Error getting user profile for version, using default:', error);
        versionId = 'kja'; // Fallback to default
      }
    } else {
      searchBySpecificVersion = true;
    }
    
    console.log(`Searching Bible for "${query}" in version ${versionId}`);
    
    // Check if it's a reference search (like "john 3:16")
    const referenceMatch = query.match(/([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)\s*(\d+)(?::(\d+))?/i);
    
    if (referenceMatch) {
      // Reference search
      const [, bookName, chapter, verse] = referenceMatch;
      const trimmedBookName = bookName.trim().toLowerCase();
      
      // Try to find matching book_id
      const { data: books } = await supabase
        .from('bible_books')
        .select('book_id, name')
        .eq('version_id', versionId)
        .ilike('name', `%${trimmedBookName}%`);
      
      if (!books || books.length === 0) {
        // Try searching in book_id directly
        return await searchByBookId(trimmedBookName, parseInt(chapter), verse ? parseInt(verse) : undefined, versionId);
      }
      
      // Use the first matching book
      const bookId = books[0].book_id;
      return await searchByBookId(bookId, parseInt(chapter), verse ? parseInt(verse) : undefined, versionId);
    }
    
    // If query has no specific verse reference, try different search approaches
    
    // 1. First attempt: Search for exact book name
    const { data: books } = await supabase
      .from('bible_books')
      .select('book_id, name')
      .ilike('name', `%${query.trim()}%`)
      .eq('version_id', versionId);
      
    if (books && books.length > 0) {
      // Query is likely a book name, return first chapter or sample verses
      const bookId = books[0].book_id;
      console.log(`Found book match: ${bookId}`);
      
      // Get sample verses from this book (first chapter, first few verses)
      const { data: chapterData } = await supabase
        .from('bible_chapters')
        .select('id')
        .eq('book_id', bookId)
        .eq('chapter_number', 1)
        .eq('version_id', versionId)
        .limit(1);
        
      if (chapterData && chapterData.length > 0) {
        const { data: sampleVerses } = await supabase
          .from('bible_verses')
          .select('*')
          .eq('chapter_id', chapterData[0].id)
          .order('verse_number')
          .limit(10);
          
        if (sampleVerses && sampleVerses.length > 0) {
          // Add book name to results
          return sampleVerses.map(verse => ({
            ...verse,
            book_name: books[0].name
          }));
        }
      }
    }
    
    // 2. Second attempt: Text search across all verses
    const searchQueryTrimmed = query.trim();
    
    // First try using ilike for better compatibility across all Supabase versions
    const { data: verses, error } = await supabase
      .from('bible_verses')
      .select('*')
      .ilike('text', `%${searchQueryTrimmed}%`)
      .eq('version_id', versionId)
      .limit(limit);
    
    if (error) {
      console.error('Error searching Bible:', error);
      return [];
    }
    
    if (!verses || verses.length === 0) {
      // If no results with ilike, try textSearch as a fallback
      try {
        const { data: textSearchVerses, error: textSearchError } = await supabase
          .from('bible_verses')
          .select('*')
          .textSearch('text', searchQueryTrimmed)
          .eq('version_id', versionId)
          .limit(limit);
        
        if (textSearchError) {
          console.error('Error using textSearch:', textSearchError);
          return [];
        }
        
        if (!textSearchVerses || textSearchVerses.length === 0) {
          console.log(`No results found for "${query}"`);
          return [];
        }
        
        // Get book names for the text search results
        return await addBookNamesToVerses(textSearchVerses);
      } catch (textSearchErr) {
        console.error('TextSearch failed, likely not supported:', textSearchErr);
        return [];
      }
    }
    
    console.log(`Found ${verses.length} matches for "${query}"`);
    
    // Add book names to the results
    return await addBookNamesToVerses(verses);
    
  } catch (error) {
    console.error('Error in searchBible:', error);
    return [];
  }
};

// Helper function to add book names to verses
const addBookNamesToVerses = async (verses: any[]): Promise<BibleVerse[]> => {
  if (!verses || verses.length === 0) return [];
  
  // Get book names for the results
  const bookIds = [...new Set(verses.map(verse => verse.book_id))];
  const versionIds = [...new Set(verses.map(verse => verse.version_id))];
  
  // Get all relevant book names across all versions in the results
  const { data: bookData } = await supabase
    .from('bible_books')
    .select('book_id, name, version_id')
    .in('book_id', bookIds)
    .in('version_id', versionIds);
  
  // Create a lookup map for book names by book_id and version_id
  const bookNames: Record<string, Record<string, string>> = {};
  
  if (bookData && bookData.length > 0) {
    bookData.forEach(book => {
      if (!bookNames[book.book_id]) {
        bookNames[book.book_id] = {};
      }
      bookNames[book.book_id][book.version_id] = book.name;
    });
  }
  
  // Return results with book names
  return verses.map(verse => {
    // Get book name for this verse's version
    let bookName = verse.book_id;
    
    // Try to get the book name for this specific version
    if (bookNames[verse.book_id] && bookNames[verse.book_id][verse.version_id]) {
      bookName = bookNames[verse.book_id][verse.version_id];
    }
    
    return {
      ...verse,
      book_name: bookName
    };
  });
};

// Helper function for searching by book ID, chapter, and optional verse
const searchByBookId = async (
  bookId: string, 
  chapter: number, 
  verse?: number, 
  versionId: string = 'kja'
): Promise<BibleVerse[]> => {
  try {
    // Normalize bookId to lowercase
    const normalizedBookId = bookId.toLowerCase();
    
    // First try to get the chapter
    const { data: chapterData } = await supabase
      .from('bible_chapters')
      .select('id')
      .eq('book_id', normalizedBookId)
      .eq('chapter_number', chapter)
      .eq('version_id', versionId)
      .maybeSingle();
    
    if (!chapterData) {
      console.log(`Chapter not found: ${normalizedBookId} ${chapter}`);
      return [];
    }
    
    let query = supabase
      .from('bible_verses')
      .select('*')
      .eq('chapter_id', chapterData.id);
    
    // Add verse filter if specified
    if (verse && !isNaN(verse)) {
      query = query.eq('verse_number', verse);
    }
    
    const { data, error } = await query.order('verse_number');
    
    if (error) {
      console.error('Error searching Bible by reference:', error);
      return [];
    }
    
    // Get book name
    const { data: bookData } = await supabase
      .from('bible_books')
      .select('name')
      .eq('book_id', normalizedBookId)
      .eq('version_id', versionId)
      .maybeSingle();
    
    return (data || []).map(verse => ({
      ...verse,
      book_name: bookData?.name || normalizedBookId
    }));
  } catch (error) {
    console.error('Error in searchByBookId:', error);
    return [];
  }
};
