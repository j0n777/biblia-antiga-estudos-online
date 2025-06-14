
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Sparkles, Heart } from 'lucide-react';
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
    <div className="card border-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-20 h-20 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/10 rounded-full"></div>
      <div className="absolute top-4 right-4">
        <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
      </div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-5 w-5 text-pink-200" />
              <h3 className="font-bold text-lg text-white">Desbloqueie seu potencial!</h3>
            </div>
            <p className="text-white/90 text-sm">
              🚀 Crie uma conta e participe do ranking com milhares de usuários!
            </p>
          </div>
          <Button 
            className="bg-white text-purple-600 hover:bg-white/90 font-bold rounded-xl px-6 py-3 shadow-lg transform hover:scale-105 transition-all duration-200" 
            onClick={() => navigate('/auth')}
          >
            ✨ Começar agora
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default RegistrationIncentive;
