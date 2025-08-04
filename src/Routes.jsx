import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import ShoppingCart from './pages/shopping-cart';
import ProductDetail from './pages/product-detail';
import OrderConfirmation from './pages/order-confirmation';
import CheckoutProcess from './pages/checkout-process';
import ProductCatalogBrowse from './pages/product-catalog-browse';
import UserAuthentication from './pages/user-authentication';
import AdminPanel from './pages/admin';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ProductCatalogBrowse />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/checkout-process" element={<CheckoutProcess />} />
        <Route path="/product-catalog-browse" element={<ProductCatalogBrowse />} />
        <Route path="/user-authentication" element={<UserAuthentication />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;