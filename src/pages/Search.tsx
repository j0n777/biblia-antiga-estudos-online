
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Book, BookOpen, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchBibleVerses } from '@/services/BibleDataService';
import { searchBibleStudies, getAllBibleStudies } from '@/services/bible-studies/StudyContentService';
import { getCompletedStudies } from '@/services/bible-studies/UserProgressService';
import { BibleVerse as BibleVerseType, BibleStudy } from '@/types/bible.types';
import PageLayout from '@/components/layout/PageLayout';
import BibleVerseComponent from '@/components/bible/BibleVerse';
import BibleStudyCard from '@/components/studies/BibleStudyCard';
import BibleStudyDialog from '@/components/studies/BibleStudyDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTab = searchParams.get('tab') || 'verses';
  
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchResults, setSearchResults] = useState<BibleVerseType[]>([]);
  const [studyResults, setStudyResults] = useState<BibleStudy[]>([]);
  const [allStudies, setAllStudies] = useState<BibleStudy[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudy, setSelectedStudy] = useState<BibleStudy | null>(null);
  const [completedStudyIds, setCompletedStudyIds] = useState<string[]>([]);
  
  const { t, language } = useLanguage();
  
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // Load all studies to display by default
        const studies = await getAllBibleStudies();
        setAllStudies(studies);
        
        // Load user completed studies
        const completed = await getCompletedStudies();
        setCompletedStudyIds(completed);
        
        // Perform search if there's an initial query
        if (initialQuery) {
          await performSearch(initialQuery);
        }
      } catch (error) {
        console.error("Error initializing search:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, [initialQuery, language]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    
    // Update URL
    setSearchParams({ q: query, tab: activeTab });
  };
  
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      if (activeTab === 'studies') {
        setStudyResults(allStudies); // Show all studies when no query
      }
      return;
    }
    
    setIsSearching(true);
    
    try {
      if (activeTab === 'verses') {
        // Método aprimorado para busca de versículos
        // Verificar se é uma busca direta por referência bíblica (e.g. "joão 3:16")
        const referenceMatch = searchQuery.match(/([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+)\s*(\d+)(?::(\d+))?/i);
        
        let results: BibleVerseType[] = [];
        
        if (referenceMatch) {
          // Busca por referência específica
          const [, book, chapter, verse] = referenceMatch;
          const chapterNum = parseInt(chapter, 10); // Fix: Convert string to number
          const { data, error } = await supabase
            .from('bible_verses')
            .select('*')
            .ilike('book_id', `%${book.trim().toLowerCase()}%`)
            .eq('chapter_number', chapterNum)
            .eq('version_id', language === 'en' ? 'kjv' : 'kja');
            
          if (verse) {
            // Se tiver versículo específico, filtrar
            results = (data || []).filter(v => v.verse_number === parseInt(verse)) as BibleVerseType[];
          } else {
            results = (data || []) as BibleVerseType[];
          }
        } else {
          // Busca por texto
          const { data, error } = await supabase
            .from('bible_verses')
            .select('*')
            .ilike('text', `%${searchQuery}%`)
            .eq('version_id', language === 'en' ? 'kjv' : 'kja')
            .limit(20);
    
          results = (data || []) as BibleVerseType[];
        }
        
        console.log("Search results:", results);
        setSearchResults(results);
      } else if (activeTab === 'studies') {
        const results = await searchBibleStudies(searchQuery);
        setStudyResults(results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setStudyResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ q: query, tab: value });
    
    if (query.trim()) {
      performSearch(query);
    } else if (value === 'studies') {
      // Show all studies when switching to studies tab with no query
      setStudyResults(allStudies);
    }
  };
  
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    
    // Show all studies when search is cleared
    setStudyResults(allStudies);
    setSearchParams({});
  };
  
  const handleStudySelect = (study: BibleStudy) => {
    setSelectedStudy(study);
  };
  
  const isStudyCompleted = (studyId: string) => {
    return completedStudyIds.includes(studyId);
  };
  
  // Should display studies even if no search
  const displayStudies = activeTab === 'studies' ? (query ? studyResults : allStudies) : [];

  // Function to reload user progress after completing a study
  const loadCompletedStudies = async () => {
    try {
      const completed = await getCompletedStudies();
      setCompletedStudyIds(completed);
    } catch (error) {
      console.error("Error loading completed studies:", error);
      toast({
        title: t('common.error'),
        description: t('studies.errorLoadingProgress'),
        variant: "destructive"
      });
    }
  };

  return (
    <PageLayout>
      <div className="py-6 px-2">
        <h1 className="text-2xl font-bold mb-6 font-oldstyle text-scripture-heading">{t('nav.search')}</h1>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('common.search')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-10 h-12 rounded-xl border-parchment-darker/30 bg-parchment-light/80"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button type="submit" className="ml-2 bg-ancient-brown hover:bg-ancient-brown/90 rounded-xl h-12 px-5">
              {t('common.search')}
            </Button>
          </div>
        </form>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 bg-parchment-light/80 p-1 rounded-lg">
            <TabsTrigger value="verses" className="flex items-center rounded-md data-[state=active]:bg-parchment">
              <Book className="mr-2 h-4 w-4" />
              <span>{t('bible.verses')}</span>
            </TabsTrigger>
            <TabsTrigger value="studies" className="flex items-center rounded-md data-[state=active]:bg-parchment">
              <BookOpen className="mr-2 h-4 w-4" />
              <span>{t('studies.title')}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="verses" className="mt-4 animate-fade-in">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-8 h-8 border-t-2 border-ancient-gold rounded-full animate-spin mb-2"></div>
                <p className="text-muted-foreground">{t('common.loading')}</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((verse) => (
                  <div key={verse.id} className="parchment-container rounded-xl overflow-hidden animate-slide-up elevated-card">
                    <div className="text-xs text-ancient-brown font-medium mb-1">
                      {/* Fix: Use book_id instead of book_name which doesn't exist on BibleVerse */}
                      {verse.book_id} {verse.chapter_number}:{verse.verse_number}
                    </div>
                    <BibleVerseComponent verse={verse} />
                  </div>
                ))}
              </div>
            ) : query ? (
              <div className="parchment-container py-12 rounded-xl text-center">
                <div className="mb-4">🔍</div>
                <p className="text-lg text-ancient-brown font-medium mb-1">{t('search.noResults')}</p>
                <p className="text-sm text-muted-foreground">{t('search.tryDifferentKeywords')}</p>
              </div>
            ) : null}
          </TabsContent>
          
          <TabsContent value="studies" className="mt-4 animate-fade-in">
            {isSearching || isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-8 h-8 border-t-2 border-ancient-gold rounded-full animate-spin mb-2"></div>
                <p className="text-muted-foreground">{t('common.loading')}</p>
              </div>
            ) : displayStudies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayStudies.map((study, index) => (
                  <BibleStudyCard
                    key={study.id}
                    study={study}
                    isCompleted={isStudyCompleted(study.id)}
                    onClick={() => handleStudySelect(study)}
                  />
                ))}
              </div>
            ) : query ? (
              <div className="parchment-container py-12 rounded-xl text-center">
                <div className="mb-4">📚</div>
                <p className="text-lg text-ancient-brown font-medium mb-1">{t('search.noResults')}</p>
                <p className="text-sm text-muted-foreground">{t('search.tryDifferentKeywords')}</p>
              </div>
            ) : (
              <div className="parchment-container py-12 rounded-xl text-center">
                <div className="mb-4">🔍</div>
                <p className="text-lg text-ancient-brown font-medium mb-1">{t('search.noStudiesAvailable')}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {selectedStudy && (
          <BibleStudyDialog 
            study={selectedStudy} 
            open={!!selectedStudy}
            onOpenChange={() => setSelectedStudy(null)}
            onComplete={loadCompletedStudies}
            isCompleted={isStudyCompleted(selectedStudy.id)}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Search;
