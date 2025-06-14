import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, CheckCircle, BookOpen, Target, Globe, Sparkles, Heart, Star, Trophy, Users, Zap } from 'lucide-react';
import { updateUserProfile } from '@/services/ProfileService';
import { UserProfile, BibleVersion } from '@/types/bible.types';
import { toast } from '@/hooks/use-toast';
import { getAllVersions, getVersionsByLanguage, getVersionsGroupedByLanguage } from '@/services/bible/BibleVersionsService';

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
  const [groupedVersionsByLanguage, setGroupedVersionsByLanguage] = useState<Record<string, BibleVersion[]>>({});
  const [activeLanguageTab, setActiveLanguageTab] = useState('portuguese');
  
  const { t, language, setLanguage } = useLanguage();
  
  useEffect(() => {
    const fetchBibleVersions = async () => {
      setIsLoadingVersions(true);
      try {
        // Get all versions
        const groupedData = await getVersionsGroupedByLanguage();
        
        if (groupedData && Object.keys(groupedData).length > 0) {
          setGroupedVersionsByLanguage(groupedData);
          
          // Flatten versions for the complete list
          const allVersions = Object.values(groupedData).flat();
          setBibleVersions(allVersions);
          
          // Set active tab based on user's language
          if (selectedLanguage.startsWith('pt')) {
            setActiveLanguageTab('portuguese');
          } else if (selectedLanguage.startsWith('en')) {
            setActiveLanguageTab('english');
          } else {
            setActiveLanguageTab('other');
          }
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
  }, [open, selectedLanguage]);
  
  const steps = [
    { 
      title: '🎉 Bem-vindo à sua jornada espiritual!', 
      description: 'Vamos personalizar o app perfeito para você. Prepare-se para uma experiência incrível!',
      icon: <Sparkles className="h-16 w-16 text-purple-500" />,
      color: 'from-purple-400 to-pink-400'
    },
    { 
      title: '🌍 Escolha seu idioma',
      description: 'Selecione o idioma que faz seu coração bater mais forte!',
      icon: <Globe className="h-16 w-16 text-blue-500" />,
      color: 'from-blue-400 to-cyan-400'
    },
    { 
      title: '📖 Sua Bíblia ideal',
      description: 'Encontre a versão perfeita para conectar com as palavras sagradas!',
      icon: <BookOpen className="h-16 w-16 text-green-500" />,
      color: 'from-green-400 to-emerald-400'
    },
    { 
      title: '🎯 Defina suas metas',
      description: 'Vamos criar objetivos que vão transformar sua vida espiritual!',
      icon: <Target className="h-16 w-16 text-orange-500" />,
      color: 'from-orange-400 to-red-400'
    },
    { 
      title: '✨ Personalize seu perfil',
      description: 'Torne sua jornada única e especial!',
      icon: <Heart className="h-16 w-16 text-pink-500" />,
      color: 'from-pink-400 to-rose-400'
    },
    { 
      title: '🚀 Tudo pronto para decolar!',
      description: 'Sua aventura espiritual começa agora. Prepare-se para descobrir coisas incríveis!',
      icon: <Trophy className="h-16 w-16 text-yellow-500" />,
      color: 'from-yellow-400 to-orange-400'
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
  
  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    setSelectedBibleVersion('');
  };
  
  const handleComplete = async () => {
    if (!profile) return;
    
    try {
      // Ensure the selectedBibleVersion is set
      let finalBibleVersion = selectedBibleVersion;
      if (!finalBibleVersion) {
        // Default based on language if not selected
        if (selectedLanguage.startsWith('pt')) {
          finalBibleVersion = 'kja';
        } else if (selectedLanguage.startsWith('en')) {
          finalBibleVersion = 'kjv';
        } else if (selectedLanguage.startsWith('es')) {
          finalBibleVersion = 'rvr';
        } else if (selectedLanguage.startsWith('fr')) {
          finalBibleVersion = 'apee';
        } else {
          finalBibleVersion = 'kjv'; // Default fallback
        }
      }
      
      const updatedProfile = {
        preferred_language: selectedLanguage,
        preferred_bible_version: finalBibleVersion,
        daily_reading_goal: dailyGoal,
        display_name: displayName || profile.display_name,
        has_completed_onboarding: true,
        // Set default reading position to the first book of the selected Bible version
        reading_position: {
          book_id: selectedLanguage.startsWith('en') ? 'gn' : 'mt', // Genesis or Matthew
          chapter: 1,
          verse: 1,
          version_id: finalBibleVersion,
          timestamp: new Date().toISOString() // Add missing timestamp property
        }
      };
      
      await updateUserProfile(updatedProfile);
      
      // Update app language
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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-br ${steps[step].color} p-8 text-center text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="mb-4 flex justify-center animate-bounce">
              {steps[step].icon}
            </div>
            <DialogTitle className="text-2xl font-bold mb-2 text-white">
              {steps[step].title}
            </DialogTitle>
            <DialogDescription className="text-white/90 text-lg">
              {steps[step].description}
            </DialogDescription>
          </div>
          
          {/* Progress indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === step 
                    ? 'bg-white scale-125' 
                    : index < step 
                      ? 'bg-white/70' 
                      : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="p-8 bg-white">
          {step === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-purple-900">Leitura Inteligente</h3>
                      <p className="text-purple-700">Acesse a Bíblia completa com estudos personalizados</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">Metas Gamificadas</h3>
                      <p className="text-blue-700">Conquiste objetivos e desbloqueie conquistas incríveis</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-green-900">Comunidade Vibrante</h3>
                      <p className="text-green-700">Conecte-se e cresça junto com outros fiéis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="language" className="text-lg font-semibold text-gray-800">
                  🌟 Qual idioma faz você se sentir em casa?
                </Label>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language" className="w-full h-14 text-lg border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-colors">
                    <SelectValue placeholder="Selecione seu idioma favorito" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR" className="text-lg py-3">🇧🇷 Português (Brasil)</SelectItem>
                    <SelectItem value="en" className="text-lg py-3">🇺🇸 English</SelectItem>
                    <SelectItem value="es" className="text-lg py-3">🇪🇸 Español</SelectItem>
                    <SelectItem value="fr" className="text-lg py-3">🇫🇷 Français</SelectItem>
                    <SelectItem value="ar" className="text-lg py-3">🇸🇦 العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📚 Escolha sua versão da Bíblia favorita
              </h3>
              <Tabs value={activeLanguageTab} onValueChange={setActiveLanguageTab} className="w-full">
                <TabsList className="w-full h-12 bg-gray-100 rounded-xl">
                  <TabsTrigger value="portuguese" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    🇧🇷 Português
                  </TabsTrigger>
                  <TabsTrigger value="english" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    🇺🇸 English
                  </TabsTrigger>
                  <TabsTrigger value="other" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    🌍 Outros
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="portuguese" className="pt-4">
                  {isLoadingVersions ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Carregando versões incríveis...</p>
                    </div>
                  ) : groupedVersionsByLanguage['pt'] && groupedVersionsByLanguage['pt'].length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {groupedVersionsByLanguage['pt'].map(version => (
                        <Button
                          key={version.id}
                          variant={selectedBibleVersion === version.id ? "default" : "outline"}
                          onClick={() => setSelectedBibleVersion(version.id)}
                          className={`h-auto p-4 justify-start rounded-xl border-2 transition-all duration-200 ${
                            selectedBibleVersion === version.id 
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg scale-105" 
                              : "hover:border-purple-300 hover:bg-purple-50"
                          }`}
                        >
                          <div className="flex flex-col items-start text-left">
                            <span className="font-semibold text-base">{version.name}</span>
                            <span className="text-sm opacity-90">{version.description || 'Tradução em português'}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma versão em português encontrada.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="english" className="pt-4">
                  {isLoadingVersions ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading versions...</p>
                    </div>
                  ) : groupedVersionsByLanguage['en'] && groupedVersionsByLanguage['en'].length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {groupedVersionsByLanguage['en'].map(version => (
                        <Button
                          key={version.id}
                          variant={selectedBibleVersion === version.id ? "default" : "outline"}
                          onClick={() => setSelectedBibleVersion(version.id)}
                          className={`h-auto p-4 justify-start rounded-xl border-2 transition-all duration-200 ${
                            selectedBibleVersion === version.id 
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500 shadow-lg scale-105" 
                              : "hover:border-green-300 hover:bg-green-50"
                          }`}
                        >
                          <div className="flex flex-col items-start text-left">
                            <span className="font-semibold text-base">{version.name}</span>
                            <span className="text-sm opacity-90">{version.description || 'English translation'}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No English versions found.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="other" className="pt-4">
                  {isLoadingVersions ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading versions...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(groupedVersionsByLanguage)
                        .filter(([lang]) => lang !== 'pt' && lang !== 'en')
                        .flatMap(([_, versions]) => versions)
                        .map(version => (
                          <Button
                            key={version.id}
                            variant={selectedBibleVersion === version.id ? "default" : "outline"}
                            onClick={() => setSelectedBibleVersion(version.id)}
                            className={`h-auto p-4 justify-start rounded-xl border-2 transition-all duration-200 ${
                              selectedBibleVersion === version.id 
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500 shadow-lg scale-105" 
                                : "hover:border-green-300 hover:bg-green-50"
                            }`}
                          >
                            <div className="flex flex-col items-start text-left">
                              <span className="font-semibold text-base">{version.name}</span>
                              <span className="text-sm opacity-90">{version.language_name || version.language}</span>
                            </div>
                          </Button>
                        ))
                      }
                      {Object.entries(groupedVersionsByLanguage)
                        .filter(([lang]) => lang !== 'pt' && lang !== 'en')
                        .flatMap(([_, versions]) => versions).length === 0 && (
                        <p className="text-center py-4">Mais traduções disponíveis nas configurações do aplicativo</p>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-800">
                  ⏱️ Quanto tempo você quer dedicar por dia?
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[5, 15, 30].map(minutes => (
                    <Button
                      key={minutes}
                      variant={dailyGoal === minutes ? "default" : "outline"}
                      onClick={() => setDailyGoal(minutes)}
                      className={`h-16 rounded-xl border-2 text-lg font-semibold transition-all duration-200 ${
                        dailyGoal === minutes 
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-lg scale-105" 
                          : "hover:border-orange-300 hover:bg-orange-50"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{minutes}</div>
                        <div className="text-sm">minutos</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-800">
                  🎯 Seus objetivos de crescimento
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { icon: "📖", title: "Ler toda a Bíblia", desc: "Uma jornada completa pelas escrituras" },
                    { icon: "🔥", title: "Manter hábito diário", desc: "Consistência que transforma vidas" },
                    { icon: "🧠", title: "Aprofundar conhecimento", desc: "Estudos temáticos e reflexões profundas" }
                  ].map((goal, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 justify-start rounded-xl border-2 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{goal.icon}</span>
                        <div className="text-left">
                          <div className="font-semibold text-gray-800">{goal.title}</div>
                          <div className="text-sm text-gray-600">{goal.desc}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="displayName" className="text-lg font-semibold text-gray-800">
                  👋 Como você gostaria de ser chamado?
                </Label>
                <Input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-14 text-lg border-2 border-pink-200 rounded-xl hover:border-pink-400 focus:border-pink-500 transition-colors"
                  placeholder="Digite seu nome favorito"
                />
                <p className="text-sm text-gray-600 bg-pink-50 p-3 rounded-lg border border-pink-100">
                  💫 Este nome aparecerá no seu perfil e quando você interagir com a comunidade
                </p>
              </div>
            </div>
          )}
          
          {step === 5 && (
            <div className="space-y-6 text-center py-8">
              <div className="relative">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-8 rounded-full inline-flex mx-auto animate-pulse">
                  <Trophy className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Star className="h-8 w-8 text-yellow-400 animate-spin" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Parabéns! 🎉
                </h3>
                <p className="text-lg text-gray-600">
                  Seu app está configurado e pronto para uma jornada espiritual incrível!
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  <p className="text-purple-800 font-semibold">
                    🚀 Prepare-se para descobrir, crescer e se conectar de formas que você nunca imaginou!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between p-6 bg-gray-50 border-t">
          {step > 0 && step < steps.length - 1 ? (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              className="rounded-xl border-2 hover:bg-gray-100 transition-colors"
            >
              Voltar
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < steps.length - 1 ? (
            <Button 
              onClick={handleNext} 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-8 py-3 font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Próximo <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete} 
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl px-8 py-3 font-semibold transition-all duration-200 transform hover:scale-105"
            >
              🚀 Começar minha jornada!
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingWizard;
