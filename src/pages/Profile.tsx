
import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Share2, BookOpen, Trophy, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReadingStreak from '@/components/achievements/ReadingStreak';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('conquistas');
  
  // Mock user data
  const mockUserData = {
    name: 'Estudante Bíblico',
    streak: {
      current: 5,
      longest: 14,
      goalProgress: 75,
    },
    readingProgress: {
      oldTestament: 23,
      newTestament: 45,
      booksCompleted: 12,
      chaptersRead: 247,
      versesRead: 3521,
    },
    achievements: [
      {
        id: "1",
        name: "Gênesis",
        description: "Completou a leitura de Gênesis",
        dateEarned: "2023-04-20",
        icon: "📖",
      },
      {
        id: "2",
        name: "Estudioso Dedicado",
        description: "14 dias consecutivos de leitura",
        dateEarned: "2023-03-15",
        icon: "🔍",
      },
      {
        id: "3",
        name: "Novo Testamento",
        description: "Leu 25% do Novo Testamento",
        dateEarned: "2023-02-28",
        icon: "📜",
      },
    ]
  };
  
  return (
    <PageLayout>
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-oldstyle text-scripture-heading">Meu Perfil</h1>
          <Button variant="ghost" size="icon">
            <Settings2 size={20} className="text-scripture-heading" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-ancient-brown rounded-full flex items-center justify-center mb-3">
            <span className="text-3xl text-white font-oldstyle">
              {mockUserData.name.charAt(0)}
            </span>
          </div>
          <h2 className="text-xl font-oldstyle text-ancient-brown">{mockUserData.name}</h2>
          
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
          currentStreak={mockUserData.streak.current}
          longestStreak={mockUserData.streak.longest}
          goalProgress={mockUserData.streak.goalProgress}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="w-full bg-parchment-light">
            <TabsTrigger value="conquistas" className="flex-1">Conquistas</TabsTrigger>
            <TabsTrigger value="estatisticas" className="flex-1">Estatísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conquistas" className="mt-4 space-y-4">
            <h3 className="text-lg font-oldstyle text-scripture-heading flex items-center gap-2">
              <Trophy size={18} className="text-ancient-gold" />
              Medalhas Conquistadas
            </h3>
            
            {mockUserData.achievements.map((achievement) => (
              <Card key={achievement.id} className="parchment-container">
                <div className="p-4 flex items-center gap-3">
                  <div className="achievement-badge">
                    {achievement.icon}
                  </div>
                  <div>
                    <h4 className="font-oldstyle text-scripture-heading">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-ancient-brown mt-1">Conquistado em {achievement.dateEarned}</p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="estatisticas" className="mt-4 space-y-4">
            <Card className="parchment-container overflow-hidden">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-oldstyle">Antigo Testamento</h4>
                    <span className="text-xs text-muted-foreground">{mockUserData.readingProgress.oldTestament}%</span>
                  </div>
                  <Progress value={mockUserData.readingProgress.oldTestament} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-oldstyle">Novo Testamento</h4>
                    <span className="text-xs text-muted-foreground">{mockUserData.readingProgress.newTestament}%</span>
                  </div>
                  <Progress value={mockUserData.readingProgress.newTestament} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-oldstyle text-ancient-brown">{mockUserData.readingProgress.booksCompleted}</p>
                    <p className="text-xs text-muted-foreground">Livros Completados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-oldstyle text-ancient-brown">{mockUserData.readingProgress.chaptersRead}</p>
                    <p className="text-xs text-muted-foreground">Capítulos Lidos</p>
                  </div>
                  <div className="text-center col-span-2">
                    <p className="text-2xl font-oldstyle text-ancient-brown">{mockUserData.readingProgress.versesRead}</p>
                    <p className="text-xs text-muted-foreground">Versículos Lidos</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Profile;
