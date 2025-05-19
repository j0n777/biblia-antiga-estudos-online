
import { useState, useCallback, useRef, useEffect } from 'react';
import { BibleVerse } from '@/types/bible.types';
import { searchBibleVerses } from '@/services/bible';
import { getUserProfile } from '@/services/ProfileService';

export const useSearchBible = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [preferredVersion, setPreferredVersion] = useState<string | undefined>(undefined);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchTimeoutRef = useRef<number | null>(null);
  const isSearchingRef = useRef<boolean>(false);

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
    setSearchQuery(query); // Update the input field with the searched query
    
    try {
      console.log(`Searching for "${query}" using version: ${preferredVersion || 'user default'}`);
      
      // Call searchBibleVerses with query and preferred version
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
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
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
