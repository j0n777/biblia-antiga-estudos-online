
import { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserProfile, updateUserProfile } from '@/services/AchievementService';
import { useLanguage } from '@/contexts/LanguageContext';

interface FontSizeControlProps {
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
}

const FontSizeControl = ({ onFontSizeChange }: FontSizeControlProps) => {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const { t } = useLanguage();
  
  // Get user's preferred font size from profile
  useEffect(() => {
    const loadPreferredFontSize = async () => {
      const profile = await getUserProfile();
      if (profile?.font_size) {
        setFontSize(profile.font_size as 'small' | 'medium' | 'large');
        onFontSizeChange(profile.font_size as 'small' | 'medium' | 'large');
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
    <div className="flex items-center border rounded-lg bg-parchment-light px-1 py-1 shadow-sm">      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7" 
        onClick={handleDecreaseFontSize} 
        disabled={fontSize === 'small'}
        title={t('read.decreaseFontSize')}
      >
        <Minus size={14} />
      </Button>
      
      <span className="px-1 text-sm font-serif">
        AA
      </span>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7" 
        onClick={handleIncreaseFontSize}
        disabled={fontSize === 'large'}
        title={t('read.increaseFontSize')}
      >
        <Plus size={14} />
      </Button>
    </div>
  );
};

export default FontSizeControl;
