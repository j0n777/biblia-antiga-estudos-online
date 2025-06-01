
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
          className="w-full h-14 bg-white border border-gray-200 rounded-xl shadow-sm text-base justify-between hover:bg-gray-50"
        >
          <div className="flex items-center">
            <Type className="h-5 w-5 mr-3 text-amber-600" />
            <span className="text-gray-800 font-medium">Tamanho</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-full bg-white border border-gray-200 shadow-lg rounded-xl"
      >
        <DropdownMenuItem onClick={() => onFontSizeChange('large')} className="rounded-lg py-3 px-4">
          <span className="text-base text-gray-800">Texto Normal</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFontSizeChange('extra-large')} className="rounded-lg py-3 px-4">
          <span className="text-lg text-gray-800">Texto Grande</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFontSizeChange('huge')} className="rounded-lg py-3 px-4">
          <span className="text-xl text-gray-800">Texto Extra Grande</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontSizeControl;
