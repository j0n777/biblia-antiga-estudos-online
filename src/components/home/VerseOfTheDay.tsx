
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import BibleStudyButton from '@/components/studies/BibleStudyButton';

interface VerseOfTheDayProps {
  reference: string;
  text: string;
  version: string;
}

const VerseOfTheDay = ({ reference, text, version }: VerseOfTheDayProps) => {
  const { t } = useLanguage();

  const handleCopy = () => {
    const verseText = `"${text}" - ${reference} (${version})`;
    navigator.clipboard.writeText(verseText);
    toast({
      description: t('bible.verseCopied') || 'Versículo copiado para a área de transferência',
    });
  };

  const handleShare = () => {
    const shareText = `"${text}" - ${reference} (${version})`;
    
    if (navigator.share) {
      navigator.share({
        title: t('home.verseOfTheDay') || 'Versículo do Dia',
        text: shareText,
      });
    } else {
      handleCopy();
    }
  };

  // Parse reference to extract book, chapter, and verse
  const parseReference = (ref: string) => {
    const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (match) {
      const [, bookName, chapter, verse] = match;
      // Convert book name to ID (simplified mapping)
      const bookId = bookName.toLowerCase().replace(/\s+/g, '');
      return {
        bookId,
        chapterNumber: parseInt(chapter),
        verseNumber: parseInt(verse)
      };
    }
    return { bookId: '', chapterNumber: 0, verseNumber: 0 };
  };

  const { bookId, chapterNumber, verseNumber } = parseReference(reference);

  return (
    <Card className="card overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-ancient-gold" />
            <h2 className="text-lg font-oldstyle text-bible-title">
              {t('home.verseOfTheDay') || 'Versículo do Dia'}
            </h2>
          </div>
          
          <blockquote className="text-lg leading-relaxed text-scripture-text italic">
            "{text}"
          </blockquote>
          
          <div className="space-y-3">
            <p className="text-scripture-heading font-medium">
              {reference}
            </p>
            <p className="text-sm text-muted-foreground">
              {version}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 pt-2 px-2">
            <BibleStudyButton
              verseReference={reference}
              bookId={bookId}
              chapterNumber={chapterNumber}
              verseNumber={verseNumber}
              versionId="kja"
              verseText={text}
              size="sm"
              variant="outline"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2 min-w-0 flex-shrink"
            >
              <Copy className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{t('bible.copy') || 'Copiar'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2 min-w-0 flex-shrink"
            >
              <Share2 className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{t('bible.share') || 'Compartilhar'}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerseOfTheDay;
