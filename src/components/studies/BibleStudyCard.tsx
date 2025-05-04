
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BibleStudy } from '@/types/bible.types';
import { getLocalizedStudyContent } from '@/services/BibleStudyService';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle } from 'lucide-react';

interface BibleStudyCardProps {
  study: BibleStudy;
  isCompleted: boolean;
  onSelectStudy: (study: BibleStudy) => void;
}

const BibleStudyCard = ({ study, isCompleted, onSelectStudy }: BibleStudyCardProps) => {
  const { language } = useLanguage();
  const { title } = getLocalizedStudyContent(study, language);
  
  // Get icon based on category
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'basics':
        return '🔤';
      case 'beginner':
        return '🌱';
      case 'intermediate':
        return '📘';
      case 'advanced':
        return '🎓';
      default:
        return study.icon || '📖';
    }
  };

  return (
    <Card className="overflow-hidden border-ancient-gold/30 hover:border-ancient-gold/60 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="mr-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{study.icon || getCategoryIcon(study.category)}</span>
              <CardTitle className="font-oldstyle text-ancient-brown">{title}</CardTitle>
            </div>
            <CardDescription className="text-xs mt-1">
              {isCompleted ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle size={14} className="mr-1" />
                  Concluído • {study.points} pontos
                </span>
              ) : (
                <span>Estudo Bíblico • {study.points} pontos</span>
              )}
            </CardDescription>
          </div>
          {isCompleted && (
            <div className="bg-green-500/10 rounded-full p-1">
              <CheckCircle size={16} className="text-green-600" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm line-clamp-2">
          {/* Just show a preview of the first few characters */}
          {getLocalizedStudyContent(study, language).content.slice(0, 100)}...
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onSelectStudy(study)}
        >
          {isCompleted ? 'Ler Novamente' : 'Ler Estudo'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BibleStudyCard;
