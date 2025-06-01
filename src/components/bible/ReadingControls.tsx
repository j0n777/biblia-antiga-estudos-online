
import { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BibleBook, BibleVersion } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';
import FontSizeControl from './FontSizeControl';
import { getUserProfile, updateUserProfile } from '@/services/ProfileService';

interface ReadingControlsProps {
  books: BibleBook[];
  versions: BibleVersion[];
  bookId: string;
  chapterNumber: number;
  versionId: string;
  onBookChange: (bookId: string) => void;
  onChapterChange: (chapter: number) => void;
  onVersionChange: (version: string) => void;
  onFontSizeChange: (size: 'large' | 'extra-large' | 'huge') => void;
}

const ReadingControls = ({
  books,
  versions,
  bookId,
  chapterNumber,
  versionId,
  onBookChange,
  onChapterChange,
  onVersionChange,
  onFontSizeChange
}: ReadingControlsProps) => {
  const { t } = useLanguage();
  const [userFontSize, setUserFontSize] = useState<'large' | 'extra-large' | 'huge'>('large');
  
  useEffect(() => {
    const loadUserFontSize = async () => {
      try {
        const profile = await getUserProfile();
        const fontSize = profile.font_size;
        if (fontSize && ['large', 'extra-large', 'huge'].includes(fontSize)) {
          setUserFontSize(fontSize as 'large' | 'extra-large' | 'huge');
          onFontSizeChange(fontSize as 'large' | 'extra-large' | 'huge');
        }
      } catch (error) {
        console.error('Error loading user font size:', error);
      }
    };
    
    loadUserFontSize();
  }, [onFontSizeChange]);
  
  const handleBookChange = useCallback((value: string) => {
    if (value !== bookId) {
      onBookChange(value);
    }
  }, [bookId, onBookChange]);
  
  const handleChapterChange = useCallback((value: string) => {
    const chapterNum = parseInt(value, 10);
    if (chapterNum !== chapterNumber) {
      onChapterChange(chapterNum);
    }
  }, [chapterNumber, onChapterChange]);
  
  const handleVersionChange = useCallback(async (value: string) => {
    if (value !== versionId) {
      onVersionChange(value);
      
      try {
        const userProfile = await getUserProfile();
        
        if (userProfile.preferred_bible_version !== value) {
          if (!userProfile.id.startsWith('guest-')) {
            await updateUserProfile({
              preferred_bible_version: value
            });
          } else {
            const guestProfile = {
              ...userProfile,
              preferred_bible_version: value
            };
            localStorage.setItem('guestProfile', JSON.stringify(guestProfile));
          }
        }
      } catch (error) {
        console.error('Error saving preferred Bible version:', error);
      }
    }
  }, [versionId, onVersionChange]);

  const handleFontSizeChange = useCallback(async (size: 'large' | 'extra-large' | 'huge') => {
    if (size !== userFontSize) {
      setUserFontSize(size);
      onFontSizeChange(size);
      
      try {
        await updateUserProfile({
          font_size: size
        });
      } catch (error) {
        console.error('Error saving font size:', error);
      }
    }
  }, [userFontSize, onFontSizeChange]);

  // Get current version with language info
  const currentVersion = versions.find(v => v.id === versionId);
  const versionDisplayText = currentVersion 
    ? `${currentVersion.name} (${currentVersion.language_name || currentVersion.language})`
    : versionId;

  return (
    <div className="space-y-4">
      {/* Version selector with language info */}
      <div>
        <label className="block text-sm font-medium text-scripture-text mb-2">
          {t('settings.language') || 'Versão da Bíblia'}
        </label>
        <Select value={versionId} onValueChange={handleVersionChange}>
          <SelectTrigger className="w-full h-12 bg-white/80 dark:bg-parchment-light/80 border-2 border-parchment-dark/30 dark:border-parchment-darker/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <SelectValue>
              {versionDisplayText}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px] rounded-xl border-2 border-parchment-dark/30 dark:border-parchment-darker/40 shadow-xl">
            {versions.map((version) => (
              <SelectItem key={version.id} value={version.id} className="rounded-lg">
                <div className="flex flex-col">
                  <span className="font-medium">{version.name}</span>
                  <span className="text-xs text-muted-foreground">{version.language_name || version.language}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Book, chapter and font size controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Book selector */}
        <div>
          <label className="block text-sm font-medium text-scripture-text mb-2">
            {t('bible.book') || 'Livro'}
          </label>
          <Select value={bookId} onValueChange={handleBookChange}>
            <SelectTrigger className="h-12 bg-white/80 dark:bg-parchment-light/80 border-2 border-parchment-dark/30 dark:border-parchment-darker/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <SelectValue>
                {books.find(b => b.book_id === bookId)?.name || (t('bible.selectBook') || 'Selecionar Livro')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[400px] rounded-xl border-2 border-parchment-dark/30 dark:border-parchment-darker/40 shadow-xl">
              <SelectGroup>
                <SelectLabel className="font-oldstyle font-bold text-ancient-brown">
                  {t('bible.oldTestament') || 'Antigo Testamento'}
                </SelectLabel>
                {books
                  .filter(book => book.testament === 'old')
                  .map(book => (
                    <SelectItem key={book.book_id} value={book.book_id} className="rounded-lg">
                      {book.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="font-oldstyle font-bold text-ancient-brown">
                  {t('bible.newTestament') || 'Novo Testamento'}
                </SelectLabel>
                {books
                  .filter(book => book.testament === 'new')
                  .map(book => (
                    <SelectItem key={book.book_id} value={book.book_id} className="rounded-lg">
                      {book.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Chapter selector */}
        <div>
          <label className="block text-sm font-medium text-scripture-text mb-2">
            {t('bible.selectChapter') || 'Capítulo'}
          </label>
          <Select 
            value={chapterNumber.toString()} 
            onValueChange={handleChapterChange}
            disabled={!bookId}
          >
            <SelectTrigger className="h-12 bg-white/80 dark:bg-parchment-light/80 border-2 border-parchment-dark/30 dark:border-parchment-darker/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <SelectValue>
                {chapterNumber ? chapterNumber.toString() : (t('bible.selectChapter') || 'Cap.')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-xl border-2 border-parchment-dark/30 dark:border-parchment-darker/40 shadow-xl">
              {bookId && books.find(b => b.book_id === bookId)?.chapters_count && 
                Array.from(
                  { length: books.find(b => b.book_id === bookId)?.chapters_count || 0 },
                  (_, i) => i + 1
                ).map(num => (
                  <SelectItem key={num} value={num.toString()} className="rounded-lg">
                    {num}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Font size control */}
        <div>
          <label className="block text-sm font-medium text-scripture-text mb-2">
            {t('settings.fontSize') || 'Tamanho da Fonte'}
          </label>
          <FontSizeControl onFontSizeChange={handleFontSizeChange} />
        </div>
      </div>
    </div>
  );
};

export default ReadingControls;
