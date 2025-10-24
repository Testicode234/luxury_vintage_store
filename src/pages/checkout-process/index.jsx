import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { cartService } from "../../services/cartService";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import OrderSummary from "./components/OrderSummary";

const CheckoutProcess = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form data (minimal)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
  });

  // Load cart items
  useEffect(() => {
    loadCartItems();
  }, [user]);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const items = await cartService.getCartItems(user?.id);
      setCartItems(items);
      if (items.length === 0) navigate("/shopping-cart");
    } catch (error) {
      console.error("Error loading cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCompleteOrder = async () => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.address.trim() ||
      !formData.phone.trim()
    ) {
      alert("Please fill in all fields before continuing.");
      return;
    }

    setIsProcessing(true);

    try {
      // You can send this info to your backend or payment service here
      const orderData = {
        name: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        phone: formData.phone,
        cartItems,
        total: subtotal,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("pendingOrder", JSON.stringify(orderData));

      alert("Order placed successfully!");
      navigate("/order-success");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Something went wrong. Please try again.");
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
              <span>Cart</span>
              <Icon name="ChevronRight" size={16} />
              <span className="text-foreground">Checkout</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          </div>

          {/* Minimal Form */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="border border-border bg-transparent rounded-md p-3 w-full"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border border-border bg-transparent rounded-md p-3 w-full"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>

            <div className="mt-4">
              <input
                type="text"
                placeholder="Full Address"
                className="border border-border bg-transparent rounded-md p-3 w-full"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            <div className="mt-4">
              <input
                type="tel"
                placeholder="Phone Number"
                className="border border-border bg-transparent rounded-md p-3 w-full"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card border border-border rounded-lg p-6">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              total={subtotal}
            />

            <Button
              variant="default"
              fullWidth
              onClick={handleCompleteOrder}
              loading={isProcessing}
              className="mt-6 py-4"
            >
              {isProcessing
                ? "Processing..."
                : `Complete Order - $${subtotal.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutProcess;
