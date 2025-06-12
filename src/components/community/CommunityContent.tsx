
import { Award, Trophy, Clock, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Leaderboard from '@/components/achievements/Leaderboard';
import PrayerRequestsSection from './PrayerRequestsSection';
import { UserProfile } from '@/types/bible.types';

interface CommunityContentProps {
  activeTab: 'challenges' | 'leaderboard' | 'prayers';
  profile: UserProfile | null;
}

const CommunityContent = ({ activeTab, profile }: CommunityContentProps) => {
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
    },
    {
      id: '3',
      title: 'Sequência de Leitura',
      description: 'Mantenha uma sequência de 7 dias',
      progress: 71,
      isCompleted: false,
      points: 50,
      timeRemaining: '8h 30m'
    }
  ];

  return (
    <div className="space-y-6">
      {activeTab === 'challenges' && (
        <div className="animate-slide-up">
          <div className="subtitle-box" style={{ backgroundColor: '#f8f5ea', border: '1px solid rgba(156, 142, 99, 0.25)', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(92, 63, 23, 0.06)', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} className="text-ancient-gold" />
            <h2 className="text-xl font-oldstyle text-scripture-heading">Desafios Diários</h2>
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
      )}
      
      {activeTab === 'leaderboard' && (
        <div className="animate-slide-up">
          <div className="subtitle-box" style={{ backgroundColor: '#f8f5ea', border: '1px solid rgba(156, 142, 99, 0.25)', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(92, 63, 23, 0.06)', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={20} className="text-ancient-gold" />
            <h2 className="text-xl font-oldstyle text-scripture-heading">Classificação</h2>
          </div>
          <Leaderboard />
        </div>
      )}

      {activeTab === 'prayers' && (
        <PrayerRequestsSection profile={profile} initialPrayerRequests={[]} />
      )}
    </div>
  );
};

export default CommunityContent;
