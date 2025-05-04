
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BibleStudy } from '@/types/bible.types';
import { getLocalizedStudyContent, completeStudy, getBibleStudyById } from '@/services/BibleStudyService';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BibleStudyDialogProps {
  study: BibleStudy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => Promise<void> | void;
  isCompleted?: boolean;
}

const BibleStudyDialog = ({ study, open, onOpenChange, onComplete, isCompleted = false }: BibleStudyDialogProps) => {
  const { language } = useLanguage();
  const [localizedContent, setLocalizedContent] = useState<{title: string; content: string}>({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(isCompleted);
  const [nextStudy, setNextStudy] = useState<BibleStudy | null>(null);
  
  const navigate = useNavigate();
  
  // When study changes, get localized content and check for next study
  useEffect(() => {
    if (study) {
      setLocalizedContent(getLocalizedStudyContent(study, language));
      setHasCompleted(isCompleted);
      
      // Check for next study
      const fetchNextStudy = async () => {
        if (study.next_study_id) {
          const nextStudyData = await getBibleStudyById(study.next_study_id);
          setNextStudy(nextStudyData);
        } else {
          setNextStudy(null);
        }
      };
      
      fetchNextStudy();
    } else {
      setLocalizedContent({ title: '', content: '' });
      setNextStudy(null);
    }
  }, [study, language, isCompleted]);
  
  const handleComplete = async () => {
    if (!study) return;
    
    setIsLoading(true);
    const success = await completeStudy(study.id);
    setIsLoading(false);
    
    if (success) {
      setHasCompleted(true);
      if (onComplete) {
        await onComplete();
      }
    }
  };
  
  const handleContinue = () => {
    onOpenChange(false);
    
    if (nextStudy) {
      // Re-open with next study
      setTimeout(() => {
        navigate(`/search?study=${nextStudy.id}`);
      }, 300);
    }
  };
  
  const handleReadBibleReference = (bookId: string, chapter: number, verse: number) => {
    // This is a placeholder - would need to implement text parsing to extract Bible references
    navigate(`/read?book=${bookId}&chapter=${chapter}&verse=${verse}`);
  };
  
  // Process content to extract and make Bible references clickable
  const processContent = (content: string) => {
    // This would need a more sophisticated parser to detect Bible references
    // For now, just return the raw content
    return content;
  };
  
  if (!study) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-oldstyle text-xl text-ancient-brown">
            {localizedContent.title}
          </DialogTitle>
          <DialogDescription className="flex items-center">
            {study.icon || '📖'} Estudo Bíblico • {study.points} pontos
            {hasCompleted && (
              <span className="ml-2 flex items-center text-green-600">
                <CheckCircle size={14} className="mr-1" />
                Concluído
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-4 my-4">
          <div 
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: processContent(localizedContent.content) }}
          />
        </ScrollArea>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {!hasCompleted ? (
            <Button 
              onClick={handleComplete} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Marcando...' : 'Marcar como concluído'}
            </Button>
          ) : nextStudy ? (
            <Button 
              onClick={handleContinue}
              className="w-full sm:w-auto flex items-center"
            >
              Continuar para próximo estudo
              <ChevronRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BibleStudyDialog;
