
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Check, Clock, Award } from 'lucide-react';
import { BibleStudy } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';
import { completeStudy } from '@/services/bible-studies/UserProgressService';
import { toast } from '@/hooks/use-toast';
import Markdown from 'react-markdown';

interface BibleStudyDialogProps {
  study: BibleStudy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
  isCompleted?: boolean;
}

const BibleStudyDialog: React.FC<BibleStudyDialogProps> = ({
  study,
  open,
  onOpenChange,
  onComplete,
  isCompleted = false
}) => {
  const [isCompletingStudy, setIsCompletingStudy] = useState(false);
  const { language } = useLanguage();
  
  // Handle localized content
  const getLocalizedContent = () => {
    if (!study) return '';
    
    if (typeof study.content === 'string') {
      return study.content;
    }
    
    // Handle content as an object with language keys
    if (typeof study.content === 'object') {
      // First try to access it directly
      if (study.content[language]) {
        return study.content[language];
      }
      
      // Then try the nested content structure
      if (study.content.content && study.content.content[language]) {
        return study.content.content[language];
      }
    }
    
    // Fallback
    return '';
  };
  
  // Get localized title
  const getLocalizedTitle = () => {
    if (!study) return '';
    
    if (typeof study.title === 'string') {
      return study.title;
    }
    
    if (typeof study.title === 'object' && study.title[language]) {
      return study.title[language];
    }
    
    return study.title_key || 'Study';
  };
  
  const handleCompleteStudy = async () => {
    setIsCompletingStudy(true);
    
    try {
      await completeStudy(study.id);
      toast({
        title: "Estudo concluído!",
        description: `Você ganhou ${study.points || 10} pontos de experiência.`
      });
      
      if (onComplete) {
        onComplete();
      }
      
      // Close the dialog after a small delay
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (error) {
      console.error("Error completing study:", error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar este estudo como concluído.",
        variant: "destructive"
      });
    } finally {
      setIsCompletingStudy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col bg-parchment">
        <DialogHeader>
          <DialogTitle className="text-2xl font-oldstyle text-scripture-heading flex items-center gap-2">
            {study.icon || '📖'} {getLocalizedTitle()}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-ancient-brown">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>5-10 min</span>
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-1" />
              <span>{study.points || 10} pontos</span>
            </div>
            {isCompleted && (
              <div className="ml-auto flex items-center text-emerald-600">
                <Check className="w-4 h-4 mr-1" />
                <span>Concluído</span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-6 py-4">
          <div className="prose prose-ancient max-w-none">
            <Markdown>{getLocalizedContent()}</Markdown>
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex justify-between items-center mt-4 gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          
          {!isCompleted && (
            <Button 
              onClick={handleCompleteStudy}
              disabled={isCompletingStudy}
              className="bg-ancient-gold hover:bg-ancient-gold/90"
            >
              {isCompletingStudy ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Marcar como Concluído
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BibleStudyDialog;
