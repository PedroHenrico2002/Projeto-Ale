
import React, { useState, useEffect } from 'react';
import { restaurantService, categoryService, addressService, Restaurant, Category, Address } from '@/utils/databaseService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, Store, MapPin, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const RestaurantCrud: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState<Partial<Restaurant>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadRestaurants();
    setCategories(categoryService.getAll());
    loadAddresses();
  }, []);

  const loadRestaurants = () => {
    setRestaurants(restaurantService.getAll());
  };

  const loadAddresses = () => {
    setAddresses(addressService.getAll().filter(a => a.isRestaurantAddress));
  };

  const handleOpenDialog = (restaurant?: Restaurant) => {
    if (restaurant) {
      setCurrentRestaurant(restaurant);
      setIsEditing(true);
    } else {
      setCurrentRestaurant({
        name: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        cuisine: '',
        deliveryTime: '',
        minOrder: '',
        rating: 0
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentRestaurant({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentRestaurant({ ...currentRestaurant, [name]: value });
  };

  const handleCategoryChange = (value: string) => {
    setCurrentRestaurant({ ...currentRestaurant, categoryId: value });
  };

  const handleAddressChange = (value: string) => {
    setCurrentRestaurant({ ...currentRestaurant, addressId: value });
  };

  const handleOpenAddressDialog = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setIsAddressDialogOpen(true);
  };

  const validateForm = () => {
    if (!currentRestaurant.name || !currentRestaurant.categoryId) {
      toast({
        title: "Erro de validação",
        description: "Nome e categoria são obrigatórios",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    if (isEditing && currentRestaurant.id) {
      restaurantService.update(currentRestaurant.id, currentRestaurant);
      toast({
        title: "Restaurante atualizado",
        description: "As informações do restaurante foram atualizadas com sucesso",
      });
    } else {
      restaurantService.create(currentRestaurant as Omit<Restaurant, 'id'>);
      toast({
        title: "Restaurante criado",
        description: "Novo restaurante foi criado com sucesso",
      });
    }
    
    handleCloseDialog();
    loadRestaurants();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este restaurante?')) {
      restaurantService.remove(id);
      toast({
        title: "Restaurante excluído",
        description: "O restaurante foi removido com sucesso",
      });
      loadRestaurants();
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? `${category.icon || ''} ${category.name}` : 'Categoria não encontrada';
  };

  const getAddressInfo = (restaurantId: string) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant || !restaurant.addressId) return 'Sem endereço';
    
    const address = addresses.find(a => a.id === restaurant.addressId);
    if (!address) return 'Endereço não encontrado';
    
    return `${address.street}, ${address.number}, ${address.city}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gerenciamento de Restaurantes</h3>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={16} className="mr-2" />
          Novo Restaurante
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Cozinha</TableHead>
              <TableHead>Tempo de Entrega</TableHead>
              <TableHead>Pedido Mínimo</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{restaurant.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {restaurant.addressId ? (
                          <Badge variant="outline" className="mt-1 flex items-center gap-1">
                            <MapPin size={12} />
                            {getAddressInfo(restaurant.id)}
                          </Badge>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs mt-1"
                            onClick={() => handleOpenAddressDialog(restaurant.id)}
                          >
                            <MapPin size={12} className="mr-1" />
                            Adicionar endereço
                          </Button>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryName(restaurant.categoryId)}</TableCell>
                  <TableCell>{restaurant.cuisine || '-'}</TableCell>
                  <TableCell>{restaurant.deliveryTime || '-'}</TableCell>
                  <TableCell>{restaurant.minOrder || '-'}</TableCell>
                  <TableCell>{restaurant.rating ? `${restaurant.rating}/5` : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenDialog(restaurant)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(restaurant.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Store size={24} />
                    <p>Nenhum restaurante cadastrado</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Restaurante' : 'Novo Restaurante'}</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do restaurante
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentRestaurant.name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="categoryId">Categoria</Label>
                <Select 
                  onValueChange={handleCategoryChange} 
                  defaultValue={currentRestaurant.categoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {addresses.length > 0 && (
                <div className="grid gap-2">
                  <Label htmlFor="addressId">Endereço</Label>
                  <Select 
                    onValueChange={handleAddressChange} 
                    defaultValue={currentRestaurant.addressId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um endereço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sem endereço</SelectItem>
                      {addresses.map(address => (
                        <SelectItem key={address.id} value={address.id}>
                          {address.street}, {address.number}, {address.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="cuisine">Tipo de Cozinha</Label>
                <Input
                  id="cuisine"
                  name="cuisine"
                  value={currentRestaurant.cuisine || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deliveryTime">Tempo de Entrega</Label>
                <Input
                  id="deliveryTime"
                  name="deliveryTime"
                  value={currentRestaurant.deliveryTime || ''}
                  onChange={handleInputChange}
                  placeholder="30-45 min"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minOrder">Pedido Mínimo</Label>
                <Input
                  id="minOrder"
                  name="minOrder"
                  value={currentRestaurant.minOrder || ''}
                  onChange={handleInputChange}
                  placeholder="R$ 20,00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={currentRestaurant.imageUrl || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rating">Avaliação (0-5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={currentRestaurant.rating || ''}
                  onChange={handleInputChange}
                />
              </div>
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
