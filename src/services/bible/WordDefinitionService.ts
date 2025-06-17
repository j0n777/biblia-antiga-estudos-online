
import { supabase } from '@/integrations/supabase/client';

export interface WordDefinition {
  strongs_number: string;
  word: string;
  transliteration: string;
  pronunciation: string;
  part_of_speech: string;
  definition: string;
  definition_pt?: string;
  definition_es?: string;
  definition_fr?: string;
  etymology: string;
  usage_notes: string;
  strongs_type: 'hebrew' | 'greek';
}

export const getWordDefinition = async (
  word: string,
  versionId: string,
  language: string = 'en'
): Promise<WordDefinition | null> => {
  console.log(`Searching definition for word: ${word} in version: ${versionId}, language: ${language}`);
  
  try {
    // Primeiro, verificar se existe no cache
    const { data: cachedData } = await supabase
      .from('word_definition_cache')
      .select('definition_data')
      .eq('word', word.toLowerCase())
      .eq('version_id', versionId)
      .eq('language', language)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    if (cachedData?.definition_data) {
      console.log('Found cached definition');
      // Conversão segura com validação de tipos
      return cachedData.definition_data as unknown as WordDefinition;
    }
    
    // Buscar definição diretamente por palavra similar
    const { data: definitions, error } = await supabase
      .from('bible_word_definitions')
      .select('*')
      .or(`word.ilike.%${word}%,transliteration.ilike.%${word}%`)
      .eq('language', 'en') // Por enquanto, só temos definições em inglês
      .limit(5);
    
    if (error) {
      console.error('Error fetching word definition:', error);
      throw error;
    }
    
    if (!definitions || definitions.length === 0) {
      console.log('No definition found for word:', word);
      return null;
    }
    
    // Encontrar a melhor correspondência
    const bestMatch = definitions.find(def => 
      def.word?.toLowerCase() === word.toLowerCase() ||
      def.transliteration?.toLowerCase() === word.toLowerCase()
    ) || definitions[0];
    
    const result: WordDefinition = {
      strongs_number: bestMatch.strongs_number || '',
      word: bestMatch.word || word,
      transliteration: bestMatch.transliteration || '',
      pronunciation: bestMatch.pronunciation || '',
      part_of_speech: bestMatch.part_of_speech || '',
      definition: bestMatch.definition || '',
      definition_pt: bestMatch.definition_pt || '',
      definition_es: bestMatch.definition_es || '',
      definition_fr: bestMatch.definition_fr || '',
      etymology: bestMatch.etymology || '',
      usage_notes: bestMatch.usage_notes || '',
      strongs_type: (bestMatch.strongs_type as 'hebrew' | 'greek') || 'hebrew'
    };
    
    // Salvar no cache - conversão para JSON compatível
    try {
      await supabase
        .from('word_definition_cache')
        .upsert({
          word: word.toLowerCase(),
          version_id: versionId,
          language: language,
          definition_data: result as any // Conversão para JSON
        });
    } catch (cacheError) {
      console.warn('Failed to cache definition:', cacheError);
    }
    
    return result;
  } catch (error) {
    console.error('Error in getWordDefinition:', error);
    throw error;
  }
};

export const importDictionaries = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Calling import-bible-dictionaries function...');
    
    const response = await supabase.functions.invoke('import-bible-dictionaries', {
      body: JSON.stringify({ action: 'import-dictionaries' }),
    });
    
    console.log('Function response:', response);
    
    if (response.error) {
      console.error('Function error:', response.error);
      throw new Error(response.error.message || 'Erro na função');
    }
    
    if (!response.data) {
      throw new Error('Resposta vazia da função');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error importing dictionaries:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};
