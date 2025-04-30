
import { supabase } from '@/integrations/supabase/client';

export type BibleBook = {
  id: string;
  name: string;
  testament: 'old' | 'new';
  chapters_count: number;
  position: number;
};

export type BibleVersion = {
  id: string;
  name: string;
  language: string;
  language_name: string;
  is_original: boolean;
  original_language?: 'hebrew' | 'greek' | 'aramaic';
};

export type BibleChapter = {
  book: string;
  bookName: string;
  chapter: number;
  verses: {
    number: number;
    text: string;
  }[];
  version: BibleVersion;
  originalLanguage: 'hebrew' | 'greek' | 'aramaic';
};

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
      .select('*');
      
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
  version: string = 'acf'
): Promise<BibleChapter | null> {
  try {
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

// This is a temporary function that will be used until we have proper data loaded
export function getChapterMock(
  book: string, 
  chapter: number
): BibleChapter {
  // Mock data for Genesis 1
  const verses = [
    { number: 1, text: "No princípio criou Deus os céus e a terra." },
    { number: 2, text: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas." },
    { number: 3, text: "E disse Deus: Haja luz; e houve luz." },
    { number: 4, text: "E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas." },
    { number: 5, text: "E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro." },
    // Add more verses as needed
  ];
  
  return {
    book,
    bookName: "Gênesis",
    chapter,
    verses,
    version: {
      id: "acf",
      name: "Almeida Corrigida Fiel",
      language: "pt",
      language_name: "Português",
      is_original: false
    },
    originalLanguage: "hebrew"
  };
}
