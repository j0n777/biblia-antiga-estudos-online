
import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Share2, BookOpen, Trophy, Medal, LineChart, BadgeCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ReadingStreak from '@/components/achievements/ReadingStreak';
import AchievementList from '@/components/achievements/AchievementList';
import DailyChallenges from '@/components/achievements/DailyChallenges';
import Leaderboard from '@/components/achievements/Leaderboard';
import SettingsDialog from '@/components/profile/SettingsDialog';
import ViewAllAchievements from '@/components/profile/ViewAllAchievements';
import { getUserAchievements, getUserProfile } from '@/services/AchievementService';
import { Achievement, UserProfile } from '@/types/bible.types';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('conquistas');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const navigate = useNavigate();
  
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const userAchievements = await getUserAchievements();
      const userProfile = await getUserProfile();
      
      setAchievements(userAchievements);
      setProfile(userProfile);
    };
    
    if (isLoading === false) {
      fetchUserData();
    }
  }, [isLoading]);
  
  const handleProfileUpdate = async () => {
    const userProfile = await getUserProfile();
    setProfile(userProfile);
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <div className="py-6">
          <div className="h-96 flex items-center justify-center">
            <p>Carregando...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-oldstyle text-scripture-heading">Meu Perfil</h1>
          <SettingsDialog profile={profile} onProfileUpdate={handleProfileUpdate} />
        </div>
        
        {!isAuthenticated && (
          <Alert className="mb-6 bg-parchment-light border-ancient-gold/40">
            <AlertCircle className="h-4 w-4 text-ancient-gold" />
            <AlertTitle className="text-ancient-brown">Modo visitante</AlertTitle>
            <AlertDescription className="text-sm">
              Você está navegando como visitante. Crie uma conta para salvar seu progresso, conquistas e participar do ranking.
              <div className="mt-2">
                <Button onClick={() => navigate('/auth')} className="bg-ancient-gold text-white hover:bg-ancient-gold/90">
                  Criar conta / Entrar
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 border-4 border-ancient-brown rounded-full mb-3">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-ancient-brown text-white text-3xl font-oldstyle">
              {profile?.display_name?.[0] || profile?.nickname?.[0] || 'V'}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-oldstyle text-ancient-brown">
            {profile?.display_name || profile?.nickname || "Visitante"}
          </h2>
          
          <div className="flex items-center gap-2 mt-1">
            <Medal size={16} className="text-ancient-gold" />
            <span className="text-sm font-medium">{profile?.experience_points || 0} pontos</span>
          </div>
          
          <div className="flex gap-3 mt-3">
            <Button variant="outline" size="sm" className="text-sm bg-parchment-light border-parchment-dark/30">
              <Share2 size={16} className="mr-1" /> Compartilhar
            </Button>
            <Button variant="outline" size="sm" className="text-sm bg-parchment-light border-parchment-dark/30">
              <BookOpen size={16} className="mr-1" /> Ver Notas
            </Button>
          </div>
        </div>
        
        <ReadingStreak
          currentStreak={profile?.streak_count || 0}
          longestStreak={profile?.streak_count || 0}
          goalProgress={75}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="md:col-span-2">
            <DailyChallenges />
          </div>
          
          <Card className="parchment-container h-fit">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-oldstyle text-lg text-scripture-heading flex items-center gap-2">
                  <BadgeCheck size={18} className="text-ancient-gold" />
                  Conquistas Recentes
                </h3>
                <ViewAllAchievements />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {achievements.filter(badge => badge.unlocked).slice(0, 3).map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center">
                    <div className="achievement-badge bg-ancient-gold">
                      {badge.icon}
                    </div>
                    <span className="text-xs mt-1 text-center font-medium">{badge.name}</span>
                  </div>
                ))}
                
                {Array.from({ length: Math.max(0, 3 - achievements.filter(badge => badge.unlocked).length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex flex-col items-center">
                    <div className="achievement-badge bg-muted text-muted-foreground opacity-50">
                      ?
                    </div>
                    <span className="text-xs mt-1 text-center text-muted-foreground">Bloqueado</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="w-full bg-parchment-light">
            <TabsTrigger value="conquistas" className="flex-1">Conquistas</TabsTrigger>
            <TabsTrigger value="estatisticas" className="flex-1">Estatísticas</TabsTrigger>
            <TabsTrigger value="ranking" className="flex-1">Ranking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conquistas" className="mt-4 space-y-4">
            <AchievementList />
          </TabsContent>
          
          <TabsContent value="estatisticas" className="mt-4 space-y-4">
            <Card className="parchment-container overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-oldstyle text-lg text-scripture-heading flex items-center gap-2">
                  <LineChart size={18} className="text-primary" />
                  Meu Progresso de Leitura
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-oldstyle">Antigo Testamento</h4>
                    <span className="text-xs text-muted-foreground">23%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-ancient-brown" style={{ width: '23%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-oldstyle">Novo Testamento</h4>
                    <span className="text-xs text-muted-foreground">45%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-ancient-brown" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-oldstyle text-ancient-brown">12</p>
                    <p className="text-xs text-muted-foreground">Livros Completados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-oldstyle text-ancient-brown">247</p>
                    <p className="text-xs text-muted-foreground">Capítulos Lidos</p>
                  </div>
                  <div className="text-center col-span-2">
                    <p className="text-2xl font-oldstyle text-ancient-brown">3521</p>
                    <p className="text-xs text-muted-foreground">Versículos Lidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ranking" className="mt-4">
            <Leaderboard />
          </TabsContent>
        </Tabs>
        
        {isAuthenticated && (
          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={handleSignOut}>
              Sair da conta
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
