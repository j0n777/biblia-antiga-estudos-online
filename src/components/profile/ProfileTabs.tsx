
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AchievementList from '../achievements/AchievementList';
import ViewAllAchievements from '@/components/profile/ViewAllAchievements';
import StatisticsTab from '@/components/profile/StatisticsTab';
import { Achievement } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  achievements: Achievement[];
}

const ProfileTabs = ({ activeTab, onTabChange, achievements }: ProfileTabsProps) => {
  const { t } = useLanguage();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mt-4">
      <TabsList className="w-full bg-parchment-light rounded-xl">
        <TabsTrigger value="conquistas" className="flex-1 rounded-xl text-sm">
          {t('profile.achievements') || "Conquistas"}
        </TabsTrigger>
        <TabsTrigger value="estatisticas" className="flex-1 rounded-xl text-sm">
          {t('profile.stats') || "Estatísticas"}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="conquistas" className="mt-3 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-oldstyle text-scripture-heading font-semibold">Suas Conquistas</h3>
          <ViewAllAchievements />
        </div>
        <AchievementList achievements={achievements.slice(0, 4)} />
      </TabsContent>
      
      <TabsContent value="estatisticas" className="mt-3 space-y-3">
        <StatisticsTab />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
