
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import BibleChapter from '@/components/bible/BibleChapter';
import { useBibleReading } from '@/hooks/useBibleReading';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import ReadingControls from '@/components/bible/ReadingControls';
import ChapterNavigation from '@/components/bible/ChapterNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const Read = () => {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
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
  
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
  };
  
  const onVerseAction = async (verseNumber: number) => {
    const success = await handleSaveVerse(verseNumber);
    if (success) {
      toast({
        title: t('bible.verseSaved'),
        description: `${books.find(b => b.book_id === bookId)?.name || bookId} ${chapterNumber}:${verseNumber}`,
      });
    }
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
      <div className="py-2 sm:py-4 w-full max-w-full overflow-hidden">
        <div className="flex flex-col space-y-3 sm:space-y-4 mb-2 sm:mb-4 px-0">
          {/* Bible navigation controls */}
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

        {/* Reduced margins for Bible content to maximize reading space */}
        <div className="parchment-container animate-fade-in card-shadow px-0 mx-0 w-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-ancient-gold" />
            </div>
          ) : chapter ? (
            <BibleChapter 
              chapter={chapter} 
              scrollToVerse={scrollToVerse} 
              onVerseAction={onVerseAction}
              isVerseSelected={isVerseSelected}
              fontSize={fontSize}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center p-4">
              <div className="w-16 h-16 bg-parchment-dark/20 rounded-full flex items-center justify-center mb-4">
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

        <ChapterNavigation 
          chapterNumber={chapterNumber}
          onPreviousChapter={handlePreviousChapter}
          onNextChapter={handleNextChapter}
        />
      </div>
    </PageLayout>
  );
};

export default Read;
