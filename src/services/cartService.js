
class CartService {
  constructor() {
    this.cart = this.getCartFromStorage();
    this.listeners = [];
  }

  getCartFromStorage() {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.notifyListeners();
    this.updateCartCount();
  }

  updateCartCount() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('cartCount', totalItems.toString());
    window.dispatchEvent(new Event('cartUpdated'));
  }

  addToCart(product, quantity = 1) {
    const existingIndex = this.cart.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand?.name || 'Unknown',
        price: product.price,
        image: product.image_url,
        quantity,
        variant: product.variant || ''
      });
    }
    
    this.saveCartToStorage();
    return this.cart;
  }

  updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      return this.removeItem(itemId);
    }
    
    const itemIndex = this.cart.findIndex(item => item.id === itemId);
    if (itemIndex >= 0) {
      this.cart[itemIndex].quantity = newQuantity;
      this.saveCartToStorage();
    }
    return this.cart;
  }

  removeItem(itemId) {
    this.cart = this.cart.filter(item => item.id !== itemId);
    this.saveCartToStorage();
    return this.cart;
  }

  getCart() {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    this.saveCartToStorage();
    return this.cart;
  }

  getSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.cart));
  }
}

// Export a singleton instance
export const cartService = new CartService();

