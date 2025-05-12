
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
    
    // Force reflow by updating body class to ensure all styles are reapplied
    if (newTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };
  
  useEffect(() => {
    // Ensure the data-theme attribute is set on initial load
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply body class for additional styling hooks
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
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
        <Sun size={18} className="text-scripture-text hover:text-ancient-gold" />
      ) : (
        <Moon size={18} className="text-scripture-text hover:text-ancient-gold" />
      )}
    </Button>
  );
};

export default ThemeToggle;
