
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Function called with method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let reqData;
    try {
      reqData = await req.json();
      console.log('Request data:', reqData);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid JSON in request body'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    const { action = 'import-dictionaries' } = reqData;
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`Processing action: ${action}`);

    if (action === 'import-dictionaries') {
      // URLs diretas para os arquivos de dicionário
      const baseUrl = 'https://raw.githubusercontent.com/openscriptures/strongs/master';
      
      // Importar dicionário hebraico
      console.log('Fetching Hebrew dictionary...');
      let hebrewResponse;
      try {
        hebrewResponse = await fetch(`${baseUrl}/HebrewStrong.json`);
        console.log('Hebrew response status:', hebrewResponse.status);
      } catch (fetchError) {
        console.error('Failed to fetch Hebrew dictionary:', fetchError);
        return new Response(JSON.stringify({
          success: false,
          message: `Failed to fetch Hebrew dictionary: ${fetchError.message}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      if (!hebrewResponse.ok) {
        return new Response(JSON.stringify({
          success: false,
          message: `Failed to fetch Hebrew dictionary: HTTP ${hebrewResponse.status}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      const hebrewDict = await hebrewResponse.json();
      console.log('Hebrew dictionary entries:', Object.keys(hebrewDict).length);
      
      // Importar dicionário grego
      console.log('Fetching Greek dictionary...');
      let greekResponse;
      try {
        greekResponse = await fetch(`${baseUrl}/GreekStrong.json`);
        console.log('Greek response status:', greekResponse.status);
      } catch (fetchError) {
        console.error('Failed to fetch Greek dictionary:', fetchError);
        return new Response(JSON.stringify({
          success: false,
          message: `Failed to fetch Greek dictionary: ${fetchError.message}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      if (!greekResponse.ok) {
        return new Response(JSON.stringify({
          success: false,
          message: `Failed to fetch Greek dictionary: HTTP ${greekResponse.status}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      const greekDict = await greekResponse.json();
      console.log('Greek dictionary entries:', Object.keys(greekDict).length);
      
      // Processar e inserir entradas hebraicas
      console.log('Processing Hebrew dictionary entries...');
      let hebrewCount = 0;
      for (const [strongsNumber, entry] of Object.entries(hebrewDict)) {
        try {
          const entryData = entry as any;
          const { error } = await supabase
            .from('bible_word_definitions')
            .upsert({
              strongs_number: strongsNumber,
              strongs_type: 'hebrew',
              language: 'en',
              word: entryData.lemma || entryData.word || '',
              transliteration: entryData.translit || entryData.transliteration || '',
              pronunciation: entryData.phonetic || entryData.pronunciation || '',
              part_of_speech: entryData.morph || entryData.part_of_speech || '',
              definition: entryData.definition || entryData.strongs_def || '',
              etymology: entryData.derivation || entryData.etymology || '',
              usage_notes: entryData.usage || entryData.usage_notes || ''
            });
          
          if (error) {
            console.error(`Error inserting Hebrew ${strongsNumber}:`, error);
          } else {
            hebrewCount++;
          }
        } catch (err) {
          console.error(`Error processing Hebrew ${strongsNumber}:`, err);
        }
      }
      
      // Processar e inserir entradas gregas
      console.log('Processing Greek dictionary entries...');
      let greekCount = 0;
      for (const [strongsNumber, entry] of Object.entries(greekDict)) {
        try {
          const entryData = entry as any;
          const { error } = await supabase
            .from('bible_word_definitions')
            .upsert({
              strongs_number: strongsNumber,
              strongs_type: 'greek',
              language: 'en',
              word: entryData.lemma || entryData.word || '',
              transliteration: entryData.translit || entryData.transliteration || '',
              pronunciation: entryData.phonetic || entryData.pronunciation || '',
              part_of_speech: entryData.morph || entryData.part_of_speech || '',
              definition: entryData.definition || entryData.strongs_def || '',
              etymology: entryData.derivation || entryData.etymology || '',
              usage_notes: entryData.usage || entryData.usage_notes || ''
            });
          
          if (error) {
            console.error(`Error inserting Greek ${strongsNumber}:`, error);
          } else {
            greekCount++;
          }
        } catch (err) {
          console.error(`Error processing Greek ${strongsNumber}:`, err);
        }
      }
      
      console.log(`Import completed: ${hebrewCount} Hebrew + ${greekCount} Greek entries`);
      
      return new Response(JSON.stringify({
        success: true,
        message: `Dicionários importados com sucesso! ${hebrewCount} entradas hebraicas e ${greekCount} entradas gregas.`,
        hebrewEntries: hebrewCount,
        greekEntries: greekCount
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Ação inválida especificada',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
    
  } catch (error) {
    console.error('Error in import-bible-dictionaries function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      error: error instanceof Error ? error.stack : null,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
