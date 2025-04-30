
import { useState } from 'react';
import { Share2, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

type VerseOfTheDayProps = {
  reference: string;
  text: string;
  version: string;
};

const VerseOfTheDay = ({ reference, text, version }: VerseOfTheDayProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Versículo do Dia',
        text: `${text} - ${reference} (${version})`,
      }).then(() => {
        toast.success('Versículo compartilhado com sucesso!');
      }).catch((error) => {
        console.error('Erro ao compartilhar:', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`${text} - ${reference} (${version})`);
      toast.success('Versículo copiado para a área de transferência!');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success('Versículo adicionado aos favoritos!');
    }
  };

  return (
    <Card className="parchment-container overflow-hidden">
      <CardContent className="pt-6">
        <h3 className="font-oldstyle text-xl text-scripture-heading mb-4 text-center">Versículo do Dia</h3>
        <p className="scripture-text text-center mb-3">"{text}"</p>
        <p className="text-scripture-verse text-center font-oldstyle font-medium">{reference}</p>
        <p className="text-sm text-muted-foreground text-center mt-1">{version}</p>
      </CardContent>
      <CardFooter className="flex justify-center gap-4 pt-2 pb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleFavorite}
          className={isFavorite ? "text-ancient-red" : "text-scripture-heading hover:text-ancient-red"}
        >
          <Heart className={isFavorite ? "fill-ancient-red" : ""} size={20} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleShare}
          className="text-scripture-heading hover:text-ancient-gold"
        >
          <Share2 size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-scripture-heading hover:text-ancient-brown"
          asChild
        >
          <a href="/read">
            <BookOpen size={20} />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerseOfTheDay;
