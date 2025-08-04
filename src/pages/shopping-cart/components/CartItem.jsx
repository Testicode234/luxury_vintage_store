import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CartItem = ({ item, onUpdateQuantity, onRemoveItem, onSaveForLater }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
    onUpdateQuantity(item?.id, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = () => {
    onRemoveItem(item?.id);
    setShowRemoveConfirm(false);
  };

  const handleSaveForLater = () => {
    onSaveForLater(item?.id);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 transition-smooth">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">
              {item?.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {item?.brand}
            </p>
            {item?.variant && (
              <p className="text-xs text-muted-foreground mt-1">
                {item?.variant}
              </p>
            )}
            <div className="flex items-center justify-between mt-3">
              <span className="text-lg font-semibold text-foreground">
                ${item?.price?.toFixed(2)}
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleQuantityChange(item?.quantity - 1)}
                  disabled={item?.quantity <= 1 || isUpdating}
                  className="w-8 h-8 p-0"
                >
                  <Icon name="Minus" size={14} />
                </Button>
                <span className="text-sm font-medium text-foreground min-w-[2rem] text-center">
                  {isUpdating ? '...' : item?.quantity}
                </span>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleQuantityChange(item?.quantity + 1)}
                  disabled={isUpdating}
                  className="w-8 h-8 p-0"
                >
                  <Icon name="Plus" size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveForLater}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Heart" size={16} className="mr-1" />
              Save for Later
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRemoveConfirm(true)}
            className="text-destructive hover:text-destructive"
          >
            <Icon name="Trash2" size={16} className="mr-1" />
            Remove
          </Button>
        </div>
      </div>
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden">
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-foreground">
              {item?.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {item?.brand}
            </p>
            {item?.variant && (
              <p className="text-sm text-muted-foreground mt-1">
                {item?.variant}
              </p>
            )}
            <div className="flex items-center space-x-4 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveForLater}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="Heart" size={16} className="mr-1" />
                Save for Later
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRemoveConfirm(true)}
                className="text-destructive hover:text-destructive"
              >
                <Icon name="Trash2" size={16} className="mr-1" />
                Remove
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(item?.quantity - 1)}
                disabled={item?.quantity <= 1 || isUpdating}
                className="w-8 h-8 p-0"
              >
                <Icon name="Minus" size={16} />
              </Button>
              <span className="text-sm font-medium text-foreground min-w-[3rem] text-center">
                {isUpdating ? '...' : item?.quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(item?.quantity + 1)}
                disabled={isUpdating}
                className="w-8 h-8 p-0"
              >
                <Icon name="Plus" size={16} />
              </Button>
            </div>
            
            <div className="text-right min-w-[5rem]">
              <span className="text-lg font-semibold text-foreground">
                ${(item?.price * item?.quantity)?.toFixed(2)}
              </span>
              <p className="text-xs text-muted-foreground">
                ${item?.price?.toFixed(2)} each
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-popover border border-border rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <Icon name="Trash2" size={20} className="text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-popover-foreground">
                  Remove Item
                </h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to remove this item from your cart?
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRemoveConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemove}
                className="flex-1"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;