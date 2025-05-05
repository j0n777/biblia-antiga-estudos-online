
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getLeaderboard } from '@/services/LeaderboardService';
import { LeaderboardEntry } from '@/types/bible.types';
import { UserCheck, Trophy, Medal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface LeaderboardProps {
  limit?: number;
  searchQuery?: string;
}

const Leaderboard = ({ limit = 15, searchQuery = '' }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard();
      setEntries(data);
      setLoading(false);
    };
    
    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy size={16} className="text-yellow-500" />;
    if (rank === 2) return <Medal size={16} className="text-gray-400" />;
    if (rank === 3) return <Medal size={16} className="text-amber-700" />;
    return rank;
  };

  const filteredEntries = entries.filter(entry => 
    entry.display_name?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
    entry.nickname?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-8 h-8 border-t-2 border-ancient-gold rounded-full animate-spin mb-2"></div>
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="parchment-container">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            {t('ranking.noScholars')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-oldstyle text-lg text-scripture-heading flex items-center gap-2">
          <Trophy size={18} className="text-ancient-gold" />
          {t('ranking.ranking')}
        </h3>
        <Badge variant="outline" className="bg-parchment-light/50">
          <UserCheck size={14} className="mr-1" /> {entries.length} {t('ranking.scholars')}
        </Badge>
      </div>
      
      <div className="space-y-2">
        {searchQuery && filteredEntries.length === 0 ? (
          <Card className="parchment-container">
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground">
                {t('ranking.noScholarsFound', { query: searchQuery })}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.slice(0, limit).map((entry, index) => (
            <Card 
              key={entry.id}
              className={`parchment-container overflow-hidden ${entry.rank <= 3 ? 'border-ancient-gold/30' : ''} animate-fade-in elevated-card`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-3 flex items-center">
                <div className="flex-shrink-0 w-8 text-center font-medium">
                  {getRankBadge(entry.rank)}
                </div>
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-parchment text-scripture-heading">
                    {entry.display_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                  {entry.avatar_url && <AvatarImage src={entry.avatar_url} />}
                </Avatar>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-scripture-heading">{entry.display_name}</p>
                      <p className="text-xs text-muted-foreground">@{entry.nickname}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-ancient-brown">{entry.experience_points} XP</p>
                      <p className="text-xs text-muted-foreground">{entry.streak_count} {t('ranking.days')} 🔥</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
