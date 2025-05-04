
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "next-themes";
import HomePage from './pages/Index';
import ReadPage from './pages/Read';
import SearchPage from './pages/Search';
import ProfilePage from './pages/Profile';
import AuthPage from './pages/Auth';
import RankingPage from './pages/Ranking';
import NotFoundPage from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/integrations/supabase/client';
import { importInitialVersions } from './services/BibleImportService';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if we have Bible data already
        const { data: versions, error } = await supabase
          .from('bible_versions')
          .select('id')
          .limit(1);
          
        if (error) {
          console.error('Error checking Bible versions:', error);
        } else if (!versions?.length) {
          console.log('No Bible versions found, initializing data...');
          await importInitialVersions();
        }
      } catch (err) {
        console.error('Error during initialization:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/read" element={<ReadPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
