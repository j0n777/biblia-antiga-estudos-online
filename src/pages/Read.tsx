
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import BibleChapter from '@/components/bible/BibleChapter';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Read = () => {
  const [selectedBook, setSelectedBook] = useState('genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVersion, setSelectedVersion] = useState('kjv');
  
  // Mock data for Bible books
  const oldTestamentBooks = [
    { id: 'genesis', name: 'Gênesis' }, 
    { id: 'exodus', name: 'Êxodo' }, 
    { id: 'leviticus', name: 'Levítico' }, 
    { id: 'numbers', name: 'Números' }, 
    { id: 'deuteronomy', name: 'Deuteronômio' }
  ];
  
  const newTestamentBooks = [
    { id: 'matthew', name: 'Mateus' }, 
    { id: 'mark', name: 'Marcos' }, 
    { id: 'luke', name: 'Lucas' }, 
    { id: 'john', name: 'João' }, 
    { id: 'acts', name: 'Atos' }
  ];
  
  // Mock data for Bible versions
  const bibleVersions = [
    { id: 'kjv', name: 'King James (English)' },
    { id: 'acf', name: 'Almeida Corrigida Fiel (Português)' },
    { id: 'rvr', name: 'Reina Valera (Español)' },
  ];
  
  // Calculate the number of chapters for the selected book (this would come from actual data)
  const getChaptersForBook = (book: string) => {
    const chaptersMap: Record<string, number> = {
      'genesis': 50,
      'exodus': 40,
      'leviticus': 27,
      'matthew': 28,
      'mark': 16,
      'luke': 24,
      'john': 21,
    };
    
    return chaptersMap[book] || 1;
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
  
  return (
    <PageLayout>
      <div className="py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-oldstyle text-scripture-heading">Leitura Bíblica</h1>
          
          <Select value={selectedVersion} onValueChange={setSelectedVersion}>
            <SelectTrigger className="w-[180px] bg-parchment-light border-parchment-dark/30">
              <SelectValue placeholder="Versão" />
            </SelectTrigger>
            <SelectContent className="bg-parchment border-parchment-dark/30">
              {bibleVersions.map((version) => (
                <SelectItem key={version.id} value={version.id}>
                  {version.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
