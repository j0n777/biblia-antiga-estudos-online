
import { Award, Trophy, Heart } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CommunityMobileNavProps {
  activeTab: 'challenges' | 'leaderboard' | 'prayers';
  onTabChange: (tab: 'challenges' | 'leaderboard' | 'prayers') => void;
}

const CommunityMobileNav = ({ activeTab, onTabChange }: CommunityMobileNavProps) => (
  <div className="md:hidden mb-4">
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as any)} className="w-full">
      <TabsList className="grid grid-cols-3" style={{ backgroundColor: '#f8f5ea', border: '1px solid rgba(156, 142, 99, 0.25)' }}>
        <TabsTrigger value="challenges" className="text-xs">
          <Award className="h-4 w-4 mr-1" /> Desafios
        </TabsTrigger>
        <TabsTrigger value="leaderboard" className="text-xs">
          <Trophy className="h-4 w-4 mr-1" /> Ranking
        </TabsTrigger>
        <TabsTrigger value="prayers" className="text-xs">
          <Heart className="h-4 w-4 mr-1" /> Orações
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
);

export default CommunityMobileNav;
