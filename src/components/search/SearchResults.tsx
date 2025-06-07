
import { useState } from 'react';
import { Loader2, Search, MoreHorizontal, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import BibleStudyButton from '@/components/studies/BibleStudyButton';

export interface SearchResult {
  book_id: string;
  book_name: string;
  chapter_number: number;
  verse_number: number;
  text: string;
  version_id: string;
}

interface SearchResultsProps {
  isSearching: boolean;
  hasSearched: boolean;
  searchResults: SearchResult[];
  totalResults: number;
  hasMoreResults: boolean;
  onLoadMore: () => void;
  wholeWordsOnly: boolean;
  onToggleWholeWords: () => void;
  error: string | null;
  query: string;
  onVerseClick: (bookId: string, chapterNumber: number, verseNumber: number) => void;
}

const SearchResults = ({
  isSearching,
  hasSearched,
  searchResults,
  totalResults,
  hasMoreResults,
  onLoadMore,
  wholeWordsOnly,
  onToggleWholeWords,
  error,
  query,
  onVerseClick
}: SearchResultsProps) => {
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Erro na busca</h3>
        <p className="text-gray-600 mb-4">{error}</p>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-ancient-gold mb-4" />
        <p className="text-gray-600">{t('search.searching') || 'Buscando...'}</p>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">
          {t('search.noResults') || 'Nenhum resultado encontrado'}
        </h3>
        <p className="text-gray-600">
          {t('search.tryDifferentTerm') || 'Tente usar termos diferentes ou verifique a ortografia.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            {totalResults} resultado(s) encontrado(s)
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="whole-words"
                checked={wholeWordsOnly}
                onCheckedChange={onToggleWholeWords}
              />
              <Label htmlFor="whole-words" className="text-sm">
                {t('search.wholeWordsOnly') || 'Apenas palavras completas'}
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="space-y-3">
        {searchResults.map((result, index) => {
          const verseReference = `${result.book_name} ${result.chapter_number}:${result.verse_number}`;
          
          return (
            <Card key={`${result.book_id}-${result.chapter_number}-${result.verse_number}-${index}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="shrink-0">
                        {verseReference}
                      </Badge>
                    </div>
                    <p 
                      className="text-scripture-text leading-relaxed cursor-pointer hover:text-ancient-brown transition-colors"
                      onClick={() => onVerseClick(result.book_id, result.chapter_number, result.verse_number)}
                      dangerouslySetInnerHTML={{
                        __html: result.text.replace(
                          new RegExp(`(${query})`, 'gi'),
                          '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
                        )
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <BibleStudyButton
                      verseReference={verseReference}
                      bookId={result.book_id}
                      chapterNumber={result.chapter_number}
                      verseNumber={result.verse_number}
                      versionId={result.version_id}
                      verseText={result.text}
                      size="sm"
                      variant="ghost"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onVerseClick(result.book_id, result.chapter_number, result.verse_number)}
                      className="h-8 w-8"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More */}
      {hasMoreResults && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isSearching}
            className="flex items-center gap-2"
          >
            {isSearching && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('search.loadMore') || 'Carregar mais resultados'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
