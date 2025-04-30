
import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import BibleVerse from '@/components/bible/BibleVerse';

type SearchResult = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState('texto');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search results - in a real app this would query an API or local database
    setTimeout(() => {
      // Mock search results
      if (activeTab === 'texto') {
        setSearchResults([
          { book: 'João', chapter: 3, verse: 16, text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna." },
          { book: 'Romanos', chapter: 5, verse: 8, text: "Mas Deus prova o seu amor para conosco em que Cristo morreu por nós, sendo nós ainda pecadores." },
          { book: '1 João', chapter: 4, verse: 8, text: "Aquele que não ama não conhece a Deus, porque Deus é amor." },
        ]);
      } else if (activeTab === 'referencia') {
        setSearchResults([
          { book: 'João', chapter: 3, verse: 16, text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna." },
        ]);
      } else {
        // Strong's number search or other specialized searches would go here
        setSearchResults([
          { book: 'João', chapter: 1, verse: 1, text: "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus." },
          { book: 'Gênesis', chapter: 1, verse: 1, text: "No princípio, criou Deus os céus e a terra." },
        ]);
      }
      
      setIsSearching(false);
    }, 500);
  };
  
  return (
    <PageLayout>
      <div className="py-6">
        <h1 className="text-2xl font-oldstyle text-center text-scripture-heading mb-6">Busca Bíblica</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-parchment-light">
            <TabsTrigger value="texto" className="flex-1">Texto</TabsTrigger>
            <TabsTrigger value="referencia" className="flex-1">Referência</TabsTrigger>
            <TabsTrigger value="strongs" className="flex-1">Strong's</TabsTrigger>
          </TabsList>
          
          <TabsContent value="texto" className="mt-4">
            <form onSubmit={handleSearch}>
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar palavras ou frases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-parchment-light border-parchment-dark/30 placeholder:text-muted-foreground/70"
                />
                <Button type="submit" disabled={isSearching} className="bg-ancient-brown hover:bg-ancient-brown/80 text-white">
                  {isSearching ? "Buscando..." : <SearchIcon size={18} />}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="referencia" className="mt-4">
            <form onSubmit={handleSearch}>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: João 3:16 ou Gênesis 1:1-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-parchment-light border-parchment-dark/30 placeholder:text-muted-foreground/70"
                />
                <Button type="submit" disabled={isSearching} className="bg-ancient-brown hover:bg-ancient-brown/80 text-white">
                  {isSearching ? "Buscando..." : <SearchIcon size={18} />}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="strongs" className="mt-4">
            <form onSubmit={handleSearch}>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: H7225 (hebraico) ou G3056 (grego)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-parchment-light border-parchment-dark/30 placeholder:text-muted-foreground/70"
                />
                <Button type="submit" disabled={isSearching} className="bg-ancient-brown hover:bg-ancient-brown/80 text-white">
                  {isSearching ? "Buscando..." : <SearchIcon size={18} />}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        
        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-oldstyle text-scripture-heading">Resultados ({searchResults.length})</h2>
            
            {searchResults.map((result, index) => (
              <Card key={index} className="parchment-container">
                <div className="p-4">
                  <h3 className="font-oldstyle text-sm text-scripture-heading mb-2">
                    {result.book} {result.chapter}:{result.verse}
                  </h3>
                  <BibleVerse verse={{ number: result.verse, text: result.text }} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Search;
