import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, BookOpen } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import BibleChapter from '@/components/bible/BibleChapter';
import { useBibleReading } from '@/hooks/useBibleReading';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import ReadingControls from '@/components/bible/ReadingControls';
import ChapterNavigation from '@/components/bible/ChapterNavigation';
const Read = () => {
  const [fontSize, setFontSize] = useState<'large' | 'extra-large' | 'huge'>('large');
  const [searchParams] = useSearchParams();
  const {
    t
  } = useLanguage();
  const {
    bookId,
    chapterNumber,
    versionId,
    books,
    versions,
    chapter,
    isLoading,
    isInitialLoad,
    scrollToVerse,
    handlePreviousChapter,
    handleNextChapter,
    handleBookChange,
    handleChapterChange,
    handleVersionChange,
    handleSaveVerse,
    isVerseSelected
  } = useBibleReading();

  // Handle URL parameters for direct navigation from search
  useEffect(() => {
    const urlBook = searchParams.get('book');
    const urlChapter = searchParams.get('chapter');
    const urlVerse = searchParams.get('verse');
    if (urlBook && urlChapter && urlBook !== bookId) {
      console.log(`Navigating to ${urlBook} ${urlChapter} from search`);
      handleBookChange(urlBook);
      handleChapterChange(parseInt(urlChapter));
      if (urlVerse) {
        console.log(`Will scroll to verse ${urlVerse}`);
      }
    }
  }, [searchParams, bookId, handleBookChange, handleChapterChange]);
  const handleFontSizeChange = useCallback((size: 'large' | 'extra-large' | 'huge') => {
    setFontSize(size);
  }, []);
  const onVerseAction = useCallback(async (verseNumber: number) => {
    const success = await handleSaveVerse(verseNumber);
    if (success) {
      const bookName = books.find(b => b.book_id === bookId)?.name || bookId;
      const isHighlighted = isVerseSelected(verseNumber);
      toast({
        title: isHighlighted ? t('bible.verseRemoved') || 'Destaque removido' : t('bible.verseSaved') || 'Versículo destacado',
        description: `${bookName} ${chapterNumber}:${verseNumber}`
      });
    }
  }, [handleSaveVerse, books, bookId, chapterNumber, t, isVerseSelected]);
  const onPreviousChapter = useCallback(() => {
    console.log('Previous chapter requested from Read page');
    handlePreviousChapter();
  }, [handlePreviousChapter]);
  const onNextChapter = useCallback(() => {
    console.log('Next chapter requested from Read page');
    handleNextChapter();
  }, [handleNextChapter]);
  if (isInitialLoad) {
    return <PageLayout>
        <div className="min-h-screen bg-bible-background flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-bible-title" />
        </div>
      </PageLayout>;
  }
  const verseFromUrl = searchParams.get('verse') ? parseInt(searchParams.get('verse')!) : null;
  const finalScrollToVerse = verseFromUrl || scrollToVerse;
  return <PageLayout>
      <div className="min-h-screen bg-bible-gradient">
        {/* Header with title and version selector - consistent margins */}
        <div className="flex items-center justify-between py-[12px] px-[16px]">
          <div className="flex items-center gap-2">
            <BookOpen size={24} className="text-ancient-gold" />
            <h1 className="text-2xl font-oldstyle text-scripture-heading">
              Leitura Bíblica
            </h1>
          </div>
          
          {/* Version selector compact */}
          <ReadingControls books={books} versions={versions} bookId={bookId} chapterNumber={chapterNumber} versionId={versionId} onBookChange={handleBookChange} onChapterChange={handleChapterChange} onVersionChange={handleVersionChange} onFontSizeChange={handleFontSizeChange} compact={true} />
        </div>

        {/* Book and Chapter selectors - consistent margins */}
        <div className="px-4 mb-4">
          <ReadingControls books={books} versions={versions} bookId={bookId} chapterNumber={chapterNumber} versionId={versionId} onBookChange={handleBookChange} onChapterChange={handleChapterChange} onVersionChange={handleVersionChange} onFontSizeChange={handleFontSizeChange} compact={false} showOnlySelectors={true} />
        </div>

        {/* Bible content in styled box with consistent margins */}
        <div className="px-4 pb-4">
          <div className="bg-bible-box rounded-xl shadow-lg border border-gray-200/50 min-h-[400px]">
            {/* Chapter title - inside the box */}
            {!isLoading && chapter && <div className="text-center px-4 pt-6 pb-4">
                <h2 className="text-3xl font-medium text-bible-title font-serif mb-1">
                  {books.find(b => b.book_id === bookId)?.name || bookId}
                </h2>
                <div className="text-lg text-bible-subtitle font-normal">
                  Capítulo {chapterNumber}
                </div>
                <div className="w-24 h-0.5 bg-bible-subtitle mx-auto mt-3"></div>
              </div>}

            {isLoading ? <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-bible-title" />
              </div> : chapter ? <BibleChapter chapter={chapter} scrollToVerse={finalScrollToVerse} onVerseAction={onVerseAction} isVerseSelected={isVerseSelected} fontSize={fontSize} /> : <div className="flex flex-col items-center justify-center py-12 text-center p-4">
                <div className="w-16 h-16 bg-bible-title/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📖</span>
                </div>
                <p className="text-bible-title font-normal mb-2">
                  {t('bible.chapterNotFound') || 'Capítulo não encontrado'}
                </p>
                <p className="text-sm text-bible-subtitle">
                  {t('bible.tryAnotherChapter') || 'Por favor selecione outro livro ou capítulo.'}
                </p>
              </div>}
          </div>
        </div>

        {/* Navigation - consistent margins */}
        <div className="mt-6 px-4 pb-6">
          <ChapterNavigation chapterNumber={chapterNumber} onPreviousChapter={onPreviousChapter} onNextChapter={onNextChapter} />
        </div>
      </div>
    </PageLayout>;
};
export default Read;