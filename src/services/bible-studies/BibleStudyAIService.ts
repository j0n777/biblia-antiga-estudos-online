
import { supabase } from '@/integrations/supabase/client';

export interface BibleStudyContent {
  texto_versiculo: {
    referencia: string;
    texto_principal: string;
    versoes_comparadas: string[];
  };
  contexto_literario: {
    autor: string;
    destinatarios: string;
    circunstancias: string;
    tema_capitulo: string;
    tema_livro: string;
  };
  palavras_chave_original: Array<{
    palavra_portugues: string;
    original: string;
    transliteracao: string;
    strongs: string;
    significado: string;
    outros_usos: string;
  }>;
  contexto_historico_cultural: {
    epoca: string;
    costumes: string;
    significado_original: string;
    praticas_religiosas: string;
  };
  referencias_cruzadas: Array<{
    referencia: string;
    texto: string;
    conexao: string;
  }>;
  comentarios_classicos: Array<{
    autor: string;
    comentario: string;
    periodo: string;
  }>;
  aplicacao_teologica: {
    doutrinas: string[];
    plano_redencao: string;
    atributos_deus: string;
    papel_cristo: string;
  };
  aplicacao_pessoal: {
    significado_hoje: string;
    areas_vida: string;
    desafios_praticos: string;
    reflexoes: string;
  };
}

export interface AIBibleStudy {
  id: string;
  user_id: string;
  verse_reference: string;
  book_id: string;
  chapter_number: number;
  verse_number: number;
  version_id: string;
  verse_text: string;
  study_content: BibleStudyContent;
  status: string;
  tokens_used: number;
  cost_usd: number;
  created_at: string;
}

export interface UserStudyCredits {
  id: string;
  user_id: string;
  free_studies_used_today: number;
  free_studies_reset_date: string;
  paid_studies_remaining: number;
  subscription_type?: string;
  subscription_expires_at?: string;
}

/**
 * Gera um estudo bíblico para um versículo específico
 */
export const generateBibleStudy = async (
  verseReference: string,
  bookId: string,
  chapterNumber: number,
  verseNumber: number,
  versionId: string,
  verseText: string
): Promise<{ study?: AIBibleStudy; error?: string; needsCredits?: boolean; fromCache?: boolean }> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-bible-study', {
      body: {
        verse_reference: verseReference,
        book_id: bookId,
        chapter_number: chapterNumber,
        verse_number: verseNumber,
        version_id: versionId,
        verse_text: verseText
      }
    });

    if (error) {
      if (error.message?.includes('Sem créditos')) {
        return { needsCredits: true, error: 'Sem créditos disponíveis' };
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao gerar estudo bíblico:', error);
    return { error: 'Erro ao gerar estudo bíblico' };
  }
};

/**
 * Busca os créditos disponíveis do usuário
 */
export const getUserStudyCredits = async (): Promise<UserStudyCredits | null> => {
  try {
    const { data, error } = await supabase
      .from('user_study_credits')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Erro ao buscar créditos:', error);
    return null;
  }
};

/**
 * Busca estudos do usuário
 */
export const getUserStudies = async (limit = 10): Promise<AIBibleStudy[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_bible_studies')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Type assertion to handle the Json type from Supabase
    return (data || []).map(study => ({
      ...study,
      study_content: study.study_content as BibleStudyContent
    }));
  } catch (error) {
    console.error('Erro ao buscar estudos:', error);
    return [];
  }
};

/**
 * Busca um estudo específico por ID
 */
export const getStudyById = async (studyId: string): Promise<AIBibleStudy | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_bible_studies')
      .select('*')
      .eq('id', studyId)
      .single();

    if (error) throw error;

    // Type assertion to handle the Json type from Supabase
    return {
      ...data,
      study_content: data.study_content as BibleStudyContent
    };
  } catch (error) {
    console.error('Erro ao buscar estudo:', error);
    return null;
  }
};
