
import { supabase } from '@/integrations/supabase/client';

export interface StrongsWord {
  id: string;
  word: string;
  transliteration: string;
  strongs_number: string;
  strongs_type: 'hebrew' | 'greek';
  definition: string;
  part_of_speech: string;
}

// Cache para palavras disponíveis no Strong's
const availableWordsCache = new Map<string, boolean>();
const cacheExpiry = 5 * 60 * 1000; // 5 minutos
let lastCacheUpdate = 0;

/**
 * Verifica se uma palavra tem definição disponível no Strong's
 */
export const hasStrongsDefinition = async (word: string): Promise<boolean> => {
  const cleanWord = word.toLowerCase().trim();
  
  // Verificar cache primeiro
  if (availableWordsCache.has(cleanWord) && Date.now() - lastCacheUpdate < cacheExpiry) {
    return availableWordsCache.get(cleanWord) || false;
  }
  
  try {
    const { data, error } = await supabase
      .from('bible_word_definitions')
      .select('id')
      .or(`word.ilike.${cleanWord},transliteration.ilike.${cleanWord}`)
      .limit(1);
    
    if (error) {
      console.error('Error checking Strong\'s definition:', error);
      return false;
    }
    
    const hasDefinition = data && data.length > 0;
    
    // Atualizar cache
    availableWordsCache.set(cleanWord, hasDefinition);
    lastCacheUpdate = Date.now();
    
    return hasDefinition;
  } catch (error) {
    console.error('Error in hasStrongsDefinition:', error);
    return false;
  }
};

/**
 * Busca uma amostra de palavras do Strong's para análise
 */
export const getSampleStrongsWords = async (limit: number = 10): Promise<StrongsWord[]> => {
  try {
    const { data, error } = await supabase
      .from('bible_word_definitions')
      .select('id, word, transliteration, strongs_number, strongs_type, definition, part_of_speech')
      .limit(limit);
    
    if (error) {
      console.error('Error fetching sample Strong\'s words:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getSampleStrongsWords:', error);
    return [];
  }
};

/**
 * Busca estatísticas dos dicionários importados
 */
export const getStrongsStatistics = async () => {
  try {
    const { data: hebrew, error: hebrewError } = await supabase
      .from('bible_word_definitions')
      .select('id', { count: 'exact' })
      .eq('strongs_type', 'hebrew');
    
    const { data: greek, error: greekError } = await supabase
      .from('bible_word_definitions')
      .select('id', { count: 'exact' })
      .eq('strongs_type', 'greek');
    
    if (hebrewError || greekError) {
      console.error('Error fetching Strong\'s statistics:', hebrewError || greekError);
      return { hebrew: 0, greek: 0, total: 0 };
    }
    
    const hebrewCount = hebrew?.length || 0;
    const greekCount = greek?.length || 0;
    
    return {
      hebrew: hebrewCount,
      greek: greekCount,
      total: hebrewCount + greekCount
    };
  } catch (error) {
    console.error('Error in getStrongsStatistics:', error);
    return { hebrew: 0, greek: 0, total: 0 };
  }
};

/**
 * Limpa o cache de palavras disponíveis
 */
export const clearStrongsCache = () => {
  availableWordsCache.clear();
  lastCacheUpdate = 0;
};
