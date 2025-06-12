
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
    <div 
      className="space-y-3 p-4 rounded-xl border"
      style={{
        backgroundColor: '#f8f5ea',
        border: '1px solid rgba(156, 142, 99, 0.25)',
        borderRadius: '0.75rem',
        boxShadow: '0 2px 8px rgba(92, 63, 23, 0.06)'
      }}
    >
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
            className="cursor-pointer rounded-xl transition-colors"
            style={{
              backgroundColor: '#f5f1e6',
              color: '#5e4119',
              borderColor: 'rgba(156, 142, 99, 0.3)',
              borderRadius: '0.75rem'
            }}
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
