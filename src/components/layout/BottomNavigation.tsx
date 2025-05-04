
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, Search, User, Trophy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: t('navigation.home') || 'Início' },
    { path: '/read', icon: <Book size={20} />, label: t('navigation.read') || 'Leitura' },
    { path: '/search', icon: <Search size={20} />, label: t('navigation.search') || 'Busca' },
    { path: '/ranking', icon: <Trophy size={20} />, label: t('navigation.ranking') || 'Ranking' },
    { path: '/profile', icon: <User size={20} />, label: t('navigation.profile') || 'Perfil' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 rounded-md transition-colors ${
                isActive
                  ? 'text-ancient-gold fill-ancient-gold'
                  : 'text-gray-500 hover:text-ancient-gold'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
