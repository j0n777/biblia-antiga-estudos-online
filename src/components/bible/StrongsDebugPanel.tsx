
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Globe, 
  Zap, 
  TrendingUp, 
  Database,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  getStrongsStatistics, 
  getSampleStrongsWords 
} from '@/services/bible/StrongsService';
import { 
  getUntranslatedDefinitions, 
  translateStrongsDefinitions 
} from '@/services/bible/StrongsTranslationService';
import { getTranslationStats } from '@/services/bible/PromptService';

const StrongsDebugPanel = () => {
  const [stats, setStats] = useState({ hebrew: 0, greek: 0, total: 0 });
  const [translationStats, setTranslationStats] = useState({
    totalOperations: 0,
    totalTranslated: 0,
    totalErrors: 0,
    totalCost: 0,
    averageSuccessRate: 0
  });
  const [sampleWords, setSampleWords] = useState<any[]>([]);
  const [untranslatedCount, setUntranslatedCount] = useState({ pt: 0, es: 0, fr: 0 });
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        strongsStats,
        translationStatistics,
        sample,
        untranslatedPt,
        untranslatedEs,
        untranslatedFr
      ] = await Promise.all([
        getStrongsStatistics(),
        getTranslationStats(),
        getSampleStrongsWords(5),
        getUntranslatedDefinitions('pt', 1000),
        getUntranslatedDefinitions('es', 1000),
        getUntranslatedDefinitions('fr', 1000)
      ]);

      setStats(strongsStats);
      setTranslationStats(translationStatistics);
      setSampleWords(sample);
      setUntranslatedCount({
        pt: untranslatedPt.length,
        es: untranslatedEs.length,
        fr: untranslatedFr.length
      });
    } catch (error) {
      console.error('Error loading Strong\'s data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do Strong's",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (language: string) => {
    setIsTranslating(true);
    setTranslationProgress([]);
    
    try {
      const untranslated = await getUntranslatedDefinitions(language, 50);
      
      if (untranslated.length === 0) {
        toast({
          title: "Informação",
          description: `Todas as definições já estão traduzidas para ${language.toUpperCase()}!`,
        });
        return;
      }

      toast({
        title: "Tradução Iniciada",
        description: `Iniciando tradução de ${untranslated.length} definições para ${language.toUpperCase()}`,
      });

      const result = await translateStrongsDefinitions(untranslated, language, 10);
      
      setTranslationProgress(result.operations);
      
      if (result.success > 0) {
        toast({
          title: "Tradução Concluída",
          description: `${result.success} definições traduzidas com sucesso! ${result.errors} erros.`,
        });
        
        // Recarregar dados
        await loadData();
      } else {
        toast({
          title: "Erro na Tradução",
          description: `Falha ao traduzir definições. ${result.errors} erros encontrados.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Erro",
        description: "Erro durante o processo de tradução",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getProgressPercentage = (translated: number, total: number) => {
    return total > 0 ? Math.round((translated / total) * 100) : 0;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-bible-title" />
        <div>
          <h1 className="text-2xl font-bold text-bible-title">Strong's Debug Panel</h1>
          <p className="text-bible-subtitle">Análise e gerenciamento do dicionário Strong's</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total de Definições</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total.toLocaleString()}</p>
            <div className="text-xs text-gray-500 mt-1">
              Hebraico: {stats.hebrew} • Grego: {stats.greek}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Operações de Tradução</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{translationStats.totalOperations}</p>
            <div className="text-xs text-gray-500 mt-1">
              Taxa de sucesso: {translationStats.averageSuccessRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Traduções Concluídas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{translationStats.totalTranslated.toLocaleString()}</p>
            <div className="text-xs text-gray-500 mt-1">
              Erros: {translationStats.totalErrors}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-gray-600">Custo Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">${translationStats.totalCost.toFixed(3)}</p>
            <div className="text-xs text-gray-500 mt-1">
              OpenAI API
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Translation Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Português (PT-BR)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso</span>
                <span>{getProgressPercentage(stats.total - untranslatedCount.pt, stats.total)}%</span>
              </div>
              <Progress value={getProgressPercentage(stats.total - untranslatedCount.pt, stats.total)} />
            </div>
            <div className="text-sm text-gray-600">
              <div>Traduzidas: {(stats.total - untranslatedCount.pt).toLocaleString()}</div>
              <div>Pendentes: {untranslatedCount.pt.toLocaleString()}</div>
            </div>
            <Button 
              onClick={() => handleTranslate('pt')} 
              disabled={isTranslating || untranslatedCount.pt === 0}
              className="w-full"
              size="sm"
            >
              {isTranslating ? 'Traduzindo...' : 'Traduzir Lote'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Español (ES)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso</span>
                <span>{getProgressPercentage(stats.total - untranslatedCount.es, stats.total)}%</span>
              </div>
              <Progress value={getProgressPercentage(stats.total - untranslatedCount.es, stats.total)} />
            </div>
            <div className="text-sm text-gray-600">
              <div>Traduzidas: {(stats.total - untranslatedCount.es).toLocaleString()}</div>
              <div>Pendentes: {untranslatedCount.es.toLocaleString()}</div>
            </div>
            <Button 
              onClick={() => handleTranslate('es')} 
              disabled={isTranslating || untranslatedCount.es === 0}
              className="w-full"
              size="sm"
            >
              {isTranslating ? 'Traduciendo...' : 'Traducir Lote'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Français (FR)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso</span>
                <span>{getProgressPercentage(stats.total - untranslatedCount.fr, stats.total)}%</span>
              </div>
              <Progress value={getProgressPercentage(stats.total - untranslatedCount.fr, stats.total)} />
            </div>
            <div className="text-sm text-gray-600">
              <div>Traduzidas: {(stats.total - untranslatedCount.fr).toLocaleString()}</div>
              <div>Pendentes: {untranslatedCount.fr.toLocaleString()}</div>
            </div>
            <Button 
              onClick={() => handleTranslate('fr')} 
              disabled={isTranslating || untranslatedCount.fr === 0}
              className="w-full"
              size="sm"
            >
              {isTranslating ? 'Traduction...' : 'Traduire Lot'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Translation Progress Log */}
      {translationProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Log de Tradução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              <div className="space-y-2">
                {translationProgress.map((operation, index) => (
                  <div 
                    key={index}
                    className="text-sm p-2 bg-gray-50 rounded flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4 text-blue-500" />
                    {operation}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Sample Words */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Amostra de Palavras Strong's
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleWords.map((word, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">
                    {word.strongs_number}
                  </Badge>
                  <Badge variant={word.strongs_type === 'hebrew' ? 'default' : 'secondary'}>
                    {word.strongs_type === 'hebrew' ? '🇮🇱 Hebrew' : '🇬🇷 Greek'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">{word.word}</div>
                  {word.transliteration && (
                    <div className="text-sm text-gray-600 italic">{word.transliteration}</div>
                  )}
                  <div className="text-sm text-gray-700">{word.definition}</div>
                  {word.part_of_speech && (
                    <Badge variant="outline" className="text-xs">
                      {word.part_of_speech}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={loadData} variant="outline">
          <TrendingUp className="w-4 h-4 mr-2" />
          Atualizar Dados
        </Button>
      </div>
    </div>
  );
};

export default StrongsDebugPanel;
