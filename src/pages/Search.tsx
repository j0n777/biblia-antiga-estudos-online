
import { useState, useCallback, useRef, useEffect } from 'react';
import { Search as SearchIcon, Loader2, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BibleVerse } from '@/types/bible.types';
import { searchBibleVerses } from '@/services/bible';
import { useLanguage } from '@/contexts/LanguageContext';
import PageLayout from '@/components/layout/PageLayout';
import BibleVerseComponent from '@/components/bible/BibleVerse';
import { getUserProfile } from '@/services/ProfileService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [preferredVersion, setPreferredVersion] = useState<string>('kja');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchTimeoutRef = useRef<number | null>(null);
  const isSearchingRef = useRef<boolean>(false);
  const { t } = useLanguage();
  
  // Popular search suggestions
  const searchSuggestions = [
    'amor', 'paz', 'esperança', 'fé', 'perdão', 'graça', 'João 3:16'
  ];

  // Load user's preferred Bible version and search history
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const userProfile = await getUserProfile();
        if (userProfile && userProfile.preferred_bible_version) {
          setPreferredVersion(userProfile.preferred_bible_version);
        }
        
        // Load search history from localStorage
        const savedSearchHistory = localStorage.getItem('searchHistory');
        if (savedSearchHistory) {
          setSearchHistory(JSON.parse(savedSearchHistory));
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    };
    
    loadUserPreferences();
  }, []);
  
  // Save search history to localStorage
  const saveSearchToHistory = (query: string) => {
    if (query.trim().length < 2) return;
    
    setSearchHistory(prevHistory => {
      // Remove duplicate if it exists
      const filteredHistory = prevHistory.filter(item => item.toLowerCase() !== query.toLowerCase());
      // Add new search to the beginning and limit to 5 items
      const newHistory = [query, ...filteredHistory].slice(0, 5);
      // Save to localStorage
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleSearch = useCallback(async (query: string) => {
    // Skip if already searching or query is too short
    if (isSearchingRef.current || query.trim().length < 2) {
      return;
    }
    
    // Set searching status
    isSearchingRef.current = true;
    setIsSearching(true);
    
    try {
      // Call searchBibleVerses with only the query parameter
      const results = await searchBibleVerses(query, preferredVersion);
      setSearchResults(results);
      setHasSearched(true);
      
      // Add to search history
      saveSearchToHistory(query);
    } catch (error) {
      console.error('Error searching Bible verses:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      isSearchingRef.current = false;
    }
  }, [preferredVersion]);

  // Handle input change with debounce
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }
    
    // Don't search for very short queries
    if (query.trim().length < 2) {
      return;
    }
    
    // Set a new timeout to debounce search
    const timeoutId = window.setTimeout(() => {
      handleSearch(query);
    }, 500); // 500ms debounce
    
    searchTimeoutRef.current = timeoutId;
  }, [handleSearch]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchClick = () => {
    handleSearch(searchQuery);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };
  
  const handleHistoryItemClick = (query: string) => {
    setSearchQuery(query);
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
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input
                    placeholder={t('search.placeholder') || 'Digite uma referência (João 3:16) ou termo...'}
                    value={searchQuery}
                    onChange={handleInputChange}
                    className="bg-parchment-light border-parchment-dark/20 pr-10 rounded-lg"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Button 
                  onClick={handleSearchClick}
                  disabled={isSearching || searchQuery.trim().length < 2}
                  className="bg-ancient-gold hover:bg-ancient-gold/90 rounded-lg"
                >
                  <SearchIcon className="h-4 w-4 mr-2" />
                  {t('search.button') || 'Buscar'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t('search.tip') || 'Dica: Você pode pesquisar por referência (ex: "João 3:16") ou por palavras.'}
              </p>
            </div>
            
            {/* Search suggestions */}
            {!hasSearched && (
              <div className="mb-3">
                <h3 className="text-sm font-medium text-scripture-heading mb-2">Sugestões de busca:</h3>
                <div className="flex flex-wrap gap-2">
                  {searchSuggestions.map(suggestion => (
                    <Badge 
                      key={suggestion}
                      variant="outline" 
                      className="bg-parchment-dark/10 hover:bg-parchment-dark/20 cursor-pointer rounded-lg border-parchment-dark/20"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Recent searches */}
            {searchHistory.length > 0 && !hasSearched && (
              <div>
                <h3 className="text-sm font-medium text-scripture-heading mb-2 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-ancient-gold" />
                  Pesquisas recentes:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((historyItem, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="bg-parchment-dark/5 hover:bg-parchment-dark/10 cursor-pointer rounded-lg border-parchment-dark/10 text-scripture-text/80"
                      onClick={() => handleHistoryItemClick(historyItem)}
                    >
                      {historyItem}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="parchment-container card-shadow rounded-lg">
          {isSearching ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-ancient-gold" />
              <span className="ml-2">{t('search.searching') || 'Pesquisando...'}</span>
            </div>
          ) : hasSearched ? (
            searchResults.length > 0 ? (
              <div className="space-y-4 p-4">
                <h2 className="text-lg font-semibold">
                  {t('search.resultsCount', { count: searchResults.length }) || `${searchResults.length} resultados encontrados`}
                </h2>
                {searchResults.map((verse) => (
                  <div key={verse.id} className="border-b border-parchment-dark/10 pb-3 mb-3 last:border-b-0">
                    <div className="font-semibold mb-1 text-scripture-heading">
                      {verse.book_name} {verse.chapter_number}:{verse.verse_number}
                    </div>
                    <BibleVerseComponent verse={verse} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-parchment-dark/20 rounded-lg flex items-center justify-center mb-4">
                  <SearchIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-scripture-heading font-medium mb-2">
                  {t('search.noResults') || 'Nenhum resultado encontrado'}
                </p>
                <p className="text-sm text-muted-foreground max-w-md">
                  {t('search.tryAnotherTerm') || 'Tente outros termos ou formas de escrita diferentes.'}
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-parchment-dark/20 rounded-lg flex items-center justify-center mb-4">
                <SearchIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-scripture-heading font-medium mb-2">
                {t('search.initial') || 'Digite uma palavra ou referência para buscar na Bíblia'}
              </p>
              <p className="text-sm text-muted-foreground max-w-md">
                {t('search.examples') || 'Exemplos: "amor", "João 3:16", "pão"'}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Search;
