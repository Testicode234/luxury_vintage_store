import React from 'react';
import ProductCard from './ProductCard';
import Icon from '../../../components/AppIcon';


const ProductGrid = ({ products, loading, onWishlistToggle }) => {
  // Loading skeleton component
  const ProductSkeleton = () => (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted"></div>
      <div className="p-4 space-y-3">
        <div className="h-3 bg-muted rounded w-1/3"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
        <div className="h-5 bg-muted rounded w-1/4"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(12)]?.map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
        <p className="text-muted-foreground max-w-md">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {products?.map((product) => (
        <ProductCard
          key={product?.id}
          product={product}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
};

export default ProductGrid;