
import { Loader2, SearchIcon, BookOpen } from 'lucide-react';
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
      <div className="flex flex-col justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-ancient-gold mb-4" />
        <span className="text-lg text-scripture-heading">Pesquisando...</span>
        <p className="text-sm text-muted-foreground mt-2">Procurando nos versículos da Bíblia</p>
      </div>
    );
  }

  if (hasSearched) {
    if (searchResults.length > 0) {
      return (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-parchment-dark/10">
            <BookOpen className="h-5 w-5 text-ancient-gold" />
            <h2 className="text-lg font-semibold text-scripture-heading">
              {searchResults.length === 1 
                ? '1 versículo encontrado' 
                : `${searchResults.length} versículos encontrados`
              }
            </h2>
          </div>
          
          <div className="space-y-6">
            {searchResults.map((verse) => (
              <div key={verse.id} className="bg-white/50 rounded-lg p-4 border border-parchment-dark/10 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-sm font-semibold text-ancient-gold bg-ancient-gold/10 px-2 py-1 rounded">
                    {verse.book_name} {verse.chapter_number}:{verse.verse_number}
                  </div>
                </div>
                <BibleVerseComponent verse={verse} />
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-parchment-dark/10 rounded-full flex items-center justify-center mb-4">
            <SearchIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-scripture-heading mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-muted-foreground max-w-md">
            Tente usar outras palavras ou verifique a ortografia. Lembre-se de que você pode buscar por palavras soltas ou referências como "João 3:16".
          </p>
        </div>
      );
    }
  }

  return null;
};

export default SearchResults;
