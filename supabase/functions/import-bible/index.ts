
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

// Localized book names based on language
const bookNamesByLanguage: Record<string, Record<string, string>> = {
  'en': {
    'genesis': 'Genesis',
    'exodus': 'Exodus',
    'leviticus': 'Leviticus',
    'numbers': 'Numbers',
    'deuteronomy': 'Deuteronomy',
    'joshua': 'Joshua',
    'judges': 'Judges',
    'ruth': 'Ruth',
    '1samuel': '1 Samuel',
    '2samuel': '2 Samuel',
    '1kings': '1 Kings',
    '2kings': '2 Kings',
    '1chronicles': '1 Chronicles',
    '2chronicles': '2 Chronicles',
    'ezra': 'Ezra',
    'nehemiah': 'Nehemiah',
    'esther': 'Esther',
    'job': 'Job',
    'psalms': 'Psalms',
    'proverbs': 'Proverbs',
    'ecclesiastes': 'Ecclesiastes',
    'songofsolomon': 'Song of Solomon',
    'isaiah': 'Isaiah',
    'jeremiah': 'Jeremiah',
    'lamentations': 'Lamentations',
    'ezekiel': 'Ezekiel',
    'daniel': 'Daniel',
    'hosea': 'Hosea',
    'joel': 'Joel',
    'amos': 'Amos',
    'obadiah': 'Obadiah',
    'jonah': 'Jonah',
    'micah': 'Micah',
    'nahum': 'Nahum',
    'habakkuk': 'Habakkuk',
    'zephaniah': 'Zephaniah',
    'haggai': 'Haggai',
    'zechariah': 'Zechariah',
    'malachi': 'Malachi',
    'matthew': 'Matthew',
    'mark': 'Mark',
    'luke': 'Luke',
    'john': 'John',
    'acts': 'Acts',
    'romans': 'Romans',
    '1corinthians': '1 Corinthians',
    '2corinthians': '2 Corinthians',
    'galatians': 'Galatians',
    'ephesians': 'Ephesians',
    'philippians': 'Philippians',
    'colossians': 'Colossians',
    '1thessalonians': '1 Thessalonians',
    '2thessalonians': '2 Thessalonians',
    '1timothy': '1 Timothy',
    '2timothy': '2 Timothy',
    'titus': 'Titus',
    'philemon': 'Philemon',
    'hebrews': 'Hebrews',
    'james': 'James',
    '1peter': '1 Peter',
    '2peter': '2 Peter',
    '1john': '1 John',
    '2john': '2 John',
    '3john': '3 John',
    'jude': 'Jude',
    'revelation': 'Revelation',
  },
  'pt-br': {
    'genesis': 'Gênesis',
    'exodus': 'Êxodo',
    'leviticus': 'Levítico',
    'numbers': 'Números',
    'deuteronomy': 'Deuteronômio',
    'joshua': 'Josué',
    'judges': 'Juízes',
    'ruth': 'Rute',
    '1samuel': '1 Samuel',
    '2samuel': '2 Samuel',
    '1kings': '1 Reis',
    '2kings': '2 Reis',
    '1chronicles': '1 Crônicas',
    '2chronicles': '2 Crônicas',
    'ezra': 'Esdras',
    'nehemiah': 'Neemias',
    'esther': 'Ester',
    'job': 'Jó',
    'psalms': 'Salmos',
    'proverbs': 'Provérbios',
    'ecclesiastes': 'Eclesiastes',
    'songofsolomon': 'Cânticos',
    'isaiah': 'Isaías',
    'jeremiah': 'Jeremias',
    'lamentations': 'Lamentações',
    'ezekiel': 'Ezequiel',
    'daniel': 'Daniel',
    'hosea': 'Oséias',
    'joel': 'Joel',
    'amos': 'Amós',
    'obadiah': 'Obadias',
    'jonah': 'Jonas',
    'micah': 'Miquéias',
    'nahum': 'Naum',
    'habakkuk': 'Habacuque',
    'zephaniah': 'Sofonias',
    'haggai': 'Ageu',
    'zechariah': 'Zacarias',
    'malachi': 'Malaquias',
    'matthew': 'Mateus',
    'mark': 'Marcos',
    'luke': 'Lucas',
    'john': 'João',
    'acts': 'Atos',
    'romans': 'Romanos',
    '1corinthians': '1 Coríntios',
    '2corinthians': '2 Coríntios',
    'galatians': 'Gálatas',
    'ephesians': 'Efésios',
    'philippians': 'Filipenses',
    'colossians': 'Colossenses',
    '1thessalonians': '1 Tessalonicenses',
    '2thessalonians': '2 Tessalonicenses',
    '1timothy': '1 Timóteo',
    '2timothy': '2 Timóteo',
    'titus': 'Tito',
    'philemon': 'Filemom',
    'hebrews': 'Hebreus',
    'james': 'Tiago',
    '1peter': '1 Pedro',
    '2peter': '2 Pedro',
    '1john': '1 João',
    '2john': '2 João',
    '3john': '3 João',
    'jude': 'Judas',
    'revelation': 'Apocalipse',
  },
  'es': {
    'genesis': 'Génesis',
    'exodus': 'Éxodo',
    'leviticus': 'Levítico',
    'numbers': 'Números',
    'deuteronomy': 'Deuteronomio',
    'joshua': 'Josué',
    'judges': 'Jueces',
    'ruth': 'Rut',
    '1samuel': '1 Samuel',
    '2samuel': '2 Samuel',
    '1kings': '1 Reyes',
    '2kings': '2 Reyes',
    '1chronicles': '1 Crónicas',
    '2chronicles': '2 Crónicas',
    'ezra': 'Esdras',
    'nehemiah': 'Nehemías',
    'esther': 'Ester',
    'job': 'Job',
    'psalms': 'Salmos',
    'proverbs': 'Proverbios',
    'ecclesiastes': 'Eclesiastés',
    'songofsolomon': 'Cantares',
    'isaiah': 'Isaías',
    'jeremiah': 'Jeremías',
    'lamentations': 'Lamentaciones',
    'ezekiel': 'Ezequiel',
    'daniel': 'Daniel',
    'hosea': 'Oseas',
    'joel': 'Joel',
    'amos': 'Amós',
    'obadiah': 'Abdías',
    'jonah': 'Jonás',
    'micah': 'Miqueas',
    'nahum': 'Nahúm',
    'habakkuk': 'Habacuc',
    'zephaniah': 'Sofonías',
    'haggai': 'Hageo',
    'zechariah': 'Zacarías',
    'malachi': 'Malaquías',
    'matthew': 'Mateo',
    'mark': 'Marcos',
    'luke': 'Lucas',
    'john': 'Juan',
    'acts': 'Hechos',
    'romans': 'Romanos',
    '1corinthians': '1 Corintios',
    '2corinthians': '2 Corintios',
    'galatians': 'Gálatas',
    'ephesians': 'Efesios',
    'philippians': 'Filipenses',
    'colossians': 'Colosenses',
    '1thessalonians': '1 Tesalonicenses',
    '2thessalonians': '2 Tesalonicenses',
    '1timothy': '1 Timoteo',
    '2timothy': '2 Timoteo',
    'titus': 'Tito',
    'philemon': 'Filemón',
    'hebrews': 'Hebreos',
    'james': 'Santiago',
    '1peter': '1 Pedro',
    '2peter': '2 Pedro',
    '1john': '1 Juan',
    '2john': '2 Juan',
    '3john': '3 Juan',
    'jude': 'Judas',
    'revelation': 'Apocalipsis',
  }
};

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

