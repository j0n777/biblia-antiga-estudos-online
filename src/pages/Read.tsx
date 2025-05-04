
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { ChevronLeft, ChevronRight, Menu, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BibleChapter from '@/components/bible/BibleChapter';
import { getChapter, getAllBooks, getAllVersions } from '@/services/BibleDataService';
import { saveReadingPosition } from '@/services/ReadingService';
import { trackReading, saveVerse } from '@/services/AchievementService';
import { BibleBook, BibleChapter as BibleChapterType, BibleVersion } from '@/types/bible.types';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import FontSizeControl from '@/components/bible/FontSizeControl';

const bookToWidthMap: Record<string, number> = {
  GEN: 50, EXO: 40, LEV: 27, NUM: 36, DEU: 34,
  JOS: 24, JDG: 21, RUT: 4, '1SA': 31, '2SA': 24,
  '1KI': 22, '2KI': 25, '1CH': 29, '2CH': 36, EZR: 10,
  NEH: 13, EST: 10, JOB: 42, PSA: 150, PRO: 31,
  ECC: 12, SNG: 8, ISA: 66, JER: 52, LAM: 5,
  EZK: 48, DAN: 12, HOS: 14, JOL: 3, AMO: 9,
  OBA: 1, JON: 4, MIC: 7, NAM: 3, HAB: 3,
  ZEP: 3, HAG: 2, ZEC: 14, MAL: 4, MAT: 28,
  MRK: 16, LUK: 24, JHN: 21, ACT: 28, ROM: 16,
  '1CO': 16, '2CO': 13, GAL: 6, EPH: 6, PHP: 4,
  COL: 4, '1TH': 5, '2TH': 3, '1TI': 6, '2TI': 4,
  TIT: 3, PHM: 1, HEB: 13, JAS: 5, '1PE': 5,
  '2PE': 3, '1JN': 5, '2JN': 1, '3JN': 1, JUD: 1,
  REV: 22
};

const Read = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBookId = searchParams.get('book') || 'JHN';
  const initialChapter = parseInt(searchParams.get('chapter') || '1');
  const initialVerse = parseInt(searchParams.get('verse') || '0');
  const initialVersion = searchParams.get('version') || 'kja';
  
  const [bookId, setBookId] = useState(initialBookId);
  const [chapterNumber, setChapterNumber] = useState(initialChapter);
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [versionId, setVersionId] = useState(initialVersion);
  const [chapter, setChapter] = useState<BibleChapterType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollToVerse, setScrollToVerse] = useState<number | null>(initialVerse || null);
  const [savedVerses, setSavedVerses] = useState<Record<string, boolean>>({});
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load books, versions, and chapter
      const [booksData, versionsData, chapterData] = await Promise.all([
        getAllBooks(versionId),
        getAllVersions(),
        getChapter(bookId, chapterNumber, versionId)
      ]);
      
      setBooks(booksData);
      setVersions(versionsData);
      setChapter(chapterData);
      
      // Update URL without causing navigation
      setSearchParams({ 
        book: bookId, 
        chapter: chapterNumber.toString(),
        version: versionId 
      }, { replace: true });
      
      // Track reading progress
      await trackReading(versionId, bookId, chapterNumber, 1);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, chapterNumber, versionId]);
  
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
    }
  };
  
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
  };
  
  const isVerseSelected = (verseNumber: number) => {
    const verseKey = `${bookId}-${chapterNumber}-${verseNumber}`;
    return savedVerses[verseKey] || false;
  };

  return (
    <PageLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:w-[420px]">
              <SheetHeader>
                <SheetTitle>{t('bible.selectChapter')}</SheetTitle>
              </SheetHeader>
              <div className="py-4 overflow-y-auto max-h-full">
                <Accordion 
                  type="multiple"
                  defaultValue={[books.find(b => b.book_id === bookId)?.testament === 'old' ? 'old_testament' : 'new_testament']}
                >
                  <AccordionItem value="old_testament">
                    <AccordionTrigger className="font-oldstyle text-ancient-brown">
                      {t('bible.oldTestament')}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-1">
                      {books
                        .filter(book => book.testament === 'old')
                        .map(book => (
                          <Accordion key={book.book_id} type="single" collapsible>
                            <AccordionItem value={book.book_id}>
                              <AccordionTrigger className="py-1 text-sm">
                                {book.name}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="grid grid-cols-8 gap-1">
                                  {Array.from(
                                    { length: book.chapters_count },
                                    (_, i) => i + 1
                                  ).map(chapterNum => (
                                    <SheetClose key={chapterNum} asChild>
                                      <Button
                                        variant={bookId === book.book_id && chapterNumber === chapterNum ? "default" : "outline"}
                                        size="sm"
                                        className={`h-8 w-8 p-0 ${bookId === book.book_id && chapterNumber === chapterNum ? 'bg-ancient-gold text-white hover:bg-ancient-gold/90' : ''}`}
                                        onClick={() => {
                                          setBookId(book.book_id);
                                          setChapterNumber(chapterNum);
                                          setScrollToVerse(null);
                                          saveReadingPosition(versionId, book.book_id, chapterNum, 1);
                                        }}
                                      >
                                        {chapterNum}
                                      </Button>
                                    </SheetClose>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ))}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="new_testament">
                    <AccordionTrigger className="font-oldstyle text-ancient-brown">
                      {t('bible.newTestament')}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-1">
                      {books
                        .filter(book => book.testament === 'new')
                        .map(book => (
                          <Accordion key={book.book_id} type="single" collapsible>
                            <AccordionItem value={book.book_id}>
                              <AccordionTrigger className="py-1 text-sm">
                                {book.name}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="grid grid-cols-8 gap-1">
                                  {Array.from(
                                    { length: book.chapters_count },
                                    (_, i) => i + 1
                                  ).map(chapterNum => (
                                    <SheetClose key={chapterNum} asChild>
                                      <Button
                                        variant={bookId === book.book_id && chapterNumber === chapterNum ? "default" : "outline"}
                                        size="sm"
                                        className={`h-8 w-8 p-0 ${bookId === book.book_id && chapterNumber === chapterNum ? 'bg-ancient-gold text-white hover:bg-ancient-gold/90' : ''}`}
                                        onClick={() => {
                                          setBookId(book.book_id);
                                          setChapterNumber(chapterNum);
                                          setScrollToVerse(null);
                                          saveReadingPosition(versionId, book.book_id, chapterNum, 1);
                                        }}
                                      >
                                        {chapterNum}
                                      </Button>
                                    </SheetClose>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Select value={versionId} onValueChange={value => {
              setVersionId(value);
              setScrollToVerse(null);
            }}>
              <SelectTrigger className="w-[110px]" aria-label="Select version">
                <SelectValue>
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
            
            <Select value={bookId} onValueChange={value => {
              setBookId(value);
              setChapterNumber(1);
              setScrollToVerse(null);
            }}>
              <SelectTrigger className="w-[110px]" aria-label="Select book">
                <SelectValue>
                  {books.find(b => b.book_id === bookId)?.name || bookId}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.book_id} value={book.book_id}>
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={chapterNumber.toString()} 
              onValueChange={value => {
                setChapterNumber(parseInt(value));
                setScrollToVerse(null);
              }}
            >
              <SelectTrigger className="w-[80px]" aria-label="Select chapter">
                <SelectValue>
                  {chapterNumber}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: bookToWidthMap[bookId] || 1 },
                  (_, i) => i + 1
                ).map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <FontSizeControl onFontSizeChange={handleFontSizeChange} />
        </div>

        <div 
          ref={containerRef}
          className="px-1 pb-16"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin" />
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
            </div>
          )}
        </div>

        <div className="fixed bottom-16 left-0 right-0 flex justify-center px-4 pb-4">
          <div className="flex gap-2 bg-background/50 backdrop-blur-sm p-2 rounded-full shadow-lg border">
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
