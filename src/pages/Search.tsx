
import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon } from 'lucide-react';

// Dummy suggested topics
const suggestedTopics = [
  "Fé", "Amor", "Esperança", "Salvação", "Graça", 
  "Perdão", "Casamento", "Família", "Oração", "Sabedoria",
  "Justiça", "Misericórdia", "Ressurreição"
];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('texto');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Jesus", "Isaías 53", "João 3:16", "Salmos 23", "Provérbios"
  ]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (term: string = searchTerm) => {
    if (!term.trim()) return;
    
    setIsSearching(true);
    
    // Mock search results - in a real app, this would call the API
    setTimeout(() => {
      setSearchResults([
        { ref: "João 3:16", text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna." },
        { ref: "Romanos 5:8", text: "Mas Deus prova o seu amor para conosco em que Cristo morreu por nós, sendo nós ainda pecadores." },
        // Add more mock results as needed
      ]);
      setIsSearching(false);
      
      // Add to recent searches if not already included
      if (!recentSearches.includes(term)) {
        setRecentSearches(prev => [term, ...prev].slice(0, 5));
      }
    }, 500);
  };
  
  const handleSuggestedTopicSearch = (topic: string) => {
    setSearchTerm(topic);
    handleSearch(topic);
  };
  
  const handleRecentSearch = (term: string) => {
    setSearchTerm(term);
    handleSearch(term);
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
                className="pr-10 bg-parchment-light border-parchment-dark/30"
                placeholder="Buscar palavras ou frases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-sm bg-ancient-brown text-white"
                onClick={() => handleSearch()}
                disabled={isSearching}
              >
                <SearchIcon className="h-4 w-4" />
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
                <p>Buscando resultados...</p>
              </div>
            )}
            
            {searchResults.length > 0 && !isSearching && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-oldstyle text-scripture-heading">Resultados para "{searchTerm}"</h3>
                {searchResults.map((result, idx) => (
                  <div key={idx} className="parchment-container p-3">
                    <p className="font-bold text-scripture-heading">{result.ref}</p>
                    <p className="mt-1 text-scripture-text">{result.text}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="referencia" className="mt-4">
            {/* Reference search content */}
            <p>Busque por referências como "João 3:16", "Gênesis 1:1", etc.</p>
          </TabsContent>
          
          <TabsContent value="strongs" className="mt-4">
            {/* Strong's search content */}
            <p>Busque pelo número Strong's como "H430" (Elohim), "G2316" (Theos), etc.</p>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Search;
