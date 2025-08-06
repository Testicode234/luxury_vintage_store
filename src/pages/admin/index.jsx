import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { productService } from '../../services/productService';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';

const AdminPanel = () => {
  const { user, userProfile, loading: authLoading, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    original_price: '',
    image_url: '',
    stock: '',
    features: '',
  });

  useEffect(() => {
    if (!authLoading && user && isAdmin()) {
      loadData();
    }
  }, [authLoading, user, userProfile]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [productsData, categoriesData, brandsData] = await Promise.all([
        productService?.getProducts(),
        productService?.getCategories(),
        productService?.getBrands()
      ]);

      setProducts(productsData);

      // Merge with default categories if API returns data
      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData);
      }

      // Merge with default brands if API returns data
      if (brandsData && brandsData.length > 0) {
        setBrands(brandsData);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load data');
      // Keep default categories and brands on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      original_price: '',
      image_url: '',
      stock: '',
      features: '',
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product?.name || '',
      price: product?.price?.toString() || '',
      original_price: product?.original_price?.toString() || '',
      image_url: product?.image_url || '',
      stock: product?.stock?.toString() || '',
      features: product?.features?.join(', ') || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService?.deleteProduct(productId);
      setProducts(prev => prev?.filter(p => p?.id !== productId));
    } catch (err) {
      setError(err?.message || 'Failed to delete product');
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(null);

    try {
      const productData = {
        name: formData?.name,
        price: parseFloat(formData?.price),
        original_price: formData?.original_price ? parseFloat(formData?.original_price) : null,
        image_url: formData?.image_url,
        stock: parseInt(formData?.stock),
        features: formData?.features?.split(',')?.map(f => f?.trim())?.filter(f => f),
        status: 'active',
        created_by: user?.id,
        rating: 4.5 // Default rating for new products
      };

      let result;
      if (editingProduct) {
        result = await productService?.updateProduct(editingProduct?.id, productData);
        setProducts(prev => prev?.map(p => p?.id === editingProduct?.id ? result : p));
      } else {
        result = await productService?.createProduct(productData);
        setProducts(prev => [result, ...prev]);
      }

      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      setError(err?.message || 'Failed to save product');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please sign in to access the admin panel.</p>
          <Button onClick={() => window.location.href = '/user-authentication'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
          <Button onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 lg:pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Manage your products, categories, and brands</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mb-6">
            <Button onClick={handleCreateProduct} className="flex items-center space-x-2">
              <Icon name="Plus" size={16} />
              <span>Add Product</span>
            </Button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Products ({products?.length})</h3>

              {products?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No products found. Create your first product to get started.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products?.map((product) => (
                        <tr key={product?.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={product?.image_url || '/public/assets/images/no_image.png'}
                                  alt={product?.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product?.name}</div>
                                <div className="text-sm text-gray-500">Rating: {product?.rating}/5</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>${product?.price}</div>
                            {product?.original_price && (
                              <div className="text-xs text-gray-500 line-through">${product?.original_price}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product?.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product?.status === 'active' ?'bg-green-100 text-green-800' :'bg-red-100 text-red-800'
                            }`}>
                              {product?.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Icon name="Edit2" size={14} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product?.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Icon name="Trash2" size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                      <Input
                        type="text"
                        value={formData?.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData?.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: e?.target?.value }))}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData?.original_price}
                          onChange={(e) => setFormData(prev => ({ ...prev, original_price: e?.target?.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                      <Input
                        type="url"
                        value={formData?.image_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e?.target?.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                      <Input
                        type="number"
                        value={formData?.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e?.target?.value }))}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
                      <Input
                        type="text"
                        value={formData?.features}
                        onChange={(e) => setFormData(prev => ({ ...prev, features: e?.target?.value }))}
                        placeholder="Feature 1, Feature 2, Feature 3"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    className="w-full inline-flex justify-center sm:ml-3 sm:w-auto"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;