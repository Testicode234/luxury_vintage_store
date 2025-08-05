
const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripeService');

// Create Stripe product
router.post('/products', async (req, res) => {
  try {
    const product = req.body;
    
    if (!product.name || !product.price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const result = await stripeService.createStripeProduct(product);
    res.json(result);
  } catch (error) {
    console.error('Error creating Stripe product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update Stripe product
router.put('/products/:stripeProductId', async (req, res) => {
  try {
    const { stripeProductId } = req.params;
    const product = req.body;

    const result = await stripeService.updateStripeProduct(stripeProductId, product);
    res.json(result);
  } catch (error) {
    console.error('Error updating Stripe product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update Stripe price
router.put('/prices/:stripePriceId', async (req, res) => {
  try {
    const { stripePriceId } = req.params;
    const { price } = req.body;

    if (!price) {
      return res.status(400).json({ error: 'Price is required' });
    }

    const result = await stripeService.updateStripePrice(stripePriceId, price);
    res.json(result);
  } catch (error) {
    console.error('Error updating Stripe price:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete Stripe product
router.delete('/products/:stripeProductId', async (req, res) => {
  try {
    const { stripeProductId } = req.params;

    const result = await stripeService.deleteStripeProduct(stripeProductId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting Stripe product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, customerData } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart items are required' });
    }

    const session = await stripeService.createCheckoutSession(items, customerData);
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get payment status
router.get('/payment-status/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripeService.getPaymentStatus(sessionId);
    res.json(session);
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
