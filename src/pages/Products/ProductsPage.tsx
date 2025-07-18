import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  TagIcon,
  CubeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Modal from '../../components/UI/Modal';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  cost: number;
  sku: string;
  stock: number;
  minStock: number;
  maxStock: number;
  status: 'active' | 'inactive' | 'discontinued';
  images: string[];
  sizes: string[];
  colors: string[];
  material?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  supplier?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductsPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form data for new/edit product
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    cost: '',
    sku: '',
    stock: '',
    minStock: '',
    maxStock: '',
    status: 'active' as Product['status'],
    sizes: '',
    colors: '',
    material: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    supplier: '',
    tags: '',
  });

  // 1. Add image upload state to formData
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProducts: Product[] = [
        {
          id: 'PROD-001',
          name: 'Premium Cotton T-Shirt',
          category: 'T-Shirts',
          description: 'High-quality 100% cotton t-shirt, perfect for printing and embroidery',
          price: 25.99,
          cost: 12.50,
          sku: 'TSHIRT-COTTON-001',
          stock: 150,
          minStock: 20,
          maxStock: 500,
          status: 'active',
          images: ['/products/tshirt-white.jpg', '/products/tshirt-black.jpg'],
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          colors: ['White', 'Black', 'Navy', 'Gray', 'Red'],
          material: '100% Cotton',
          weight: 180,
          dimensions: { length: 70, width: 50, height: 2 },
          supplier: 'Cotton Co.',
          tags: ['cotton', 'basic', 'unisex'],
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-12-18'),
        },
        {
          id: 'PROD-002',
          name: 'Fleece Hoodie',
          category: 'Hoodies',
          description: 'Comfortable fleece hoodie with kangaroo pocket',
          price: 45.99,
          cost: 22.00,
          sku: 'HOODIE-FLEECE-001',
          stock: 75,
          minStock: 15,
          maxStock: 200,
          status: 'active',
          images: ['/products/hoodie-gray.jpg'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Gray', 'Black', 'Navy', 'Burgundy'],
          material: '80% Cotton, 20% Polyester',
          weight: 450,
          dimensions: { length: 75, width: 60, height: 5 },
          supplier: 'Comfort Wear Ltd.',
          tags: ['fleece', 'hoodie', 'winter'],
          createdAt: new Date('2024-02-10'),
          updatedAt: new Date('2024-12-15'),
        },
        {
          id: 'PROD-003',
          name: 'Sports Jersey',
          category: 'Jerseys',
          description: 'Moisture-wicking sports jersey for athletic wear',
          price: 35.99,
          cost: 18.00,
          sku: 'JERSEY-SPORT-001',
          stock: 8,
          minStock: 25,
          maxStock: 150,
          status: 'active',
          images: ['/products/jersey-blue.jpg'],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Blue', 'Red', 'Green', 'Yellow'],
          material: '100% Polyester',
          weight: 160,
          dimensions: { length: 72, width: 52, height: 2 },
          supplier: 'Athletic Pro',
          tags: ['sports', 'jersey', 'moisture-wicking'],
          createdAt: new Date('2024-03-05'),
          updatedAt: new Date('2024-12-10'),
        },
        {
          id: 'PROD-004',
          name: 'Canvas Tote Bag',
          category: 'Bags',
          description: 'Eco-friendly canvas tote bag for promotional use',
          price: 12.99,
          cost: 6.50,
          sku: 'BAG-CANVAS-001',
          stock: 200,
          minStock: 50,
          maxStock: 1000,
          status: 'active',
          images: ['/products/tote-natural.jpg'],
          sizes: ['One Size'],
          colors: ['Natural', 'Black', 'Navy'],
          material: '100% Cotton Canvas',
          weight: 120,
          dimensions: { length: 38, width: 42, height: 10 },
          supplier: 'Eco Bags Inc.',
          tags: ['canvas', 'eco-friendly', 'promotional'],
          createdAt: new Date('2024-04-20'),
          updatedAt: new Date('2024-12-05'),
        },
        {
          id: 'PROD-005',
          name: 'Vintage Wash T-Shirt',
          category: 'T-Shirts',
          description: 'Soft vintage wash t-shirt with relaxed fit',
          price: 28.99,
          cost: 14.00,
          sku: 'TSHIRT-VINTAGE-001',
          stock: 0,
          minStock: 20,
          maxStock: 300,
          status: 'inactive',
          images: ['/products/vintage-tee.jpg'],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Faded Blue', 'Vintage Gray', 'Washed Black'],
          material: '100% Cotton',
          weight: 170,
          dimensions: { length: 68, width: 48, height: 2 },
          supplier: 'Vintage Apparel Co.',
          tags: ['vintage', 'soft', 'relaxed'],
          createdAt: new Date('2024-05-15'),
          updatedAt: new Date('2024-11-30'),
        },
      ];
      
      setProducts(mockProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = product.stock <= product.minStock;
    } else if (stockFilter === 'out') {
      matchesStock = product.stock === 0;
    } else if (stockFilter === 'in-stock') {
      matchesStock = product.stock > 0;
    }
    
    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  const handleOpenModal = (mode: 'view' | 'create' | 'edit', product?: Product) => {
    setModalMode(mode);
    if (mode === 'create') {
      setFormData({
        name: '',
        category: '',
        description: '',
        price: '',
        cost: '',
        sku: '',
        stock: '',
        minStock: '',
        maxStock: '',
        status: 'active',
        sizes: '',
        colors: '',
        material: '',
        weight: '',
        length: '',
        width: '',
        height: '',
        supplier: '',
        tags: '',
      });
      setImageFiles([]); // Reset image files for new product
    } else if (product) {
      setSelectedProduct(product);
      if (mode === 'edit') {
        setFormData({
          name: product.name,
          category: product.category,
          description: product.description || '',
          price: product.price.toString(),
          cost: product.cost.toString(),
          sku: product.sku,
          stock: product.stock.toString(),
          minStock: product.minStock.toString(),
          maxStock: product.maxStock.toString(),
          status: product.status,
          sizes: product.sizes.join(', '),
          colors: product.colors.join(', '),
          material: product.material || '',
          weight: product.weight?.toString() || '',
          length: product.dimensions?.length.toString() || '',
          width: product.dimensions?.width.toString() || '',
          height: product.dimensions?.height.toString() || '',
          supplier: product.supplier || '',
          tags: product.tags.join(', '),
        });
        setImageFiles(product.images.map(url => new File([], url.split('/').pop() || 'file', { type: url.split('.').pop()?.split('/')[0] || 'image/jpeg' }))); // Load existing images for edit
      }
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (modalMode === 'create') {
        const newProduct: Product = {
          id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
          name: formData.name,
          category: formData.category,
          description: formData.description,
          price: parseFloat(formData.price),
          cost: parseFloat(formData.cost),
          sku: formData.sku,
          stock: parseInt(formData.stock),
          minStock: parseInt(formData.minStock),
          maxStock: parseInt(formData.maxStock),
          status: formData.status,
          images: imageFiles.map(file => URL.createObjectURL(file)), // Simulate upload
          sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
          colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
          material: formData.material,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          dimensions: formData.length && formData.width && formData.height ? {
            length: parseFloat(formData.length),
            width: parseFloat(formData.width),
            height: parseFloat(formData.height),
          } : undefined,
          supplier: formData.supplier,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setProducts(prev => [...prev, newProduct]);
      } else if (modalMode === 'edit' && selectedProduct) {
        setProducts(prev => prev.map(product => 
          product.id === selectedProduct.id 
            ? {
                ...product,
                name: formData.name,
                category: formData.category,
                description: formData.description,
                price: parseFloat(formData.price),
                cost: parseFloat(formData.cost),
                sku: formData.sku,
                stock: parseInt(formData.stock),
                minStock: parseInt(formData.minStock),
                maxStock: parseInt(formData.maxStock),
                status: formData.status,
                images: imageFiles.length > 0 ? imageFiles.map(file => URL.createObjectURL(file)) : product.images,
                sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
                colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
                material: formData.material,
                weight: formData.weight ? parseFloat(formData.weight) : undefined,
                dimensions: formData.length && formData.width && formData.height ? {
                  length: parseFloat(formData.length),
                  width: parseFloat(formData.width),
                  height: parseFloat(formData.height),
                } : undefined,
                supplier: formData.supplier,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
                updatedAt: new Date(),
              }
            : product
        ));
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(prev => prev.filter(product => product.id !== productToDelete.id));
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { status: 'out', color: 'danger', text: 'Out of Stock' };
    if (product.stock <= product.minStock) return { status: 'low', color: 'warning', text: 'Low Stock' };
    return { status: 'good', color: 'success', text: 'In Stock' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'discontinued':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const categories = Array.from(new Set(products.map(p => p.category)));
  
  const canCreate = hasPermission('create_products');
  const canEdit = hasPermission('edit_products');
  const canDelete = hasPermission('delete_products');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your product catalog and inventory
          </p>
        </div>
        {canCreate && (
          <Button
            onClick={() => handleOpenModal('create')}
            className="mt-4 sm:mt-0"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Product
          </Button>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CubeIcon className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-success-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-warning-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XMarkIcon className="h-8 w-8 text-danger-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{outOfStockProducts}</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <Card.Body>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search products by name, SKU, category, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<MagnifyingGlassIcon />}
                />
              </div>
              <div className="w-full lg:w-48">
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Categories' },
                    ...categories.map(cat => ({ value: cat, label: cat }))
                  ]}
                />
              </div>
              <div className="w-full lg:w-48">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'discontinued', label: 'Discontinued' },
                  ]}
                />
              </div>
              <div className="w-full lg:w-48">
                <Select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Stock' },
                    { value: 'in-stock', label: 'In Stock' },
                    { value: 'low', label: 'Low Stock' },
                    { value: 'out', label: 'Out of Stock' },
                  ]}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => {
          const stockStatus = getStockStatus(product);
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <Card.Body>
                  <div className="space-y-4">
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`${product.images.length > 0 ? 'hidden' : ''}`}>
                        <PhotoIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                          {product.name}
                        </h3>
                        <Badge
                          variant={getStatusColor(product.status) as any}
                          size="sm"
                        >
                          {product.status}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-600">{product.category}</p>
                      <p className="text-xs text-gray-500 font-mono">{product.sku}</p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-gray-900">RM{product.price}</p>
                          <p className="text-xs text-gray-500">Cost: RM{product.cost}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={stockStatus.color as any}
                            size="sm"
                          >
                            {stockStatus.text}
                          </Badge>
                          <p className="text-xs text-gray-600 mt-1">
                            Stock: {product.stock}
                          </p>
                        </div>
                      </div>
                      
                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                            >
                              <TagIcon className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {product.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{product.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal('view', product)}
                        className="flex-1"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal('edit', product)}
                          className="flex-1"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setProductToDelete(product);
                            setShowDeleteModal(true);
                          }}
                        >
                          <TrashIcon className="h-4 w-4 text-danger-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <CubeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first product.'}
          </p>
          {canCreate && !searchTerm && (
            <Button onClick={() => handleOpenModal('create')}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New Product
            </Button>
          )}
        </motion.div>
      )}

      {/* Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size="xl"
      >
        {modalMode === 'view' && selectedProduct ? (
          // View Mode
          <>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                Product Details - {selectedProduct.name}
              </h3>
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Image */}
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      {selectedProduct.images.length > 0 ? (
                        <img
                          src={selectedProduct.images[0]}
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`${selectedProduct.images.length > 0 ? 'hidden' : ''}`}>
                        <PhotoIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Status</label>
                        <Badge variant={getStatusColor(selectedProduct.status) as any}>
                          {selectedProduct.status}
                        </Badge>
                      </div>
                      <div>
                        <label className="form-label">Stock Status</label>
                        <Badge variant={getStockStatus(selectedProduct).color as any}>
                          {getStockStatus(selectedProduct).text}
                        </Badge>
                      </div>
                      <div>
                        <label className="form-label">Category</label>
                        <p className="text-gray-900">{selectedProduct.category}</p>
                      </div>
                      <div>
                        <label className="form-label">SKU</label>
                        <p className="text-gray-900 font-mono">{selectedProduct.sku}</p>
                      </div>
                      <div>
                        <label className="form-label">Price</label>
                        <p className="text-gray-900 font-semibold">RM{selectedProduct.price}</p>
                      </div>
                      <div>
                        <label className="form-label">Cost</label>
                        <p className="text-gray-900">RM{selectedProduct.cost}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="form-label">Current Stock</label>
                        <p className="text-gray-900 font-semibold">{selectedProduct.stock}</p>
                      </div>
                      <div>
                        <label className="form-label">Min Stock</label>
                        <p className="text-gray-900">{selectedProduct.minStock}</p>
                      </div>
                      <div>
                        <label className="form-label">Max Stock</label>
                        <p className="text-gray-900">{selectedProduct.maxStock}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedProduct.description && (
                  <div>
                    <label className="form-label">Description</label>
                    <p className="text-gray-900">{selectedProduct.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Available Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label">Available Colors</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map((color, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {(selectedProduct.material || selectedProduct.weight || selectedProduct.dimensions) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedProduct.material && (
                      <div>
                        <label className="form-label">Material</label>
                        <p className="text-gray-900">{selectedProduct.material}</p>
                      </div>
                    )}
                    {selectedProduct.weight && (
                      <div>
                        <label className="form-label">Weight</label>
                        <p className="text-gray-900">{selectedProduct.weight}g</p>
                      </div>
                    )}
                    {selectedProduct.dimensions && (
                      <div>
                        <label className="form-label">Dimensions (cm)</label>
                        <p className="text-gray-900">
                          {selectedProduct.dimensions.length} × {selectedProduct.dimensions.width} × {selectedProduct.dimensions.height}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedProduct.supplier && (
                  <div>
                    <label className="form-label">Supplier</label>
                    <p className="text-gray-900">{selectedProduct.supplier}</p>
                  </div>
                )}
                
                {selectedProduct.tags.length > 0 && (
                  <div>
                    <label className="form-label">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, index) => (
                        <Badge key={index} variant="primary" size="sm">
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </>
        ) : (
          // Create/Edit Mode
          <form onSubmit={handleSubmit}>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                {modalMode === 'create' ? 'Add New Product' : 'Edit Product'}
              </h3>
            </Modal.Header>
            
            <Modal.Body>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                  
                  <Input
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Enter category"
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="input"
                    placeholder="Enter product description..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Price (RM)"
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                  
                  <Input
                    label="Cost (RM)"
                    type="number"
                    step="0.01"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                  
                  <Input
                    label="SKU"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Enter SKU"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    label="Current Stock"
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                  
                  <Input
                    label="Min Stock"
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                  
                  <Input
                    label="Max Stock"
                    type="number"
                    name="maxStock"
                    value={formData.maxStock}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                  
                  <Select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'discontinued', label: 'Discontinued' },
                    ]}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Available Sizes"
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleInputChange}
                    placeholder="XS, S, M, L, XL"
                    helperText="Separate sizes with commas"
                  />
                  
                  <Input
                    label="Available Colors"
                    name="colors"
                    value={formData.colors}
                    onChange={handleInputChange}
                    placeholder="White, Black, Navy"
                    helperText="Separate colors with commas"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Material"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="100% Cotton"
                  />
                  
                  <Input
                    label="Weight (g)"
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="180"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Length (cm)"
                    type="number"
                    step="0.1"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    placeholder="70"
                  />
                  
                  <Input
                    label="Width (cm)"
                    type="number"
                    step="0.1"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    placeholder="50"
                  />
                  
                  <Input
                    label="Height (cm)"
                    type="number"
                    step="0.1"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="2"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    placeholder="Supplier name"
                  />
                  
                  <Input
                    label="Tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="cotton, basic, unisex"
                    helperText="Separate tags with commas"
                  />
                </div>
                <div>
                  <label className="form-label">Product Images</label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
                    onClick={() => document.getElementById('product-images-upload')?.click()}
                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = Array.from(e.dataTransfer.files);
                      setImageFiles(prev => [...prev, ...files]);
                    }}
                  >
                    <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Drag or click to upload product images (jpg, png, etc.)</p>
                    <input
                      id="product-images-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        setImageFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
                      }}
                    />
                    {/* Uploaded images preview */}
                    {imageFiles.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {imageFiles.map((file, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="object-cover w-full h-full"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-500 hover:text-red-700"
                              onClick={e => {
                                e.stopPropagation();
                                setImageFiles(prev => prev.filter((_, i) => i !== idx));
                              }}
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Modal.Body>
            
            <Modal.Footer>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                >
                  {modalMode === 'create' ? 'Add Product' : 'Update Product'}
                </Button>
              </div>
            </Modal.Footer>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        size="md"
      >
        <Modal.Header>
          <h3 className="text-lg font-semibold text-danger-600">
            Delete Product
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="h-12 w-12 text-danger-500" />
              <div>
                <p className="text-gray-900">
                  Are you sure you want to delete <strong>{productToDelete?.name}</strong>?
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isSubmitting}
            >
              Delete Product
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductsPage;