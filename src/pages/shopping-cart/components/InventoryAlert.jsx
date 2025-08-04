import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InventoryAlert = ({ unavailableItems, onRemoveUnavailable, onUpdateAvailable }) => {
  if (!unavailableItems || unavailableItems?.length === 0) {
    return null;
  }

  return (
    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Inventory Update Required
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Some items in your cart are no longer available or have limited stock.
          </p>
          
          <div className="space-y-3">
            {unavailableItems?.map((item) => (
              <div key={item?.id} className="flex items-center justify-between bg-background/50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                    <img
                      src={item?.image}
                      alt={item?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item?.status === 'out_of_stock' ?'Out of stock' 
                        : `Only ${item?.availableQuantity} left`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item?.status === 'limited_stock' && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => onUpdateAvailable(item?.id, item?.availableQuantity)}
                      className="text-xs"
                    >
                      Update to {item?.availableQuantity}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onRemoveUnavailable(item?.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemoveUnavailable('all')}
              className="text-xs"
            >
              Remove All Unavailable
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateAvailable('all')}
              className="text-xs"
            >
              Update All Available
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAlert;