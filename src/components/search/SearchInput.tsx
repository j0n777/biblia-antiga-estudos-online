
import { useState, useRef, useCallback } from 'react';
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
      onSearchClick();
    }
  };
  
  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            placeholder="Digite uma referência (João 3:16) ou termo..."
            value={searchQuery}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            className="bg-parchment-light border-parchment-dark/20 pr-10 rounded-lg"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <Button 
          onClick={onSearchClick}
          disabled={isSearching || searchQuery.trim().length < 2}
          className="bg-ancient-gold hover:bg-ancient-gold/90 rounded-lg"
        >
          <SearchIcon className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        Dica: Você pode pesquisar por referência (ex: "João 3:16") ou por palavras.
      </p>
    </div>
  );
};

export default SearchInput;
