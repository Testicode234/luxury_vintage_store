import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Section states
  const [openSections, setOpenSections] = useState({
    shipping: true,
    billing: false,
    payment: false
  });

  // Mock cart data
  const [cartItems] = useState([
    {
      id: 1,
      name: "Apple Watch Series 9",
      variant: "45mm, Midnight Aluminum",
      price: 429.00,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Premium Leather Watch Band",
      variant: "Black, 45mm",
      price: 49.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop"
    }
  ]);

  // Mock saved addresses
  const [savedAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      street: "123 Main Street",
      apartment: "Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "US",
      phone: "(555) 123-4567"
    },
    {
      id: 2,
      name: "John Doe",
      street: "456 Oak Avenue",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      country: "US",
      phone: "(555) 123-4567"
    }
  ]);

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
    phone: ''
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

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Progress steps
  const steps = [
    { id: 'shipping', name: 'Shipping' },
    { id: 'billing', name: 'Billing' },
    { id: 'payment', name: 'Payment' },
    { id: 'review', name: 'Review' }
  ];

  // Calculate totals
  const subtotal = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  const selectedDeliveryOption = deliveryOptions?.find(option => option?.id === selectedDelivery);
  const shipping = selectedDeliveryOption ? selectedDeliveryOption?.price : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax - promoDiscount;

  useEffect(() => {
    // Auto-populate billing if same as shipping
    if (sameAsShipping) {
      setBillingData({
        firstName: shippingData?.firstName,
        lastName: shippingData?.lastName,
        street: shippingData?.street,
        apartment: shippingData?.apartment,
        city: shippingData?.city,
        state: shippingData?.state,
        zipCode: shippingData?.zipCode,
        country: shippingData?.country
      });
    }
  }, [sameAsShipping, shippingData]);

  const handleSectionToggle = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
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

  const handlePaymentChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressSelect = (address) => {
    setShippingData({
      firstName: address?.name?.split(' ')?.[0],
      lastName: address?.name?.split(' ')?.slice(1)?.join(' '),
      street: address?.street,
      apartment: address?.apartment || '',
      city: address?.city,
      state: address?.state,
      zipCode: address?.zipCode,
      country: address?.country,
      phone: address?.phone
    });
  };

  const handleApplyPromo = () => {
    // Mock promo codes
    const promoCodes = {
      'SAVE10': 10,
      'WELCOME20': 20,
      'FIRST15': 15
    };

    if (promoCodes?.[promoCode?.toUpperCase()]) {
      setPromoDiscount(promoCodes?.[promoCode?.toUpperCase()]);
    } else {
      setPromoDiscount(0);
      alert('Invalid promo code');
    }
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Store order data for confirmation page
      const orderData = {
        orderNumber: `WH${Date.now()}`,
        items: cartItems,
        shipping: shippingData,
        billing: sameAsShipping ? shippingData : billingData,
        payment: { method: paymentMethod },
        totals: {
          subtotal,
          shipping,
          tax,
          discount: promoDiscount,
          total
        },
        estimatedDelivery: new Date(Date.now() + (selectedDeliveryOption.id === 'overnight' ? 1 : selectedDeliveryOption.id === 'express' ? 3 : 7) * 24 * 60 * 60 * 1000)
      };
      
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      localStorage.setItem('cartCount', '0'); // Clear cart
      
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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
                isOpen={openSections?.shipping}
                onToggle={() => handleSectionToggle('shipping')}
                shippingData={shippingData}
                onShippingChange={handleShippingChange}
                savedAddresses={savedAddresses}
                onAddressSelect={handleAddressSelect}
                deliveryOptions={deliveryOptions}
                selectedDelivery={selectedDelivery}
                onDeliveryChange={setSelectedDelivery}
              />

              {/* Billing Section */}
              <BillingSection
                isOpen={openSections?.billing}
                onToggle={() => handleSectionToggle('billing')}
                billingData={billingData}
                onBillingChange={handleBillingChange}
                shippingData={shippingData}
                sameAsShipping={sameAsShipping}
                onSameAsShippingChange={setSameAsShipping}
              />

              {/* Payment Section */}
              <PaymentSection
                isOpen={openSections?.payment}
                onToggle={() => handleSectionToggle('payment')}
                paymentData={paymentData}
                onPaymentChange={handlePaymentChange}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
              />
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
              {isProcessing ? 'Processing...' : `Complete Order - $${total?.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutProcess;