
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, BookOpen, LineChart, AlertCircle, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AchievementList from '@/components/achievements/AchievementList';
import SettingsDialog from '@/components/profile/SettingsDialog';
import { getUserAchievements } from '@/services/AchievementService';
import { getUserProfile } from '@/services/ProfileService';
import { getSavedVerses } from '@/services/VersesService';
import { Achievement, UserProfile, SavedVerse } from '@/types/bible.types';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBibleBooks } from '../services/BibleDataService';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('conquistas');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);
  const [bookNames, setBookNames] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
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
      const userSavedVerses = await getSavedVerses();
      const books = await getBibleBooks(language); // Passar o idioma atual para obter nomes dos livros corretos
      
      // Create book name lookup
      const bookNameLookup: Record<string, string> = {};
      books.forEach(book => {
        bookNameLookup[book.book_id] = book.name;
      });
      
      setAchievements(userAchievements);
      setProfile(userProfile);
      setSavedVerses(userSavedVerses);
      setBookNames(bookNameLookup);
    };
    
    if (isLoading === false) {
      fetchUserData();
    }
  }, [isLoading, language]); // Adicionar language como dependência para recarregar quando o idioma mudar
  
  const handleProfileUpdate = async () => {
    const userProfile = await getUserProfile();
    setProfile(userProfile);
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('guestProfile');
    navigate('/');
  };

  const handleCreateAccount = () => {
    navigate('/auth');
  };
  
  const handleReadVerse = (bookId: string, chapterNumber: number, verseNumber: number) => {
    navigate(`/read?book=${bookId}&chapter=${chapterNumber}&verse=${verseNumber}`);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <div className="py-6">
          <div className="h-96 flex items-center justify-center">
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-oldstyle text-scripture-heading">{t('profile.title')}</h1>
          <SettingsDialog profile={profile} onProfileUpdate={handleProfileUpdate} />
        </div>
        
        {!isAuthenticated && (
          <Alert className="mb-6 bg-parchment-light border-ancient-gold/40">
            <AlertCircle className="h-4 w-4 text-ancient-gold" />
            <AlertTitle className="text-ancient-brown">{t('profile.guestMode')}</AlertTitle>
            <AlertDescription className="text-sm">
              {t('profile.guestModeDescription')}
              <div className="mt-2">
                <Button 
                  onClick={handleCreateAccount} 
                  className="bg-ancient-gold text-white hover:bg-ancient-gold/90"
                >
                  {t('auth.createAccount')}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col items-center mb-6">
          <button 
            className="w-24 h-24 rounded-full mb-3 cursor-pointer focus:outline-none"
            onClick={!isAuthenticated ? handleCreateAccount : undefined}
          >
            <Avatar className="w-24 h-24 border-4 border-ancient-brown rounded-full">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-ancient-brown text-white text-3xl font-oldstyle">
                {profile?.display_name?.[0] || profile?.nickname?.[0] || 'V'}
              </AvatarFallback>
            </Avatar>
          </button>
          
          <h2 className="text-xl font-oldstyle text-ancient-brown">
            {profile?.nickname || profile?.display_name || t('profile.visitor')}
          </h2>
          
          <div className="flex items-center gap-2 mt-1">
            <LineChart size={16} className="text-ancient-gold" />
            <span className="text-sm font-medium">{profile?.experience_points || 0} {t('profile.points')}</span>
          </div>
          
          <div className="flex gap-3 mt-3">
            <Button variant="outline" size="sm" className="text-sm bg-parchment-light border-parchment-dark/30">
              <Share2 size={16} className="mr-1" /> {t('common.share')}
            </Button>
            <Button variant="outline" size="sm" className="text-sm bg-parchment-light border-parchment-dark/30">
              <BookOpen size={16} className="mr-1" /> {t('profile.viewNotes')}
            </Button>
          </div>
        </div>
        
        {/* Saved Verses Section */}
        {savedVerses.length > 0 && (
          <div className="mb-6">
            <h3 className="font-oldstyle text-lg text-scripture-heading flex items-center gap-2 mb-3">
              <Bookmark size={18} className="text-ancient-gold" />
              {t('profile.savedVerses')}
            </h3>
            
            <div className="space-y-2">
              {savedVerses.map((verse) => (
                <Card key={verse.id} className="p-3 bg-parchment-light border-ancient-gold/20 hover:bg-parchment-light/80">
                  <button 
                    className="w-full text-left"
                    onClick={() => handleReadVerse(verse.book_id, verse.chapter_number, verse.verse_number)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-ancient-brown">
                        {bookNames[verse.book_id] || verse.book_id} {verse.chapter_number}:{verse.verse_number}
                      </span>
                      
                      {verse.highlight_color && (
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{backgroundColor: verse.highlight_color}}
                        ></div>
                      )}
                    </div>
                    {verse.note && <p className="text-sm mt-1 text-gray-600">{verse.note}</p>}
                  </button>
                </Card>
              ))}
              
              <div className="text-center pt-2">
                <Button 
                  variant="link" 
                  className="text-sm text-ancient-brown"
                >
                  {t('profile.viewAllVerses')}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="w-full bg-parchment-light">
            <TabsTrigger value="conquistas" className="flex-1">{t('achievements.title')}</TabsTrigger>
            <TabsTrigger value="estatisticas" className="flex-1">{t('profile.stats')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conquistas" className="mt-4 space-y-4">
            <AchievementList />
          </TabsContent>
          
          <TabsContent value="estatisticas" className="mt-4 space-y-4">
            <Card className="parchment-container overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-oldstyle text-lg text-scripture-heading flex items-center gap-2">
                  <LineChart size={18} className="text-primary" />
                  {t('profile.readingProgress')}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-oldstyle">{t('bible.oldTestament')}</h4>
                    <span className="text-xs text-muted-foreground">23%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-ancient-brown" style={{ width: '23%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-oldstyle">{t('bible.newTestament')}</h4>
                    <span className="text-xs text-muted-foreground">45%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-ancient-brown" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-oldstyle text-ancient-brown">12</p>
                    <p className="text-xs text-muted-foreground">{t('profile.completedBooks')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-oldstyle text-ancient-brown">247</p>
                    <p className="text-xs text-muted-foreground">{t('profile.chaptersRead')}</p>
                  </div>
                  <div className="text-center col-span-2">
                    <p className="text-2xl font-oldstyle text-ancient-brown">3521</p>
                    <p className="text-xs text-muted-foreground">{t('profile.versesRead')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-center">
          {isAuthenticated ? (
            <Button variant="outline" onClick={handleSignOut}>
              {t('profile.signOut')}
            </Button>
          ) : (
            <Button 
              className="bg-ancient-gold text-white hover:bg-ancient-gold/90"
              onClick={handleCreateAccount}
            >
              {t('auth.createAccount')}
            </Button>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
