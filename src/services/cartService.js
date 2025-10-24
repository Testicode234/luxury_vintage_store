import { supabase } from "../lib/supabase";

class CartService {
  subscribers = [];

  // ✅ Fetch cart items (safe UUID handling)
  async getCartItems(userId = null) {
    try {
      const localCart = this.getCart();
      if (!localCart.length) return [];

      // 🛠 Fix: safely extract UUIDs even if nested in an object
      const productIds = localCart
        .map((item) => {
          const id = item?.productId;
          if (typeof id === "string") return id;
          if (id && typeof id === "object" && id.id) return id.id;
          return null;
        })
        .filter(Boolean);

      if (!productIds.length) return [];

      // ✅ Fetch matching products from Supabase
      const { data: products, error } = await supabase
        .from("products")
        .select("id, name, price, image_url")
        .in("id", productIds);

      if (error) throw error;

      // ✅ Merge local and remote data
      return localCart.map((item) => {
        const actualId =
          typeof item.productId === "string"
            ? item.productId
            : item.productId?.id;

        const product = products.find((p) => p.id === actualId);
        return {
          id: item.id,
          productId: actualId,
          name: product?.name || "Unknown Product",
          price: Number(product?.price) || 0,
          image: product?.image_url || "/assets/images/no_image.png",
          quantity: item.quantity || 1,
        };
      });
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }
  }

  // ✅ Add product to cart
  async addToCart(productId, quantity = 1) {
    try {
      if (!productId) {
        console.warn("⚠️ Skipping addToCart: invalid productId");
        return;
      }

      const cart = this.getCart();
      const existing = cart.find((item) => item.productId === productId);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({
          id: Date.now(),
          productId,
          quantity,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      this.notifySubscribers();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }

  // ✅ Update quantity of cart item
  updateQuantity(itemId, quantity) {
    const cart = this.getCart();
    const updated = cart.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    localStorage.setItem("cart", JSON.stringify(updated));
    this.notifySubscribers();
  }

  // ✅ Remove item
  removeItem(itemId) {
    const cart = this.getCart().filter((item) => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(cart));
    this.notifySubscribers();
  }

  // ✅ Clear all
  clearCart() {
    localStorage.removeItem("cart");
    this.notifySubscribers();
  }

  // ✅ Get subtotal and total item count
  getSubtotal() {
    const cart = this.getCart();
    return cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
  }

  getItemCount() {
    return this.getCart().reduce(
      (total, item) => total + (item.quantity || 1),
      0
    );
  }

  // ---------- Local Helpers ---------- //
  getCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () =>
      (this.subscribers = this.subscribers.filter((cb) => cb !== callback));
  }

  notifySubscribers() {
    const cart = this.getCart();
    this.subscribers.forEach((cb) => cb(cart));
  }
}

export const cartService = new CartService();
