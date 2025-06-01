
import { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BibleBook, BibleVersion } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';
import FontSizeControl from './FontSizeControl';
import { getUserProfile, updateUserProfile } from '@/services/ProfileService';
import { ChevronDown } from 'lucide-react';

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
  compact?: boolean;
  showOnlySelectors?: boolean;
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
  onFontSizeChange,
  compact = false,
  showOnlySelectors = false
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

  // Compact version for header
  if (compact) {
    return (
      <Select value={versionId} onValueChange={handleVersionChange}>
        <SelectTrigger 
          className="w-auto min-w-[200px] h-9 bg-bible-controls border border-gray-300 rounded-xl shadow-sm text-sm"
          style={{ borderRadius: '0.75rem !important' }}
        >
          <SelectValue>
            <span className="text-bible-title font-medium">{versionDisplayText}</span>
          </SelectValue>
          <ChevronDown className="h-4 w-4 text-bible-title" />
        </SelectTrigger>
        <SelectContent className="bg-bible-controls border border-gray-300 rounded-xl shadow-lg">
          {versions.map((version) => (
            <SelectItem key={version.id} value={version.id} className="text-sm">
              <div className="flex flex-col">
                <span className="font-medium text-bible-title">{version.name}</span>
                <span className="text-xs text-bible-subtitle">{version.language_name || version.language}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Only selectors version (for book, chapter, font size)
  if (showOnlySelectors) {
    return (
      <div className="flex gap-2">
        {/* Book selector */}
        <div className="flex-1">
          <Select value={bookId} onValueChange={handleBookChange}>
            <SelectTrigger 
              className="h-11 bg-bible-controls border border-gray-300 rounded-xl shadow-sm"
              style={{ borderRadius: '0.75rem !important' }}
            >
              <SelectValue>
                <span className="text-bible-title font-medium">
                  {books.find(b => b.book_id === bookId)?.name || 'Livro'}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bible-controls border border-gray-300 rounded-xl shadow-lg max-h-[300px]">
              <SelectGroup>
                <SelectLabel className="font-bold text-bible-title">
                  Antigo Testamento
                </SelectLabel>
                {books
                  .filter(book => book.testament === 'old')
                  .map(book => (
                    <SelectItem key={book.book_id} value={book.book_id}>
                      <span className="text-bible-title">{book.name}</span>
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="font-bold text-bible-title">
                  Novo Testamento
                </SelectLabel>
                {books
                  .filter(book => book.testament === 'new')
                  .map(book => (
                    <SelectItem key={book.book_id} value={book.book_id}>
                      <span className="text-bible-title">{book.name}</span>
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Chapter selector */}
        <div className="w-20">
          <Select 
            value={chapterNumber.toString()} 
            onValueChange={handleChapterChange}
            disabled={!bookId}
          >
            <SelectTrigger 
              className="h-11 bg-bible-controls border border-gray-300 rounded-xl shadow-sm"
              style={{ borderRadius: '0.75rem !important' }}
            >
              <SelectValue>
                <span className="text-bible-title font-medium">{chapterNumber}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bible-controls border border-gray-300 rounded-xl shadow-lg max-h-[200px]">
              {bookId && books.find(b => b.book_id === bookId)?.chapters_count && 
                Array.from(
                  { length: books.find(b => b.book_id === bookId)?.chapters_count || 0 },
                  (_, i) => i + 1
                ).map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    <span className="text-bible-title">{num}</span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font size control */}
        <div className="w-12">
          <FontSizeControl onFontSizeChange={handleFontSizeChange} />
        </div>
      </div>
    );
  }

  // Full controls version
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mx-4 mb-6 shadow-sm border border-amber-100">
      <div className="space-y-6">
        {/* Idioma */}
        <div>
          <label className="block text-base font-medium text-gray-800 mb-3">
            Idioma
          </label>
          <Select value={versionId} onValueChange={handleVersionChange}>
            <SelectTrigger className="w-full h-14 bg-white border border-gray-200 rounded-xl shadow-sm text-base">
              <SelectValue>
                <span className="text-gray-800">{versionDisplayText}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
              {versions.map((version) => (
                <SelectItem key={version.id} value={version.id}>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{version.name}</span>
                    <span className="text-sm text-gray-500">{version.language_name || version.language}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Livros */}
        <div>
          <label className="block text-base font-medium text-gray-800 mb-3">
            Livros
          </label>
          <Select value={bookId} onValueChange={handleBookChange}>
            <SelectTrigger className="w-full h-14 bg-white border border-gray-200 rounded-xl shadow-sm text-base">
              <SelectValue>
                <span className="text-gray-800">
                  {books.find(b => b.book_id === bookId)?.name || 'Selecionar Livro'}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-[400px]">
              <SelectGroup>
                <SelectLabel className="font-bold text-amber-800 text-base">
                  Antigo Testamento
                </SelectLabel>
                {books
                  .filter(book => book.testament === 'old')
                  .map(book => (
                    <SelectItem key={book.book_id} value={book.book_id}>
                      <span className="text-gray-800">{book.name}</span>
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="font-bold text-amber-800 text-base">
                  Novo Testamento
                </SelectLabel>
                {books
                  .filter(book => book.testament === 'new')
                  .map(book => (
                    <SelectItem key={book.book_id} value={book.book_id}>
                      <span className="text-gray-800">{book.name}</span>
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Cap. */}
        <div>
          <label className="block text-base font-medium text-gray-800 mb-3">
            Cap.
          </label>
          <Select 
            value={chapterNumber.toString()} 
            onValueChange={handleChapterChange}
            disabled={!bookId}
          >
            <SelectTrigger className="w-full h-14 bg-white border border-gray-200 rounded-xl shadow-sm text-base">
              <SelectValue>
                <span className="text-gray-800">{chapterNumber}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-[300px]">
              {bookId && books.find(b => b.book_id === bookId)?.chapters_count && 
                Array.from(
                  { length: books.find(b => b.book_id === bookId)?.chapters_count || 0 },
                  (_, i) => i + 1
                ).map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    <span className="text-gray-800">{num}</span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Tamanho da Fonte */}
        <div>
          <label className="block text-base font-medium text-gray-800 mb-3">
            Tamanho da Fonte
          </label>
          <FontSizeControl onFontSizeChange={handleFontSizeChange} />
        </div>
      </div>
    </div>
  );
};

export default ReadingControls;
