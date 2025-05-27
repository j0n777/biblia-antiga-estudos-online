
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
    
    // First, let's check what versions and data we actually have
    console.log('=== CHECKING AVAILABLE DATA ===');
    
    // Check versions in database
    const { data: versions, error: versionsError } = await supabase
      .from('bible_versions')
      .select('id, name, language')
      .limit(10);
    
    if (!versionsError && versions) {
      console.log('Available versions:', versions);
    }
    
    // Check what data exists for KJA specifically
    const { data: kjaCheck, error: kjaError } = await supabase
      .from('bible_verses')
      .select('version_id, book_id, chapter_number, verse_number, text')
      .eq('version_id', 'kja')
      .not('text', 'is', null)
      .limit(5);
    
    if (!kjaError) {
      console.log('KJA verses sample:', kjaCheck);
    } else {
      console.log('Error checking KJA:', kjaError);
    }
    
    // Check general verse data structure
    const { data: generalCheck, error: generalError } = await supabase
      .from('bible_verses')
      .select('version_id, book_id, chapter_number, verse_number, text')
      .not('text', 'is', null)
      .not('book_id', 'is', null)
      .limit(10);
    
    if (!generalError) {
      console.log('General verses with book_id:', generalCheck);
    }
    
    // Check if it's a reference search (like "joão 3:16" or "genesis 1:1")
    const referenceMatch = query.match(/([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)\s*(\d+)(?::(\d+))?/i);
    
    if (referenceMatch) {
      console.log('Reference search detected');
      const [, bookName, chapter, verse] = referenceMatch;
      return await searchByReference(bookName.trim(), parseInt(chapter), verse ? parseInt(verse) : undefined, versionId);
    }
    
    // Text search in verses
    console.log('=== PERFORMING TEXT SEARCH ===');
    const searchTerm = query.trim();
    
    let verses: any[] = [];
    
    // Strategy 1: Search in preferred version with valid book_id
    if (versionId) {
      console.log(`Strategy 1: Searching in version ${versionId} with valid book_id`);
      const { data: versionVerses, error } = await supabase
        .from('bible_verses')
        .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
        .eq('version_id', versionId)
        .not('book_id', 'is', null)
        .not('text', 'is', null)
        .ilike('text', `%${searchTerm}%`)
        .limit(limit);
      
      if (!error && versionVerses && versionVerses.length > 0) {
        verses = versionVerses;
        console.log(`Found ${verses.length} verses in ${versionId} with book_id`);
      } else {
        console.log(`No results in ${versionId} with valid book_id`);
      }
    }
    
    // Strategy 2: Search in KJA without book_id filter (fallback)
    if (verses.length === 0 && versionId === 'kja') {
      console.log('Strategy 2: Searching in KJA without book_id filter');
      const { data: kjaFallback, error: kjaFallbackError } = await supabase
        .from('bible_verses')
        .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
        .eq('version_id', 'kja')
        .not('text', 'is', null)
        .ilike('text', `%${searchTerm}%`)
        .limit(limit);
      
      if (!kjaFallbackError && kjaFallback && kjaFallback.length > 0) {
        verses = kjaFallback;
        console.log(`Found ${verses.length} verses in KJA fallback`);
      }
    }
    
    // Strategy 3: Search in any version with valid book_id
    if (verses.length === 0) {
      console.log('Strategy 3: Searching in any version with valid book_id');
      const { data: anyVersionVerses, error: altError } = await supabase
        .from('bible_verses')
        .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
        .not('version_id', 'is', null)
        .not('book_id', 'is', null)
        .not('text', 'is', null)
        .ilike('text', `%${searchTerm}%`)
        .limit(limit);
      
      if (!altError && anyVersionVerses && anyVersionVerses.length > 0) {
        verses = anyVersionVerses;
        console.log(`Found ${verses.length} verses in alternative versions with book_id`);
      }
    }
    
    // Strategy 4: Last resort - search without any filters except text
    if (verses.length === 0) {
      console.log('Strategy 4: Last resort search');
      const { data: allVerses, error: allError } = await supabase
        .from('bible_verses')
        .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
        .not('text', 'is', null)
        .ilike('text', `%${searchTerm}%`)
        .limit(limit);
      
      if (!allError && allVerses && allVerses.length > 0) {
        verses = allVerses;
        console.log(`Found ${verses.length} verses in last resort search`);
      }
    }
    
    if (!verses || verses.length === 0) {
      console.log('=== NO RESULTS FOUND ===');
      return [];
    }
    
    console.log('Sample verse before processing:', verses[0]);
    
    // Add book names to results
    return await addBookNamesToVerses(verses, versionId || 'unknown');
    
  } catch (error) {
    console.error('Error in searchBible:', error);
    return [];
  }
};

// Helper function to add book names to verses
const addBookNamesToVerses = async (verses: any[], preferredVersionId: string): Promise<BibleVerse[]> => {
  if (!verses || verses.length === 0) return [];
  
  console.log(`=== ADDING BOOK NAMES TO ${verses.length} VERSES ===`);
  
  // Get unique book IDs from the verses (filter out null/undefined)
  const bookIds = [...new Set(verses.map(verse => verse.book_id).filter(Boolean))];
  console.log(`Book IDs found in verses: ${bookIds.join(', ')}`);
  
  if (bookIds.length === 0) {
    console.log('No valid book_ids found, using fallback names');
    return verses.map(verse => ({
      ...verse,
      book_name: `Livro ${verse.chapter_number || 'Desconhecido'}`
    }));
  }
  
  // Try to get book names - first from preferred version, then any version
  const { data: bookData, error: bookError } = await supabase
    .from('bible_books')
    .select('book_id, name, version_id')
    .in('book_id', bookIds);
  
  if (bookError) {
    console.error('Error fetching book names:', bookError);
  } else {
    console.log(`Found ${bookData?.length || 0} book records:`, bookData);
  }
  
  // Create lookup map - prefer matching version, but accept any version
  const bookNames: Record<string, string> = {};
  if (bookData) {
    // First pass: exact version matches
    bookData.filter(book => book.version_id === preferredVersionId).forEach(book => {
      if (book.book_id && book.name) {
        bookNames[book.book_id] = book.name;
      }
    });
    
    // Second pass: any version for missing books
    bookData.forEach(book => {
      if (book.book_id && book.name && !bookNames[book.book_id]) {
        bookNames[book.book_id] = book.name;
      }
    });
  }
  
  console.log('Book names mapping:', bookNames);
  
  // Return verses with book names
  return verses.map(verse => {
    const bookName = verse.book_id 
      ? (bookNames[verse.book_id] || getDefaultBookName(verse.book_id) || `Livro ${verse.book_id}`)
      : `Capítulo ${verse.chapter_number || 'Desconhecido'}`;
    
    console.log(`Verse ${verse.id}: book_id="${verse.book_id}" -> book_name="${bookName}"`);
    
    return {
      ...verse,
      book_name: bookName
    };
  });
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
