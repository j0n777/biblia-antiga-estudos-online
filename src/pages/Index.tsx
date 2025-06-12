
import { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import StyleDebug from '@/components/debug/StyleDebug';
import HomeHeader from '@/components/home/HomeHeader';
import VerseOfTheDaySection from '@/components/home/VerseOfTheDaySection';
import StreakSection from '@/components/home/StreakSection';
import BadgeSection from '@/components/home/BadgeSection';
import DailyChallengesSection from '@/components/home/DailyChallengesSection';
import BibleStudiesSection from '@/components/home/BibleStudiesSection';
import RegistrationIncentive from '@/components/home/RegistrationIncentive';
import { getUserProfile } from '@/services';
import { getUserStreak, getUserAchievements } from '@/services/AchievementService';
import { UserProfile, Achievement } from '@/types/bible.types';

const Index = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streakData, setStreakData] = useState({
    current: 0,
    longest: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      const userProfile = await getUserProfile();
      setProfile(userProfile);

      // Get real streak data
      const streakInfo = await getUserStreak();
      setStreakData(streakInfo);

      // Get real achievements data
      const userAchievements = await getUserAchievements();
      setAchievements(userAchievements);
    };
    loadUserData();
  }, []);

  console.log('=== INDEX RENDER DEBUG ===');
  console.log('Renderizando Index page');

  return (
    <PageLayout>
      <StyleDebug />
      
      <HomeHeader />
      
      {/* Content in styled box with consistent margins */}
      <div className="page-content">
        <div className="content-box">
          <div className="space-y-6">
            <VerseOfTheDaySection />
            
            <StreakSection 
              currentStreak={streakData.current} 
              longestStreak={streakData.longest} 
            />
            
            <BadgeSection achievements={achievements} />
            
            <DailyChallengesSection />
            
            <BibleStudiesSection />
            
            <RegistrationIncentive profile={profile} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
