
import { Home } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const HomeHeader = () => {
  return (
    <div className="page-header">
      <div className="flex justify-between items-center py-[12px] px-[16px]">
        <div className="flex items-center gap-2">
          <Home size={24} className="text-ancient-gold" />
          <h1 className="text-2xl font-oldstyle text-scripture-heading">Bíblia de Estudos Original</h1>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default HomeHeader;
