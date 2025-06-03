
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
    searchResults,
    isSearching,
    error,
    searchHistory,
    clearHistory,
    handleSearch: performSearch,
    totalResults,
    hasMoreResults,
    loadMore,
    wholeWordsOnly,
    toggleWholeWordsOnly
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

  const suggestionsList = [
    "amor", "paz", "salvação", "fé", "esperança", 
    "João 3:16", "Romanos 8:28", "Salmo 23", "Filipenses 4:13"
  ];

  return (
    <PageLayout>
      {/* Header with consistent styling */}
      <div className="page-header">
        <h1 className="page-title text-center">
          {t('nav.search') || 'Buscar na Bíblia'}
        </h1>
      </div>
      
      {/* Content in styled box with consistent margins */}
      <div className="page-content">
        <div className="content-box">
          <div className="relative mb-6">
            <SearchInput
              searchQuery={query}
              isSearching={isSearching}
              onInputChange={(e) => setQuery(e.target.value)}
              onSearchClick={() => handleSearch(query)}
              placeholder={t('search.placeholder') || 'Digite uma palavra, versículo ou referência...'}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            
            {showHistory && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1">
                <SearchHistory
                  searchHistory={searchHistory}
                  onHistoryItemClick={handleSearch}
                  onClear={clearHistory}
                />
              </div>
            )}
          </div>

          {!query && !showHistory && (
            <SearchSuggestions 
              suggestions={suggestionsList} 
              onSuggestionClick={handleSearch} 
            />
          )}

          {query && (
            <SearchResults
              isSearching={isSearching}
              hasSearched={!!query}
              searchResults={searchResults}
              totalResults={totalResults || searchResults.length}
              hasMoreResults={hasMoreResults}
              onLoadMore={loadMore}
              wholeWordsOnly={wholeWordsOnly}
              onToggleWholeWords={toggleWholeWordsOnly}
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
