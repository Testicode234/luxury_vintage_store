import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);

    // Mock order data - in real app, this would come from URL params or API
    const mockOrderData = {
      orderNumber: "WH-2025-001247",
      orderDate: "January 4, 2025",
      estimatedDelivery: "January 8-10, 2025",
      trackingNumber: "1Z999AA1234567890",
      email: "john.doe@example.com",
      items: [
        {
          id: 1,
          name: "Apple Watch Series 9 GPS + Cellular 45mm",
          variant: "Midnight Aluminum",
          quantity: 1,
          price: 499.00,
          image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop"
        },
        {
          id: 2,
          name: "Premium Leather Watch Band",
          variant: "Black Leather",
          quantity: 1,
          price: 79.00,
          image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop"
        }
      ],
      subtotal: 578.00,
      shipping: 0,
      tax: 46.24,
      total: 624.24,
      shippingAddress: {
        name: "John Doe",
        street: "123 Main Street, Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
        phone: "+1 (555) 123-4567"
      },
      billingAddress: {
        name: "John Doe",
        street: "123 Main Street, Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States"
      },
      paymentMethod: {
        type: "Visa",
        last4: "4242"
      },
      trackingSteps: [
        {
          id: 1,
          title: "Order Confirmed",
          description: "Your order has been received and is being processed",
          status: "completed",
          date: "Jan 4, 2:30 PM"
        },
        {
          id: 2,
          title: "Payment Processed",
          description: "Payment has been successfully processed",
          status: "completed",
          date: "Jan 4, 2:31 PM"
        },
        {
          id: 3,
          title: "Preparing for Shipment",
          description: "Your items are being prepared and packaged",
          status: "active",
          estimatedDate: "Jan 5, 10:00 AM"
        },
        {
          id: 4,
          title: "Shipped",
          description: "Your order is on its way",
          status: "pending",
          estimatedDate: "Jan 6, 12:00 PM"
        },
        {
          id: 5,
          title: "Out for Delivery",
          description: "Your order is out for delivery",
          status: "pending",
          estimatedDate: "Jan 8, 9:00 AM"
        },
        {
          id: 6,
          title: "Delivered",
          description: "Your order has been delivered",
          status: "pending",
          estimatedDate: "Jan 8, 5:00 PM"
        }
      ]
    };

    setOrderData(mockOrderData);
  }, []);

  const relatedProducts = [
    {
      id: 101,
      name: "AirPods Pro (2nd Generation)",
      brand: "Apple",
      price: 249.00,
      originalPrice: 279.00,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop"
    },
    {
      id: 102,
      name: "Premium Wireless Charger",
      brand: "WatchHub",
      price: 89.00,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop"
    },
    {
      id: 103,
      name: "Smartwatch Screen Protector",
      brand: "TechGuard",
      price: 19.99,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop"
    },
    {
      id: 104,
      name: "Bluetooth Fitness Tracker",
      brand: "FitTech",
      price: 129.00,
      originalPrice: 159.00,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop"
    }
  ];

  const handleResendEmail = async () => {
    // Mock email resend functionality
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Email resent successfully');
        resolve();
      }, 1000);
    });
  };

  const handlePrintReceipt = () => {
    // Mock print functionality
    window.print();
  };

  const handleShareOrder = () => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: 'My WatchHub Order',
        text: `I just ordered from WatchHub! Order #${orderData?.orderNumber}`,
        url: window.location?.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard?.writeText(window.location?.href);
      alert('Order link copied to clipboard!');
    }
  };

  const handleCreateAccount = async (accountData) => {
    // Mock account creation
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('isAuthenticated', 'true');
        console.log('Account created:', accountData);
        resolve();
      }, 1500);
    });
  };

  if (!orderData) {
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
              © {new Date()?.getFullYear()} WatchHub. All rights reserved.
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