import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const RelatedProducts = ({ products }) => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product-detail?id=${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e?.stopPropagation();
    // Add to cart logic would go here
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = currentCart?.find(item => item?.id === product?.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart?.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // Update cart count in header
    const cartCount = currentCart?.reduce((sum, item) => sum + item?.quantity, 0);
    localStorage.setItem('cartCount', cartCount?.toString());
    
    // Dispatch custom event to update header
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  return (
    <div className="py-8 lg:py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold text-foreground">
          You Might Also Like
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/product-catalog-browse')}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products?.map((product) => (
          <div
            key={product?.id}
            onClick={() => handleProductClick(product?.id)}
            className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer transition-smooth hover:border-accent/50 group"
          >
            {/* Product Image */}
            <div className="aspect-square bg-muted overflow-hidden">
              <Image
                src={product?.image}
                alt={product?.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
              />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                {product?.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {product?.brand}
              </p>
              
              {/* Price and Rating */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-foreground">
                    ${product?.price?.toFixed(2)}
                  </span>
                  {product?.originalPrice && product?.originalPrice > product?.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      ${product?.originalPrice?.toFixed(2)}
                    </span>
                  )}
                </div>
                {product?.rating && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={12} className="text-warning fill-current" />
                    <span className="text-xs text-muted-foreground">
                      {product?.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <Button
                size="sm"
                onClick={(e) => handleAddToCart(e, product)}
                iconName="Plus"
                iconPosition="left"
                fullWidth
                className="text-xs"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;