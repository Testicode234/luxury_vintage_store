import React from "react";
import Image from "../../../components/AppImage";

const OrderSummary = ({ cartItems, subtotal, total }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Order Summary
      </h3>
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
              <p className="text-sm font-medium text-foreground truncate">
                {item?.name}
              </p>
              <p className="text-xs text-muted-foreground">{item?.variant}</p>
            </div>
            <p className="text-sm font-medium text-foreground">
              ${(item?.price * item?.quantity)?.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">${subtotal?.toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-lg font-semibold text-foreground">
              ${total?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
