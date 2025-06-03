
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  searchQuery: string;
  isSearching: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClick: () => void;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const SearchInput = ({ 
  searchQuery, 
  isSearching, 
  onInputChange, 
  onSearchClick,
  placeholder,
  value,
  onChange,
  onSearch,
  onFocus,
  onBlur
}: SearchInputProps) => {
  // Use either the new props or the old props
  const query = value || searchQuery;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
    else onInputChange(e);
  };
  
  // Handle keyboard submission (Enter key)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim().length >= 2 && !isSearching) {
      console.log(`Enter pressed, searching for: "${query}"`);
      if (onSearch) onSearch(query);
      else onSearchClick();
    }
  };
  
  const handleButtonClick = () => {
    console.log(`Search button clicked for: "${query}"`);
    if (onSearch) onSearch(query);
    else onSearchClick();
  };
  
  return (
    <div className="flex gap-3">
      <div className="relative flex-grow">
        <Input
          placeholder={placeholder || "Digite qualquer palavra (ex: amor, paz, Jesus) ou referência (João 3:16)..."}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          className="border-parchment-dark/20 pr-10 rounded-xl text-base h-12"
          style={{
            backgroundColor: '#f5f1e6',
            color: '#5e4119',
            borderRadius: '0.75rem'
          }}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      <Button 
        onClick={handleButtonClick}
        disabled={isSearching || query.trim().length < 2}
        className="bg-ancient-gold hover:bg-ancient-gold/90 rounded-xl h-12 px-6"
      >
        <SearchIcon className="h-4 w-4 mr-2" />
        Buscar
      </Button>
    </div>
  );
};

export default SearchInput;
