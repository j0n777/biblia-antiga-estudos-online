
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Book, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { importDictionaries } from '@/services/bible/WordDefinitionService';

const DictionaryImportDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
    hebrewEntries?: number;
    greekEntries?: number;
  } | null>(null);

  const handleImport = async () => {
    setIsImporting(true);
    setImportStatus(null);
    
    try {
      const result = await importDictionaries();
      setImportStatus(result);
    } catch (error) {
      setImportStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Book className="w-4 h-4" />
          Importar Dicionários
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Importar Dicionários Strong's
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Este processo irá importar os dicionários Strong's Hebraico e Grego do repositório GitHub,
            permitindo definições de palavras nos textos bíblicos.
          </p>
          
          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 animate-bounce" />
                <span className="text-sm">Importando dicionários...</span>
              </div>
              <Progress value={50} className="w-full" />
            </div>
          )}
          
          {importStatus && (
            <Alert className={importStatus.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <div className="flex items-center gap-2">
                {importStatus.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <AlertDescription className="flex-1">
                  {importStatus.message}
                  {importStatus.success && importStatus.hebrewEntries && importStatus.greekEntries && (
                    <div className="mt-2 text-xs">
                      <div>Entradas Hebraicas: {importStatus.hebrewEntries}</div>
                      <div>Entradas Gregas: {importStatus.greekEntries}</div>
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isImporting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={isImporting}
              className="flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <Download className="w-4 h-4 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Importar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DictionaryImportDialog;
