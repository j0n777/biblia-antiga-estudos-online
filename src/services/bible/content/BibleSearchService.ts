
import { supabase } from '@/integrations/supabase/client';
import { BibleVerse } from '@/types/bible.types';
import { getUserProfile } from '@/services/ProfileService';

/**
 * Search the Bible for specific text or references
 */
export const searchBibleVerses = async (
  query: string, 
  versionId?: string,
  limit: number = 50
): Promise<BibleVerse[]> => {
  if (!query || query.trim().length < 2) {
    console.log('Query too short or empty');
    return [];
  }
  
  try {
    console.log('=== SEARCH DEBUG START ===');
    console.log(`Query: "${query}"`);
    console.log(`Requested Version: ${versionId}`);
    
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
    
    // First, let's check what versions actually exist in the database
    const { data: availableVersions, error: versionsError } = await supabase
      .from('bible_verses')
      .select('version_id')
      .not('version_id', 'is', null)
      .limit(10);
    
    if (versionsError) {
      console.error('Error checking available versions:', versionsError);
    } else {
      const uniqueVersions = [...new Set(availableVersions?.map(v => v.version_id) || [])];
      console.log('Available versions in database:', uniqueVersions);
    }
    
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
    
    // Try to search in the specified version first
    console.log(`Searching in version: ${versionId}`);
    let { data: verses, error } = await supabase
      .from('bible_verses')
      .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
      .eq('version_id', versionId)
      .ilike('text', `%${searchTerm}%`)
      .limit(limit);
    
    if (error) {
      console.error('Error in version-specific search:', error);
    }
    
    console.log(`Found ${verses?.length || 0} verses in version ${versionId}`);
    
    // If no results in preferred version, try other versions
    if (!verses || verses.length === 0) {
      console.log('No results in preferred version, trying other versions...');
      
      const { data: alternativeVerses, error: altError } = await supabase
        .from('bible_verses')
        .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
        .not('version_id', 'is', null)
        .ilike('text', `%${searchTerm}%`)
        .limit(limit);
      
      if (altError) {
        console.error('Error in alternative search:', altError);
        return [];
      }
      
      verses = alternativeVerses;
      console.log(`Found ${verses?.length || 0} verses in alternative versions`);
      
      if (verses && verses.length > 0) {
        const foundVersion = verses[0].version_id;
        console.log(`Using alternative version: ${foundVersion}`);
      }
    }
    
    if (!verses || verses.length === 0) {
      console.log('No verses found in any version');
      return [];
    }
    
    // Add book names to results
    return await addBookNamesToVerses(verses, verses[0].version_id);
    
  } catch (error) {
    console.error('Error in searchBible:', error);
    return [];
  }
};

// Helper function to add book names to verses
const addBookNamesToVerses = async (verses: any[], versionId: string): Promise<BibleVerse[]> => {
  if (!verses || verses.length === 0) return [];
  
  console.log(`Adding book names to ${verses.length} verses for version ${versionId}`);
  
  // Get unique book IDs from the verses
  const bookIds = [...new Set(verses.map(verse => verse.book_id).filter(Boolean))];
  console.log(`Looking up book names for book_ids: ${bookIds.join(', ')}`);
  
  // Get book names for this specific version
  const { data: bookData, error: bookError } = await supabase
    .from('bible_books')
    .select('book_id, name')
    .eq('version_id', versionId)
    .in('book_id', bookIds);
  
  if (bookError) {
    console.error('Error fetching book names for version:', versionId, bookError);
    
    // Try to get book names from any version if the specific version fails
    const { data: anyVersionBooks, error: anyError } = await supabase
      .from('bible_books')
      .select('book_id, name')
      .in('book_id', bookIds)
      .limit(100);
    
    if (anyError) {
      console.error('Error fetching book names from any version:', anyError);
    } else {
      console.log(`Found ${anyVersionBooks?.length || 0} book records from any version`);
      
      // Create lookup map from any version
      const bookNames: Record<string, string> = {};
      if (anyVersionBooks) {
        anyVersionBooks.forEach(book => {
          bookNames[book.book_id] = book.name;
        });
      }
      
      return verses.map(verse => ({
        ...verse,
        book_name: bookNames[verse.book_id] || getDefaultBookName(verse.book_id) || 'Livro Desconhecido'
      }));
    }
  } else {
    console.log(`Found ${bookData?.length || 0} book records for version ${versionId}`);
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
    book_name: bookNames[verse.book_id] || getDefaultBookName(verse.book_id) || 'Livro Desconhecido'
  }));
};

