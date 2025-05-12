
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Share2, LineChart, History } from 'lucide-react';
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
    <div className="flex flex-col items-center mb-6">
      <button 
        className="w-24 h-24 rounded-full mb-3 cursor-pointer focus:outline-none"
        onClick={!isAuthenticated ? onCreateAccount : undefined}
      >
        <Avatar className="w-24 h-24 border-4 border-ancient-brown rounded-full">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="bg-ancient-brown text-white text-3xl font-oldstyle">
            {profile?.display_name?.[0] || profile?.nickname?.[0] || 'V'}
          </AvatarFallback>
        </Avatar>
      </button>
      
      <h2 className="text-xl font-oldstyle text-ancient-brown">
        {profile?.nickname || profile?.display_name || t('auth.guest')}
      </h2>
      
      <div className="flex items-center gap-2 mt-1">
        <LineChart size={16} className="text-ancient-gold" />
        <span className="text-sm font-medium">{profile?.experience_points || 0} {t('profile.points')}</span>
      </div>
      
      <div className="flex gap-3 mt-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-sm bg-parchment-light border-parchment-dark/30"
          onClick={onOpenHistoryDialog}
        >
          <History size={16} className="mr-1" /> {t('profile.history')}
        </Button>
        <Button variant="outline" size="sm" className="text-sm bg-parchment-light border-parchment-dark/30">
          <Share2 size={16} className="mr-1" /> {t('common.share')}
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
