
import VerseOfTheDay from '@/components/home/VerseOfTheDay';

const VerseOfTheDaySection = () => {
  // In a real app, this data would come from an API or local storage
  const mockVerseOfDay = {
    reference: "João 3:16",
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    version: "King James Atualizada"
  };

  return (
    <div className="card" style={{
      backgroundColor: '#f8f5ea',
      border: '1px solid rgba(156, 142, 99, 0.25)',
      borderRadius: '0.75rem'
    }}>
      <VerseOfTheDay 
        reference={mockVerseOfDay.reference} 
        text={mockVerseOfDay.text} 
        version={mockVerseOfDay.version} 
      />
    </div>
  );
};

export default VerseOfTheDaySection;
