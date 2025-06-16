
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reqData = await req.json();
    const { action = 'import-dictionaries' } = reqData;
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`Processing action: ${action}`);

    if (action === 'import-dictionaries') {
      const baseUrl = 'https://raw.githubusercontent.com/j0n777/bibledb/main';
      
      // Importar dicionário hebraico
      console.log('Fetching Hebrew dictionary...');
      const hebrewResponse = await fetch(`${baseUrl}/strongs-hebrew-dictionary.js`);
      if (!hebrewResponse.ok) {
        throw new Error(`Failed to fetch Hebrew dictionary: ${hebrewResponse.statusText}`);
      }
      
      const hebrewText = await hebrewResponse.text();
      const hebrewMatches = hebrewText.match(/const strongsHebrewDictionary = (\{[\s\S]*?\});/);
      if (!hebrewMatches) {
        throw new Error('Could not parse Hebrew dictionary');
      }
      
      const hebrewDict = eval(`(${hebrewMatches[1]})`);
      
      // Importar dicionário grego
      console.log('Fetching Greek dictionary...');
      const greekResponse = await fetch(`${baseUrl}/strongs-greek-dictionary.js`);
      if (!greekResponse.ok) {
        throw new Error(`Failed to fetch Greek dictionary: ${greekResponse.statusText}`);
      }
      
      const greekText = await greekResponse.text();
      const greekMatches = greekText.match(/const strongsGreekDictionary = (\{[\s\S]*?\});/);
      if (!greekMatches) {
        throw new Error('Could not parse Greek dictionary');
      }
      
      const greekDict = eval(`(${greekMatches[1]})`);
      
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
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Dictionaries imported successfully',
        hebrewEntries: hebrewCount,
        greekEntries: greekCount
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
    console.error('Error in import-bible-dictionaries function:', error);
    
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
