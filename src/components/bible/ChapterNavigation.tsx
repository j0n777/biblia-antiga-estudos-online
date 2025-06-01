
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
      <div className="flex gap-1 bg-bible-controls/90 backdrop-blur-sm p-1 rounded-xl shadow-lg border border-gray-300/50">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onPreviousChapter}
          className="hover:bg-bible-controls/80 rounded-xl h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="opacity-60 cursor-default hover:bg-transparent rounded-xl h-8 px-3 text-sm font-medium"
        >
          {chapterNumber}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onNextChapter}
          className="hover:bg-bible-controls/80 rounded-xl h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChapterNavigation;
