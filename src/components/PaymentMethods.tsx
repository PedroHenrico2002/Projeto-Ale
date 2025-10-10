/**
 * Componente de Métodos de Pagamento
 * 
 * Gerencia todas as formas de pagamento disponíveis no sistema:
 * - Cartões de crédito e débito (novos e salvos)
 * - PIX com geração de QR Code
 * - Dinheiro (pagamento na entrega)
 */

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

// Tipo que define as formas de pagamento aceitas
export type PaymentMethod = 'credit' | 'debit' | 'pix' | 'cash';

// Interface dos dados de pagamento a serem enviados ao componente pai
interface PaymentData {
  method: PaymentMethod; // Método de pagamento selecionado
  cardNumber?: string; // Número do cartão (opcional)
  cardName?: string; // Nome impresso no cartão (opcional)
  expiryDate?: string; // Data de validade (opcional)
  cvv?: string; // Código de segurança (opcional)
}

// Props do componente PaymentMethods
interface PaymentMethodsProps {
  onPaymentSelect: (paymentData: PaymentData) => void; // Callback quando um método é selecionado
  selectedMethod?: PaymentMethod; // Método pré-selecionado (opcional)
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  onPaymentSelect, 
  selectedMethod = 'credit' // Valor padrão: crédito
}) => {
  // Hook de autenticação para acessar dados do usuário logado
  const { user } = useAuth();
  
  // Estado para controlar qual aba está ativa (cartão ou outros métodos)
  const [activeTab, setActiveTab] = useState('card');
  
  // Estado do método de pagamento atual
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(selectedMethod);
  
  // Estado dos dados do novo cartão sendo digitado
  const [cardData, setCardData] = useState({
    number: '', // Número do cartão
    name: '', // Nome no cartão
    expiryDate: '', // Validade (MM/AA)
    cvv: '' // Código de segurança
  });
  
  // Lista de cartões salvos do usuário
  const [savedCards, setSavedCards] = useState<any[]>([]);
  
  // ID do cartão salvo selecionado
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  // Indica se o usuário quer salvar o cartão atual
  const [saveCard, setSaveCard] = useState(false);
  
  // URL da imagem do QR Code PIX gerado
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  // Código PIX copia e cola (payload)
  const [pixCode, setPixCode] = useState<string>('');
  
  // Indica se o código PIX foi copiado
  const [copied, setCopied] = useState(false);
  
  // Referência ao elemento canvas para renderizar o QR Code
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Efeito: Busca cartões salvos quando o usuário estiver logado
   * Executa sempre que o objeto 'user' mudar
   */
  useEffect(() => {
    if (user) {
      fetchSavedCards();
    }
  }, [user]);

  /**
   * Busca todos os cartões salvos do usuário no banco de dados
   */
  const fetchSavedCards = async () => {
    // Se não houver usuário logado, não faz nada
    if (!user) return;
    
    try {
      // Consulta a tabela payment_methods filtrando pelo ID do usuário
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id);

      // Se houver erro na consulta, lança exceção
      if (error) throw error;
      
      // Atualiza o estado com os cartões encontrados (ou array vazio)
      setSavedCards(data || []);
    } catch (error) {
      console.error('Erro ao buscar cartões:', error);
    }
  };

  /**
   * Gera o QR Code PIX e o código copia e cola
   * NOTA: Em produção, este payload deve vir de um backend que gere
   * um código PIX válido com os dados reais da transação
   */
  const generatePixQRCode = async () => {
    // Gera um payload PIX simulado (em produção seria um código real)
    // O UUID garante que cada código seja único
    const pixPayload = `00020126580014BR.GOV.BCB.PIX0136${crypto.randomUUID()}520400005303986540510.005802BR5925Restaurante Delivery6009SAO PAULO62070503***6304`;
    
    // Salva o código PIX no estado
    setPixCode(pixPayload);
    
    try {
      // Se o elemento canvas existir, renderiza o QR Code nele
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, pixPayload, {
          width: 250, // Largura do QR Code em pixels
          margin: 2, // Margem ao redor do código
          color: {
            dark: '#000000', // Cor dos quadrados escuros
            light: '#FFFFFF' // Cor do fundo
          }
        });
      }
      
      // Gera também uma URL de imagem do QR Code (para exibição alternativa)
      const qrUrl = await QRCode.toDataURL(pixPayload, {
        width: 250,
        margin: 2
      });
      
      // Salva a URL da imagem no estado
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code PIX');
    }
  };

  /**
   * Efeito: Gera o QR Code automaticamente quando PIX for selecionado
   * e ainda não houver QR Code gerado
   */
  useEffect(() => {
    if (paymentMethod === 'pix' && !qrCodeUrl) {
      generatePixQRCode();
    }
  }, [paymentMethod]);

  /**
   * Manipula a mudança do método de pagamento
   * @param method - Novo método de pagamento selecionado
   */
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    // Atualiza o estado do método de pagamento
    setPaymentMethod(method);
    
    // Se for dinheiro, apenas notifica o componente pai
    if (method === 'cash') {
      onPaymentSelect({ method });
    } 
    // Se for PIX, gera o QR Code e notifica
    else if (method === 'pix') {
      generatePixQRCode();
      onPaymentSelect({ method });
    } 
    // Se for cartão e houver um cartão salvo selecionado, usa seus dados
    else if (selectedCard) {
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

  /**
   * Salva um novo cartão no banco de dados
   * @param cardData - Dados do cartão a ser salvo
   * @param saveCard - Flag indicando se deve salvar (proteção extra)
   */
  const saveCardToDatabase = async (cardData: any, saveCard: boolean = false) => {
    // Se não houver usuário logado ou flag saveCard for false, não faz nada
    if (!user || !saveCard) return;

    try {
      // Mascara o número do cartão para segurança (mostra apenas os 4 últimos dígitos)
      // Exemplo: 1234567890123456 vira ****-****-****-3456
      const maskedNumber = `****-****-****-${cardData.number.slice(-4)}`;
      
      // Insere o novo cartão na tabela payment_methods
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id, // ID do usuário logado
          type: paymentMethod, // Tipo: crédito ou débito
          card_number: maskedNumber, // Número mascarado
          card_name: cardData.name, // Nome no cartão
          expiry_date: cardData.expiryDate, // Data de validade
          is_default: savedCards.length === 0 // Se for o primeiro cartão, torna padrão
        });

      // Se houver erro na inserção, lança exceção
      if (error) throw error;
      
      // Notifica sucesso ao usuário
      toast.success('Cartão salvo com sucesso!');
      
      // Recarrega a lista de cartões salvos
      fetchSavedCards();
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      toast.error('Erro ao salvar cartão');
    }
  };

  /**
   * Manipula mudanças nos campos do formulário de novo cartão
   * @param field - Nome do campo que foi alterado
   * @param value - Novo valor do campo
   */
  const handleCardDataChange = (field: string, value: string) => {
    // Cria um novo objeto com o campo atualizado
    const newCardData = { ...cardData, [field]: value };
    
    // Atualiza o estado com os novos dados
    setCardData(newCardData);
    
    // Auto-seleção: se todos os campos obrigatórios estiverem preenchidos,
    // automaticamente notifica o componente pai
    if (newCardData.number && newCardData.name && newCardData.expiryDate && newCardData.cvv) {
      onPaymentSelect({
        method: paymentMethod,
        ...newCardData
      });
    }
  };

  /**
   * Manipula a seleção de um cartão salvo
   * @param cardId - ID do cartão selecionado
   */
  const handleSavedCardSelect = (cardId: string) => {
    // Atualiza qual cartão está selecionado
    setSelectedCard(cardId);
    
    // Busca os dados completos do cartão na lista
    const card = savedCards.find(c => c.id === cardId);
    
    if (card) {
      // Notifica o componente pai com os dados do cartão selecionado
      onPaymentSelect({
        method: card.type as PaymentMethod,
        cardNumber: card.card_number,
        cardName: card.card_name,
        expiryDate: card.expiry_date
      });
      
      // Atualiza o método de pagamento para corresponder ao tipo do cartão
      setPaymentMethod(card.type as PaymentMethod);
    }
  };

  /**
   * Copia o código PIX para a área de transferência
   */
  const handleCopyPixCode = () => {
    // Usa a API do navegador para copiar o texto
    navigator.clipboard.writeText(pixCode);
    
    // Marca como copiado
    setCopied(true);
    
    // Exibe notificação de sucesso
    toast.success('Código PIX copiado!');
    
    // Após 2 segundos, remove a indicação visual de copiado
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