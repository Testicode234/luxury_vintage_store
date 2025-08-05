import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Checkbox from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const FilterSidebar = ({
  categories = [],
  brands = [],
  filters = {},
  onFiltersChange = () => {},
  onClearFilters = () => {},
  className = ""
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true,
    rating: true,
    features: true
  });

  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  });

  useEffect(() => {
    setLocalFilters(filters);
    setPriceRange({
      min: filters.minPrice || '',
      max: filters.maxPrice || ''
    });
  }, [filters]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId, checked) => {
    const updatedCategories = checked
      ? [...(localFilters.categories || []), categoryId]
      : (localFilters.categories || []).filter(id => id !== categoryId);

    const newFilters = { ...localFilters, categories: updatedCategories };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleBrandChange = (brandId, checked) => {
    const updatedBrands = checked
      ? [...(localFilters.brands || []), brandId]
      : (localFilters.brands || []).filter(id => id !== brandId);

    const newFilters = { ...localFilters, brands: updatedBrands };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = () => {
    const newFilters = {
      ...localFilters,
      minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRatingChange = (rating, checked) => {
    const newFilters = { ...localFilters, minRating: checked ? rating : undefined };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFeatureChange = (feature, checked) => {
    const updatedFeatures = checked
      ? [...(localFilters.features || []), feature]
      : (localFilters.features || []).filter(f => f !== feature);

    const newFilters = { ...localFilters, features: updatedFeatures };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.categories?.length) count += localFilters.categories.length;
    if (localFilters.brands?.length) count += localFilters.brands.length;
    if (localFilters.minPrice || localFilters.maxPrice) count += 1;
    if (localFilters.minRating) count += 1;
    if (localFilters.features?.length) count += localFilters.features.length;
    return count;
  };

  const renderSection = (title, sectionKey, content) => (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-medium text-foreground hover:text-accent transition-colors"
      >
        <span>{title}</span>
        <Icon
          name={expandedSections[sectionKey] ? "ChevronUp" : "ChevronDown"}
          size={16}
        />
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-3 space-y-2">
          {content}
        </div>
      )}
    </div>
  );

  const sidebarContent = (
    <div className={`bg-card border border-border rounded-lg p-4 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        {getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear All ({getActiveFiltersCount()})
          </Button>
        )}
      </div>

      {/* Categories */}
      {renderSection("Categories", "category", (
        <div className="space-y-2">
          {categories.map((category) => (
            <Checkbox
              key={category.id}
              id={`category-${category.id}`}
              label={category.name}
              checked={(localFilters.categories || []).includes(category.id)}
              onChange={(checked) => handleCategoryChange(category.id, checked)}
            />
          ))}
        </div>
      ))}

      {/* Brands */}
      {renderSection("Brands", "brand", (
        <div className="space-y-2">
          {brands.map((brand) => (
            <Checkbox
              key={brand.id}
              id={`brand-${brand.id}`}
              label={brand.name}
              checked={(localFilters.brands || []).includes(brand.id)}
              onChange={(checked) => handleBrandChange(brand.id, checked)}
            />
          ))}
        </div>
      ))}

      {/* Price Range */}
      {renderSection("Price Range", "price", (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Min</label>
              <Input
                type="number"
                placeholder="$0"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                onBlur={handlePriceChange}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Max</label>
              <Input
                type="number"
                placeholder="$999+"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                onBlur={handlePriceChange}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Rating */}
      {renderSection("Customer Rating", "rating", (
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <Checkbox
              key={rating}
              id={`rating-${rating}`}
              label={
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={12}
                      className={i < rating ? "text-warning fill-current" : "text-muted-foreground"}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">& Up</span>
                </div>
              }
              checked={localFilters.minRating === rating}
              onChange={(checked) => handleRatingChange(rating, checked)}
            />
          ))}
        </div>
      ))}

      {/* Features */}
      {renderSection("Features", "features", (
        <div className="space-y-2">
          {[
            'Water Resistant',
            'GPS',
            'Heart Rate Monitor',
            'Sleep Tracking',
            'Wireless Charging',
            'Always-On Display',
            'Cellular',
            'ECG'
          ].map((feature) => (
            <Checkbox
              key={feature}
              id={`feature-${feature.replace(/\s+/g, '-').toLowerCase()}`}
              label={feature}
              checked={(localFilters.features || []).includes(feature)}
              onChange={(checked) => handleFeatureChange(feature, checked)}
            />
          ))}
        </div>
      ))}
    </div>
  );

  return sidebarContent;
};

export default FilterSidebar;