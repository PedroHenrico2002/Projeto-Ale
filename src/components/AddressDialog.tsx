
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Check, Trash2 } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
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

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddressChange: () => void;
}

export const AddressDialog: React.FC<AddressDialogProps> = ({
  open,
  onOpenChange,
  onAddressChange
}) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const form = useForm({
    defaultValues: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: 'São Paulo',
      state: 'SP',
      zip_code: ''
    }
  });

  useEffect(() => {
    if (open && user) {
      loadAddresses();
    }
  }, [open, user]);

  const loadAddresses = async () => {
    if (!user) return;

    try {
      const data = await addressService.getByUserId(user.id);
      setAddresses(data);
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
      toast.error('Erro ao carregar endereços');
    }
  };

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar endereços');
      return;
    }

    try {
      // Set all other addresses as non-default
      const updates = addresses.map(addr => 
        addressService.update(addr.id, { is_default: false })
      );
      await Promise.all(updates);

      // Create new address as default
      await addressService.create({
        user_id: user.id,
        street: data.street,
        number: data.number,
        complement: data.complement || undefined,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        is_default: true
      });

      toast.success('Endereço salvo com sucesso!');
      form.reset();
      setShowForm(false);
      await loadAddresses();
      onAddressChange();
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      toast.error('Erro ao salvar endereço');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const updates = addresses.map(addr => 
        addressService.update(addr.id, { is_default: addr.id === id })
      );
      await Promise.all(updates);
      
      toast.success('Endereço padrão atualizado!');
      await loadAddresses();
      onAddressChange();
    } catch (error) {
      console.error('Erro ao definir endereço padrão:', error);
      toast.error('Erro ao definir endereço padrão');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (addresses.length <= 1) {
      toast.error('Não é possível excluir o único endereço existente');
      return;
    }

    try {
      const isDefault = addresses.find(addr => addr.id === id)?.is_default;
      
      await addressService.remove(id);
      
      // If the deleted address was default, set a new default
      if (isDefault && addresses.length > 1) {
        const newDefaultId = addresses.find(addr => addr.id !== id)?.id;
        if (newDefaultId) {
          await addressService.update(newDefaultId, { is_default: true });
        }
      }

      toast.success('Endereço excluído com sucesso!');
      await loadAddresses();
      onAddressChange();
    } catch (error) {
      console.error('Erro ao excluir endereço:', error);
      toast.error('Erro ao excluir endereço');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Meus endereços</DialogTitle>
          <DialogDescription>
            Selecione seu endereço de entrega ou cadastre um novo.
          </DialogDescription>
        </DialogHeader>
        
        {!showForm ? (
          <div className="space-y-4">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {addresses.map((address) => (
                <div 
                  key={address.id} 
                  className={`p-3 border rounded-md flex items-start justify-between ${address.is_default ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-start space-x-2">
                    <MapPin className="text-red-500 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-medium">
                        {address.street}, {address.number}
                        {address.complement && ` - ${address.complement}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {address.neighborhood}, {address.city} - {address.state}
                      </p>
                      <p className="text-xs text-gray-500">
                        CEP: {address.zip_code}
                      </p>
                      {address.is_default && (
                        <span className="text-xs text-red-600 flex items-center mt-1">
                          <Check size={12} className="mr-1" />
                          Endereço principal
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {!address.is_default && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs mr-1"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Definir como principal
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 h-8 w-8"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} className="mr-2" />
              Adicionar novo endereço
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da rua" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Apto, bloco, referência" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Bairro" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="UF" maxLength={2} {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="00000-000" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  Salvar endereço
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
