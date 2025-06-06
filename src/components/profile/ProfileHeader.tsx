
import { Button } from '@/components/ui/button';
import SettingsDialog from '@/components/profile/SettingsDialog';
import { User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserProfile } from '@/types/bible.types';

interface ProfileHeaderProps {
  profile: UserProfile | null;
  isAuthenticated: boolean | null;
  onProfileUpdate: () => Promise<void>;
  onShowOnboarding: () => void;
}

const ProfileHeader = ({ 
  profile, 
  isAuthenticated, 
  onProfileUpdate, 
  onShowOnboarding 
}: ProfileHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="page-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User size={24} className="text-ancient-gold" />
          <h1 className="text-2xl font-oldstyle text-scripture-heading">
            {t('profile.title') || "Perfil"}
          </h1>
        </div>
        <div className="flex gap-2">
          {isAuthenticated && profile && (
            <Button 
              variant="outline" 
              onClick={onShowOnboarding}
              className="text-sm rounded-xl"
            >
              Configurar Onboarding
            </Button>
          )}
          <SettingsDialog profile={profile} onProfileUpdate={onProfileUpdate} />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
