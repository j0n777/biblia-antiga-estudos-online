
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import BibleChapter from '@/components/bible/BibleChapter';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  getAllBooks, 
  getAllVersions, 
  importInitialVersions, 
  BibleBook, 
  BibleVersion 
} from '@/services/BibleService';
import { saveReadingPosition, getLastReadingPosition } from '@/services/ReadingService';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

const Read = () => {
  // Default to Matthew (Chapter 1) in PT-BR
  const [selectedBookId, setSelectedBookId] = useState('matthew');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVersionId, setSelectedVersionId] = useState('kja');
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoringPosition, setIsRestoringPosition] = useState(true);
  
  // Fetch books and versions with React Query
  const { 
    data: books = [], 
    isLoading: booksLoading 
  } = useQuery({
    queryKey: ['bible-books', selectedVersionId],
    queryFn: () => getAllBooks(selectedVersionId),
  });
  
  const { 
    data: versions = [], 
    isLoading: versionsLoading 
  } = useQuery({
    queryKey: ['bible-versions'],
    queryFn: getAllVersions,
  });
  
  // On first load, ensure we have the Bible data
  useEffect(() => {
    async function ensureDataAvailability() {
      if (!booksLoading && !versionsLoading) {
        if (books.length === 0 || versions.length === 0) {
          setIsLoading(true);
          toast.info("Preparando a Bíblia para leitura...", {
            duration: 3000,
          });
          
          console.log("Importing initial Bible versions...");
          const result = await importInitialVersions();
          setIsLoading(false);
          
          if (result.success) {
            toast.success("As versões da Bíblia estão prontas para uso.", {
              duration: 3000,
            });
            // Refetch books and versions to update the UI
            window.location.reload(); // Simple solution to refresh data
          } else {
            toast.error("Houve um problema ao preparar as versões da Bíblia. Por favor, tente novamente mais tarde.", {
              duration: 5000,
            });
          }
        }
      }
    }
    
    ensureDataAvailability();
  }, [books.length, versions.length, booksLoading, versionsLoading]);
  
  // Restore the last reading position
  useEffect(() => {
    const restoreReadingPosition = async () => {
      if (isRestoringPosition && !booksLoading && books.length > 0 && !versionsLoading && versions.length > 0) {
        const lastPosition = getLastReadingPosition();
        
        if (lastPosition) {
          // Check if the version exists in our available versions
          const versionExists = versions.some(v => v.id === lastPosition.version_id);
          
          // Check if the book exists in our available books
          const bookExists = books.some(b => b.book_id === lastPosition.book_id);
          
          if (versionExists && bookExists) {
            setSelectedVersionId(lastPosition.version_id);
            setSelectedBookId(lastPosition.book_id);
            setSelectedChapter(lastPosition.chapter_number);
            
            toast.info("Continuando de onde você parou", {
              duration: 2000,
            });
          }
        }
        
        setIsRestoringPosition(false);
      }
    };
    
    restoreReadingPosition();
  }, [books, versions, booksLoading, versionsLoading, isRestoringPosition]);
  
  // Save reading position whenever it changes
  useEffect(() => {
    // Don't save while we're still restoring the position
    if (!isRestoringPosition) {
      saveReadingPosition(selectedVersionId, selectedBookId, selectedChapter);
    }
  }, [selectedVersionId, selectedBookId, selectedChapter, isRestoringPosition]);
  
  const oldTestamentBooks = books.filter(book => book.testament === 'old');
  const newTestamentBooks = books.filter(book => book.testament === 'new');
  
  // Calculate the number of chapters for the selected book
  const getChaptersForBook = (bookId: string) => {
    const book = books.find(b => b.book_id === bookId);
    return book?.chapters_count || 1;
  };
  
  const chaptersArray = Array.from(
    { length: getChaptersForBook(selectedBookId) }, 
    (_, i) => i + 1
  );
  
  const handlePreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    }
  };
  
  const handleNextChapter = () => {
    if (selectedChapter < getChaptersForBook(selectedBookId)) {
      setSelectedChapter(selectedChapter + 1);
    }
  };
  
  const getLocalizedVersionName = (version: BibleVersion) => {
    switch (version.language) {
      case 'pt-br':
        return `${version.name} (Português)`;
      case 'es':
        return `${version.name} (Español)`;
      case 'en':
        return `${version.name} (English)`;
      default:
        return version.name;
    }
  };

  // Callback when a verse is viewed/read
  const handleVerseRead = (verseNumber: number) => {
    saveReadingPosition(selectedVersionId, selectedBookId, selectedChapter, verseNumber);
  };
  
  return (
    <PageLayout>
      <div className="py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-oldstyle text-scripture-heading">Leitura Bíblica</h1>
          
          <div className="flex items-center gap-2">
            <Select value={selectedVersionId} onValueChange={setSelectedVersionId}>
              <SelectTrigger className="w-[220px] bg-parchment-light border-parchment-dark/30">
                <SelectValue placeholder="Versão" />
              </SelectTrigger>
              <SelectContent className="bg-parchment border-parchment-dark/30">
                {versions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {getLocalizedVersionName(version)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Select 
            value={selectedBookId} 
            onValueChange={setSelectedBookId}
          >
            <SelectTrigger className="bg-parchment-light border-parchment-dark/30">
              <SelectValue placeholder="Livro" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] bg-parchment border-parchment-dark/30">
              <div className="p-2 font-oldstyle text-sm text-scripture-heading">Antigo Testamento</div>
              {oldTestamentBooks.map((book) => (
                <SelectItem key={book.book_id} value={book.book_id}>
                  {book.name}
                </SelectItem>
              ))}
              <div className="p-2 font-oldstyle text-sm text-scripture-heading">Novo Testamento</div>
              {newTestamentBooks.map((book) => (
                <SelectItem key={book.book_id} value={book.book_id}>
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
          bookId={selectedBookId}
          chapterNumber={selectedChapter}
          versionId={selectedVersionId}
          onVerseRead={handleVerseRead}
        />
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousChapter}
            disabled={selectedChapter <= 1 || isLoading}
            className="bg-parchment-light border-parchment-dark/30"
          >
            <ChevronLeft size={16} className="mr-1" /> Anterior
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextChapter}
            disabled={selectedChapter >= getChaptersForBook(selectedBookId) || isLoading}
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
