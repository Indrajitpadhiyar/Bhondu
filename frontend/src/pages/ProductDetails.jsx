import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Check, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck, HelpCircle, RefreshCw, Upload, X, Trash2, User, Camera, RotateCw } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { useGetProductDetailsQuery, useGetProductsQuery, useGetProductReviewsQuery, useAddReviewMutation, useDeleteReviewMutation, useUploadReviewImagesMutation } from '../services/productApi';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice.js';
import toast from 'react-hot-toast';

const MAN_APPAREL = [
  { size: 'XS', chest: { IN: '32 - 34', CM: '81 - 86' }, waist: { IN: '26 - 28', CM: '66 - 71' }, hips: { IN: '32 - 34', CM: '81 - 86' } },
  { size: 'S', chest: { IN: '35 - 37', CM: '89 - 94' }, waist: { IN: '29 - 31', CM: '74 - 79' }, hips: { IN: '35 - 37', CM: '89 - 94' } },
  { size: 'M', chest: { IN: '38 - 40', CM: '97 - 102' }, waist: { IN: '32 - 34', CM: '81 - 86' }, hips: { IN: '38 - 40', CM: '97 - 102' } },
  { size: 'L', chest: { IN: '41 - 43', CM: '104 - 109' }, waist: { IN: '35 - 37', CM: '89 - 94' }, hips: { IN: '41 - 43', CM: '104 - 109' } },
  { size: 'XL', chest: { IN: '44 - 46', CM: '112 - 117' }, waist: { IN: '38 - 40', CM: '97 - 102' }, hips: { IN: '44 - 46', CM: '112 - 117' } },
  { size: 'XXL', chest: { IN: '47 - 49', CM: '119 - 124' }, waist: { IN: '41 - 43', CM: '104 - 109' }, hips: { IN: '47 - 49', CM: '119 - 124' } }
];

const WOMAN_APPAREL = [
  { size: 'XS', chest: { IN: '30 - 32', CM: '76 - 81' }, waist: { IN: '23 - 25', CM: '58 - 63' }, hips: { IN: '33 - 35', CM: '84 - 89' } },
  { size: 'S', chest: { IN: '33 - 35', CM: '84 - 89' }, waist: { IN: '26 - 28', CM: '66 - 71' }, hips: { IN: '36 - 38', CM: '91 - 96' } },
  { size: 'M', chest: { IN: '36 - 38', CM: '91 - 96' }, waist: { IN: '29 - 31', CM: '74 - 79' }, hips: { IN: '39 - 41', CM: '99 - 104' } },
  { size: 'L', chest: { IN: '39 - 41', CM: '99 - 104' }, waist: { IN: '32 - 34', CM: '81 - 86' }, hips: { IN: '42 - 44', CM: '107 - 112' } },
  { size: 'XL', chest: { IN: '42 - 44', CM: '107 - 112' }, waist: { IN: '35 - 37', CM: '89 - 94' }, hips: { IN: '45 - 47', CM: '114 - 119' } }
];

