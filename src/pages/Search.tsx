
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Book, BookOpen, ExternalLink, Heart, Crown, Zap, Shield, Smile, Home } from 'lucide-react';
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ThemeSuggestion {
  name: string;
  icon: React.ReactNode;
  color: string;
  verses: string[];
}

// Temas sugeridos com ícones e cores
const themeSuggestions: ThemeSuggestion[] = [
  {
    name: 'Amor',
    icon: <Heart className="h-5 w-5" />,
    color: 'bg-rose-500',
    verses: ['1 Coríntios 13:4-7', 'João 3:16', 'Romanos 5:8', '1 João 4:19', 'Efésios 5:2']
  },
  {
    name: 'Fé',
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-amber-500',
    verses: ['Hebreus 11:1', 'Romanos 10:17', 'Mateus 17:20', 'Efésios 2:8-9', 'Tiago 2:14-26']
  },
  {
    name: 'Esperança',
    icon: <Crown className="h-5 w-5" />,
    color: 'bg-emerald-500',
    verses: ['Romanos 15:13', 'Hebreus 10:23', 'Isaías 40:31', 'Jeremias 29:11', 'Salmos 39:7']
  },
  {
    name: 'Paz',
    icon: <Smile className="h-5 w-5" />,
    color: 'bg-sky-500',
    verses: ['João 14:27', 'Filipenses 4:7', 'Isaías 26:3', 'Colossenses 3:15', 'Salmos 29:11']
  },
  {
    name: 'Proteção',
    icon: <Shield className="h-5 w-5" />,
    color: 'bg-indigo-500',
    verses: ['Salmos 91:1-16', 'Provérbios 18:10', 'Isaías 54:17', '2 Tessalonicenses 3:3', 'Salmos 121:7-8']
  },
  {
    name: 'Família',
    icon: <Home className="h-5 w-5" />,
    color: 'bg-purple-500',
    verses: ['Provérbios 22:6', 'Efésios 6:1-4', 'Colossenses 3:20-21', 'Salmos 128:3', 'Josué 24:15']
  }
];

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
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeSuggestion | null>(null);
  
  const { t, language } = useLanguage();
  
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // Carregar todos os estudos para exibir por padrão
        const studies = await getAllBibleStudies();
        setAllStudies(studies);
        
        // Carregar estudos completados pelo usuário
        const completed = await getCompletedStudies();
        setCompletedStudyIds(completed);
        
        // Carregar buscas recentes do localStorage
        const savedSearches = localStorage.getItem('recent_searches');
        if (savedSearches) {
          setRecentSearches(JSON.parse(savedSearches));
        }
        
        // Realizar busca se houver uma consulta inicial
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
    
    // Atualizar URL
    setSearchParams({ q: query, tab: activeTab });
    
    // Salvar pesquisa no histórico se não estiver vazia
    if (query.trim()) {
      saveSearchToHistory(query);
    }
  };
  
  const saveSearchToHistory = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    
    // Atualizar a lista de buscas recentes, mantendo apenas as últimas 5
    const updatedSearches = [
      trimmedQuery,
      ...recentSearches.filter(s => s !== trimmedQuery)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
  };
  
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      if (activeTab === 'studies') {
        setStudyResults(allStudies); // Mostrar todos os estudos quando não houver consulta
      }
      setSelectedTheme(null);
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
            results = (data || []).filter(v => v.verse_number === parseInt(verse, 10)) as BibleVerseType[];
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
      
      // Limpar tema selecionado ao fazer uma busca
      setSelectedTheme(null);
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
      // Mostrar todos os estudos ao mudar para a aba de estudos sem uma consulta
      setStudyResults(allStudies);
    }
    
    // Limpar tema selecionado ao mudar de aba
    setSelectedTheme(null);
  };
  
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    
    // Mostrar todos os estudos quando a busca é limpa
    setStudyResults(allStudies);
    setSearchParams({});
    
    // Limpar tema selecionado
    setSelectedTheme(null);
  };
  
  const handleStudySelect = (study: BibleStudy) => {
    setSelectedStudy(study);
  };
  
  const isStudyCompleted = (studyId: string) => {
    return completedStudyIds.includes(studyId);
  };
  
  const handleThemeSelect = async (theme: ThemeSuggestion) => {
    setSelectedTheme(theme);
    setQuery(''); // Limpar campo de busca
    setIsSearching(true);
    setActiveTab('verses');
    
    try {
      // Buscar versículo aleatório com base no tema selecionado
      const randomVerseRef = theme.verses[Math.floor(Math.random() * theme.verses.length)];
      await performSearch(randomVerseRef);
    } catch (error) {
      console.error('Error fetching theme verses:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar versículos para este tema',
        variant: 'destructive'
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery);
    setSearchParams({ q: searchQuery, tab: activeTab });
  };
  
  // Mostrar estudos mesmo sem busca
  const displayStudies = activeTab === 'studies' ? (query ? studyResults : allStudies) : [];

  // Função para recarregar o progresso do usuário após concluir um estudo
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
  
  // Renderização dos temas sugeridos e buscas recentes quando não há consulta
  const renderEmptyStateContent = () => {
    return (
      <div className="space-y-8">
        {/* Temas sugeridos */}
        <div>
          <h2 className="text-lg font-oldstyle text-scripture-heading mb-3">
            Temas Sugeridos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {themeSuggestions.map((theme) => (
              <button
                key={theme.name}
                className={`p-3 rounded-lg flex flex-col items-center justify-center aspect-square text-white transition-transform hover:scale-105 ${
                  theme.color
                }`}
                onClick={() => handleThemeSelect(theme)}
              >
                <div className="bg-white/20 p-2 rounded-full mb-2">
                  {theme.icon}
                </div>
                <span className="font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Estudos bíblicos em destaque */}
        {allStudies.length > 0 && (
          <div>
            <h2 className="text-lg font-oldstyle text-scripture-heading mb-3">
              Estudos Bíblicos em Destaque
            </h2>
            <ScrollArea className="whitespace-nowrap pb-4">
              <div className="flex space-x-4 px-1 py-2">
                {allStudies.slice(0, 5).map((study) => (
                  <div 
                    key={study.id} 
                    className="w-64 inline-block"
                    onClick={() => handleStudySelect(study)}
                  >
                    <BibleStudyCard
                      study={study}
                      isCompleted={isStudyCompleted(study.id)}
                      compact={true}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        
        {/* Buscas recentes */}
        {recentSearches.length > 0 && (
          <div>
            <h2 className="text-lg font-oldstyle text-scripture-heading mb-3">
              Buscas Recentes
            </h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((searchQuery) => (
                <Button
                  key={searchQuery}
                  variant="outline"
                  className="rounded-full bg-parchment-light/80"
                  onClick={() => handleRecentSearchClick(searchQuery)}
                >
                  <SearchIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                  {searchQuery}
                </Button>
              ))}
              {recentSearches.length > 0 && (
                <Button
                  variant="ghost"
                  className="text-xs text-muted-foreground"
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem('recent_searches');
                  }}
                >
                  Limpar histórico
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
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
                {selectedTheme && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-parchment-light rounded-lg mb-2">
                    <div className={`p-1 rounded-full ${selectedTheme.color}`}>
                      {selectedTheme.icon}
                    </div>
                    <span className="font-medium">{selectedTheme.name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-auto h-6 w-6"
                      onClick={() => setSelectedTheme(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {searchResults.map((verse) => (
                  <div key={verse.id} className="parchment-container rounded-xl overflow-hidden animate-slide-up elevated-card">
                    <div className="text-xs text-ancient-brown font-medium mb-1">
                      {/* Usar book_id ao invés de book_name que não existe em BibleVerse */}
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
            ) : renderEmptyStateContent()}
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
