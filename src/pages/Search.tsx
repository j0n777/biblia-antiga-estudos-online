
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon, BookOpen, GraduationCap } from 'lucide-react';
import { searchBibleVerses } from '@/services/BibleDataService';
import { BibleVerse } from '@/types/bible.types';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getAllBibleStudies, getUserCompletedStudies } from '@/services/BibleStudyService';
import BibleStudyCard from '@/components/studies/BibleStudyCard';
import BibleStudyDialog from '@/components/studies/BibleStudyDialog';
import { BibleStudy } from '@/types/bible.types';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('verses');
  const [studies, setStudies] = useState<BibleStudy[]>([]);
  const [completedStudies, setCompletedStudies] = useState<string[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<BibleStudy | null>(null);
  const [showStudyDialog, setShowStudyDialog] = useState(false);
  
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  
  // Check if a study ID is provided in the URL
  useEffect(() => {
    const studyId = searchParams.get('study');
    if (studyId) {
      setActiveTab('estudos');
      
      // Find the study and show it
      const loadStudy = async () => {
        const allStudies = await getAllBibleStudies();
        const study = allStudies.find(s => s.id === studyId);
        
        if (study) {
          setSelectedStudy(study);
          setShowStudyDialog(true);
        }
      };
      
      loadStudy();
    }
  }, [searchParams]);
  
  // Load Bible studies
  useEffect(() => {
    const loadStudies = async () => {
      const allStudies = await getAllBibleStudies();
      setStudies(allStudies);
      
      // Load completed studies
      const completed = await getUserCompletedStudies();
      setCompletedStudies(completed);
    };
    
    loadStudies();
  }, []);
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchBibleVerses(searchQuery);
      setSearchResults(results);
      setActiveTab('verses');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleReadVerse = (bookId: string, chapter: number, verse: number) => {
    navigate(`/read?book=${bookId}&chapter=${chapter}&verse=${verse}`);
  };
  
  const handleSelectStudy = (study: BibleStudy) => {
    setSelectedStudy(study);
    setShowStudyDialog(true);
  };
  
  const handleStudyCompleted = (studyId: string) => {
    if (!completedStudies.includes(studyId)) {
      setCompletedStudies([...completedStudies, studyId]);
    }
  };
  
  const isStudyCompleted = (studyId: string) => {
    return completedStudies.includes(studyId);
  };

  return (
    <PageLayout>
      <div className="py-6">
        <h1 className="text-2xl font-oldstyle text-scripture-heading mb-4 flex items-center">
          <SearchIcon size={24} className="mr-2" />
          {t('search.title')}
        </h1>

        <div className="flex w-full items-center space-x-2 mb-6">
          <Input
            type="search"
            placeholder={t('search.placeholder') || "Buscar na Bíblia..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            type="submit" 
            onClick={handleSearch} 
            disabled={isLoading}
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="verses" className="flex-1">
              <BookOpen className="mr-2 h-4 w-4" />
              {t('search.verses')}
            </TabsTrigger>
            <TabsTrigger value="estudos" className="flex-1">
              <GraduationCap className="mr-2 h-4 w-4" />
              {t('search.studies') || "Estudos"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="verses">
            <div className="space-y-2 mt-4">
              {searchResults.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchResults.length} {t('search.resultsFound')}
                  </p>
                  {searchResults.map((verse) => (
                    <Card key={verse.id} className="cursor-pointer hover:bg-parchment-light/80">
                      <CardContent className="p-3" onClick={() => handleReadVerse(verse.book_id!, verse.chapter_number!, verse.verse_number)}>
                        <div className="font-semibold mb-1 text-ancient-brown">
                          {verse.book_id} {verse.chapter_number}:{verse.verse_number}
                        </div>
                        <p className="text-sm">{verse.text}</p>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? (
                    <p>{t('search.noResults')}</p>
                  ) : (
                    <p>{t('search.enterQuery')}</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="estudos">
            <div className="grid gap-4 mt-4 sm:grid-cols-2">
              {studies.map((study) => (
                <BibleStudyCard 
                  key={study.id}
                  study={study}
                  isCompleted={isStudyCompleted(study.id)}
                  onSelectStudy={handleSelectStudy}
                />
              ))}
              
              {studies.length === 0 && (
                <div className="text-center py-8 text-muted-foreground col-span-2">
                  <p>{t('search.noStudiesAvailable') || "Nenhum estudo disponível"}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BibleStudyDialog 
        study={selectedStudy}
        isOpen={showStudyDialog}
        isCompleted={selectedStudy ? isStudyCompleted(selectedStudy.id) : false}
        onClose={() => setShowStudyDialog(false)}
        onStudyCompleted={handleStudyCompleted}
      />
    </PageLayout>
  );
};

export default Search;
