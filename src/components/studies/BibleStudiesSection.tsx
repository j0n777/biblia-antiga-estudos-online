
import { useState, useEffect } from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { BibleStudy } from '@/types/bible.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BibleStudyCard from './BibleStudyCard';
import { getAllBibleStudies } from '@/services/bible-studies/StudyContentService';

interface BibleStudiesSectionProps {
  onStudyClick?: (study: BibleStudy) => void;
}

const BibleStudiesSection = ({ onStudyClick }: BibleStudiesSectionProps) => {
  const [studies, setStudies] = useState<BibleStudy[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBibleStudies();
  }, []);

  const loadBibleStudies = async () => {
    setIsLoading(true);
    try {
      const studiesData = await getAllBibleStudies();
      setStudies(studiesData);
    } catch (error) {
      console.error('Error loading Bible studies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-parchment-light/90 border-parchment-dark/20 rounded-xl">
        <CardContent className="p-6">
          <div className="flex justify-center items-center py-8">
            <BookOpen className="h-6 w-6 animate-pulse text-ancient-gold" />
            <span className="ml-2 text-muted-foreground">Carregando estudos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (studies.length === 0) {
    return (
      <Card className="bg-parchment-light/90 border-parchment-dark/20 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold font-oldstyle text-scripture-heading flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-ancient-gold" />
            Estudos Bíblicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum estudo bíblico disponível no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-parchment-light/90 border-parchment-dark/20 rounded-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold font-oldstyle text-scripture-heading flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-ancient-gold" />
            Estudos Bíblicos Disponíveis
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-ancient-gold hover:bg-ancient-gold/10 rounded-lg"
          >
            Ver todos
            <ExternalLink className="h-4 w-4 ml-1" />
          </Button>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Explore estudos temáticos para aprofundar seu conhecimento bíblico.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {studies.map((study) => (
          <BibleStudyCard
            key={study.id}
            study={study}
            onClick={() => onStudyClick?.(study)}
            compact={true}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default BibleStudiesSection;
