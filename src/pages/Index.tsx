import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import VerseOfTheDay from '@/components/home/VerseOfTheDay';
import StreakDisplay from '@/components/achievements/StreakDisplay';
import BadgeProgress from '@/components/achievements/BadgeProgress';
import ThemeToggle from '@/components/ThemeToggle';
import StyleDebug from '@/components/debug/StyleDebug';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Trophy, ExternalLink, Home } from 'lucide-react';
import { getUserProfile } from '@/services';
import { getUserStreak, getUserAchievements } from '@/services/AchievementService';
import { UserProfile, Achievement } from '@/types/bible.types';
const bibleStudies = [{
  id: '1',
  title: 'Por onde começar a ler a Bíblia?',
  description: 'Um guia para iniciantes na leitura bíblica',
  icon: '📖',
  category: 'beginner'
}, {
  id: '2',
  title: 'Os 10 Mandamentos',
  description: 'Estudo sobre os mandamentos e sua aplicação hoje',
  icon: '📜',
  category: 'doctrine'
}, {
  id: '3',
  title: 'Vida de Jesus',
  description: 'Jornada pelos evangelhos e a vida de Cristo',
  icon: '✝️',
  category: 'biography'
}, {
  id: '4',
  title: 'Salmos de Adoração',
  description: 'Meditações nos Salmos de louvor',
  icon: '🙏',
  category: 'devotional'
}];
const Index = () => {
  const navigate = useNavigate();
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

  // Convert achievements to badge format for BadgeProgress component
  const badges = achievements.slice(0, 3).map(achievement => ({
    id: achievement.id,
    name: achievement.title,
    description: achievement.description,
    progress: achievement.progress || 0,
    maxProgress: achievement.total || 1,
    unlocked: achievement.earned || false,
    icon: achievement.icon
  }));

  // In a real app, this data would come from an API or local storage
  const mockVerseOfDay = {
    reference: "João 3:16",
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    version: "King James Atualizada"
  };
  console.log('=== INDEX RENDER DEBUG ===');
  console.log('Renderizando Index page');
  return <PageLayout>
      <StyleDebug />
      
      {/* Header with consistent styling */}
      <div className="page-header">
        <div className="flex justify-between items-center py-[16px] px-[12px]">
          <div className="flex items-center gap-2">
            <Home size={24} className="text-ancient-gold" />
            <h1 className="text-2xl font-oldstyle text-scripture-heading">Bíblia de Estudos Original</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      {/* Content in styled box with consistent margins */}
      <div className="page-content">
        <div className="content-box">
          <div className="space-y-6">
            <div className="card" style={{
            backgroundColor: '#f8f5ea',
            border: '1px solid rgba(156, 142, 99, 0.25)',
            borderRadius: '0.75rem'
          }}>
              <VerseOfTheDay reference={mockVerseOfDay.reference} text={mockVerseOfDay.text} version={mockVerseOfDay.version} />
            </div>
            
            <div className="card" style={{
            backgroundColor: '#f8f5ea',
            border: '1px solid rgba(156, 142, 99, 0.25)',
            borderRadius: '0.75rem'
          }}>
              <StreakDisplay currentStreak={streakData.current} longestStreak={streakData.longest} />
            </div>
            
            <div className="card" style={{
            backgroundColor: '#f8f5ea',
            border: '1px solid rgba(156, 142, 99, 0.25)',
            borderRadius: '0.75rem'
          }}>
              <BadgeProgress badges={badges} />
            </div>
            
            {/* Bible Studies Section with subtitle box */}
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
                <BookOpen size={20} className="text-ancient-gold" />
                <h2 className="text-xl subtitle-text">Estudos Bíblicos</h2>
                <div className="flex-1"></div>
                <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-ancient-gold" onClick={() => navigate('/search')}>
                  Ver todos
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bibleStudies.map(study => <div key={study.id} className="card overflow-hidden hover:shadow-md transition-shadow" style={{
                backgroundColor: '#f8f5ea',
                border: '1px solid rgba(156, 142, 99, 0.25)',
                borderRadius: '0.75rem'
              }}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="h-12 w-12 flex items-center justify-center text-2xl bg-ancient-gold/20 rounded-xl">
                        {study.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-oldstyle text-bible-title">{study.title}</h3>
                        <p className="text-sm text-muted-foreground">{study.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0 hover:bg-ancient-gold/10">
                        <ExternalLink className="h-5 w-5 text-ancient-brown" />
                      </Button>
                    </CardContent>
                  </div>)}
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline" className="flex gap-2" onClick={() => navigate('/search')}>
                  <BookOpen size={16} />
                  <span>Buscar estudos</span>
                </Button>
              </div>
            </div>
            
            {/* Incentives for registration */}
            {!profile?.id || profile?.id.startsWith('guest-') ? <div className="card border-ancient-gold/20" style={{
            backgroundColor: '#f8f5ea',
            border: '1px solid rgba(156, 142, 99, 0.25)',
            borderRadius: '0.75rem'
          }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-ancient-gold/20 text-ancient-gold">
                      <Trophy size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-oldstyle text-bible-title">Desbloqueie seu potencial</h3>
                      <p className="text-sm text-muted-foreground">Crie uma conta para salvar seu progresso e participar do ranking</p>
                    </div>
                    <Button className="bg-ancient-gold text-white hover:bg-ancient-gold/90" onClick={() => navigate('/auth')}>
                      Criar conta
                    </Button>
                  </div>
                </CardContent>
              </div> : null}
          </div>
        </div>
      </div>
    </PageLayout>;
};
export default Index;