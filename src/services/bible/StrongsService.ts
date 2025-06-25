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

// Enhanced cache for word availability with better performance
const availableWordsCache = new Map<string, boolean>();
const batchCheckCache = new Map<string, Set<string>>(); // Cache for batch word availability
const cacheExpiry = 10 * 60 * 1000; // 10 minutes
let lastCacheUpdate = 0;

/**
 * Verifica se uma palavra tem definição disponível no Strong's
 * Otimizado com cache mais inteligente
 */
export const hasStrongsDefinition = async (word: string): Promise<boolean> => {
  const cleanWord = word.toLowerCase().trim();
  
  // Skip very short words
  if (cleanWord.length <= 2) {
    return false;
  }
  
  // Skip common Portuguese/English words that are unlikely to be in Strong's
  const commonWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'que', 'de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos', 'para',
    'por', 'com', 'sem', 'sob', 'sobre', 'entre', 'contra', 'até', 'desde', 'ao',
    'à', 'aos', 'às', 'um', 'uma', 'uns', 'umas', 'o', 'a', 'os', 'as', 'e', 'ou',
    'mas', 'se', 'como', 'quando', 'onde', 'porque', 'então', 'também', 'já', 'não'
  ]);
  
  if (commonWords.has(cleanWord)) {
    return false;
  }
  
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
 * Batch check for multiple words - more efficient for checking many words at once
 */
export const checkWordsInBatch = async (words: string[]): Promise<Map<string, boolean>> => {
  const results = new Map<string, boolean>();
  const wordsToCheck: string[] = [];
  
  // Filter and check cache first
  for (const word of words) {
    const cleanWord = word.toLowerCase().trim();
    
    if (cleanWord.length <= 2) {
      results.set(word, false);
      continue;
    }
    
    if (availableWordsCache.has(cleanWord) && Date.now() - lastCacheUpdate < cacheExpiry) {
      results.set(word, availableWordsCache.get(cleanWord) || false);
    } else {
      wordsToCheck.push(word);
    }
  }
  
  // Batch check remaining words
  if (wordsToCheck.length > 0) {
    try {
      const { data, error } = await supabase
        .from('bible_word_definitions')
        .select('word, transliteration')
        .or(wordsToCheck.map(w => `word.ilike.${w.toLowerCase()},transliteration.ilike.${w.toLowerCase()}`).join(','));
      
      if (!error && data) {
        const foundWords = new Set([
          ...data.map(d => d.word?.toLowerCase()),
          ...data.map(d => d.transliteration?.toLowerCase())
        ].filter(Boolean));
        
        for (const word of wordsToCheck) {
          const cleanWord = word.toLowerCase().trim();
          const hasDefinition = foundWords.has(cleanWord);
          
          results.set(word, hasDefinition);
          availableWordsCache.set(cleanWord, hasDefinition);
        }
        
        lastCacheUpdate = Date.now();
      } else {
        // On error, mark all as false
        for (const word of wordsToCheck) {
          results.set(word, false);
        }
      }
    } catch (error) {
      console.error('Error in batch word check:', error);
      for (const word of wordsToCheck) {
        results.set(word, false);
      }
    }
  }
  
  return results;
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
    
    // Properly cast the data to match our interface
    return (data || []).map(item => ({
      id: item.id,
      word: item.word,
      transliteration: item.transliteration || '',
      strongs_number: item.strongs_number || '',
      strongs_type: (item.strongs_type as 'hebrew' | 'greek') || 'hebrew',
      definition: item.definition,
      part_of_speech: item.part_of_speech || ''
    }));
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
