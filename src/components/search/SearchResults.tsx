
import { Loader2, SearchIcon } from 'lucide-react';
import { BibleVerse } from '@/types/bible.types';
import BibleVerseComponent from '@/components/bible/BibleVerse';

interface SearchResultsProps {
  isSearching: boolean;
  hasSearched: boolean;
  searchResults: BibleVerse[];
}

const SearchResults = ({ isSearching, hasSearched, searchResults }: SearchResultsProps) => {
  if (isSearching) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-ancient-gold" />
        <span className="ml-2">Pesquisando...</span>
      </div>
    );
  }

  if (hasSearched) {
    if (searchResults.length > 0) {
      return (
        <div className="space-y-4 p-4">
          <h2 className="text-lg font-semibold">
            {`${searchResults.length} resultados encontrados`}
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
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-parchment-dark/20 rounded-lg flex items-center justify-center mb-4">
            <SearchIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-scripture-heading font-medium mb-2">
            Nenhum resultado encontrado
          </p>
          <p className="text-sm text-muted-foreground max-w-md">
            Tente outros termos ou formas de escrita diferentes.
          </p>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-parchment-dark/20 rounded-lg flex items-center justify-center mb-4">
        <SearchIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-scripture-heading font-medium mb-2">
        Digite uma palavra ou referência para buscar na Bíblia
      </p>
      <p className="text-sm text-muted-foreground max-w-md">
        Exemplos: "amor", "João 3:16", "pão"
      </p>
    </div>
  );
};

export default SearchResults;
