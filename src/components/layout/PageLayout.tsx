
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
    <div className="min-h-screen w-full overflow-x-hidden bg-bible-background">
      <main className={`w-full overflow-hidden pb-20 ${isMobile ? 'px-2' : 'px-4'} ${className}`}>
        {children}
      </main>
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
};

export default PageLayout;
