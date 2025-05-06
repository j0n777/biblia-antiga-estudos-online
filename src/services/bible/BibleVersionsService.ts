
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
    
    return data as BibleVersion[];
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
    const { data, error } = await supabase
      .from('bible_versions')
      .select('*')
      .eq('language', language)
      .order('name', { ascending: true });
      
    if (error) {
      console.error(`Error fetching Bible versions for language ${language}:`, error);
      return [];
    }
    
    return data as BibleVersion[];
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
      if (!groupedVersions[version.language]) {
        groupedVersions[version.language] = [];
      }
      
      groupedVersions[version.language].push(version);
    });
    
    return groupedVersions;
  } catch (error) {
    console.error('Error grouping versions by language:', error);
    return {};
  }
};