// Book position in the Bible
const bibleBooks = [
  // Old Testament (39 books)
  { id: 'genesis', name: 'Gênesis', testament: 'old', position: 1 },
  { id: 'exodus', name: 'Êxodo', testament: 'old', position: 2 },
  { id: 'leviticus', name: 'Levítico', testament: 'old', position: 3 },
  { id: 'numbers', name: 'Números', testament: 'old', position: 4 },
  { id: 'deuteronomy', name: 'Deuteronômio', testament: 'old', position: 5 },
  { id: 'joshua', name: 'Josué', testament: 'old', position: 6 },
  { id: 'judges', name: 'Juízes', testament: 'old', position: 7 },
  { id: 'ruth', name: 'Rute', testament: 'old', position: 8 },
  { id: '1samuel', name: '1 Samuel', testament: 'old', position: 9 },
  { id: '2samuel', name: '2 Samuel', testament: 'old', position: 10 },
  { id: '1kings', name: '1 Reis', testament: 'old', position: 11 },
  { id: '2kings', name: '2 Reis', testament: 'old', position: 12 },
  { id: '1chronicles', name: '1 Crônicas', testament: 'old', position: 13 },
  { id: '2chronicles', name: '2 Crônicas', testament: 'old', position: 14 },
  { id: 'ezra', name: 'Esdras', testament: 'old', position: 15 },
  { id: 'nehemiah', name: 'Neemias', testament: 'old', position: 16 },
  { id: 'esther', name: 'Ester', testament: 'old', position: 17 },
  { id: 'job', name: 'Jó', testament: 'old', position: 18 },
  { id: 'psalms', name: 'Salmos', testament: 'old', position: 19 },
  { id: 'proverbs', name: 'Provérbios', testament: 'old', position: 20 },
  { id: 'ecclesiastes', name: 'Eclesiastes', testament: 'old', position: 21 },
  { id: 'songofsolomon', name: 'Cânticos', testament: 'old', position: 22 },
  { id: 'isaiah', name: 'Isaías', testament: 'old', position: 23 },
  { id: 'jeremiah', name: 'Jeremias', testament: 'old', position: 24 },
  { id: 'lamentations', name: 'Lamentações', testament: 'old', position: 25 },
  { id: 'ezekiel', name: 'Ezequiel', testament: 'old', position: 26 },
  { id: 'daniel', name: 'Daniel', testament: 'old', position: 27 },
  { id: 'hosea', name: 'Oséias', testament: 'old', position: 28 },
  { id: 'joel', name: 'Joel', testament: 'old', position: 29 },
  { id: 'amos', name: 'Amós', testament: 'old', position: 30 },
  { id: 'obadiah', name: 'Obadias', testament: 'old', position: 31 },
  { id: 'jonah', name: 'Jonas', testament: 'old', position: 32 },
  { id: 'micah', name: 'Miquéias', testament: 'old', position: 33 },
  { id: 'nahum', name: 'Naum', testament: 'old', position: 34 },
  { id: 'habakkuk', name: 'Habacuque', testament: 'old', position: 35 },
  { id: 'zephaniah', name: 'Sofonias', testament: 'old', position: 36 },
  { id: 'haggai', name: 'Ageu', testament: 'old', position: 37 },
  { id: 'zechariah', name: 'Zacarias', testament: 'old', position: 38 },
  { id: 'malachi', name: 'Malaquias', testament: 'old', position: 39 },
  
  // New Testament (27 books)
  { id: 'matthew', name: 'Mateus', testament: 'new', position: 40 },
  { id: 'mark', name: 'Marcos', testament: 'new', position: 41 },
  { id: 'luke', name: 'Lucas', testament: 'new', position: 42 },
  { id: 'john', name: 'João', testament: 'new', position: 43 },
  { id: 'acts', name: 'Atos', testament: 'new', position: 44 },
  { id: 'romans', name: 'Romanos', testament: 'new', position: 45 },
  { id: '1corinthians', name: '1 Coríntios', testament: 'new', position: 46 },
  { id: '2corinthians', name: '2 Coríntios', testament: 'new', position: 47 },
  { id: 'galatians', name: 'Gálatas', testament: 'new', position: 48 },
  { id: 'ephesians', name: 'Efésios', testament: 'new', position: 49 },
  { id: 'philippians', name: 'Filipenses', testament: 'new', position: 50 },
  { id: 'colossians', name: 'Colossenses', testament: 'new', position: 51 },
  { id: '1thessalonians', name: '1 Tessalonicenses', testament: 'new', position: 52 },
  { id: '2thessalonians', name: '2 Tessalonicenses', testament: 'new', position: 53 },
  { id: '1timothy', name: '1 Timóteo', testament: 'new', position: 54 },
  { id: '2timothy', name: '2 Timóteo', testament: 'new', position: 55 },
  { id: 'titus', name: 'Tito', testament: 'new', position: 56 },
  { id: 'philemon', name: 'Filemom', testament: 'new', position: 57 },
  { id: 'hebrews', name: 'Hebreus', testament: 'new', position: 58 },
  { id: 'james', name: 'Tiago', testament: 'new', position: 59 },
  { id: '1peter', name: '1 Pedro', testament: 'new', position: 60 },
  { id: '2peter', name: '2 Pedro', testament: 'new', position: 61 },
  { id: '1john', name: '1 João', testament: 'new', position: 62 },
  { id: '2john', name: '2 João', testament: 'new', position: 63 },
  { id: '3john', name: '3 João', testament: 'new', position: 64 },
  { id: 'jude', name: 'Judas', testament: 'new', position: 65 },
  { id: 'revelation', name: 'Apocalipse', testament: 'new', position: 66 },
];

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
      // Insert Bible books with proper localized names
      const localizedBooks = Object.keys(bookNamesByLanguage).flatMap(lang => {
        return Object.entries(bookNamesByLanguage[lang]).map(([id, name]) => {
          const book = bibleBooks.find(b => b.id === id);
          if (!book) return null;
          
          return {
            id,
            name,
            language: lang,
            testament: book.testament,
            chapters_count: 0, // Will be updated when importing versions
            position: book.position
          };
        }).filter(Boolean);
      });
      
      // Define Bible versions
      const bibleVersions = [
        { id: 'kjv', name: 'King James Version', language: 'en', languageName: 'English', isOriginal: false },
        { id: 'kja', name: 'King James Atualizada', language: 'pt-br', languageName: 'Português', isOriginal: false },
        { id: 'rvr', name: 'Reina Valera 1909', language: 'es', languageName: 'Español', isOriginal: false },
        { id: 'hebrew', name: 'Hebrew Bible', language: 'he', languageName: 'Hebrew', isOriginal: true, originalLanguage: 'hebrew' },
        { id: 'greek', name: 'Greek New Testament', language: 'el', languageName: 'Greek', isOriginal: true, originalLanguage: 'greek' },
      ];
      
      // Insert Bible books
      for (const book of localizedBooks) {
        try {
          const { error } = await supabase
            .from('bible_books')
            .upsert({
              id: book.id,
              name: book.name,
              testament: book.testament,
              chapters_count: book.chapters_count,
              position: book.position
            });
          
          if (error) {
            console.error(`Error inserting book ${book.id}: ${error.message}`);
          }
        } catch (err) {
          console.error(`Error inserting book ${book.id}:`, err);
        }
      }
      
      // Insert Bible versions
      for (const version of bibleVersions) {
        try {
          const { error } = await supabase
            .from('bible_versions')
            .upsert({
              id: version.id,
              name: version.name,
              language: version.language,
              language_name: version.languageName,
              is_original: version.isOriginal,
              original_language: version.originalLanguage
            });
          
          if (error) {
            console.error(`Error inserting version ${version.id}: ${error.message}`);
          }
        } catch (err) {
          console.error(`Error inserting version ${version.id}:`, err);
        }
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Bible books and versions imported successfully',
        booksCount: localizedBooks.length,
        versionsCount: bibleVersions.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // Action to import entire version from a single JSON file
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
          // Map short ID to full ID
          const shortId = book.id;
          const fullId = bookIdMapping[shortId] || shortId;
          
          console.log(`Processing book ${shortId}/${fullId}: ${book.name} with ${book.chapters.length} chapters`);
          
          // Get book position and testament
          const testament = getTestament(fullId);
          const position = bibleBooks.find(b => b.id.toLowerCase() === fullId.toLowerCase())?.position || 0;
          const chaptersCount = book.chapters.length;
          
          // Get localized name for the book based on language
          const bookName = bookNamesByLanguage[language]?.[fullId] || book.name;
          
          // Insert or update the book record
          const { error: bookError } = await supabase
            .from('bible_books')
            .upsert({
              id: fullId,
              name: bookName,
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
            
            const chapterId = chapterData.id;
            
            // Prepare verses for insertion
            const versesForInsert = verses.map((text, verseIndex) => ({
              chapter_id: chapterId,
              verse_number: verseIndex + 1,
              text: text,
            }));
            
            // Insert verses in batches to avoid hitting size limits
            const batchSize = 50;
            for (let i = 0; i < versesForInsert.length; i += batchSize) {
              const batch = versesForInsert.slice(i, i + batchSize);
              
              const { error: versesError } = await supabase
                .from('bible_verses')
                .upsert(batch);
              
              if (versesError) {
                console.error(`Error inserting verses batch for ${fullId} chapter ${chapterNumber}: ${versesError.message}`);
              }
            }
          }
          
          importedBooks.push({
            id: fullId,
            name: bookName,
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
