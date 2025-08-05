import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, onWishlistToggle }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(product?.isWishlisted || false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleProductClick = () => {
    navigate(`/product-detail/${product?.id}`);
  };

  const handleWishlistClick = (e) => {
    e?.stopPropagation();
    const newWishlistState = !isWishlisted;
    setIsWishlisted(newWishlistState);
    onWishlistToggle(product?.id, newWishlistState);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  const getDiscountPercentage = () => {
    if (product?.originalPrice && product?.price < product?.originalPrice) {
      return Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100);
    }
    return 0;
  };

  return (
    <div 
      className="group bg-card border border-border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/10"
      onClick={handleProductClick}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {imageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <Icon name="Image" size={32} className="text-muted-foreground" />
          </div>
        )}
        
        <Image
          src={product?.image}
          alt={product?.name}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setImageLoading(false)}
        />

        {/* Discount Badge */}
        {getDiscountPercentage() > 0 && (
          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-medium">
            -{getDiscountPercentage()}%
          </div>
        )}

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-200"
          onClick={handleWishlistClick}
        >
          <Icon 
            name={isWishlisted ? "Heart" : "Heart"} 
            size={18} 
            className={`transition-colors duration-200 ${
              isWishlisted ? 'text-destructive fill-current' : 'text-muted-foreground hover:text-destructive'
            }`}
          />
        </Button>

        {/* Stock Status */}
        {product?.stock <= 5 && product?.stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-warning text-warning-foreground px-2 py-1 rounded-md text-xs font-medium">
            Only {product?.stock} left
          </div>
        )}

        {product?.stock === 0 && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-muted text-muted-foreground px-3 py-1 rounded-md text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      {/* Product Info */}
      <div className="p-4 space-y-2">
        {/* Category */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            {product?.category}
          </span>
          {product?.rating && (
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={12} className="text-warning fill-current" />
              <span className="text-xs text-muted-foreground">
                {product?.rating} ({product?.reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-card-foreground line-clamp-2 group-hover:text-accent transition-colors duration-200">
          {product?.name}
        </h3>

        {/* Brand */}
        {product?.brand && (
          <p className="text-sm text-muted-foreground">
            {product?.brand}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-card-foreground">
            {formatPrice(product?.price)}
          </span>
          {product?.originalPrice && product?.originalPrice > product?.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product?.originalPrice)}
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-1">
            {product?.features?.slice(0, 2)?.map((feature, index) => (
              <span 
                key={index}
                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md"
              >
                {feature}
              </span>
            ))}
          </div>
          
          {product?.stock > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => {
                e?.stopPropagation();
                // Add to cart functionality would go here
              }}
            >
              <Icon name="ShoppingCart" size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;