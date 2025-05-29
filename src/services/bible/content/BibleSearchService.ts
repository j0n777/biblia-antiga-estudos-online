import { supabase } from '@/integrations/supabase/client';
import { BibleVerse } from '@/types/bible.types';
import { getUserProfile } from '@/services/ProfileService';

export interface SearchResult {
  verses: BibleVerse[];
  totalCount: number;
  hasMore: boolean;
}

/**
 * Search the Bible for specific text or references with pagination
 */
export const searchBibleVerses = async (
  query: string, 
  versionId?: string,
  page: number = 1,
  pageSize: number = 10,
  wholeWordsOnly: boolean = true
): Promise<SearchResult> => {
  if (!query || query.trim().length < 2) {
    console.log('Query too short or empty');
    return { verses: [], totalCount: 0, hasMore: false };
  }
  
  try {
    console.log('=== SEARCH DEBUG START ===');
    console.log(`Query: "${query}"`);
    console.log(`Page: ${page}, PageSize: ${pageSize}`);
    console.log(`Whole words only: ${wholeWordsOnly}`);
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
    
    // Check if it's a reference search (like "joão 3:16" or "genesis 1:1")
    const referenceMatch = query.match(/([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)\s*(\d+)(?::(\d+))?/i);
    
    if (referenceMatch) {
      console.log('Reference search detected');
      const [, bookName, chapter, verse] = referenceMatch;
      const result = await searchByReference(bookName.trim(), parseInt(chapter), verse ? parseInt(verse) : undefined, versionId);
      return {
        verses: result,
        totalCount: result.length,
        hasMore: false
      };
    }
    
    // Text search in verses with pagination
    console.log('=== PERFORMING TEXT SEARCH ===');
    const searchTerm = query.trim();
    
    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;
    
    let verses: any[] = [];
    let totalCount = 0;
    
    // Create search pattern for whole words or partial match
    const searchPattern = wholeWordsOnly 
      ? `\\m${searchTerm}\\M` // PostgreSQL word boundary regex
      : `%${searchTerm}%`; // Standard LIKE pattern
    
    // Strategy 1: Search in preferred version
    if (versionId) {
      console.log(`Strategy 1: Searching in version ${versionId}`);
      
      // Get total count first
      const { count, error: countError } = await supabase
        .from('bible_verses')
        .select('*', { count: 'exact', head: true })
        .eq('version_id', versionId)
        .not('book_id', 'is', null)
        .not('text', 'is', null)
        [wholeWordsOnly ? 'textSearch' : 'ilike']('text', searchPattern);
      
      if (!countError) {
        totalCount = count || 0;
        console.log(`Total count in ${versionId}: ${totalCount}`);
      }
      
      // Get paginated results
      const query = supabase
        .from('bible_verses')
        .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
        .eq('version_id', versionId)
        .not('book_id', 'is', null)
        .not('text', 'is', null);
      
      const { data: versionVerses, error } = wholeWordsOnly
        ? await query.textSearch('text', searchPattern).range(offset, offset + pageSize - 1)
        : await query.ilike('text', searchPattern).range(offset, offset + pageSize - 1);
      
      if (!error && versionVerses && versionVerses.length > 0) {
        verses = versionVerses;
        console.log(`Found ${verses.length} verses in ${versionId} (page ${page})`);
      } else {
        console.log(`No results in ${versionId}`);
      }
    }
    
    // Strategy 2: Search in any version if no results in preferred version
    if (verses.length === 0) {
      console.log('Strategy 2: Searching in any version');
      
      // Get total count
      const { count, error: countError } = await supabase
        .from('bible_verses')
        .select('*', { count: 'exact', head: true })
        .not('version_id', 'is', null)
        .not('book_id', 'is', null)
        .not('text', 'is', null)
        [wholeWordsOnly ? 'textSearch' : 'ilike']('text', searchPattern);
      
      if (!countError) {
        totalCount = count || 0;
        console.log(`Total count in any version: ${totalCount}`);
      }
      
      // Get paginated results
      const query = supabase
        .from('bible_verses')
        .select('id, text, book_id, chapter_number, verse_number, version_id, chapter_id')
        .not('version_id', 'is', null)
        .not('book_id', 'is', null)
        .not('text', 'is', null);
      
      const { data: anyVersionVerses, error: altError } = wholeWordsOnly
        ? await query.textSearch('text', searchPattern).range(offset, offset + pageSize - 1)
        : await query.ilike('text', searchPattern).range(offset, offset + pageSize - 1);
      
      if (!altError && anyVersionVerses && anyVersionVerses.length > 0) {
        verses = anyVersionVerses;
        console.log(`Found ${verses.length} verses in alternative versions (page ${page})`);
      }
    }
    
    if (!verses || verses.length === 0) {
      console.log('=== NO RESULTS FOUND ===');
      return { verses: [], totalCount: 0, hasMore: false };
    }
    
    console.log('Sample verse before processing:', verses[0]);
    
    // Add book names to results
    const versesWithBookNames = await addBookNamesToVerses(verses, versionId || 'unknown');
    
    const hasMore = totalCount > offset + verses.length;
    
    return {
      verses: versesWithBookNames,
      totalCount,
      hasMore
    };
    
  } catch (error) {
    console.error('Error in searchBible:', error);
    return { verses: [], totalCount: 0, hasMore: false };
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
