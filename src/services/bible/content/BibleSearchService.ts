
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
    
    // First, let's check what data we actually have
    const { data: verseSample, error: sampleError } = await supabase
      .from('bible_verses')
      .select('version_id, book_id, chapter_number, verse_number, text')
      .not('text', 'is', null)
      .limit(10);
    
    if (sampleError) {
      console.error('Error checking verse sample:', sampleError);
    } else {
      console.log('Sample verses in database:', verseSample);
      const availableVersions = [...new Set(verseSample?.map(v => v.version_id).filter(Boolean) || [])];
      console.log('Available versions from sample:', availableVersions);
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
    
    // Try multiple search strategies
    let verses: any[] = [];
    
    // Strategy 1: Search in preferred version
    if (versionId) {
      console.log(`Strategy 1: Searching in preferred version: ${versionId}`);
      const { data: versionVerses, error } = await supabase
        .from('bible_verses')
        .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
        .eq('version_id', versionId)
        .ilike('text', `%${searchTerm}%`)
        .limit(limit);
      
      if (!error && versionVerses && versionVerses.length > 0) {
        verses = versionVerses;
        console.log(`Found ${verses.length} verses in preferred version`);
      } else {
        console.log(`No results in preferred version (${versionId})`);
      }
    }
    
    // Strategy 2: If no results, search in any version
    if (verses.length === 0) {
      console.log('Strategy 2: Searching in any available version...');
      const { data: anyVersionVerses, error: altError } = await supabase
        .from('bible_verses')
        .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
        .ilike('text', `%${searchTerm}%`)
        .not('version_id', 'is', null)
        .limit(limit);
      
      if (!altError && anyVersionVerses && anyVersionVerses.length > 0) {
        verses = anyVersionVerses;
        console.log(`Found ${verses.length} verses in alternative versions`);
      } else {
        console.log('No results in any version with version_id');
      }
    }
    
    // Strategy 3: If still no results, search without version filter (including null version_id)
    if (verses.length === 0) {
      console.log('Strategy 3: Searching without version filter...');
      const { data: allVerses, error: allError } = await supabase
        .from('bible_verses')
        .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
        .ilike('text', `%${searchTerm}%`)
        .limit(limit);
      
      if (!allError && allVerses && allVerses.length > 0) {
        verses = allVerses;
        console.log(`Found ${verses.length} verses without version filter`);
      } else {
        console.log('No results found at all');
      }
    }
    
    if (!verses || verses.length === 0) {
      console.log('=== NO RESULTS FOUND ===');
      return [];
    }
    
    // Add book names to results
    return await addBookNamesToVerses(verses, verses[0].version_id || 'unknown');
    
  } catch (error) {
    console.error('Error in searchBible:', error);
    return [];
  }
};

// Helper function to add book names to verses
const addBookNamesToVerses = async (verses: any[], versionId: string): Promise<BibleVerse[]> => {
  if (!verses || verses.length === 0) return [];
  
  console.log(`Adding book names to ${verses.length} verses`);
  
  // Get unique book IDs from the verses
  const bookIds = [...new Set(verses.map(verse => verse.book_id).filter(Boolean))];
  console.log(`Looking up book names for book_ids: ${bookIds.join(', ')}`);
  
  // Try to get book names from any version since we might have mixed versions
  const { data: bookData, error: bookError } = await supabase
    .from('bible_books')
    .select('book_id, name, version_id')
    .in('book_id', bookIds);
  
  if (bookError) {
    console.error('Error fetching book names:', bookError);
  } else {
    console.log(`Found ${bookData?.length || 0} book records`);
  }
  
  // Create lookup map - prefer matching version, but accept any version
  const bookNames: Record<string, string> = {};
  if (bookData) {
    // First pass: exact version matches
    bookData.filter(book => book.version_id === versionId).forEach(book => {
      bookNames[book.book_id] = book.name;
    });
    
    // Second pass: any version for missing books
    bookData.forEach(book => {
      if (!bookNames[book.book_id]) {
        bookNames[book.book_id] = book.name;
      }
    });
  }
  
  // Return verses with book names
  return verses.map(verse => ({
    ...verse,
    book_name: bookNames[verse.book_id] || getDefaultBookName(verse.book_id) || `Livro ${verse.book_id || 'Desconhecido'}`
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
    console.log(`Reference search: ${bookName} ${chapter}${verse ? ':' + verse : ''}`);
    
    // Search for book by name (case insensitive) in any version
    const { data: books, error: booksError } = await supabase
      .from('bible_books')
      .select('book_id, name, version_id')
      .ilike('name', `%${bookName}%`);
    
    if (booksError || !books || books.length === 0) {
      console.log(`No book found for "${bookName}"`);
      return [];
    }
    
    console.log(`Found books:`, books);
    
    // Prefer the requested version, but accept any version
    let selectedBook = books.find(book => book.version_id === versionId) || books[0];
    console.log(`Using book: ${selectedBook.name} (${selectedBook.book_id}) from version ${selectedBook.version_id}`);
    
    return searchVersesByBookId(selectedBook.book_id, selectedBook.name, chapter, verse, selectedBook.version_id);
    
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