// Helper function to get default book names when database lookup fails
const getDefaultBookName = (bookId: string): string | null => {
  if (!bookId) return null;
  
  const defaultBookNames: Record<string, string> = {
    // Old Testament
    'gn': 'Gênesis',
    'ex': 'Êxodo', 
    'lv': 'Levítico',
    'nm': 'Números',
    'dt': 'Deuteronômio',
    'js': 'Josué',
    'jud': 'Juízes',
    'rt': 'Rute',
    '1sm': '1 Samuel',
    '2sm': '2 Samuel',
    '1kgs': '1 Reis',
    '2kgs': '2 Reis',
    '1ch': '1 Crônicas',
    '2ch': '2 Crônicas',
    'ezr': 'Esdras',
    'ne': 'Neemias',
    'et': 'Ester',
    'job': 'Jó',
    'ps': 'Salmos',
    'prv': 'Provérbios',
    'ec': 'Eclesiastes',
    'so': 'Cantares',
    'is': 'Isaías',
    'jr': 'Jeremias',
    'lm': 'Lamentações',
    'ez': 'Ezequiel',
    'dn': 'Daniel',
    'ho': 'Oséias',
    'jl': 'Joel',
    'am': 'Amós',
    'ob': 'Obadias',
    'jn': 'Jonas',
    'mi': 'Miquéias',
    'na': 'Naum',
    'hk': 'Habacuque',
    'zp': 'Sofonias',
    'hg': 'Ageu',
    'zc': 'Zacarias',
    'ml': 'Malaquias',
    
    // New Testament
    'mt': 'Mateus',
    'mk': 'Marcos',
    'lk': 'Lucas',
    'jo': 'João',
    'act': 'Atos',
    'rm': 'Romanos',
    '1co': '1 Coríntios',
    '2co': '2 Coríntios',
    'gl': 'Gálatas',
    'eph': 'Efésios',
    'ph': 'Filipenses',
    'cl': 'Colossenses',
    '1ts': '1 Tessalonicenses',
    '2ts': '2 Tessalonicenses',
    '1tm': '1 Timóteo',
    '2tm': '2 Timóteo',
    'tt': 'Tito',
    'phm': 'Filemom',
    'hb': 'Hebreus',
    'jm': 'Tiago',
    '1pe': '1 Pedro',
    '2pe': '2 Pedro',
    '1jo': '1 João',
    '2jo': '2 João',
    '3jo': '3 João',
    'jd': 'Judas',
    're': 'Apocalipse'
  };
  
  return defaultBookNames[bookId.toLowerCase()] || null;
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
    
    // Search for book by name (case insensitive) in the specified version
    const { data: books, error: booksError } = await supabase
      .from('bible_books')
      .select('book_id, name')
      .eq('version_id', versionId)
      .ilike('name', `%${bookName}%`);
    
    if (booksError || !books || books.length === 0) {
      console.log(`No book found for "${bookName}" in version ${versionId}, trying any version...`);
      
      // Try to find the book in any version
      const { data: anyBooks, error: anyBooksError } = await supabase
        .from('bible_books')
        .select('book_id, name, version_id')
        .ilike('name', `%${bookName}%`)
        .limit(5);
      
      if (anyBooksError || !anyBooks || anyBooks.length === 0) {
        console.log(`No book found for "${bookName}" in any version`);
        return [];
      }
      
      console.log(`Found book in alternative versions:`, anyBooks);
      // Use the first available book and its version
      const book = anyBooks[0];
      versionId = book.version_id;
      
      return searchVersesByBookId(book.book_id, book.name, chapter, verse, versionId);
    }
    
    const book = books[0];
    console.log(`Found book: ${book.name} (${book.book_id})`);
    
    return searchVersesByBookId(book.book_id, book.name, chapter, verse, versionId);
    
  } catch (error) {
    console.error('Error in reference search:', error);
    return [];
  }
};

// Helper function to search verses by book ID
const searchVersesByBookId = async (
  bookId: string,
  bookName: string,
  chapter: number,
  verse?: number,
  versionId?: string
): Promise<BibleVerse[]> => {
  
  let query = supabase
    .from('bible_verses')
    .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
    .eq('book_id', bookId)
    .eq('chapter_number', chapter);
  
  if (versionId) {
    query = query.eq('version_id', versionId);
  }
  
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
    book_name: bookName
  }));
};
