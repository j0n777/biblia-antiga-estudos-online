
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
        {/* Header with title and version selector */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-amber-800 dark:text-amber-200 font-serif">
              Leitura Bíblica
            </h1>
            
            {/* Version selector matching the reference */}
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
              compact={true}
            />
          </div>
        </div>

        {/* Chapter title - centered and prominent */}
        {!isLoading && chapter && (
          <div className="text-center px-4 mb-6">
            <h2 className="text-4xl font-bold text-amber-800 dark:text-amber-200 font-serif mb-2">
              {books.find(b => b.book_id === bookId)?.name || bookId}
            </h2>
            <div className="text-xl text-amber-600 dark:text-amber-300 font-medium">
              Capítulo {chapterNumber}
            </div>
          </div>
        )}

        {/* Bible content */}
        <div className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-800/50 min-h-screen">
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

        {/* Navigation */}
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
