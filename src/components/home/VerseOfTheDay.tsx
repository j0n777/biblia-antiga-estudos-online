
import { useState, useEffect } from 'react';
import { Share2, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { getUserProfile } from '@/services/ProfileService';
import { useLanguage } from '@/contexts/LanguageContext';
import { searchBibleVerses } from '@/services/bible';
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
  const [bookName, setBookName] = useState<string | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    // Fetch a verse of the day in the user's preferred language
    const fetchVerseOfTheDay = async () => {
      try {
        // Get user profile to determine preferred version
        const userProfile = await getUserProfile();
        const preferredVersion = userProfile.preferred_bible_version || 
          (language === 'en' ? 'kjv' : language === 'es' ? 'rvr' : language === 'fr' ? 'apee' : 'kja');
        
        console.info(`Using preferred version for verse of the day: ${preferredVersion}`);
        
        // Sample verses for verse of the day - references should work in all languages
        const verseReferences = [
          "João 3:16", "Romanos 8:28", "Salmos 23:1", "Filipenses 4:13", 
          "Jeremias 29:11", "Isaías 40:31", "Mateus 5:16", "Provérbios 3:5-6"
        ];
        
        // Select random verse reference
        const randomReference = verseReferences[Math.floor(Math.random() * verseReferences.length)];
        console.info(`Searching Bible for "${randomReference}" in version ${preferredVersion}`);
        
        // Search for the verse
        const results = await searchBibleVerses(randomReference, preferredVersion);
        
        if (results.verses.length > 0) {
          // Get the verse
          const verse = results.verses[0];
          
          // Get the version name
          const { data: versionData } = await supabase.from('bible_versions')
            .select('name, language_name')
            .eq('id', preferredVersion)
            .maybeSingle();
            
          // Format the reference properly with fallbacks for null values
          const safeBookName = verse.book_name || verse.book_id || "Livro";
          const safeChapterNumber = verse.chapter_number || 1;
          const safeVerseNumber = verse.verse_number || 1;
          const formattedReference = `${safeBookName} ${safeChapterNumber}:${safeVerseNumber}`;
            
          setReference(formattedReference);
          setBookName(safeBookName);
          setText(verse.text || "Versículo do dia não disponível");
          setVersion(versionData?.name || preferredVersion.toUpperCase());
        } else {
          console.warn(`No results found for reference: ${randomReference} in version: ${preferredVersion}`);
          // Fallback to default verse if search doesn't work
          setReference("Romanos 8:28");
          setText("Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.");
          setVersion(preferredVersion.toUpperCase());
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
        title: t('verseOfDay.title') || 'Versículo do Dia',
        text: `${text} - ${reference} (${version})`,
      }).then(() => {
        toast.success(t('verseOfDay.shared') || 'Versículo compartilhado com sucesso!');
      }).catch((error) => {
        console.error('Erro ao compartilhar:', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`${text} - ${reference} (${version})`);
      toast.success(t('verseOfDay.copied') || 'Versículo copiado para a área de transferência!');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success(t('verseOfDay.addedToFavorites') || 'Versículo adicionado aos favoritos!');
    }
  };

  return (
    <Card className="parchment-container overflow-hidden">
      <CardContent className="pt-6">
        <h3 className="font-oldstyle text-xl text-scripture-heading mb-4 text-center">{t('verseOfDay.title') || 'Versículo do Dia'}</h3>
        <p className="scripture-text text-center mb-3">"{text}"</p>
        <p className="text-scripture-verse text-center font-oldstyle font-medium">{reference || "Referência"}</p>
        <p className="text-sm text-muted-foreground text-center mt-1">{version || "KJA"}</p>
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
