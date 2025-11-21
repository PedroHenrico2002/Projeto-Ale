
import React, { useState, useEffect } from 'react';
import { menuItemService, restaurantService, MenuItem, Restaurant } from '@/utils/databaseService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, Utensils, Search, SlidersHorizontal, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export const MenuItemCrud: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<Partial<MenuItem>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRestaurant, setFilterRestaurant] = useState<string | null>(null);
  const [sortType, setSortType] = useState<'none' | 'alphabetical' | 'rating'>('none');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMenuItems();
    setRestaurants(restaurantService.getAll());
  }, []);

  useEffect(() => {
    filterItems();
  }, [menuItems, searchTerm, filterRestaurant, sortType]);

  const loadMenuItems = () => {
    const items = menuItemService.getAll();
    setMenuItems(items);
    setFilteredItems(items);
  };

  const filterItems = () => {
    let items = [...menuItems];
    
    // Apply restaurant filter
    if (filterRestaurant) {
      items = items.filter(item => item.restaurantId === filterRestaurant);
    }
    
    // Apply search term
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortType) {
      case 'alphabetical':
        items = items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        items = items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    
    setFilteredItems(items);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterRestaurant(null);
    setSortType('none');
  };

  const handleOpenDialog = (menuItem?: MenuItem) => {
    if (menuItem) {
      setCurrentMenuItem(menuItem);
      setIsEditing(true);
      setImagePreview(menuItem.imageUrl || null);
    } else {
      setCurrentMenuItem({
        name: '',
        restaurantId: restaurants.length > 0 ? restaurants[0].id : '',
        description: '',
        price: 0,
        category: '',
        rating: 0
      });
      setIsEditing(false);
      setImagePreview(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentMenuItem({});
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentMenuItem({ ...currentMenuItem, [name]: value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setCurrentMenuItem({ ...currentMenuItem, price: value });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setCurrentMenuItem({ ...currentMenuItem, rating: value });
  };

  const handleRestaurantChange = (value: string) => {
    setCurrentMenuItem({ ...currentMenuItem, restaurantId: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, envie uma imagem JPG, PNG ou WebP",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);

    try {
      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload para o Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('menu-items')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('menu-items')
        .getPublicUrl(filePath);

      setCurrentMenuItem({ ...currentMenuItem, imageUrl: publicUrl });
      setImagePreview(publicUrl);

      toast({
        title: "Imagem enviada",
        description: "A imagem foi carregada com sucesso",
      });
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível enviar a imagem",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = () => {
    if (!currentMenuItem.name || !currentMenuItem.restaurantId || currentMenuItem.price === undefined) {
      toast({
        title: "Erro de validação",
        description: "Nome, restaurante e preço são obrigatórios",
        variant: "destructive",
      });
      return false;
    }
    if (currentMenuItem.price < 0) {
      toast({
        title: "Erro de validação",
        description: "O preço não pode ser negativo",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    if (isEditing && currentMenuItem.id) {
      menuItemService.update(currentMenuItem.id, currentMenuItem);
      toast({
        title: "Item atualizado",
        description: "As informações do item foram atualizadas com sucesso",
      });
    } else {
      menuItemService.create(currentMenuItem as Omit<MenuItem, 'id'>);
      toast({
        title: "Item criado",
        description: "Novo item foi criado com sucesso",
      });
    }
    
    handleCloseDialog();
    loadMenuItems();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      menuItemService.remove(id);
      toast({
        title: "Item excluído",
        description: "O item foi removido com sucesso",
      });
      loadMenuItems();
    }
  };

  const getRestaurantName = (restaurantId: string) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Restaurante não encontrado';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gerenciamento de Itens do Cardápio</h3>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={16} className="mr-2" />
          Novo Item
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar itens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <SlidersHorizontal size={16} />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrar por restaurante</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onSelect={() => setFilterRestaurant(null)}>
                Todos os restaurantes
              </DropdownMenuItem>
              {restaurants.map(restaurant => (
                <DropdownMenuItem 
                  key={restaurant.id} 
                  className="cursor-pointer"
                  onSelect={() => setFilterRestaurant(restaurant.id)}
                >
                  {restaurant.name}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer"
                onSelect={() => setSortType('none')}
              >
                Padrão
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onSelect={() => setSortType('alphabetical')}
              >
                Ordem alfabética
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onSelect={() => setSortType('rating')}
              >
                Mais avaliados
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {(searchTerm || filterRestaurant || sortType !== 'none') && (
            <Button variant="ghost" onClick={clearFilters}>
              <X size={16} className="mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Restaurante</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((menuItem) => (
                <TableRow key={menuItem.id}>
                  <TableCell>{menuItem.name}</TableCell>
                  <TableCell>{getRestaurantName(menuItem.restaurantId)}</TableCell>
                  <TableCell>{menuItem.category || '-'}</TableCell>
                  <TableCell>{formatPrice(menuItem.price)}</TableCell>
                  <TableCell>{menuItem.rating ? `${menuItem.rating}/5` : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenDialog(menuItem)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(menuItem.id)}>
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
                    <Utensils size={24} />
                    <p>Nenhum item de cardápio encontrado</p>
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
            <DialogTitle>{isEditing ? 'Editar Item' : 'Novo Item'}</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do item do cardápio
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentMenuItem.name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="restaurantId">Restaurante</Label>
                <Select 
                  onValueChange={handleRestaurantChange} 
                  defaultValue={currentMenuItem.restaurantId}
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
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  name="category"
                  value={currentMenuItem.category || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: Entrada, Prato Principal, Sobremesa"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentMenuItem.price || ''}
                  onChange={handlePriceChange}
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
                  value={currentMenuItem.rating || ''}
                  onChange={handleRatingChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentMenuItem.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Imagem do Prato</Label>
                <div className="space-y-2">
                  {imagePreview && (
                    <div className="relative w-full h-40 rounded-md overflow-hidden border">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <>Enviando...</>
                      ) : (
                        <>
                          <Upload size={16} className="mr-2" />
                          {imagePreview ? 'Trocar Imagem' : 'Enviar Imagem'}
                        </>
                      )}
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG ou WebP (máx. 5MB)
                  </p>
                </div>
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
