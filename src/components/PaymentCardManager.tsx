
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, CreditCard, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/lib/toast';

export interface SavedCard {
  id: string;
  number: string;
  name: string;
  expiryDate: string;
  type: 'credit' | 'debit' | 'meal';
  isDefault?: boolean;
}

interface PaymentCardManagerProps {
  onCardSelect?: (card: SavedCard) => void;
  selectedCardId?: string;
}

export const PaymentCardManager: React.FC<PaymentCardManagerProps> = ({ 
  onCardSelect,
  selectedCardId
}) => {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState<Omit<SavedCard, 'id'>>({
    number: '',
    name: '',
    expiryDate: '',
    type: 'credit'
  });
  
  // Load saved cards for current user
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return;
    
    const user = JSON.parse(userJson);
    const userId = user.email;
    
    const cardsKey = `savedCards_${userId}`;
    const savedCardsJson = localStorage.getItem(cardsKey);
    
    if (savedCardsJson) {
      try {
        const loadedCards = JSON.parse(savedCardsJson);
        setSavedCards(loadedCards);
      } catch (error) {
        console.error('Error loading saved cards:', error);
      }
    }
  }, []);
  
  const saveCards = (cards: SavedCard[]) => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return;
    
    const user = JSON.parse(userJson);
    const userId = user.email;
    
    const cardsKey = `savedCards_${userId}`;
    localStorage.setItem(cardsKey, JSON.stringify(cards));
  };
  
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newCard.number || !newCard.name || !newCard.expiryDate) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    // Format card number
    const formattedNumber = newCard.number.replace(/\s/g, '');
    if (formattedNumber.length < 16) {
      toast.error('Número do cartão inválido');
      return;
    }
    
    // Check if this is first card (make it default)
    const isFirstCard = savedCards.length === 0;
    
    // Create new card with ID
    const card: SavedCard = {
      ...newCard,
      id: Date.now().toString(),
      number: formattedNumber,
      isDefault: isFirstCard
    };
    
    // Add to saved cards
    const updatedCards = [...savedCards, card];
    setSavedCards(updatedCards);
    saveCards(updatedCards);
    
    // Reset form
    setNewCard({
      number: '',
      name: '',
      expiryDate: '',
      type: 'credit'
    });
    setShowAddForm(false);
    
    toast.success('Cartão adicionado com sucesso');
    
    // Select the card if this is the only one
    if (isFirstCard && onCardSelect) {
      onCardSelect(card);
    }
  };
  
  const handleCardSelect = (card: SavedCard) => {
    if (onCardSelect) {
      onCardSelect(card);
    }
  };
  
  const handleSetDefault = (cardId: string) => {
    const updatedCards = savedCards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    }));
    
    setSavedCards(updatedCards);
    saveCards(updatedCards);
    toast.success('Cartão definido como padrão');
  };
  
  const handleDeleteCard = (cardId: string) => {
    const updatedCards = savedCards.filter(card => card.id !== cardId);
    
    // If deleting default card, set a new default
    if (updatedCards.length > 0 && savedCards.find(c => c.id === cardId)?.isDefault) {
      updatedCards[0].isDefault = true;
    }
    
    setSavedCards(updatedCards);
    saveCards(updatedCards);
    
    toast.success('Cartão removido');
  };
  
  const formatCardNumber = (number: string) => {
    return '•••• •••• •••• ' + number.slice(-4);
  };
  
  const getCardTypeLabel = (type: 'credit' | 'debit' | 'meal') => {
    switch (type) {
      case 'credit':
        return 'Crédito';
      case 'debit':
        return 'Débito';
      case 'meal':
        return 'Vale Refeição';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Seus Cartões</CardTitle>
      </CardHeader>
      <CardContent>
        {savedCards.length === 0 && !showAddForm ? (
          <div className="text-center py-6">
            <CreditCard size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">Você ainda não possui cartões cadastrados</p>
            <Button 
              variant="outline"
              className="border-dashed"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={16} className="mr-2" />
              Adicionar Cartão
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedCards.map(card => (
              <div 
                key={card.id}
                onClick={() => handleCardSelect(card)}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedCardId === card.id 
                    ? 'border-red-500 bg-red-50' 
                    : 'hover:border-gray-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <CreditCard size={16} className="mr-2 text-gray-600" />
                      <span className="font-medium">{formatCardNumber(card.number)}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({getCardTypeLabel(card.type)})
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{card.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Valid thru: {card.expiryDate}</div>
                  </div>
                  <div className="flex">
                    {card.isDefault ? (
                      <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        <Check size={12} className="mr-1" />
                        Padrão
                      </span>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(card.id);
                        }}
                      >
                        Definir como padrão
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(card.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {showAddForm ? (
              <div className="border rounded-lg p-4 mt-4">
                <h4 className="font-medium mb-3">Adicionar Novo Cartão</h4>
                <form onSubmit={handleAddCard}>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <Input 
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={newCard.number}
                          onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="cardName">Nome no Cartão</Label>
                        <Input 
                          id="cardName"
                          placeholder="NOME COMO ESTÁ NO CARTÃO"
                          value={newCard.name}
                          onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Validade</Label>
                        <Input 
                          id="expiryDate"
                          placeholder="MM/AA"
                          value={newCard.expiryDate}
                          onChange={(e) => setNewCard({...newCard, expiryDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardType">Tipo</Label>
                        <select
                          id="cardType"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={newCard.type}
                          onChange={(e) => setNewCard({...newCard, type: e.target.value as 'credit' | 'debit' | 'meal'})}
                        >
                          <option value="credit">Crédito</option>
                          <option value="debit">Débito</option>
                          <option value="meal">Vale Refeição</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-2">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                        Salvar Cartão
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <Button 
                variant="outline"
                className="w-full border-dashed mt-3"
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={16} className="mr-2" />
                Adicionar Cartão
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
