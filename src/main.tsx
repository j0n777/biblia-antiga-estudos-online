
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './components/ThemeProvider';
import App from './App.tsx';
import './styles/index.css';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <LanguageProvider>
      <ThemeProvider defaultTheme="light">
        <App />
      </ThemeProvider>
    </LanguageProvider>
  </BrowserRouter>
);
