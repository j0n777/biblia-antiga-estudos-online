
import { ReactNode } from 'react';
import BottomNavigation from './BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

type PageLayoutProps = {
  children: ReactNode;
  className?: string;
  hideNavigation?: boolean;
};

const PageLayout = ({ children, className = '', hideNavigation = false }: PageLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`min-h-screen pb-16 ${className} overflow-x-hidden`}>
      <main className={`container mx-auto ${isMobile ? 'px-1' : 'px-4'} max-w-full`}>
        {children}
      </main>
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
};

export default PageLayout;
