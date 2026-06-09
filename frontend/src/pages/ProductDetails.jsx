import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Check, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck, HelpCircle, RefreshCw } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { useGetProductDetailsQuery, useGetProductsQuery } from '../services/productApi';
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
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>

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
