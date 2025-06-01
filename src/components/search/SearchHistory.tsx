
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchHistoryProps {
  searchHistory: string[];
  onHistoryItemClick: (query: string) => void;
  history?: string[];
  onItemClick?: (query: string) => void;
  onClear?: () => void;
}

const SearchHistory = ({ 
  searchHistory, 
  onHistoryItemClick,
  history, 
  onItemClick,
  onClear
}: SearchHistoryProps) => {
  // Use either old or new props
  const items = history || searchHistory;
  const handleClick = onItemClick || onHistoryItemClick;
  
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-scripture-heading flex items-center gap-2">
          <Clock className="h-4 w-4 text-ancient-gold" />
          Pesquisas recentes:
        </h3>
        {onClear && (
          <button 
            onClick={onClear} 
            className="text-xs text-muted-foreground hover:text-ancient-gold"
          >
            Limpar
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((historyItem, index) => (
          <Badge 
            key={index}
            variant="outline" 
            className="bg-parchment-dark/5 hover:bg-parchment-dark/10 cursor-pointer rounded-lg border-parchment-dark/20 text-scripture-text/80 transition-colors"
            onClick={() => handleClick(historyItem)}
          >
            {historyItem}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
