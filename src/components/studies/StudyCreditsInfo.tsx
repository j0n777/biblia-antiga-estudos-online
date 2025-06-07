
import { ArrowLeft, Package, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StudyCreditsInfoProps {
  onBack: () => void;
}

const StudyCreditsInfo = ({ onBack }: StudyCreditsInfoProps) => {
  const handlePurchase = (type: string) => {
    // TODO: Implementar integração com sistema de pagamento
    console.log('Comprar:', type);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-xl font-semibold text-ancient-brown">
          💎 Créditos para Estudos Bíblicos
        </h3>
      </div>

      {/* Explicação sobre os créditos */}
      <Card className="bg-ancient-gold/5 border-ancient-gold/20">
        <CardHeader>
          <CardTitle className="text-ancient-brown text-lg">
            Como funcionam os créditos?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-scripture-text">
          <p>• <strong>1 estudo gratuito por dia</strong> para usuários cadastrados</p>
          <p>• <strong>Estudos pagos</strong> para uso ilimitado</p>
          <p>• <strong>Cada estudo</strong> é único e personalizado com IA</p>
          <p>• <strong>Salvo no seu histórico</strong> para consulta posterior</p>
        </CardContent>
      </Card>

      {/* Opções de compra */}
      <div className="grid gap-4">
        {/* Assinatura Mensal */}
        <Card className="border-2 border-ancient-gold bg-ancient-gold/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-ancient-brown">
                <Calendar className="w-5 h-5" />
                Assinatura Mensal
              </CardTitle>
              <Badge className="bg-ancient-gold text-white">MAIS POPULAR</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-ancient-brown">R$ 14,90</div>
              <div className="text-sm text-scripture-text">por mês</div>
            </div>
            <div className="space-y-2 text-scripture-text">
              <p>✅ <strong>90 estudos por mês</strong></p>
              <p>✅ Renovação automática</p>
              <p>✅ Cancele quando quiser</p>
              <p>✅ Melhor custo-benefício</p>
            </div>
            <Button 
              className="w-full bg-ancient-gold hover:bg-ancient-gold/90 text-white"
              onClick={() => handlePurchase('monthly_90')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Assinar por R$ 14,90/mês
            </Button>
            <div className="text-xs text-center text-muted-foreground">
              ~R$ 0,17 por estudo
            </div>
          </CardContent>
        </Card>

        {/* Pacote 90 estudos */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ancient-brown">
              <Package className="w-5 h-5" />
              Pacote 90 Estudos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-ancient-brown">R$ 19,90</div>
              <div className="text-sm text-scripture-text">pagamento único</div>
            </div>
            <div className="space-y-2 text-scripture-text">
              <p>✅ <strong>90 estudos</strong></p>
              <p>✅ Sem renovação automática</p>
              <p>✅ Válido por 1 ano</p>
              <p>✅ Flexibilidade total</p>
            </div>
            <Button 
              variant="outline"
              className="w-full border-ancient-gold text-ancient-gold hover:bg-ancient-gold hover:text-white"
              onClick={() => handlePurchase('pack_90')}
            >
              <Package className="w-4 h-4 mr-2" />
              Comprar por R$ 19,90
            </Button>
            <div className="text-xs text-center text-muted-foreground">
              ~R$ 0,22 por estudo
            </div>
          </CardContent>
        </Card>

        {/* Pacote 180 estudos */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ancient-brown">
              <Package className="w-5 h-5" />
              Pacote 180 Estudos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-ancient-brown">R$ 27,90</div>
              <div className="text-sm text-scripture-text">pagamento único</div>
            </div>
            <div className="space-y-2 text-scripture-text">
              <p>✅ <strong>180 estudos</strong></p>
              <p>✅ Sem renovação automática</p>
              <p>✅ Válido por 1 ano</p>
              <p>✅ Melhor valor por estudo</p>
            </div>
            <Button 
              variant="outline"
              className="w-full border-ancient-gold text-ancient-gold hover:bg-ancient-gold hover:text-white"
              onClick={() => handlePurchase('pack_180')}
            >
              <Package className="w-4 h-4 mr-2" />
              Comprar por R$ 27,90
            </Button>
            <div className="text-xs text-center text-muted-foreground">
              ~R$ 0,16 por estudo
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações sobre custos */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-3">💰 Sobre os custos</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• Cada estudo consome ~3000 tokens da OpenAI GPT-4o-mini</p>
            <p>• Custo estimado: US$ 0,0045 por estudo (~R$ 0,02)</p>
            <p>• Margem para manutenção e desenvolvimento da plataforma</p>
            <p>• Preços justos para sustentabilidade do serviço</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyCreditsInfo;
