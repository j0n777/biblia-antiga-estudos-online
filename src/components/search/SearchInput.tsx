
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  searchQuery: string;
  isSearching: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClick: () => void;
}

const SearchInput = ({ 
  searchQuery, 
  isSearching, 
  onInputChange, 
  onSearchClick 
}: SearchInputProps) => {
  // Handle keyboard submission (Enter key)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim().length >= 2 && !isSearching) {
      console.log(`Enter pressed, searching for: "${searchQuery}"`);
      onSearchClick();
    }
  };
  
  const handleButtonClick = () => {
    console.log(`Search button clicked for: "${searchQuery}"`);
    onSearchClick();
  };
  
  return (
    <div className="flex gap-3">
      <div className="relative flex-grow">
        <Input
          placeholder="Digite qualquer palavra (ex: amor, paz, Jesus) ou referência (João 3:16)..."
          value={searchQuery}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          className="bg-white border-parchment-dark/20 pr-10 rounded-lg text-base h-12"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      <Button 
        onClick={handleButtonClick}
        disabled={isSearching || searchQuery.trim().length < 2}
        className="bg-ancient-gold hover:bg-ancient-gold/90 rounded-lg h-12 px-6"
      >
        <SearchIcon className="h-4 w-4 mr-2" />
        Buscar
      </Button>
    </div>
  );
};

export default SearchInput;
