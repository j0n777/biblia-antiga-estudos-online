
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book, Globe, Volume2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getWordDefinition } from '@/services/bible/WordDefinitionService';

interface WordDefinition {
  strongs_number: string;
  word: string;
  transliteration: string;
  pronunciation: string;
  part_of_speech: string;
  definition: string;
  definition_pt?: string;
  etymology: string;
  usage_notes: string;
  strongs_type: 'hebrew' | 'greek';
}

interface WordDefinitionPopupProps {
  word: string;
  versionId: string;
  bookId: string;
  chapterNumber: number;
  verseNumber: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WordDefinitionPopup = ({
  word,
  versionId,
  bookId,
  chapterNumber,
  verseNumber,
  open,
  onOpenChange
}: WordDefinitionPopupProps) => {
  const { t, language } = useLanguage();
  const [definition, setDefinition] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && word) {
      fetchWordDefinition();
    }
  }, [open, word, versionId, language]);

  const fetchWordDefinition = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getWordDefinition(word, versionId, language);
      setDefinition(result);
    } catch (err) {
      console.error('Error fetching word definition:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar definição');
    } finally {
      setLoading(false);
    }
  };

  const getDefinitionText = () => {
    if (!definition) return '';
    
    // Corrigir comparação de tipos - usar string literal para comparação
    if (language === 'pt-br' && definition.definition_pt) {
      return definition.definition_pt;
    }
    return definition.definition;
  };

  const getLanguageFlag = (type: 'hebrew' | 'greek') => {
    return type === 'hebrew' ? '🇮🇱' : '🇬🇷';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            {t('bible.wordDefinition') || 'Definição da Palavra'}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bible-title"></div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">{error}</p>
              <p className="text-sm text-muted-foreground">
                {t('bible.wordDefinitionNotFound') || 'Definição não encontrada para esta palavra'}
              </p>
            </div>
          )}
          
          {definition && (
            <div className="space-y-4">
              {/* Cabeçalho da palavra */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-bible-title">{word}</h3>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <span>{getLanguageFlag(definition.strongs_type)}</span>
                    {definition.strongs_type === 'hebrew' ? 'Hebraico' : 'Grego'}
                  </Badge>
                  {definition.strongs_number && (
                    <Badge variant="secondary">
                      {definition.strongs_number}
                    </Badge>
                  )}
                </div>
                
                {definition.transliteration && (
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium italic">{definition.transliteration}</span>
                  </div>
                )}
                
                {definition.pronunciation && (
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{definition.pronunciation}</span>
                  </div>
                )}
                
                {definition.part_of_speech && (
                  <Badge variant="outline" className="text-xs">
                    {definition.part_of_speech}
                  </Badge>
                )}
              </div>
              
              {/* Definição principal */}
              <div>
                <h4 className="font-semibold text-lg mb-2">
                  {t('bible.definition') || 'Definição'}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {getDefinitionText()}
                </p>
              </div>
              
              {definition.etymology && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-lg mb-2">
                      {t('bible.etymology') || 'Etimologia'}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {definition.etymology}
                    </p>
                  </div>
                </>
              )}
              
              {definition.usage_notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-lg mb-2">
                      {t('bible.usage') || 'Uso'}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {definition.usage_notes}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default WordDefinitionPopup;
