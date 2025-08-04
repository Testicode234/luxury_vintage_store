import React from 'react';
import Icon from '../../../components/AppIcon';

const CustomerInfo = ({ shippingAddress, billingAddress, paymentMethod }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Shipping Address */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Truck" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Shipping Address</h3>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="text-foreground font-medium">{shippingAddress?.name}</p>
          <p>{shippingAddress?.street}</p>
          <p>{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode}</p>
          <p>{shippingAddress?.country}</p>
          {shippingAddress?.phone && <p className="pt-2">{shippingAddress?.phone}</p>}
        </div>
      </div>
      {/* Billing & Payment */}
      <div className="space-y-6">
        {/* Billing Address */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="FileText" size={20} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Billing Address</h3>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="text-foreground font-medium">{billingAddress?.name}</p>
            <p>{billingAddress?.street}</p>
            <p>{billingAddress?.city}, {billingAddress?.state} {billingAddress?.zipCode}</p>
            <p>{billingAddress?.country}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="CreditCard" size={20} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Payment Method</h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-6 bg-accent rounded flex items-center justify-center">
              <Icon name="CreditCard" size={16} className="text-accent-foreground" />
            </div>
            <div className="text-sm">
              <p className="text-foreground font-medium">{paymentMethod?.type}</p>
              <p className="text-muted-foreground">•••• •••• •••• {paymentMethod?.last4}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;