
import VerseOfTheDay from '@/components/home/VerseOfTheDay';
import { Sparkles } from 'lucide-react';

const VerseOfTheDaySection = () => {
  // In a real app, this data would come from an API or local storage
  const mockVerseOfDay = {
    reference: "João 3:16",
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    version: "King James Atualizada"
  };

  return (
    <div className="card relative overflow-hidden">
      <div className="absolute top-4 right-4">
        <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
      </div>
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20"></div>
      <VerseOfTheDay 
        reference={mockVerseOfDay.reference} 
        text={mockVerseOfDay.text} 
        version={mockVerseOfDay.version} 
      />
    </div>
  );
};

export default VerseOfTheDaySection;
