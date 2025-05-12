import { useState, useEffect } from 'react';
import { Share2, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { getUserProfile } from '@/services/ProfileService';
import { useLanguage } from '@/contexts/LanguageContext';
import { searchBibleVerses } from '@/services/BibleDataService';
import { supabase } from '@/integrations/supabase/client';

type VerseOfTheDayProps = {
  reference?: string;
  text?: string;
  version?: string;
};

const VerseOfTheDay = ({ reference: initialReference, text: initialText, version: initialVersion }: VerseOfTheDayProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [reference, setReference] = useState(initialReference || "João 3:16");
  const [text, setText] = useState(initialText || "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.");
  const [version, setVersion] = useState(initialVersion || "KJA");
  const { language } = useLanguage();

  useEffect(() => {
    // Fetch a verse of the day in the user's preferred language
    const fetchVerseOfTheDay = async () => {
      try {
        // Get user profile to determine preferred version
        const userProfile = await getUserProfile();
        const preferredVersion = userProfile.preferred_bible_version || 
          (language === 'en' ? 'kjv' : language === 'es' ? 'rvr' : language === 'fr' ? 'apee' : 'kja');
        
        // Sample verses for verse of the day
        const verseReferences = [
          "João 3:16", "Romanos 8:28", "Salmos 23:1", "Filipenses 4:13", 
          "Jeremias 29:11", "Isaías 40:31", "Mateus 5:16", "Provérbios 3:5-6"
        ];
        
        // Select random verse reference
        const randomReference = verseReferences[Math.floor(Math.random() * verseReferences.length)];
        
        // Search for the verse
        const results = await searchBibleVerses(randomReference, preferredVersion);
        
        if (results.length > 0) {
          // Get the verse
          const verse = results[0];
          
          // Get the version name
          const { data: versionData } = await supabase.from('bible_versions')
            .select('name')
            .eq('id', preferredVersion)
            .maybeSingle();
            
          setReference(`${verse.book_id} ${verse.chapter_number}:${verse.verse_number}`);
          setText(verse.text);
          setVersion(versionData?.name || preferredVersion.toUpperCase());
        }
      } catch (error) {
        console.error('Error fetching verse of the day:', error);
      }
    };
    
    fetchVerseOfTheDay();
  }, [language]);

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
