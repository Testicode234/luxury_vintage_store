import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Breadcrumb = ({ category, subcategory, productName }) => {
  const breadcrumbItems = [
    { label: 'Home', href: '/product-catalog-browse' },
    { label: category, href: `/product-catalog-browse?category=${encodeURIComponent(category)}` },
  ];

  if (subcategory) {
    breadcrumbItems?.push({
      label: subcategory,
      href: `/product-catalog-browse?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`
    });
  }

  breadcrumbItems?.push({ label: productName, href: null });

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {breadcrumbItems?.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          )}
          {item?.href ? (
            <Link
              to={item?.href}
              className="hover:text-foreground transition-smooth"
            >
              {item?.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium truncate">
              {item?.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;