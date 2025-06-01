
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
          className="w-full h-11 bg-bible-controls border border-gray-300 rounded-lg shadow-sm justify-center hover:bg-bible-controls/80"
        >
          <Type className="h-4 w-4 text-bible-title" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-full bg-bible-controls border border-gray-300 shadow-lg rounded-lg"
      >
        <DropdownMenuItem onClick={() => onFontSizeChange('large')} className="rounded py-2 px-3">
          <span className="text-sm text-bible-title">Normal</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFontSizeChange('extra-large')} className="rounded py-2 px-3">
          <span className="text-base text-bible-title">Grande</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFontSizeChange('huge')} className="rounded py-2 px-3">
          <span className="text-lg text-bible-title">Extra Grande</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontSizeControl;
