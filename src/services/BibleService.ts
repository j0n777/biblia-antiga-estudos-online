import { supabase } from '@/integrations/supabase/client';

export type BibleBook = {
  id: string;
  name: string;
  testament: 'old' | 'new';
  chapters_count: number;
  position: number;
};

export type BibleVersion = {
  id: string;
  name: string;
  language: string;
  language_name: string;
  is_original: boolean;
  original_language?: 'hebrew' | 'greek' | 'aramaic';
};

export type BibleChapter = {
  book: string;
  bookName: string;
  chapter: number;
  verses: {
    number: number;
    text: string;
  }[];
  version: BibleVersion;
  originalLanguage: 'hebrew' | 'greek' | 'aramaic';
};

// Map between API book IDs and database book IDs
export const bookIdMapping: Record<string, string> = {
  'gn': 'genesis',
  'ex': 'exodus',
  'lv': 'leviticus',
  'nm': 'numbers',
  'dt': 'deuteronomy',
  'js': 'joshua',
  'jud': 'judges',
  'rt': 'ruth',
  '1sm': '1samuel',
  '2sm': '2samuel',
  '1kgs': '1kings',
  '2kgs': '2kings',
  '1ch': '1chronicles',
  '2ch': '2chronicles',
  'ezr': 'ezra',
  'ne': 'nehemiah',
  'et': 'esther',
  'job': 'job',
  'ps': 'psalms',
  'prv': 'proverbs',
  'ec': 'ecclesiastes',
  'so': 'songofsolomon',
  'is': 'isaiah',
  'jr': 'jeremiah',
  'lm': 'lamentations',
  'ez': 'ezekiel',
  'dn': 'daniel',
  'ho': 'hosea',
  'jl': 'joel',
  'am': 'amos',
  'ob': 'obadiah',
  'jn': 'jonah',
  'mi': 'micah',
  'na': 'nahum',
  'hk': 'habakkuk',
  'zp': 'zephaniah',
  'hg': 'haggai',
  'zc': 'zechariah',
  'ml': 'malachi',
  'mt': 'matthew',
  'mk': 'mark',
  'lk': 'luke',
  'jo': 'john',
  'act': 'acts',
  'rm': 'romans',
  '1co': '1corinthians',
  '2co': '2corinthians',
  'gl': 'galatians',
  'eph': 'ephesians',
  'ph': 'philippians',
  'cl': 'colossians',
  '1ts': '1thessalonians',
  '2ts': '2thessalonians',
  '1tm': '1timothy',
  '2tm': '2timothy',
  'tt': 'titus',
  'phm': 'philemon',
  'hb': 'hebrews',
  'jm': 'james',
  '1pe': '1peter',
  '2pe': '2peter',
  '1jo': '1john',
  '2jo': '2john',
  '3jo': '3john',
  'jd': 'jude',
  're': 'revelation',
};

// Database book IDs to API IDs (reverse mapping)
export const reverseBookIdMapping: Record<string, string> = Object.fromEntries(
  Object.entries(bookIdMapping).map(([k, v]) => [v, k])
);

export async function getAllBooks(): Promise<BibleBook[]> {
  try {
    const { data, error } = await supabase
      .from('bible_books')
      .select('*')
      .order('position');
      
    if (error) {
      throw new Error(`Error fetching Bible books: ${error.message}`);
    }
    
    // Explicitly cast the testament field to 'old' | 'new'
    return (data || []).map(book => ({
      ...book,
      testament: book.testament as 'old' | 'new'
    }));
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    return [];
  }
}

export async function getAllVersions(): Promise<BibleVersion[]> {
  try {
    const { data, error } = await supabase
      .from('bible_versions')
      .select('*')
      .not('is_original', 'eq', true);  // Do not include original language versions in the main selection
      
    if (error) {
      throw new Error(`Error fetching Bible versions: ${error.message}`);
    }
    
    // Explicitly cast the original_language field if it exists
    return (data || []).map(version => ({
      ...version,
      original_language: version.original_language as 'hebrew' | 'greek' | 'aramaic' | undefined
    }));
  } catch (error) {
    console.error('Error in getAllVersions:', error);
    return [];
  }
}

