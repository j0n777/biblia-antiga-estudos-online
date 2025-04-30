
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import BibleChapter from '@/components/bible/BibleChapter';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Read = () => {
  const [selectedBook, setSelectedBook] = useState('Gênesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVersion, setSelectedVersion] = useState('kjv-pt');
  
  // Mock data for the Bible text
  const mockVerses = [
    { number: 1, text: "No princípio, criou Deus os céus e a terra." },
    { number: 2, text: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas." },
    { number: 3, text: "E disse Deus: Haja luz. E houve luz." },
    { number: 4, text: "E viu Deus que a luz era boa; e fez Deus separação entre a luz e as trevas." },
    { number: 5, text: "E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã: o dia primeiro." },
    { number: 6, text: "E disse Deus: Haja um firmamento no meio das águas, e haja separação entre águas e águas." },
    { number: 7, text: "E fez Deus o firmamento e separação entre as águas que estavam debaixo do firmamento e as águas que estavam sobre o firmamento. E assim foi." },
    { number: 8, text: "E chamou Deus ao firmamento Céus. E foi a tarde e a manhã: o dia segundo." },
    { number: 9, text: "E disse Deus: Ajuntem-se as águas debaixo dos céus num só lugar, e apareça a terra seca. E assim foi." },
    { number: 10, text: "E chamou Deus à porção seca Terra; e ao ajuntamento das águas chamou Mares. E viu Deus que era bom." },
  ];
  
  // Mock data for Bible books
  const oldTestamentBooks = [
    'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio'
  ];
  
  const newTestamentBooks = [
    'Mateus', 'Marcos', 'Lucas', 'João', 'Atos'
  ];
  
  // Mock data for Bible versions
  const bibleVersions = [
    { id: 'kjv-pt', name: 'King James (Português)' },
    { id: 'kjv-en', name: 'King James (English)' },
    { id: 'reina-valera', name: 'Reina Valera (Español)' },
  ];
  
  // Calculate the number of chapters for the selected book (this would come from actual data)
  const getChaptersForBook = (book: string) => {
    const chaptersMap: Record<string, number> = {
      'Gênesis': 50,
      'Êxodo': 40,
      'Levítico': 27,
      'Mateus': 28,
      'Marcos': 16,
      'Lucas': 24,
      'João': 21,
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
          <Select value={selectedBook} onValueChange={setSelectedBook}>
            <SelectTrigger className="bg-parchment-light border-parchment-dark/30">
              <SelectValue placeholder="Livro" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] bg-parchment border-parchment-dark/30">
              <div className="p-2 font-oldstyle text-sm text-scripture-heading">Antigo Testamento</div>
              {oldTestamentBooks.map((book) => (
                <SelectItem key={book} value={book}>
                  {book}
                </SelectItem>
              ))}
              <div className="p-2 font-oldstyle text-sm text-scripture-heading">Novo Testamento</div>
              {newTestamentBooks.map((book) => (
                <SelectItem key={book} value={book}>
                  {book}
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
          verses={mockVerses}
          originalLanguage={selectedBook === 'Gênesis' || selectedBook === 'Êxodo' ? 'hebrew' : 'greek'}
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
