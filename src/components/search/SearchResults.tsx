import { Loader2, SearchIcon, BookOpen, Info, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BibleVerse } from '@/types/bible.types';
import BibleVerseComponent from '@/components/bible/BibleVerse';
import BibleStudyButton from '@/components/studies/BibleStudyButton';
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

// Ordem dos livros da Bíblia (simplificada)
const BIBLE_BOOK_ORDER: Record<string, number> = {
  // Antigo Testamento
  'gn': 1, 'ex': 2, 'lv': 3, 'nm': 4, 'dt': 5, 'js': 6, 'jud': 7, 'rt': 8,
  '1sm': 9, '2sm': 10, '1kgs': 11, '2kgs': 12, '1ch': 13, '2ch': 14, 'ezr': 15,
  'ne': 16, 'et': 17, 'job': 18, 'ps': 19, 'prv': 20, 'ec': 21, 'so': 22,
  'is': 23, 'jr': 24, 'lm': 25, 'ez': 26, 'dn': 27, 'ho': 28, 'jl': 29,
  'am': 30, 'ob': 31, 'jn': 32, 'mi': 33, 'na': 34, 'hk': 35, 'zp': 36,
  'hg': 37, 'zc': 38, 'ml': 39,
  // Novo Testamento
  'mt': 40, 'mk': 41, 'lk': 42, 'jo': 43, 'act': 44, 'rm': 45, '1co': 46,
  '2co': 47, 'gl': 48, 'eph': 49, 'ph': 50, 'cl': 51, '1ts': 52, '2ts': 53,
  '1tm': 54, '2tm': 55, 'tt': 56, 'phm': 57, 'hb': 58, 'jm': 59, '1pe': 60,
  '2pe': 61, '1jo': 62, '2jo': 63, '3jo': 64, 'jd': 65, 're': 66
};

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

  // Sort results by biblical book order
  const sortedResults = [...finalResults].sort((a, b) => {
    const orderA = BIBLE_BOOK_ORDER[a.book_id?.toLowerCase() || ''] || 999;
    const orderB = BIBLE_BOOK_ORDER[b.book_id?.toLowerCase() || ''] || 999;
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // If same book, sort by chapter and verse
    if (a.chapter_number !== b.chapter_number) {
      return (a.chapter_number || 0) - (b.chapter_number || 0);
    }
    
    return (a.verse_number || 0) - (b.verse_number || 0);
  });

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
            <Alert className="mb-4 border-amber-200 bg-amber-50 rounded-xl">
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
                className="cursor-pointer rounded-xl"
                onClick={onToggleWholeWords}
              >
                {wholeWordsOnly ? "Palavras inteiras" : "Correspondência parcial"}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            {sortedResults.map((verse) => {
              const verseReference = `${verse.book_name} ${verse.chapter_number}:${verse.verse_number}`;
              
              return (
                <div key={verse.id} className="search-result-item hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <button
                      onClick={() => handleVerseClick(verse)}
                      className="text-sm font-semibold text-ancient-gold bg-ancient-gold/10 px-3 py-1.5 rounded-xl hover:bg-ancient-gold/20 transition-colors flex items-center gap-1"
                    >
                      {verse.book_name} {verse.chapter_number}:{verse.verse_number}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {verse.version_id && (
                        <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-xl">
                          {verse.version_id.toUpperCase()}
                        </span>
                      )}
                      
                      {/* Botão de estudo bíblico */}
                      <BibleStudyButton
                        verseReference={verseReference}
                        bookId={verse.book_id || ''}
                        chapterNumber={verse.chapter_number || 0}
                        verseNumber={verse.verse_number}
                        versionId={verse.version_id || 'kja'}
                        verseText={verse.text}
                        size="sm"
                        variant="outline"
                      />
                    </div>
                  </div>
                  <BibleVerseComponent verse={verse} />
                </div>
              );
            })}
          </div>
          
          {hasMoreResults && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={onLoadMore}
                disabled={finalIsSearching}
                variant="outline"
                className="flex items-center gap-2 rounded-xl"
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
              className="cursor-pointer rounded-xl"
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
