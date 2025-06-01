
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const defaultSuggestions = [
  "amor",
  "paz",
  "salvação",
  "fé",
  "esperança",
  "João 3:16",
  "Romanos 8:28",
  "Salmo 23",
  "Filipenses 4:13"
];

const SearchSuggestions = ({ 
  suggestions = defaultSuggestions, 
  onSuggestionClick 
}: SearchSuggestionsProps) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-scripture-heading flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-ancient-gold" />
        Sugestões de busca:
      </h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(suggestion => (
          <Badge 
            key={suggestion}
            variant="outline" 
            className="bg-ancient-gold/5 hover:bg-ancient-gold/15 cursor-pointer rounded-lg border-ancient-gold/20 text-scripture-text transition-colors"
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
