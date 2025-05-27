
import { supabase } from '@/integrations/supabase/client';
import { BibleVerse } from '@/types/bible.types';
import { getUserProfile } from '@/services/ProfileService';

/**
 * Search the Bible for specific text or references
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
    console.log('=== SEARCH DEBUG START ===');
    console.log(`Query: "${query}"`);
    console.log(`Version: ${versionId}`);
    
    // Get user's preferred version if not specified
    if (!versionId) {
      try {
        const userProfile = await getUserProfile();
        versionId = userProfile?.preferred_bible_version || 'kja';
      } catch (error) {
        console.error('Error getting user profile:', error);
        versionId = 'kja';
      }
    }
    
    console.log(`Using version: ${versionId}`);
    
    // Check if it's a reference search (like "joão 3:16" or "genesis 1:1")
    const referenceMatch = query.match(/([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)\s*(\d+)(?::(\d+))?/i);
    
    if (referenceMatch) {
      console.log('Reference search detected');
      const [, bookName, chapter, verse] = referenceMatch;
      return await searchByReference(bookName.trim(), parseInt(chapter), verse ? parseInt(verse) : undefined, versionId);
    }
    
    // Text search in verses
    console.log('Performing text search...');
    const searchTerm = query.trim();
    
    // First, let's check if we have any verses at all for this version
    const { data: versionCheck, error: versionError } = await supabase
      .from('bible_verses')
      .select('id, text, book_id, chapter_number, verse_number')
      .eq('version_id', versionId)
      .limit(1);
    
    if (versionError) {
      console.error('Version check error:', versionError);
      return [];
    }
    
    console.log(`Version check result: ${versionCheck?.length || 0} verses found for version ${versionId}`);
    
    if (!versionCheck || versionCheck.length === 0) {
      // Try with any available version
      console.log('No verses found for specified version, trying any version...');
      
      const { data: anyVersionVerses, error: anyError } = await supabase
        .from('bible_verses')
        .select('id, text, book_id, chapter_number, verse_number, version_id')
        .ilike('text', `%${searchTerm}%`)
        .limit(limit);
      
      if (anyError) {
        console.error('Any version search error:', anyError);
        return [];
      }
      
      console.log(`Found ${anyVersionVerses?.length || 0} verses in any version`);
      
      if (anyVersionVerses && anyVersionVerses.length > 0) {
        return await addBookNamesToVerses(anyVersionVerses, anyVersionVerses[0].version_id);
      }
      
      return [];
    }
    
    // Search in the specified version
    const { data: verses, error } = await supabase
      .from('bible_verses')
      .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
      .eq('version_id', versionId)
      .ilike('text', `%${searchTerm}%`)
      .limit(limit);
    
    if (error) {
      console.error('Search error:', error);
      return [];
    }
    
    console.log(`Found ${verses?.length || 0} verses`);
    
    if (!verses || verses.length === 0) {
      return [];
    }
    
    // Add book names to results
    return await addBookNamesToVerses(verses, versionId);
    
  } catch (error) {
    console.error('Error in searchBible:', error);
    return [];
  }
};

// Helper function to add book names to verses
const addBookNamesToVerses = async (verses: any[], versionId: string): Promise<BibleVerse[]> => {
  if (!verses || verses.length === 0) return [];
  
  console.log(`Adding book names to ${verses.length} verses for version ${versionId}`);
  
  // Get unique book IDs
  const bookIds = [...new Set(verses.map(verse => verse.book_id))];
  console.log(`Looking up book names for: ${bookIds.join(', ')}`);
  
  // Get book names for this specific version
  const { data: bookData, error: bookError } = await supabase
    .from('bible_books')
    .select('book_id, name')
    .eq('version_id', versionId)
    .in('book_id', bookIds);
  
  if (bookError) {
    console.error('Error fetching book names:', bookError);
  } else {
    console.log(`Found ${bookData?.length || 0} book records`);
  }
  
  // Create lookup map
  const bookNames: Record<string, string> = {};
  if (bookData) {
    bookData.forEach(book => {
      bookNames[book.book_id] = book.name;
    });
  }
  
  // Return verses with book names
  return verses.map(verse => ({
    ...verse,
    book_name: bookNames[verse.book_id] || verse.book_id || 'Livro Desconhecido'
  }));
};

// Helper function for reference search
const searchByReference = async (
  bookName: string, 
  chapter: number, 
  verse?: number, 
  versionId: string = 'kja'
): Promise<BibleVerse[]> => {
  try {
    console.log(`Reference search: ${bookName} ${chapter}${verse ? ':' + verse : ''} in ${versionId}`);
    
    // Search for book by name (case insensitive)
    const { data: books, error: booksError } = await supabase
      .from('bible_books')
      .select('book_id, name')
      .eq('version_id', versionId)
      .ilike('name', `%${bookName}%`);
    
    if (booksError || !books || books.length === 0) {
      console.log(`No book found for "${bookName}" in version ${versionId}`);
      return [];
    }
    
    const book = books[0];
    console.log(`Found book: ${book.name} (${book.book_id})`);
    
    // Search for verses directly by book_id, chapter_number and optionally verse_number
    let query = supabase
      .from('bible_verses')
      .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
      .eq('version_id', versionId)
      .eq('book_id', book.book_id)
      .eq('chapter_number', chapter);
    
    if (verse) {
      query = query.eq('verse_number', verse);
    }
    
    const { data: verseData, error: verseError } = await query.order('verse_number');
    
    if (verseError || !verseData) {
      console.log('No verses found for reference');
      return [];
    }
    
    console.log(`Found ${verseData.length} verses for reference`);
    
    return verseData.map(v => ({
      ...v,
      book_name: book.name
    }));
    
  } catch (error) {
    console.error('Error in reference search:', error);
    return [];
  }
};
