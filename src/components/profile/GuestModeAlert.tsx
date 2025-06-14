
import { AlertCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface GuestModeAlertProps {
  onCreateAccount: () => void;
}

const GuestModeAlert = ({ onCreateAccount }: GuestModeAlertProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-ancient-gold mt-0.5" />
      <div className="flex-1">
        <h3 className="text-ancient-brown mb-1 font-oldstyle">
          {t('auth.guestMode')} - Experiência Limitada
        </h3>
        <p className="text-secondary mb-3 text-sm">
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
      </div>
    </div>
  );
};

export default GuestModeAlert;
