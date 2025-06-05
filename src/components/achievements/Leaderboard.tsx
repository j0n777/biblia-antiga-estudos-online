
import { useState, useEffect } from 'react';
import { User, Trophy, Medal, Flame, Award } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getXPLeaderboard, getStreakLeaderboard, getUserXPRank, getUserStreakRank } from '@/services/LeaderboardService';
import { getUserProfile } from '@/services/ProfileService';
import { LeaderboardEntry, UserProfile } from '@/types/bible.types';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Leaderboard = () => {
  const [xpEntries, setXpEntries] = useState<LeaderboardEntry[]>([]);
  const [streakEntries, setStreakEntries] = useState<LeaderboardEntry[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userXPRank, setUserXPRank] = useState<number | null>(null);
  const [userStreakRank, setUserStreakRank] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('xp');
  
  const { t } = useLanguage();
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load both leaderboards
        const [xpData, streakData] = await Promise.all([
          getXPLeaderboard(10),
          getStreakLeaderboard(10)
        ]);
        
        setXpEntries(xpData);
        setStreakEntries(streakData);
        
        // Load user profile
        const profile = await getUserProfile();
        setUserProfile(profile);
        
        // Get user's ranks if authenticated
        if (profile && !profile.id.startsWith('guest-')) {
          const [xpRank, streakRank] = await Promise.all([
            getUserXPRank(profile.id),
            getUserStreakRank(profile.id)
          ]);
          setUserXPRank(xpRank);
          setUserStreakRank(streakRank);
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const getInitials = (name?: string): string => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  
  const renderLeaderboard = (entries: LeaderboardEntry[], type: 'xp' | 'streak', userRank: number | null) => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 bg-parchment-dark/30 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-parchment-dark/30 rounded mb-2"></div>
                <div className="h-3 w-16 bg-parchment-dark/20 rounded"></div>
              </div>
              <div className="h-5 w-12 bg-parchment-dark/30 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    if (entries.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-parchment-dark/20 mb-4">
            <User className="h-6 w-6 text-ancient-gold" />
          </div>
          <p className="text-lg font-medium text-scripture-text">
            {type === 'xp' ? 'Nenhum ranking de XP ainda' : 'Nenhum ranking de sequência ainda'}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('ranking.startReading')}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {entries.map((entry, index) => {
          const isCurrentUser = userProfile && entry.id === userProfile.id;
          const rankClass = index === 0 ? 'text-ancient-gold' : 
                           index === 1 ? 'text-ancient-brown' : 
                           index === 2 ? 'text-orange-400' : 'text-muted-foreground';
          
          return (
            <Card
              key={entry.id}
              className={`flex items-center p-3 ${isCurrentUser ? 'bg-ancient-gold/10 border-ancient-gold/20' : 'bg-parchment-light/60'}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`flex items-center justify-center w-8 h-8 ${rankClass} font-bold`}>
                  {entry.rank}
                </div>
                
                <Avatar className="h-10 w-10 border-2 border-parchment">
                  {entry.avatar_url ? (
                    <AvatarImage src={entry.avatar_url} alt={entry.display_name || 'User'} />
                  ) : (
                    <AvatarFallback className="bg-ancient-gold/20 text-ancient-brown">
                      {getInitials(entry.display_name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div>
                  <p className={`font-medium ${isCurrentUser ? 'text-ancient-brown' : 'text-scripture-text'}`}>
                    {entry.display_name || entry.nickname || t('profile.anonymous')}
                    {isCurrentUser && <span className="ml-2 text-xs text-ancient-gold">({t('common.you')})</span>}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <div className="flex items-center">
                      {type === 'xp' ? (
                        <Trophy className="h-3 w-3 mr-1 text-ancient-gold" />
                      ) : (
                        <Flame className="h-3 w-3 mr-1 text-orange-500" />
                      )}
                      <span>
                        {type === 'xp' ? `${entry.total_xp || 0} XP` : `${entry.current_streak || 0} dias`}
                      </span>
                    </div>
                    {type === 'xp' && entry.current_streak ? (
                      <div className="flex items-center">
                        <Flame className="h-3 w-3 mr-1 text-orange-500" />
                        <span>{entry.current_streak} sequência</span>
                      </div>
                    ) : type === 'streak' && entry.total_xp ? (
                      <div className="flex items-center">
                        <Trophy className="h-3 w-3 mr-1 text-ancient-gold" />
                        <span>{entry.total_xp} XP</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              
              <div className="text-2xl text-ancient-brown font-oldstyle font-medium">
                {type === 'xp' ? (entry.total_xp || 0) : (entry.current_streak || 0)}
              </div>
            </Card>
          );
        })}
        
        <p className="text-center text-xs text-muted-foreground mt-4 pb-2">
          {entries.length} {t('ranking.scholarsShown')}
        </p>
        
        {userProfile && userRank && !entries.some(e => e.id === userProfile.id) && (
          <div className="mt-4 border-t border-parchment-dark/10 pt-4">
            <p className="text-sm text-ancient-brown mb-2">
              {type === 'xp' ? 'Sua posição (XP)' : 'Sua posição (Sequência)'}
            </p>
            <Card className="flex items-center p-3 bg-ancient-gold/10 border-ancient-gold/20">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 text-ancient-brown font-bold">
                  {userRank}
                </div>
                
                <Avatar className="h-10 w-10 border-2 border-parchment">
                  {userProfile.avatar_url ? (
                    <AvatarImage src={userProfile.avatar_url} alt={userProfile.display_name || 'User'} />
                  ) : (
                    <AvatarFallback className="bg-ancient-gold/20 text-ancient-brown">
                      {getInitials(userProfile.display_name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div>
                  <p className="font-medium text-ancient-brown">
                    {userProfile.display_name || userProfile.nickname || t('profile.anonymous')}
                    <span className="ml-2 text-xs text-ancient-gold">({t('common.you')})</span>
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <div className="flex items-center">
                      {type === 'xp' ? (
                        <Trophy className="h-3 w-3 mr-1 text-ancient-gold" />
                      ) : (
                        <Flame className="h-3 w-3 mr-1 text-orange-500" />
                      )}
                      <span>
                        {type === 'xp' 
                          ? `${userProfile.total_xp || 0} XP` 
                          : `${userProfile.current_streak || 0} dias`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-2xl text-ancient-brown font-oldstyle font-medium">
                {type === 'xp' 
                  ? (userProfile.total_xp || 0) 
                  : (userProfile.current_streak || 0)
                }
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-oldstyle text-scripture-heading mb-1">Rankings dos Estudiosos</h3>
        <p className="text-sm text-muted-foreground">Compete com outros leitores da Bíblia</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-parchment-light rounded-xl">
          <TabsTrigger value="xp" className="flex items-center gap-2 rounded-xl">
            <Trophy className="h-4 w-4" />
            XP
          </TabsTrigger>
          <TabsTrigger value="streak" className="flex items-center gap-2 rounded-xl">
            <Flame className="h-4 w-4" />
            Sequência
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="xp" className="mt-4">
          {renderLeaderboard(xpEntries, 'xp', userXPRank)}
        </TabsContent>
        
        <TabsContent value="streak" className="mt-4">
          {renderLeaderboard(streakEntries, 'streak', userStreakRank)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
