import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderHeader = ({ orderNumber, orderDate, estimatedDelivery }) => {
  return (
    <div className="text-center py-8 lg:py-12">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-success rounded-full flex items-center justify-center">
          <Icon name="Check" size={32} className="text-success-foreground lg:w-10 lg:h-10" />
        </div>
      </div>

      {/* Success Message */}
      <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">
        Order Confirmed!
      </h1>
      <p className="text-muted-foreground mb-6 lg:mb-8">
        Thank you for your purchase. Your order has been successfully placed.
      </p>

      {/* Order Details */}
      <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Order Number</span>
            <span className="text-sm font-medium text-foreground">{orderNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Order Date</span>
            <span className="text-sm font-medium text-foreground">{orderDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Estimated Delivery</span>
            <span className="text-sm font-medium text-success">{estimatedDelivery}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;