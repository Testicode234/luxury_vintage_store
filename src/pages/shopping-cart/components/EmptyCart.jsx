import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyCart = () => {
  const categories = [
    {
      name: 'Watches',
      icon: 'Watch',
      href: '/product-catalog-browse?category=watches',
      description: 'Premium timepieces'
    },
    {
      name: 'Hoodies',
      icon: 'Shirt',
      href: '/product-catalog-browse?category=hoodies',
      description: 'Comfortable apparel'
    },
    {
      name: 'Cologne',
      icon: 'Sparkles',
      href: '/product-catalog-browse?category=cologne',
      description: 'Signature fragrances'
    },
    {
      name: 'Gadgets',
      icon: 'Smartphone',
      href: '/product-catalog-browse?category=gadgets',
      description: 'Latest technology'
    },
    {
      name: 'AirPods',
      icon: 'Headphones',
      href: '/product-catalog-browse?category=airpods',
      description: 'Premium audio'
    },
    {
      name: 'AirPods Max',
      icon: 'Volume2',
      href: '/product-catalog-browse?category=airpods-max',
      description: 'Studio-quality sound'
    }
  ];

  return (
    <div className="text-center py-12 md:py-16">
      {/* Empty Cart Icon */}
      <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
        <Icon name="ShoppingCart" size={48} className="text-muted-foreground md:w-16 md:h-16" />
      </div>
      {/* Empty State Message */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
        </p>
      </div>
      {/* Primary CTA */}
      <div className="mb-12">
        <Button
          variant="default"
          onClick={() => window.location.href = '/product-catalog-browse'}
          className="h-12 px-8 text-base font-semibold"
        >
          <Icon name="ArrowRight" size={20} className="ml-2" />
          Start Shopping
        </Button>
      </div>
      {/* Category Quick Links */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Shop by Category
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories?.map((category) => (
            <a
              key={category?.name}
              href={category?.href}
              className="group bg-card border border-border rounded-lg p-4 hover:border-accent transition-smooth"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center group-hover:bg-accent/10 transition-smooth">
                  <Icon 
                    name={category?.icon} 
                    size={24} 
                    className="text-muted-foreground group-hover:text-accent transition-smooth" 
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground group-hover:text-accent transition-smooth">
                    {category?.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category?.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      {/* Additional Features */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-2">
            <Icon name="Truck" size={24} className="text-muted-foreground" />
            <h4 className="text-sm font-medium text-foreground">Free Shipping</h4>
            <p className="text-xs text-muted-foreground">On orders over $75</p>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-2">
            <Icon name="RotateCcw" size={24} className="text-muted-foreground" />
            <h4 className="text-sm font-medium text-foreground">Easy Returns</h4>
            <p className="text-xs text-muted-foreground">30-day return policy</p>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-2">
            <Icon name="Shield" size={24} className="text-muted-foreground" />
            <h4 className="text-sm font-medium text-foreground">Secure Payment</h4>
            <p className="text-xs text-muted-foreground">SSL encrypted checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;