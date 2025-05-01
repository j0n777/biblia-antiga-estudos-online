
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type BibleBook = {
  id: string;
  name: string;
  testament: 'old' | 'new';
  chaptersCount: number;
  position: number;
};

type BibleVersion = {
  id: string;
  name: string;
  language: string;
  languageName: string;
  isOriginal: boolean;
  originalLanguage?: 'hebrew' | 'greek' | 'aramaic';
};

// Type for the complete Bible version JSON format
type BibleBookJson = {
  id: string;
  name: string;
  chapters: string[][];
};

// Book ID mapping between API shortcodes and database IDs
const bookIdMapping: Record<string, string> = {
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
const reverseBookIdMapping: Record<string, string> = Object.fromEntries(
  Object.entries(bookIdMapping).map(([k, v]) => [v, k])
);

// Version and language information for our specific versions
const versionInfo: Record<string, {name: string, language: string, languageName: string}> = {
  'kjv': {name: 'King James Version', language: 'en', languageName: 'English'},
  'kja': {name: 'King James Atualizada', language: 'pt-br', languageName: 'Português'},
  'rvr': {name: 'Reina Valera 1909', language: 'es', languageName: 'Español'},
};

// Helper to determine testament
function getTestament(bookId: string): 'old' | 'new' {
  const newTestamentBooks = [
    'matthew', 'mark', 'luke', 'john', 'acts', 'romans', '1corinthians', 
    '2corinthians', 'galatians', 'ephesians', 'philippians', 'colossians', 
    '1thessalonians', '2thessalonians', '1timothy', '2timothy', 'titus', 
    'philemon', 'hebrews', 'james', '1peter', '2peter', '1john', '2john', 
    '3john', 'jude', 'revelation'
  ];
  
  return newTestamentBooks.includes(bookId.toLowerCase()) ? 'new' : 'old';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reqData = await req.json();
    const { action = 'import-books', version = 'kjv', bookId, language = 'en' } = reqData;
    console.log(`Processing action: ${action} for version: ${version}, language: ${language}`);
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Define the base URL for the GitHub repository
    const baseUrl = 'https://raw.githubusercontent.com/j0n777/bible-db/main';
    
    // Action to import Bible books metadata
    if (action === 'import-books') {
      // Define the Bible books metadata
      const bibleBooks: BibleBook[] = [
        // Old Testament (39 books)
        { id: 'genesis', name: 'Gênesis', testament: 'old', chaptersCount: 50, position: 1 },
        { id: 'exodus', name: 'Êxodo', testament: 'old', chaptersCount: 40, position: 2 },
        { id: 'leviticus', name: 'Levítico', testament: 'old', chaptersCount: 27, position: 3 },
        { id: 'numbers', name: 'Números', testament: 'old', chaptersCount: 36, position: 4 },
        { id: 'deuteronomy', name: 'Deuteronômio', testament: 'old', chaptersCount: 34, position: 5 },
        { id: 'joshua', name: 'Josué', testament: 'old', chaptersCount: 24, position: 6 },
        { id: 'judges', name: 'Juízes', testament: 'old', chaptersCount: 21, position: 7 },
        { id: 'ruth', name: 'Rute', testament: 'old', chaptersCount: 4, position: 8 },
        { id: '1samuel', name: '1 Samuel', testament: 'old', chaptersCount: 31, position: 9 },
        { id: '2samuel', name: '2 Samuel', testament: 'old', chaptersCount: 24, position: 10 },
        { id: '1kings', name: '1 Reis', testament: 'old', chaptersCount: 22, position: 11 },
        { id: '2kings', name: '2 Reis', testament: 'old', chaptersCount: 25, position: 12 },
        { id: '1chronicles', name: '1 Crônicas', testament: 'old', chaptersCount: 29, position: 13 },
        { id: '2chronicles', name: '2 Crônicas', testament: 'old', chaptersCount: 36, position: 14 },
        { id: 'ezra', name: 'Esdras', testament: 'old', chaptersCount: 10, position: 15 },
        { id: 'nehemiah', name: 'Neemias', testament: 'old', chaptersCount: 13, position: 16 },
        { id: 'esther', name: 'Ester', testament: 'old', chaptersCount: 10, position: 17 },
        { id: 'job', name: 'Jó', testament: 'old', chaptersCount: 42, position: 18 },
        { id: 'psalms', name: 'Salmos', testament: 'old', chaptersCount: 150, position: 19 },
        { id: 'proverbs', name: 'Provérbios', testament: 'old', chaptersCount: 31, position: 20 },
        { id: 'ecclesiastes', name: 'Eclesiastes', testament: 'old', chaptersCount: 12, position: 21 },
        { id: 'songofsolomon', name: 'Cânticos', testament: 'old', chaptersCount: 8, position: 22 },
        { id: 'isaiah', name: 'Isaías', testament: 'old', chaptersCount: 66, position: 23 },
        { id: 'jeremiah', name: 'Jeremias', testament: 'old', chaptersCount: 52, position: 24 },
        { id: 'lamentations', name: 'Lamentações', testament: 'old', chaptersCount: 5, position: 25 },
        { id: 'ezekiel', name: 'Ezequiel', testament: 'old', chaptersCount: 48, position: 26 },
        { id: 'daniel', name: 'Daniel', testament: 'old', chaptersCount: 12, position: 27 },
        { id: 'hosea', name: 'Oséias', testament: 'old', chaptersCount: 14, position: 28 },
        { id: 'joel', name: 'Joel', testament: 'old', chaptersCount: 3, position: 29 },
        { id: 'amos', name: 'Amós', testament: 'old', chaptersCount: 9, position: 30 },
        { id: 'obadiah', name: 'Obadias', testament: 'old', chaptersCount: 1, position: 31 },
        { id: 'jonah', name: 'Jonas', testament: 'old', chaptersCount: 4, position: 32 },
        { id: 'micah', name: 'Miquéias', testament: 'old', chaptersCount: 7, position: 33 },
        { id: 'nahum', name: 'Naum', testament: 'old', chaptersCount: 3, position: 34 },
        { id: 'habakkuk', name: 'Habacuque', testament: 'old', chaptersCount: 3, position: 35 },
        { id: 'zephaniah', name: 'Sofonias', testament: 'old', chaptersCount: 3, position: 36 },
        { id: 'haggai', name: 'Ageu', testament: 'old', chaptersCount: 2, position: 37 },
        { id: 'zechariah', name: 'Zacarias', testament: 'old', chaptersCount: 14, position: 38 },
        { id: 'malachi', name: 'Malaquias', testament: 'old', chaptersCount: 4, position: 39 },
        
        // New Testament (27 books)
        { id: 'matthew', name: 'Mateus', testament: 'new', chaptersCount: 28, position: 40 },
        { id: 'mark', name: 'Marcos', testament: 'new', chaptersCount: 16, position: 41 },
        { id: 'luke', name: 'Lucas', testament: 'new', chaptersCount: 24, position: 42 },
        { id: 'john', name: 'João', testament: 'new', chaptersCount: 21, position: 43 },
        { id: 'acts', name: 'Atos', testament: 'new', chaptersCount: 28, position: 44 },
        { id: 'romans', name: 'Romanos', testament: 'new', chaptersCount: 16, position: 45 },
        { id: '1corinthians', name: '1 Coríntios', testament: 'new', chaptersCount: 16, position: 46 },
        { id: '2corinthians', name: '2 Coríntios', testament: 'new', chaptersCount: 13, position: 47 },
        { id: 'galatians', name: 'Gálatas', testament: 'new', chaptersCount: 6, position: 48 },
        { id: 'ephesians', name: 'Efésios', testament: 'new', chaptersCount: 6, position: 49 },
        { id: 'philippians', name: 'Filipenses', testament: 'new', chaptersCount: 4, position: 50 },
        { id: 'colossians', name: 'Colossenses', testament: 'new', chaptersCount: 4, position: 51 },
        { id: '1thessalonians', name: '1 Tessalonicenses', testament: 'new', chaptersCount: 5, position: 52 },
        { id: '2thessalonians', name: '2 Tessalonicenses', testament: 'new', chaptersCount: 3, position: 53 },
        { id: '1timothy', name: '1 Timóteo', testament: 'new', chaptersCount: 6, position: 54 },
        { id: '2timothy', name: '2 Timóteo', testament: 'new', chaptersCount: 4, position: 55 },
        { id: 'titus', name: 'Tito', testament: 'new', chaptersCount: 3, position: 56 },
        { id: 'philemon', name: 'Filemom', testament: 'new', chaptersCount: 1, position: 57 },
        { id: 'hebrews', name: 'Hebreus', testament: 'new', chaptersCount: 13, position: 58 },
        { id: 'james', name: 'Tiago', testament: 'new', chaptersCount: 5, position: 59 },
        { id: '1peter', name: '1 Pedro', testament: 'new', chaptersCount: 5, position: 60 },
        { id: '2peter', name: '2 Pedro', testament: 'new', chaptersCount: 3, position: 61 },
        { id: '1john', name: '1 João', testament: 'new', chaptersCount: 5, position: 62 },
        { id: '2john', name: '2 João', testament: 'new', chaptersCount: 1, position: 63 },
        { id: '3john', name: '3 João', testament: 'new', chaptersCount: 1, position: 64 },
        { id: 'jude', name: 'Judas', testament: 'new', chaptersCount: 1, position: 65 },
        { id: 'revelation', name: 'Apocalipse', testament: 'new', chaptersCount: 22, position: 66 },
      ];
      
      // Define Bible versions
      const bibleVersions: BibleVersion[] = [
        { id: 'kjv', name: 'King James Version', language: 'en', languageName: 'English', isOriginal: false },
        { id: 'kja', name: 'King James Atualizada', language: 'pt-br', languageName: 'Português', isOriginal: false },
        { id: 'rvr', name: 'Reina Valera 1909', language: 'es', languageName: 'Español', isOriginal: false },
        { id: 'hebrew', name: 'Hebrew Bible', language: 'he', languageName: 'Hebrew', isOriginal: true, originalLanguage: 'hebrew' },
        { id: 'greek', name: 'Greek New Testament', language: 'el', languageName: 'Greek', isOriginal: true, originalLanguage: 'greek' },
      ];
      
      // Insert Bible books
      const { error: booksError } = await supabase
        .from('bible_books')
        .upsert(bibleBooks.map(book => ({
          id: book.id,
          name: book.name,
          testament: book.testament,
          chapters_count: book.chaptersCount,
          position: book.position
        })));
      
      if (booksError) {
        throw new Error(`Error inserting Bible books: ${booksError.message}`);
      }
      
      // Insert Bible versions
      const { error: versionsError } = await supabase
        .from('bible_versions')
        .upsert(bibleVersions.map(version => ({
          id: version.id,
          name: version.name,
          language: version.language,
          language_name: version.languageName,
          is_original: version.isOriginal,
          original_language: version.originalLanguage
        })));
      
      if (versionsError) {
        throw new Error(`Error inserting Bible versions: ${versionsError.message}`);
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Bible books and versions imported successfully',
        booksCount: bibleBooks.length,
        versionsCount: bibleVersions.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // New action to import entire version from a single JSON file
    else if (action === 'import-complete-version') {
      if (!version) {
        throw new Error('Version is required for importing a complete Bible version');
      }
      
      console.log(`Importing complete Bible version: ${version} in language: ${language}`);
      
      // URL for the complete Bible version JSON
      const versionFileUrl = `${baseUrl}/versions/${language}/${version}.json`;
      console.log(`Fetching complete Bible file from: ${versionFileUrl}`);
      
      const versionResponse = await fetch(versionFileUrl);
      
      if (!versionResponse.ok) {
        throw new Error(`Error fetching Bible version from ${versionFileUrl}: ${versionResponse.status} ${versionResponse.statusText}`);
      }
      
      const bibleData = await versionResponse.json();
      console.log(`Successfully fetched Bible version data with ${bibleData.length} books`);
      
      // Make sure the version exists in the database
      const versionInfoData = versionInfo[version] || {name: version.toUpperCase(), language, languageName: language};
      
      // Insert or update version record
      const { error: versionError } = await supabase
        .from('bible_versions')
        .upsert({
          id: version,
          name: versionInfoData.name,
          language: versionInfoData.language,
          language_name: versionInfoData.languageName,
          is_original: false
        });
      
      if (versionError) {
        console.error(`Error updating version: ${versionError.message}`);
      }
      
      // Process each book in the Bible data
      const importedBooks = [];
      const failedBooks = [];
      
      for (const book of bibleData) {
        try {
          // Map short ID to full ID if needed
          const shortId = book.id;
          const fullId = bookIdMapping[shortId] || shortId;
          
          console.log(`Processing book ${shortId}/${fullId}: ${book.name} with ${book.chapters.length} chapters`);
          
          // Get or create book metadata
          const testament = getTestament(fullId);
          const position = bibleBooks.find(b => b.id.toLowerCase() === fullId.toLowerCase())?.position || 0;
          const chaptersCount = book.chapters.length;
          
          // Insert or update the book record
          const { error: bookError } = await supabase
            .from('bible_books')
            .upsert({
              id: fullId,
              name: book.name,
              testament,
              chapters_count: chaptersCount,
              position
            });
          
          if (bookError) {
            console.error(`Error updating book ${fullId}: ${bookError.message}`);
            failedBooks.push({ id: fullId, error: bookError.message });
            continue;
          }
          
          // Process each chapter in the book
          for (let chapterIndex = 0; chapterIndex < book.chapters.length; chapterIndex++) {
            const chapterNumber = chapterIndex + 1;
            const verses = book.chapters[chapterIndex];
            const versesCount = verses.length;
            
            console.log(`Processing ${fullId} chapter ${chapterNumber} with ${versesCount} verses`);
            
            // Insert the chapter record
            const { data: chapterData, error: chapterError } = await supabase
              .from('bible_chapters')
              .upsert({
                book_id: fullId,
                version_id: version,
                chapter_number: chapterNumber,
                verses_count: versesCount,
              })
              .select('id')
              .single();
            
            if (chapterError || !chapterData) {
              console.error(`Error creating chapter ${chapterNumber} for ${fullId}: ${chapterError?.message || 'Unknown error'}`);
              continue;
            }
            
            // Prepare verses for insertion
            const versesForInsert = verses.map((text, verseIndex) => ({
              chapter_id: chapterData.id,
              verse_number: verseIndex + 1,
              text: text,
            }));
            
            // Insert verses in batches to avoid hitting size limits
            const batchSize = 100;
            for (let i = 0; i < versesForInsert.length; i += batchSize) {
              const batch = versesForInsert.slice(i, i + batchSize);
              
              const { error: versesError } = await supabase
                .from('bible_verses')
                .upsert(batch);
              
              if (versesError) {
                console.error(`Error inserting verses batch for ${fullId} chapter ${chapterNumber}: ${versesError.message}`);
                continue;
              }
            }
          }
          
          importedBooks.push({
            id: fullId,
            name: book.name,
            chaptersCount: book.chapters.length
          });
          
        } catch (bookError) {
          console.error(`Error processing book ${book.id}:`, bookError);
          failedBooks.push({ id: book.id, error: bookError instanceof Error ? bookError.message : 'Unknown error' });
          continue; // Skip this book and continue with others
        }
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: `Bible version ${version} (${language}) imported successfully`,
        importedBooks: importedBooks,
        failedBooks: failedBooks,
        totalBooks: bibleData.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Invalid action specified',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
    
  } catch (error) {
    console.error('Error in import-bible function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error instanceof Error ? error.stack : null,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
