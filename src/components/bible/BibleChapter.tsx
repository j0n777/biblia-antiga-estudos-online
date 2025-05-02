
import { useEffect, useState, useRef } from 'react';
import BibleVerse from './BibleVerse';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BibleChapter as BibleChapterType, getChapter, getChapterMock, WordDefinition } from '@/services/BibleService';
import { Skeleton } from '@/components/ui/skeleton';
import { useInView } from 'react-intersection-observer';

export type BibleChapterProps = {
  bookId: string;
  chapterNumber: number;
  versionId?: string;
  onVerseRead?: (verseNumber: number) => void;
};

const BibleChapter = ({ bookId, chapterNumber, versionId = 'kja', onVerseRead }: BibleChapterProps) => {
  const [chapterData, setChapterData] = useState<BibleChapterType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readVerses, setReadVerses] = useState<Set<number>>(new Set());

  // Use ref for the component
  const componentRef = useRef(null);

  useEffect(() => {
    async function loadChapter() {
      setLoading(true);
      try {
        // Try to get the chapter from the database
        const data = await getChapter(bookId, chapterNumber, versionId);
        
        if (data) {
          setChapterData(data);
        } else {
          // If database fetch fails, use mock data
          setChapterData(getChapterMock(bookId, chapterNumber, versionId));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading chapter:', err);
        setChapterData(getChapterMock(bookId, chapterNumber, versionId)); // Fallback to mock data
        setError('Não foi possível carregar o capítulo. Usando dados offline.');
      } finally {
        setLoading(false);
      }
    }
    
    loadChapter();
    // Reset read verses when chapter changes
    setReadVerses(new Set());
  }, [bookId, chapterNumber, versionId]);

  // Mock word definitions - in a real app, this would come from the database
  const mockWordDefinitions: Record<string, WordDefinition> = {
    "deus": {
      original: chapterData?.originalLanguage === 'hebrew' ? 'אֱלֹהִים' : chapterData?.originalLanguage === 'greek' ? 'θεός' : 'ܐܠܗܐ',
      transliteration: chapterData?.originalLanguage === 'hebrew' ? 'Elohim' : chapterData?.originalLanguage === 'greek' ? 'Theos' : 'Alaha',
      definition: "Deus, o Criador e Governante Supremo do universo; a divindade principal.",
      strongsNumber: chapterData?.originalLanguage === 'hebrew' ? 'H430' : 'G2316',
    },
    "céus": {
      original: chapterData?.originalLanguage === 'hebrew' ? 'שָׁמַיִם' : chapterData?.originalLanguage === 'greek' ? 'οὐρανός' : 'ܫܡܝܐ',
      transliteration: chapterData?.originalLanguage === 'hebrew' ? 'Shamayim' : chapterData?.originalLanguage === 'greek' ? 'Ouranos' : 'Shmaya',
      definition: "O firmamento ou céu visível com suas nuvens, estrelas etc.; também usado para o reino celestial.",
      strongsNumber: chapterData?.originalLanguage === 'hebrew' ? 'H8064' : 'G3772',
    },
    "terra": {
      original: chapterData?.originalLanguage === 'hebrew' ? 'אֶרֶץ' : chapterData?.originalLanguage === 'greek' ? 'γῆ' : 'ܐܪܥܐ',
      transliteration: chapterData?.originalLanguage === 'hebrew' ? 'Erets' : chapterData?.originalLanguage === 'greek' ? 'Ge' : 'Ara',
      definition: "A terra, o mundo, solo, país, território ou terra habitável.",
      strongsNumber: chapterData?.originalLanguage === 'hebrew' ? 'H776' : 'G1093',
    },
  };

  // Function to mark a verse as read
  const handleVerseInView = (verseNumber: number) => {
    if (!readVerses.has(verseNumber)) {
      const updatedVerses = new Set(readVerses);
      updatedVerses.add(verseNumber);
      setReadVerses(updatedVerses);
      
      // Notify parent component
      if (onVerseRead) {
        onVerseRead(verseNumber);
      }
    }
  };

  if (loading) {
    return (
      <div className="parchment-container py-6 px-4">
        <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className="parchment-container py-6 px-4 text-center text-ancient-red">
        <p>Erro ao carregar o capítulo.</p>
      </div>
    );
  }

  return (
    <div className="parchment-container py-6 px-4" ref={componentRef}>
      <header className="mb-6 border-b border-parchment-darker/30 pb-4">
        <h2 className="text-3xl font-oldstyle text-ancient-brown text-center">{chapterData.book_name}</h2>
        <h3 className="text-xl font-oldstyle text-center mt-1 text-scripture-heading">Capítulo {chapterData.chapter_number}</h3>
        {error && <p className="text-sm text-ancient-red text-center mt-2">{error}</p>}
      </header>
      
      <ScrollArea className="h-[calc(100vh-220px)] ancient-scroll pr-4">
        <div className="space-y-1">
          {chapterData.verses.length > 0 && (
            <div className="first-letter-drop-cap">
              <BibleVerse 
                key={`${chapterData.book_id}-${chapterData.chapter_number}-${chapterData.verses[0]?.verse_number}`}
                verse={{ ...chapterData.verses[0], text: chapterData.verses[0]?.text }} 
                wordDefinitions={mockWordDefinitions}
                displayVerseNumber={true}
                onInView={() => handleVerseInView(chapterData.verses[0]?.verse_number)}
              />
            </div>
          )}
          
          {chapterData.verses.slice(1).map((verse) => (
            <BibleVerse 
              key={`${chapterData.book_id}-${chapterData.chapter_number}-${verse.verse_number}`}
              verse={verse}
              wordDefinitions={mockWordDefinitions}
              displayVerseNumber={true}
              onInView={() => handleVerseInView(verse.verse_number)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BibleChapter;
