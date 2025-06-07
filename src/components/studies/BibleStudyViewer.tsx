
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AIBibleStudy } from '@/services/BibleStudyService';
import { Book, Globe, MessageSquare, Heart, User, Calendar } from 'lucide-react';

interface BibleStudyViewerProps {
  study: AIBibleStudy;
}

const BibleStudyViewer = ({ study }: BibleStudyViewerProps) => {
  const content = study.study_content;

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        {/* Texto do Versículo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ancient-brown">
              <Book className="w-5 h-5" />
              📖 Texto do Versículo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-scripture-heading mb-2">
                {content.texto_versiculo.referencia}
              </h4>
              <p className="text-scripture-text italic bg-bible-box p-3 rounded-lg">
                "{content.texto_versiculo.texto_principal}"
              </p>
            </div>
            
            {content.texto_versiculo.versoes_comparadas.length > 0 && (
              <div>
                <h5 className="font-medium text-scripture-heading mb-2">Outras Versões:</h5>
                <div className="space-y-2">
                  {content.texto_versiculo.versoes_comparadas.map((versao, index) => (
                    <p key={index} className="text-sm text-scripture-text bg-gray-50 p-2 rounded">
                      {versao}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contexto Literário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ancient-brown">
              <User className="w-5 h-5" />
              🔍 Contexto Literário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div><strong>Autor:</strong> {content.contexto_literario.autor}</div>
            <div><strong>Destinatários:</strong> {content.contexto_literario.destinatarios}</div>
            <div><strong>Circunstâncias:</strong> {content.contexto_literario.circunstancias}</div>
            <div><strong>Tema do Capítulo:</strong> {content.contexto_literario.tema_capitulo}</div>
            <div><strong>Tema do Livro:</strong> {content.contexto_literario.tema_livro}</div>
          </CardContent>
        </Card>

        {/* Palavras-Chave no Original */}
        {content.palavras_chave_original.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ancient-brown">
                <Globe className="w-5 h-5" />
                🧠 Palavras-Chave no Original
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {content.palavras_chave_original.map((palavra, index) => (
                  <div key={index} className="bg-ancient-gold/5 p-4 rounded-lg border border-ancient-gold/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{palavra.palavra_portugues}</Badge>
                      <Badge variant="secondary">{palavra.strongs}</Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div><strong>Original:</strong> {palavra.original} ({palavra.transliteracao})</div>
                      <div><strong>Significado:</strong> {palavra.significado}</div>
                      <div><strong>Outros usos:</strong> {palavra.outros_usos}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contexto Histórico-Cultural */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ancient-brown">
              <Calendar className="w-5 h-5" />
              🏛️ Contexto Histórico-Cultural
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div><strong>Época:</strong> {content.contexto_historico_cultural.epoca}</div>
            <div><strong>Costumes:</strong> {content.contexto_historico_cultural.costumes}</div>
            <div><strong>Significado Original:</strong> {content.contexto_historico_cultural.significado_original}</div>
            <div><strong>Práticas Religiosas:</strong> {content.contexto_historico_cultural.praticas_religiosas}</div>
          </CardContent>
        </Card>

        {/* Referências Cruzadas */}
        {content.referencias_cruzadas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ancient-brown">
                <Book className="w-5 h-5" />
                🔗 Referências Cruzadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {content.referencias_cruzadas.map((ref, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="font-semibold text-blue-900 mb-1">{ref.referencia}</div>
                    <div className="text-sm italic text-blue-800 mb-2">"{ref.texto}"</div>
                    <div className="text-sm text-blue-700"><strong>Conexão:</strong> {ref.conexao}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comentários Clássicos */}
        {content.comentarios_classicos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ancient-brown">
                <MessageSquare className="w-5 h-5" />
                🧾 Comentários de Teólogos Clássicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.comentarios_classicos.map((comentario, index) => (
                  <div key={index} className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-amber-800 border-amber-300">
                        {comentario.autor}
                      </Badge>
                      <span className="text-sm text-amber-700">({comentario.periodo})</span>
                    </div>
                    <p className="text-amber-900 italic">"{comentario.comentario}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aplicação Teológica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ancient-brown">
              <Book className="w-5 h-5" />
              📚 Aplicação Teológica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <strong>Doutrinas presentes:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {content.aplicacao_teologica.doutrinas.map((doutrina, index) => (
                  <Badge key={index} variant="secondary">{doutrina}</Badge>
                ))}
              </div>
            </div>
            <div><strong>Plano da Redenção:</strong> {content.aplicacao_teologica.plano_redencao}</div>
            <div><strong>Atributos de Deus:</strong> {content.aplicacao_teologica.atributos_deus}</div>
            <div><strong>Papel de Cristo:</strong> {content.aplicacao_teologica.papel_cristo}</div>
          </CardContent>
        </Card>

        {/* Aplicação Pessoal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ancient-brown">
              <Heart className="w-5 h-5" />
              💡 Aplicação Pessoal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div><strong>Significado hoje:</strong> {content.aplicacao_pessoal.significado_hoje}</div>
            <div><strong>Áreas da vida:</strong> {content.aplicacao_pessoal.areas_vida}</div>
            <div><strong>Desafios práticos:</strong> {content.aplicacao_pessoal.desafios_praticos}</div>
            <div><strong>Reflexões:</strong> {content.aplicacao_pessoal.reflexoes}</div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default BibleStudyViewer;
