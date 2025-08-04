import React from 'react';

import Button from '../../../components/ui/Button';

const StickyAddToCart = ({ 
  product, 
  selectedSize, 
  selectedColor, 
  quantity, 
  onQuantityChange,
  onAddToCart,
  isAddingToCart
}) => {
  if (!isVisible) return null;

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 md:hidden">
      <div className="flex items-center space-x-4">
        {/* Product Info */}
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-12 h-12 bg-card rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={product?.images?.[0]}
              alt={product?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground text-sm truncate">
              {product?.name}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-foreground">
                ${product?.price?.toFixed(2)}
              </span>
              {quantity > 1 && (
                <span className="text-sm text-muted-foreground">
                  × {quantity}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product?.stock === 0 || isAddingToCart}
          loading={isAddingToCart}
          iconName="ShoppingCart"
          iconPosition="left"
          className="flex-shrink-0"
        >
          {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
      {/* Selected Options */}
      {(selectedSize || selectedColor) && (
        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
          {selectedSize && (
            <span>Size: {selectedSize}</span>
          )}
          {selectedColor && (
            <span>Color: {selectedColor?.name}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StickyAddToCart;