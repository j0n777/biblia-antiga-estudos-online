
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Import the three main versions we need
export async function importInitialVersions(): Promise<any> {
  try {
    // Import the three main versions we need - this can be called at app initialization
    const versions = [
      { version: 'kjv', language: 'en', name: 'King James Version' },
      { version: 'kja', language: 'pt-br', name: 'King James Atualizada' },
      { version: 'rvr', language: 'es', name: 'Reina Valera 1909' }
    ];
    
    const results = [];
    
    // Import the books metadata first
    try {
      console.log('Importing books metadata...');
      
      const booksResponse = await supabase.functions.invoke('import-bible', {
        body: JSON.stringify({
          action: 'import-books'
        })
      });
      
      if (booksResponse.error || !booksResponse.data?.success) {
        console.error('Error importing books metadata:', booksResponse.error || booksResponse.data?.message);
        toast.error('Erro ao importar metadados dos livros');
      } else {
        console.log('Successfully imported books metadata');
        toast.success('Metadados dos livros importados com sucesso');
      }
    } catch (error) {
      console.error('Error calling import-books:', error);
      toast.error('Erro ao importar metadados dos livros');
    }
    
    // Import each version
    for (const v of versions) {
      try {
        console.log(`Importing version ${v.version} (${v.language})...`);
        toast.info(`Importando versão ${v.name}...`, { duration: 5000 });
        
        const response = await supabase.functions.invoke('import-bible', {
          body: JSON.stringify({
            action: 'import-complete-version',
            version: v.version,
            language: v.language
          })
        });
        
        if (response.error) {
          console.error(`Error importing version ${v.version}:`, response.error);
          toast.error(`Erro ao importar versão ${v.name}`);
        } else if (!response.data?.success) {
          console.error(`Error importing version ${v.version}:`, response.data?.message);
          toast.error(`Erro ao importar versão ${v.name}: ${response.data?.message}`);
        } else {
          console.log(`Successfully imported version ${v.version}:`, response.data);
          toast.success(`Versão ${v.name} importada com sucesso`);
        }
        
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
        toast.error(`Erro ao importar versão ${v.name}`);
        
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
    toast.error('Erro ao importar versões iniciais');
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function importCompleteVersion(version: string, language: string): Promise<any> {
  try {
    console.log(`Importing complete version ${version} (${language})...`);
    
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
