
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink } from 'lucide-react';

const bibleStudies = [{
  id: '1',
  title: 'Por onde começar a ler a Bíblia?',
  description: 'Um guia para iniciantes na leitura bíblica',
  icon: '📖',
  category: 'beginner'
}, {
  id: '2',
  title: 'Os 10 Mandamentos',
  description: 'Estudo sobre os mandamentos e sua aplicação hoje',
  icon: '📜',
  category: 'doctrine'
}, {
  id: '3',
  title: 'Vida de Jesus',
  description: 'Jornada pelos evangelhos e a vida de Cristo',
  icon: '✝️',
  category: 'biography'
}, {
  id: '4',
  title: 'Salmos de Adoração',
  description: 'Meditações nos Salmos de louvor',
  icon: '🙏',
  category: 'devotional'
}];

const BibleStudiesSection = () => {
  const navigate = useNavigate();

  return (
    <div className="card space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-ancient-gold" />
          <h2 className="text-xl subtitle-text">Estudos Bíblicos</h2>
        </div>
        <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-ancient-gold" onClick={() => navigate('/search')}>
          Ver todos
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bibleStudies.map(study => (
          <Card key={study.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center text-2xl bg-ancient-gold/20 rounded-xl">
                {study.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-oldstyle text-bible-title">{study.title}</h3>
                <p className="text-sm text-muted-foreground">{study.description}</p>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0 hover:bg-ancient-gold/10">
                <ExternalLink className="h-5 w-5 text-ancient-brown" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center pt-2">
        <Button variant="outline" className="flex gap-2" onClick={() => navigate('/search')}>
          <BookOpen size={16} />
          <span>Buscar estudos</span>
        </Button>
      </div>
    </div>
  );
};

export default BibleStudiesSection;
