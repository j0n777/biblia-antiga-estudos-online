
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
  const { t } = useLanguage();
  
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
      toast({
        title: t('bible.verseSaved'),
        description: `${books.find(b => b.book_id === bookId)?.name || bookId} ${chapterNumber}:${verseNumber}`,
      });
    }
  }, [handleSaveVerse, books, bookId, chapterNumber, t]);

  if (isInitialLoad) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-ancient-gold" />
        </div>
      </PageLayout>
    );
  }

  const verseFromUrl = searchParams.get('verse') ? parseInt(searchParams.get('verse')!) : null;
  const finalScrollToVerse = verseFromUrl || scrollToVerse;

  return (
    <PageLayout>
      <div className="py-4 w-full max-w-4xl mx-auto px-4">
        {/* Header with elegant title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold font-oldstyle text-scripture-heading mb-2">
            {t('nav.read') || 'Leitura Bíblica'}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-ancient-gold to-ancient-brown mx-auto rounded-full"></div>
        </div>

        {/* Controls container with elegant styling */}
        <div className="bg-white/90 dark:bg-parchment-dark/90 backdrop-blur-sm rounded-xl shadow-lg border border-parchment-dark/20 dark:border-parchment-darker/30 p-6 mb-6">
          <ReadingControls
            books={books}
            versions={versions}
            bookId={bookId}
            chapterNumber={chapterNumber}
            versionId={versionId}
            onBookChange={handleBookChange}
            onChapterChange={handleChapterChange}
            onVersionChange={handleVersionChange}
            onFontSizeChange={handleFontSizeChange}
          />
        </div>

        {/* Chapter title - centered and elegant */}
        {!isLoading && chapter && (
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold font-oldstyle text-scripture-heading mb-2">
              {books.find(b => b.book_id === bookId)?.name || bookId}
            </h2>
            <div className="text-2xl font-medium text-ancient-gold">
              {t('bible.selectChapter') || 'Capítulo'} {chapterNumber}
            </div>
          </div>
        )}

        {/* Bible content container with enhanced styling */}
        <div className="bg-white/95 dark:bg-parchment-dark/95 backdrop-blur-sm rounded-xl shadow-xl border border-parchment-dark/20 dark:border-parchment-darker/30 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-ancient-gold" />
            </div>
          ) : chapter ? (
            <BibleChapter 
              chapter={chapter} 
              scrollToVerse={finalScrollToVerse} 
              onVerseAction={onVerseAction}
              isVerseSelected={isVerseSelected}
              fontSize={fontSize}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center p-4">
              <div className="w-16 h-16 bg-parchment-dark/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📖</span>
              </div>
              <p className="text-scripture-heading font-medium mb-2">
                {t('bible.chapterNotFound') || 'Capítulo não encontrado'}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('bible.tryAnotherChapter') || 'Por favor selecione outro livro ou capítulo.'}
              </p>
            </div>
          )}
        </div>

        {/* Navigation with elegant styling */}
        <div className="mt-6">
          <ChapterNavigation 
            chapterNumber={chapterNumber}
            onPreviousChapter={handlePreviousChapter}
            onNextChapter={handleNextChapter}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Read;
