import { supabase } from '@/integrations/supabase/client';

export type UserFavoriteRow = {
  id: string;
  user_id: string;
  restaurant_id: string;
  created_at: string;
};

export type UserFavoriteInsert = {
  user_id: string;
  restaurant_id: string;
};

export const favoritesService = {
  // Buscar todos os favoritos do usuário com detalhes do restaurante
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        id,
        restaurant_id,
        created_at,
        restaurants (
          id,
          name,
          description,
          cuisine,
          rating,
          delivery_time,
          delivery_fee,
          min_order,
          image_url,
          is_open
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Verificar se um restaurante está nos favoritos
  async isFavorite(userId: string, restaurantId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  // Adicionar aos favoritos
  async addFavorite(favorite: UserFavoriteInsert): Promise<UserFavoriteRow> {
    const { data, error } = await supabase
      .from('user_favorites')
      .insert(favorite)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remover dos favoritos
  async removeFavorite(userId: string, restaurantId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId);

    if (error) throw error;
    return true;
  },

  // Toggle favorito (adiciona se não existe, remove se existe)
  async toggleFavorite(userId: string, restaurantId: string): Promise<boolean> {
    const isFav = await this.isFavorite(userId, restaurantId);
    
    if (isFav) {
      await this.removeFavorite(userId, restaurantId);
      return false;
    } else {
      await this.addFavorite({ user_id: userId, restaurant_id: restaurantId });
      return true;
    }
  }
};