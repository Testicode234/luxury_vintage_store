import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  const productIdParam = searchParams?.get('id');

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
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
    // Mock data for related products and reviews, to be replaced with actual API calls
    setRelatedProducts([
      {
        id: '3',
        name: "Samsung Galaxy Watch6 Classic",
        price: 399.99,
        originalPrice: 449.99,
        rating: 4.6,
        reviewCount: 1234,
        stock: 8,
        image: "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=400&h=400&fit=crop"
      },
      {
        id: '4',
        name: "Garmin Fenix 7X Sapphire Solar",
        price: 899.99,
        rating: 4.7,
        reviewCount: 567,
        stock: 5,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop"
      },
      {
        id: '5',
        name: "Fitbit Sense 2",
        price: 299.95,
        originalPrice: 349.95,
        rating: 4.4,
        reviewCount: 890,
        stock: 15,
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop"
      },
      {
        id: '6',
        name: "TAG Heuer Formula 1",
        price: 1250.00,
        rating: 4.8,
        reviewCount: 234,
        stock: 2,
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop"
      }
    ]);

    setReviews([
      {
        id: 1,
        userName: "Sarah Johnson",
        rating: 5,
        date: "2024-07-28",
        title: "Absolutely love this watch!",
        comment: `I've been using this Apple Watch for about 3 months now and it's been incredible. The battery life is excellent, lasting me a full day even with heavy usage. The health tracking features are very accurate and the new S9 chip makes everything so smooth and responsive.\n\nThe build quality is outstanding and it looks great with both casual and formal outfits. Highly recommend!`,
        verified: true,
        helpfulCount: 24,
        images: []
      },
      {
        id: 2,
        userName: "Michael Chen",
        rating: 4,
        date: "2024-07-25",
        title: "Great upgrade from Series 7",
        comment: `Coming from the Series 7, the improvements are noticeable. The display is definitely brighter and the new gesture controls work well most of the time. Battery life seems slightly better too.\n\nOnly minor complaint is that some third-party apps still feel a bit slow, but overall very satisfied with the purchase.`,
        verified: true,
        helpfulCount: 18
      },
      {
        id: 3,
        userName: "Emily Rodriguez",
        rating: 5,
        date: "2024-07-20",
        title: "Perfect for fitness tracking",
        comment: `As someone who works out regularly, this watch has been a game changer. The workout detection is spot on and the heart rate monitoring feels very accurate. Love the new cycling metrics and the crash detection gives me peace of mind.\n\nThe cellular connectivity is also great for leaving my phone at home during runs.`,
        verified: true,
        helpfulCount: 31
      },
      {
        id: 4,
        userName: "David Kim",
        rating: 4,
        date: "2024-07-15",
        title: "Solid smartwatch with minor issues",
        comment: `Overall a great watch with excellent build quality and features. The always-on display is bright and clear. However, I've noticed occasional connectivity issues with my iPhone and some apps crash more than I'd like.\n\nStill recommend it, but hoping software updates will address these issues.`,
        verified: false,
        helpfulCount: 12
      },
      {
        id: 5,
        userName: "Lisa Thompson",
        rating: 5,
        date: "2024-07-10",
        title: "Best Apple Watch yet!",
        comment: `This is my fourth Apple Watch and definitely the best one yet. The performance improvements are significant and the new health features are incredibly useful. The ECG and blood oxygen monitoring work flawlessly.\n\nThe design is timeless and the Sport Loop is very comfortable for all-day wear.`,
        verified: true,
        helpfulCount: 45
      }
    ]);

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
    if (!product || product.stock === 0) return;

    setIsAddingToCart(true);

    try {
      const productToAdd = {
        ...product,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
        variant: `${selectedSize ? `Size: ${selectedSize}` : ''}${selectedSize && selectedColor ? ', ' : ''}${selectedColor ? `Color: ${selectedColor.name}` : ''}`
      };

      await cartService.addToCart(productToAdd, quantity);

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add product to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
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
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                isInWishlist={isInWishlist}
                quantity={quantity}
                setQuantity={setQuantity}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                isAddingToCart={isAddingToCart}
              />
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="mb-12">
            <CustomerReviews
              reviews={reviews}
              averageRating={averageRating}
              totalReviews={reviews?.length}
            />
          </div>

          {/* Related Products */}
          <div className="mb-8">
            <RelatedProducts
              products={relatedProducts}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </main>
      {/* Sticky Add to Cart - Mobile */}
      {showStickyCart && (
        <StickyAddToCart
          product={product}
          quantity={quantity}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
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