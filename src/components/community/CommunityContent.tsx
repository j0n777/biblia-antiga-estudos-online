
import { Award, Trophy } from 'lucide-react';
import DailyChallenges from '@/components/achievements/DailyChallenges';
import Leaderboard from '@/components/achievements/Leaderboard';
import PrayerRequestsSection from './PrayerRequestsSection';
import { UserProfile } from '@/types/bible.types';

interface CommunityContentProps {
  activeTab: 'challenges' | 'leaderboard' | 'prayers';
  profile: UserProfile | null;
}

const CommunityContent = ({ activeTab, profile }: CommunityContentProps) => {
  return (
    <div className="space-y-6">
      {activeTab === 'challenges' && (
        <div className="animate-slide-up">
          <div className="subtitle-box" style={{ backgroundColor: '#f8f5ea', border: '1px solid rgba(156, 142, 99, 0.25)', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(92, 63, 23, 0.06)', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} className="text-ancient-gold" />
            <h2 className="text-xl font-oldstyle text-scripture-heading">Desafios Diários</h2>
          </div>
          <DailyChallenges />
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
