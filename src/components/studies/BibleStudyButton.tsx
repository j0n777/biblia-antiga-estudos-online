
import { useState } from 'react';
import { BookOpen, Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { generateBibleStudy, getUserStudyCredits } from '@/services/BibleStudyService';
import { useLanguage } from '@/contexts/LanguageContext';
import BibleStudyViewer from './BibleStudyViewer';
import StudyCreditsInfo from './StudyCreditsInfo';
import { BibleStudy, UserStudyCredits } from '@/services/BibleStudyService';

interface BibleStudyButtonProps {
  verseReference: string;
  bookId: string;
  chapterNumber: number;
  verseNumber: number;
  versionId: string;
  verseText: string;
  size?: 'sm' | 'md';
  variant?: 'default' | 'ghost' | 'outline';
}

const BibleStudyButton = ({
  verseReference,
  bookId,
  chapterNumber,
  verseNumber,
  versionId,
  verseText,
  size = 'sm',
  variant = 'ghost'
}: BibleStudyButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [study, setStudy] = useState<BibleStudy | null>(null);
  const [credits, setCredits] = useState<UserStudyCredits | null>(null);
  const [showCreditsInfo, setShowCreditsInfo] = useState(false);
  const { t } = useLanguage();

  const loadCredits = async () => {
    const userCredits = await getUserStudyCredits();
    setCredits(userCredits);
  };

  const handleOpenDialog = async () => {
    setIsOpen(true);
    await loadCredits();
  };

  const handleGenerateStudy = async () => {
    setIsGenerating(true);
    
    try {
      const result = await generateBibleStudy(
        verseReference,
        bookId,
        chapterNumber,
        verseNumber,
        versionId,
        verseText
      );

      if (result.needsCredits) {
        setShowCreditsInfo(true);
        toast({
          title: "Sem créditos disponíveis",
          description: "Você precisa de créditos para gerar um estudo bíblico.",
          variant: "destructive"
        });
        return;
      }

      if (result.error) {
        toast({
          title: "Erro ao gerar estudo",
          description: result.error,
          variant: "destructive"
        });
        return;
      }

      if (result.study) {
        setStudy(result.study);
        setShowCreditsInfo(false);
        
        if (result.fromCache) {
          toast({
            title: "Estudo carregado",
            description: "Estudo encontrado no seu histórico!",
          });
        } else {
          toast({
            title: "Estudo gerado com sucesso!",
            description: "Seu estudo bíblico está pronto.",
          });
        }
        
        // Recarregar créditos após gerar estudo
        await loadCredits();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao gerar estudo.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const hasCredits = credits ? 
    (credits.free_studies_used_today < 1 || credits.paid_studies_remaining > 0) : 
    false;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={handleOpenDialog}
          className="gap-1"
        >
          <Sparkles className="w-4 h-4" />
          {size === 'md' && 'Estudo IA'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-ancient-gold" />
            Estudo Bíblico com IA - {verseReference}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {!study && !showCreditsInfo && (
            <div className="space-y-6 p-4">
              {/* Informações sobre o estudo */}
              <div className="bg-ancient-gold/5 rounded-xl p-4 border border-ancient-gold/20">
                <h3 className="font-semibold text-ancient-brown mb-3">
                  📚 Como funciona o Estudo Bíblico com IA?
                </h3>
                <div className="text-sm text-scripture-text space-y-2">
                  <p>• <strong>Análise do texto original</strong> (hebraico/grego)</p>
                  <p>• <strong>Contexto histórico e cultural</strong> da época</p>
                  <p>• <strong>Comentários de teólogos clássicos</strong> e reformadores</p>
                  <p>• <strong>Referências cruzadas</strong> com outros versículos</p>
                  <p>• <strong>Aplicação teológica</strong> e prática para hoje</p>
                </div>
              </div>

              {/* Versículo a ser estudado */}
              <div className="bg-bible-box rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold text-scripture-heading mb-2">
                  {verseReference}
                </h4>
                <p className="text-scripture-text italic">
                  "{verseText}"
                </p>
              </div>

              {/* Status dos créditos */}
              {credits && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    💎 Seus créditos
                  </h4>
                  <div className="text-sm text-blue-800">
                    <p>• Estudos gratuitos hoje: {1 - credits.free_studies_used_today}/1</p>
                    <p>• Estudos pagos: {credits.paid_studies_remaining}</p>
                  </div>
                </div>
              )}

              {/* Botão para gerar estudo */}
              <div className="flex justify-center pt-4">
                {hasCredits ? (
                  <Button
                    onClick={handleGenerateStudy}
                    disabled={isGenerating}
                    className="bg-ancient-gold hover:bg-ancient-gold/90 text-white px-8 py-3"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
                        Gerando estudo...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Gerar Estudo Bíblico
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowCreditsInfo(true)}
                    variant="outline"
                    className="border-ancient-gold text-ancient-gold hover:bg-ancient-gold hover:text-white px-8 py-3"
                    size="lg"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Obter Créditos
                  </Button>
                )}
              </div>
            </div>
          )}

          {showCreditsInfo && (
            <StudyCreditsInfo onBack={() => setShowCreditsInfo(false)} />
          )}

          {study && (
            <BibleStudyViewer study={study} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BibleStudyButton;
