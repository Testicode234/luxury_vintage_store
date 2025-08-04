import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductInfo = ({ product, onAddToCart, onAddToWishlist, isInWishlist }) => {
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });
    setIsAddingToCart(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < Math.floor(rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  const getStockStatus = () => {
    if (product?.stock === 0) return { text: 'Out of Stock', color: 'text-destructive' };
    if (product?.stock <= 5) return { text: `Only ${product?.stock} left`, color: 'text-warning' };
    return { text: 'In Stock', color: 'text-success' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="space-y-6">
      {/* Product Name and Price */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          {product?.name}
        </h1>
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-3xl font-bold text-foreground">
            ${product?.price?.toFixed(2)}
          </span>
          {product?.originalPrice && product?.originalPrice > product?.price && (
            <span className="text-lg text-muted-foreground line-through">
              ${product?.originalPrice?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
      {/* Rating and Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {renderStars(product?.rating)}
          <span className="text-sm text-foreground ml-2">
            {product?.rating?.toFixed(1)}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          ({product?.reviewCount} reviews)
        </span>
      </div>
      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <Icon 
          name={product?.stock > 0 ? "Check" : "X"} 
          size={16} 
          className={stockStatus?.color} 
        />
        <span className={`text-sm font-medium ${stockStatus?.color}`}>
          {stockStatus?.text}
        </span>
      </div>
      {/* Product Description */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-2">Description</h3>
        <p className="text-muted-foreground leading-relaxed">
          {product?.description}
        </p>
      </div>
      {/* Size Selection */}
      {product?.sizes && product?.sizes?.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {product?.sizes?.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-smooth ${
                  selectedSize === size
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border text-foreground hover:border-muted-foreground'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Color Selection */}
      {product?.colors && product?.colors?.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {product?.colors?.map((color) => (
              <button
                key={color?.name}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-smooth ${
                  selectedColor?.name === color?.name
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border text-foreground hover:border-muted-foreground'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: color?.hex }}
                  />
                  <span>{color?.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Quantity Selector */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-3">Quantity</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-10 h-10 border border-border rounded-lg flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <Icon name="Minus" size={16} />
          </button>
          <span className="text-lg font-medium text-foreground min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product?.stock}
            className="w-10 h-10 border border-border rounded-lg flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <Icon name="Plus" size={16} />
          </button>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCart}
          disabled={product?.stock === 0 || isAddingToCart}
          loading={isAddingToCart}
          fullWidth
          className="h-12"
        >
          {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onAddToWishlist}
            iconName={isInWishlist ? "Heart" : "Heart"}
            iconPosition="left"
            fullWidth
            className={isInWishlist ? 'text-destructive border-destructive' : ''}
          >
            {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>
          
          <Button
            variant="outline"
            iconName="Share"
            iconPosition="left"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product?.name,
                  text: product?.description,
                  url: window.location?.href
                });
              }
            }}
          >
            Share
          </Button>
        </div>
      </div>
      {/* Product Specifications */}
      {product?.specifications && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-3">Specifications</h3>
          <div className="space-y-2">
            {Object.entries(product?.specifications)?.map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">{key}</span>
                <span className="text-foreground font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;