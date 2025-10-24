import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "../../components/ui/Header";
import CartItem from "./components/CartItem";
import OrderSummary from "./components/OrderSummary";
import EmptyCart from "./components/EmptyCart";
import SavedItems from "./components/SavedItems";
import InventoryAlert from "./components/InventoryAlert";
import Icon from "../../components/AppIcon";
import { cartService } from "../../services/cartService";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [unavailableItems, setUnavailableItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCartData = async () => {
      try {
        if (isMounted) setIsLoading(true);

        // ✅ Get cart items (local or from Supabase)
        const enrichedCart = await cartService.getCartItems();
        if (isMounted) setCartItems(enrichedCart);

        // ✅ Load saved-for-later items
        const savedItemsData = localStorage.getItem("savedItems");
        if (isMounted && savedItemsData) {
          setSavedItems(JSON.parse(savedItemsData));
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
        if (isMounted) setCartItems([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadCartData();

    // ✅ Subscribe to cart changes (for real-time updates)
    const unsubscribe = cartService.subscribe(() => loadCartData());

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // ---------- CART HANDLERS ---------- //

  const handleUpdateQuantity = (itemId, newQuantity) => {
    cartService.updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    cartService.removeItem(itemId);
  };

  const handleSaveForLater = (itemId) => {
    const itemToSave = cartItems.find((item) => item.id === itemId);
    if (itemToSave) {
      const currentSaved = JSON.parse(
        localStorage.getItem("savedItems") || "[]"
      );
      const updatedSaved = [...currentSaved, { ...itemToSave, quantity: 1 }];
      localStorage.setItem("savedItems", JSON.stringify(updatedSaved));
      setSavedItems(updatedSaved);
      handleRemoveItem(itemId);
    }
  };

  const handleMoveToCart = (itemId) => {
    const itemToMove = savedItems.find((item) => item.id === itemId);
    if (itemToMove) {
      cartService.addToCart(itemToMove.productId, 1);
      const updatedSaved = savedItems.filter((item) => item.id !== itemId);
      localStorage.setItem("savedItems", JSON.stringify(updatedSaved));
      setSavedItems(updatedSaved);
    }
  };

  const handleRemoveSaved = (itemId) => {
    const updatedSaved = savedItems.filter((item) => item.id !== itemId);
    localStorage.setItem("savedItems", JSON.stringify(updatedSaved));
    setSavedItems(updatedSaved);
  };

  // ---------- INVENTORY HANDLERS ---------- //

  const handleRemoveUnavailable = (itemId) => {
    if (itemId === "all") {
      setUnavailableItems([]);
    } else {
      setUnavailableItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  const handleUpdateAvailable = (itemId, availableQuantity) => {
    if (itemId === "all") {
      unavailableItems.forEach((item) => {
        if (item.status === "limited_stock") {
          handleUpdateQuantity(item.id, item.availableQuantity);
        }
      });
      setUnavailableItems((prev) =>
        prev.filter((item) => item.status === "out_of_stock")
      );
    } else {
      handleUpdateQuantity(itemId, availableQuantity);
      setUnavailableItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  // ---------- CHECKOUT ---------- //

  const handleApplyPromoCode = (code) => {
    console.log("Applied promo code:", code);
  };

  const handleProceedToCheckout = () => {
    setIsCheckoutLoading(true);
    setTimeout(() => {
      window.location.href = "/checkout-process";
      setIsCheckoutLoading(false);
    }, 500);
  };

  // ---------- CALCULATIONS ---------- //

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // ---------- UI ---------- //

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - WatchHub</title>
          <meta
            name="description"
            content="Review and manage your cart items before checkout"
          />
        </Helmet>

        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-20 pb-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your cart...</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  const pageTitle = `Shopping Cart (${cartItems.length}) - WatchHub`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Review and manage your cart items before checkout"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Shopping Cart
                </h1>
                {cartItems.length > 0 && (
                  <p className="text-muted-foreground mt-1">
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "item" : "items"} in your cart
                  </p>
                )}
              </div>

              {cartItems.length > 0 && (
                <button
                  onClick={() =>
                    (window.location.href = "/product-catalog-browse")
                  }
                  className="hidden md:flex items-center space-x-2 text-muted-foreground hover:text-foreground transition"
                >
                  <Icon name="ArrowLeft" size={16} />
                  <span className="text-sm">Continue Shopping</span>
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <EmptyCart />
            ) : (
              <>
                <InventoryAlert
                  unavailableItems={unavailableItems}
                  onRemoveUnavailable={handleRemoveUnavailable}
                  onUpdateAvailable={handleUpdateAvailable}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={{
                          ...item,
                          image:
                            item.image_url ||
                            item.image ||
                            "/assets/images/no_image.png",
                        }}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        onSaveForLater={handleSaveForLater}
                      />
                    ))}

                    <SavedItems
                      savedItems={savedItems}
                      onMoveToCart={handleMoveToCart}
                      onRemoveSaved={handleRemoveSaved}
                    />
                  </div>

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
