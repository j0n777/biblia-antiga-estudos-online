
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    // Set a data attribute on the document element for additional styling control
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  
  useEffect(() => {
    // Ensure the data-theme attribute is set on initial load
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full h-9 w-9"
      aria-label={theme === 'dark' ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-primary" />
      ) : (
        <Moon size={18} className="text-scripture-text" />
      )}
    </Button>
  );
};

export default ThemeToggle;
