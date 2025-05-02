
import { useState, useEffect } from 'react';
import { getLeaderboard } from '@/services/AchievementService';
import { LeaderboardEntry } from '@/types/bible.types';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const { data: session } = await supabase.auth.getSession();
      if (session.session?.user) {
        setCurrentUserId(session.session.user.id);
      }
      
      // Get leaderboard
      const leaderboard = await getLeaderboard();
      setEntries(leaderboard);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="parchment-container p-4">Carregando ranking...</div>;
  }

  if (entries.length === 0) {
    return (
      <Card className="parchment-container">
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Não há dados no ranking ainda.</p>
        </div>
      </Card>
    );
  }

  // Find user's position
  const userEntry = entries.find(entry => entry.id === currentUserId);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-oldstyle text-lg text-scripture-heading flex items-center gap-2">
          <Trophy size={18} className="text-ancient-gold" />
          Ranking de Leitores
        </h3>
      </div>
      
      {userEntry && (
        <Card className="parchment-container bg-ancient-gold/10 border-ancient-gold/50">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-ancient-gold text-white font-bold">
                {userEntry.rank}
              </div>
              <Avatar className="h-10 w-10 border-2 border-ancient-gold">
                <AvatarImage src={userEntry.avatar_url || undefined} />
                <AvatarFallback className="bg-ancient-brown text-white">
                  {userEntry.nickname?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-medium">
                    {userEntry.nickname || "Usuário"}
                  </p>
                  <Badge variant="outline" className="text-xs font-normal">Você</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {userEntry.experience_points} pontos • {userEntry.achievements_count} conquistas
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <Card className="parchment-container">
        <div className="p-2">
          <Table>
            <TableHeader>
              <TableRow className="border-parchment-dark/20">
                <TableHead className="w-12">Pos.</TableHead>
                <TableHead>Leitor</TableHead>
                <TableHead className="text-right">XP</TableHead>
                <TableHead className="text-right">🔥</TableHead>
                <TableHead className="text-right">🏆</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.slice(0, 10).map((entry) => (
                <TableRow 
                  key={entry.id} 
                  className={`border-parchment-dark/10 hover:bg-parchment-light ${
                    entry.id === currentUserId ? 'bg-ancient-gold/5' : ''
                  }`}
                >
                  <TableCell className="font-medium text-center">
                    {entry.rank === 1 ? (
                      <span className="text-xl text-ancient-gold">👑</span>
                    ) : entry.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.avatar_url || undefined} />
                        <AvatarFallback className="bg-ancient-brown text-white">
                          {entry.nickname?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{entry.nickname || "Anônimo"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{entry.experience_points}</TableCell>
                  <TableCell className="text-right">{entry.streak_count}</TableCell>
                  <TableCell className="text-right">{entry.achievements_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
