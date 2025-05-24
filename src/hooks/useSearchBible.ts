
import { useState, useCallback, useRef, useEffect } from 'react';
import { BibleVerse } from '@/types/bible.types';
import { searchBibleVerses } from '@/services/bible';
import { getUserProfile } from '@/services/ProfileService';

export const useSearchBible = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [preferredVersion, setPreferredVersion] = useState<string>('kja');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const isSearchingRef = useRef<boolean>(false);

  // Load user's preferred Bible version and search history
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
        
        // Load search history from localStorage
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
      console.log('Skipping search: already searching or query too short');
      return;
    }
    
    // Set searching status
    isSearchingRef.current = true;
    setIsSearching(true);
    setSearchQuery(query); // Update the input field with the searched query
    setHasSearched(false); // Reset state for new search
    setSearchResults([]); // Clear previous results
    
    try {
      console.log(`=== STARTING SEARCH ===`);
      console.log(`Query: "${query}"`);
      console.log(`Version: ${preferredVersion}`);
      console.log(`Query length: ${query.length}`);
      
      // Call searchBibleVerses with query and preferred version
      const results = await searchBibleVerses(query, preferredVersion);
      
      console.log(`=== SEARCH COMPLETED ===`);
      console.log(`Results found: ${results.length}`);
      console.log('Results:', results);
      
      setSearchResults(results);
      setHasSearched(true);
      
      // Add to search history
      saveSearchToHistory(query);
    } catch (error) {
      console.error('=== SEARCH ERROR ===');
      console.error('Error searching Bible verses:', error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
      isSearchingRef.current = false;
    }
  }, [preferredVersion]);

  // Handle input change
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
