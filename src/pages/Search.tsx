import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon, Book, RefreshCw, X } from 'lucide-react';
import { BibleVerse } from '@/types/bible.types';
import { searchBibleVerses } from '@/services/BibleDataService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

// Dummy suggested topics
const suggestedTopics = [
  "Fé", "Amor", "Esperança", "Salvação", "Graça", 
  "Perdão", "Casamento", "Família", "Oração", "Sabedoria",
  "Justiça", "Misericórdia", "Ressurreição"
];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('texto');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  
  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  }, []);
  
  // Save recent searches to localStorage
  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    try {
      // Add to beginning, remove duplicates, keep only 5 items
      const updatedSearches = [
        term, 
        ...recentSearches.filter(item => item !== term)
      ].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  };
  
  const handleSearch = async (term: string = searchTerm) => {
    if (!term.trim()) return;
    
    setIsSearching(true);
    saveRecentSearch(term);
    
    try {
      // Call the actual search function from BibleDataService
      const results = await searchBibleVerses(term);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: `Não foram encontrados resultados para "${term}".`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error searching:", error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro durante a busca. Tente novamente.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSuggestedTopicSearch = (topic: string) => {
    setSearchTerm(topic);
    handleSearch(topic);
  };
  
  const handleRecentSearch = (term: string) => {
    setSearchTerm(term);
    handleSearch(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };
  
  return (
    <PageLayout>
      <div className="py-4">
        <h1 className="text-xl font-oldstyle text-scripture-heading mb-4">Busca Bíblica</h1>
        
        <Tabs defaultValue="texto" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-parchment-light">
            <TabsTrigger value="texto">Texto</TabsTrigger>
            <TabsTrigger value="referencia">Referência</TabsTrigger>
            <TabsTrigger value="strongs">Strong's</TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <div className="relative">
              <Input
                className="pr-20 bg-parchment-light border-parchment-dark/30"
                placeholder={
                  activeTab === 'texto' ? "Buscar palavras ou frases..." : 
                  activeTab === 'referencia' ? "Ex: João 3:16, Gênesis 1:1" : 
                  "Ex: H430 (Elohim), G2316 (Theos)"
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchTerm && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-10 top-1 h-8 w-8 rounded-sm text-muted-foreground"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-sm bg-ancient-brown text-white"
                onClick={() => handleSearch()}
                disabled={isSearching}
              >
                {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <TabsContent value="texto" className="mt-4">
            {!searchResults.length && !isSearching && (
              <div className="space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-lg font-oldstyle text-scripture-heading mb-2">Buscas Recentes</h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="bg-parchment-light border-parchment-dark/30"
                          onClick={() => handleRecentSearch(term)}
                        >
                          {term}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Suggested Topics */}
                <div>
                  <h3 className="text-lg font-oldstyle text-scripture-heading mb-2">Tópicos Sugeridos</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTopics.map((topic, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="bg-parchment-light border-parchment-dark/30"
                        onClick={() => handleSuggestedTopicSearch(topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Search Results */}
            {isSearching && (
              <div className="py-4 text-center text-scripture-text">
                <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                <p>Buscando resultados...</p>
              </div>
            )}
            
            {searchResults.length > 0 && !isSearching && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-oldstyle text-scripture-heading">Resultados para "{searchTerm}"</h3>
                {searchResults.map((result, idx) => (
                  <Card key={idx} className="parchment-container overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-bold text-scripture-heading">{result.book_id} {result.chapter_number}:{result.verse_number}</p>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => 
                          window.location.href = `/read?version=${result.version_id}&book=${result.book_id}&chapter=${result.chapter_number}&verse=${result.verse_number}`
                        }>
                          <Book className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-1 text-scripture-text">{result.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="referencia" className="mt-4">
            <div className="p-4 bg-parchment-light rounded-lg">
              <p className="text-scripture-text">Busque por referências como "João 3:16", "Gênesis 1:1", etc.</p>
              <p className="text-xs text-muted-foreground mt-2">
                Digite a referência bíblica no formato "Livro Capítulo:Versículo" para encontrar versículos específicos.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="strongs" className="mt-4">
            <div className="p-4 bg-parchment-light rounded-lg">
              <p className="text-scripture-text">Busque pelo número Strong's como "H430" (Elohim), "G2316" (Theos), etc.</p>
              <p className="text-xs text-muted-foreground mt-2">
                O número Strong's é um sistema de referência para palavras em hebraico (H) e grego (G),
                as línguas originais do texto bíblico.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Search;
