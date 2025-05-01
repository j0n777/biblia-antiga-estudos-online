
import { supabase } from '@/integrations/supabase/client';

// Import the three main versions we need
export async function importInitialVersions(): Promise<any> {
  try {
    // Import the three main versions we need - this can be called at app initialization
    const versions = [
      { version: 'kjv', language: 'en' },
      { version: 'kja', language: 'pt-br' },
      { version: 'rvr', language: 'es' }
    ];
    
    const results = [];
    
    // Import the books metadata first
    try {
      const booksResponse = await supabase.functions.invoke('import-bible', {
        body: JSON.stringify({
          action: 'import-books'
        })
      });
      
      if (booksResponse.error || !booksResponse.data?.success) {
        console.error('Error importing books metadata:', booksResponse.error || booksResponse.data?.message);
      } else {
        console.log('Successfully imported books metadata');
      }
    } catch (error) {
      console.error('Error calling import-books:', error);
    }
    
    // Import each version
    for (const v of versions) {
      try {
        const response = await supabase.functions.invoke('import-bible', {
          body: JSON.stringify({
            action: 'import-complete-version',
            version: v.version,
            language: v.language
          })
        });
        
        results.push({
          version: v.version,
          success: !response.error && response.data?.success,
          message: response.error?.message || response.data?.message || 'Unknown status',
          importedBooks: response.data?.importedBooks || [],
          failedBooks: response.data?.failedBooks || [],
          totalBooks: response.data?.totalBooks || 0
        });
      } catch (error) {
        console.error(`Error importing version ${v.version}:`, error);
        results.push({
          version: v.version,
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    return {
      success: results.some(r => r.success),
      results
    };
  } catch (error) {
    console.error('Error importing initial versions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function importCompleteVersion(version: string, language: string): Promise<any> {
  try {
    // Call our edge function to import the complete version
    const response = await supabase.functions.invoke('import-bible', {
      body: JSON.stringify({
        action: 'import-complete-version',
        version,
        language
      })
    });
    
    if (response.error) {
      throw new Error(`Error importing Bible version: ${response.error.message}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error importing Bible version:', error);
    throw error;
  }
}
