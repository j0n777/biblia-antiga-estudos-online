
import React from 'react';
import { SearchResult } from '@/types/bible.types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import SmartClickableWord from '@/components/bible/SmartClickableWord';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  searchTerm: string;
}

const SearchResults = ({ results, isLoading, searchTerm }: SearchResultsProps) => {
  const { t } = useLanguage();

  // Função para renderizar texto com palavras clicáveis Smart Strong's
  const renderSmartClickableText = (text: string, versionId: string, bookId: string, chapterNumber: number, verseNumber: number) => {
    const words = text.split(/(\s+)/);
    
    return words.map((word, index) => {
      // Se for apenas espaço em branco, retornar como está
      if (/^\s+$/.test(word)) {
        return word;
      }
      
      // Usar o SmartClickableWord que verifica se a palavra tem definição Strong's
      return (
        <SmartClickableWord
          key={index}
          word={word}
          versionId={versionId}
          bookId={bookId}
          chapterNumber={chapterNumber}
          verseNumber={verseNumber}
        >
          {word}
        </SmartClickableWord>
      );
    });
  };

  // Função para destacar o termo pesquisado
  const highlightSearchTerm = (text: string, term: string) => {
    if (!term.trim()) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-bible-title/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
          <span className="text-2xl">🔍</span>
        </div>
        <p className="text-bible-title font-medium mb-2">
          {t('search.noResults') || 'Nenhum resultado encontrado'}
        </p>
        <p className="text-sm text-bible-subtitle">
          {t('search.tryDifferentTerms') || 'Tente termos diferentes ou verifique a ortografia'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-bible-subtitle">
          {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
        </p>
      </div>
      
      <Separator />
      
      {results.map((result, index) => (
        <Card key={`${result.book_id}-${result.chapter_number}-${result.verse_number}-${index}`} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                {result.book_name} {result.chapter_number}:{result.verse_number}
              </Badge>
              {result.version_id && (
                <Badge variant="secondary" className="text-xs">
                  {result.version_id.toUpperCase()}
                </Badge>
              )}
            </div>
            
            <div className="text-bible-text leading-relaxed">
              <span className="font-semibold text-bible-subtitle mr-2">
                {result.verse_number}.
              </span>
              <span className="text-gray-800">
                {renderSmartClickableText(
                  result.text,
                  result.version_id || 'kja',
                  result.book_id,
                  result.chapter_number,
                  result.verse_number
                )}
              </span>
            </div>
            
            {searchTerm && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                <span className="text-bible-subtitle font-medium">Termo destacado: </span>
                <span className="text-gray-700">
                  {highlightSearchTerm(result.text, searchTerm)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;
