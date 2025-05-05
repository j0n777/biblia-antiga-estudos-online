
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ChapterNavigationProps {
  chapterNumber: number;
  onPreviousChapter: () => void;
  onNextChapter: () => void;
}

const ChapterNavigation = ({
  chapterNumber,
  onPreviousChapter,
  onNextChapter
}: ChapterNavigationProps) => {
  return (
    <div className="fixed bottom-20 left-0 right-0 flex justify-center px-4 pb-4">
      <div className="flex gap-2 bg-parchment-light/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-parchment-dark/30">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onPreviousChapter}
          className="hover:bg-parchment-dark/20"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="opacity-50 cursor-default hover:bg-transparent"
        >
          {chapterNumber}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onNextChapter}
          className="hover:bg-parchment-dark/20"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default ChapterNavigation;
