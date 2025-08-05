
// Stripe Product Sync Service
class StripeService {
  constructor() {
    this.stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    this.baseURL = 'https://api.stripe.com/v1';
  }

  async createStripeProduct(product) {
    try {
      // Create product in Stripe
      const productResponse = await fetch(`${this.baseURL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          name: product.name,
          description: product.description || '',
          images: product.images ? [product.images[0]] : [],
          metadata: JSON.stringify({
            product_id: product.id,
            category: product.category,
            brand: product.brand
          })
        })
      });

      if (!productResponse.ok) {
        throw new Error(`Stripe product creation failed: ${productResponse.statusText}`);
      }

      const stripeProduct = await productResponse.json();

      // Create price for the product
      const priceResponse = await fetch(`${this.baseURL}/prices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          product: stripeProduct.id,
          unit_amount: Math.round(product.price * 100), // Convert to cents
          currency: 'usd'
        })
      });

      if (!priceResponse.ok) {
        throw new Error(`Stripe price creation failed: ${priceResponse.statusText}`);
      }

      const stripePrice = await priceResponse.json();

      return {
        product: stripeProduct,
        price: stripePrice
      };
    } catch (error) {
      console.error('Error creating Stripe product:', error);
      throw error;
    }
  }

  async updateStripeProduct(stripeProductId, product) {
    try {
      const response = await fetch(`${this.baseURL}/products/${stripeProductId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          name: product.name,
          description: product.description || '',
          images: product.images ? [product.images[0]] : [],
          metadata: JSON.stringify({
            product_id: product.id,
            category: product.category,
            brand: product.brand
          })
        })
      });

      if (!response.ok) {
        throw new Error(`Stripe product update failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating Stripe product:', error);
      throw error;
    }
  }

  async updateStripePrice(stripePriceId, newPrice) {
    try {
      // Stripe prices are immutable, so we need to create a new one and archive the old
      const response = await fetch(`${this.baseURL}/prices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          product: stripePriceId.split('_')[0], // Extract product ID
          unit_amount: Math.round(newPrice * 100),
          currency: 'usd'
        })
      });

      if (!response.ok) {
        throw new Error(`Stripe price update failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating Stripe price:', error);
      throw error;
    }
  }

  async deleteStripeProduct(stripeProductId) {
    try {
      const response = await fetch(`${this.baseURL}/products/${stripeProductId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.stripeSecretKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Stripe product deletion failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting Stripe product:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();
