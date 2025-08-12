import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductInfo = ({
  product,
  selectedSize,
  onSizeChange,
  selectedColor,
  onColorChange,
  quantity,
  onQuantityChange,
  isInWishlist,
  onAddToWishlist,
  onAddToCart,
  isAddingToCart
}) => {
  const [internalSelectedSize, setInternalSelectedSize] = useState(product?.sizes?.[0] || null);
  const [internalSelectedColor, setInternalSelectedColor] = useState(product?.colors?.[0] || null);
  const [internalQuantity, setInternalQuantity] = useState(1);
  // Removed isAddingToCart from local state as it's now a prop

  const handleQuantityChange = (change) => {
    const newQuantity = internalQuantity + change;
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setInternalQuantity(newQuantity);
      if (onQuantityChange) {
        onQuantityChange(newQuantity);
      }
    }
  };

  const handleAddToCartClick = async () => {
    // Use the prop onAddToCart and pass the required data
    if (onAddToCart) {
      await onAddToCart({
        ...product,
        selectedSize: internalSelectedSize,
        selectedColor: internalSelectedColor,
        quantity: internalQuantity
      });
    }
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
        <h3 className="text-lg font-medium text-foreground mb-3">Description</h3>
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
                onClick={() => {
                  setInternalSelectedSize(size);
                  if (onSizeChange) onSizeChange(size);
                }}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-smooth ${
                  internalSelectedSize === size
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
                onClick={() => {
                  setInternalSelectedColor(color);
                  if (onColorChange) onColorChange(color);
                }}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-smooth ${
                  internalSelectedColor?.name === color?.name
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
            disabled={internalQuantity <= 1}
            className="w-10 h-10 border border-border rounded-lg flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <Icon name="Minus" size={16} />
          </button>
          <span className="text-lg font-medium text-foreground min-w-[3rem] text-center">
            {internalQuantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={internalQuantity >= product?.stock}
            className="w-10 h-10 border border-border rounded-lg flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <Icon name="Plus" size={16} />
          </button>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCartClick}
          disabled={product?.stock === 0 || isAddingToCart}
          loading={isAddingToCart}
          fullWidth
          className="h-12 hover:bg-white hover:text-black"
        >
          {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>

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