
import { supabase } from '@/integrations/supabase/client';
import { BookContent, BibleVerse, BibleChapter } from '@/types/bible.types';
import { getBookChapters } from './BibleBooksService';
import { getUserProfile } from '../ProfileService';

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
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  try {
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
    
    // Fix: Use proper text search for finding words in verses
    // We'll add OR conditions to catch more matches, and make the search case-insensitive
    const searchQueryTrimmed = query.trim();
    
    // Try to search with word boundaries for more accurate results
    // First attempt: exact word match using ILIKE
    const { data: exactMatches, error: exactError } = await supabase
      .from('bible_verses')
      .select('*')
      .eq('version_id', versionId)
      .or(`text.ilike.% ${searchQueryTrimmed} %,text.ilike.${searchQueryTrimmed} %,text.ilike.% ${searchQueryTrimmed},text.ilike.${searchQueryTrimmed}`)
      .limit(limit);
      
    if (exactError) {
      console.error('Error searching Bible (exact match):', exactError);
    }
    
    // If we find exact matches, use them
    if (exactMatches && exactMatches.length > 0) {
      console.log(`Found ${exactMatches.length} exact matches for "${query}"`);
      
      // Get book names
      const bookIds = [...new Set(exactMatches.map(verse => verse.book_id))];
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
      return exactMatches.map(verse => ({
        ...verse,
        book_name: bookNames[verse.book_id] || verse.book_id
      }));
    }
    
    // Second attempt: partial word match using ILIKE with %word%
    const { data: partialMatches, error: partialError } = await supabase
      .from('bible_verses')
      .select('*')
      .eq('version_id', versionId)
      .ilike('text', `%${searchQueryTrimmed}%`)
      .limit(limit);
      
    if (partialError) {
      console.error('Error searching Bible (partial match):', partialError);
      return [];
    }
    
    console.log(`Search results for "${query}": ${partialMatches?.length || 0}`);
    
    if (!partialMatches || partialMatches.length === 0) {
      return [];
    }
    
    // Create a lookup of book names for better display
    const bookIds = [...new Set(partialMatches.map(verse => verse.book_id))];
    
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
    return partialMatches.map(verse => ({
      ...verse,
      book_name: bookNames[verse.book_id] || verse.book_id
    }));
  } catch (error) {
    console.error('Error in searchBible:', error);
    return [];
  }
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
