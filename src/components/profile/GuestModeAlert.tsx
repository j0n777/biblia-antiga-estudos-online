
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface GuestModeAlertProps {
  onCreateAccount: () => void;
}

const GuestModeAlert = ({ onCreateAccount }: GuestModeAlertProps) => {
  const { t } = useLanguage();
  
  return (
    <Alert className="mb-6 bg-gradient-to-r from-ancient-gold/10 to-ancient-brown/5 border-ancient-gold/40">
      <AlertCircle className="h-5 w-5 text-ancient-gold" />
      <AlertTitle className="text-ancient-brown font-semibold">
        {t('auth.guestMode')} - Experiência Limitada
      </AlertTitle>
      <AlertDescription className="text-sm text-scripture-text">
        <p className="mb-3">
          {t('auth.guestModeDescription')} Crie uma conta para desbloquear todas as funcionalidades.
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-ancient-gold/20 px-2 py-1 rounded">✨ Conquistas</span>
          <span className="text-xs bg-ancient-gold/20 px-2 py-1 rounded">📊 Estatísticas</span>
          <span className="text-xs bg-ancient-gold/20 px-2 py-1 rounded">🔖 Versículos Salvos</span>
          <span className="text-xs bg-ancient-gold/20 px-2 py-1 rounded">📚 Histórico de Leitura</span>
        </div>
        <Button 
          onClick={onCreateAccount} 
          className="bg-ancient-gold text-white hover:bg-ancient-gold/90 shadow-sm"
          size="sm"
        >
          <UserPlus size={16} className="mr-2" />
          {t('auth.createAccount')}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default GuestModeAlert;
