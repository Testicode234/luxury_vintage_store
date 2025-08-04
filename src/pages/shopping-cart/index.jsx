import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import CartItem from './components/CartItem';
import OrderSummary from './components/OrderSummary';
import EmptyCart from './components/EmptyCart';
import SavedItems from './components/SavedItems';
import InventoryAlert from './components/InventoryAlert';
import Icon from '../../components/AppIcon';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [unavailableItems, setUnavailableItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Mock cart data
  const mockCartItems = [
    {
      id: 1,
      name: "Apple Watch Series 9 GPS",
      brand: "Apple",
      variant: "45mm Midnight Aluminum Case",
      price: 429.00,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Premium Cotton Hoodie",
      brand: "WatchHub",
      variant: "Size L, Black",
      price: 89.99,
      quantity: 2,
      image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Tom Ford Oud Wood",
      brand: "Tom Ford",
      variant: "50ml Eau de Parfum",
      price: 295.00,
      quantity: 1,
      image: "https://images.pixabay.com/photo/2020/05/11/06/20/perfume-5156966_1280.jpg?w=400&h=400&fit=crop"
    }
  ];

  const mockSavedItems = [
    {
      id: 4,
      name: "AirPods Pro (2nd generation)",
      brand: "Apple",
      variant: "USB-C",
      price: 249.00,
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop"
    },
    {
      id: 5,
      name: "Rolex Submariner",
      brand: "Rolex",
      variant: "Black Dial, Steel",
      price: 8950.00,
      image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?w=400&h=400&fit=crop"
    }
  ];

  const mockUnavailableItems = [
    {
      id: 6,
      name: "Limited Edition Smartwatch",
      brand: "Samsung",
      status: 'out_of_stock',
      image: "https://images.pixabay.com/photo/2016/12/10/16/57/watch-1897185_1280.jpg?w=400&h=400&fit=crop"
    }
  ];

  useEffect(() => {
    // Simulate loading cart data
    const loadCartData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCartItems(mockCartItems);
      setSavedItems(mockSavedItems);
      setUnavailableItems(mockUnavailableItems);
      setIsLoading(false);
    };

    loadCartData();
  }, []);

  // Update cart count in localStorage
  useEffect(() => {
    const totalItems = cartItems?.reduce((sum, item) => sum + item?.quantity, 0);
    localStorage.setItem('cartCount', totalItems?.toString());
    
    // Trigger header update
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cartItems]);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems(prev => 
      prev?.map(item => 
        item?.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev?.filter(item => item?.id !== itemId));
  };

  const handleSaveForLater = (itemId) => {
    const itemToSave = cartItems?.find(item => item?.id === itemId);
    if (itemToSave) {
      setSavedItems(prev => [...prev, { ...itemToSave, quantity: 1 }]);
      handleRemoveItem(itemId);
    }
  };

  const handleMoveToCart = (itemId) => {
    const itemToMove = savedItems?.find(item => item?.id === itemId);
    if (itemToMove) {
      setCartItems(prev => [...prev, { ...itemToMove, quantity: 1 }]);
      setSavedItems(prev => prev?.filter(item => item?.id !== itemId));
    }
  };

  const handleRemoveSaved = (itemId) => {
    setSavedItems(prev => prev?.filter(item => item?.id !== itemId));
  };

  const handleRemoveUnavailable = (itemId) => {
    if (itemId === 'all') {
      setUnavailableItems([]);
    } else {
      setUnavailableItems(prev => prev?.filter(item => item?.id !== itemId));
    }
  };

  const handleUpdateAvailable = (itemId, availableQuantity) => {
    if (itemId === 'all') {
      unavailableItems?.forEach(item => {
        if (item?.status === 'limited_stock') {
          handleUpdateQuantity(item?.id, item?.availableQuantity);
        }
      });
      setUnavailableItems(prev => prev?.filter(item => item?.status === 'out_of_stock'));
    } else {
      handleUpdateQuantity(itemId, availableQuantity);
      setUnavailableItems(prev => prev?.filter(item => item?.id !== itemId));
    }
  };

  const handleApplyPromoCode = (code) => {
    // Handle promo code application
    console.log('Applied promo code:', code);
  };

  const handleProceedToCheckout = async () => {
    setIsCheckoutLoading(true);
    
    // Simulate checkout preparation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to checkout
    window.location.href = '/checkout-process';
  };

  // Calculate totals
  const subtotal = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - WatchHub</title>
          <meta name="description" content="Review and manage your cart items before checkout" />
        </Helmet>
        
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your cart...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart ({cartItems?.length}) - WatchHub</title>
        <meta name="description" content="Review and manage your cart items before checkout" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Shopping Cart
                </h1>
                {cartItems?.length > 0 && (
                  <p className="text-muted-foreground mt-1">
                    {cartItems?.length} {cartItems?.length === 1 ? 'item' : 'items'} in your cart
                  </p>
                )}
              </div>
              
              {cartItems?.length > 0 && (
                <div className="hidden md:flex items-center space-x-4">
                  <button
                    onClick={() => window.location.href = '/product-catalog-browse'}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    <Icon name="ArrowLeft" size={16} />
                    <span className="text-sm">Continue Shopping</span>
                  </button>
                </div>
              )}
            </div>

            {cartItems?.length === 0 ? (
              <EmptyCart />
            ) : (
              <>
                {/* Inventory Alerts */}
                <InventoryAlert
                  unavailableItems={unavailableItems}
                  onRemoveUnavailable={handleRemoveUnavailable}
                  onUpdateAvailable={handleUpdateAvailable}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Cart Items */}
                  <div className="lg:col-span-2">
                    <div className="space-y-4">
                      {cartItems?.map((item) => (
                        <CartItem
                          key={item?.id}
                          item={item}
                          onUpdateQuantity={handleUpdateQuantity}
                          onRemoveItem={handleRemoveItem}
                          onSaveForLater={handleSaveForLater}
                        />
                      ))}
                    </div>

                    {/* Saved Items */}
                    <SavedItems
                      savedItems={savedItems}
                      onMoveToCart={handleMoveToCart}
                      onRemoveSaved={handleRemoveSaved}
                    />
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-24">
                      <OrderSummary
                        subtotal={subtotal}
                        shipping={shipping}
                        tax={tax}
                        total={total}
                        onApplyPromoCode={handleApplyPromoCode}
                        onProceedToCheckout={handleProceedToCheckout}
                        isLoading={isCheckoutLoading}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ShoppingCart;