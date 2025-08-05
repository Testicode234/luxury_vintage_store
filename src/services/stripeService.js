
// Frontend Stripe Service - Real integration
export const stripeService = {
  // Create checkout session with real products
  async createCheckoutSession(cartItems, customerData) {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          customerData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },

  // Create Stripe products via backend
  async createStripeProduct(product) {
    try {
      const response = await fetch('/api/stripe/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Failed to create Stripe product');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Stripe product:', error);
      throw error;
    }
  },

  // Get payment status
  async getPaymentStatus(sessionId) {
    try {
      const response = await fetch(`/api/stripe/payment-status/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get payment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }
};
