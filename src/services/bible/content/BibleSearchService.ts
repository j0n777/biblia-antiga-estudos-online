
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
    console.log('Query too short or empty');
    return [];
  }
  
  try {
    // If no specific version is provided, get user's preferred version
    if (!versionId) {
      try {
        const userProfile = await getUserProfile();
        versionId = userProfile?.preferred_bible_version || 'kja';
        console.log(`Using user preferred version: ${versionId}`);
      } catch (error) {
        console.error('Error getting user profile for version, using default:', error);
        versionId = 'kja'; // Fallback to default
      }
    }
    
    console.log(`Searching Bible for "${query}" in version ${versionId}`);
    
    // First, let's check if we have any data in the database
    const { data: versionCheck, error: versionError } = await supabase
      .from('bible_versions')
      .select('id, name')
      .eq('id', versionId)
      .maybeSingle();
    
    if (versionError) {
      console.error('Error checking version:', versionError);
      return [];
    }
    
    if (!versionCheck) {
      console.error(`Version ${versionId} not found in database`);
      // Try with default version
      versionId = 'kja';
      console.log(`Trying with default version: ${versionId}`);
    } else {
      console.log(`Version found: ${versionCheck.name}`);
    }
    
    // Check if we have verses for this version
    const { data: versesCheck, error: versesCheckError } = await supabase
      .from('bible_verses')
      .select('id')
      .eq('version_id', versionId)
      .limit(1);
    
    if (versesCheckError) {
      console.error('Error checking verses:', versesCheckError);
      return [];
    }
    
    if (!versesCheck || versesCheck.length === 0) {
      console.error(`No verses found for version ${versionId}`);
      return [];
    }
    
    console.log(`Found verses for version ${versionId}`);
    
    // Check if it's a reference search (like "john 3:16" or "joão 3:16")
    const referenceMatch = query.match(/([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)\s*(\d+)(?::(\d+))?/i);
    
    if (referenceMatch) {
      // Reference search
      const [, bookName, chapter, verse] = referenceMatch;
      const trimmedBookName = bookName.trim().toLowerCase();
      
      console.log(`Reference search detected: ${trimmedBookName} ${chapter}${verse ? ':' + verse : ''}`);
      
      return await searchByReference(trimmedBookName, parseInt(chapter), verse ? parseInt(verse) : undefined, versionId);
    }
    
    // Text search - search for words within verse text
    const searchTerm = query.trim();
    console.log(`Performing text search for: "${searchTerm}"`);
    
    // Try multiple search strategies
    let verses: any[] = [];
    let error: any = null;
    
    // Strategy 1: Simple ILIKE search (case insensitive)
    console.log('Strategy 1: Simple ILIKE search');
    const { data: iLikeVerses, error: iLikeError } = await supabase
      .from('bible_verses')
      .select('*')
      .eq('version_id', versionId)
      .ilike('text', `%${searchTerm}%`)
      .limit(limit);
    
    if (!iLikeError && iLikeVerses && iLikeVerses.length > 0) {
      console.log(`ILIKE search found ${iLikeVerses.length} results`);
      verses = iLikeVerses;
    } else {
      console.log('ILIKE search found no results');
      
      // Strategy 2: Try with different case variations
      console.log('Strategy 2: Case variations');
      const searchVariations = [
        searchTerm.toLowerCase(),
        searchTerm.toUpperCase(),
        searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1).toLowerCase()
      ];
      
      for (const variation of searchVariations) {
        const { data: varVerses, error: varError } = await supabase
          .from('bible_verses')
          .select('*')
          .eq('version_id', versionId)
          .ilike('text', `%${variation}%`)
          .limit(limit);
        
        if (!varError && varVerses && varVerses.length > 0) {
          console.log(`Found ${varVerses.length} results with variation: ${variation}`);
          verses = varVerses;
          break;
        }
      }
    }
    
    if (verses.length === 0) {
      console.log(`No results found for "${query}" in version ${versionId}`);
      return [];
    }
    
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
  
  console.log(`Adding book names to ${verses.length} verses`);
  
  // Get book names for the results
  const bookIds = [...new Set(verses.map(verse => verse.book_id))];
  const versionIds = [...new Set(verses.map(verse => verse.version_id))];
  
  console.log(`Looking up book names for book_ids: ${bookIds.join(', ')}`);
  
  // Get all relevant book names across all versions in the results
  const { data: bookData, error: bookError } = await supabase
    .from('bible_books')
    .select('book_id, name, version_id')
    .in('book_id', bookIds)
    .in('version_id', versionIds);
  
  if (bookError) {
    console.error('Error fetching book names:', bookError);
  } else {
    console.log(`Found ${bookData?.length || 0} book name records`);
  }
  
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
const searchByReference = async (
  bookName: string, 
  chapter: number, 
  verse?: number, 
  versionId: string = 'kja'
): Promise<BibleVerse[]> => {
  try {
    console.log(`Searching by reference: ${bookName} ${chapter}${verse ? ':' + verse : ''} in version ${versionId}`);
    
    // First, try to find the book by name
    const { data: books, error: booksError } = await supabase
      .from('bible_books')
      .select('book_id, name')
      .eq('version_id', versionId)
      .ilike('name', `%${bookName}%`);
    
    if (booksError) {
      console.error('Error searching for books:', booksError);
      return [];
    }
    
    console.log(`Found ${books?.length || 0} matching books for "${bookName}"`);
    
    if (!books || books.length === 0) {
      // Try searching by book_id directly
      console.log(`Trying direct book_id search for: ${bookName}`);
      return await searchByBookId(bookName, chapter, verse, versionId);
    }
    
    // Use the first matching book
    const book = books[0];
    console.log(`Using book: ${book.name} (${book.book_id})`);
    
    return await searchByBookId(book.book_id, chapter, verse, versionId);
    
  } catch (error) {
    console.error('Error in searchByReference:', error);
    return [];
  }
};

// Helper function for searching by book ID
const searchByBookId = async (
  bookId: string, 
  chapter: number, 
  verse?: number, 
  versionId: string = 'kja'
): Promise<BibleVerse[]> => {
  try {
    // Normalize bookId to lowercase
    const normalizedBookId = bookId.toLowerCase();
    
    console.log(`Searching by book_id: ${normalizedBookId}, chapter: ${chapter}, verse: ${verse || 'all'}`);
    
    // First try to get the chapter
    const { data: chapterData, error: chapterError } = await supabase
      .from('bible_chapters')
      .select('id, chapter_number')
      .eq('book_id', normalizedBookId)
      .eq('chapter_number', chapter)
      .eq('version_id', versionId)
      .maybeSingle();
    
    if (chapterError) {
      console.error('Error searching for chapter:', chapterError);
      return [];
    }
    
    if (!chapterData) {
      console.log(`Chapter not found: ${normalizedBookId} ${chapter} in version ${versionId}`);
      return [];
    }
    
    console.log(`Found chapter: ${chapterData.id}`);
    
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
    
    console.log(`Found ${data?.length || 0} verses`);
    
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
