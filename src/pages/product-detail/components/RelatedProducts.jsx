import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase'; // adjust path if needed

const RelatedProducts = ({ referenceProductId, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={12}
        className={index < Math.floor(rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);

      try {
        // Fetch the current product to get its category
        const { data: currentProduct, error: productError } = await supabase
          .from('products')
          .select('category')
          .eq('id', referenceProductId)
          .single();

        if (productError) throw productError;

        // Fetch other products in the same category (excluding the current one)
        const { data: related, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .eq('category', currentProduct.category)
          .neq('id', referenceProductId)
          .limit(8); // limit to 8 or however many you want

        if (relatedError) throw relatedError;

        setProducts(related || []);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (referenceProductId) {
      fetchRelatedProducts();
    }
  }, [referenceProductId]);

  if (loading) return null;

  if (!products.length) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Related Products</h2>
        <Link
          to="/product-catalog-browse"
          className="text-accent hover:text-accent/80 text-sm font-medium transition-smooth"
        >
          View All
        </Link>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product?.id} className="bg-card rounded-lg overflow-hidden group hover:shadow-pronounced transition-all duration-300">
            <Link to={`/product-detail/${product?.id}`} className="block">
              <div className="aspect-square overflow-hidden">
                <Image
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            <div className="p-4">
              <Link to={`/product-detail/${product?.id}`}>
                <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-smooth">
                  {product?.name}
                </h3>
              </Link>

              <div className="flex items-center space-x-1 mb-2">
                {renderStars(product?.rating || 0)}
                <span className="text-xs text-muted-foreground ml-1">
                  ({product?.reviewCount || 0})
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-foreground">
                    ${product?.price?.toFixed(2)}
                  </span>
                  {product?.originalPrice && product?.originalPrice > product?.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product?.originalPrice?.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                fullWidth
                onClick={() => onAddToCart(product)}
                disabled={product?.stock === 0}
              >
                {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {products.map((product) => (
            <div key={product?.id} className="flex-shrink-0 w-48 bg-card rounded-lg overflow-hidden">
              <Link to={`/product-detail/${product?.id}`} className="block">
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              <div className="p-3">
                <Link to={`/product-detail/${product?.id}`}>
                  <h3 className="font-medium text-foreground mb-2 text-sm line-clamp-2">
                    {product?.name}
                  </h3>
                </Link>

                <div className="flex items-center space-x-1 mb-2">
                  {renderStars(product?.rating || 0)}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({product?.reviewCount || 0})
                  </span>
                </div>

                <div className="mb-3">
                  <span className="text-base font-bold text-foreground">
                    ${product?.price?.toFixed(2)}
                  </span>
                  {product?.originalPrice && product?.originalPrice > product?.price && (
                    <div className="text-xs text-muted-foreground line-through">
                      ${product?.originalPrice?.toFixed(2)}
                    </div>
                  )}
                </div>

                <Button
                  size="xs"
                  fullWidth
                  onClick={() => onAddToCart(product)}
                  disabled={product?.stock === 0}
                >
                  {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
