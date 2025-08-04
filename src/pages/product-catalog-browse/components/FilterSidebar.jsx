import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Input } from '../../../components/ui/Input'; // Assuming you have an Input component

const FilterSidebar = ({
  isOpen,
  onClose,
  isMobile = false,
  categories = [],
  activeFilters = [],
  onFilterToggle,
  priceRange = { min: 0, max: 10000 },
  onPriceRangeChange,
  brands = [],
  activeBrands = [],
  onBrandToggle,
  ratings = [],
  activeRating,
  onRatingChange,
}) => {
  const [localPrice, setLocalPrice] = useState(priceRange);

  useEffect(() => {
    setLocalPrice(priceRange);
  }, [priceRange]);

  const handlePriceChange = (field, value) => {
    const parsed = parseFloat(value) || 0;
    const updated = { ...localPrice, [field]: parsed };
    setLocalPrice(updated);
    onPriceRangeChange(updated);
  };

  const handleClearAll = () => {
    onFilterToggle(null, true); // Clear all categories
    onPriceRangeChange({ min: 0, max: 10000 });
    onBrandToggle(null, true); // Clear all brands
    onRatingChange(null);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);

  const sidebarContent = (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        )}
      </div>

      {/* Clear All */}
      {(activeFilters.length > 0 || activeBrands.length > 0 || activeRating) && (
        <Button
          variant="outline"
          onClick={handleClearAll}
          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Icon name="RotateCcw" size={16} className="mr-2" />
          Clear All Filters
        </Button>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Categories</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <Checkbox
                  label={category.name}
                  checked={activeFilters.includes(category.id)}
                  onChange={() => onFilterToggle(category.id)}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground ml-2">
                  ({category.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Price Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Min</label>
            <Input
              type="number"
              value={localPrice.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Max</label>
            <Input
              type="number"
              value={localPrice.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              placeholder="10000"
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatPrice(localPrice.min)} - {formatPrice(localPrice.max)}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Brands</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between">
                <Checkbox
                  label={brand.name}
                  checked={activeBrands.includes(brand.id)}
                  onChange={() => onBrandToggle(brand.id)}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground ml-2">
                  ({brand.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ratings */}
      {ratings.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Customer Rating</h3>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <div key={rating.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`rating-${rating.value}`}
                  name="rating"
                  checked={activeRating === rating.value}
                  onChange={() => onRatingChange(rating.value)}
                  className="w-4 h-4 text-accent bg-input border-border focus:ring-accent focus:ring-2"
                />
                <label
                  htmlFor={`rating-${rating.value}`}
                  className="flex-1 text-sm text-foreground cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={14}
                        className={`${
                          i < rating.value ? 'text-warning fill-current' : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                    <span>& Up</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({rating.count})</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 overflow-y-auto">
              {sidebarContent}
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop view
  return (
    <div
      className={`fixed lg:sticky top-16 lg:top-20 left-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] w-80 bg-card border-r border-border z-50 lg:z-0 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } overflow-y-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-muted-foreground`}
    >
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;
