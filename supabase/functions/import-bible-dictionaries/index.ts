
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
      // URLs corretas para os arquivos de dicionário
      const hebrewUrl = 'https://raw.githubusercontent.com/j0n777/bibledb/4106af1f340d00a54bbb12a48a09554817c74c63/strongs-hebrew-dictionary.js';
      const greekUrl = 'https://raw.githubusercontent.com/j0n777/bibledb/4106af1f340d00a54bbb12a48a09554817c74c63/strongs-greek-dictionary.js';
      
      // Importar dicionário hebraico
      console.log('Fetching Hebrew dictionary...');
      let hebrewResponse;
      try {
        hebrewResponse = await fetch(hebrewUrl);
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
      
      const hebrewText = await hebrewResponse.text();
      console.log('Hebrew text length:', hebrewText.length);
      
      // Importar dicionário grego
      console.log('Fetching Greek dictionary...');
      let greekResponse;
      try {
        greekResponse = await fetch(greekUrl);
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
      
      const greekText = await greekResponse.text();
      console.log('Greek text length:', greekText.length);
      
      // Função para extrair dados do JavaScript
      function parseJsDictionary(jsText: string): Record<string, any> {
        try {
          // Remover comentários e declarações de variáveis
          let cleanedText = jsText
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comentários multilinhas
            .replace(/\/\/.*$/gm, '') // Remove comentários de linha
            .replace(/^\s*(?:var|let|const)\s+\w+\s*=\s*/m, '') // Remove declaração de variável
            .replace(/;\s*$/, ''); // Remove ponto e vírgula final
          
          // Procurar por padrões de objeto JavaScript
          const objectMatch = cleanedText.match(/\{[\s\S]*\}/);
          if (objectMatch) {
            cleanedText = objectMatch[0];
          }
          
          console.log('Attempting to parse cleaned text (first 500 chars):', cleanedText.substring(0, 500));
          
          // Tentar avaliar como JavaScript
          const result = eval(`(${cleanedText})`);
          return result;
        } catch (error) {
          console.error('Error parsing JS dictionary:', error);
          console.log('Raw text sample (first 1000 chars):', jsText.substring(0, 1000));
          throw new Error(`Could not parse dictionary structure: ${error.message}`);
        }
      }
      
      let hebrewDict, greekDict;
      
      try {
        hebrewDict = parseJsDictionary(hebrewText);
        console.log('Hebrew dictionary entries:', Object.keys(hebrewDict).length);
      } catch (error) {
        console.error('Failed to parse Hebrew dictionary:', error);
        return new Response(JSON.stringify({
          success: false,
          message: `Failed to parse Hebrew dictionary: ${error.message}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      try {
        greekDict = parseJsDictionary(greekText);
        console.log('Greek dictionary entries:', Object.keys(greekDict).length);
      } catch (error) {
        console.error('Failed to parse Greek dictionary:', error);
        return new Response(JSON.stringify({
          success: false,
          message: `Failed to parse Greek dictionary: ${error.message}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      // Processar e inserir entradas hebraicas
      console.log('Processing Hebrew dictionary entries...');
      let hebrewCount = 0;
      for (const [strongsNumber, entry] of Object.entries(hebrewDict)) {
        try {
          const entryData = entry as any;
          
          // Adaptar aos campos do arquivo específico
          const { error } = await supabase
            .from('bible_word_definitions')
            .upsert({
              strongs_number: strongsNumber,
              strongs_type: 'hebrew',
              language: 'en',
              word: entryData.lemma || entryData.word || entryData.hebrew || '',
              transliteration: entryData.translit || entryData.transliteration || entryData.xlit || '',
              pronunciation: entryData.phonetic || entryData.pronunciation || entryData.pronounce || '',
              part_of_speech: entryData.morph || entryData.part_of_speech || entryData.pos || '',
              definition: entryData.definition || entryData.strongs_def || entryData.brief || entryData.long || '',
              etymology: entryData.derivation || entryData.etymology || entryData.derive || '',
              usage_notes: entryData.usage || entryData.usage_notes || entryData.comment || ''
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
          
          // Adaptar aos campos do arquivo específico
          const { error } = await supabase
            .from('bible_word_definitions')
            .upsert({
              strongs_number: strongsNumber,
              strongs_type: 'greek',
              language: 'en',
              word: entryData.lemma || entryData.word || entryData.greek || '',
              transliteration: entryData.translit || entryData.transliteration || entryData.xlit || '',
              pronunciation: entryData.phonetic || entryData.pronunciation || entryData.pronounce || '',
              part_of_speech: entryData.morph || entryData.part_of_speech || entryData.pos || '',
              definition: entryData.definition || entryData.strongs_def || entryData.brief || entryData.long || '',
              etymology: entryData.derivation || entryData.etymology || entryData.derive || '',
              usage_notes: entryData.usage || entryData.usage_notes || entryData.comment || ''
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
