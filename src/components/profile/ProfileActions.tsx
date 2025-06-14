
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileActionsProps {
  isAuthenticated: boolean | null;
  onSignOut: () => Promise<void>;
  onCreateAccount: () => void;
}

const ProfileActions = ({ isAuthenticated, onSignOut }: ProfileActionsProps) => {
  const { t } = useLanguage();

  // Só mostra ações para usuários autenticados, já que o botão "Criar Conta" está no banner de visitante
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <Button variant="outline" className="rounded-xl" onClick={onSignOut}>
        {t('auth.signOut') || "Sair"}
      </Button>
    </div>
  );
};

export default ProfileActions;
