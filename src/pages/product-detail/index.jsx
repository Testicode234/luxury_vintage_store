import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProductImageGallery from './components/ProductImageGallery';
import ProductInfo from './components/ProductInfo';
import CustomerReviews from './components/CustomerReviews';
import RelatedProducts from './components/RelatedProducts';
import StickyAddToCart from './components/StickyAddToCart';
import Breadcrumb from './components/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { productService } from '../../services/productService';
import { cartService } from '../../services/cartService';

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id: urlParamId } = useParams();
  const productIdParam = urlParamId || searchParams?.get('id');

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showStickyCart, setShowStickyCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productIdParam) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await productService.getProduct(productIdParam);

        if (productData) {
          setProduct(productData);
          if (productData.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
          if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0]);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productIdParam]);

  useEffect(() => {
    // Check wishlist status
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(wishlist?.includes(productIdParam));
  }, [productIdParam]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      setShowStickyCart(scrollY > windowHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);

    try {
      const productWithVariant = {
        ...product,
        variant: [selectedSize, selectedColor?.name].filter(Boolean).join(', ')
      };

      await cartService.addToCart(productWithVariant, quantity);

      console.log('Added to cart:', productWithVariant.name);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add product to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const handleAddToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    if (isInWishlist) {
      const updatedWishlist = wishlist?.filter(id => id !== productIdParam);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
    } else {
      wishlist?.push(productIdParam);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsInWishlist(true);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Header />
        <div className="text-center">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/product-catalog-browse')}>
              Back to Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/product-catalog-browse')}>
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = reviews?.reduce((sum, review) => sum + review?.rating, 0) / reviews?.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Back Button - Mobile */}
          <div className="md:hidden mb-4">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              iconName="ArrowLeft"
              iconPosition="left"
              className="text-foreground"
            >
              Back
            </Button>
          </div>

          {/* Breadcrumb - Desktop */}
          <div className="hidden md:block">
            <Breadcrumb
              category={product?.category}
              subcategory={product?.subcategory}
              productName={product?.name}
            />
          </div>

          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Product Images */}
            <div className="order-1">
              <ProductImageGallery
                images={product?.images}
                productName={product?.name}
              />
            </div>

            {/* Product Information */}
            <div className="order-2">
              <ProductInfo
                product={product}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                isInWishlist={isInWishlist}
                onAddToWishlist={handleAddToWishlist}
                onAddToCart={handleAddToCart}
                isAddingToCart={isAddingToCart}
              />
            </div>
          </div>

          {/* Related Products */}
          <div className="mb-8">
            <RelatedProducts
              referenceProductId={product?.id}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </main>

      {/* Sticky Add to Cart - Mobile */}
      {showStickyCart && (
        <StickyAddToCart
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCart}
          isAddingToCart={isAddingToCart}
        />
      )}

      {showSuccessMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
          Product added to cart successfully!
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
