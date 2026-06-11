import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Trash2,
  Edit,
  Eye,
  X,
  Upload,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCw
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useUploadProductImagesMutation } from '../../services/productApi';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const { products, addProduct, deleteProduct, updateProduct } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [uploadProductImages] = useUploadProductImagesMutation();
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Selection
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add Product Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  
  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: 'Tournament Wear',
    subcategory: '',
    gender: 'man',
    stock: '25',
    sizes: [],
    colors: [],
    tags: '',
    imageUrls: [],
    shippingCost: '99'
  });

  // Watch URL search parameters for actions or pre-filters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Check action
    if (params.get('action') === 'add') {
      setIsAddOpen(true);
      // Clean query parameter after opening
      navigate('/admin/products', { replace: true });
    }

    // Check filters
    const genderParam = params.get('gender');
    if (genderParam) {
      setGenderFilter(genderParam);
    } else {
      setGenderFilter('');
    }

    const categoryParam = params.get('category');
    if (categoryParam) {
      setCategoryFilter(categoryParam);
    } else {
      setCategoryFilter('');
    }
  }, [location.search]);

  // Categories & Subcategories mapping for reference
  const categoriesList = [
    'Tournament Wear',
    'T-Shirts',
    'Shirts',
    'Shoes'
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                            product.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
      const matchesGender = genderFilter ? product.gender === genderFilter : true;
      
      const stockLevel = product.stock ?? 15; // fallback
      const matchesStatus = statusFilter === 'low' ? stockLevel <= 5 && stockLevel > 0 :
                            statusFilter === 'out' ? stockLevel === 0 :
                            statusFilter === 'active' ? stockLevel > 0 : true;

      return matchesSearch && matchesCategory && matchesGender && matchesStatus;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination bounds
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Bulk Actions
  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteProduct(id));
    setSelectedIds([]);
  };

  // Handle Form Submission
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert("Name and base price are required.");
      return;
    }

    // Default placeholder images if none specified
    const images = newProduct.imageUrls.length > 0
      ? newProduct.imageUrls
      : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"];

    const formattedProduct = {
      name: newProduct.name,
      description: newProduct.description,
      price: Number(newProduct.price),
      salePrice: newProduct.salePrice ? Number(newProduct.salePrice) : null,
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      gender: newProduct.gender,
      stock: Number(newProduct.stock),
      sizes: newProduct.sizes,
      colors: newProduct.colors,
      tags: newProduct.tags,
      shippingCost: Number(newProduct.shippingCost || 99),
      images
    };

    if (editingProductId) {
      updateProduct(editingProductId, formattedProduct);
    } else {
      addProduct(formattedProduct);
    }

    // Reset Form
    setNewProduct({
      name: '',
      description: '',
      price: '',
      salePrice: '',
      category: 'Tournament Wear',
      subcategory: '',
      gender: 'man',
      stock: '25',
      sizes: [],
      colors: [],
      tags: '',
      imageUrls: [],
      shippingCost: '99'
    });

    setEditingProductId(null);
    setIsAddOpen(false);
  };

  const handleEditClick = (product) => {
    setNewProduct({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      salePrice: product.salePrice || '',
      category: product.category || 'Tournament Wear',
      subcategory: product.subcategory || '',
      gender: product.gender || 'man',
      stock: product.stock !== undefined ? String(product.stock) : '25',
      sizes: product.sizes || [],
      colors: product.colors || [],
      tags: product.tags || '',
      imageUrls: product.images || [],
      shippingCost: product.shippingCost !== undefined ? String(product.shippingCost) : '99'
    });
    setEditingProductId(product.id);
    setIsAddOpen(true);
  };

  const handleAddClick = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      salePrice: '',
      category: 'Tournament Wear',
      subcategory: '',
      gender: 'man',
      stock: '25',
      sizes: [],
      colors: [],
      tags: '',
      imageUrls: [],
      shippingCost: '99'
    });
    setEditingProductId(null);
    setIsAddOpen(true);
  };

  const toggleSize = (size) => {
    setNewProduct(prev => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const toggleColor = (colorHex) => {
    setNewProduct(prev => {
      const colors = prev.colors.includes(colorHex)
        ? prev.colors.filter(c => c !== colorHex)
        : [...prev.colors, colorHex];
      return { ...prev, colors };
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploadingImages(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const uploadedUrls = await uploadProductImages(formData).unwrap();
      setNewProduct(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls]
      }));
      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to upload images to server.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-luxury-serif">Products Catalog</h1>
          <p className="text-sm text-zinc-500">Manage BHONDU's premium apparel collection.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg hover:bg-zinc-850 dark:hover:bg-zinc-100 text-xs font-semibold shadow"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Control panel (Search & Filter) */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
        
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search products by title, category, tags..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full text-xs pl-9 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
          />
        </div>

        {/* Filter select list */}
        <div className="flex flex-wrap gap-2.5">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="text-xs px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
            className="text-xs px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 focus:outline-none"
          >
            <option value="">All Genders</option>
            <option value="man">Men</option>
            <option value="women">Women</option>
          </select>

          {/* Status (Stock Level) Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="text-xs px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 focus:outline-none"
          >
            <option value="">All Stock Levels</option>
            <option value="active">In Stock</option>
            <option value="low">Low Stock (&le; 5)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions display */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 rounded-xl shadow-lg text-xs"
        >
          <span>Selected <strong>{selectedIds.length}</strong> products</span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Selected
          </button>
        </motion.div>
      )}

      {/* Main Datatable */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-150 dark:border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-950/10">
                <th className="py-4 px-6 w-12 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                    className="rounded text-zinc-900 focus:ring-zinc-900"
                  />
                </th>
                <th className="py-4 px-4">Image</th>
                <th className="py-4 px-4 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('name')}>
                  Name {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-4 px-4 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('category')}>
                  Category {sortField === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-4 px-4 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('price')}>
                  Price {sortField === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-4 px-4 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('stock')}>
                  Stock {sortField === 'stock' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const stock = product.stock ?? 15;
                  const isLow = stock <= 5 && stock > 0;
                  const isOut = stock === 0;

                  return (
                    <motion.tr
                      key={product.id}
                      layoutId={`product-row-${product.id}`}
                      className={`border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors ${
                        isSelected ? 'bg-zinc-50/80 dark:bg-zinc-800/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-6 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(product.id)}
                          className="rounded text-zinc-900 focus:ring-zinc-900"
                        />
                      </td>

                      {/* Product Image */}
                      <td className="py-3 px-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-9 h-11 rounded object-cover border border-zinc-150 dark:border-zinc-800"
                        />
                      </td>

                      {/* Title & Sub */}
                      <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100 max-w-[200px] truncate">
                        <div>
                          <p className="truncate">{product.name}</p>
                          <p className="text-[10px] text-zinc-400 font-normal truncate uppercase tracking-wider">{product.gender}</p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                        {product.category}
                      </td>

                      {/* Price (Sale Price vs Original Price) */}
                      <td className="py-3 px-4 font-medium">
                        {product.discount > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">₹{product.price}</span>
                            <span className="text-[10px] text-zinc-400 line-through">₹{product.originalPrice}</span>
                            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Ship: ₹{product.shippingCost ?? 99}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">₹{product.price}</span>
                            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Ship: ₹{product.shippingCost ?? 99}</span>
                          </div>
                        )}
                      </td>

                      {/* Stock Level */}
                      <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400 font-mono">
                        {stock} units
                      </td>

                      {/* Stock Status Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                            isOut
                              ? 'bg-red-50 text-red-700 border-red-200/50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                              : isLow
                              ? 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => alert(`View details of: ${product.name}`)}
                            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                            title="Quick View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-zinc-400 dark:text-zinc-500 bg-zinc-50/10">
                    No products matching search or filters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-zinc-150 dark:border-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Sliding Drawer Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#F8F7F4] dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 z-50 p-6 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h3 className="font-semibold text-lg font-luxury-serif text-zinc-950 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#C9A87C]" />
                    {editingProductId ? 'Edit Product Details' : 'Curate New Product'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {editingProductId ? 'Update coordinates of this luxury piece.' : 'Add apparel details to the luxury collections.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleAddProductSubmit} className="flex-1 overflow-y-auto space-y-5 py-4 scrollbar-thin">
                
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Aether Pro Custom Jersey"
                    className="w-full text-xs p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Description</label>
                  <textarea
                    rows="3"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the fabric weave, fit cuts, detailing..."
                    className="w-full text-xs p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 resize-none"
                  />
                </div>

                {/* Price & Sale Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="8900"
                      className="w-full text-xs p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Sale Price (₹)</label>
                    <input
                      type="number"
                      value={newProduct.salePrice}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, salePrice: e.target.value }))}
                      placeholder="Leave empty if regular price"
                      className="w-full text-xs p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950"
                    />
                  </div>
                </div>

                {/* Category & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full text-xs p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950"
                    >
                      {categoriesList.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Gender Focus</label>
                    <select
                      value={newProduct.gender}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full text-xs p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950"
                    >
                      <option value="man">Men</option>
                      <option value="women">Women</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                </div>

                {/* Stock Quantity & Shipping Cost */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                      className="w-full text-xs p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Shipping Charge (₹)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.shippingCost}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, shippingCost: e.target.value }))}
                      placeholder="99"
                      className="w-full text-xs p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950"
                    />
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">Product Photos</label>
                  
                  {/* Thumbnails Grid */}
                  {newProduct.imageUrls && newProduct.imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2.5 pb-2">
                      {newProduct.imageUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-[3/4] rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-150 dark:bg-zinc-950 group">
                          <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          
                          {/* Badge for first image */}
                          {idx === 0 && (
                            <span className="absolute top-1 left-1.5 px-1.5 py-0.5 bg-accent text-primary text-[8px] font-bold uppercase rounded-sm shadow-sm select-none">
                              Primary
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setNewProduct(prev => ({
                                ...prev,
                                imageUrls: prev.imageUrls.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/85 text-white rounded-full transition-colors cursor-pointer border-0 flex items-center justify-center shadow-md animate-fade-in"
                            title="Remove Image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Dropzone */}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-250 hover:border-accent dark:border-zinc-800 dark:hover:border-accent rounded-xl cursor-pointer bg-white dark:bg-zinc-950 transition-colors p-4 text-center">
                    {isUploadingImages ? (
                      <div className="flex flex-col items-center justify-center space-y-1 text-zinc-400">
                        <RotateCw className="w-6 h-6 text-[#C9A87C] mb-1 animate-spin" />
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider font-logo">Uploading to Cloudinary...</p>
                        <p className="text-[9px] text-zinc-400">Please wait while files upload</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-1 text-zinc-400">
                        <Upload className="w-6 h-6 text-[#C9A87C] mb-1" />
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider font-logo">Upload Images</p>
                        <p className="text-[9px] text-zinc-400">PNG, JPG, JPEG (Select multiple)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImages}
                      className="hidden"
                    />
                  </label>

                  {/* Add via Paste URL */}
                  <div className="space-y-1 pt-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-450 dark:text-zinc-500 font-semibold block">Or paste Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="paste-image-url-input"
                        placeholder="e.g. https://images.unsplash.com/photo-..."
                        className="flex-1 text-xs p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 outline-none focus:border-zinc-400"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.target.value.trim();
                            if (val) {
                              setNewProduct(prev => ({
                                ...prev,
                                imageUrls: [...prev.imageUrls, val]
                              }));
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('paste-image-url-input');
                          if (input && input.value.trim()) {
                            setNewProduct(prev => ({
                              ...prev,
                              imageUrls: [...prev.imageUrls, input.value.trim()]
                            }));
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 rounded-lg text-xs font-bold hover:bg-zinc-850 dark:hover:bg-zinc-100 transition-colors border-0 cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sizes Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44'].map((size) => {
                      const isSelected = newProduct.sizes.includes(size);
                      return (
                        <button
                          type="button"
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`w-10 h-10 border rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900'
                              : 'border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-850 hover:bg-zinc-50'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors Hex Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">Theme Colors</label>
                  <div className="flex gap-3">
                    {[
                      { hex: '#111111', label: 'Noir Black' },
                      { hex: '#C9A87C', label: 'Luxury Gold' },
                      { hex: '#FFFFFF', label: 'Atelier White' },
                      { hex: '#F5F1EB', label: 'Ecrú Sand' },
                      { hex: '#EF4444', label: 'Red' }
                    ].map((c) => {
                      const isSelected = newProduct.colors.includes(c.hex);
                      return (
                        <button
                          type="button"
                          key={c.hex}
                          onClick={() => toggleColor(c.hex)}
                          style={{ backgroundColor: c.hex }}
                          className={`w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 relative flex items-center justify-center`}
                          title={c.label}
                        >
                          {isSelected && (
                            <Check className={`w-4 h-4 ${c.hex === '#FFFFFF' || c.hex === '#F5F1EB' ? 'text-black' : 'text-white'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tags input */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Search Tags</label>
                  <input
                    type="text"
                    value={newProduct.tags}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="jersey, esports, summer, limited"
                    className="w-full text-xs p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isUploadingImages}
                  className="w-full py-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow transition-colors disabled:opacity-50"
                >
                  {isUploadingImages ? (
                    <span className="flex items-center justify-center gap-2">
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      Uploading Images...
                    </span>
                  ) : (
                    editingProductId ? 'Update & Save Product' : 'Create & Publish Product'
                  )}
                </button>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
