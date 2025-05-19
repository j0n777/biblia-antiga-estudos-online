
import { Badge } from '@/components/ui/badge';

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const SearchSuggestions = ({ suggestions, onSuggestionClick }: SearchSuggestionsProps) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mb-3">
      <h3 className="text-sm font-medium text-scripture-heading mb-2">Sugestões de busca:</h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(suggestion => (
          <Badge 
            key={suggestion}
            variant="outline" 
            className="bg-parchment-dark/10 hover:bg-parchment-dark/20 cursor-pointer rounded-lg border-parchment-dark/20"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;
