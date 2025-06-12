
import { useState } from 'react';
import PrayerRequestForm from './PrayerRequestForm';
import PrayerRequestCard from './PrayerRequestCard';
import { UserProfile } from '@/types/bible.types';

interface PrayerRequest {
  id: string;
  user_id: string;
  user_name: string;
  avatar_url?: string;
  content: string;
  created_at: string;
  prayers_count: number;
  is_anonymous: boolean;
}

interface PrayerRequestsSectionProps {
  profile: UserProfile | null;
  initialPrayerRequests: PrayerRequest[];
}

const mockPrayerRequests: PrayerRequest[] = [
  {
    id: '1',
    user_id: '1',
    user_name: 'João Silva',
    content: 'Por favor, orem pela saúde da minha mãe que está passando por um tratamento difícil.',
    created_at: '2025-05-05T12:00:00Z',
    prayers_count: 15,
    is_anonymous: false
  },
  {
    id: '2',
    user_id: '2',
    user_name: 'Maria',
    content: 'Preciso de orações para uma decisão importante que preciso tomar em minha vida profissional.',
    created_at: '2025-05-05T10:30:00Z',
    prayers_count: 8,
    is_anonymous: true
  },
  {
    id: '3',
    user_id: '3',
    user_name: 'Carlos Mendes',
    avatar_url: 'https://i.pravatar.cc/150?u=carlos',
    content: 'Orem por mim e minha família, estamos passando por um momento de transição e precisamos de sabedoria.',
    created_at: '2025-05-04T20:15:00Z',
    prayers_count: 23,
    is_anonymous: false
  }
];

const PrayerRequestsSection = ({ profile, initialPrayerRequests }: PrayerRequestsSectionProps) => {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(
    initialPrayerRequests.length > 0 ? initialPrayerRequests : mockPrayerRequests
  );

  const handlePrayerSubmit = (content: string, isAnonymous: boolean) => {
    const newRequest: PrayerRequest = {
      id: Date.now().toString(),
      user_id: profile?.id || 'guest',
      user_name: profile?.display_name || 'Anônimo',
      avatar_url: profile?.avatar_url,
      content,
      created_at: new Date().toISOString(),
      prayers_count: 0,
      is_anonymous: isAnonymous
    };
    
    setPrayerRequests([newRequest, ...prayerRequests]);
  };

  const handlePray = (requestId: string) => {
    setPrayerRequests(prayerRequests.map(req => 
      req.id === requestId 
        ? { ...req, prayers_count: req.prayers_count + 1 }
        : req
    ));
  };

  return (
    <div className="animate-slide-up">
      <h2 className="text-xl font-oldstyle text-scripture-heading mb-4">Pedidos de Oração</h2>
      
      <PrayerRequestForm onSubmit={handlePrayerSubmit} />
      
      <div className="space-y-4">
        {prayerRequests.map((request) => (
          <PrayerRequestCard 
            key={request.id} 
            request={request} 
            onPray={handlePray} 
          />
        ))}
      </div>
    </div>
  );
};

export default PrayerRequestsSection;
