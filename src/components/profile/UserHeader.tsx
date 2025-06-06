
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Share2, History, Trophy } from 'lucide-react';
import { UserProfile } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserHeaderProps {
  profile: UserProfile | null;
  onOpenHistoryDialog: () => void;
  onCreateAccount: () => void;
  isAuthenticated: boolean | null;
}

const UserHeader = ({ profile, onOpenHistoryDialog, onCreateAccount, isAuthenticated }: UserHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="card p-4 mb-4">
      <div className="flex flex-col items-center">
        <button 
          className="w-20 h-20 rounded-full mb-3 cursor-pointer focus:outline-none transition-transform hover:scale-105"
          onClick={!isAuthenticated ? onCreateAccount : undefined}
        >
          <Avatar className="w-20 h-20 border-3 border-ancient-gold shadow-lg">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-ancient-gold text-white text-2xl font-oldstyle">
              {profile?.display_name?.[0] || profile?.nickname?.[0] || 'V'}
            </AvatarFallback>
          </Avatar>
        </button>
        
        <h2 className="mb-2">
          {profile?.nickname || profile?.display_name || t('auth.guest')}
        </h2>
        
        <div className="flex items-center gap-2 mb-3 bg-ancient-gold/20 px-3 py-1.5 rounded-xl">
          <Trophy size={16} className="text-ancient-gold" />
          <span className="text-sm text-ancient-brown">
            {profile?.experience_points || 0} {t('profile.points')}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={onOpenHistoryDialog}
          >
            <History size={14} className="mr-1" /> {t('profile.history')}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
          >
            <Share2 size={14} className="mr-1" /> {t('common.share')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
