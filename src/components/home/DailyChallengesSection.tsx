
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import DailyChallenges from '@/components/achievements/DailyChallenges';

const DailyChallengesSection = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="subtitle-box" style={{
        backgroundColor: '#f8f5ea',
        border: '1px solid rgba(156, 142, 99, 0.25)',
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Award size={20} className="text-ancient-gold" />
        <h2 className="text-xl subtitle-text">Desafios Diários</h2>
        <div className="flex-1"></div>
        <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-ancient-gold" onClick={() => navigate('/community')}>
          Ver todos
        </Button>
      </div>
      
      <div className="card" style={{
        backgroundColor: '#f8f5ea',
        border: '1px solid rgba(156, 142, 99, 0.25)',
        borderRadius: '0.75rem'
      }}>
        <DailyChallenges />
      </div>
    </div>
  );
};

export default DailyChallengesSection;
