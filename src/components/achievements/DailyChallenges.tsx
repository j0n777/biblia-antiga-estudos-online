
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getDailyChallenges } from '@/services/AchievementService';
import { DailyChallenge } from '@/types/bible.types';
import { Target, CheckCircle2 } from 'lucide-react';

const DailyChallenges = () => {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      const data = await getDailyChallenges();
      setChallenges(data);
      setLoading(false);
    };
    
    fetchChallenges();
  }, []);

  if (loading) {
    return <div className="parchment-container p-4">Carregando desafios...</div>;
  }

  if (challenges.length === 0) {
    return (
      <Card className="parchment-container">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Nenhum desafio disponível hoje.
            Volte amanhã para novos desafios!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-oldstyle text-lg text-scripture-heading flex items-center gap-2">
          <Target size={18} className="text-primary" />
          Desafios Diários
        </h3>
      </div>
      
      <div className="space-y-3">
        {challenges.map((challenge) => (
          <Card 
            key={challenge.id}
            className={`parchment-container overflow-hidden ${challenge.completed ? 'border-ancient-gold/50' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`achievement-badge ${challenge.completed ? 'bg-ancient-gold' : 'bg-muted/70'}`}>
                  {challenge.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-oldstyle text-scripture-heading flex items-center">
                      {challenge.name}
                      {challenge.completed && (
                        <CheckCircle2 size={16} className="text-ancient-gold ml-2" />
                      )}
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {challenge.points} XP
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progresso</span>
                      <span>{challenge.progress || 0}/{challenge.chapters_required}</span>
                    </div>
                    <Progress 
                      value={((challenge.progress || 0) / challenge.chapters_required) * 100} 
                      className={`h-1.5 ${challenge.completed ? 'bg-ancient-gold/20' : 'bg-muted'}`}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DailyChallenges;
