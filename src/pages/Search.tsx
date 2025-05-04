
import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchBibleVerses } from '@/services/BibleDataService';
import { BibleVerse } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { getAllBibleStudies, getUserCompletedStudies } from '@/services/BibleStudyService';
import BibleStudyCard from '@/components/studies/BibleStudyCard';
import { Separator } from '@/components/ui/separator';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [activeTab, setActiveTab] = useState('verses');
  const [studies, setStudies] = useState<any[]>([]);
  const [completedStudyIds, setCompletedStudyIds] = useState<string[]>([]);
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    const loadBibleStudies = async () => {
      const studiesData = await getAllBibleStudies(currentLanguage);
      setStudies(studiesData);
      
      // Get user's completed studies
      const completedStudies = await getUserCompletedStudies();
      // Extract just the study_id values into an array
      const completedIds = completedStudies.map(study => study.study_id);
      setCompletedStudyIds(completedIds);
    };
    
    loadBibleStudies();
  }, [currentLanguage]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchBibleVerses(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setActiveTab('studies'); // Switch to studies tab if no verse results
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getVerseReference = (verse: BibleVerse) => {
    return `${verse.book_id} ${verse.chapter_number}:${verse.verse_number}`;
  };

  return (
    <PageLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4">{t('search.title')}</h1>
        
        <div className="flex gap-2 mb-6">
          <Input
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? t('loading') : <SearchIcon className="h-4 w-4" />}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="verses">{t('search.verses')}</TabsTrigger>
            <TabsTrigger value="studies">{t('search.studies')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="verses" className="mt-4">
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((verse) => (
                  <Card key={verse.id}>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">
                        <Link 
                          to={`/read?book=${verse.book_id}&chapter=${verse.chapter_number}&verse=${verse.verse_number}`}
                          className="text-ancient-brown hover:text-ancient-gold transition-colors"
                        >
                          {getVerseReference(verse)}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p>{verse.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              searchQuery && !isSearching && (
                <div className="text-center py-8">
                  <p>{t('search.noResults')}</p>
                </div>
              )
            )}
          </TabsContent>
          
          <TabsContent value="studies" className="mt-4 space-y-6">
            {/* Bible Studies */}
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('search.bibleStudies')}</h2>
              
              {studies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studies.map((study) => (
                    <BibleStudyCard 
                      key={study.id} 
                      study={study} 
                      isCompleted={completedStudyIds.includes(study.id)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>{t('search.noStudies')}</p>
                </div>
              )}
            </div>
            
            <Separator className="my-8" />
            
            {/* Additional search categories can be added here */}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Search;
