
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import BibleChapter from '@/components/bible/BibleChapter';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllBooks, getAllVersions, importCompleteVersion } from '@/services/BibleService';
import { BibleBook, BibleVersion } from '@/services/BibleService';
import { toast } from 'sonner';

const Read = () => {
  const [selectedBook, setSelectedBook] = useState('genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVersion, setSelectedVersion] = useState('kjv');
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksData, versionsData] = await Promise.all([
          getAllBooks(),
          getAllVersions()
        ]);
        
        setBooks(booksData);
        setVersions(versionsData);
      } catch (error) {
        console.error('Error loading Bible data:', error);
      }
    };
    
    loadData();
  }, []);
  
  const oldTestamentBooks = books.filter(book => book.testament === 'old');
  const newTestamentBooks = books.filter(book => book.testament === 'new');
  
  // Calculate the number of chapters for the selected book
  const getChaptersForBook = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book?.chapters_count || 1;
  };
  
  const chaptersArray = Array.from(
    { length: getChaptersForBook(selectedBook) }, 
    (_, i) => i + 1
  );
  
  const handlePreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    }
  };
  
  const handleNextChapter = () => {
    if (selectedChapter < getChaptersForBook(selectedBook)) {
      setSelectedChapter(selectedChapter + 1);
    }
  };
  
  const handleImportVersion = async (version: string) => {
    try {
      setIsImporting(true);
      
      let language = 'en';
      if (version === 'acf') language = 'pt-br';
      if (version === 'rvr') language = 'es';
      
      toast.info(`Iniciando importação da Bíblia versão ${version}...`, {
        duration: 3000,
      });
      
      const result = await importCompleteVersion(version, language);
      
      toast.success(`Bíblia versão ${version} importada com sucesso. ${result.importedBooks?.length || 0} livros processados.`, {
        duration: 5000,
      });
    } catch (error) {
      console.error('Error importing Bible version:', error);
      toast.error(`Erro ao importar Bíblia: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, {
        duration: 5000,
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <PageLayout>
      <div className="py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-oldstyle text-scripture-heading">Leitura Bíblica</h1>
          
          <div className="flex items-center gap-2">
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger className="w-[180px] bg-parchment-light border-parchment-dark/30">
                <SelectValue placeholder="Versão" />
              </SelectTrigger>
              <SelectContent className="bg-parchment border-parchment-dark/30">
                {versions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {version.name} ({version.language_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleImportVersion(selectedVersion)}
              disabled={isImporting}
              className="bg-parchment-light border-parchment-dark/30"
            >
              {isImporting ? 'Importando...' : 'Importar Versão'}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Select 
            value={selectedBook} 
            onValueChange={setSelectedBook}
          >
            <SelectTrigger className="bg-parchment-light border-parchment-dark/30">
              <SelectValue placeholder="Livro" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] bg-parchment border-parchment-dark/30">
              <div className="p-2 font-oldstyle text-sm text-scripture-heading">Antigo Testamento</div>
              {oldTestamentBooks.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.name}
                </SelectItem>
              ))}
              <div className="p-2 font-oldstyle text-sm text-scripture-heading">Novo Testamento</div>
              {newTestamentBooks.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedChapter.toString()} 
            onValueChange={(value) => setSelectedChapter(parseInt(value))}
          >
            <SelectTrigger className="w-[100px] bg-parchment-light border-parchment-dark/30">
              <SelectValue placeholder="Capítulo" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] bg-parchment border-parchment-dark/30">
              {chaptersArray.map((chapter) => (
                <SelectItem key={chapter} value={chapter.toString()}>
                  {chapter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <BibleChapter 
          book={selectedBook}
          chapter={selectedChapter}
          version={selectedVersion}
        />
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousChapter}
            disabled={selectedChapter <= 1}
            className="bg-parchment-light border-parchment-dark/30"
          >
            <ChevronLeft size={16} className="mr-1" /> Anterior
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextChapter}
            disabled={selectedChapter >= getChaptersForBook(selectedBook)}
            className="bg-parchment-light border-parchment-dark/30"
          >
            Próximo <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Read;
