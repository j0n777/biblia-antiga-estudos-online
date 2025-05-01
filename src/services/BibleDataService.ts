
import { supabase } from '@/integrations/supabase/client';
import { BibleChapter, BibleBook, BibleVersion } from '../types/bible.types';
import { getChapterMock } from '../utils/bible-mocks';

export async function getAllBooks(): Promise<BibleBook[]> {
  try {
    const { data, error } = await supabase
      .from('bible_books')
      .select('*')
      .order('position');
      
    if (error) {
      throw new Error(`Error fetching Bible books: ${error.message}`);
    }
    
    // Explicitly cast the testament field to 'old' | 'new'
    return (data || []).map(book => ({
      ...book,
      testament: book.testament as 'old' | 'new'
    }));
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    return [];
  }
}

export async function getAllVersions(): Promise<BibleVersion[]> {
  try {
    const { data, error } = await supabase
      .from('bible_versions')
      .select('*')
      .not('is_original', 'eq', true);  // Do not include original language versions in the main selection
      
    if (error) {
      throw new Error(`Error fetching Bible versions: ${error.message}`);
    }
    
    // Explicitly cast the original_language field if it exists
    return (data || []).map(version => ({
      ...version,
      original_language: version.original_language as 'hebrew' | 'greek' | 'aramaic' | undefined
    }));
  } catch (error) {
    console.error('Error in getAllVersions:', error);
    return [];
  }
}

export async function getChapter(
  book: string, 
  chapter: number, 
  version: string = 'kja'
): Promise<BibleChapter | null> {
  try {
    console.log(`Fetching chapter: Book=${book}, Chapter=${chapter}, Version=${version}`);
    
    // Call our edge function
    const response = await supabase.functions.invoke('fetch-bible-data', {
      body: JSON.stringify({
        action: 'get-chapter',
        book,
        chapter,
        version
      })
    });
    
    if (response.error) {
      throw new Error(`Error fetching chapter: ${response.error.message}`);
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Unknown error');
    }
    
    return response.data.data as BibleChapter;
  } catch (error) {
    console.error('Error in getChapter:', error);
    return null;
  }
}
