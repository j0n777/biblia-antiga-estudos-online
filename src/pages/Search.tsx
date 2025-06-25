
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
import { Search as SearchIcon } from 'lucide-react';
import { SearchResult } from '@/types/bible.types';

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

  const suggestionsList = ["amor", "paz", "salvação", "fé", "esperança", "João 3:16", "Romanos 8:28", "Salmo 23", "Filipenses 4:13"];

  // Convert BibleVerse[] to SearchResult[] to match the expected interface
  const formattedSearchResults: SearchResult[] = searchResults.map(verse => ({
    book_id: verse.book_id || '',
    book_name: verse.book_name || '',
    chapter_number: verse.chapter_number || 0,
    verse_number: verse.verse_number,
    text: verse.text,
    version_id: verse.version_id || ''
  }));

  return (
    <PageLayout>
      {/* Header with consistent styling */}
      <div className="page-header">
        <div className="flex items-center gap-2 py-[12px] px-[16px]">
          <SearchIcon size={24} className="text-ancient-gold" />
          <h1 className="text-2xl font-oldstyle text-scripture-heading">
            {t('nav.search') || 'Buscar na Bíblia'}
          </h1>
        </div>
      </div>
      
      {/* Content in styled box with consistent margins */}
      <div className="page-content">
        <div className="content-box" style={{ backgroundColor: '#f8f5ea', border: '1px solid rgba(156, 142, 99, 0.25)', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(92, 63, 23, 0.06)' }}>
          <div className="py-[12px] px-[16px]">
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
                results={formattedSearchResults}
                isLoading={isSearching}
                searchTerm={query}
                onVerseClick={handleVerseClick}
              />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Search;
