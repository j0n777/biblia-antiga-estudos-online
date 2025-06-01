
import React from "react";
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
          className="w-full h-11 bg-bible-controls border border-gray-300 rounded-xl shadow-sm justify-center hover:bg-bible-controls/80 text-bible-title"
          style={{
            backgroundColor: '#f5f1e6',
            color: '#5e4119',
          }}
        >
          <Type className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-full bg-bible-controls border border-gray-300 shadow-lg rounded-xl z-50"
        style={{ 
          backgroundColor: '#f5f1e6',
          color: '#5e4119',
        }}
      >
        <DropdownMenuItem 
          onClick={() => onFontSizeChange('large')} 
          className="rounded-xl py-2 px-3 cursor-pointer hover:bg-gray-100"
        >
          <span className="text-sm">Normal</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onFontSizeChange('extra-large')} 
          className="rounded-xl py-2 px-3 cursor-pointer hover:bg-gray-100"
        >
          <span className="text-base">Grande</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onFontSizeChange('huge')} 
          className="rounded-xl py-2 px-3 cursor-pointer hover:bg-gray-100"
        >
          <span className="text-lg">Extra Grande</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontSizeControl;
