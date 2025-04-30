
import { useState } from 'react';
import BibleVerse from './BibleVerse';
import { ScrollArea } from '@/components/ui/scroll-area';

export type BibleChapterProps = {
  book: string;
  chapter: number;
  verses: {
    number: number;
    text: string;
  }[];
  originalLanguage: 'hebrew' | 'greek' | 'aramaic';
};

const BibleChapter = ({ book, chapter, verses, originalLanguage }: BibleChapterProps) => {
  // This would be replaced with actual word definitions data
  const mockWordDefinitions = {
    "deus": {
      original: originalLanguage === 'hebrew' ? 'אֱלֹהִים' : originalLanguage === 'greek' ? 'θεός' : 'ܐܠܗܐ',
      transliteration: originalLanguage === 'hebrew' ? 'Elohim' : originalLanguage === 'greek' ? 'Theos' : 'Alaha',
      definition: "Deus, o Criador e Governante Supremo do universo; a divindade principal.",
      strongsNumber: originalLanguage === 'hebrew' ? 'H430' : 'G2316',
    },
    "céus": {
      original: originalLanguage === 'hebrew' ? 'שָׁמַיִם' : originalLanguage === 'greek' ? 'οὐρανός' : 'ܫܡܝܐ',
      transliteration: originalLanguage === 'hebrew' ? 'Shamayim' : originalLanguage === 'greek' ? 'Ouranos' : 'Shmaya',
      definition: "O firmamento ou céu visível com suas nuvens, estrelas etc.; também usado para o reino celestial.",
      strongsNumber: originalLanguage === 'hebrew' ? 'H8064' : 'G3772',
    },
    "terra": {
      original: originalLanguage === 'hebrew' ? 'אֶרֶץ' : originalLanguage === 'greek' ? 'γῆ' : 'ܐܪܥܐ',
      transliteration: originalLanguage === 'hebrew' ? 'Erets' : originalLanguage === 'greek' ? 'Ge' : 'Ara',
      definition: "A terra, o mundo, solo, país, território ou terra habitável.",
      strongsNumber: originalLanguage === 'hebrew' ? 'H776' : 'G1093',
    },
  };

  return (
    <div className="parchment-container py-6 px-4">
      <header className="mb-6 border-b border-parchment-darker/30 pb-4">
        <h2 className="text-3xl font-oldstyle text-ancient-brown text-center">{book}</h2>
        <h3 className="text-xl font-oldstyle text-center mt-1 text-scripture-heading">Capítulo {chapter}</h3>
      </header>
      
      <ScrollArea className="h-[calc(100vh-220px)] ancient-scroll pr-4">
        <div className="space-y-1">
          <div className="first-letter-drop-cap">
            <span className="chapter-number">{verses[0]?.text.charAt(0)}</span>
            <BibleVerse 
              verse={{ ...verses[0], text: verses[0]?.text.substring(1) }} 
              wordDefinitions={mockWordDefinitions}
            />
          </div>
          
          {verses.slice(1).map((verse) => (
            <BibleVerse 
              key={verse.number} 
              verse={verse}
              wordDefinitions={mockWordDefinitions} 
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BibleChapter;
