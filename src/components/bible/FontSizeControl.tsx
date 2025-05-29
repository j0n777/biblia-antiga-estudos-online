
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
        <Button variant="outline" size="icon" className="border-parchment-darker/30 rounded-xl">
          <Type className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-parchment-dark/30 shadow-xl rounded-xl z-[9999]">
        <DropdownMenuItem onClick={() => onFontSizeChange('large')} className="rounded-lg">
          <span className="text-lg">Texto Normal</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFontSizeChange('extra-large')} className="rounded-lg">
          <span className="text-xl">Texto Grande</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFontSizeChange('huge')} className="rounded-lg">
          <span className="text-2xl">Texto Extra Grande</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontSizeControl;
