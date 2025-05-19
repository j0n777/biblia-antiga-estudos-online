
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchHistoryProps {
  searchHistory: string[];
  onHistoryItemClick: (query: string) => void;
}

const SearchHistory = ({ searchHistory, onHistoryItemClick }: SearchHistoryProps) => {
  if (!searchHistory || searchHistory.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-scripture-heading mb-2 flex items-center gap-1">
        <Clock className="h-3.5 w-3.5 text-ancient-gold" />
        Pesquisas recentes:
      </h3>
      <div className="flex flex-wrap gap-2">
        {searchHistory.map((historyItem, index) => (
          <Badge 
            key={index}
            variant="outline" 
            className="bg-parchment-dark/5 hover:bg-parchment-dark/10 cursor-pointer rounded-lg border-parchment-dark/10 text-scripture-text/80"
            onClick={() => onHistoryItemClick(historyItem)}
          >
            {historyItem}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
