
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaymentCardManager, SavedCard } from './PaymentCardManager';
import { AlertCircle, CreditCard, Wallet } from 'lucide-react';
import { toast } from '@/lib/toast';

// Type definitions
export type PaymentMethod = 'credit' | 'debit' | 'meal' | 'cash';

export interface CardDetails {
  number: string;
  name: string;
  expiryDate?: string;
  cvv?: string;
}

interface PaymentMethodsProps {
  onSelectPayment: (method: PaymentMethod, cardDetails: CardDetails | null) => void;
  selectedMethod: PaymentMethod;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  onSelectPayment, 
  selectedMethod
}) => {
  const [paymentTab, setPaymentTab] = useState<string>('card');
  const [cardType, setCardType] = useState<PaymentMethod>('credit');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    name: '',
    expiryDate: '',
    cvv: ''
  });
  const [savedCard, setSavedCard] = useState<SavedCard | null>(null);
  const [formValid, setFormValid] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setIsLoggedIn(true);
      
      // Get default card if there's one
      const user = JSON.parse(userJson);
      const userId = user.email;
      
      const cardsKey = `savedCards_${userId}`;
      const savedCardsJson = localStorage.getItem(cardsKey);
      
      if (savedCardsJson) {
        try {
          const cards = JSON.parse(savedCardsJson);
          const defaultCard = cards.find((card: SavedCard) => card.isDefault);
          if (defaultCard) {
            setSavedCard(defaultCard);
            handleSelectPayment(defaultCard.type, {
              number: defaultCard.number,
              name: defaultCard.name,
              expiryDate: defaultCard.expiryDate
            });
          }
        } catch (error) {
          console.error('Error loading saved cards:', error);
        }
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  
  // Validation
  useEffect(() => {
    if (paymentTab === 'card' && !savedCard) {
      // Validate card form
      const isValid = 
        cardDetails.number.length >= 16 && 
        cardDetails.name.trim().length > 0 &&
        cardDetails.expiryDate?.trim().length === 5 &&
        (cardDetails.cvv?.trim().length ?? 0) >= 3;
        
      setFormValid(isValid);
    } else if (paymentTab === 'card' && savedCard) {
      // Selected saved card is valid
      setFormValid(true);
    } else if (paymentTab === 'cash') {
      // Cash is always valid
      setFormValid(true);
    }
  }, [paymentTab, cardDetails, savedCard]);
  
  const handleSelectPayment = (method: PaymentMethod, details: CardDetails | null = null) => {
    onSelectPayment(method, details);
    if (method !== 'cash') {
      setCardType(method);
    }
  };
  
  const handleTabChange = (value: string) => {
    setPaymentTab(value);
    if (value === 'cash') {
      handleSelectPayment('cash', null);
    } else if (value === 'card' && savedCard) {
      // If returning to card tab with a saved card
      handleSelectPayment(savedCard.type, {
        number: savedCard.number,
        name: savedCard.name,
        expiryDate: savedCard.expiryDate
      });
    } else if (value === 'card') {
      // If returning to card tab without a saved card
      handleSelectPayment(cardType, formValid ? cardDetails : null);
    }
  };
  
  const handleSavedCardSelect = (card: SavedCard) => {
    setSavedCard(card);
    handleSelectPayment(card.type, {
      number: card.number,
      name: card.name,
      expiryDate: card.expiryDate
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [id]: value
    });
  };
  
  const handleTypeChange = (value: string) => {
    const paymentMethod = value as PaymentMethod;
    setCardType(paymentMethod);
    
    // Only update selected payment if we have valid card details
    if (formValid) {
      handleSelectPayment(paymentMethod, cardDetails);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Forma de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="card" value={paymentTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="card">Cartão</TabsTrigger>
            <TabsTrigger value="cash">Dinheiro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="card">
            {isLoggedIn ? (
              <>
                <PaymentCardManager 
                  onCardSelect={handleSavedCardSelect}
                  selectedCardId={savedCard?.id}
                />
                
                {!savedCard && (
                  <>
                    <div className="my-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            ou adicione um cartão temporário
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <RadioGroup 
                        defaultValue={cardType} 
                        value={cardType}
                        onValueChange={handleTypeChange} 
                        className="flex space-x-4 space-y-0"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="credit" id="credit" />
                          <Label htmlFor="credit" className="cursor-pointer">Crédito</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="debit" id="debit" />
                          <Label htmlFor="debit" className="cursor-pointer">Débito</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="meal" id="meal" />
                          <Label htmlFor="meal" className="cursor-pointer">Vale Refeição</Label>
                        </div>
                      </RadioGroup>
                      
                      <div className="grid gap-3">
                        <div>
                          <Label htmlFor="number">Número do Cartão</Label>
                          <Input 
                            id="number" 
                            placeholder="1234 5678 9012 3456" 
                            value={cardDetails.number}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="name">Nome no Cartão</Label>
                          <Input 
                            id="name" 
                            placeholder="NOME COMO ESTÁ NO CARTÃO" 
                            value={cardDetails.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Validade</Label>
                            <Input 
                              id="expiryDate" 
                              placeholder="MM/AA" 
                              value={cardDetails.expiryDate}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input 
                              id="cvv" 
                              placeholder="123" 
                              value={cardDetails.cvv}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {!formValid && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Por favor, preencha todos os dados do cartão corretamente</span>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <Wallet className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-medium text-lg mb-1">Faça login primeiro</h3>
                <p className="text-sm text-yellow-800 mb-2">
                  Você precisa estar logado para usar cartões de pagamento.
                </p>
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Fazer Login
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cash">
            <div className="p-6 text-center space-y-3">
              <CreditCard size={48} className="mx-auto text-gray-400" />
              <div>
                <h3 className="font-medium text-lg">Pagamento na Entrega</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Você pagará diretamente ao entregador quando receber o pedido. 
                  Tenha o valor exato em mãos, se possível.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
