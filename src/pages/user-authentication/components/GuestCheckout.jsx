import React from 'react';
import Button from '../../../components/ui/Button';


const GuestCheckout = ({ onGuestCheckout }) => {
  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium text-foreground">
          Continue as Guest
        </h3>
        
        <p className="text-sm text-muted-foreground">
          You can checkout without creating an account. You'll have the option to create one after your purchase.
        </p>
        
        <Button
          variant="outline"
          onClick={onGuestCheckout}
          className="w-full border-border hover:bg-muted"
          iconName="ShoppingCart"
          iconPosition="left"
        >
          Continue to Checkout
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Creating an account helps you track orders and save preferences
        </p>
      </div>
    </div>
  );
};

export default GuestCheckout;