
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { BibleStudy } from '@/types/bible.types';
import { completeStudy } from '@/services/bible-studies/UserProgressService';
import { getBibleStudyById, getStudyContent } from '@/services/bible-studies/StudyContentService';

interface BibleStudyDialogProps {
  study: BibleStudy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
  isCompleted?: boolean;
}

const BibleStudyDialog = ({ 
  study, 
  open, 
  onOpenChange,
  onComplete,
  isCompleted = false,
}: BibleStudyDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(isCompleted);
  const [nextStudy, setNextStudy] = useState<BibleStudy | null>(null);
  
  const { t, language } = useLanguage();
  
  // Get the localized title
  const title = typeof study.title === 'string' ? 
    study.title : 
    (study.title[language] || study.title_key || 'Bible Study');
    
  // Get content
  const content = getStudyContent(study, language);
  
  useEffect(() => {
    const loadNextStudy = async () => {
      if (study?.next_study_id) {
        try {
          const nextStudyData = await getBibleStudyById(study.next_study_id);
          if (nextStudyData) {
            setNextStudy(nextStudyData);
          }
        } catch (error) {
          console.error('Error loading next study:', error);
        }
      }
    };
    
    if (open && study) {
      loadNextStudy();
      setHasCompleted(isCompleted);
    }
  }, [study, open, isCompleted]);
  
  const handleCompleteStudy = async () => {
    if (hasCompleted) return;
    
    setIsSubmitting(true);
    try {
      // Fix: Remove the second argument that was causing the TS2554 error
      const success = await completeStudy(study.id);
      if (success) {
        setHasCompleted(true);
        toast({
          title: t('studies.completedTitle'),
          description: t('studies.earnedPoints', { points: study.points }),
        });
        
        if (onComplete) {
          onComplete();
        }
      }
    } catch (error) {
      console.error('Error completing study:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('studies.errorCompleting'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-parchment p-6 rounded-xl border-parchment-dark/30 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-oldstyle text-scripture-heading">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t('studies.readAndLearn')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 prose prose-scripture prose-p:my-3 prose-h1:text-xl prose-h2:text-lg prose-h3:text-base max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-3">
          {hasCompleted ? (
            <div className="w-full flex items-center gap-2 text-ancient-gold bg-parchment-dark/20 p-3 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{t('studies.alreadyCompleted')}</p>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handleCompleteStudy}
              className="flex-1 bg-ancient-gold hover:bg-ancient-gold/90"
              disabled={isSubmitting}
            >
              <Award className="mr-2 h-4 w-4" />
              {isSubmitting ? t('common.loading') : t('studies.markAsCompleted')}
            </Button>
          )}
          
          {nextStudy && (
            <Button 
              variant="outline"
              className="flex-1 border-ancient-brown/30 text-ancient-brown"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => {
                  onOpenChange(true);
                }, 100);
              }}
            >
              {t('studies.nextStudy')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BibleStudyDialog;
