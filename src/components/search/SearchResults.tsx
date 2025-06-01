import { Loader2, SearchIcon, BookOpen, Info, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BibleVerse } from '@/types/bible.types';
import BibleVerseComponent from '@/components/bible/BibleVerse';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchResultsProps {
  isSearching: boolean;
  hasSearched: boolean;
  searchResults: BibleVerse[];
  totalResults: number;
  hasMoreResults: boolean;
  onLoadMore: () => void;
  wholeWordsOnly: boolean;
  onToggleWholeWords: () => void;
  
  // Support for older prop names
  results?: BibleVerse[];
  isLoading?: boolean;
  error?: any;
  query?: string;
  onVerseClick?: (bookId: string, chapterNumber: number, verseNumber: number) => void;
}

const SearchResults = ({ 
  isSearching, 
  hasSearched, 
  searchResults, 
  totalResults = 0,
  hasMoreResults = false,
  onLoadMore = () => {},
  wholeWordsOnly = true,
  onToggleWholeWords = () => {},
  
  // Support for older props
  results,
  isLoading,
  error,
  query,
  onVerseClick
}: SearchResultsProps) => {
  const navigate = useNavigate();
  
  // Use either new or old props
  const finalIsSearching = isLoading || isSearching;
  const finalResults = results || searchResults || [];

  const handleVerseClick = (verse: BibleVerse) => {
    if (onVerseClick) {
      onVerseClick(verse.book_id!, verse.chapter_number!, verse.verse_number);
    } else {
      // Navigate to reading page with specific chapter and verse
      navigate(`/read?book=${verse.book_id}&chapter=${verse.chapter_number}&verse=${verse.verse_number}`);
    }
  };

  if (finalIsSearching && finalResults.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-ancient-gold mb-4" />
        <span className="text-lg text-scripture-heading">Pesquisando...</span>
        <p className="text-sm text-muted-foreground mt-2">Procurando nos versículos da Bíblia</p>
      </div>
    );
  }

  if (hasSearched || query) {
    if (finalResults.length > 0) {
      // Check if results are from different version than expected
      const resultVersions = [...new Set(finalResults.map(v => v.version_id))];
      const isFromDifferentVersion = resultVersions.length > 0 && !resultVersions.includes('kja');
      
      return (
        <div className="p-6">
          {isFromDifferentVersion && (
            <Alert className="mb-4 border-amber-200 bg-amber-50">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Resultados encontrados em outra versão da Bíblia ({resultVersions.join(', ')}). 
                Sua versão preferida (KJA) pode não ter dados disponíveis para esta busca.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-parchment-dark/10">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-ancient-gold" />
              <h2 className="text-lg font-semibold text-scripture-heading">
                {totalResults === 1 
                  ? '1 versículo encontrado' 
                  : `${totalResults || finalResults.length} versículos encontrados`
                }
              </h2>
              {resultVersions.length > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  (Versão: {resultVersions.join(', ')})
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Badge
                variant={wholeWordsOnly ? "default" : "outline"}
                className="cursor-pointer"
                onClick={onToggleWholeWords}
              >
                {wholeWordsOnly ? "Palavras inteiras" : "Correspondência parcial"}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-6">
            {finalResults.map((verse) => (
              <div key={verse.id} className="bg-white/50 rounded-lg p-4 border border-parchment-dark/10 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <button
                    onClick={() => handleVerseClick(verse)}
                    className="text-sm font-semibold text-ancient-gold bg-ancient-gold/10 px-2 py-1 rounded hover:bg-ancient-gold/20 transition-colors flex items-center gap-1"
                  >
                    {verse.book_name} {verse.chapter_number}:{verse.verse_number}
                    <ExternalLink className="h-3 w-3" />
                  </button>
                  {verse.version_id && (
                    <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                      {verse.version_id.toUpperCase()}
                    </span>
                  )}
                </div>
                <BibleVerseComponent verse={verse} />
              </div>
            ))}
          </div>
          
          {hasMoreResults && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={onLoadMore}
                disabled={finalIsSearching}
                variant="outline"
                className="flex items-center gap-2"
              >
                {finalIsSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
                {finalIsSearching ? 'Carregando...' : 'Carregar mais resultados'}
              </Button>
            </div>
          )}
          
          <div className="text-center text-sm text-muted-foreground mt-4">
            Mostrando {finalResults.length} de {totalResults || finalResults.length} resultados
          </div>
        </div>
      );
    } else if (!error) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-parchment-dark/10 rounded-full flex items-center justify-center mb-4">
            <SearchIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-scripture-heading mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-muted-foreground max-w-md mb-4">
            Tente usar outras palavras ou verifique a ortografia. Lembre-se de que você pode buscar por palavras soltas ou referências como "João 3:16".
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Modo de busca:</span>
            <Badge
              variant={wholeWordsOnly ? "default" : "outline"}
              className="cursor-pointer"
              onClick={onToggleWholeWords}
            >
              {wholeWordsOnly ? "Palavras inteiras" : "Correspondência parcial"}
            </Badge>
          </div>
        </div>
      );
    }
  }

  return null;
};

export default SearchResults;
