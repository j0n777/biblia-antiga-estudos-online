
import { Heart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

interface PrayerRequestCardProps {
  request: PrayerRequest;
  onPray: (requestId: string) => void;
}

const PrayerRequestCard = ({ request, onPray }: PrayerRequestCardProps) => (
  <Card style={{ backgroundColor: '#f8f5ea', border: '1px solid rgba(156, 142, 99, 0.25)' }}>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {!request.is_anonymous && (
            <Avatar className="h-8 w-8 mr-2">
              {request.avatar_url ? (
                <AvatarImage src={request.avatar_url} />
              ) : (
                <AvatarFallback className="bg-ancient-gold/20 text-ancient-brown">
                  {request.user_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          )}
          <CardTitle className="text-sm font-medium">
            {request.is_anonymous ? 'Anônimo' : request.user_name}
          </CardTitle>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(request.created_at).toLocaleDateString()}
        </span>
      </div>
    </CardHeader>
    
    <CardContent className="py-2">
      <p className="text-sm">{request.content}</p>
    </CardContent>
    
    <CardFooter className="pt-2">
      <Button 
        variant="ghost" 
        className="text-xs flex items-center gap-1" 
        onClick={() => onPray(request.id)}
      >
        <Heart className="h-3 w-3 text-rose-500" />
        <span>
          {request.prayers_count} {request.prayers_count === 1 ? 'pessoa' : 'pessoas'} oraram por isto
        </span>
      </Button>
    </CardFooter>
  </Card>
);

export default PrayerRequestCard;
