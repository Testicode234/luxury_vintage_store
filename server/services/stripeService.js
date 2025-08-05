
// Stripe Product Sync Service - Backend Only
class StripeService {
  constructor() {
    this.stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    this.baseURL = 'https://api.stripe.com/v1';
    
    if (!this.stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
    }
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

async createCheckoutSession(items, customerData) {
    try {
      const lineItems = items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.variant || item.description,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

      const response = await fetch(`${this.baseURL}/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'success_url': `${process.env.CLIENT_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
          'cancel_url': `${process.env.CLIENT_URL}/shopping-cart`,
          'payment_method_types[0]': 'card',
          'mode': 'payment',
          'customer_email': customerData.email,
          ...lineItems.reduce((acc, item, index) => {
            Object.keys(item).forEach(key => {
              if (typeof item[key] === 'object' && item[key] !== null) {
                Object.keys(item[key]).forEach(subKey => {
                  if (typeof item[key][subKey] === 'object' && item[key][subKey] !== null) {
                    Object.keys(item[key][subKey]).forEach(subSubKey => {
                      acc[`line_items[${index}][${key}][${subKey}][${subSubKey}]`] = item[key][subKey][subSubKey];
                    });
                  } else {
                    acc[`line_items[${index}][${key}][${subKey}]`] = item[key][subKey];
                  }
                });
              } else {
                acc[`line_items[${index}][${key}]`] = item[key];
              }
            });
            return acc;
          }, {})
        })
      });

      if (!response.ok) {
        throw new Error(`Stripe checkout session creation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async getPaymentStatus(sessionId) {
    try {
      const response = await fetch(`${this.baseURL}/checkout/sessions/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.stripeSecretKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }
}

module.exports = new StripeService();
