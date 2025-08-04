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

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams?.get('id') || '1';
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showStickyCart, setShowStickyCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Mock product data
  const mockProducts = {
    '1': {
      id: '1',
      name: "Apple Watch Series 9 GPS + Cellular 45mm",
      price: 529.00,
      originalPrice: 599.00,
      rating: 4.8,
      reviewCount: 2847,
      stock: 12,
      category: "Watches",
      subcategory: "Smart Watches",
      description: `The most advanced Apple Watch yet features the breakthrough S9 chip, a magical new way to use your Apple Watch without touching the screen, and a brighter display. Advanced health, safety, and activity features provide powerful insights and help when you need it. And redesigned apps in watchOS give you more information at a glance.\n\nThe carbon neutral combination of Apple Watch Series 9 and the latest Sport Loop is a major milestone in our 2030 goal. Learn more about Apple's commitment to the environment at apple.com/2030.`,
      images: [
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop"
      ],
      sizes: ["41mm", "45mm"],
      colors: [
        { name: "Midnight", hex: "#1d1d1f" },
        { name: "Starlight", hex: "#faf0e6" },
        { name: "Silver", hex: "#e8e8ed" },
        { name: "Product RED", hex: "#ba0c2f" }
      ],
      specifications: {
        "Display": "Always-On Retina LTPO OLED",
        "Chip": "S9 SiP with 64-bit dual-core processor",
        "Storage": "64GB",
        "Connectivity": "GPS + Cellular",
        "Battery Life": "Up to 18 hours",
        "Water Resistance": "50 meters",
        "Operating System": "watchOS 10"
      }
    },
    '2': {
      id: '2',
      name: "Rolex Submariner Date",
      price: 13250.00,
      rating: 4.9,
      reviewCount: 156,
      stock: 3,
      category: "Watches",
      subcategory: "Luxury Watches",
      description: `The Submariner Date is one of the most popular Rolex models and a true icon among luxury sports watches. This legendary timepiece is designed for underwater exploration and features exceptional water resistance up to 300 meters.\n\nCrafted from the finest materials including 904L stainless steel and featuring the renowned Cerachrom bezel, this watch represents the pinnacle of Swiss watchmaking excellence.`,
      images: [
        "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&h=800&fit=crop"
      ],
      specifications: {
        "Case Material": "904L Stainless Steel",
        "Movement": "Perpetual, mechanical, self-winding",
        "Power Reserve": "Approximately 70 hours",
        "Water Resistance": "300 meters / 1,000 feet",
        "Bezel": "Unidirectional rotatable 60-minute graduated",
        "Crystal": "Scratch-resistant sapphire"
      }
    }
  };

  const mockRelatedProducts = [
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
  ];

  const mockReviews = [
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
  ];

  useEffect(() => {
    // Simulate loading product data
    const currentProduct = mockProducts?.[productId];
    if (currentProduct) {
      setProduct(currentProduct);
      setSelectedSize(currentProduct?.sizes?.[0] || null);
      setSelectedColor(currentProduct?.colors?.[0] || null);
    }
    setRelatedProducts(mockRelatedProducts);
    setReviews(mockReviews);

    // Check wishlist status
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(wishlist?.includes(productId));

    // Scroll to top
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      setShowStickyCart(scrollY > windowHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = async (productData) => {
    // Simulate adding to cart
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItemIndex = cartItems?.findIndex(item => 
      item?.id === productData?.id && 
      item?.selectedSize === productData?.selectedSize &&
      item?.selectedColor?.name === productData?.selectedColor?.name
    );

    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += productData?.quantity;
    } else {
      cartItems?.push({
        ...productData,
        addedAt: new Date()?.toISOString()
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart count
    const totalItems = cartItems?.reduce((sum, item) => sum + item?.quantity, 0);
    localStorage.setItem('cartCount', totalItems?.toString());

    // Show success message (you could implement a toast notification here)
    alert('Product added to cart successfully!');
  };

  const handleAddToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isInWishlist) {
      const updatedWishlist = wishlist?.filter(id => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
    } else {
      wishlist?.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsInWishlist(true);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

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
      <StickyAddToCart
        product={product}
        quantity={quantity}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onAddToCart={handleAddToCart}
        isAddingToCart={false}
        isVisible={showStickyCart}
      />
    </div>
  );
};

export default ProductDetail;