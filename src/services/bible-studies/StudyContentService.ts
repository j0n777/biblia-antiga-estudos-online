
import { supabase } from '@/integrations/supabase/client';
import { BibleStudy } from '@/types/bible.types';

/**
 * Get all Bible studies
 * @returns Promise resolving to array of BibleStudy objects
 */
export async function getAllBibleStudies(): Promise<BibleStudy[]> {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    // Type casting to match our expected BibleStudy interface
    return (data || []) as unknown as BibleStudy[];
  } catch (error) {
    console.error('Error fetching Bible studies:', error);
    return [];
  }
}

/**
 * Get a Bible study by ID
 * @param id Bible study ID
 * @returns Promise resolving to BibleStudy object or null if not found
 */
export async function getBibleStudyById(id: string): Promise<BibleStudy | null> {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Type casting to match our expected BibleStudy interface
    return data as unknown as BibleStudy;
  } catch (error) {
    console.error('Error fetching Bible study:', error);
    return null;
  }
}

/**
 * Search Bible studies
 * @param query Search query
 * @returns Promise resolving to array of BibleStudy objects
 */
export async function searchBibleStudies(query: string): Promise<BibleStudy[]> {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    // Type casting to match our expected BibleStudy interface
    return (data || []) as unknown as BibleStudy[];
  } catch (error) {
    console.error('Error searching Bible studies:', error);
    return [];
  }
}

/**
 * Get localized study content
 * Helper function to get properly localized content from a study
 * @param study Bible study object
 * @param language Language code
 * @returns Localized content string
 */
export function getStudyContent(study: BibleStudy, language: string = 'en'): string {
  if (!study || !study.content) return '';
  
  if (typeof study.content === 'string') {
    return study.content;
  }
  
  // If content is an object with direct language keys
  if (typeof study.content === 'object' && study.content[language]) {
    return study.content[language];
  }
  
  // If content has a content field which is language-specific
  if (typeof study.content === 'object' && study.content.content) {
    // Safely check if content exists and is an object
    const contentObj = study.content.content;
    if (!contentObj) return '';
    
    // Use null check and typeof check for safety
    if (contentObj && typeof contentObj === 'object') {
      return contentObj[language] || contentObj['en'] || '';
    }
    return '';
  }
  
  return '';
}
