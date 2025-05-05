
import { useState, useEffect } from 'react';
import { User, Trophy, Medal } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getLeaderboard, getUserRank } from '@/services/LeaderboardService';
import { getUserProfile } from '@/services/ProfileService';
import { LeaderboardEntry, UserProfile } from '@/types/bible.types';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  
  const { t } = useLanguage();
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load leaderboard
        const data = await getLeaderboard(10); // Show top 10
        setEntries(data);
        
        // Load user profile
        const profile = await getUserProfile();
        setUserProfile(profile);
        
        // Get user's rank if authenticated
        if (profile && !profile.id.startsWith('guest-')) {
          const rank = await getUserRank(profile.id);
          setUserRank(rank);
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
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-oldstyle text-scripture-heading mb-1">{t('ranking.topScholars')}</h3>
        <p className="text-sm text-muted-foreground">{t('ranking.topDescription')}</p>
      </div>
      
      {entries.length > 0 ? (
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
                        <Trophy className="h-3 w-3 mr-1 text-ancient-gold" />
                        <span>{entry.experience_points} XP</span>
                      </div>
                      {entry.streak_count ? (
                        <div className="flex items-center">
                          <Medal className="h-3 w-3 mr-1" />
                          <span>{entry.streak_count} {t('profile.streak')}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                
                <div className="text-2xl text-ancient-brown font-oldstyle font-medium">
                  {entry.experience_points}
                </div>
              </Card>
            );
          })}
          
          <p className="text-center text-xs text-muted-foreground mt-4 pb-2">
            {entries.length} {t('ranking.scholarsShown')}
          </p>
          
          {userProfile && userRank && !entries.some(e => e.id === userProfile.id) && (
            <div className="mt-4 border-t border-parchment-dark/10 pt-4">
              <p className="text-sm text-ancient-brown mb-2">{t('ranking.yourRank')}</p>
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
                        <Trophy className="h-3 w-3 mr-1 text-ancient-gold" />
                        <span>{userProfile.experience_points} XP</span>
                      </div>
                      {userProfile.streak_count ? (
                        <div className="flex items-center">
                          <Medal className="h-3 w-3 mr-1" />
                          <span>{userProfile.streak_count} {t('profile.streak')}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                
                <div className="text-2xl text-ancient-brown font-oldstyle font-medium">
                  {userProfile.experience_points}
                </div>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-parchment-dark/20 mb-4">
            <User className="h-6 w-6 text-ancient-gold" />
          </div>
          <p className="text-lg font-medium text-scripture-text">{t('ranking.noRankings')}</p>
          <p className="text-sm text-muted-foreground">{t('ranking.startReading')}</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
