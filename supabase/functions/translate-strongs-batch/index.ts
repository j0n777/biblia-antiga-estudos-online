
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now();
  let batchId = '';
  let promptId = '';

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { strongsNumbers, targetLanguage = 'pt' } = await req.json()
    batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (!strongsNumbers || !Array.isArray(strongsNumbers)) {
      throw new Error('strongsNumbers array is required')
    }

    console.log(`Starting translation batch ${batchId} for ${strongsNumbers.length} definitions in ${targetLanguage}`);

    // Get active prompt from database
    const promptName = `strongs_translation_${targetLanguage}`;
    const { data: promptData, error: promptError } = await supabase
      .from('ai_prompts')
      .select('*')
      .eq('name', promptName)
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (promptError || !promptData) {
      console.error('Error fetching prompt:', promptError);
      throw new Error(`No active prompt found for ${promptName}`);
    }

    promptId = promptData.id;
    console.log(`Using prompt version ${promptData.version} for ${promptName}`);

    // Buscar definições para traduzir
    const { data: definitions, error: fetchError } = await supabase
      .from('bible_word_definitions')
      .select('id, strongs_number, word, definition, strongs_type')
      .in('strongs_number', strongsNumbers)
      .eq('language', 'en')

    if (fetchError) {
      throw fetchError
    }

    if (!definitions || definitions.length === 0) {
      await logOperation(supabase, batchId, promptId, strongsNumbers, targetLanguage, 0, strongsNumbers.length, 0, 0, Date.now() - startTime);
      return new Response(
        JSON.stringify({ success: false, message: 'No definitions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Preparar prompt para tradução
    const definitionsText = definitions.map(def => 
      `${def.strongs_number}: ${def.definition}`
    ).join('\n\n')

    const fullPrompt = `${promptData.prompt}\n\n${definitionsText}\n\nResponda apenas com as traduções no mesmo formato, uma por linha.`;

    console.log(`Sending ${definitions.length} definitions to OpenAI for translation`);

    // Chamar OpenAI para tradução
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em tradução de textos bíblicos e teológicos. Mantenha a precisão teológica e use linguagem apropriada para o contexto bíblico.'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    const translatedText = openaiData.choices[0]?.message?.content
    const tokensUsed = openaiData.usage?.total_tokens || 0;
    const estimatedCost = (tokensUsed * 0.00015) / 1000; // Approximate cost for gpt-4o-mini

    if (!translatedText) {
      throw new Error('No translation received from OpenAI')
    }

    console.log(`Received translation from OpenAI. Tokens used: ${tokensUsed}`);

    // Processar traduções
    const translations = translatedText.split('\n').filter(line => line.trim())
    const updates = []

    for (const translation of translations) {
      const match = translation.match(/^([^:]+):\s*(.+)$/)
      if (match) {
        const strongsNumber = match[1].trim()
        const translatedDef = match[2].trim()
        
        const originalDef = definitions.find(d => d.strongs_number === strongsNumber)
        if (originalDef) {
          updates.push({
            id: originalDef.id,
            [`definition_${targetLanguage}`]: translatedDef
          })
        }
      }
    }

    console.log(`Processing ${updates.length} translations for database update`);

    // Atualizar definições no banco
    let successCount = 0
    let errorCount = 0

    for (const update of updates) {
      try {
        const { error: updateError } = await supabase
          .from('bible_word_definitions')
          .update(update)
          .eq('id', update.id)

        if (updateError) {
          console.error('Update error:', updateError)
          errorCount++
        } else {
          successCount++
        }
      } catch (error) {
        console.error('Update failed:', error)
        errorCount++
      }
    }

    const durationMs = Date.now() - startTime;

    // Log the operation
    await logOperation(supabase, batchId, promptId, strongsNumbers, targetLanguage, successCount, errorCount, tokensUsed, estimatedCost, durationMs);

    console.log(`Translation batch ${batchId} completed: ${successCount} success, ${errorCount} errors in ${durationMs}ms`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        batchId,
        translated: successCount,
        errors: errorCount,
        tokensUsed,
        estimatedCost,
        durationMs,
        message: `Translated ${successCount} definitions successfully`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Translation error:', error)
    
    // Log failed operation if we have the required data
    if (batchId && promptId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        await logOperation(supabase, batchId, promptId, [], 'pt', 0, 1, 0, 0, Date.now() - startTime);
      } catch (logError) {
        console.error('Failed to log error operation:', logError);
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function logOperation(supabase: any, batchId: string, promptId: string, strongsNumbers: string[], targetLanguage: string, successCount: number, errorCount: number, totalTokens: number, costUsd: number, durationMs: number) {
  try {
    await supabase
      .from('translation_operations')
      .insert({
        batch_id: batchId,
        prompt_id: promptId,
        strongs_numbers: strongsNumbers,
        target_language: targetLanguage,
        success_count: successCount,
        error_count: errorCount,
        total_tokens: totalTokens,
        cost_usd: costUsd,
        duration_ms: durationMs
      });
  } catch (error) {
    console.error('Failed to log operation:', error);
  }
}
