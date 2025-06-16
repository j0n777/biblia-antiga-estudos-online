
import React, { useState } from 'react';
import WordDefinitionPopup from './WordDefinitionPopup';

interface ClickableWordProps {
  word: string;
  versionId: string;
  bookId: string;
  chapterNumber: number;
  verseNumber: number;
  children: React.ReactNode;
}

const ClickableWord = ({
  word,
  versionId,
  bookId,
  chapterNumber,
  verseNumber,
  children
}: ClickableWordProps) => {
  const [showDefinition, setShowDefinition] = useState(false);
  
  // Remover pontuação da palavra para busca
  const cleanWord = word.replace(/[^\w\u00C0-\u017F]/g, '');
  
  // Só tornar clicável se a palavra tiver mais de 2 caracteres
  if (cleanWord.length <= 2) {
    return <>{children}</>;
  }
  
  return (
    <>
      <span
        className="cursor-pointer hover:bg-blue-100/50 hover:text-blue-800 transition-colors duration-150 rounded px-0.5"
        onClick={() => setShowDefinition(true)}
        title="Clique para ver a definição"
      >
        {children}
      </span>
      
      <WordDefinitionPopup
        word={cleanWord}
        versionId={versionId}
        bookId={bookId}
        chapterNumber={chapterNumber}
        verseNumber={verseNumber}
        open={showDefinition}
        onOpenChange={setShowDefinition}
      />
    </>
  );
};

export default ClickableWord;
