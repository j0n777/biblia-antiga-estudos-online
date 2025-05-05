
import { Button } from "@/components/ui/button";
import { Type, AlignJustify } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FontSizeControlProps {
  onFontSizeChange: (fontSize: 'small' | 'medium' | 'large') => void;
}

const FontSizeControl: React.FC<FontSizeControlProps> = ({ onFontSizeChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="border-parchment-darker/30">
          <Type className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onFontSizeChange('small')}>
          <span className="text-sm">Texto Pequeno</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFontSizeChange('medium')}>
          <span className="text-base">Texto Médio</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFontSizeChange('large')}>
          <span className="text-lg">Texto Grande</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontSizeControl;
