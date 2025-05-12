
import { supabase } from '@/integrations/supabase/client';
import { BibleVersion } from '@/types/bible.types';

/**
 * Get all Bible versions
 * @returns Promise resolving to array of Bible versions
 */
export const getAllVersions = async (): Promise<BibleVersion[]> => {
  try {
    const { data, error } = await supabase
      .from('bible_versions')
      .select('*')
      .order('language', { ascending: true })
      .order('name', { ascending: true });
      
    if (error) {
      console.error('Error fetching Bible versions:', error);
      return [];
    }
    
    // Ensure language_name is set for all versions
    const processedData = data.map(version => ({
      ...version,
      language_name: version.language_name || getLanguageName(version.language)
    }));
    
    return processedData as BibleVersion[];
  } catch (error) {
    console.error('Error in getAllVersions:', error);
    return [];
  }
};

/**
 * Get all Bible versions by language
 * @param language Language code (e.g., 'pt-BR', 'en')
 * @returns Promise resolving to array of Bible versions filtered by language
 */
export const getVersionsByLanguage = async (language: string): Promise<BibleVersion[]> => {
  try {
    // Normalize language code for comparison
    const normalizedLanguage = language.toLowerCase();
    
    const { data, error } = await supabase
      .from('bible_versions')
      .select('*')
      // Use ilike for case-insensitive comparison and handle variations like pt-BR, pt-br, pt
      .or(`language.ilike.${normalizedLanguage},language.ilike.${normalizedLanguage.split('-')[0]}`)
      .order('name', { ascending: true });
      
    if (error) {
      console.error(`Error fetching Bible versions for language ${language}:`, error);
      return [];
    }
    
    // Ensure language_name is set for all versions
    const processedData = data.map(version => ({
      ...version,
      language_name: version.language_name || getLanguageName(version.language)
    }));
    
    return processedData as BibleVersion[];
  } catch (error) {
    console.error(`Error in getVersionsByLanguage for ${language}:`, error);
    return [];
  }
};

/**
 * Group Bible versions by language
 * @returns Promise resolving to an object with versions grouped by language
 */
export const getVersionsGroupedByLanguage = async (): Promise<Record<string, BibleVersion[]>> => {
  try {
    const allVersions = await getAllVersions();
    
    // Group versions by language
    const groupedVersions: Record<string, BibleVersion[]> = {};
    
    allVersions.forEach(version => {
      // Normalize language code and extract main language
      const languageKey = version.language.toLowerCase().split('-')[0];
      const languageName = version.language_name || getLanguageName(languageKey);
      
      if (!groupedVersions[languageKey]) {
        groupedVersions[languageKey] = [];
      }
      
      groupedVersions[languageKey].push({
        ...version,
        language_name: languageName
      });
    });
    
    return groupedVersions;
  } catch (error) {
    console.error('Error grouping versions by language:', error);
    return {};
  }
};

/**
 * Get language name from language code
 * @param languageCode The language code (e.g., 'pt-BR', 'en')
 * @returns The language name (e.g., 'Português', 'English')
 */
export const getLanguageName = (languageCode: string): string => {
  const languageMap: Record<string, string> = {
    'pt': 'Português',
    'pt-br': 'Português',
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'ar': 'العربية',
    'he': 'עברית',
    'el': 'Ελληνικά'
  };
  
  const normalizedCode = languageCode.toLowerCase().split('-')[0];
  return languageMap[normalizedCode] || languageCode;
};

/**
 * Get versions organized by language for UI display
 * @returns Promise resolving to array of language groups with their versions
 */
export const getVersionsForLanguageUI = async (): Promise<{
  languageCode: string;
  languageName: string;
  versions: BibleVersion[];
}[]> => {
  try {
    const groupedVersions = await getVersionsGroupedByLanguage();
    
    return Object.entries(groupedVersions).map(([languageCode, versions]) => ({
      languageCode,
      languageName: versions[0].language_name || getLanguageName(languageCode),
      versions
    })).sort((a, b) => a.languageName.localeCompare(b.languageName));
  } catch (error) {
    console.error('Error preparing versions for UI:', error);
    return [];
  }
};
