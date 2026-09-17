// 17/09/2026: OPENAI_BASE_URL e OPENAI_MODEL opcionais — permitem usar OpenRouter
// (https://openrouter.ai/api/v1, modelo ex. 'openai/gpt-4o-mini') com a mesma chave em OPENAI_API_KEY.

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

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { strongsNumbers, targetLanguage = 'pt' } = await req.json()

    if (!strongsNumbers || !Array.isArray(strongsNumbers)) {
      throw new Error('strongsNumbers array is required')
    }

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
      return new Response(
        JSON.stringify({ success: false, message: 'No definitions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Preparar prompt para tradução
    const definitionsText = definitions.map(def => 
      `${def.strongs_number}: ${def.definition}`
    ).join('\n\n')

    const prompt = `Traduza as seguintes definições bíblicas do dicionário Strong's do inglês para o português brasileiro. 
Mantenha o formato "NÚMERO: DEFINIÇÃO" e seja preciso com os termos teológicos e bíblicos:

${definitionsText}

Responda apenas com as traduções no mesmo formato, uma por linha.`

    // Chamar OpenAI para tradução
    const openaiResponse = await fetch(`${Deno.env.get('OPENAI_BASE_URL') || 'https://api.openai.com/v1'}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em tradução de textos bíblicos e teológicos. Mantenha a precisão teológica e use linguagem apropriada para o contexto bíblico.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    const translatedText = openaiData.choices[0]?.message?.content

    if (!translatedText) {
      throw new Error('No translation received from OpenAI')
    }

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

    console.log(`Translation batch completed: ${successCount} success, ${errorCount} errors`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        translated: successCount,
        errors: errorCount,
        message: `Translated ${successCount} definitions successfully`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Translation error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
