
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileActionsProps {
  isAuthenticated: boolean | null;
  onSignOut: () => Promise<void>;
  onCreateAccount: () => void;
}

const ProfileActions = ({ isAuthenticated, onSignOut, onCreateAccount }: ProfileActionsProps) => {
  const { t } = useLanguage();

  return (
    <div className="mt-6 flex justify-center">
      {isAuthenticated ? (
        <Button variant="outline" className="rounded-xl" onClick={onSignOut}>
          {t('auth.signOut') || "Sair"}
        </Button>
      ) : (
        <Button 
          className="bg-ancient-gold text-white hover:bg-ancient-gold/90 rounded-xl"
          onClick={onCreateAccount}
        >
          {t('auth.createAccount') || "Criar Conta"}
        </Button>
      )}
    </div>
  );
};

export default ProfileActions;
