
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, CheckCircle, Book, Target, Globe } from 'lucide-react';
import { updateUserProfile } from '@/services/ProfileService';
import { UserProfile, BibleVersion } from '@/types/bible.types';
import { toast } from '@/hooks/use-toast';
import { getAllVersions, getVersionsByLanguage } from '@/services/BibleDataService';

interface OnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile | null;
  onProfileUpdate: () => void;
}

const OnboardingWizard = ({ open, onOpenChange, profile, onProfileUpdate }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(profile?.preferred_language || 'pt-BR');
  const [selectedBibleVersion, setSelectedBibleVersion] = useState(profile?.preferred_bible_version || 'kja');
  const [dailyGoal, setDailyGoal] = useState(profile?.daily_reading_goal || 15);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bibleVersions, setBibleVersions] = useState<BibleVersion[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [groupedVersions, setGroupedVersions] = useState<{
    portuguese: BibleVersion[];
    english: BibleVersion[];
    other: BibleVersion[];
  }>({
    portuguese: [],
    english: [],
    other: []
  });
  
  const { t, language, setLanguage } = useLanguage();
  
  useEffect(() => {
    const fetchBibleVersions = async () => {
      setIsLoadingVersions(true);
      try {
        const data = await getAllVersions();
        
        if (data && data.length > 0) {
          setBibleVersions(data);
          
          // Group versions by language
          const portuguese = data.filter(v => v.language === 'pt-BR' || v.language === 'pt');
          const english = data.filter(v => v.language === 'en');
          const other = data.filter(v => 
            v.language !== 'pt-BR' && v.language !== 'pt' && v.language !== 'en'
          );
          
          setGroupedVersions({
            portuguese,
            english,
            other
          });
        }
      } catch (err) {
        console.error('Error in fetchBibleVersions:', err);
      } finally {
        setIsLoadingVersions(false);
      }
    };
    
    if (open) {
      fetchBibleVersions();
    }
  }, [open]);
  
  const steps = [
    { 
      title: 'Bem-vindo à Bíblia de Estudos Original', 
      description: 'Vamos personalizar o aplicativo para você. Siga os próximos passos para configurar sua experiência.' 
    },
    { 
      title: 'Idioma', 
      description: 'Escolha o idioma que você deseja usar no aplicativo.'
    },
    { 
      title: 'Versão da Bíblia', 
      description: 'Escolha sua versão preferida da Bíblia.'
    },
    { 
      title: 'Objetivos de Leitura', 
      description: 'Defina quanto tempo você deseja dedicar à leitura diária da Bíblia.'
    },
    { 
      title: 'Seu Perfil', 
      description: 'Personalize seu perfil para uma experiência única.'
    },
    { 
      title: 'Tudo pronto!', 
      description: 'Sua configuração está completa. Agora você pode começar sua jornada de estudo da Bíblia.'
    }
  ];
  
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };
  
  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const handleComplete = async () => {
    if (!profile) return;
    
    try {
      await updateUserProfile({
        preferred_language: selectedLanguage,
        preferred_bible_version: selectedBibleVersion,
        daily_reading_goal: dailyGoal,
        display_name: displayName || profile.display_name,
        has_completed_onboarding: true,
      });
      
      // Atualizar idioma do app
      if (selectedLanguage !== language) {
        setLanguage(selectedLanguage as any);
      }
      
      toast({
        title: 'Configuração concluída!',
        description: 'Suas preferências foram salvas com sucesso.',
      });
      
      onProfileUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível salvar suas preferências. Tente novamente.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-parchment p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-oldstyle text-scripture-heading">
            {steps[step].title}
          </DialogTitle>
          <DialogDescription>
            {steps[step].description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {step === 0 && (
            <div className="space-y-4">
              <div className="bg-parchment-dark/10 p-4 rounded-lg flex items-center gap-4">
                <Book className="h-8 w-8 text-ancient-gold" />
                <div>
                  <h3 className="text-scripture-heading font-medium">Leitura e Estudo Bíblico</h3>
                  <p className="text-sm text-muted-foreground">Acesse a Bíblia completa e estudos aprofundados</p>
                </div>
              </div>
              
              <div className="bg-parchment-dark/10 p-4 rounded-lg flex items-center gap-4">
                <Target className="h-8 w-8 text-ancient-gold" />
                <div>
                  <h3 className="text-scripture-heading font-medium">Metas e Desafios</h3>
                  <p className="text-sm text-muted-foreground">Defina objetivos de leitura e acompanhe seu progresso</p>
                </div>
              </div>
              
              <div className="bg-parchment-dark/10 p-4 rounded-lg flex items-center gap-4">
                <Globe className="h-8 w-8 text-ancient-gold" />
                <div>
                  <h3 className="text-scripture-heading font-medium">Comunidade</h3>
                  <p className="text-sm text-muted-foreground">Conecte-se com outros leitores da Bíblia</p>
                </div>
              </div>
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma do Aplicativo</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Selecione um idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <Tabs defaultValue="portuguese" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="portuguese" className="flex-1">Português</TabsTrigger>
                  <TabsTrigger value="english" className="flex-1">English</TabsTrigger>
                  <TabsTrigger value="other" className="flex-1">Outros</TabsTrigger>
                </TabsList>
                
                <TabsContent value="portuguese" className="pt-4">
                  {isLoadingVersions ? (
                    <div className="text-center py-4">Carregando versões...</div>
                  ) : groupedVersions.portuguese.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {groupedVersions.portuguese.map(version => (
                        <Button
                          key={version.id}
                          variant={selectedBibleVersion === version.id ? "default" : "outline"}
                          onClick={() => setSelectedBibleVersion(version.id)}
                          className={selectedBibleVersion === version.id ? "bg-ancient-gold" : ""}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{version.name}</span>
                            <span className="text-xs">{version.description || 'Tradução em português'}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4">Nenhuma versão em português encontrada.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="english" className="pt-4">
                  {isLoadingVersions ? (
                    <div className="text-center py-4">Loading versions...</div>
                  ) : groupedVersions.english.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {groupedVersions.english.map(version => (
                        <Button
                          key={version.id}
                          variant={selectedBibleVersion === version.id ? "default" : "outline"}
                          onClick={() => setSelectedBibleVersion(version.id)}
                          className={selectedBibleVersion === version.id ? "bg-ancient-gold" : ""}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{version.name}</span>
                            <span className="text-xs">{version.description || 'English translation'}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4">No English versions found.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="other" className="pt-4">
                  {isLoadingVersions ? (
                    <div className="text-center py-4">Loading versions...</div>
                  ) : groupedVersions.other.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {groupedVersions.other.map(version => (
                        <Button
                          key={version.id}
                          variant={selectedBibleVersion === version.id ? "default" : "outline"}
                          onClick={() => setSelectedBibleVersion(version.id)}
                          className={selectedBibleVersion === version.id ? "bg-ancient-gold" : ""}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{version.name}</span>
                            <span className="text-xs">{version.language_name || version.language}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4">Mais traduções disponíveis nas configurações do aplicativo</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Tempo diário de leitura (minutos)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 15, 30].map(minutes => (
                    <Button
                      key={minutes}
                      variant={dailyGoal === minutes ? "default" : "outline"}
                      onClick={() => setDailyGoal(minutes)}
                      className={dailyGoal === minutes ? "bg-ancient-gold" : ""}
                    >
                      {minutes} min
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Objetivo de leitura</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start bg-parchment-dark/10"
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-ancient-gold" />
                    Ler toda a Bíblia
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-parchment-dark/10"
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-ancient-gold" />
                    Manter um hábito diário de leitura
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-parchment-dark/10"
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-ancient-gold" />
                    Aprofundar conhecimento em temas específicos
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Como você gostaria de ser chamado?</Label>
                <Input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-parchment-light"
                  placeholder="Seu nome"
                />
                <p className="text-xs text-muted-foreground">
                  Este nome será exibido em seu perfil e na comunidade
                </p>
              </div>
            </div>
          )}
          
          {step === 5 && (
            <div className="space-y-4 text-center py-6">
              <div className="bg-ancient-gold/20 p-6 rounded-full inline-flex mx-auto">
                <CheckCircle className="h-12 w-12 text-ancient-gold" />
              </div>
              <h3 className="text-xl font-oldstyle text-scripture-heading">
                Tudo pronto!
              </h3>
              <p className="text-muted-foreground">
                Seu aplicativo está configurado. Agora você pode começar sua jornada de estudo da Bíblia.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-6">
          {step > 0 && step < steps.length - 1 ? (
            <Button variant="outline" onClick={handlePrevious}>
              Voltar
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < steps.length - 1 ? (
            <Button onClick={handleNext} className="bg-ancient-gold hover:bg-ancient-gold/90">
              Próximo <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="bg-ancient-gold hover:bg-ancient-gold/90">
              Começar a usar o app
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingWizard;
