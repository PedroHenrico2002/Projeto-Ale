import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { paymentService, PaymentMethodType } from '@/services/paymentService';
import { useAuth } from '@/hooks/useAuth';

type PaymentMethod = {
  id: string;
  user_id: string;
  type: PaymentMethodType;
  card_number: string | null;
  card_name: string | null;
  expiry_date: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export const UserPaymentMethods: React.FC = () => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    type: 'credit' as PaymentMethodType,
    card_number: '',
    card_name: '',
    expiry_date: '',
    is_default: false
  });

  useEffect(() => {
    if (user) {
      loadPaymentMethods();
    }
  }, [user]);

  const loadPaymentMethods = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await paymentService.getByUserId(user.id);
      setPaymentMethods(data);
    } catch (error) {
      console.error('Erro ao carregar métodos de pagamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os métodos de pagamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const methodData = {
        ...formData,
        user_id: user.id
      };

      if (editingMethod) {
        await paymentService.update(editingMethod.id, formData);
        toast({
          title: "Sucesso!",
          description: "Método de pagamento atualizado com sucesso.",
        });
      } else {
        await paymentService.create(methodData);
        toast({
          title: "Sucesso!",
          description: "Método de pagamento adicionado com sucesso.",
        });
      }
      
      setDialogOpen(false);
      setEditingMethod(null);
      resetForm();
      loadPaymentMethods();
    } catch (error) {
      console.error('Erro ao salvar método de pagamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o método de pagamento.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      await paymentService.remove(id);
      toast({
        title: "Sucesso!",
        description: "Método de pagamento removido com sucesso.",
      });
      loadPaymentMethods();
    } catch (error) {
      console.error('Erro ao deletar método de pagamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o método de pagamento.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    
    try {
      await paymentService.setDefault(id, user.id);
      toast({
        title: "Sucesso!",
        description: "Método de pagamento padrão atualizado.",
      });
      loadPaymentMethods();
    } catch (error) {
      console.error('Erro ao definir método padrão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível definir como padrão.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      card_number: method.card_number || '',
      card_name: method.card_name || '',
      expiry_date: method.expiry_date || '',
      is_default: method.is_default
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'credit',
      card_number: '',
      card_name: '',
      expiry_date: '',
      is_default: false
    });
  };

  const formatCardNumber = (number: string) => {
    return `**** **** **** ${number.slice(-4)}`;
  };

  const getPaymentTypeLabel = (type: PaymentMethodType) => {
    switch (type) {
      case 'credit': return 'Cartão de Crédito';
      case 'debit': return 'Cartão de Débito';
      case 'pix': return 'PIX';
      case 'cash': return 'Dinheiro';
      default: return type;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Métodos de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Métodos de Pagamento
        </CardTitle>
        <CardDescription>
          Gerencie seus métodos de pagamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{getPaymentTypeLabel(method.type)}</p>
                      {method.is_default && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Padrão
                        </Badge>
                      )}
                    </div>
                    {method.card_number && (
                      <p className="text-sm text-muted-foreground">
                        {formatCardNumber(method.card_number)}
                      </p>
                    )}
                    {method.card_name && (
                      <p className="text-sm text-muted-foreground">{method.card_name}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!method.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Definir como padrão
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(method)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePaymentMethod(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {paymentMethods.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum método de pagamento cadastrado</p>
            </div>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full" 
                onClick={() => {
                  setEditingMethod(null);
                  resetForm();
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Método de Pagamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingMethod ? 'Editar Método' : 'Novo Método de Pagamento'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSavePaymentMethod} className="space-y-4">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value: PaymentMethodType) => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Cartão de Crédito</SelectItem>
                      <SelectItem value="debit">Cartão de Débito</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.type === 'credit' || formData.type === 'debit') && (
                  <>
                    <div>
                      <Label htmlFor="card_number">Número do Cartão</Label>
                      <Input
                        id="card_number"
                        value={formData.card_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, card_number: e.target.value }))}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div>
                      <Label htmlFor="card_name">Nome no Cartão</Label>
                      <Input
                        id="card_name"
                        value={formData.card_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, card_name: e.target.value }))}
                        placeholder="Nome como está no cartão"
                      />
                    </div>

                    <div>
                      <Label htmlFor="expiry_date">Validade</Label>
                      <Input
                        id="expiry_date"
                        value={formData.expiry_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                        placeholder="MM/AA"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingMethod ? 'Atualizar' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};