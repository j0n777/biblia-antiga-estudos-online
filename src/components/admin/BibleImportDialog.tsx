
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { importInitialVersions } from '@/services/BibleImportService';
import { toast } from '@/hooks/use-toast';

const BibleImportDialog = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [importResults, setImportResults] = useState<any>(null);

  const handleImport = async () => {
    try {
      setIsImporting(true);
      setImportStatus('importing');
      setImportResults(null);

      console.log('Iniciando reimportação das versões da Bíblia...');
      
      toast({
        title: "Importação iniciada",
        description: "Reimportando as versões da Bíblia. Isso pode levar alguns minutos...",
      });

      const results = await importInitialVersions();
      
      console.log('Resultados da importação:', results);
      setImportResults(results);

      if (results.success) {
        setImportStatus('success');
        toast({
          title: "Importação concluída com sucesso!",
          description: `Versões importadas: ${results.results?.filter((r: any) => r.success).length || 0}`,
        });
      } else {
        setImportStatus('error');
        toast({
          title: "Erro na importação",
          description: "Alguns problemas ocorreram durante a importação.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro na importação:', error);
      setImportStatus('error');
      setImportResults({ error: error instanceof Error ? error.message : 'Erro desconhecido' });
      
      toast({
        title: "Erro na importação",
        description: "Falha ao importar as versões da Bíblia.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Reimportar Versões da Bíblia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta operação irá reimportar todas as versões da Bíblia (KJA, KJV, RVR) 
            para corrigir problemas de dados como version_id e book_id nulos.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-medium">Versões que serão importadas:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>KJA - King James Atualizada (Português)</li>
            <li>KJV - King James Version (Inglês)</li>
            <li>RVR - Reina Valera 1909 (Espanhol)</li>
          </ul>
        </div>

        <Button 
          onClick={handleImport} 
          disabled={isImporting}
          className="w-full"
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importando...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Iniciar Reimportação
            </>
          )}
        </Button>

        {importStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Importação concluída com sucesso! Os dados da Bíblia foram atualizados.
            </AlertDescription>
          </Alert>
        )}

        {importStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Ocorreu um erro durante a importação. Verifique os logs para mais detalhes.
            </AlertDescription>
          </Alert>
        )}

        {importResults && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium mb-2">Resultados da Importação:</h5>
            <pre className="text-xs overflow-auto max-h-32">
              {JSON.stringify(importResults, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BibleImportDialog;
