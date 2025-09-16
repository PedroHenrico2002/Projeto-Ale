import { supabase } from '@/integrations/supabase/client';

export type PaymentMethodType = 'credit' | 'debit' | 'pix' | 'cash';

export type PaymentMethodRow = {
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

export type PaymentMethodInsert = {
  user_id: string;
  type: PaymentMethodType;
  card_number?: string;
  card_name?: string;
  expiry_date?: string;
  is_default?: boolean;
};

export type PaymentMethodUpdate = {
  type?: PaymentMethodType;
  card_number?: string;
  card_name?: string;
  expiry_date?: string;
  is_default?: boolean;
};

export const paymentService = {
  // Buscar todos os métodos de pagamento do usuário
  async getByUserId(userId: string): Promise<PaymentMethodRow[]> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as PaymentMethodRow[];
  },

  // Buscar método de pagamento por ID
  async getById(id: string): Promise<PaymentMethodRow | null> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as PaymentMethodRow | null;
  },

  // Criar novo método de pagamento
  async create(paymentMethod: PaymentMethodInsert): Promise<PaymentMethodRow> {
    // Se este for marcado como padrão, remover o padrão dos outros
    if (paymentMethod.is_default) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', paymentMethod.user_id);
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .insert(paymentMethod)
      .select()
      .single();

    if (error) throw error;
    return data as PaymentMethodRow;
  },

  // Atualizar método de pagamento
  async update(id: string, paymentMethod: PaymentMethodUpdate): Promise<PaymentMethodRow> {
    // Se este for marcado como padrão, remover o padrão dos outros
    if (paymentMethod.is_default) {
      const currentMethod = await this.getById(id);
      if (currentMethod) {
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', currentMethod.user_id);
      }
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .update(paymentMethod)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as PaymentMethodRow;
  },

  // Deletar método de pagamento
  async remove(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Definir como padrão
  async setDefault(id: string, userId: string): Promise<PaymentMethodRow> {
    // Primeiro remove o padrão de todos os outros
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);

    // Depois define este como padrão
    const { data, error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as PaymentMethodRow;
  }
};