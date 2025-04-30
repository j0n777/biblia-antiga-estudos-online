
import { ReactNode } from 'react';
import BottomNavigation from './BottomNavigation';

type PageLayoutProps = {
  children: ReactNode;
  className?: string;
  hideNavigation?: boolean;
};

const PageLayout = ({ children, className = '', hideNavigation = false }: PageLayoutProps) => {
  return (
    <div className={`min-h-screen pb-16 ${className}`}>
      <main className="container mx-auto px-4">
        {children}
      </main>
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
};

export default PageLayout;
