
import { supabase } from '@/integrations/supabase/client';
import { BibleVerse } from '@/types/bible.types';
import { getUserProfile } from '@/services/ProfileService';

/**
 * Debug function to check database state
 */
const debugDatabaseState = async () => {
  console.log('=== DATABASE DEBUG START ===');
  
  // Check all versions
  const { data: allVersions } = await supabase
    .from('bible_versions')
    .select('id, name');
  console.log('All versions:', allVersions);
  
  // Check all verses count by version
  if (allVersions && allVersions.length > 0) {
    for (const version of allVersions) {
      const { data: verses, count } = await supabase
        .from('bible_verses')
        .select('id', { count: 'exact' })
        .eq('version_id', version.id)
        .limit(1);
      console.log(`Version ${version.id} (${version.name}): ${count} verses total`);
    }
  }
  
  // Check sample verses
  const { data: sampleVerses } = await supabase
    .from('bible_verses')
    .select('id, version_id, book_id, chapter_number, verse_number, text')
    .limit(5);
  console.log('Sample verses:', sampleVerses);
  
  console.log('=== DATABASE DEBUG END ===');
};

/**
 * Find the best available version with data
 */
const findVersionWithData = async (): Promise<string | null> => {
  console.log('Finding version with data...');
  
  const { data: versions } = await supabase
    .from('bible_versions')
    .select('id, name');
    
  if (!versions) return null;
  
  for (const version of versions) {
    const { data: verses } = await supabase
      .from('bible_verses')
      .select('id')
      .eq('version_id', version.id)
      .limit(1);
      
    if (verses && verses.length > 0) {
      console.log(`Found version with data: ${version.id} (${version.name})`);
      return version.id;
    }
  }
  
  return null;
};

/**
 * Search the Bible for specific text
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
    console.log(`Original query: "${query}"`);
    console.log(`Original version: ${versionId}`);
    
    // Debug database state first
    await debugDatabaseState();
    
    // If no specific version provided, get user's preferred version
    if (!versionId) {
      try {
        const userProfile = await getUserProfile();
        versionId = userProfile?.preferred_bible_version || 'kja';
        console.log(`Using user preferred version: ${versionId}`);
      } catch (error) {
        console.error('Error getting user profile:', error);
        versionId = 'kja';
      }
    }
    
    // Find a version that actually has data
    let workingVersion = versionId;
    const { data: versionCheck } = await supabase
      .from('bible_verses')
      .select('id')
      .eq('version_id', versionId)
      .limit(1);
      
    if (!versionCheck || versionCheck.length === 0) {
      console.warn(`No data found for version ${versionId}, finding alternative...`);
      workingVersion = await findVersionWithData();
      
      if (!workingVersion) {
        console.error('No version with data found in database');
        return [];
      }
      
      console.log(`Using alternative version: ${workingVersion}`);
    }
    
    console.log(`Final version for search: ${workingVersion}`);
    
    // Check if it's a reference search (like "john 3:16" or "joão 3:16")
    const referenceMatch = query.match(/([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)\s*(\d+)(?::(\d+))?/i);
    
    if (referenceMatch) {
      console.log('Reference search detected');
      const [, bookName, chapter, verse] = referenceMatch;
      return await searchByReference(bookName.trim(), parseInt(chapter), verse ? parseInt(verse) : undefined, workingVersion);
    }
    
    // Text search - simple and direct approach
    console.log('Performing text search...');
    const searchTerm = query.trim();
    
    // Direct text search with ILIKE
    console.log(`Searching for text: "${searchTerm}" in version: ${workingVersion}`);
    
    const { data: verses, error } = await supabase
      .from('bible_verses')
      .select('*')
      .eq('version_id', workingVersion)
      .ilike('text', `%${searchTerm}%`)
      .limit(limit);
    
    if (error) {
      console.error('Search error:', error);
      return [];
    }
    
    console.log(`Found ${verses?.length || 0} verses`);
    
    if (!verses || verses.length === 0) {
      console.log('No results found');
      return [];
    }
    
    // Add book names to results
    return await addBookNamesToVerses(verses, workingVersion);
    
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
    book_name: bookNames[verse.book_id] || verse.book_id
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
    
    // Search for book by name
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
    
    // Get chapter
    const { data: chapterData, error: chapterError } = await supabase
      .from('bible_chapters')
      .select('id')
      .eq('book_id', book.book_id)
      .eq('chapter_number', chapter)
      .eq('version_id', versionId)
      .maybeSingle();
    
    if (chapterError || !chapterData) {
      console.log(`Chapter not found: ${book.book_id} ${chapter}`);
      return [];
    }
    
    // Get verses
    let query = supabase
      .from('bible_verses')
      .select('*')
      .eq('chapter_id', chapterData.id);
    
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
