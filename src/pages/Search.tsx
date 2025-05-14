import { useState, useCallback, useRef, useEffect } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BibleVerse } from '@/types/bible.types';
import { searchBibleVerses } from '@/services/bible';
import { useLanguage } from '@/contexts/LanguageContext';
import PageLayout from '@/components/layout/PageLayout';
import BibleVerseComponent from '@/components/bible/BibleVerse';
import { getUserProfile } from '@/services/ProfileService';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [preferredVersion, setPreferredVersion] = useState<string>('kja');
  const searchTimeoutRef = useRef<number | null>(null);
  const isSearchingRef = useRef<boolean>(false);
  const { t } = useLanguage();

  // Load user's preferred Bible version
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const userProfile = await getUserProfile();
        if (userProfile && userProfile.preferred_bible_version) {
          setPreferredVersion(userProfile.preferred_bible_version);
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
        // Keep default version if error occurs
      }
    };

    loadUserPreferences();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    // Skip if already searching or query is too short
    if (isSearchingRef.current || query.trim().length < 2) {
      return;
    }
    
    // Set searching status
    isSearchingRef.current = true;
    setIsSearching(true);
    
    try {
      // Use the user's preferred version for search
      const results = await searchBibleVerses(query, preferredVersion);
      setSearchResults(results);
      setHasSearched(true);
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

  return (
    <PageLayout>
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 font-oldstyle text-scripture-heading">
          {t('search.title') || 'Pesquisar na Bíblia'}
        </h1>
        
        <div className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Input
                placeholder={t('search.placeholder') || 'Digite uma referência (João 3:16) ou termo...'}
                value={searchQuery}
                onChange={handleInputChange}
                className="bg-parchment-light/90 border-parchment-dark/20 pr-10"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            <Button 
              onClick={() => handleSearch(searchQuery)}
              disabled={isSearching || searchQuery.trim().length < 2}
              className="bg-ancient-gold hover:bg-ancient-gold/90"
            >
              <SearchIcon className="h-4 w-4 mr-2" />
              {t('search.button') || 'Buscar'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t('search.tip') || 'Dica: Você pode pesquisar por referência (ex: "João 3:16") ou por palavras.'}
          </p>
        </div>
        
        <div className="parchment-container card-shadow">
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
                <div className="w-16 h-16 bg-parchment-dark/20 rounded-full flex items-center justify-center mb-4">
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
              <div className="w-16 h-16 bg-parchment-dark/20 rounded-full flex items-center justify-center mb-4">
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
