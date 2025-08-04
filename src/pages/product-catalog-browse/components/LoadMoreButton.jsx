import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LoadMoreButton = ({ 
  onLoadMore, 
  loading, 
  hasMore, 
  currentCount, 
  totalCount 
}) => {
  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center space-x-2 text-muted-foreground">
          <Icon name="CheckCircle" size={20} />
          <span className="text-sm">
            You've seen all {totalCount?.toLocaleString()} products
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8 space-y-4">
      <div className="text-sm text-muted-foreground">
        Showing {currentCount?.toLocaleString()} of {totalCount?.toLocaleString()} products
      </div>
      <Button
        variant="outline"
        onClick={onLoadMore}
        loading={loading}
        className="min-w-[200px]"
      >
        {loading ? (
          <>
            <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
            Loading more...
          </>
        ) : (
          <>
            <Icon name="Plus" size={16} className="mr-2" />
            Load More Products
          </>
        )}
      </Button>
      {/* Progress indicator */}
      <div className="w-full max-w-xs mx-auto">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentCount / totalCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadMoreButton;