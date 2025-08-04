import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ categories, activeFilters, onFilterToggle, onClearAll }) => {
  const hasActiveFilters = activeFilters?.length > 0;

  return (
    <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide pb-2">
      {/* Clear All Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="flex-shrink-0 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Icon name="X" size={14} className="mr-1" />
          Clear All
        </Button>
      )}
      {/* Category Filter Chips */}
      {categories?.map((category) => {
        const isActive = activeFilters?.includes(category?.id);
        
        return (
          <Button
            key={category?.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterToggle(category?.id)}
            className={`flex-shrink-0 transition-all duration-200 ${
              isActive 
                ? 'bg-accent text-accent-foreground border-accent' 
                : 'border-border text-foreground hover:border-accent hover:text-accent'
            }`}
          >
            <Icon name={category?.icon} size={14} className="mr-2" />
            {category?.name}
            {category?.count > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                isActive 
                  ? 'bg-accent-foreground text-accent' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {category?.count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default FilterChips;