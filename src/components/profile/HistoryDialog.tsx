
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { SavedVerse, ReadingHistory } from '@/types/bible.types';
import { getSavedVerses } from '@/services/VersesService';
import { getReadingHistory } from '@/services/reading';
import { BookOpen, Bookmark, History, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { getBibleBooks } from '@/services/BibleDataService';
import { format } from 'date-fns';

interface HistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HistoryDialog = ({ open, onOpenChange }: HistoryDialogProps) => {
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
  const [bookNames, setBookNames] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('saved');
  const [isLoading, setIsLoading] = useState(true);
  
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carregar versículos salvos
        const verses = await getSavedVerses();
        setSavedVerses(verses);
        
        // Carregar histórico de leitura
        const history = await getReadingHistory(20); // Últimos 20 registros
        setReadingHistory(history);
        
        // Carregar nomes dos livros
        const books = await getBibleBooks();
        
        // Criar lookup para nomes de livros
        const bookNameLookup: Record<string, string> = {};
        books.forEach(book => {
          bookNameLookup[book.book_id] = book.name;
        });
        setBookNames(bookNameLookup);
      } catch (error) {
        console.error('Error loading history data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (open) {
      loadData();
    }
  }, [open, language]);
  
  const handleOpenVerse = (bookId: string, chapter: number, verse: number) => {
    onOpenChange(false);
    navigate(`/read?book=${bookId}&chapter=${chapter}&verse=${verse}`);
  };
  
  const handleOpenChapter = (bookId: string, chapter: number) => {
    onOpenChange(false);
    navigate(`/read?book=${bookId}&chapter=${chapter}`);
  };
  
  // Agrupar registros de leitura por dia
  const groupedHistory = readingHistory.reduce((groups: Record<string, ReadingHistory[]>, item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] bg-parchment">
        <DialogHeader>
          <DialogTitle className="text-xl font-oldstyle flex items-center gap-2">
            <History className="h-5 w-5 text-ancient-gold" />
            {t('profile.history')}
          </DialogTitle>
          <DialogDescription>
            {t('profile.historyDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="saved" className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" /> {t('profile.savedVerses')}
            </TabsTrigger>
            <TabsTrigger value="reading" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> {t('profile.readingHistory')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-t-2 border-ancient-gold rounded-full animate-spin"></div>
                </div>
              ) : savedVerses.length > 0 ? (
                <div className="space-y-3">
                  {savedVerses.map((verse) => (
                    <Card key={verse.id} className="p-3 bg-parchment-light border-ancient-gold/20">
                      <button 
                        className="w-full text-left"
                        onClick={() => handleOpenVerse(verse.book_id, verse.chapter_number, verse.verse_number)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-ancient-brown">
                            {bookNames[verse.book_id] || verse.book_id} {verse.chapter_number}:{verse.verse_number}
                          </span>
                          
                          {verse.highlight_color && (
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{backgroundColor: verse.highlight_color}}
                            ></div>
                          )}
                        </div>
                        {verse.note && <p className="text-sm mt-1 text-gray-600">{verse.note}</p>}
                      </button>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-ancient-gold/30 mx-auto mb-2" />
                  <h3 className="text-lg font-oldstyle text-scripture-heading">
                    {t('profile.noSavedVerses')}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('profile.startSavingVerses')}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="reading" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-t-2 border-ancient-gold rounded-full animate-spin"></div>
                </div>
              ) : Object.keys(groupedHistory).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedHistory).map(([date, entries]) => (
                    <div key={date} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-ancient-gold" />
                        <h3 className="text-sm font-medium text-ancient-brown">{date}</h3>
                      </div>
                      
                      <div className="space-y-2 pl-6">
                        {entries.map((entry, i) => (
                          <Card 
                            key={`${entry.book_id}-${entry.chapter}-${i}`} 
                            className="p-2 bg-parchment-light/80 border-parchment-dark/30"
                          >
                            <button 
                              className="w-full text-left"
                              onClick={() => handleOpenChapter(entry.book_id, entry.chapter)}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-scripture-text">
                                  {bookNames[entry.book_id] || entry.book_id} {entry.chapter}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(entry.timestamp), 'HH:mm')}
                                </span>
                              </div>
                            </button>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-ancient-gold/30 mx-auto mb-2" />
                  <h3 className="text-lg font-oldstyle text-scripture-heading">
                    {t('profile.noReadingHistory')}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('profile.startReadingBible')}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryDialog;
