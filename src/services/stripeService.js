
// Frontend Stripe API Client - Calls backend endpoints
class StripeAPIClient {
  constructor() {
    this.baseURL = 'http://localhost:5000/api/stripe';
  }

  async createStripeProduct(product) {
    try {
      const response = await fetch(`${this.baseURL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create Stripe product');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Stripe product:', error);
      throw error;
    }
  }

  async updateStripeProduct(stripeProductId, product) {
    try {
      const response = await fetch(`${this.baseURL}/products/${stripeProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update Stripe product');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating Stripe product:', error);
      throw error;
    }
  }

  async updateStripePrice(stripePriceId, price) {
    try {
      const response = await fetch(`${this.baseURL}/prices/${stripePriceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ price })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update Stripe price');
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
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete Stripe product');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting Stripe product:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeAPIClient();
