
import { supabase } from '../lib/supabase';

class CartService {
  async getCartItems(userId = null) {
    try {
      if (userId) {
        // Get cart for logged-in user
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            *,
            products (
              id,
              name,
              price,
              original_price,
              image_url,
              description,
              brand:brands(name),
              category:categories(name)
            )
          `)
          .eq('user_id', userId);

        if (error) throw error;
        return this.transformCartItems(data);
      } else {
        // Get cart from localStorage for guest users
        const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
        return cartData;
      }
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  async addToCart(productId, quantity = 1, userId = null) {
    try {
      if (userId) {
        // Add to database cart
        const { data, error } = await supabase
          .from('cart_items')
          .upsert({
            user_id: userId,
            product_id: productId,
            quantity: quantity
          }, {
            onConflict: 'user_id,product_id'
          });

        if (error) throw error;
        return data;
      } else {
        // Add to localStorage cart
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.push({ productId, quantity });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async updateCartItem(itemId, quantity, userId = null) {
    try {
      if (userId) {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId)
          .eq('user_id', userId);

        if (error) throw error;
        return data;
      } else {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const item = cart.find(item => item.id === itemId);
        if (item) {
          item.quantity = quantity;
          localStorage.setItem('cart', JSON.stringify(cart));
        }
        return cart;
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  async removeFromCart(itemId, userId = null) {
    try {
      if (userId) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async clearCart(userId = null) {
    try {
      if (userId) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  transformCartItems(cartItems) {
    return cartItems.map(item => ({
      id: item.id,
      productId: item.product_id,
      name: item.products.name,
      price: item.products.price,
      originalPrice: item.products.original_price,
      image: item.products.image_url,
      quantity: item.quantity,
      variant: item.variant,
      brand: item.products.brand?.name,
      category: item.products.category?.name
    }));
  }
}

export const cartService = new CartService();
