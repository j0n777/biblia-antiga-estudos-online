
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { UserProfile } from '@/types/bible.types';

interface RegistrationIncentiveProps {
  profile: UserProfile | null;
}

const RegistrationIncentive = ({ profile }: RegistrationIncentiveProps) => {
  const navigate = useNavigate();

  if (profile?.id && !profile?.id.startsWith('guest-')) {
    return null;
  }

  return (
    <div className="card border-ancient-gold/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-ancient-gold/20 text-ancient-gold">
            <Trophy size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-oldstyle text-bible-title">Desbloqueie seu potencial</h3>
            <p className="text-sm text-muted-foreground">Crie uma conta para salvar seu progresso e participar do ranking</p>
          </div>
          <Button className="bg-ancient-gold text-white hover:bg-ancient-gold/90" onClick={() => navigate('/auth')}>
            Criar conta
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default RegistrationIncentive;
