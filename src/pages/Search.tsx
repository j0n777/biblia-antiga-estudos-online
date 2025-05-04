
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Book, Users, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchBibleVerses } from '@/services/BibleDataService';
import { searchBibleStudies, getUserStudyProgress } from '@/services/BibleStudyService';
import { BibleVerse as BibleVerseType, BibleStudy, UserStudyProgress } from '@/types/bible.types';
import PageLayout from '@/components/layout/PageLayout';
import BibleVerseComponent from '@/components/bible/BibleVerse';
import BibleStudyCard from '@/components/studies/BibleStudyCard';
import BibleStudyDialog from '@/components/studies/BibleStudyDialog';
import { useLanguage } from '@/contexts/LanguageContext';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTab = searchParams.get('tab') || 'verses';
  
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchResults, setSearchResults] = useState<BibleVerseType[]>([]);
  const [studyResults, setStudyResults] = useState<BibleStudy[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<BibleStudy | null>(null);
  const [userProgress, setUserProgress] = useState<UserStudyProgress[]>([]);
  
  const { t, language } = useLanguage();
  
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
    loadUserProgress();
  }, [initialQuery, language]);
  
  const loadUserProgress = async () => {
    const progress = await getUserStudyProgress();
    setUserProgress(progress);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    
    // Update URL
    setSearchParams({ q: query, tab: activeTab });
  };
  
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      if (activeTab === 'verses') {
        const results = await searchBibleVerses(searchQuery);
        setSearchResults(results);
      } else if (activeTab === 'studies') {
        const results = await searchBibleStudies(searchQuery);
        setStudyResults(results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ q: query, tab: value });
    
    if (query.trim()) {
      performSearch(query);
    }
  };
  
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setStudyResults([]);
    setSearchParams({});
  };
  
  const handleStudySelect = (study: BibleStudy) => {
    setSelectedStudy(study);
  };
  
  const isStudyCompleted = (studyId: string) => {
    return userProgress.some(progress => 
      progress.study_id === studyId && progress.completed_at
    );
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">{t('nav.search')}</h1>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('common.search')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 pr-10"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button type="submit" className="ml-2">
              {t('common.search')}
            </Button>
          </div>
        </form>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="verses" className="flex items-center">
              <Book className="mr-2 h-4 w-4" />
              <span>{t('bible.verse')}</span>
            </TabsTrigger>
            <TabsTrigger value="studies" className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              <span>{t('studies.title')}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="verses" className="mt-4">
            {isSearching ? (
              <div className="text-center py-8">
                {t('common.loading')}...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((verse) => (
                  <div key={verse.id} className="border rounded-md p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      {verse.book_id} {verse.chapter_number}:{verse.verse_number}
                    </div>
                    <BibleVerseComponent verse={verse} />
                  </div>
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-8">
                Nenhum resultado encontrado.
              </div>
            ) : null}
          </TabsContent>
          
          <TabsContent value="studies" className="mt-4">
            {isSearching ? (
              <div className="text-center py-8">
                {t('common.loading')}...
              </div>
            ) : studyResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyResults.map((study) => (
                  <BibleStudyCard
                    key={study.id} 
                    study={study} 
                    isCompleted={isStudyCompleted(study.id)}
                    onSelectStudy={() => handleStudySelect(study)}
                  />
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-8">
                Nenhum estudo encontrado.
              </div>
            ) : null}
          </TabsContent>
        </Tabs>
        
        {selectedStudy && (
          <BibleStudyDialog 
            study={selectedStudy} 
            open={!!selectedStudy}
            onOpenChange={() => setSelectedStudy(null)}
            onComplete={loadUserProgress}
            isCompleted={isStudyCompleted(selectedStudy.id)}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Search;
