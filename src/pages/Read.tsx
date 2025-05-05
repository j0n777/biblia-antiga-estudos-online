import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import BibleChapter from '@/components/bible/BibleChapter';
import { getChapter, getAllBooks, getAllVersions } from '@/services/BibleDataService';
import { saveReadingPosition, getLastReadingPosition } from '@/services/ReadingService';
import { trackReading, saveVerse } from '@/services/AchievementService';
import { BibleBook, BibleChapter as BibleChapterType, BibleVersion } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import FontSizeControl from '@/components/bible/FontSizeControl';

const Read = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookId, setBookId] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [versionId, setVersionId] = useState('kja');
  const [chapter, setChapter] = useState<BibleChapterType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [scrollToVerse, setScrollToVerse] = useState<number | null>(null);
  const [savedVerses, setSavedVerses] = useState<Record<string, boolean>>({});
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const initializeReadingPosition = async () => {
      try {
        // First load all books and versions to ensure they're available
        const booksData = await getAllBooks('kja');
        setBooks(booksData);
        
        const versionsData = await getAllVersions();
        setVersions(versionsData);

        // Check URL params first
        const urlBook = searchParams.get('book');
        const urlChapter = searchParams.get('chapter');
        const urlVersion = searchParams.get('version');
        const urlVerse = searchParams.get('verse');
        
        if (urlBook && urlChapter) {
          // Use URL parameters if available
          setBookId(urlBook);
          setChapterNumber(parseInt(urlChapter, 10));
          if (urlVersion) setVersionId(urlVersion);
          if (urlVerse) setScrollToVerse(parseInt(urlVerse, 10));
        } else {
          // Otherwise try to get last reading position
          const lastPosition = await getLastReadingPosition();
          if (lastPosition) {
            console.log("Loading last reading position:", lastPosition);
            setBookId(lastPosition.book_id);
            setChapterNumber(lastPosition.chapter);
            setVersionId(lastPosition.version_id);
            setScrollToVerse(lastPosition.verse);
          } else {
            // Default to Matthew 1
            console.log("No last reading position, using default");
            setBookId('MAT');
            setChapterNumber(1);
            setVersionId('kja');
          }
        }
        setIsInitialLoad(false);
      } catch (error) {
        console.error('Error initializing reading position:', error);
        setBookId('MAT');
        setChapterNumber(1);
        setVersionId('kja');
        setIsInitialLoad(false);
      }
    };

    initializeReadingPosition();
  }, [searchParams]);
  
  useEffect(() => {
    // Only load chapter after we've initialized the reading position
    if (!isInitialLoad && bookId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, chapterNumber, versionId, isInitialLoad]);
  
  // Update URL when reading position changes
  useEffect(() => {
    if (!isInitialLoad && bookId) {
      setSearchParams({ 
        book: bookId, 
        chapter: chapterNumber.toString(),
        version: versionId,
        verse: scrollToVerse ? scrollToVerse.toString() : '1'
      }, { replace: true });
    }
  }, [bookId, chapterNumber, versionId, scrollToVerse, setSearchParams, isInitialLoad]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log(`Loading chapter: ${bookId} ${chapterNumber} (${versionId})`);
      
      // Load chapter
      const chapterData = await getChapter(bookId, chapterNumber, versionId);
      setChapter(chapterData);
      
      // Track reading progress
      await trackReading(versionId, bookId, chapterNumber, scrollToVerse || 1);
      await saveReadingPosition(versionId, bookId, chapterNumber, scrollToVerse || 1);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: t('common.error'),
        description: t('bible.errorLoadingChapter'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePreviousChapter = () => {
    // Find the current book in the list
    const currentBookIndex = books.findIndex(book => book.book_id === bookId);
    if (currentBookIndex === -1) return;
    
    const currentBook = books[currentBookIndex];
    
    // If we're not at chapter 1, go to the previous chapter of the same book
    if (chapterNumber > 1) {
      setChapterNumber(chapterNumber - 1);
      setScrollToVerse(null);
      return;
    }
    
    // If we're at chapter 1, go to the last chapter of the previous book
    if (currentBookIndex > 0) {
      const previousBook = books[currentBookIndex - 1];
      setBookId(previousBook.book_id);
      setChapterNumber(previousBook.chapters_count);
      setScrollToVerse(null);
    }
  };
  
  const handleNextChapter = () => {
    // Find the current book in the list
    const currentBookIndex = books.findIndex(book => book.book_id === bookId);
    if (currentBookIndex === -1) return;
    
    const currentBook = books[currentBookIndex];
    
    // If we're not at the last chapter, go to the next chapter of the same book
    if (chapterNumber < currentBook.chapters_count) {
      setChapterNumber(chapterNumber + 1);
      setScrollToVerse(null);
      return;
    }
    
    // If we're at the last chapter, go to the first chapter of the next book
    if (currentBookIndex < books.length - 1) {
      const nextBook = books[currentBookIndex + 1];
      setBookId(nextBook.book_id);
      setChapterNumber(1);
      setScrollToVerse(null);
    }
  };
  
  const handleSaveVerse = async (verseNumber: number) => {
    const verseKey = `${bookId}-${chapterNumber}-${verseNumber}`;
    
    const success = await saveVerse(bookId, chapterNumber, verseNumber, versionId, "yellow");
    
    if (success) {
      setSavedVerses({
        ...savedVerses,
        [verseKey]: true
      });
      toast({
        title: t('bible.verseSaved'),
        description: `${bookId} ${chapterNumber}:${verseNumber}`,
      });
    }
  };
  
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
  };
  
  const isVerseSelected = (verseNumber: number) => {
    const verseKey = `${bookId}-${chapterNumber}-${verseNumber}`;
    return savedVerses[verseKey] || false;
  };

  const handleBookChange = (value: string) => {
    setBookId(value);
    setChapterNumber(1);
    setScrollToVerse(null);
  };

  // If still initializing reading position, show loading
  if (isInitialLoad) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-ancient-gold" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="py-4 max-w-4xl mx-auto">
        <div className="flex flex-col space-y-4 mb-4 px-2">
          {/* Bible navigation controls */}
          <div className="flex flex-col space-y-3">
            {/* Version selector */}
            <Select value={versionId} onValueChange={value => setVersionId(value)}>
              <SelectTrigger className="w-full border-parchment-darker/30" aria-label="Select version">
                <SelectValue placeholder="Select Version">
                  {versions.find(v => v.id === versionId)?.name || versionId}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {versions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {version.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Book and chapter selector */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <Select value={bookId} onValueChange={handleBookChange}>
                  <SelectTrigger className="border-parchment-darker/30" aria-label="Select book">
                    <SelectValue placeholder={t('bible.selectBook')}>
                      {books.find(b => b.book_id === bookId)?.name || t('bible.selectBook')}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    <SelectGroup>
                      <SelectLabel className="font-oldstyle font-bold text-ancient-brown">{t('bible.oldTestament')}</SelectLabel>
                      {books
                        .filter(book => book.testament === 'old')
                        .map(book => (
                          <SelectItem key={book.book_id} value={book.book_id}>
                            {book.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="font-oldstyle font-bold text-ancient-brown">{t('bible.newTestament')}</SelectLabel>
                      {books
                        .filter(book => book.testament === 'new')
                        .map(book => (
                          <SelectItem key={book.book_id} value={book.book_id}>
                            {book.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-24">
                <Select 
                  value={chapterNumber.toString()} 
                  onValueChange={value => {
                    setChapterNumber(parseInt(value));
                    setScrollToVerse(null);
                  }}
                  disabled={!bookId}
                >
                  <SelectTrigger className="border-parchment-darker/30" aria-label="Select chapter">
                    <SelectValue placeholder={t('bible.selectChapter')}>
                      {chapterNumber ? `${t('bible.chapter')} ${chapterNumber}` : t('bible.selectChapter')}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {books.find(b => b.book_id === bookId)?.chapters_count && 
                      Array.from(
                        { length: books.find(b => b.book_id === bookId)?.chapters_count || 0 },
                        (_, i) => i + 1
                      ).map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {t('bible.chapter')} {num}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <FontSizeControl onFontSizeChange={handleFontSizeChange} />
            </div>
          </div>
        </div>

        <div 
          ref={containerRef}
          className="pb-16"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-ancient-gold" />
            </div>
          ) : chapter ? (
            <BibleChapter 
              chapter={chapter} 
              scrollToVerse={scrollToVerse} 
              onVerseAction={handleSaveVerse}
              isVerseSelected={isVerseSelected}
              fontSize={fontSize}
            />
          ) : (
            <div className="text-center py-12">
              <p>{t('bible.chapterNotFound')}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('bible.tryAnotherChapter')}
              </p>
            </div>
          )}
        </div>

        <div className="fixed bottom-16 left-0 right-0 flex justify-center px-4 pb-4">
          <div className="flex gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg border">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handlePreviousChapter}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="opacity-50 cursor-default"
            >
              {chapterNumber}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleNextChapter}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Read;
