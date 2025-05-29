
import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchInput from '@/components/search/SearchInput';
import SearchSuggestions from '@/components/search/SearchSuggestions';
import SearchHistory from '@/components/search/SearchHistory';
import SearchResults from '@/components/search/SearchResults';
import BibleStudiesSection from '@/components/studies/BibleStudiesSection';
import BibleStudyDialog from '@/components/studies/BibleStudyDialog';
import { useSearchBible } from '@/hooks/useSearchBible';
import { BibleStudy } from '@/types/bible.types';

const Search = () => {
  const { t } = useLanguage();
  const [selectedStudy, setSelectedStudy] = useState<BibleStudy | null>(null);
  const [isStudyDialogOpen, setIsStudyDialogOpen] = useState(false);
  
  // Popular search suggestions - add more common search terms
  const searchSuggestions = [
    'amor', 'paz', 'esperança', 'fé', 'perdão', 'graça', 'Jesus', 'Deus', 'João 3:16'
  ];

  const {
    searchQuery,
    searchResults,
    isSearching,
    hasSearched,
    searchHistory,
    totalResults,
    hasMoreResults,
    wholeWordsOnly,
    handleSearch,
    handleLoadMore,
    handleInputChange,
    toggleWholeWordsOnly
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

  const handleStudyClick = (study: BibleStudy) => {
    setSelectedStudy(study);
    setIsStudyDialogOpen(true);
  };

  return (
    <PageLayout>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Main Search Card */}
        <Card className="bg-parchment-light/90 border-parchment-dark/20 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold font-oldstyle text-scripture-heading">
              {t('search.title') || 'Pesquisar na Bíblia'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Busque por qualquer palavra que apareça no texto dos versículos ou por referência específica (João 3:16).
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <SearchInput 
              searchQuery={searchQuery}
              isSearching={isSearching}
              onInputChange={handleInputChange}
              onSearchClick={handleSearchClick}
            />
            
            {/* Search suggestions and history - only show when not searching and no results */}
            {!hasSearched && !isSearching && (
              <div className="space-y-4">
                <SearchSuggestions
                  suggestions={searchSuggestions}
                  onSuggestionClick={handleSuggestionClick}
                />
                
                {searchHistory.length > 0 && (
                  <SearchHistory 
                    searchHistory={searchHistory}
                    onHistoryItemClick={handleHistoryItemClick}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Results Card - only show when searching or has searched */}
        {(isSearching || hasSearched) && (
          <Card className="bg-parchment-light/90 border-parchment-dark/20 rounded-xl">
            <CardContent className="p-0">
              <SearchResults
                isSearching={isSearching}
                hasSearched={hasSearched}
                searchResults={searchResults}
                totalResults={totalResults}
                hasMoreResults={hasMoreResults}
                onLoadMore={handleLoadMore}
                wholeWordsOnly={wholeWordsOnly}
                onToggleWholeWords={toggleWholeWordsOnly}
              />
            </CardContent>
          </Card>
        )}

        {/* Bible Studies Section - show when not searching or no results */}
        {(!hasSearched || (hasSearched && searchResults.length === 0)) && (
          <BibleStudiesSection onStudyClick={handleStudyClick} />
        )}

        {/* Bible Study Dialog */}
        {selectedStudy && (
          <BibleStudyDialog
            study={selectedStudy}
            open={isStudyDialogOpen}
            onOpenChange={setIsStudyDialogOpen}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Search;
