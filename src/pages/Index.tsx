
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import VerseOfTheDay from '@/components/home/VerseOfTheDay';
import ReadingStreak from '@/components/achievements/ReadingStreak';
import BadgeProgress from '@/components/achievements/BadgeProgress';
import ThemeToggle from '@/components/ThemeToggle';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Trophy, ExternalLink } from 'lucide-react';
import { getUserProfile } from '@/services/AchievementService';
import { UserProfile } from '@/types/bible.types';

const bibleStudies = [
  {
    id: '1',
    title: 'Por onde começar a ler a Bíblia?',
    description: 'Um guia para iniciantes na leitura bíblica',
    icon: '📖',
    category: 'beginner'
  },
  {
    id: '2',
    title: 'Os 10 Mandamentos',
    description: 'Estudo sobre os mandamentos e sua aplicação hoje',
    icon: '📜',
    category: 'doctrine'
  },
  {
    id: '3',
    title: 'Vida de Jesus',
    description: 'Jornada pelos evangelhos e a vida de Cristo',
    icon: '✝️',
    category: 'biography'
  },
  {
    id: '4',
    title: 'Salmos de Adoração',
    description: 'Meditações nos Salmos de louvor',
    icon: '🙏',
    category: 'devotional'
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const loadUserProfile = async () => {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
    };
    
    loadUserProfile();
  }, []);
  
  // In a real app, this data would come from an API or local storage
  const mockVerseOfDay = {
    reference: "João 3:16",
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    version: "King James Atualizada"
  };

  const mockStreak = {
    currentStreak: profile?.streak_count || 5,
    longestStreak: profile?.streak_count || 14,
    goalProgress: 75,
  };

  const mockBadges = [
    {
      id: "1",
      name: "Gênesis",
      description: "Completou a leitura de Gênesis",
      progress: 50,
      maxProgress: 50,
      unlocked: true,
      icon: "📖"
    },
    {
      id: "2",
      name: "Estudioso",
      description: "7 dias consecutivos de leitura",
      progress: (profile?.streak_count || 5),
      maxProgress: 7,
      unlocked: (profile?.streak_count || 0) >= 7,
      icon: "🔍"
    },
    {
      id: "3",
      name: "Compartilhador",
      description: "Compartilhou 10 versículos",
      progress: 3,
      maxProgress: 10,
      unlocked: false,
      icon: "📤"
    },
  ];

  return (
    <PageLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-oldstyle text-scripture-heading">Bíblia Antiga</h1>
          <ThemeToggle />
        </div>
      
        <div className="space-y-6">
          <VerseOfTheDay 
            reference={mockVerseOfDay.reference}
            text={mockVerseOfDay.text}
            version={mockVerseOfDay.version}
          />
          
          <ReadingStreak 
            currentStreak={mockStreak.currentStreak}
            longestStreak={mockStreak.longestStreak}
            goalProgress={mockStreak.goalProgress}
          />
          
          <BadgeProgress badges={mockBadges} />
          
          {/* Bible Studies Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-oldstyle text-scripture-heading">Estudos Bíblicos</h2>
              <Button variant="ghost" size="sm" className="text-sm text-muted-foreground" onClick={() => navigate('/search')}>
                Ver todos
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bibleStudies.map(study => (
                <Card key={study.id} className="parchment-container overflow-hidden">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-12 w-12 flex items-center justify-center text-2xl bg-ancient-gold/20 rounded">
                      {study.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-oldstyle text-scripture-heading">{study.title}</h3>
                      <p className="text-sm text-muted-foreground">{study.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ExternalLink className="h-5 w-5 text-ancient-brown" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                className="flex gap-2 bg-parchment-light border-parchment-dark/30"
                onClick={() => navigate('/search')}
              >
                <BookOpen size={16} />
                <span>Buscar estudos</span>
              </Button>
            </div>
          </div>
          
          {/* Incentives for registration */}
          {!profile?.id.startsWith('guest-') && (
            <Card className="parchment-container border-ancient-gold/20 bg-parchment-light/80">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-ancient-gold/20 text-ancient-gold">
                    <Trophy size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-oldstyle text-scripture-heading">Desbloqueie seu potencial</h3>
                    <p className="text-sm text-muted-foreground">Crie uma conta para salvar seu progresso e participar do ranking</p>
                  </div>
                  <Button 
                    className="bg-ancient-gold text-white hover:bg-ancient-gold/90"
                    onClick={() => navigate('/auth')}
                  >
                    Criar conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
