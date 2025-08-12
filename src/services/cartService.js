import { supabase } from '../lib/supabase';

class CartService {
  subscribers = [];

  // ---------- PUBLIC METHODS ---------- //

  async getCartItems(userId = null) {
    try {
      if (userId) {
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
              description
            )
          `)
          .eq('user_id', userId);

        if (error) throw error;
        return this.transformCartItems(data);
      } else {
        const rawCart = this.getCart();
        return await this.mergeWithProductData(rawCart);
      }
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  async addToCart(productId, quantity = 1, userId = null) {
    try {
      if (userId) {
        const { error } = await supabase
          .from('cart_items')
          .upsert(
            { user_id: userId, product_id: productId, quantity },
            { onConflict: 'user_id,product_id' }
          );

        if (error) throw error;
      } else {
        const cart = this.getCart();
        const existing = cart.find(item => item.productId === productId);

        if (existing) {
          existing.quantity += quantity;
        } else {
          cart.push({
            id: Date.now(), // temporary ID
            productId,
            quantity
          });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.notifySubscribers();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async updateCartItem(itemId, quantity, userId = null) {
    try {
      if (userId) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const cart = this.getCart();
        const updated = cart.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updated));
        this.notifySubscribers();
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
        const cart = this.getCart();
        const updated = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updated));
        this.notifySubscribers();
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
        this.notifySubscribers();
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  updateQuantity(itemId, newQuantity) {
    const cart = this.getCart();
    const updated = cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updated));
    this.notifySubscribers();
  }

  removeItem(itemId) {
    const cart = this.getCart();
    const updated = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updated));
    this.notifySubscribers();
  }

  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  getSubtotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => {
      return total + ((item.price || 0) * (item.quantity || 1));
    }, 0);
  }

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

  // ---------- PRIVATE HELPERS ---------- //

  transformCartItems(cartItems) {
    return cartItems.map(item => ({
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      variant: item.variant || null,
      name: item.products?.name || 'Unknown Product',
      price: item.products?.price || 0,
      originalPrice: item.products?.original_price || null,
      image: item.products?.image_url || '/assets/images/no_image.png',
      description: item.products?.description || '',
    }));
  }

  async mergeWithProductData(localItems) {
    const productIds = localItems.map(item => item.productId);
    if (productIds.length === 0) return [];

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, original_price, image_url, description')
      .in('id', productIds);

    if (error) {
      console.error('Error fetching product data:', error);
      return localItems;
    }

    const productMap = {};
    products.forEach(p => {
      productMap[p.id] = p;
    });

    return localItems.map(item => {
      const product = productMap[item.productId] || {};
      return {
        ...item,
        name: product.name || 'Unknown Product',
        price: product.price || 0,
        originalPrice: product.original_price || null,
        image: product.image_url || '/assets/images/no_image.png',
        description: product.description || '',
      };
    });
  }
}

export const cartService = new CartService();
