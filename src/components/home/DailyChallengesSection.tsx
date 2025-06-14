
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Award, Clock, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const DailyChallengesSection = () => {
  const navigate = useNavigate();

  // Mock challenges data - simplified version
  const mockChallenges = [
    {
      id: '1',
      title: 'Leitura Diária',
      description: 'Leia um capítulo da Bíblia hoje',
      progress: 0,
      isCompleted: false,
      points: 10,
      timeRemaining: '8h 30m'
    },
    {
      id: '2',
      title: 'Estudo Bíblico',
      description: 'Complete um estudo bíblico',
      progress: 50,
      isCompleted: false,
      points: 20,
      timeRemaining: '8h 30m'
    }
  ];

  return (
    <div className="card space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-ancient-gold" />
          <h2 className="text-xl subtitle-text">Desafios Diários</h2>
        </div>
        <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-ancient-gold" onClick={() => navigate('/community')}>
          Ver todos
        </Button>
      </div>
      
      <div className="space-y-4">
        {mockChallenges.map((challenge) => (
          <Card key={challenge.id} className="p-4 rounded-xl overflow-hidden border-parchment-dark/20 bg-parchment-light/60">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3 items-start">
                <div className="mt-1 bg-parchment-dark/20 w-10 h-10 rounded-full flex items-center justify-center text-ancient-gold">
                  📖
                </div>
                <div>
                  <h3 className="font-medium text-ancient-brown mb-1">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-scripture-text/80">
                    {challenge.description}
                  </p>
                </div>
              </div>
              
              {challenge.isCompleted ? (
                <div className="flex items-center text-ancient-gold text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>Concluído</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{challenge.timeRemaining}</span>
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <div className="flex justify-between text-xs text-ancient-brown mb-1">
                <span>{challenge.progress}% concluído</span>
                <span>{challenge.points} XP</span>
              </div>
              <Progress 
                value={challenge.progress} 
                className="h-2 bg-parchment-dark/20" 
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DailyChallengesSection;
