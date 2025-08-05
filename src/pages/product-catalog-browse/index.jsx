import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import Header from '../../components/ui/Header';
import FilterChips from './components/FilterChips';
import FilterSidebar from './components/FilterSidebar';
import SortDropdown from './components/SortDropdown';
import ProductGrid from './components/ProductGrid';
import LoadMoreButton from './components/LoadMoreButton';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ProductCatalogBrowse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [activeBrands, setActiveBrands] = useState([]);
  const [activeRating, setActiveRating] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const PRODUCTS_PER_PAGE = 12;

  // Initialize data and URL params
  useEffect(() => {
    loadData();

    // Get search query from URL
    const query = searchParams?.get('search') || '';
    setSearchQuery(query);
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData, brandsData] = await Promise.all([
        productService?.getProducts(),
        productService?.getCategories(),
        productService?.getBrands()
      ]);

      // Transform products to match existing component structure
      const transformedProducts = productsData?.map(product => ({
        id: product?.id,
        name: product?.name,
        brand: product?.brand?.name,
        category: product?.category?.slug,
        price: product?.price,
        originalPrice: product?.original_price,
        image: product?.image_url,
        rating: product?.rating,
        reviewCount: product?.review_count,
        stock: product?.stock,
        features: product?.features,
        isWishlisted: false // Default value for now
      }));

      setProducts(transformedProducts);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(product =>
        product?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.brand?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply category filters
    if (activeFilters?.length > 0) {
      filtered = filtered?.filter(product => activeFilters?.includes(product?.category));
    }

    // Apply brand filters
    if (activeBrands?.length > 0) {
      filtered = filtered?.filter(product =>
        activeBrands?.includes(product?.brand?.toLowerCase()?.replace(/\s+/g, '-'))
      );
    }

    // Apply price range filter
    filtered = filtered?.filter(product =>
      product?.price >= priceRange?.min && product?.price <= priceRange?.max
    );

    // Apply rating filter
    if (activeRating) {
      filtered = filtered?.filter(product => product?.rating >= activeRating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered?.sort((a, b) => a?.price - b?.price);
        break;
      case 'price-high':
        filtered?.sort((a, b) => b?.price - a?.price);
        break;
      case 'newest':
        filtered?.sort((a, b) => b?.id - a?.id);
        break;
      case 'rating':
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'name-asc':
        filtered?.sort((a, b) => a?.name?.localeCompare(b?.name));
        break;
      case 'name-desc':
        filtered?.sort((a, b) => b?.name?.localeCompare(a?.name));
        break;
      default:
        // relevance - keep original order
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, activeFilters, activeBrands, priceRange, activeRating, sortBy, searchQuery]);

  // Update displayed products based on pagination
  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * PRODUCTS_PER_PAGE;
    setDisplayedProducts(filteredProducts?.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage]);

  // Filter handlers
  const handleFilterToggle = useCallback((filterId, clearAll = false) => {
    if (clearAll) {
      setActiveFilters([]);
      return;
    }

    setActiveFilters(prev =>
      prev?.includes(filterId)
        ? prev?.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  }, []);

  const handleBrandToggle = useCallback((brandId, clearAll = false) => {
    if (clearAll) {
      setActiveBrands([]);
      return;
    }

    setActiveBrands(prev =>
      prev?.includes(brandId)
        ? prev?.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setActiveFilters([]);
    setActiveBrands([]);
    setActiveRating(null);
    setPriceRange({ min: 0, max: 10000 });
  }, []);

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoadingMore(false);
    }, 800);
  }, []);

  const handleWishlistToggle = useCallback((productId, isWishlisted) => {
    setProducts(prev =>
      prev?.map(product =>
        product?.id === productId
          ? { ...product, isWishlisted }
          : product
      )
    );
  }, []);

  const hasMore = displayedProducts?.length < filteredProducts?.length;
  const hasActiveFilters = activeFilters?.length > 0 || activeBrands?.length > 0 || activeRating !== null;

  // Create filter data for components
  const categoriesWithCounts = categories?.map(cat => ({
    id: cat?.slug,
    name: cat?.name,
    icon: cat?.icon,
    count: products?.filter(p => p?.category === cat?.slug)?.length
  }));

  const brandsWithCounts = brands?.map(brand => ({
    id: brand?.slug,
    name: brand?.name,
    count: products?.filter(p => 
      p?.brand?.toLowerCase()?.replace(/\s+/g, '-') === brand?.slug
    )?.length
  }));

  const ratings = [
    { value: 4, count: products?.filter(p => p?.rating >= 4)?.length },
    { value: 3, count: products?.filter(p => p?.rating >= 3)?.length },
    { value: 2, count: products?.filter(p => p?.rating >= 2)?.length },
    { value: 1, count: products?.filter(p => p?.rating >= 1)?.length }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-20">
        <div className="w-full">
          <div className="flex">
           
            

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="px-4 md:px-6 lg:px-8 py-6 space-y-6">
                {/* Mobile Filter Button & Search Results */}

                <div className='md:text-8xl text-4xl font-bold text-black [text-shadow:_2px_2px_0_white] text-center'>LUXURY VINTAGE</div>
                <div className="flex items-center justify-between lg:hidden">
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterSidebarOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Icon name="Filter" size={16} />
                    <span>Filters</span>
                    {hasActiveFilters && (
                      <span className="bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {activeFilters?.length + activeBrands?.length + (activeRating ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                  
                  {searchQuery && (
                    <div className="text-sm text-muted-foreground">
                      Results for "{searchQuery}"
                    </div>
                  )}
                </div>

                {/* Desktop Search Results */}
                {searchQuery && (
                  <div className="hidden lg:block">
                    <h1 className="text-2xl font-semibold text-foreground mb-2">
                      Search Results
                    </h1>
                    <p className="text-muted-foreground">
                      Showing results for "{searchQuery}"
                    </p>
                  </div>
                )}

                {/* Filter Chips */}
                <FilterChips
                  categories={categoriesWithCounts?.filter(cat => cat?.count > 0)}
                  activeFilters={activeFilters}
                  onFilterToggle={handleFilterToggle}
                  onClearAll={handleClearAllFilters}
                />

                {/* Sort & Results Count */}
                <SortDropdown
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  resultsCount={filteredProducts?.length}
                />

                {/* Product Grid */}
                <ProductGrid
                  products={displayedProducts}
                  loading={loading}
                  onWishlistToggle={handleWishlistToggle}
                />

                {/* Load More Button */}
                {!loading && filteredProducts?.length > 0 && (
                  <LoadMoreButton
                    onLoadMore={handleLoadMore}
                    loading={loadingMore}
                    hasMore={hasMore}
                    currentCount={displayedProducts?.length}
                    totalCount={filteredProducts?.length}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductCatalogBrowse;