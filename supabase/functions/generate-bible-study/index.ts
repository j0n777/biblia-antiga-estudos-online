
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

const STUDY_PROMPT = `
Você é um erudito bíblico especializado em exegese, hermenêutica e teologia. Crie um estudo bíblico profundo e completo seguindo esta estrutura EXATA em JSON:

{
  "texto_versiculo": {
    "referencia": "string",
    "texto_principal": "string",
    "versoes_comparadas": ["string array com 3-4 versões diferentes"]
  },
  "contexto_literario": {
    "autor": "string",
    "destinatarios": "string",
    "circunstancias": "string",
    "tema_capitulo": "string",
    "tema_livro": "string"
  },
  "palavras_chave_original": [
    {
      "palavra_portugues": "string",
      "original": "string (hebraico/grego)",
      "transliteracao": "string",
      "strongs": "string",
      "significado": "string",
      "outros_usos": "string"
    }
  ],
  "contexto_historico_cultural": {
    "epoca": "string",
    "costumes": "string",
    "significado_original": "string",
    "praticas_religiosas": "string"
  },
  "referencias_cruzadas": [
    {
      "referencia": "string",
      "texto": "string",
      "conexao": "string"
    }
  ],
  "comentarios_classicos": [
    {
      "autor": "string",
      "comentario": "string",
      "periodo": "string"
    }
  ],
  "aplicacao_teologica": {
    "doutrinas": ["string array"],
    "plano_redencao": "string",
    "atributos_deus": "string",
    "papel_cristo": "string"
  },
  "aplicacao_pessoal": {
    "significado_hoje": "string",
    "areas_vida": "string",
    "desafios_praticos": "string",
    "reflexoes": "string"
  }
}

IMPORTANTE: Responda APENAS com o JSON válido, sem texto adicional antes ou depois.
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      verse_reference, 
      book_id, 
      chapter_number, 
      verse_number, 
      version_id, 
      verse_text 
    } = await req.json();

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Token de autorização necessário');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error('Usuário não autenticado');
    }

    const userId = userData.user.id;

    // Verificar se usuário tem créditos disponíveis
    await supabase.rpc('reset_monthly_free_studies');
    
    const { data: credits, error: creditsError } = await supabase
      .from('user_study_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (creditsError) {
      // Criar registro de créditos se não existir
      await supabase
        .from('user_study_credits')
        .insert({
          user_id: userId,
          free_studies_used_this_month: 0,
          free_studies_reset_month: new Date().toISOString().split('T')[0]
        });
    }

    const hasCredits = (credits?.free_studies_used_this_month || 0) < 3 || 
                      (credits?.paid_studies_remaining || 0) > 0;

    if (!hasCredits) {
      return new Response(JSON.stringify({ 
        error: 'Sem créditos disponíveis',
        needsCredits: true 
      }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verificar se já existe estudo para este versículo
    const { data: existingStudy } = await supabase
      .from('ai_bible_studies')
      .select('*')
      .eq('user_id', userId)
      .eq('book_id', book_id)
      .eq('chapter_number', chapter_number)
      .eq('verse_number', verse_number)
      .eq('version_id', version_id)
      .single();

    if (existingStudy) {
      return new Response(JSON.stringify({ 
        study: existingStudy,
        fromCache: true 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Gerar estudo com OpenAI
    const prompt = `${STUDY_PROMPT}\n\nVersículo para estudar: ${verse_reference} - "${verse_text}"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em estudos bíblicos. Responda sempre em JSON válido seguindo exatamente a estrutura fornecida.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const studyContent = data.choices[0].message.content;
    
    let parsedStudy;
    try {
      parsedStudy = JSON.parse(studyContent);
    } catch (e) {
      throw new Error('Erro ao processar resposta da IA');
    }

    // Calcular custo (estimativa: ~3000 tokens para input + output)
    const tokensUsed = data.usage?.total_tokens || 3000;
    const costUsd = (tokensUsed / 1000) * 0.00015; // GPT-4o-mini pricing

    // Salvar estudo no banco
    const { data: newStudy, error: studyError } = await supabase
      .from('ai_bible_studies')
      .insert({
        user_id: userId,
        verse_reference,
        book_id,
        chapter_number,
        verse_number,
        version_id,
        verse_text,
        study_content: parsedStudy,
        tokens_used: tokensUsed,
        cost_usd: costUsd,
        status: 'completed'
      })
      .select()
      .single();

    if (studyError) {
      throw new Error('Erro ao salvar estudo');
    }

    // Atualizar créditos do usuário
    if ((credits?.paid_studies_remaining || 0) > 0) {
      await supabase
        .from('user_study_credits')
        .update({ 
          paid_studies_remaining: credits.paid_studies_remaining - 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    } else {
      await supabase
        .from('user_study_credits')
        .update({ 
          free_studies_used_this_month: (credits?.free_studies_used_this_month || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    }

    return new Response(JSON.stringify({ 
      study: newStudy,
      fromCache: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro na geração do estudo:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
