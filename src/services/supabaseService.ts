import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type RestaurantInsert = Database['public']['Tables']['restaurants']['Insert'];
type RestaurantUpdate = Database['public']['Tables']['restaurants']['Update'];

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];
type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update'];

type Address = Database['public']['Tables']['addresses']['Row'];
type AddressInsert = Database['public']['Tables']['addresses']['Insert'];
type AddressUpdate = Database['public']['Tables']['addresses']['Update'];

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Categories
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(category: CategoryInsert) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, category: CategoryUpdate) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Restaurants
export const restaurantService = {
  async getAll() {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        categories(name, icon),
        addresses!restaurants_address_id_fkey(*)
      `)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        categories(name, icon),
        addresses!restaurants_address_id_fkey(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(restaurant: RestaurantInsert) {
    const { data, error } = await supabase
      .from('restaurants')
      .insert(restaurant)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, restaurant: RestaurantUpdate) {
    const { data, error } = await supabase
      .from('restaurants')
      .update(restaurant)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Menu Items
export const menuItemService = {
  async getAll() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getByRestaurantId(restaurantId: string) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(menuItem: MenuItemInsert) {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(menuItem)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, menuItem: MenuItemUpdate) {
    const { data, error } = await supabase
      .from('menu_items')
      .update(menuItem)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Addresses
export const addressService = {
  async getAll() {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .order('created_at');
    
    if (error) throw error;
    return data || [];
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(address: AddressInsert) {
    const { data, error } = await supabase
      .from('addresses')
      .insert(address)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, address: AddressUpdate) {
    const { data, error } = await supabase
      .from('addresses')
      .update(address)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Orders
export const orderService = {
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        restaurants(name, image_url),
        addresses(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        restaurants(name, image_url),
        addresses(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        restaurants(name, image_url),
        addresses(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(order: OrderInsert) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, order: OrderUpdate) {
    const { data, error } = await supabase
      .from('orders')
      .update(order)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Profiles
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, profile: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};