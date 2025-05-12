
import { useState, useEffect } from 'react';
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
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
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
  const { t, language } = useLanguage();
  
  const handleBookChange = (value: string) => {
    onBookChange(value);
  };
  
  const handleVersionChange = async (value: string) => {
    onVersionChange(value);
    
    // Save user's preferred version
    try {
      // Get current user profile
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
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* Version selector */}
      <Select value={versionId} onValueChange={handleVersionChange}>
        <SelectTrigger className="w-full border-parchment-darker/30 bg-parchment-light/90 h-12 rounded-xl shadow-sm" aria-label="Select version">
          <SelectValue placeholder="Select Version">
            {versions.find(v => v.id === versionId)?.name || versionId}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
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
            <SelectTrigger className="border-parchment-darker/30 bg-parchment-light/90 h-12 rounded-xl shadow-sm" aria-label="Select book">
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
            onValueChange={value => onChapterChange(parseInt(value))}
            disabled={!bookId}
          >
            <SelectTrigger className="border-parchment-darker/30 bg-parchment-light/90 h-12 rounded-xl shadow-sm" aria-label="Select chapter">
              <SelectValue placeholder={t('bible.selectChapter')}>
                {chapterNumber ? `${t('bible.chapter')} ${chapterNumber}` : t('bible.selectChapter')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {bookId && books.find(b => b.book_id === bookId)?.chapters_count && 
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
        
        <FontSizeControl onFontSizeChange={onFontSizeChange} />
      </div>
    </div>
  );
};

export default ReadingControls;
