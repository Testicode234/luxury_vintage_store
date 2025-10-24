import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

const OrderSummary = ({
  subtotal,
  shipping,
  tax,
  total,
  onApplyPromoCode,
  onProceedToCheckout,
  isLoading = false,
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode?.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    setIsApplyingPromo(true);
    setPromoError("");
    setPromoSuccess("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock promo code validation
    const validCodes = ["SAVE10", "WELCOME20", "FIRST15"];
    if (validCodes?.includes(promoCode?.toUpperCase())) {
      setPromoSuccess(
        `Promo code "${promoCode?.toUpperCase()}" applied successfully!`
      );
      onApplyPromoCode(promoCode?.toUpperCase());
    } else {
      setPromoError("Invalid promo code. Please try again.");
    }

    setIsApplyingPromo(false);
  };

  const handleKeyPress = (e) => {
    if (e?.key === "Enter") {
      handleApplyPromo();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Order Summary
      </h2>
      {/* Promo Code Section */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e?.target?.value)}
              onKeyPress={handleKeyPress}
              disabled={isApplyingPromo}
              className="text-sm"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleApplyPromo}
            disabled={isApplyingPromo || !promoCode?.trim()}
            loading={isApplyingPromo}
            className="px-4"
          >
            Apply
          </Button>
        </div>

        {promoError && (
          <div className="flex items-center space-x-2 mt-2">
            <Icon name="AlertCircle" size={16} className="text-destructive" />
            <p className="text-sm text-destructive">{promoError}</p>
          </div>
        )}

        {promoSuccess && (
          <div className="flex items-center space-x-2 mt-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <p className="text-sm text-success">{promoSuccess}</p>
          </div>
        )}
      </div>
      {/* Order Breakdown */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span className="text-sm font-medium text-foreground">
            ${subtotal?.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground">Shipping</span>
            <Icon name="Info" size={14} className="text-muted-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">
            {shipping === 0 ? "Free" : `$${shipping?.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Tax</span>
          <span className="text-sm font-medium text-foreground">
            ${tax?.toFixed(2)}
          </span>
        </div>

        <hr className="border-border" />

        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-foreground">Total</span>
          <span className="text-xl font-bold text-foreground">
            ${total?.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          onClick={onProceedToCheckout}
          disabled={isLoading}
          loading={isLoading}
          fullWidth
          className="h-12 text-base font-semibold"
        >
          Proceed to Checkout
        </Button>

        <Button
          variant="outline"
          onClick={() => (window.location.href = "/product-catalog-browse")}
          fullWidth
          className="h-10"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
