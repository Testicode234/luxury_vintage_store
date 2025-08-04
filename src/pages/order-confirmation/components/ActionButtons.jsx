import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';


const ActionButtons = ({ orderNumber, onPrintReceipt, onShareOrder }) => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/product-catalog-browse');
  };

  const handleTrackOrder = () => {
    // In a real app, this would navigate to a tracking page
    window.open(`https://tracking.example.com/order/${orderNumber}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          variant="default"
          onClick={handleContinueShopping}
          iconName="ShoppingBag"
          iconPosition="left"
          fullWidth
        >
          Continue Shopping
        </Button>
        <Button
          variant="outline"
          onClick={handleTrackOrder}
          iconName="Package"
          iconPosition="left"
          fullWidth
        >
          Track Order
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrintReceipt}
          iconName="Printer"
          iconPosition="left"
        >
          Print Receipt
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onShareOrder}
          iconName="Share"
          iconPosition="left"
        >
          Share Order
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;