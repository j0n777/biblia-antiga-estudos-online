
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Database, BookOpen, Languages, Download } from 'lucide-react';
import { getSampleStrongsWords, getStrongsStatistics, clearStrongsCache, type StrongsWord } from '@/services/bible/StrongsService';
import { getUntranslatedDefinitions, translateStrongsDefinitions, clearTranslationCache } from '@/services/bible/StrongsTranslationService';

const StrongsDebugPanel = () => {
  const [sampleWords, setSampleWords] = useState<StrongsWord[]>([]);
  const [statistics, setStatistics] = useState({ hebrew: 0, greek: 0, total: 0 });
  const [untranslatedCount, setUntranslatedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [words, stats, untranslated] = await Promise.all([
        getSampleStrongsWords(15),
        getStrongsStatistics(),
        getUntranslatedDefinitions('pt', 1000)
      ]);
      
      setSampleWords(words);
      setStatistics(stats);
      setUntranslatedCount(untranslated.length);
    } catch (error) {
      console.error('Error loading Strong\'s data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    clearStrongsCache();
    clearTranslationCache();
    console.log('Strong\'s cache cleared');
  };

  const handleTranslateBatch = async () => {
    setTranslating(true);
    try {
      const untranslated = await getUntranslatedDefinitions('pt', 50);
      if (untranslated.length > 0) {
        const result = await translateStrongsDefinitions(untranslated, 'pt', 5);
        console.log('Translation result:', result);
        // Recarregar dados após tradução
        await loadData();
      }
    } catch (error) {
      console.error('Error translating definitions:', error);
    } finally {
      setTranslating(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Card className="max-w-4xl mx-auto m-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Strong's Dictionary Analysis
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={loadData} disabled={loading} size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Reload Data
          </Button>
          <Button onClick={handleClearCache} variant="outline" size="sm">
            Clear Cache
          </Button>
          <Button 
            onClick={handleTranslateBatch} 
            disabled={translating || untranslatedCount === 0} 
            variant="secondary" 
            size="sm"
          >
            <Languages className={`w-4 h-4 mr-2 ${translating ? 'animate-spin' : ''}`} />
            {translating ? 'Translating...' : 'Translate Batch (PT)'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Statistics */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Database Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{statistics.hebrew}</div>
              <div className="text-sm text-blue-700">Hebrew Words</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{statistics.greek}</div>
              <div className="text-sm text-green-700">Greek Words</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{statistics.total}</div>
              <div className="text-sm text-purple-700">Total Words</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{untranslatedCount}</div>
              <div className="text-sm text-orange-700">Untranslated (PT)</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Translation Progress */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Translation Progress
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Portuguese Translation</span>
              <span className="text-sm text-gray-600">
                {Math.round(((statistics.total - untranslatedCount) / statistics.total) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((statistics.total - untranslatedCount) / statistics.total) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {statistics.total - untranslatedCount} of {statistics.total} definitions translated
            </div>
          </div>
        </div>

        <Separator />

        {/* Sample Words */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Sample Strong's Entries</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sampleWords.map((word, index) => (
              <div key={word.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={word.strongs_type === 'hebrew' ? 'default' : 'secondary'}>
                      {word.strongs_number} ({word.strongs_type === 'hebrew' ? '🇮🇱' : '🇬🇷'})
                    </Badge>
                    <span className="font-semibold">{word.word}</span>
                    {word.transliteration && (
                      <span className="text-sm text-gray-600 italic">({word.transliteration})</span>
                    )}
                  </div>
                  {word.part_of_speech && (
                    <Badge variant="outline" className="text-xs">
                      {word.part_of_speech}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {word.definition.substring(0, 200)}
                  {word.definition.length > 200 && '...'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading Strong's data...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StrongsDebugPanel;
