
import { useState, useCallback, useRef, useEffect } from 'react';
import { BibleVerse } from '@/types/bible.types';
import { searchBibleVerses, SearchResult } from '@/services/bible';
import { getUserProfile } from '@/services/ProfileService';
import { toast } from '@/hooks/use-toast';

export const useSearchBible = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [preferredVersion, setPreferredVersion] = useState<string>('kja');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [hasMoreResults, setHasMoreResults] = useState<boolean>(false);
  const [wholeWordsOnly, setWholeWordsOnly] = useState<boolean>(true);
  const isSearchingRef = useRef<boolean>(false);

  const pageSize = 10;

  // Load user preferences
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const userProfile = await getUserProfile();
        if (userProfile && userProfile.preferred_bible_version) {
          setPreferredVersion(userProfile.preferred_bible_version);
          console.log(`Loaded preferred version: ${userProfile.preferred_bible_version}`);
        } else {
          setPreferredVersion('kja');
          console.log('Using default version: kja');
        }
        
        // Load search history
        const savedSearchHistory = localStorage.getItem('searchHistory');
        if (savedSearchHistory) {
          setSearchHistory(JSON.parse(savedSearchHistory));
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
        setPreferredVersion('kja');
      }
    };
    
    loadUserPreferences();
  }, []);
  
  // Save search to history
  const saveSearchToHistory = (query: string) => {
    if (query.trim().length < 2) return;
    
    setSearchHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(item => item.toLowerCase() !== query.toLowerCase());
      const newHistory = [query, ...filteredHistory].slice(0, 5);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleSearch = useCallback(async (query: string, page: number = 1) => {
    // Prevent duplicate searches
    if (isSearchingRef.current || query.trim().length < 2) {
      console.log('Skipping search: already searching or query too short');
      return;
    }
    
    console.log('=== STARTING SEARCH PROCESS ===');
    console.log(`Query: "${query}", Page: ${page}`);
    console.log(`Preferred version: ${preferredVersion}`);
    
    // Set searching state
    isSearchingRef.current = true;
    setIsSearching(true);
    setSearchQuery(query);
    
    // Reset results only for new search (page 1)
    if (page === 1) {
      setHasSearched(false);
      setSearchResults([]);
      setCurrentPage(1);
    }
    
    try {
      console.log('Calling searchBibleVerses...');
      const result: SearchResult = await searchBibleVerses(query, preferredVersion, page, pageSize, wholeWordsOnly);
      
      console.log('=== SEARCH RESULTS ===');
      console.log(`Results count: ${result.verses.length}`);
      console.log(`Total results: ${result.totalCount}`);
      console.log(`Has more: ${result.hasMore}`);
      
      if (page === 1) {
        // New search - replace results
        setSearchResults(result.verses);
      } else {
        // Load more - append results
        setSearchResults(prev => [...prev, ...result.verses]);
      }
      
      setTotalResults(result.totalCount);
      setHasMoreResults(result.hasMore);
      setCurrentPage(page);
      setHasSearched(true);
      
      // Save to history and show toast for new searches
      if (page === 1) {
        if (result.totalCount > 0) {
          saveSearchToHistory(query);
          
          const resultVersions = [...new Set(result.verses.map(r => r.version_id).filter(Boolean))];
          const versionInfo = resultVersions.length > 0 ? ` (${resultVersions.join(', ')})` : '';
          
          toast({
            title: "Busca concluída",
            description: `${result.totalCount} versículo${result.totalCount > 1 ? 's' : ''} encontrado${result.totalCount > 1 ? 's' : ''}${versionInfo}`,
          });
        } else {
          toast({
            title: "Nenhum resultado",
            description: "Não foram encontrados versículos para esta busca. Tente outras palavras ou uma referência específica.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('=== SEARCH ERROR ===');
      console.error('Search failed:', error);
      setSearchResults([]);
      setHasSearched(true);
      
      toast({
        title: "Erro na busca",
        description: "Ocorreu um problema ao buscar. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
      isSearchingRef.current = false;
      console.log('=== SEARCH PROCESS COMPLETED ===');
    }
  }, [preferredVersion, wholeWordsOnly]);

  const handleLoadMore = useCallback(() => {
    if (!isSearching && hasMoreResults && searchQuery.trim().length >= 2) {
      handleSearch(searchQuery, currentPage + 1);
    }
  }, [isSearching, hasMoreResults, searchQuery, currentPage, handleSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  }, []);

  const toggleWholeWordsOnly = useCallback(() => {
    setWholeWordsOnly(prev => !prev);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    hasSearched,
    searchHistory,
    currentPage,
    totalResults,
    hasMoreResults,
    wholeWordsOnly,
    handleSearch,
    handleLoadMore,
    handleInputChange,
    toggleWholeWordsOnly
  };
};
