import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Trash2, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { addressService } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';

type Address = {
  id: string;
  user_id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export const UserAddresses: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
    is_default: false
  });

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await addressService.getByUserId(user.id);
      setAddresses(data);
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os endereços.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const addressData = {
        ...formData,
        user_id: user.id
      };

      if (editingAddress) {
        await addressService.update(editingAddress.id, formData);
        toast({
          title: "Sucesso!",
          description: "Endereço atualizado com sucesso.",
        });
      } else {
        await addressService.create(addressData);
        toast({
          title: "Sucesso!",
          description: "Endereço adicionado com sucesso.",
        });
      }
      
      setDialogOpen(false);
      setEditingAddress(null);
      resetForm();
      loadAddresses();
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o endereço.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await addressService.remove(id);
      toast({
        title: "Sucesso!",
        description: "Endereço removido com sucesso.",
      });
      loadAddresses();
    } catch (error) {
      console.error('Erro ao deletar endereço:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o endereço.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // Primeiro remove o padrão de todos
      const updates = addresses.map(addr => 
        addressService.update(addr.id, { is_default: addr.id === id })
      );
      await Promise.all(updates);
      
      toast({
        title: "Sucesso!",
        description: "Endereço padrão atualizado.",
      });
      loadAddresses();
    } catch (error) {
      console.error('Erro ao definir endereço padrão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível definir como padrão.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      is_default: address.is_default
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zip_code: '',
      is_default: false
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Meus Endereços
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
          <MapPin className="h-5 w-5" />
          Meus Endereços
        </CardTitle>
        <CardDescription>
          Gerencie seus endereços de entrega
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium">
                      {address.street}, {address.number}
                    </p>
                    {address.is_default && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Padrão
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.complement && `${address.complement}, `}
                    {address.neighborhood}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} - {address.zip_code}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!address.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Definir como padrão
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(address)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {addresses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum endereço cadastrado</p>
            </div>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full" 
                onClick={() => {
                  setEditingAddress(null);
                  resetForm();
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Endereço
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={formData.complement}
                    onChange={(e) => setFormData(prev => ({ ...prev, complement: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="zip_code">CEP</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingAddress ? 'Atualizar' : 'Salvar'}
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