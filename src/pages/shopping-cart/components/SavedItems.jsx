import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SavedItems = ({ savedItems, onMoveToCart, onRemoveSaved }) => {
  const [movingItems, setMovingItems] = useState(new Set());

  const handleMoveToCart = async (itemId) => {
    setMovingItems(prev => new Set([...prev, itemId]));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onMoveToCart(itemId);
    setMovingItems(prev => {
      const newSet = new Set(prev);
      newSet?.delete(itemId);
      return newSet;
    });
  };

  if (!savedItems || savedItems?.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Saved for Later ({savedItems?.length})
        </h2>
        <Icon name="Heart" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {savedItems?.map((item) => (
          <div
            key={item?.id}
            className="bg-card border border-border rounded-lg p-4 transition-smooth"
          >
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-lg overflow-hidden">
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
                  <span className="text-base font-semibold text-foreground">
                    ${item?.price?.toFixed(2)}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveToCart(item?.id)}
                      disabled={movingItems?.has(item?.id)}
                      loading={movingItems?.has(item?.id)}
                      className="text-xs"
                    >
                      <Icon name="ShoppingCart" size={14} className="mr-1" />
                      Move to Cart
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveSaved(item?.id)}
                      className="text-destructive hover:text-destructive text-xs"
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedItems;