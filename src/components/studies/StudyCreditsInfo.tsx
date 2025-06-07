
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
          <p>• <strong>3 estudos gratuitos por mês</strong> para usuários cadastrados</p>
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
              <div className="text-3xl font-bold text-ancient-brown">R$ 24,00</div>
              <div className="text-sm text-scripture-text">por mês</div>
            </div>
            <div className="space-y-2 text-scripture-text">
              <p>✅ <strong>30 estudos por mês</strong></p>
              <p>✅ Renovação automática</p>
              <p>✅ Cancele quando quiser</p>
              <p>✅ Melhor custo-benefício</p>
            </div>
            <Button 
              className="w-full bg-ancient-gold hover:bg-ancient-gold/90 text-white"
              onClick={() => handlePurchase('monthly_30')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Assinar por R$ 24,00/mês
            </Button>
            <div className="text-xs text-center text-muted-foreground">
              R$ 0,80 por estudo (20% desconto)
            </div>
          </CardContent>
        </Card>

        {/* Assinatura Semestral */}
        <Card className="border-2 border-green-500 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Calendar className="w-5 h-5" />
                Assinatura Semestral
              </CardTitle>
              <Badge className="bg-green-500 text-white">MELHOR VALOR</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700">R$ 126,00</div>
              <div className="text-sm text-green-600">por 6 meses</div>
            </div>
            <div className="space-y-2 text-green-600">
              <p>✅ <strong>180 estudos (6 meses)</strong></p>
              <p>✅ Renovação automática</p>
              <p>✅ Cancele quando quiser</p>
              <p>✅ Maior economia</p>
            </div>
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              onClick={() => handlePurchase('semiannual_180')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Assinar por R$ 126,00/6 meses
            </Button>
            <div className="text-xs text-center text-muted-foreground">
              R$ 0,70 por estudo (30% desconto)
            </div>
          </CardContent>
        </Card>

        {/* Pacote 50 estudos */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ancient-brown">
              <Package className="w-5 h-5" />
              Pacote 50 Estudos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-ancient-brown">R$ 45,00</div>
              <div className="text-sm text-scripture-text">pagamento único</div>
            </div>
            <div className="space-y-2 text-scripture-text">
              <p>✅ <strong>50 estudos</strong></p>
              <p>✅ Sem renovação automática</p>
              <p>✅ Válido por 1 ano</p>
              <p>✅ Flexibilidade total</p>
            </div>
            <Button 
              variant="outline"
              className="w-full border-ancient-gold text-ancient-gold hover:bg-ancient-gold hover:text-white"
              onClick={() => handlePurchase('pack_50')}
            >
              <Package className="w-4 h-4 mr-2" />
              Comprar por R$ 45,00
            </Button>
            <div className="text-xs text-center text-muted-foreground">
              R$ 0,90 por estudo (10% desconto)
            </div>
          </CardContent>
        </Card>

        {/* Pacote 100 estudos */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ancient-brown">
              <Package className="w-5 h-5" />
              Pacote 100 Estudos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-ancient-brown">R$ 90,00</div>
              <div className="text-sm text-scripture-text">pagamento único</div>
            </div>
            <div className="space-y-2 text-scripture-text">
              <p>✅ <strong>100 estudos</strong></p>
              <p>✅ Sem renovação automática</p>
              <p>✅ Válido por 1 ano</p>
              <p>✅ Melhor valor por estudo</p>
            </div>
            <Button 
              variant="outline"
              className="w-full border-ancient-gold text-ancient-gold hover:bg-ancient-gold hover:text-white"
              onClick={() => handlePurchase('pack_100')}
            >
              <Package className="w-4 h-4 mr-2" />
              Comprar por R$ 90,00
            </Button>
            <div className="text-xs text-center text-muted-foreground">
              R$ 0,90 por estudo (10% desconto)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyCreditsInfo;
