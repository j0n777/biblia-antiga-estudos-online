
import { useState } from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { BibleStudy } from '@/types/bible.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface BibleStudyCardProps {
  study: BibleStudy;
  isCompleted?: boolean;
  onClick?: () => void;
  compact?: boolean; // Added for compatibility
}

const BibleStudyCard = ({ study, isCompleted = false, onClick, compact = false }: BibleStudyCardProps) => {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  
  // Get the localized title
  const title = typeof study.title === 'string' ? 
    study.title : 
    (study.title[language] || study.title_key || 'Bible Study');
    
  // Get description
  let description = '';
  if (study.description) {
    // If study has direct description property
    if (typeof study.description === 'string') {
      description = study.description;
    } else {
      description = study.description[language] || '';
    }
  } else if (typeof study.content === 'object') {
    // Try to get description from content object
    if ('description' in study.content) {
      const descContent = study.content.description;
      description = typeof descContent === 'string' ? descContent : (descContent?.[language] || '');
    } else if ('content' in study.content && study.content.content && 'description' in study.content.content) {
      const descContent = study.content.content.description;
      description = typeof descContent === 'string' ? descContent : (descContent || '');
    }
  }
  
  // Get icon or use default
  const icon = study.icon || '📖';
  
  return (
    <Card 
      className={`overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border-parchment-dark/20 ${isHovered ? 'shadow-lg' : ''} ${isCompleted ? 'bg-parchment-light/90 border-ancient-gold/30' : 'bg-parchment-light/60'}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className={`p-0 ${compact ? 'p-2' : 'p-4'}`}>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 flex items-center justify-center text-2xl bg-ancient-gold/20 rounded">
            {icon}
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
