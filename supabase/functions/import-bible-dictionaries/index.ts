
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
      const baseUrl = 'https://raw.githubusercontent.com/j0n777/bibledb/main';
      
      // Importar dicionário hebraico
      console.log('Fetching Hebrew dictionary...');
      let hebrewResponse;
      try {
        hebrewResponse = await fetch(`${baseUrl}/strongs-hebrew-dictionary.js`);
        console.log('Hebrew response status:', hebrewResponse.status);
      } catch (fetchError) {
        console.error('Failed to fetch Hebrew dictionary:', fetchError);
        throw new Error(`Failed to fetch Hebrew dictionary: ${fetchError.message}`);
      }
      
      if (!hebrewResponse.ok) {
        throw new Error(`Failed to fetch Hebrew dictionary: HTTP ${hebrewResponse.status}`);
      }
      
      const hebrewText = await hebrewResponse.text();
      console.log('Hebrew text length:', hebrewText.length);
      
      const hebrewMatches = hebrewText.match(/const strongsHebrewDictionary = (\{[\s\S]*?\});/);
      if (!hebrewMatches) {
        console.error('Could not find Hebrew dictionary pattern in:', hebrewText.substring(0, 500));
        throw new Error('Could not parse Hebrew dictionary structure');
      }
      
      let hebrewDict;
      try {
        hebrewDict = eval(`(${hebrewMatches[1]})`);
        console.log('Hebrew dictionary entries:', Object.keys(hebrewDict).length);
      } catch (evalError) {
        console.error('Failed to evaluate Hebrew dictionary:', evalError);
        throw new Error('Failed to parse Hebrew dictionary data');
      }
      
      // Importar dicionário grego
      console.log('Fetching Greek dictionary...');
      let greekResponse;
      try {
        greekResponse = await fetch(`${baseUrl}/strongs-greek-dictionary.js`);
        console.log('Greek response status:', greekResponse.status);
      } catch (fetchError) {
        console.error('Failed to fetch Greek dictionary:', fetchError);
        throw new Error(`Failed to fetch Greek dictionary: ${fetchError.message}`);
      }
      
      if (!greekResponse.ok) {
        throw new Error(`Failed to fetch Greek dictionary: HTTP ${greekResponse.status}`);
      }
      
      const greekText = await greekResponse.text();
      console.log('Greek text length:', greekText.length);
      
      const greekMatches = greekText.match(/const strongsGreekDictionary = (\{[\s\S]*?\});/);
      if (!greekMatches) {
        console.error('Could not find Greek dictionary pattern in:', greekText.substring(0, 500));
        throw new Error('Could not parse Greek dictionary structure');
      }
      
      let greekDict;
      try {
        greekDict = eval(`(${greekMatches[1]})`);
        console.log('Greek dictionary entries:', Object.keys(greekDict).length);
      } catch (evalError) {
        console.error('Failed to evaluate Greek dictionary:', evalError);
        throw new Error('Failed to parse Greek dictionary data');
      }
      
      // Processar e inserir entradas hebraicas
      console.log('Processing Hebrew dictionary entries...');
      let hebrewCount = 0;
      for (const [strongsNumber, entry] of Object.entries(hebrewDict)) {
        try {
          const { error } = await supabase
            .from('bible_word_definitions')
            .upsert({
              strongs_number: strongsNumber,
              strongs_type: 'hebrew',
              language: 'en',
              word: entry.lemma || '',
              transliteration: entry.translit || '',
              pronunciation: entry.phonetic || '',
              part_of_speech: entry.morph || '',
              definition: entry.definition || '',
              etymology: entry.derivation || '',
              usage_notes: entry.usage || ''
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
          const { error } = await supabase
            .from('bible_word_definitions')
            .upsert({
              strongs_number: strongsNumber,
              strongs_type: 'greek',
              language: 'en',
              word: entry.lemma || '',
              transliteration: entry.translit || '',
              pronunciation: entry.phonetic || '',
              part_of_speech: entry.morph || '',
              definition: entry.definition || '',
              etymology: entry.derivation || '',
              usage_notes: entry.usage || ''
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
