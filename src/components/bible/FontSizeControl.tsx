
import { useState, useEffect } from 'react';
import { Minus, Plus, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserProfile, updateUserProfile } from '@/services/AchievementService';

interface FontSizeControlProps {
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
}

const FontSizeControl = ({ onFontSizeChange }: FontSizeControlProps) => {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  // Get user's preferred font size from profile
  useEffect(() => {
    const loadPreferredFontSize = async () => {
      const profile = await getUserProfile();
      if (profile?.font_size) {
        setFontSize(profile.font_size);
        onFontSizeChange(profile.font_size);
      }
    };
    
    loadPreferredFontSize();
  }, [onFontSizeChange]);
  
  const handleDecreaseFontSize = () => {
    const newSize = fontSize === 'large' ? 'medium' : 'small';
    setFontSize(newSize);
    updateFontSize(newSize);
  };
  
  const handleIncreaseFontSize = () => {
    const newSize = fontSize === 'small' ? 'medium' : 'large';
    setFontSize(newSize);
    updateFontSize(newSize);
  };
  
  const updateFontSize = async (size: 'small' | 'medium' | 'large') => {
    onFontSizeChange(size);
    
    // Save preference to user profile
    try {
      await updateUserProfile({
        font_size: size
      });
    } catch (error) {
      console.error('Error updating font size preference:', error);
    }
  };
  
  return (
    <div className="flex items-center border rounded-lg bg-parchment-light px-2 py-1 shadow-sm">
      <Type size={16} className="text-muted-foreground mr-2" />
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={handleDecreaseFontSize} 
        disabled={fontSize === 'small'}
      >
        <Minus size={16} />
      </Button>
      
      <span className="px-1 text-sm">
        {fontSize === 'small' ? 'A' : fontSize === 'medium' ? 'AA' : 'AAA'}
      </span>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={handleIncreaseFontSize}
        disabled={fontSize === 'large'}
      >
        <Plus size={16} />
      </Button>
    </div>
  );
};

export default FontSizeControl;
