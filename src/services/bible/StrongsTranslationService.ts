
import { supabase } from '@/integrations/supabase/client';

export interface TranslationMapping {
  strongs_number: string;
  strongs_type: 'hebrew' | 'greek';
  definition_en: string;
  definition_pt: string;
  definition_es?: string;
  definition_fr?: string;
}

// Cache para traduções
const translationCache = new Map<string, TranslationMapping>();
const cacheExpiry = 30 * 60 * 1000; // 30 minutos
let lastCacheUpdate = 0;

/**
 * Busca tradução de uma definição Strong's
 */
export const getStrongsTranslation = async (
  strongsNumber: string,
  targetLanguage: string = 'pt'
): Promise<string | null> => {
  const cacheKey = `${strongsNumber}_${targetLanguage}`;
  
  // Verificar cache primeiro
  if (translationCache.has(cacheKey) && Date.now() - lastCacheUpdate < cacheExpiry) {
    const cached = translationCache.get(cacheKey);
    return getTranslationByLanguage(cached!, targetLanguage);
  }
  
  try {
    const { data, error } = await supabase
      .from('bible_word_definitions')
      .select('strongs_number, strongs_type, definition, definition_pt, definition_es, definition_fr')
      .eq('strongs_number', strongsNumber)
      .single();
    
    if (error || !data) {
      console.log(`No translation found for Strong's ${strongsNumber}`);
      return null;
    }
    
    const mapping: TranslationMapping = {
      strongs_number: data.strongs_number || strongsNumber,
      strongs_type: (data.strongs_type as 'hebrew' | 'greek') || 'hebrew',
      definition_en: data.definition,
      definition_pt: data.definition_pt || '',
      definition_es: data.definition_es || '',
      definition_fr: data.definition_fr || ''
    };
    
    // Atualizar cache
    translationCache.set(cacheKey, mapping);
    lastCacheUpdate = Date.now();
    
    return getTranslationByLanguage(mapping, targetLanguage);
  } catch (error) {
    console.error('Error fetching Strong\'s translation:', error);
    return null;
  }
};

/**
 * Extrai a tradução no idioma solicitado
 */
const getTranslationByLanguage = (mapping: TranslationMapping, language: string): string => {
  switch (language.toLowerCase()) {
    case 'pt':
    case 'pt-br':
      return mapping.definition_pt || mapping.definition_en;
    case 'es':
      return mapping.definition_es || mapping.definition_en;
    case 'fr':
      return mapping.definition_fr || mapping.definition_en;
    default:
      return mapping.definition_en;
  }
};

/**
 * Atualiza definições traduzidas em lote usando IA
 */
export const translateStrongsDefinitions = async (
  strongsNumbers: string[],
  targetLanguage: string = 'pt',
  batchSize: number = 5
): Promise<{ success: number; errors: number }> => {
  let success = 0;
  let errors = 0;
  
  // Processar em lotes para não sobrecarregar a API
  for (let i = 0; i < strongsNumbers.length; i += batchSize) {
    const batch = strongsNumbers.slice(i, i + batchSize);
    
    try {
      const { data, error } = await supabase.functions.invoke('translate-strongs-batch', {
        body: {
          strongsNumbers: batch,
          targetLanguage: targetLanguage
        }
      });
      
      if (error) {
        console.error('Translation batch error:', error);
        errors += batch.length;
      } else {
        success += batch.length;
        console.log(`Translated batch ${i / batchSize + 1}: ${batch.length} definitions`);
      }
    } catch (error) {
      console.error('Translation batch failed:', error);
      errors += batch.length;
    }
    
    // Pausa entre lotes para evitar sobrecarga
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return { success, errors };
};

/**
 * Limpa o cache de traduções
 */
export const clearTranslationCache = () => {
  translationCache.clear();
  lastCacheUpdate = 0;
};

/**
 * Busca definições que precisam de tradução
 */
export const getUntranslatedDefinitions = async (
  targetLanguage: string = 'pt',
  limit: number = 100
): Promise<string[]> => {
  try {
    const columnName = `definition_${targetLanguage}`;
    
    const { data, error } = await supabase
      .from('bible_word_definitions')
      .select('strongs_number')
      .is(columnName, null)
      .not('strongs_number', 'is', null)
      .limit(limit);
    
    if (error) {
      console.error('Error fetching untranslated definitions:', error);
      return [];
    }
    
    return (data || []).map(item => item.strongs_number).filter(Boolean);
  } catch (error) {
    console.error('Error in getUntranslatedDefinitions:', error);
    return [];
  }
};
