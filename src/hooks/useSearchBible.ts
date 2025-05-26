
import { useState, useCallback, useRef, useEffect } from 'react';
import { BibleVerse } from '@/types/bible.types';
import { searchBibleVerses } from '@/services/bible';
import { getUserProfile } from '@/services/ProfileService';
import { toast } from '@/components/ui/use-toast';

export const useSearchBible = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [preferredVersion, setPreferredVersion] = useState<string>('kja');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const isSearchingRef = useRef<boolean>(false);

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

  const handleSearch = useCallback(async (query: string) => {
    // Prevent duplicate searches
    if (isSearchingRef.current || query.trim().length < 2) {
      console.log('Skipping search: already searching or query too short');
      return;
    }
    
    console.log('=== STARTING SEARCH PROCESS ===');
    console.log(`Query: "${query}"`);
    console.log(`Preferred version: ${preferredVersion}`);
    
    // Set searching state
    isSearchingRef.current = true;
    setIsSearching(true);
    setSearchQuery(query);
    setHasSearched(false);
    setSearchResults([]);
    
    try {
      console.log('Calling searchBibleVerses...');
      const results = await searchBibleVerses(query, preferredVersion);
      
      console.log('=== SEARCH RESULTS ===');
      console.log(`Results count: ${results.length}`);
      console.log('Results:', results);
      
      setSearchResults(results);
      setHasSearched(true);
      
      // Save to history if we got results
      if (results.length > 0) {
        saveSearchToHistory(query);
        toast({
          title: "Busca concluída",
          description: `${results.length} versículo${results.length > 1 ? 's' : ''} encontrado${results.length > 1 ? 's' : ''}`,
        });
      } else {
        toast({
          title: "Nenhum resultado",
          description: "Tente outras palavras ou verifique a ortografia",
          variant: "destructive"
        });
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
  }, [preferredVersion]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    hasSearched,
    searchHistory,
    handleSearch,
    handleInputChange
  };
};
