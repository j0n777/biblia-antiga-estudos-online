
import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchInput from '@/components/search/SearchInput';
import SearchSuggestions from '@/components/search/SearchSuggestions';
import SearchHistory from '@/components/search/SearchHistory';
import SearchResults from '@/components/search/SearchResults';
import { useSearchBible } from '@/hooks/useSearchBible';

const Search = () => {
  const { t } = useLanguage();
  
  // Popular search suggestions
  const searchSuggestions = [
    'amor', 'paz', 'esperança', 'fé', 'perdão', 'graça', 'João 3:16', 'Jesus'
  ];

  const {
    searchQuery,
    searchResults,
    isSearching,
    hasSearched,
    searchHistory,
    handleSearch,
    handleInputChange
  } = useSearchBible();

  const handleSearchClick = () => {
    if (searchQuery.trim().length >= 2) {
      handleSearch(searchQuery);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };
  
  const handleHistoryItemClick = (query: string) => {
    handleSearch(query);
  };

  return (
    <PageLayout>
      <div className="w-full max-w-3xl mx-auto">
        <Card className="bg-parchment-light/90 border-parchment-dark/20 rounded-lg mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold font-oldstyle text-scripture-heading">
              {t('search.title') || 'Pesquisar na Bíblia'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SearchInput 
              searchQuery={searchQuery}
              isSearching={isSearching}
              onInputChange={handleInputChange}
              onSearchClick={handleSearchClick}
            />
            
            {/* Search suggestions */}
            {!hasSearched && (
              <SearchSuggestions
                suggestions={searchSuggestions}
                onSuggestionClick={handleSuggestionClick}
              />
            )}
            
            {/* Recent searches */}
            {searchHistory.length > 0 && !hasSearched && (
              <SearchHistory 
                searchHistory={searchHistory}
                onHistoryItemClick={handleHistoryItemClick}
              />
            )}
          </CardContent>
        </Card>
        
        <div className="parchment-container card-shadow rounded-lg">
          <SearchResults
            isSearching={isSearching}
            hasSearched={hasSearched}
            searchResults={searchResults}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Search;
