import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const OrderSummary = ({ 
  cartItems, 
  subtotal, 
  shipping, 
  tax, 
  total, 
  onCompleteOrder, 
  isProcessing,
  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  promoDiscount 
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Order Summary</h3>
      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cartItems?.map((item) => (
          <div key={item?.id} className="flex items-center space-x-4">
            <div className="relative">
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {item?.quantity}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item?.name}</p>
              <p className="text-xs text-muted-foreground">{item?.variant}</p>
            </div>
            <p className="text-sm font-medium text-foreground">
              ${(item?.price * item?.quantity)?.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      {/* Promo Code */}
      <div className="mb-6 pb-6 border-b border-border">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e?.target?.value)}
            className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
          />
          <Button
            variant="outline"
            onClick={onApplyPromo}
            className="px-4"
          >
            Apply
          </Button>
        </div>
      </div>
      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">${subtotal?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground">
            {shipping === 0 ? 'Free' : `$${shipping?.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span className="text-foreground">${tax?.toFixed(2)}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-success">Promo Discount</span>
            <span className="text-success">-${promoDiscount?.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t border-border pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-lg font-semibold text-foreground">${total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {/* Complete Order Button */}
      <Button
        variant="default"
        fullWidth
        onClick={onCompleteOrder}
        loading={isProcessing}
        className="mb-4"
      >
        {isProcessing ? 'Processing...' : `Complete Order - $${total?.toFixed(2)}`}
      </Button>
      {/* Security Badges */}
      <div className="flex items-center justify-center space-x-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-xs text-muted-foreground">SSL Secure</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Lock" size={16} className="text-success" />
          <span className="text-xs text-muted-foreground">256-bit Encryption</span>
        </div>
      </div>
      {/* Payment Methods */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center mb-2">We accept</p>
        <div className="flex items-center justify-center space-x-3">
          <Icon name="CreditCard" size={20} className="text-muted-foreground" />
          <Icon name="Wallet" size={20} className="text-muted-foreground" />
          <Icon name="Smartphone" size={20} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;