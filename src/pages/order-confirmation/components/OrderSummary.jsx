import React from 'react';
import Image from '../../../components/AppImage';

const OrderSummary = ({ items, subtotal, shipping, tax, total }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Order Summary</h2>
      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {items?.map((item) => (
          <div key={item?.id} className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground truncate">
                {item?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item?.variant && `${item?.variant} • `}Qty: {item?.quantity}
              </p>
            </div>
            <div className="text-sm font-medium text-foreground">
              ${item?.price?.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      {/* Order Totals */}
      <div className="border-t border-border pt-4 space-y-2">
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
        <div className="border-t border-border pt-2 flex justify-between font-semibold">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">${total?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;