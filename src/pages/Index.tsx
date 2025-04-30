
import { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import VerseOfTheDay from '@/components/home/VerseOfTheDay';
import ReadingStreak from '@/components/achievements/ReadingStreak';
import BadgeProgress from '@/components/achievements/BadgeProgress';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  // In a real app, this data would come from an API or local storage
  const mockVerseOfDay = {
    reference: "João 3:16",
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    version: "King James Atualizada"
  };

  const mockStreak = {
    currentStreak: 5,
    longestStreak: 14,
    goalProgress: 75,
  };

  const mockBadges = [
    {
      id: "1",
      name: "Gênesis",
      description: "Completou a leitura de Gênesis",
      progress: 50,
      maxProgress: 50,
      unlocked: true,
      icon: "📖"
    },
    {
      id: "2",
      name: "Estudioso",
      description: "7 dias consecutivos de leitura",
      progress: 5,
      maxProgress: 7,
      unlocked: false,
      icon: "🔍"
    },
    {
      id: "3",
      name: "Compartilhador",
      description: "Compartilhou 10 versículos",
      progress: 3,
      maxProgress: 10,
      unlocked: false,
      icon: "📤"
    },
  ];

  return (
    <PageLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-oldstyle text-scripture-heading">Bíblia Antiga</h1>
          <ThemeToggle />
        </div>
      
        <div className="space-y-6">
          <VerseOfTheDay 
            reference={mockVerseOfDay.reference}
            text={mockVerseOfDay.text}
            version={mockVerseOfDay.version}
          />
          
          <ReadingStreak 
            currentStreak={mockStreak.currentStreak}
            longestStreak={mockStreak.longestStreak}
            goalProgress={mockStreak.goalProgress}
          />
          
          <BadgeProgress badges={mockBadges} />
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
