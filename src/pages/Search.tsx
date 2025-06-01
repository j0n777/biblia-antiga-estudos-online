
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import SearchInput from '@/components/search/SearchInput';
import SearchResults from '@/components/search/SearchResults';
import SearchHistory from '@/components/search/SearchHistory';
import SearchSuggestions from '@/components/search/SearchSuggestions';
import { useSearchBible } from '@/hooks/useSearchBible';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackSearchClick } from '@/services/reading/ReadingHistoryService';
import { getUserProfile } from '@/services/ProfileService';
import { determineBestBibleVersion } from '@/utils/language-utils';

const Search = () => {
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const {
    results,
    isLoading,
    error,
    searchHistory,
    clearHistory,
    handleSearch: performSearch
  } = useSearchBible();

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setShowHistory(false);
    performSearch(searchQuery);
  };

  const handleVerseClick = async (bookId: string, chapterNumber: number, verseNumber: number) => {
    try {
      // Get user's preferred Bible version for tracking
      const userProfile = await getUserProfile();
      const versionId = determineBestBibleVersion(userProfile, language);
      
      // Track the search click
      await trackSearchClick(versionId, bookId, chapterNumber, verseNumber);
      
      // Navigate to the verse
      navigate(`/read?book=${bookId}&chapter=${chapterNumber}&verse=${verseNumber}`);
    } catch (error) {
      console.error('Error tracking search click:', error);
      // Still navigate even if tracking fails
      navigate(`/read?book=${bookId}&chapter=${chapterNumber}&verse=${verseNumber}`);
    }
  };

  const handleInputFocus = () => {
    if (!query) {
      setShowHistory(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding to allow clicking on history items
    setTimeout(() => setShowHistory(false), 200);
  };

  return (
    <PageLayout>
      <div className="py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-oldstyle text-scripture-heading mb-6 text-center">
            {t('nav.search') || 'Buscar na Bíblia'}
          </h1>
          
          <div className="relative mb-6">
            <SearchInput
              value={query}
              onChange={setQuery}
              onSearch={handleSearch}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={t('search.placeholder') || 'Digite uma palavra, versículo ou referência...'}
            />
            
            {showHistory && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1">
                <SearchHistory
                  history={searchHistory}
                  onItemClick={handleSearch}
                  onClear={clearHistory}
                />
              </div>
            )}
          </div>

          {!query && !showHistory && (
            <SearchSuggestions onSuggestionClick={handleSearch} />
          )}

          {query && (
            <SearchResults
              results={results}
              isLoading={isLoading}
              error={error}
              query={query}
              onVerseClick={handleVerseClick}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Search;