const SHOE_SIZES = [
  { us: '7', uk: '6', eu: '40', cm: '25.0', in: '9.8' },
  { us: '8', uk: '7', eu: '41', cm: '26.0', in: '10.2' },
  { us: '9', uk: '8', eu: '42.5', cm: '27.0', in: '10.6' },
  { us: '10', uk: '9', eu: '44', cm: '28.0', in: '11.0' },
  { us: '11', uk: '10', eu: '45', cm: '29.0', in: '11.4' },
  { us: '12', uk: '11', eu: '46', cm: '30.0', in: '11.8' }
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, isInWishlist, toggleWishlist, setIsCartOpen } = useContext(ShopContext);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Find the current product
  const { data: product, isLoading: isProductLoading } = useGetProductDetailsQuery(id);
  const { data: allProducts = [] } = useGetProductsQuery({ gender: product?.gender, category: product?.category }, { skip: !product });

  // States
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit, setSizeUnit] = useState('IN');

  // Review states
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewImagePreviews, setReviewImagePreviews] = useState([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Review API hooks
  const { data: reviewsData, refetch: refetchReviews } = useGetProductReviewsQuery(
    { productId: id },
    { skip: !id }
  );
  const [addReview] = useAddReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [uploadReviewImages] = useUploadReviewImagesMutation();

  const reviews = reviewsData?.reviews || [];
  const reviewTotal = reviewsData?.total || 0;
  const starCounts = reviewsData?.starCounts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  // Review image file select handler
  const handleReviewImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (reviewImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed per review.');
      return;
    }
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setReviewImages(prev => [...prev, ...files]);
    setReviewImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeReviewImage = (idx) => {
    setReviewImages(prev => prev.filter((_, i) => i !== idx));
    setReviewImagePreviews(prev => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewRating) {
      toast.error('Please select a star rating.');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Please write a comment.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      let imageUrls = [];
      // Upload images to Cloudinary first if any
      if (reviewImages.length > 0) {
        const formData = new FormData();
        reviewImages.forEach(file => formData.append('images', file));
        imageUrls = await uploadReviewImages(formData).unwrap();
      }

      await addReview({
        productId: product.id,
        reviewData: {
          rating: reviewRating,
          comment: reviewComment.trim(),
          images: imageUrls,
        },
      }).unwrap();

      toast.success('Review submitted successfully!');
      setReviewRating(0);
      setReviewComment('');
      setReviewImages([]);
      setReviewImagePreviews([]);
      refetchReviews();
    } catch (err) {
      toast.error(err.data?.data?.message || err.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReview({ productId: product.id, reviewId }).unwrap();
      toast.success('Review deleted.');
      refetchReviews();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to delete review.');
    }
  };

  // Scroll to top and reset configuration when product ID changes or product finishes loading
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
      setActiveImageIdx(0);
      setQuantity(1);
    }
  }, [id, product]);

  if (isProductLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
        <h2 className="font-luxury-serif text-3xl font-bold uppercase tracking-wider text-zinc-400">Product Not Found</h2>
        <p className="text-xs text-zinc-500 uppercase tracking-widest">The product you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/man')}
          className="px-8 py-4 bg-primary text-secondary dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold uppercase tracking-widest hover:bg-accent dark:hover:bg-accent hover:text-primary dark:hover:text-primary transition-all cursor-pointer"
        >
          Back To Shop
        </button>
      </div>
    );
  }

  const favorited = isInWishlist(product.id);

  const handleAddToBag = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart.");
      navigate('/login', { state: { from: location } });
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to buy items.");
      navigate('/login', { state: { from: location } });
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsCartOpen(true);
  };

  // Get related products (same category & gender, excluding current item)
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="w-full bg-white dark:bg-zinc-950 transition-colors duration-300">
      
      {/* ==================== BREADCRUMBS & BACK BUTTON ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-secondary dark:border-zinc-800 pb-4">
          {/* Back Action */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-accent transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          
          {/* Path Links */}
          <div className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 flex items-center space-x-2.5">
            <Link to="/" className="hover:text-accent transition-colors">HOME</Link>
            <span>/</span>
            <Link to={product.gender === 'man' ? '/man' : '/women'} className="hover:text-accent transition-colors">{product.gender.toUpperCase()}</Link>
            <span>/</span>
            <span className="text-zinc-500 dark:text-zinc-300">{product.name}</span>
          </div>
        </div>
      </div>

      {/* ==================== PRODUCT DISPLAY SPLIT LAYOUT ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left Side: Dynamic Gallery */}
          <div className="space-y-6">
            <div className="aspect-[3/4] w-full overflow-hidden relative rounded-sm bg-secondary/15 dark:bg-zinc-900 border border-secondary dark:border-zinc-800 flex items-center justify-center">
              {/* Promo Discount Badge */}
              {product.discount > 0 && (
                <span className="absolute top-6 left-6 z-10 bg-accent text-primary dark:text-zinc-950 text-[10px] font-bold px-3 py-1.5 tracking-widest uppercase">
                  -{product.discount}% OFF
                </span>
              )}
              
              {/* Wishlist Floating Button */}
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error("Please login to manage your wishlist.");
                    navigate('/login', { state: { from: location } });
                    return;
                  }
                  toggleWishlist(product.id);
                }}
                className="absolute top-6 right-6 z-10 p-3 rounded-full border border-secondary/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-500 hover:text-red-500 hover:scale-110 transition-all cursor-pointer shadow-sm"
                aria-label="Add to wishlist"
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              {/* Main Active Image with zoom-on-hover */}
              <motion.img
                key={activeImageIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                src={product.images[activeImageIdx]}
                alt={product.name}
                className="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-500 ease-out cursor-zoom-in"
              />
            </div>

            {/* Gallery Thumbnails List */}
            {product.images.length > 1 && (
              <div className="flex space-x-3.5 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-20 border rounded-sm overflow-hidden transition-all duration-300 cursor-pointer ${activeImageIdx === idx ? 'border-accent ring-1 ring-accent' : 'border-secondary dark:border-zinc-800/80 hover:border-accent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Product Details & Actions */}
          <div className="flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Category Subtext */}
              <div className="text-[10px] font-bold text-accent uppercase tracking-[0.25em]">
                {product.category} | {product.subcategory}
              </div>
              
              {/* Title */}
              <h1 className="font-luxury-serif text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-primary dark:text-zinc-100 leading-tight m-0">
                {product.name}
              </h1>

              {/* Ratings and Reviews */}
              <div className="flex items-center space-x-4 text-xs tracking-wider text-zinc-400">
                <div className="flex items-center text-accent">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="ml-1.5 font-bold">{product.rating}</span>
                </div>
                <span>/</span>
                <span className="uppercase">{product.reviewsCount} REVIEWS</span>
              </div>

              {/* Pricing */}
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-accent">₹{product.price}</span>
                {product.discount > 0 && (
                  <span className="text-sm text-zinc-400 line-through">₹{product.originalPrice}</span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed uppercase tracking-widest font-light">
                {product.description}
              </p>              {/* Sizing options */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <span>SELECT SIZE</span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-accent underline hover:text-zinc-350 cursor-pointer text-[10px] font-bold uppercase"
                  >
                    {showSizeGuide ? 'HIDE SIZE GUIDE' : 'SIZE GUIDE'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 border text-xs font-bold transition-all cursor-pointer ${selectedSize === size ? 'border-primary bg-primary text-white dark:border-accent dark:bg-accent dark:text-primary' : 'border-secondary dark:border-zinc-800 text-zinc-650 dark:text-zinc-350 hover:border-accent'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Animated Inline Size Guide */}
                <AnimatePresence>
                  {showSizeGuide && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden border border-secondary dark:border-zinc-850 p-4 rounded-sm bg-secondary/5 dark:bg-zinc-900/5 text-left space-y-4"
                    >
                      <div className="flex justify-between items-center text-[9px] tracking-widest uppercase font-semibold text-zinc-400">
                        <span className="font-bold text-accent">
                          {product.category?.toLowerCase() === 'shoes' ? 'SHOE SIZING' : `${product.gender.toUpperCase()} APPAREL SIZING`}
                        </span>
                        {/* Unit Switcher */}
                        <div className="flex bg-secondary/55 dark:bg-zinc-900/55 p-0.5 rounded-sm border border-secondary dark:border-zinc-800">
                          <button
                            type="button"
                            onClick={() => setSizeUnit('IN')}
                            className={`px-2 py-0.5 text-[8px] font-bold transition-all cursor-pointer ${sizeUnit === 'IN' ? 'bg-primary text-white dark:bg-accent dark:text-primary' : 'text-zinc-500'}`}
                          >
                            IN
                          </button>
                          <button
                            type="button"
                            onClick={() => setSizeUnit('CM')}
                            className={`px-2 py-0.5 text-[8px] font-bold transition-all cursor-pointer ${sizeUnit === 'CM' ? 'bg-primary text-white dark:bg-accent dark:text-primary' : 'text-zinc-500'}`}
                          >
                            CM
                          </button>
                        </div>
                      </div>

                      {product.category?.toLowerCase() === 'shoes' ? (
                        <table className="w-full text-[9px] tracking-wider uppercase border-collapse text-left">
                          <thead>
                            <tr className="border-b border-secondary dark:border-zinc-800 text-zinc-455 font-bold">
                              <th className="py-2 px-1">US</th>
                              <th className="py-2 px-1">UK</th>
                              <th className="py-2 px-1">EU</th>
                              <th className="py-2 px-1">LENGTH</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-secondary dark:divide-zinc-900">
                            {SHOE_SIZES.map((row, idx) => (
                              <tr key={idx} className="hover:bg-secondary/20 dark:hover:bg-zinc-900/30 transition-colors">
                                <td className="py-2 px-1 font-bold text-accent">US {row.us}</td>
                                <td className="py-2 px-1 text-zinc-500">UK {row.uk}</td>
                                <td className="py-2 px-1 text-zinc-500">EU {row.eu}</td>
                                <td className="py-2 px-1 text-zinc-550 dark:text-zinc-300">
                                  {sizeUnit === 'IN' ? `${row.in} IN` : `${row.cm} CM`}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <table className="w-full text-[9px] tracking-wider uppercase border-collapse text-left">
                          <thead>
                            <tr className="border-b border-secondary dark:border-zinc-800 text-zinc-455 font-bold">
                              <th className="py-2 px-1">SIZE</th>
                              <th className="py-2 px-1">CHEST ({sizeUnit})</th>
                              <th className="py-2 px-1">WAIST ({sizeUnit})</th>
                              <th className="py-2 px-1">HIPS ({sizeUnit})</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-secondary dark:divide-zinc-900">
                            {(product.gender === 'women' ? WOMAN_APPAREL : MAN_APPAREL).map((row, idx) => (
                              <tr key={idx} className="hover:bg-secondary/20 dark:hover:bg-zinc-900/30 transition-colors">
                                <td className="py-2 px-1 font-bold text-accent">{row.size}</td>
                                <td className="py-2 px-1 text-zinc-550 dark:text-zinc-300">{row.chest[sizeUnit]}</td>
                                <td className="py-2 px-1 text-zinc-550 dark:text-zinc-300">{row.waist[sizeUnit]}</td>
                                <td className="py-2 px-1 text-zinc-550 dark:text-zinc-300">{row.hips[sizeUnit]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Coloring options */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">SELECT COLOR</h4>
                <div className="flex space-x-3.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-7 h-7 rounded-full border border-secondary dark:border-zinc-800 flex items-center justify-center relative cursor-pointer shadow-inner transition-transform hover:scale-105 ${selectedColor === color ? 'ring-2 ring-accent' : ''}`}
                      aria-label={`Color ${color}`}
                    >
                      {selectedColor === color && (
                        <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stepper Quantity & CTA Actions */}
            <div className="space-y-6 pt-6 border-t border-secondary dark:border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Quantity buttons */}
                <div className="flex items-center justify-between border border-secondary dark:border-zinc-800 bg-secondary/20 dark:bg-zinc-900/20 w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-3 text-zinc-500 hover:bg-secondary dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold px-6">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-3 text-zinc-500 hover:bg-secondary dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToBag}
                  className="flex-grow py-3.5 bg-primary text-secondary dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold uppercase tracking-widest hover:bg-accent dark:hover:bg-accent hover:text-primary dark:hover:text-primary transition-all rounded-xs flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </button>
              </div>

              {/* Buy Now & Wishlist Control row */}
              <div className="flex items-center space-x-3.5">
                <button
                  onClick={handleBuyNow}
                  className="flex-grow py-3 bg-accent text-primary dark:text-zinc-950 text-xs font-bold uppercase tracking-widest hover:bg-white dark:hover:bg-white transition-all rounded-xs flex items-center justify-center space-x-2 cursor-pointer border border-accent hover:border-white"
                >
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>

            {/* Premium Information Accordions / Tabs */}
            <div className="pt-8 border-t border-secondary dark:border-zinc-800 space-y-4">
              <div className="flex border-b border-secondary dark:border-zinc-800 text-xs tracking-widest uppercase font-semibold">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-3 pr-6 transition-colors relative cursor-pointer ${activeTab === 'details' ? 'text-accent' : 'text-zinc-400 hover:text-primary dark:hover:text-zinc-100'}`}
                >
                  <span>DETAILS</span>
                  {activeTab === 'details' && <div className="absolute bottom-0 left-0 right-6 h-[1.5px] bg-accent" />}
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-3 px-6 transition-colors relative cursor-pointer ${activeTab === 'shipping' ? 'text-accent' : 'text-zinc-400 hover:text-primary dark:hover:text-zinc-100'}`}
                >
                  <span>SHIPPING</span>
                  {activeTab === 'shipping' && <div className="absolute bottom-0 left-6 right-6 h-[1.5px] bg-accent" />}
                </button>
                <button
                  onClick={() => setActiveTab('sustainability')}
                  className={`pb-3 px-6 transition-colors relative cursor-pointer ${activeTab === 'sustainability' ? 'text-accent' : 'text-zinc-400 hover:text-primary dark:hover:text-zinc-100'}`}
                >
                  <span>ECOLOGY</span>
                  {activeTab === 'sustainability' && <div className="absolute bottom-0 left-6 right-6 h-[1.5px] bg-accent" />}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 px-6 transition-colors relative cursor-pointer ${activeTab === 'reviews' ? 'text-accent' : 'text-zinc-400 hover:text-primary dark:hover:text-zinc-100'}`}
                >
                  <span>REVIEWS ({reviewTotal})</span>
                  {activeTab === 'reviews' && <div className="absolute bottom-0 left-6 right-6 h-[1.5px] bg-accent" />}
                </button>
              </div>

              <div className="py-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed uppercase tracking-wider">
                <AnimatePresence mode="wait">
                  {activeTab === 'details' && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      <p>• Engineered standard fit coordinates with active ergonomics.</p>
                      <p>• Materials: 100% fine cotton fiber Sublimation panels.</p>
                      <p>• Care: Machine wash cold inside out, iron flat low.</p>
                    </motion.div>
                  )}
                  {activeTab === 'shipping' && (
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      <p>• Free express courier shipping on orders exceeding ₹10,000.</p>
                      <p>• Delivered inside signature premium carbon audit packaging box.</p>
                      <p>• Easy returns and replacements within 30 days of dispatch date.</p>
                    </motion.div>
                  )}
                  {activeTab === 'sustainability' && (
                    <motion.div
                      key="sustainability"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      <p>• Constructed using 100% GOTS certified organic fibers.</p>
                      <p>• Zero waste technical patterns reducing fabric leftovers by 15%.</p>
                      <p>• Low impact organic colors minimizing waste chemical footprints.</p>
                    </motion.div>
                  )}
                  {activeTab === 'reviews' && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8 normal-case tracking-normal"
                    >
                      {/* ===== Rating Summary Bar ===== */}
                      <div className="flex flex-col sm:flex-row gap-8 items-start">
                        {/* Big average */}
                        <div className="flex flex-col items-center gap-1 min-w-[100px]">
                          <span className="text-5xl font-bold text-primary dark:text-zinc-100 font-luxury-serif">{product.rating || 0}</span>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating || 0) ? 'fill-accent text-accent' : 'text-zinc-300 dark:text-zinc-700'}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold mt-1">{reviewTotal} reviews</span>
                        </div>

                        {/* Star distribution bars */}
                        <div className="flex-1 space-y-1.5 w-full">
                          {[5,4,3,2,1].map(star => {
                            const count = starCounts[star] || 0;
                            const pct = reviewTotal > 0 ? (count / reviewTotal) * 100 : 0;
                            return (
                              <div key={star} className="flex items-center gap-2.5 text-xs">
                                <span className="text-zinc-500 dark:text-zinc-400 font-semibold w-4 text-right">{star}</span>
                                <Star className="w-3 h-3 fill-accent text-accent" />
                                <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    className="h-full bg-accent rounded-full"
                                  />
                                </div>
                                <span className="text-zinc-400 font-medium w-6 text-right text-[11px]">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* ===== Write a Review Form ===== */}
                      {isAuthenticated ? (
                        <form onSubmit={handleReviewSubmit} className="border border-secondary/50 dark:border-zinc-800 rounded-sm p-5 space-y-4 bg-secondary/5 dark:bg-zinc-900/30">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-accent">Write a Review</h4>

                          {/* Star rating selector */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">Your Rating</label>
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(s => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setReviewRating(s)}
                                  onMouseEnter={() => setReviewHover(s)}
                                  onMouseLeave={() => setReviewHover(0)}
                                  className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                                >
                                  <Star className={`w-6 h-6 transition-colors ${s <= (reviewHover || reviewRating) ? 'fill-accent text-accent' : 'text-zinc-300 dark:text-zinc-700'}`} />
                                </button>
                              ))}
                              {reviewRating > 0 && (
                                <span className="text-xs text-zinc-500 ml-2 self-center font-medium">
                                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Comment textarea */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">Your Review</label>
                            <textarea
                              rows="3"
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="Share your experience with this product..."
                              maxLength={1000}
                              className="w-full text-xs p-3 border border-secondary/50 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 focus:outline-none focus:border-accent resize-none text-zinc-700 dark:text-zinc-200"
                            />
                            <span className="text-[9px] text-zinc-400 block text-right">{reviewComment.length}/1000</span>
                          </div>

                          {/* Image upload for review */}
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">Add Photos (Optional, max 5)</label>

                            {/* Preview thumbnails */}
                            {reviewImagePreviews.length > 0 && (
                              <div className="flex gap-2 flex-wrap">
                                {reviewImagePreviews.map((url, idx) => (
                                  <div key={idx} className="relative w-16 h-16 rounded-sm border border-secondary/50 dark:border-zinc-800 overflow-hidden group">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => removeReviewImage(idx)}
                                      className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {reviewImages.length < 5 && (
                              <label className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-secondary/50 dark:border-zinc-800 rounded-sm cursor-pointer hover:border-accent transition-colors bg-white dark:bg-zinc-950">
                                <Camera className="w-4 h-4 text-accent" />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Upload Photos</span>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleReviewImageSelect}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>

                          {/* Submit button */}
                          <button
                            type="submit"
                            disabled={isSubmittingReview}
                            className="w-full py-3 bg-primary text-secondary dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold uppercase tracking-widest hover:bg-accent dark:hover:bg-accent hover:text-primary transition-all rounded-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {isSubmittingReview ? (
                              <><RotateCw className="w-3.5 h-3.5 animate-spin" /> Submitting...</>
                            ) : (
                              'Submit Review'
                            )}
                          </button>
                        </form>
                      ) : (
                        <div className="border border-dashed border-secondary/50 dark:border-zinc-800 rounded-sm p-6 text-center space-y-3">
                          <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Login to write a review</p>
                          <button
                            onClick={() => navigate('/login', { state: { from: location } })}
                            className="px-6 py-2.5 bg-primary text-secondary dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold uppercase tracking-widest hover:bg-accent dark:hover:bg-accent hover:text-primary transition-all cursor-pointer"
                          >
                            Sign In
                          </button>
                        </div>
                      )}

                      {/* ===== Review List ===== */}
                      {reviews.length > 0 ? (
                        <div className="space-y-6">
                          {reviews.map((rev) => (
                            <div key={rev._id} className="border-b border-secondary/30 dark:border-zinc-800/50 pb-6 last:border-0 last:pb-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  {/* Avatar */}
                                  <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center border border-secondary/30 dark:border-zinc-700">
                                    {rev.user?.avatar?.url ? (
                                      <img src={rev.user.avatar.url} alt={rev.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <User className="w-4 h-4 text-zinc-400" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-primary dark:text-zinc-100">{rev.user?.name || 'Customer'}</p>
                                    <p className="text-[10px] text-zinc-400">{new Date(rev.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* Stars */}
                                  <div className="flex gap-0.5">
                                    {[1,2,3,4,5].map(s => (
                                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-accent text-accent' : 'text-zinc-300 dark:text-zinc-700'}`} />
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Comment */}
                              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-3 leading-relaxed">{rev.comment}</p>

                              {/* Review images */}
                              {rev.images && rev.images.length > 0 && (
                                <div className="flex gap-2 mt-3 flex-wrap">
                                  {rev.images.map((img, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => setLightboxImage(img)}
                                      className="w-16 h-16 rounded-sm border border-secondary/40 dark:border-zinc-800 overflow-hidden cursor-pointer hover:ring-1 hover:ring-accent transition-all"
                                    >
                                      <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">No reviews yet. Be the first to review!</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ==================== IMAGE LIGHTBOX ==================== */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={lightboxImage}
              alt="Review"
              className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== YOU MAY ALSO LIKE / RELATED ITEMS ==================== */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-secondary dark:border-zinc-800 mt-12">
          <div className="space-y-2 text-center mb-12">
            <span className="text-[10px] font-bold text-accent tracking-[0.25em] uppercase">Browse more</span>
            <h3 className="font-luxury-serif text-2xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
              YOU MAY ALSO LIKE
            </h3>
            <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
