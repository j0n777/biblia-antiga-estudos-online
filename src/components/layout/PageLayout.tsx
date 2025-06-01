
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
    <div className={`page-container ${className}`}>
      <main className={`w-full overflow-hidden ${isMobile ? 'px-2' : 'px-4'}`}>
        {children}
      </main>
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
};

export default PageLayout;
