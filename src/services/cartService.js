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
        // Add to localStorage cart - need to get product data first
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          // For guest users, we need to store minimal product info
          // This will be expanded when we fetch product details
          cart.push({ 
            id: Date.now(), // temporary ID for cart item
            productId, 
            quantity,
            // These will be populated when product details are fetched
            name: 'Loading...',
            price: 0,
            image: '/assets/images/no_image.png'
          });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.notifySubscribers();
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

  // Get cart items (alias for getCartItems for compatibility)
  getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  // Get total item count in cart
  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  // Get subtotal of all items in cart
  getSubtotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  }

  // Update quantity of a specific item
  updateQuantity(itemId, newQuantity) {
    const cart = this.getCart();
    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    this.notifySubscribers();
  }

  // Remove specific item from cart
  removeItem(itemId) {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    this.notifySubscribers();
  }

  // Subscription management for cart updates
  subscribers = [];

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notifySubscribers() {
    const cart = this.getCart();
    this.subscribers.forEach(callback => callback(cart));
  }
}

export const cartService = new CartService();