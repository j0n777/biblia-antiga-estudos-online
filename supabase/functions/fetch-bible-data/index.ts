
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, book, chapter, version = 'acf' } = await req.json();
    
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
        .select('*');
      
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
      if (!book || !chapter) {
        throw new Error('Book and chapter are required');
      }
      
      // First get the chapter ID
      const { data: chapterData, error: chapterError } = await supabase
        .from('bible_chapters')
        .select('id, book_id, chapter_number, verses_count, bible_books!inner(name)')
        .eq('book_id', book)
        .eq('chapter_number', chapter)
        .eq('version_id', version)
        .single();
      
      if (chapterError) {
        throw new Error(`Error fetching chapter: ${chapterError.message}`);
      }
      
      if (!chapterData) {
        throw new Error('Chapter not found');
      }
      
      // Then get the verses for this chapter
      const { data: versesData, error: versesError } = await supabase
        .from('bible_verses')
        .select('verse_number, text')
        .eq('chapter_id', chapterData.id)
        .order('verse_number');
      
      if (versesError) {
        throw new Error(`Error fetching verses: ${versesError.message}`);
      }
      
      // Get the version info
      const { data: versionData, error: versionError } = await supabase
        .from('bible_versions')
        .select('*')
        .eq('id', version)
        .single();
      
      if (versionError) {
        throw new Error(`Error fetching version: ${versionError.message}`);
      }
      
      // Get the original language for this book
      let originalLanguage = 'hebrew'; // Default
      
      if (chapterData.bible_books) {
        // Old Testament books are in Hebrew, New Testament in Greek
        // This is a simplification, as some parts like Daniel have Aramaic sections
        const testament = chapterData.book_id && parseInt(book.split('_')[1] || '0', 10) > 39 ? 'new' : 'old';
        originalLanguage = testament === 'new' ? 'greek' : 'hebrew';
      }
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          book: book,
          bookName: chapterData.bible_books?.name || book,
          chapter: chapter,
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
      message: error.message,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
