
import VerseOfTheDay from '@/components/home/VerseOfTheDay';

const VerseOfTheDaySection = () => {
  // In a real app, this data would come from an API or local storage
  const mockVerseOfDay = {
    reference: "João 3:16",
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    version: "King James Atualizada"
  };

  return (
    <div className="card">
      <VerseOfTheDay 
        reference={mockVerseOfDay.reference} 
        text={mockVerseOfDay.text} 
        version={mockVerseOfDay.version} 
      />
    </div>
  );
};

export default VerseOfTheDaySection;
