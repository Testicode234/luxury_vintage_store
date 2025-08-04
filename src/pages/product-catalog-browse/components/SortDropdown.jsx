import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SortDropdown = ({ sortBy, onSortChange, resultsCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'relevance', label: 'Best Match', icon: 'Target' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'ArrowUp' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'ArrowDown' },
    { value: 'newest', label: 'Newest First', icon: 'Clock' },
    { value: 'rating', label: 'Customer Rating', icon: 'Star' },
    { value: 'name-asc', label: 'Name: A to Z', icon: 'ArrowUp' },
    { value: 'name-desc', label: 'Name: Z to A', icon: 'ArrowDown' }
  ];

  const currentSort = sortOptions?.find(option => option?.value === sortBy) || sortOptions?.[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  const formatResultsCount = (count) => {
    return new Intl.NumberFormat('en-US')?.format(count);
  };

  return (
    <div className="flex items-center justify-between space-x-4">
      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {formatResultsCount(resultsCount)} {resultsCount === 1 ? 'result' : 'results'}
      </div>
      {/* Sort Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 min-w-[180px] justify-between"
        >
          <div className="flex items-center space-x-2">
            <Icon name={currentSort?.icon} size={16} />
            <span className="text-sm">Sort: {currentSort?.label}</span>
          </div>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-pronounced z-50 animate-slide-in">
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
                Sort Options
              </div>
              {sortOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleSortSelect(option?.value)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm transition-colors duration-150 ${
                    sortBy === option?.value
                      ? 'bg-accent text-accent-foreground'
                      : 'text-popover-foreground hover:bg-muted'
                  }`}
                >
                  <Icon 
                    name={option?.icon} 
                    size={16} 
                    className={sortBy === option?.value ? 'text-accent-foreground' : 'text-muted-foreground'}
                  />
                  <span className="flex-1 text-left">{option?.label}</span>
                  {sortBy === option?.value && (
                    <Icon name="Check" size={16} className="text-accent-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortDropdown;