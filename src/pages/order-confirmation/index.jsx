
import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../contexts/AuthContext';
import { stripeService } from '../../services/stripeService';
import { cartService } from '../../services/cartService';
import Header from '../../components/ui/Header';
import OrderHeader from './components/OrderHeader';
import OrderSummary from './components/OrderSummary';
import CustomerInfo from './components/CustomerInfo';
import OrderTracking from './components/OrderTracking';
import EmailConfirmation from './components/EmailConfirmation';
import ActionButtons from './components/ActionButtons';
import AccountCreationPrompt from './components/AccountCreationPrompt';
import RelatedProducts from './components/RelatedProducts';

const OrderConfirmation = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrderData();
  }, [searchParams]);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      const sessionId = searchParams.get('session_id');
      
      if (sessionId) {
        // Get payment data from Stripe
        const paymentData = await stripeService.getPaymentStatus(sessionId);
        
        if (paymentData.payment_status === 'paid') {
          // Get pending order data from localStorage
          const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder') || '{}');
          
          // Create order record
          const orderData = {
            orderNumber: `WH-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
            orderDate: new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric' 
            }),
            trackingNumber: `1Z${Math.random().toString(36).substr(2, 15).toUpperCase()}`,
            email: paymentData.customer_details?.email,
            stripeSessionId: sessionId,
            paymentStatus: paymentData.payment_status,
            items: pendingOrder.items || [],
            subtotal: pendingOrder.totals?.subtotal || 0,
            shipping: pendingOrder.totals?.shipping || 0,
            tax: pendingOrder.totals?.tax || 0,
            total: paymentData.amount_total / 100, // Stripe returns in cents
            shippingAddress: {
              name: paymentData.customer_details?.name || `${pendingOrder.shipping?.firstName} ${pendingOrder.shipping?.lastName}`,
              street: pendingOrder.shipping?.street || paymentData.customer_details?.address?.line1,
              city: pendingOrder.shipping?.city || paymentData.customer_details?.address?.city,
              state: pendingOrder.shipping?.state || paymentData.customer_details?.address?.state,
              zipCode: pendingOrder.shipping?.zipCode || paymentData.customer_details?.address?.postal_code,
              country: pendingOrder.shipping?.country || paymentData.customer_details?.address?.country,
              phone: pendingOrder.shipping?.phone || paymentData.customer_details?.phone
            },
            billingAddress: pendingOrder.billing || pendingOrder.shipping,
            paymentMethod: {
              type: paymentData.payment_method_types?.[0] || 'card',
              last4: '****' // Stripe doesn't return this in session
            },
            trackingSteps: [
              {
                id: 1,
                title: "Order Confirmed",
                description: "Your order has been received and is being processed",
                status: "completed",
                date: new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })
              },
              {
                id: 2,
                title: "Payment Processed",
                description: "Payment has been successfully processed",
                status: "completed",
                date: new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })
              },
              {
                id: 3,
                title: "Preparing for Shipment",
                description: "Your items are being prepared and packaged",
                status: "active",
                estimatedDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })
              },
              {
                id: 4,
                title: "Shipped",
                description: "Your order is on its way",
                status: "pending",
                estimatedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })
              },
              {
                id: 5,
                title: "Out for Delivery",
                description: "Your order is out for delivery",
                status: "pending",
                estimatedDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })
              },
              {
                id: 6,
                title: "Delivered",
                description: "Your order has been delivered",
                status: "pending",
                estimatedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })
              }
            ]
          };

          setOrderData(orderData);
          
          // Clear cart and pending order
          await cartService.clearCart(user?.id);
          localStorage.removeItem('pendingOrder');
          localStorage.setItem('cartCount', '0');
          
        } else {
          setError('Payment was not completed successfully.');
        }
      } else {
        // Check for stored order data (fallback)
        const storedOrder = localStorage.getItem('lastOrder');
        if (storedOrder) {
          setOrderData(JSON.parse(storedOrder));
        } else {
          setError('No order information found.');
        }
      }
    } catch (error) {
      console.error('Error loading order data:', error);
      setError('Failed to load order information.');
    } finally {
      setLoading(false);
    }
  };

  const relatedProducts = [
    {
      id: 101,
      name: "Premium Watch Case",
      brand: "WatchHub",
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop"
    },
    {
      id: 102,
      name: "Wireless Charger",
      brand: "TechHub",
      price: 89.00,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop"
    },
    {
      id: 103,
      name: "Screen Protector",
      brand: "GuardTech",
      price: 19.99,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop"
    }
  ];

  const handleResendEmail = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Email resent successfully');
        resolve();
      }, 1000);
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My WatchHub Order',
        text: `I just ordered from WatchHub! Order #${orderData?.orderNumber}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Order link copied to clipboard!');
    }
  };

  const handleCreateAccount = async (accountData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('isAuthenticated', 'true');
        console.log('Account created:', accountData);
        resolve();
      }, 1500);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 lg:pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 lg:pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <a href="/shopping-cart" className="text-accent hover:underline">
              Return to Cart
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmation - WatchHub</title>
        <meta name="description" content="Your order has been confirmed. Thank you for shopping with WatchHub." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16 lg:pt-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
            {/* Order Header */}
            <OrderHeader
              orderNumber={orderData?.orderNumber}
              orderDate={orderData?.orderDate}
              estimatedDelivery={orderData?.estimatedDelivery}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Left Column - Order Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Order Tracking */}
                <OrderTracking
                  currentStatus="preparing"
                  trackingNumber={orderData?.trackingNumber}
                  estimatedSteps={orderData?.trackingSteps}
                />

                {/* Customer Information */}
                <CustomerInfo
                  shippingAddress={orderData?.shippingAddress}
                  billingAddress={orderData?.billingAddress}
                  paymentMethod={orderData?.paymentMethod}
                />

                {/* Email Confirmation */}
                <EmailConfirmation
                  email={orderData?.email}
                  onResendEmail={handleResendEmail}
                />
              </div>

              {/* Right Column - Order Summary & Actions */}
              <div className="space-y-6">
                {/* Order Summary */}
                <OrderSummary
                  items={orderData?.items}
                  subtotal={orderData?.subtotal}
                  shipping={orderData?.shipping}
                  tax={orderData?.tax}
                  total={orderData?.total}
                />

                {/* Action Buttons */}
                <ActionButtons
                  orderNumber={orderData?.orderNumber}
                  onPrintReceipt={handlePrintReceipt}
                  onShareOrder={handleShareOrder}
                />
              </div>
            </div>

            {/* Account Creation Prompt (for guest users) */}
            {!isAuthenticated && (
              <div className="mb-8">
                <AccountCreationPrompt
                  email={orderData?.email}
                  orderNumber={orderData?.orderNumber}
                  onCreateAccount={handleCreateAccount}
                />
              </div>
            )}

            {/* Related Products */}
            <RelatedProducts products={relatedProducts} />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-8">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} WatchHub. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                Help Center
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                Return Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default OrderConfirmation;
