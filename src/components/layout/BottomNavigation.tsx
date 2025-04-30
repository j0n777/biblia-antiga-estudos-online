
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/read', icon: BookOpen, label: 'Leitura' },
    { path: '/search', icon: Search, label: 'Busca' },
    { path: '/profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-parchment-light dark:bg-parchment-dark border-t border-parchment-dark/20 dark:border-parchment-darker/30 shadow-lg backdrop-blur-md">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <item.icon 
              size={24} 
              className={cn(
                "transition-colors duration-200",
                currentPath === item.path 
                  ? "text-ancient-gold" 
                  : "text-scripture-text opacity-70 hover:opacity-100"
              )} 
            />
            <span className={cn(
              "text-xs mt-1 transition-colors duration-200",
              currentPath === item.path 
                ? "text-ancient-gold font-medium" 
                : "text-scripture-text opacity-70"
            )}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
