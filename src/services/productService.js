import { supabase } from '../lib/supabase';

export const productService = {
  // Get all products with brands and categories
  async getProducts(filters = {}) {
    let query = supabase?.from('products')?.select(`
        *,
        brand:brands(id, name, slug),
        category:categories(id, name, slug, icon)
      `)?.eq('status', 'active');

    // Apply filters
    if (filters?.category) {
      query = query?.eq('category.slug', filters?.category);
    }
    
    if (filters?.brand) {
      query = query?.eq('brand.slug', filters?.brand);
    }
    
    if (filters?.minPrice) {
      query = query?.gte('price', filters?.minPrice);
    }
    
    if (filters?.maxPrice) {
      query = query?.lte('price', filters?.maxPrice);
    }
    
    if (filters?.minRating) {
      query = query?.gte('rating', filters?.minRating);
    }
    
    if (filters?.search) {
      query = query?.or(`name.ilike.%${filters?.search}%,brand.name.ilike.%${filters?.search}%`);
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters?.sortBy) {
        case 'price-low':
          query = query?.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query?.order('price', { ascending: false });
          break;
        case 'rating':
          query = query?.order('rating', { ascending: false });
          break;
        case 'name-asc':
          query = query?.order('name', { ascending: true });
          break;
        case 'name-desc':
          query = query?.order('name', { ascending: false });
          break;
        default:
          query = query?.order('created_at', { ascending: false });
          break;
      }
    }

    const { data, error } = await query;
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
  },

  // Get single product by ID
  async getProduct(id) {
    const { data, error } = await supabase?.from('products')?.select(`
        *,
        brand:brands(id, name, slug),
        category:categories(id, name, slug, icon)
      `)?.eq('id', id)?.single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Admin: Create product
  async createProduct(product) {
    const { data, error } = await supabase?.from('products')?.insert([product])?.select(`
        *,
        brand:brands(id, name, slug),
        category:categories(id, name, slug, icon)
      `)?.single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Admin: Update product
  async updateProduct(id, updates) {
    const { data, error } = await supabase?.from('products')?.update(updates)?.eq('id', id)?.select(`
        *,
        brand:brands(id, name, slug),
        category:categories(id, name, slug, icon)
      `)?.single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Admin: Delete product
  async deleteProduct(id) {
    const { error } = await supabase?.from('products')?.delete()?.eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  },

  // Get categories
  async getCategories() {
    const { data, error } = await supabase?.from('categories')?.select('*')?.order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  // Get brands
  async getBrands() {
    const { data, error } = await supabase?.from('brands')?.select('*')?.order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  // Admin: Create category
  async createCategory(category) {
    const { data, error } = await supabase?.from('categories')?.insert([category])?.select()?.single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Admin: Create brand
  async createBrand(brand) {
    const { data, error } = await supabase?.from('brands')?.insert([brand])?.select()?.single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
};