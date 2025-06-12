
import { useState } from 'react';
import { PenLine } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PrayerRequestFormProps {
  onSubmit: (content: string, isAnonymous: boolean) => void;
}

const PrayerRequestForm = ({ onSubmit }: PrayerRequestFormProps) => {
  const [newPrayer, setNewPrayer] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;
    
    onSubmit(newPrayer, isAnonymous);
    setNewPrayer('');
    setIsAnonymous(false);
  };

  return (
    <Card className="mb-6" style={{ backgroundColor: '#f8f5ea', border: '1px solid rgba(156, 142, 99, 0.25)' }}>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-base">Compartilhe seu pedido de oração</CardTitle>
          <CardDescription>Conecte-se com a comunidade através da oração</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Textarea 
            placeholder="Escreva seu pedido de oração aqui..." 
            value={newPrayer} 
            onChange={e => setNewPrayer(e.target.value)} 
            className="resize-none bg-parchment-dark/5" 
          />
          
          <div className="flex items-center mt-4">
            <input 
              type="checkbox" 
              id="anonymous" 
              checked={isAnonymous} 
              onChange={() => setIsAnonymous(!isAnonymous)} 
              className="mr-2" 
            />
            <label htmlFor="anonymous" className="text-sm text-muted-foreground">
              Publicar anonimamente
            </label>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="bg-ancient-gold hover:bg-ancient-gold/90 w-full" 
            disabled={!newPrayer.trim()}
          >
            <PenLine className="h-4 w-4 mr-2" /> Compartilhar Pedido
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PrayerRequestForm;
