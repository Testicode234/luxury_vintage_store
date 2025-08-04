import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  categories, 
  activeFilters, 
  onFilterToggle,
  priceRange,
  onPriceRangeChange,
  brands,
  activeBrands,
  onBrandToggle,
  ratings,
  activeRating,
  onRatingChange
}) => {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const handlePriceChange = (type, value) => {
    const newRange = { ...localPriceRange, [type]: parseInt(value) };
    setLocalPriceRange(newRange);
    onPriceRangeChange(newRange);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-16 lg:top-20 left-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]
        w-80 bg-card border-r border-border z-50 lg:z-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-muted-foreground
      `}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-card-foreground">Filters</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-medium text-card-foreground">Categories</h3>
            <div className="space-y-3">
              {categories?.map((category) => (
                <div key={category?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={category?.name}
                    checked={activeFilters?.includes(category?.id)}
                    onChange={() => onFilterToggle(category?.id)}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground ml-2">
                    ({category?.count})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="font-medium text-card-foreground">Price Range</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm text-muted-foreground mb-1">Min</label>
                  <input
                    type="number"
                    value={localPriceRange?.min}
                    onChange={(e) => handlePriceChange('min', e?.target?.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-muted-foreground mb-1">Max</label>
                  <input
                    type="number"
                    value={localPriceRange?.max}
                    onChange={(e) => handlePriceChange('max', e?.target?.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="10000"
                  />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatPrice(localPriceRange?.min)} - {formatPrice(localPriceRange?.max)}
              </div>
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-4">
            <h3 className="font-medium text-card-foreground">Brands</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {brands?.map((brand) => (
                <div key={brand?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={brand?.name}
                    checked={activeBrands?.includes(brand?.id)}
                    onChange={() => onBrandToggle(brand?.id)}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground ml-2">
                    ({brand?.count})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-4">
            <h3 className="font-medium text-card-foreground">Customer Rating</h3>
            <div className="space-y-3">
              {ratings?.map((rating) => (
                <div key={rating?.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`rating-${rating?.value}`}
                    name="rating"
                    checked={activeRating === rating?.value}
                    onChange={() => onRatingChange(rating?.value)}
                    className="w-4 h-4 text-accent bg-input border-border focus:ring-accent focus:ring-2"
                  />
                  <label 
                    htmlFor={`rating-${rating?.value}`}
                    className="flex items-center space-x-2 cursor-pointer flex-1"
                  >
                    <div className="flex items-center">
                      {[...Array(5)]?.map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={14}
                          className={`${
                            i < rating?.value 
                              ? 'text-warning fill-current' :'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-card-foreground">& Up</span>
                    <span className="text-sm text-muted-foreground">
                      ({rating?.count})
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            onClick={() => {
              onFilterToggle(null, true); // Clear all categories
              onPriceRangeChange({ min: 0, max: 10000 });
              onBrandToggle(null, true); // Clear all brands
              onRatingChange(null);
            }}
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Clear All Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;