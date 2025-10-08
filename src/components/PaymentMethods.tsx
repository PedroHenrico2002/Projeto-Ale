import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Banknote, Smartphone, Copy, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import QRCode from 'qrcode';

export type PaymentMethod = 'credit' | 'debit' | 'pix' | 'cash';

interface PaymentData {
  method: PaymentMethod;
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

interface PaymentMethodsProps {
  onPaymentSelect: (paymentData: PaymentData) => void;
  selectedMethod?: PaymentMethod;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  onPaymentSelect, 
  selectedMethod = 'credit' 
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('card');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(selectedMethod);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiryDate: '',
    cvv: ''
  });
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [saveCard, setSaveCard] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [pixCode, setPixCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (user) {
      fetchSavedCards();
    }
  }, [user]);

  const fetchSavedCards = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedCards(data || []);
    } catch (error) {
      console.error('Erro ao buscar cartões:', error);
    }
  };

  const generatePixQRCode = async () => {
    // Gerar código PIX (simulado - em produção seria um payload PIX válido)
    const pixPayload = `00020126580014BR.GOV.BCB.PIX0136${crypto.randomUUID()}520400005303986540510.005802BR5925Restaurante Delivery6009SAO PAULO62070503***6304`;
    
    setPixCode(pixPayload);
    
    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, pixPayload, {
          width: 250,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
      }
      
      const qrUrl = await QRCode.toDataURL(pixPayload, {
        width: 250,
        margin: 2
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code PIX');
    }
  };

  useEffect(() => {
    if (paymentMethod === 'pix' && !qrCodeUrl) {
      generatePixQRCode();
    }
  }, [paymentMethod]);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    
    if (method === 'cash') {
      onPaymentSelect({ method });
    } else if (method === 'pix') {
      generatePixQRCode();
      onPaymentSelect({ method });
    } else if (selectedCard) {
      const card = savedCards.find(c => c.id === selectedCard);
      if (card) {
        onPaymentSelect({
          method,
          cardNumber: card.card_number,
          cardName: card.card_name,
          expiryDate: card.expiry_date
        });
      }
    }
  };

  const saveCardToDatabase = async (cardData: any, saveCard: boolean = false) => {
    if (!user || !saveCard) return;

    try {
      // Mask card number for storage (only last 4 digits visible)
      const maskedNumber = `****-****-****-${cardData.number.slice(-4)}`;
      
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          type: paymentMethod,
          card_number: maskedNumber,
          card_name: cardData.name,
          expiry_date: cardData.expiryDate,
          is_default: savedCards.length === 0 // First card becomes default
        });

      if (error) throw error;
      
      toast.success('Cartão salvo com sucesso!');
      fetchSavedCards(); // Refresh the list
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      toast.error('Erro ao salvar cartão');
    }
  };

  const handleCardDataChange = (field: string, value: string) => {
    const newCardData = { ...cardData, [field]: value };
    setCardData(newCardData);
    
    // Auto-select payment if form is valid
    if (newCardData.number && newCardData.name && newCardData.expiryDate && newCardData.cvv) {
      onPaymentSelect({
        method: paymentMethod,
        ...newCardData
      });
    }
  };

  const handleSavedCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
    const card = savedCards.find(c => c.id === cardId);
    if (card) {
      onPaymentSelect({
        method: card.type as PaymentMethod,
        cardNumber: card.card_number,
        cardName: card.card_name,
        expiryDate: card.expiry_date
      });
      setPaymentMethod(card.type as PaymentMethod);
    }
  };

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forma de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">Cartão</TabsTrigger>
            <TabsTrigger value="other">Outros</TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4">
            {savedCards.length > 0 && (
              <div className="space-y-2">
                <Label>Cartões Salvos</Label>
                {savedCards.map((card) => (
                  <div
                    key={card.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCard === card.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => handleSavedCardSelect(card.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CreditCard size={16} />
                        <span className="font-medium">**** {card.card_number.slice(-4)}</span>
                        <span className="text-sm text-muted-foreground">{card.card_name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{card.expiry_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <Label>Novo Cartão</Label>
              
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => handlePaymentMethodChange(value as PaymentMethod)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit" id="credit" />
                  <Label htmlFor="credit">Crédito</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="debit" id="debit" />
                  <Label htmlFor="debit">Débito</Label>
                </div>
              </RadioGroup>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={cardData.number}
                    onChange={(e) => handleCardDataChange('number', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cardName">Nome no Cartão</Label>
                  <Input
                    id="cardName"
                    placeholder="Nome completo"
                    value={cardData.name}
                    onChange={(e) => handleCardDataChange('name', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiryDate">Validade</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/AA"
                      value={cardData.expiryDate}
                      onChange={(e) => handleCardDataChange('expiryDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="000"
                      value={cardData.cvv}
                      onChange={(e) => handleCardDataChange('cvv', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveCard"
                  checked={saveCard}
                  onCheckedChange={(checked) => setSaveCard(!!checked)}
                />
                <Label htmlFor="saveCard" className="text-sm">
                  Salvar este cartão para próximas compras
                </Label>
              </div>
              
              {cardData.number && cardData.name && cardData.expiryDate && cardData.cvv && (
                <Button
                  onClick={() => saveCardToDatabase(cardData, saveCard)}
                  variant="outline"
                  className="w-full"
                  disabled={!saveCard}
                >
                  Salvar Cartão
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'pix' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => handlePaymentMethodChange('pix')}
            >
              <div className="flex items-center space-x-3">
                <Smartphone className="text-primary" size={20} />
                <div>
                  <div className="font-medium">PIX</div>
                  <div className="text-sm text-muted-foreground">Pagamento instantâneo</div>
                </div>
              </div>
              
              {paymentMethod === 'pix' && qrCodeUrl && (
                <div className="mt-4 space-y-3">
                  <div className="flex justify-center bg-white p-4 rounded-lg">
                    <canvas ref={canvasRef} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Código PIX Copia e Cola</Label>
                    <div className="flex gap-2">
                      <Input
                        value={pixCode}
                        readOnly
                        className="text-xs font-mono"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyPixCode}
                        className="flex-shrink-0"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Escaneie o QR Code ou copie o código acima</p>
                    <p className="font-medium mt-1">Aguardando pagamento...</p>
                  </div>
                </div>
              )}
            </div>

            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => handlePaymentMethodChange('cash')}
            >
              <div className="flex items-center space-x-3">
                <Banknote className="text-primary" size={20} />
                <div>
                  <div className="font-medium">Dinheiro</div>
                  <div className="text-sm text-muted-foreground">Pagamento na entrega</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};