
import React, { useState, useEffect } from 'react';
import { hasStrongsDefinition } from '@/services/bible/StrongsService';
import WordDefinitionPopup from './WordDefinitionPopup';

interface SmartClickableWordProps {
  word: string;
  versionId: string;
  bookId: string;
  chapterNumber: number;
  verseNumber: number;
  children: React.ReactNode;
}

const SmartClickableWord = ({
  word,
  versionId,
  bookId,
  chapterNumber,
  verseNumber,
  children
}: SmartClickableWordProps) => {
  const [showDefinition, setShowDefinition] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  // Remover pontuação da palavra para busca
  const cleanWord = word.replace(/[^\w\u00C0-\u017F]/g, '');
  
  useEffect(() => {
    // Só verificar palavras com mais de 2 caracteres
    if (cleanWord.length <= 2) {
      setIsClickable(false);
      return;
    }
    
    let isMounted = true;
    
    const checkWordAvailability = async () => {
      setIsChecking(true);
      try {
        const hasDefinition = await hasStrongsDefinition(cleanWord);
        if (isMounted) {
          setIsClickable(hasDefinition);
        }
      } catch (error) {
        console.error('Error checking word availability:', error);
        if (isMounted) {
          setIsClickable(false);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };
    
    checkWordAvailability();
    
    return () => {
      isMounted = false;
    };
  }, [cleanWord]);
  
  // Se não for clicável, retornar apenas o conteúdo
  if (!isClickable) {
    return <>{children}</>;
  }
  
  return (
    <>
      <span
        className={`cursor-pointer transition-colors duration-150 rounded px-0.5 ${
          isChecking 
            ? 'bg-gray-100/30' 
            : 'hover:bg-blue-100/50 hover:text-blue-800 hover:underline decoration-dotted'
        }`}
        onClick={() => !isChecking && setShowDefinition(true)}
        title={isChecking ? "Verificando definição..." : "Clique para ver a definição Strong's"}
      >
        {children}
      </span>
      
      {showDefinition && (
        <WordDefinitionPopup
          word={cleanWord}
          versionId={versionId}
          bookId={bookId}
          chapterNumber={chapterNumber}
          verseNumber={verseNumber}
          open={showDefinition}
          onOpenChange={setShowDefinition}
        />
      )}
    </>
  );
};

export default SmartClickableWord;
