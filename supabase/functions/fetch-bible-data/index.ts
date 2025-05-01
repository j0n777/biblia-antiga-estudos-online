
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map between API book IDs and database book IDs
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, book, chapter, version = 'kja' } = await req.json();
    
    // Map the book ID if needed
    const bookId = bookIdMapping[book] || book;
    
    console.log(`Action: ${action}, Book: ${book} (${bookId}), Chapter: ${chapter}, Version: ${version}`);
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get all books
    if (action === 'get-books') {
      const { data, error } = await supabase
        .from('bible_books')
        .select('*')
        .order('position');
      
      if (error) {
        throw new Error(`Error fetching books: ${error.message}`);
      }
      
      return new Response(JSON.stringify({
        success: true,
        data,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Get all versions
    if (action === 'get-versions') {
      const { data, error } = await supabase
        .from('bible_versions')
        .select('*')
        .not('is_original', 'eq', true);  // Do not include original language versions in the main selection
      
      if (error) {
        throw new Error(`Error fetching versions: ${error.message}`);
      }
      
      return new Response(JSON.stringify({
        success: true,
        data,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Get a specific chapter
    if (action === 'get-chapter') {
      if (!bookId || !chapter) {
        throw new Error('Book and chapter are required');
      }
      
      console.log(`Fetching chapter for book_id=${bookId}, chapter=${chapter}, version=${version}`);
      
      // Get the book info first
      // Get version info to determine language
      const { data: versionData, error: versionError } = await supabase
        .from('bible_versions')
        .select('*')
        .eq('id', version)
        .single();
      
      if (versionError) {
        throw new Error(`Error fetching version: ${versionError.message}`);
      }
      
      if (!versionData) {
        throw new Error(`Version not found: ${version}`);
      }
      
      // Get the book info first
      const { data: bookData, error: bookError } = await supabase
        .from('bible_books')
        .select('*')
        .eq('id', bookId)
        .single();
      
      if (bookError) {
        throw new Error(`Error fetching book data: ${bookError.message}`);
      }
      
      if (!bookData) {
        throw new Error(`Book not found: ${bookId}`);
      }
      
      // Find the chapter
      const { data: chapterData, error: chapterError } = await supabase
        .from('bible_chapters')
        .select('id')
        .eq('book_id', bookId)
        .eq('chapter_number', chapter)
        .eq('version_id', version)
        .limit(1);
      
      if (chapterError) {
        throw new Error(`Error fetching chapter: ${chapterError.message}`);
      }
      
      if (!chapterData || chapterData.length === 0) {
        throw new Error(`Chapter not found: ${bookId} ${chapter} (${version})`);
      }
      
      const chapterId = chapterData[0].id;
      console.log(`Found chapter with ID: ${chapterId}`);
      
      // Then get the verses for this chapter
      const { data: versesData, error: versesError } = await supabase
        .from('bible_verses')
        .select('verse_number, text')
        .eq('chapter_id', chapterId)
        .order('verse_number');
      
      if (versesError) {
        throw new Error(`Error fetching verses: ${versesError.message}`);
      }
      
      // Get the original language for this book
      let originalLanguage = 'hebrew'; // Default
      
      // Old Testament books are in Hebrew, New Testament in Greek
      // This is a simplification, as some parts like Daniel have Aramaic sections
      const testament = bookData.testament || 'old';
      originalLanguage = testament === 'new' ? 'greek' : 'hebrew';
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          book: bookId,
          bookName: bookData.name,
          chapter: parseInt(chapter.toString(), 10),
          verses: versesData || [],
          version: versionData,
          originalLanguage,
        },
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
    console.error('Error in fetch-bible-data function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
