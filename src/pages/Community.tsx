
import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Trophy, Award, Users, Medal, PenLine, Heart, LucideIcon } from 'lucide-react';
import DailyChallenges from '@/components/achievements/DailyChallenges';
import Leaderboard from '@/components/achievements/Leaderboard';
import { getUserProfile } from '@/services';
import { UserProfile } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PrayerRequest {
  id: string;
  user_id: string;
  user_name: string;
  avatar_url?: string;
  content: string;
  created_at: string;
  prayers_count: number;
  is_anonymous: boolean;
}

interface CommunityMenuItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}

const CommunityMenuItem = ({ title, description, icon: Icon, active, onClick }: CommunityMenuItemProps) => (
  <button 
    className={`flex items-start gap-3 p-3 w-full text-left rounded-lg ${
      active ? 'bg-parchment-dark/10 border-l-4 border-ancient-gold' : 'hover:bg-parchment-dark/5'
    }`}
    onClick={onClick}
  >
    <div className={`mt-1 ${active ? 'text-ancient-gold' : 'text-ancient-brown/60'}`}>
      <Icon size={20} />
    </div>
    <div>
      <h3 className={`font-medium ${active ? 'text-scripture-heading' : 'text-scripture-text'}`}>{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </button>
);

const mockPrayerRequests: PrayerRequest[] = [
  {
    id: '1',
    user_id: '1',
    user_name: 'João Silva',
    content: 'Por favor, orem pela saúde da minha mãe que está passando por um tratamento difícil.',
    created_at: '2025-05-05T12:00:00Z',
    prayers_count: 15,
    is_anonymous: false
  },
  {
    id: '2',
    user_id: '2',
    user_name: 'Maria',
    content: 'Preciso de orações para uma decisão importante que preciso tomar em minha vida profissional.',
    created_at: '2025-05-05T10:30:00Z',
    prayers_count: 8,
    is_anonymous: true
  },
  {
    id: '3',
    user_id: '3',
    user_name: 'Carlos Mendes',
    avatar_url: 'https://i.pravatar.cc/150?u=carlos',
    content: 'Orem por mim e minha família, estamos passando por um momento de transição e precisamos de sabedoria.',
    created_at: '2025-05-04T20:15:00Z',
    prayers_count: 23,
    is_anonymous: false
  }
];

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState<'prayers' | 'challenges' | 'leaderboard'>('challenges');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(mockPrayerRequests);
  const [newPrayer, setNewPrayer] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      setIsAuthenticated(userProfile?.id.startsWith('guest-') ? false : true);
      setIsLoading(false);
    };
    
    fetchProfile();
  }, []);

  const handleCreateAccount = () => {
    navigate("/auth");
  };
  
  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPrayer.trim()) return;
    
    // Simulação de adição de novo pedido de oração
    const newRequest: PrayerRequest = {
      id: Date.now().toString(),
      user_id: profile?.id || 'guest',
      user_name: profile?.display_name || 'Anônimo',
      avatar_url: profile?.avatar_url,
      content: newPrayer,
      created_at: new Date().toISOString(),
      prayers_count: 0,
      is_anonymous: isAnonymous
    };
    
    setPrayerRequests([newRequest, ...prayerRequests]);
    setNewPrayer('');
    setIsAnonymous(false);
  };
  
  const handlePray = (requestId: string) => {
    setPrayerRequests(
      prayerRequests.map(req => 
        req.id === requestId 
          ? { ...req, prayers_count: req.prayers_count + 1 }
          : req
      )
    );
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="py-6 px-2">
          <div className="h-96 flex items-center justify-center">
            <div className="w-8 h-8 border-t-2 border-ancient-gold rounded-full animate-spin mb-2"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="py-6 px-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users size={24} className="text-ancient-gold" />
            <h1 className="text-2xl font-oldstyle text-scripture-heading">Comunidade</h1>
          </div>
        </div>

        {!isAuthenticated && (
          <Alert className="mb-6 bg-ancient-gold/10 border-ancient-gold/40 rounded-xl">
            <div className="flex items-start">
              <Medal className="h-5 w-5 text-ancient-gold mt-1" />
              <div className="ml-3">
                <AlertTitle className="text-ancient-brown text-base">Modo Visitante</AlertTitle>
                <AlertDescription className="text-sm">
                  Você está navegando como visitante. Crie uma conta para salvar seu progresso, conquistas e participar na comunidade.
                  <div className="mt-2">
                    <Button
                      onClick={handleCreateAccount}
                      className="bg-ancient-gold hover:bg-ancient-gold/90 text-white"
                    >
                      Criar Conta
                    </Button>
                  </div>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <div className="grid md:grid-cols-[250px_1fr] gap-6">
          <div className="space-y-2 hidden md:block">
            <CommunityMenuItem 
              title="Pedidos de Oração" 
              description="Compartilhe e ore pelos pedidos" 
              icon={Heart} 
              active={activeTab === 'prayers'} 
              onClick={() => setActiveTab('prayers')}
            />
            <CommunityMenuItem 
              title="Desafios Diários" 
              description="Complete desafios para ganhar XP" 
              icon={Award} 
              active={activeTab === 'challenges'} 
              onClick={() => setActiveTab('challenges')}
            />
            <CommunityMenuItem 
              title="Classificação" 
              description="Veja quem mais está estudando" 
              icon={Trophy} 
              active={activeTab === 'leaderboard'} 
              onClick={() => setActiveTab('leaderboard')}
            />
          </div>
          
          <div className="md:hidden mb-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid grid-cols-3 bg-parchment-light/80">
                <TabsTrigger value="prayers" className="text-xs">
                  <Heart className="h-4 w-4 mr-1" /> Orações
                </TabsTrigger>
                <TabsTrigger value="challenges" className="text-xs">
                  <Award className="h-4 w-4 mr-1" /> Desafios
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="text-xs">
                  <Trophy className="h-4 w-4 mr-1" /> Classificação
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            {activeTab === 'prayers' && (
              <div className="animate-slide-up">
                <h2 className="text-xl font-oldstyle text-scripture-heading mb-4">Pedidos de Oração</h2>
                
                <Card className="mb-6 bg-parchment-light border-parchment-dark/20">
                  <form onSubmit={handlePrayerSubmit}>
                    <CardHeader>
                      <CardTitle className="text-base">Compartilhe seu pedido de oração</CardTitle>
                      <CardDescription>Conecte-se com a comunidade através da oração</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <Textarea 
                        placeholder="Escreva seu pedido de oração aqui..." 
                        value={newPrayer}
                        onChange={(e) => setNewPrayer(e.target.value)}
                        className="resize-none bg-parchment-dark/5"
                      />
                      
                      <div className="flex items-center mt-4">
                        <input 
                          type="checkbox" 
                          id="anonymous" 
                          checked={isAnonymous}
                          onChange={() => setIsAnonymous(!isAnonymous)}
                          className="mr-2"
                        />
                        <label htmlFor="anonymous" className="text-sm text-muted-foreground">
                          Publicar anonimamente
                        </label>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="bg-ancient-gold hover:bg-ancient-gold/90 w-full"
                        disabled={!newPrayer.trim()}
                      >
                        <PenLine className="h-4 w-4 mr-2" /> Compartilhar Pedido
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
                
                <div className="space-y-4">
                  {prayerRequests.map((request) => (
                    <Card key={request.id} className="bg-parchment-light border-parchment-dark/20">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {!request.is_anonymous && (
                              <Avatar className="h-8 w-8 mr-2">
                                {request.avatar_url ? (
                                  <AvatarImage src={request.avatar_url} />
                                ) : (
                                  <AvatarFallback className="bg-ancient-gold/20 text-ancient-brown">
                                    {request.user_name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                            )}
                            <CardTitle className="text-sm font-medium">
                              {request.is_anonymous ? 'Anônimo' : request.user_name}
                            </CardTitle>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="py-2">
                        <p className="text-sm">{request.content}</p>
                      </CardContent>
                      
                      <CardFooter className="pt-2">
                        <Button 
                          variant="ghost" 
                          className="text-xs flex items-center gap-1"
                          onClick={() => handlePray(request.id)}
                        >
                          <Heart className="h-3 w-3 text-rose-500" />
                          <span>{request.prayers_count} {request.prayers_count === 1 ? 'pessoa' : 'pessoas'} oraram por isto</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'challenges' && (
              <div className="animate-slide-up">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={20} className="text-ancient-gold" />
                  <h2 className="text-xl font-oldstyle text-scripture-heading">Desafios Diários</h2>
                </div>
                <div className="parchment-container rounded-xl">
                  <DailyChallenges />
                </div>
              </div>
            )}
            
            {activeTab === 'leaderboard' && (
              <div className="animate-slide-up">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={20} className="text-ancient-gold" />
                  <h2 className="text-xl font-oldstyle text-scripture-heading">Classificação</h2>
                </div>
                <div className="parchment-container rounded-xl p-4">
                  <Leaderboard />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CommunityPage;
