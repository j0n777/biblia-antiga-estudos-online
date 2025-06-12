
import { Award, Trophy, Heart } from 'lucide-react';
import CommunityMenuItem from './CommunityMenuItem';

interface CommunityDesktopNavProps {
  activeTab: 'challenges' | 'leaderboard' | 'prayers';
  onTabChange: (tab: 'challenges' | 'leaderboard' | 'prayers') => void;
}

const CommunityDesktopNav = ({ activeTab, onTabChange }: CommunityDesktopNavProps) => (
  <div className="space-y-2 hidden md:block">
    <CommunityMenuItem
      title="Desafios Diários"
      description="Complete desafios para ganhar XP"
      icon={Award}
      active={activeTab === 'challenges'}
      onClick={() => onTabChange('challenges')}
    />
    <CommunityMenuItem
      title="Classificação"
      description="Veja quem mais está estudando"
      icon={Trophy}
      active={activeTab === 'leaderboard'}
      onClick={() => onTabChange('leaderboard')}
    />
    <CommunityMenuItem
      title="Pedidos de Oração"
      description="Compartilhe e ore pelos pedidos"
      icon={Heart}
      active={activeTab === 'prayers'}
      onClick={() => onTabChange('prayers')}
    />
  </div>
);

export default CommunityDesktopNav;