export async function getChapter(
  book: string, 
  chapter: number, 
  version: string = 'kja'
): Promise<BibleChapter | null> {
  try {
    console.log(`Fetching chapter: Book=${book}, Chapter=${chapter}, Version=${version}`);
    
    // Call our edge function
    const response = await supabase.functions.invoke('fetch-bible-data', {
      body: JSON.stringify({
        action: 'get-chapter',
        book,
        chapter,
        version
      })
    });
    
    if (response.error) {
      throw new Error(`Error fetching chapter: ${response.error.message}`);
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Unknown error');
    }
    
    return response.data.data as BibleChapter;
  } catch (error) {
    console.error('Error in getChapter:', error);
    return null;
  }
}

// This is a temporary function that will be used until we have proper data loaded
export function getChapterMock(
  book: string, 
  chapter: number,
  version: string = 'kja'
): BibleChapter {
  // Mock data for Genesis 1
  const verses = [
    { number: 1, text: "No princípio criou Deus os céus e a terra." },
    { number: 2, text: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas." },
    { number: 3, text: "E disse Deus: Haja luz; e houve luz." },
    { number: 4, text: "E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas." },
    { number: 5, text: "E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro." },
    // Add more verses as needed
  ];

  // Get localized version name based on the version ID
  const versionInfo = getVersionInfo(version);
  
  return {
    book,
    bookName: getBookName(book),
    chapter,
    verses,
    version: {
      id: version,
      name: versionInfo.name,
      language: versionInfo.language,
      language_name: versionInfo.languageName,
      is_original: false
    },
    originalLanguage: "hebrew"
  };
}

// Helper function to get version information
function getVersionInfo(versionId: string): {name: string, language: string, languageName: string} {
  const versionMap: Record<string, {name: string, language: string, languageName: string}> = {
    'kjv': {name: 'King James Version', language: 'en', languageName: 'English'},
    'kja': {name: 'King James Atualizada', language: 'pt-br', languageName: 'Português'},
    'rvr': {name: 'Reina Valera 1909', language: 'es', languageName: 'Español'},
  };
  
  return versionMap[versionId] || {name: versionId.toUpperCase(), language: 'en', languageName: 'English'};
}

// Helper function to get book name
function getBookName(bookId: string): string {
  const bookNames: Record<string, string> = {
    'genesis': 'Gênesis',
    'exodus': 'Êxodo',
    'leviticus': 'Levítico',
    // ... other books
    'revelation': 'Apocalipse'
  };
  
  return bookNames[bookId] || bookId.charAt(0).toUpperCase() + bookId.slice(1);
}

export async function importInitialVersions(): Promise<any> {
  try {
    // Import the three main versions we need - this can be called at app initialization
    const versions = [
      { version: 'kjv', language: 'en' },
      { version: 'kja', language: 'pt-br' },
      { version: 'rvr', language: 'es' }
    ];
    
    const results = [];
    
    for (const v of versions) {
      const response = await supabase.functions.invoke('import-bible', {
        body: JSON.stringify({
          action: 'import-complete-version',
          version: v.version,
          language: v.language
        })
      });
      
      results.push({
        version: v.version,
        success: !response.error && response.data?.success,
        message: response.error?.message || response.data?.message || 'Unknown status',
        data: response.data
      });
    }
    
    return {
      success: results.every(r => r.success),
      results
    };
  } catch (error) {
    console.error('Error importing initial versions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function importCompleteVersion(version: string, language: string): Promise<any> {
  try {
    // Call our edge function to import the complete version
    const response = await supabase.functions.invoke('import-bible', {
      body: JSON.stringify({
        action: 'import-complete-version',
        version,
        language
      })
    });
    
    if (response.error) {
      throw new Error(`Error importing Bible version: ${response.error.message}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error importing Bible version:', error);
    throw error;
  }
}
