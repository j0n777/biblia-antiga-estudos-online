import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Database, Upload, CheckCircle, AlertCircle, Book } from 'lucide-react';
import BibleImportDialog from '@/components/admin/BibleImportDialog';
import DictionaryImportDialog from '@/components/admin/DictionaryImportDialog';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AdminImport = () => {
  const [selectedVersion, setSelectedVersion] = useState('kja');
  const [selectedLanguage, setSelectedLanguage] = useState('pt-br');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      // Se houvesse um check específico de admin via API, faríamos aqui.
      // Por ora, exigimos apenas estar logado, e o endpoint da edge function validará o token.
    };
    checkAdmin();
  }, [navigate]);

  const handleImport = async () => {
    setIsImporting(true);
    setImportProgress(0);
    setImportStatus(null);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      // Call the import API
      const response = await fetch('/api/import-bible', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'import-complete-version',
          version: selectedVersion,
          language: selectedLanguage,
        }),
      });
      
      clearInterval(progressInterval);
      setImportProgress(100);
      
      const result = await response.json();
      
      setImportStatus({
        success: result.success,
        message: result.message,
        details: {
          importedBooks: result.importedBooks,
          failedBooks: result.failedBooks,
          totalBooks: result.totalBooks,
        },
      });
    } catch (error) {
      setImportStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Database className="w-8 h-8 text-ancient-gold" />
        <div>
          <h1 className="text-3xl font-bold text-bible-title">
            Administração - Importação
          </h1>
          <p className="text-bible-subtitle">
            Gerencie a importação de dados bíblicos e dicionários
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Importação de Bíblias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Importação de Versões Bíblicas
            </CardTitle>
            <CardDescription>
              Importe versões completas da Bíblia do repositório GitHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BibleImportDialog />
          </CardContent>
        </Card>

        {/* Importação de Dicionários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              Importação de Dicionários Strong's
            </CardTitle>
            <CardDescription>
              Importe os dicionários Strong's Hebraico e Grego para definições de palavras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DictionaryImportDialog />
          </CardContent>
        </Card>

        {/* Status da Importação */}
        {isImporting && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 animate-bounce" />
                Importação em Progresso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={importProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Importando dados... Isso pode levar alguns minutos.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Resultado da Importação */}
        {importStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {importStatus.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                Resultado da Importação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className={importStatus.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <AlertDescription>
                  {importStatus.message}
                  {importStatus.details && (
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(importStatus.details, null, 2)}
                    </pre>
                  )}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminImport;
