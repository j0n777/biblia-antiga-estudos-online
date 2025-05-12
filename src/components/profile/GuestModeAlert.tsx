
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface GuestModeAlertProps {
  onCreateAccount: () => void;
}

const GuestModeAlert = ({ onCreateAccount }: GuestModeAlertProps) => {
  const { t } = useLanguage();
  
  return (
    <Alert className="mb-6 bg-parchment-light border-ancient-gold/40">
      <AlertCircle className="h-4 w-4 text-ancient-gold" />
      <AlertTitle className="text-ancient-brown">{t('auth.guestMode')}</AlertTitle>
      <AlertDescription className="text-sm">
        {t('auth.guestModeDescription')}
        <div className="mt-2">
          <Button 
            onClick={onCreateAccount} 
            className="bg-ancient-gold text-white hover:bg-ancient-gold/90"
          >
            {t('auth.createAccount')}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default GuestModeAlert;
