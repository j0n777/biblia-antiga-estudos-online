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
  
  // Use memoized handlers to prevent rerendering
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
        // Save user's preferred version
        const userProfile = await getUserProfile();
        
        // Update preferred version
        if (userProfile.preferred_bible_version !== value) {
          // If we have a real user (not guest), update the database
          if (!userProfile.id.startsWith('guest-')) {
            await updateUserProfile({
              preferred_bible_version: value
            });
          } else {
            // For guest users, update localStorage
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

  return (
    <div className="flex flex-col space-y-3">
      {/* Version selector */}
      <Select value={versionId} onValueChange={handleVersionChange}>
        <SelectTrigger className="w-full border-parchment-darker/30 bg-parchment-light/90 h-12 rounded-xl shadow-sm" aria-label="Select version">
          <SelectValue placeholder="Select Version">
            {versions.find(v => v.id === versionId)?.name || versionId}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px] rounded-xl">
          {versions.map((version) => (
            <SelectItem key={version.id} value={version.id} className="rounded-lg">
              {version.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Book and chapter selector */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <Select value={bookId} onValueChange={handleBookChange}>
            <SelectTrigger className="border-parchment-darker/30 bg-parchment-light/90 h-12 rounded-xl shadow-sm" aria-label="Select book">
              <SelectValue placeholder={t('bible.selectBook') || 'Selecionar Livro'}>
                {books.find(b => b.book_id === bookId)?.name || (t('bible.selectBook') || 'Selecionar Livro')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[400px] rounded-xl">
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
        
        <div className="w-24">
          <Select 
            value={chapterNumber.toString()} 
            onValueChange={handleChapterChange}
            disabled={!bookId}
          >
            <SelectTrigger className="border-parchment-darker/30 bg-parchment-light/90 h-12 rounded-xl shadow-sm" aria-label="Select chapter">
              <SelectValue placeholder={t('bible.selectChapter') || 'Cap.'}>
                {chapterNumber ? chapterNumber.toString() : (t('bible.selectChapter') || 'Cap.')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-xl">
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
        
        <FontSizeControl onFontSizeChange={onFontSizeChange} />
      </div>
    </div>
  );
};

export default ReadingControls;
