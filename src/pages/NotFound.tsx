
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { BookOpen, Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageLayout hideNavigation>
      <div className="min-h-screen flex items-center justify-center">
        <div className="parchment-container w-full max-w-md text-center py-12 px-6">
          <h1 className="text-4xl font-oldstyle text-ancient-brown mb-4">404</h1>
          <h2 className="text-2xl font-oldstyle text-scripture-heading mb-6">Página não encontrada</h2>
          <p className="text-lg mb-8">
            O pergaminho que você procura não foi encontrado em nossos arquivos.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-ancient-brown hover:bg-ancient-brown/80">
              <Link to="/">
                <Home size={18} className="mr-2" /> Início
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-ancient-brown text-scripture-heading">
              <Link to="/read">
                <BookOpen size={18} className="mr-2" /> Leitura
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
