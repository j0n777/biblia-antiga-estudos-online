
import { useState } from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { BibleStudy } from '@/types/bible.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

// Helper function to get localized study content
function getLocalizedStudyContent(study: BibleStudy, language: string = 'en'): string {
  if (!study || !study.content) return '';
  
  if (typeof study.content === 'string') {
    return study.content;
  }
  
  // If content is an object with direct language keys
  if (typeof study.content === 'object' && study.content[language]) {
    return study.content[language];
  }
  
  // If content has a content field which is language-specific
  if (typeof study.content === 'object' && 
      study.content.content && 
      typeof study.content.content === 'object') {
    return study.content.content[language] || study.content.content.en || '';
  }
  
  return '';
}

interface BibleStudyCardProps {
  study: BibleStudy;
  isCompleted?: boolean;
  onClick?: () => void;
}

const BibleStudyCard = ({ study, isCompleted = false, onClick }: BibleStudyCardProps) => {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  
  // Get the localized title
  const title = typeof study.title === 'string' ? 
    study.title : 
    (study.title[language] || study.title_key || 'Bible Study');
    
  // Get description from content
  let description = '';
  if (typeof study.content === 'object' && study.content.description) {
    description = typeof study.content.description === 'string' ?
      study.content.description :
      (study.content.description[language] || '');
  }
  
  return (
    <Card 
      className={`overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border-parchment-dark/20 ${isHovered ? 'shadow-lg' : ''} ${isCompleted ? 'bg-parchment-light/90 border-ancient-gold/30' : 'bg-parchment-light/60'}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-3 p-4">
          <div className="h-12 w-12 flex items-center justify-center text-2xl bg-ancient-gold/20 rounded">
            {study.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-oldstyle text-scripture-heading flex items-center gap-2">
              {title}
              {isCompleted && <CheckCircle className="h-4 w-4 text-ancient-gold" />}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0">
            <ExternalLink className="h-5 w-5 text-ancient-brown" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BibleStudyCard;
