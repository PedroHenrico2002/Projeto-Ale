
import React, { useState, useEffect } from 'react';
import { addressService, userService, restaurantService, Address, User, Restaurant } from '@/utils/databaseService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, MapPin, Store, User as UserIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AddressCrud: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [addressType, setAddressType] = useState<'user' | 'restaurant'>('user');
  const { toast } = useToast();

  useEffect(() => {
    loadAddresses();
    setUsers(userService.getAll());
    setRestaurants(restaurantService.getAll());
  }, []);

  const loadAddresses = () => {
    setAddresses(addressService.getAll());
  };

  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setCurrentAddress(address);
      setIsEditing(true);
      setAddressType(address.isRestaurantAddress ? 'restaurant' : 'user');
    } else {
      setCurrentAddress({
        userId: users.length > 0 ? users[0].id : '',
        street: '',
        number: '',
        city: '',
        isDefault: false,
        isRestaurantAddress: false
      });
      setIsEditing(false);
      setAddressType('user');
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentAddress({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAddress({ ...currentAddress, [name]: value });
  };

  const handleUserChange = (value: string) => {
    setCurrentAddress({ ...currentAddress, userId: value });
  };

  const handleRestaurantChange = (value: string) => {
    setCurrentAddress({ ...currentAddress, restaurantId: value });
  };

  const handleDefaultChange = (checked: boolean) => {
    setCurrentAddress({ ...currentAddress, isDefault: checked });
  };

  const handleAddressTypeChange = (type: 'user' | 'restaurant') => {
    setAddressType(type);
    setCurrentAddress({
      ...currentAddress,
      isRestaurantAddress: type === 'restaurant',
      userId: type === 'user' && users.length > 0 ? users[0].id : undefined,
      restaurantId: type === 'restaurant' && restaurants.length > 0 ? restaurants[0].id : undefined
    });
  };

  const validateForm = () => {
    if (!currentAddress.street || !currentAddress.number || !currentAddress.city) {
      toast({
        title: "Erro de validação",
        description: "Rua, número e cidade são obrigatórios",
        variant: "destructive",
      });
      return false;
    }

    if (addressType === 'user' && !currentAddress.userId) {
      toast({
        title: "Erro de validação",
        description: "Usuário é obrigatório para endereços de usuário",
        variant: "destructive",
      });
      return false;
    }

    if (addressType === 'restaurant' && !currentAddress.restaurantId) {
      toast({
        title: "Erro de validação",
        description: "Restaurante é obrigatório para endereços de restaurante",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    if (isEditing && currentAddress.id) {
      addressService.update(currentAddress.id, currentAddress);
      
      // Update restaurant with this address if it's a restaurant address
      if (currentAddress.isRestaurantAddress && currentAddress.restaurantId) {
        const restaurant = restaurantService.getById(currentAddress.restaurantId);
        if (restaurant) {
          restaurantService.update(restaurant.id, { 
            ...restaurant, 
            addressId: currentAddress.id 
          });
        }
      }
      
      toast({
        title: "Endereço atualizado",
        description: "O endereço foi atualizado com sucesso",
      });
    } else {
      const newAddress = addressService.create(currentAddress as Omit<Address, 'id'>);
      
      // Update restaurant with this address if it's a restaurant address
      if (newAddress.isRestaurantAddress && newAddress.restaurantId) {
        const restaurant = restaurantService.getById(newAddress.restaurantId);
        if (restaurant) {
          restaurantService.update(restaurant.id, { 
            ...restaurant, 
            addressId: newAddress.id 
          });
        }
      }
      
      toast({
        title: "Endereço criado",
        description: "Novo endereço foi criado com sucesso",
      });
    }
    
    handleCloseDialog();
    loadAddresses();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      addressService.remove(id);
      toast({
        title: "Endereço excluído",
        description: "O endereço foi removido com sucesso",
      });
      loadAddresses();
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Usuário não encontrado';
  };

  const getRestaurantName = (restaurantId: string) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Restaurante não encontrado';
  };

  const userAddresses = addresses.filter(a => !a.isRestaurantAddress);
  const restaurantAddresses = addresses.filter(a => a.isRestaurantAddress);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gerenciamento de Endereços</h3>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={16} className="mr-2" />
          Novo Endereço
        </Button>
      </div>
      
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="user">Endereços de Usuários</TabsTrigger>
          <TabsTrigger value="restaurant">Endereços de Restaurantes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="user">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Rua</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Padrão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAddresses.length > 0 ? (
                  userAddresses.map((address) => (
                    <TableRow key={address.id}>
                      <TableCell>{getUserName(address.userId)}</TableCell>
                      <TableCell>{address.street}</TableCell>
                      <TableCell>{address.number}</TableCell>
                      <TableCell>{address.city}</TableCell>
                      <TableCell>{address.isDefault ? 'Sim' : 'Não'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleOpenDialog(address)}>
                            <Pencil size={16} />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(address.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <UserIcon size={24} />
                        <p>Nenhum endereço de usuário cadastrado</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="restaurant">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Restaurante</TableHead>
                  <TableHead>Rua</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurantAddresses.length > 0 ? (
                  restaurantAddresses.map((address) => (
                    <TableRow key={address.id}>
                      <TableCell>{address.restaurantId ? getRestaurantName(address.restaurantId) : 'Não associado'}</TableCell>
                      <TableCell>{address.street}</TableCell>
                      <TableCell>{address.number}</TableCell>
                      <TableCell>{address.city}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleOpenDialog(address)}>
                            <Pencil size={16} />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(address.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Store size={24} />
                        <p>Nenhum endereço de restaurante cadastrado</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Endereço' : 'Novo Endereço'}</DialogTitle>
            <DialogDescription>
              Selecione o tipo de endereço e preencha os dados
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Tipo de Endereço</Label>
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    variant={addressType === 'user' ? 'default' : 'outline'}
                    onClick={() => handleAddressTypeChange('user')}
                    className="flex-1"
                  >
                    <UserIcon size={16} className="mr-2" />
                    Usuário
                  </Button>
                  <Button 
                    type="button" 
                    variant={addressType === 'restaurant' ? 'default' : 'outline'}
                    onClick={() => handleAddressTypeChange('restaurant')}
                    className="flex-1"
                  >
                    <Store size={16} className="mr-2" />
                    Restaurante
                  </Button>
                </div>
              </div>
              
              {addressType === 'user' && (
                <div className="grid gap-2">
                  <Label htmlFor="userId">Usuário</Label>
                  <Select 
                    onValueChange={handleUserChange} 
                    defaultValue={currentAddress.userId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {addressType === 'restaurant' && (
                <div className="grid gap-2">
                  <Label htmlFor="restaurantId">Restaurante</Label>
                  <Select 
                    onValueChange={handleRestaurantChange} 
                    defaultValue={currentAddress.restaurantId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um restaurante" />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurants.map(restaurant => (
                        <SelectItem key={restaurant.id} value={restaurant.id}>
                          {restaurant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  name="street"
                  value={currentAddress.street || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  name="number"
                  value={currentAddress.number || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  name="complement"
                  value={currentAddress.complement || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  value={currentAddress.city || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              {addressType === 'user' && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isDefault" 
                    checked={currentAddress.isDefault} 
                    onCheckedChange={handleDefaultChange} 
                  />
                  <Label htmlFor="isDefault">Endereço padrão</Label>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
