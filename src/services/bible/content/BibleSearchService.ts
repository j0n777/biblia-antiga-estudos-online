
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
    if (!versionId) {
      try {
        const userProfile = await getUserProfile();
        versionId = userProfile?.preferred_bible_version || 'kja';
      } catch (error) {
        console.error('Error getting user profile for version, using default:', error);
        versionId = 'kja'; // Fallback to default
      }
    }
    
    console.log(`Searching Bible for "${query}" in version ${versionId}`);
    
    // Check if it's a reference search (like "john 3:16")
    const referenceMatch = query.match(/([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)\s*(\d+)(?::(\d+))?/i);
    
    if (referenceMatch) {
      // Reference search
      const [, bookName, chapter, verse] = referenceMatch;
      const trimmedBookName = bookName.trim().toLowerCase();
      
      console.log(`Reference search detected: ${trimmedBookName} ${chapter}${verse ? ':' + verse : ''}`);
      
      return await searchByReference(trimmedBookName, parseInt(chapter), verse ? parseInt(verse) : undefined, versionId);
    }
    
    // Text search - simple word search
    const searchTerm = query.trim();
    console.log(`Performing text search for: "${searchTerm}"`);
    
    // Use simple ILIKE search for better compatibility
    const { data: verses, error } = await supabase
      .from('bible_verses')
      .select('*')
      .eq('version_id', versionId)
      .ilike('text', `%${searchTerm}%`)
      .limit(limit);
    
    if (error) {
      console.error('Text search error:', error);
      return [];
    }
    
    console.log(`Text search found ${verses?.length || 0} results`);
    
    if (!verses || verses.length === 0) {
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
const searchByReference = async (
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
    console.error('Error in searchByReference:', error);
    return [];
  }
};
