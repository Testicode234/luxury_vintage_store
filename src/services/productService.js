import { supabase } from '../lib/supabase';
import { stripeService } from './stripeService';

export const productService = {
  // Get all products
  async getProducts(filters = {}) {
    if (!supabase) throw new Error('Supabase client not initialized');

    let query = supabase.from('products').select('*').eq('status', 'active');

    if (filters.minPrice) query = query.gte('price', filters.minPrice);
    if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
    if (filters.minRating) query = query.gte('rating', filters.minRating);
    if (filters.search) query = query.ilike('name', `%${filters.search}%`);

    if (filters.sortBy) {
      const sortOptions = {
        'price-low': ['price', true],
        'price-high': ['price', false],
        'rating': ['rating', false],
        'name-asc': ['name', true],
        'name-desc': ['name', false]
      };
      const [column, ascending] = sortOptions[filters.sortBy] || ['created_at', false];
      query = query.order(column, { ascending });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error.message);
      throw new Error(`Error fetching products: ${error.message}`);
    }

    return data || [];
  },

  async getProduct(id) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw new Error(`Error fetching product: ${error.message}`);
    return data;
  },

  async createProduct(product) {
    const productWithId = {
      ...product,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('products').insert([productWithId]).select('*').single();
    if (error) throw new Error(`Error creating product: ${error.message}`);

    try {
      const stripeResult = await stripeService.createStripeProduct(data);
      await supabase.from('products').update({
        stripe_product_id: stripeResult.product.id,
        stripe_price_id: stripeResult.price.id
      }).eq('id', data.id);
    } catch (stripeError) {
      console.error('Stripe sync failed:', stripeError);
    }

    return data;
  },

  async updateProduct(id, updates) {
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('products').update(updatesWithTimestamp).eq('id', id).select('*').single();
    if (error) throw new Error(`Error updating product: ${error.message}`);
    return data;
  },

  async deleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(`Error deleting product: ${error.message}`);
    return true;
  },

  async getCategories() {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw new Error(`Error fetching categories: ${error.message}`);
    return data || [];
  },

  async getBrands() {
    const { data, error } = await supabase.from('brands').select('*').order('name');
    if (error) throw new Error(`Error fetching brands: ${error.message}`);
    return data || [];
  },

  async createCategory(category) {
    const { data, error } = await supabase.from('categories').insert([category]).select().single();
    if (error) throw new Error(`Error creating category: ${error.message}`);
    return data;
  },

  async createBrand(brand) {
    const { data, error } = await supabase.from('brands').insert([brand]).select().single();
    if (error) throw new Error(`Error creating brand: ${error.message}`);
    return data;
  }
};
