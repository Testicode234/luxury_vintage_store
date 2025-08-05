
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { cartService } from '../../services/cartService';
import { stripeService } from '../../services/stripeService';
import Header from '../../components/ui/Header';
import ShippingSection from './components/ShippingSection';
import BillingSection from './components/BillingSection';
import PaymentSection from './components/PaymentSection';
import OrderSummary from './components/OrderSummary';
import ProgressIndicator from './components/ProgressIndicator';
import GuestCheckoutPrompt from './components/GuestCheckoutPrompt';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CheckoutProcess = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGuest, setIsGuest] = useState(!user);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Section states
  const [openSections, setOpenSections] = useState({
    shipping: true,
    billing: false,
    payment: false
  });

  // Delivery options
  const [deliveryOptions] = useState([
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 0
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 15.99
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day',
      price: 29.99
    }
  ]);

  const [selectedDelivery, setSelectedDelivery] = useState('standard');

  // Form data
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    email: user?.email || ''
  });

  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Progress steps
  const steps = [
    { id: 'shipping', name: 'Shipping' },
    { id: 'billing', name: 'Billing' },
    { id: 'payment', name: 'Payment' },
    { id: 'review', name: 'Review' }
  ];

  // Load cart items from database
  useEffect(() => {
    loadCartItems();
  }, [user]);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const items = await cartService.getCartItems(user?.id);
      setCartItems(items);
      
      if (items.length === 0) {
        navigate('/shopping-cart');
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedDeliveryOption = deliveryOptions.find(option => option.id === selectedDelivery);
  const shipping = selectedDeliveryOption ? selectedDeliveryOption.price : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax - promoDiscount;

  useEffect(() => {
    // Auto-populate billing if same as shipping
    if (sameAsShipping) {
      setBillingData({
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        street: shippingData.street,
        apartment: shippingData.apartment,
        city: shippingData.city,
        state: shippingData.state,
        zipCode: shippingData.zipCode,
        country: shippingData.country
      });
    }
  }, [sameAsShipping, shippingData]);

  const handleSectionToggle = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleShippingChange = (field, value) => {
    setShippingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBillingChange = (field, value) => {
    setBillingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyPromo = () => {
    // Mock promo codes - in real app, verify with backend
    const promoCodes = {
      'SAVE10': 10,
      'WELCOME20': 20,
      'FIRST15': 15
    };

    if (promoCodes[promoCode.toUpperCase()]) {
      setPromoDiscount(promoCodes[promoCode.toUpperCase()]);
    } else {
      setPromoDiscount(0);
      alert('Invalid promo code');
    }
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);

    try {
      // Prepare customer data
      const customerData = {
        email: shippingData.email,
        name: `${shippingData.firstName} ${shippingData.lastName}`,
        phone: shippingData.phone,
        shipping: shippingData,
        billing: sameAsShipping ? shippingData : billingData
      };

      // Create Stripe checkout session
      const { sessionId, url } = await stripeService.createCheckoutSession(
        cartItems,
        customerData
      );

      // Store order data for later retrieval
      const orderData = {
        sessionId,
        items: cartItems,
        shipping: shippingData,
        billing: sameAsShipping ? shippingData : billingData,
        totals: {
          subtotal,
          shipping,
          tax,
          discount: promoDiscount,
          total
        },
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('pendingOrder', JSON.stringify(orderData));

      // Redirect to Stripe checkout
      window.location.href = url;

    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
              <span>Cart</span>
              <Icon name="ChevronRight" size={16} />
              <span className="text-foreground">Checkout</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator currentStep={currentStep} steps={steps} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest Checkout Prompt */}
              <GuestCheckoutPrompt 
                isGuest={isGuest} 
                onToggleGuest={() => setIsGuest(!isGuest)} 
              />

              {/* Shipping Section */}
              <ShippingSection
                isOpen={openSections.shipping}
                onToggle={() => handleSectionToggle('shipping')}
                shippingData={shippingData}
                onShippingChange={handleShippingChange}
                deliveryOptions={deliveryOptions}
                selectedDelivery={selectedDelivery}
                onDeliveryChange={setSelectedDelivery}
              />

              {/* Billing Section */}
              <BillingSection
                isOpen={openSections.billing}
                onToggle={() => handleSectionToggle('billing')}
                billingData={billingData}
                onBillingChange={handleBillingChange}
                shippingData={shippingData}
                sameAsShipping={sameAsShipping}
                onSameAsShippingChange={setSameAsShipping}
              />

              {/* Payment Section - Note: Actual payment handled by Stripe */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Payment</h3>
                </div>
                <p className="text-muted-foreground">
                  You will be redirected to Stripe to complete your payment securely.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderSummary
                  cartItems={cartItems}
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                  onCompleteOrder={handleCompleteOrder}
                  isProcessing={isProcessing}
                  promoCode={promoCode}
                  onPromoCodeChange={setPromoCode}
                  onApplyPromo={handleApplyPromo}
                  promoDiscount={promoDiscount}
                />
              </div>
            </div>
          </div>

          {/* Mobile Complete Order Button */}
          <div className="lg:hidden mt-8">
            <Button
              variant="default"
              fullWidth
              onClick={handleCompleteOrder}
              loading={isProcessing}
              className="py-4"
            >
              {isProcessing ? 'Processing...' : `Complete Order - $${total.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutProcess;
