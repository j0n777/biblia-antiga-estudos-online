
import { Button } from "@/components/ui/button";
import { Type } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FontSizeControlProps {
  onFontSizeChange: (fontSize: 'large' | 'extra-large' | 'huge') => void;
}

const FontSizeControl: React.FC<FontSizeControlProps> = ({ onFontSizeChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full h-12 bg-white/80 dark:bg-parchment-light/80 border-2 border-parchment-dark/30 dark:border-parchment-darker/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 justify-between"
        >
          <div className="flex items-center">
            <Type className="h-4 w-4 mr-2" />
            <span>Tamanho</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white dark:bg-parchment-dark border-2 border-parchment-dark/30 dark:border-parchment-darker/40 shadow-xl rounded-xl"
      >
        <DropdownMenuItem onClick={() => onFontSizeChange('large')} className="rounded-lg py-3">
          <span className="text-lg">Texto Normal</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFontSizeChange('extra-large')} className="rounded-lg py-3">
          <span className="text-xl">Texto Grande</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFontSizeChange('huge')} className="rounded-lg py-3">
          <span className="text-2xl">Texto Extra Grande</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontSizeControl;
