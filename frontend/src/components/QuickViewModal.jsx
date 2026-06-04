import React, { useContext, useState, useEffect } from 'react';
import { X, Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, isInWishlist, toggleWishlist } = useContext(ShopContext);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Sync state when product changes
  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(quickViewProduct.sizes[0]);
      setSelectedColor(quickViewProduct.colors[0]);
      setActiveImageIdx(0);
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const favorited = isInWishlist(quickViewProduct.id);

  const handleAddToBag = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    setQuickViewProduct(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop click closer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black"
        />

        {/* Modal body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative max-w-4xl w-full bg-white dark:bg-zinc-900 border border-secondary dark:border-zinc-800 shadow-2xl glass-modal z-10 flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:max-h-none overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full border border-secondary/25 text-zinc-500 hover:text-primary dark:text-zinc-100 hover:border-accent transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left panel: Product Images */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-center bg-secondary/10 dark:bg-zinc-950/20">
            <div className="aspect-[3/4] w-full overflow-hidden relative rounded-xs">
              <img
                src={quickViewProduct.images[activeImageIdx] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            
            {/* Gallery thumbnails */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex space-x-3 mt-4 justify-center">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-12 h-16 border rounded-xs overflow-hidden cursor-pointer ${activeImageIdx === idx ? 'border-accent ring-1 ring-accent' : 'border-secondary dark:border-zinc-800'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Details details */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-accent uppercase tracking-[0.25em]">
                {quickViewProduct.category} | {quickViewProduct.subcategory}
              </span>
              <h2 className="font-luxury-serif text-2xl font-bold uppercase tracking-wider text-primary dark:text-zinc-100 leading-tight">
                {quickViewProduct.name}
              </h2>
              
              {/* Ratings */}
              <div className="flex items-center space-x-4 text-xs text-zinc-400">
                <div className="flex items-center text-accent">
                  <Star className="w-4 h-4 fill-accent" />
                  <span className="ml-1.5 font-semibold">{quickViewProduct.rating}</span>
                </div>
                <span>({quickViewProduct.reviewsCount} REVIEWS)</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3.5">
                <span className="text-xl font-bold text-accent">${quickViewProduct.price}</span>
                {quickViewProduct.discount > 0 && (
                  <span className="text-sm text-zinc-400 line-through">${quickViewProduct.originalPrice}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed uppercase tracking-wider">
                {quickViewProduct.description}
              </p>

              {/* Sizing options */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">SELECT SIZE</h4>
                <div className="flex space-x-2">
                  {quickViewProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border text-xs font-bold transition-all cursor-pointer ${selectedSize === size ? 'border-primary bg-primary text-white dark:border-accent dark:bg-accent dark:text-primary' : 'border-secondary dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 hover:border-accent'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coloring options */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">SELECT COLOR</h4>
                <div className="flex space-x-3">
                  {quickViewProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full border border-secondary flex items-center justify-center relative cursor-pointer ${selectedColor === color ? 'ring-2 ring-accent' : ''}`}
                      aria-label={`Color ${color}`}
                    >
                      {selectedColor === color && (
                        <Check className="w-3 h-3 text-white mix-blend-difference" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions controls bottom */}
            <div className="mt-8 pt-6 border-t border-secondary dark:border-zinc-800 flex items-center space-x-4">
              {/* Quantity buttons */}
              <div className="flex items-center border border-secondary dark:border-zinc-800">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 text-zinc-500 hover:bg-secondary dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="text-xs font-bold px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-2 text-zinc-500 hover:bg-secondary dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToBag}
                className="flex-grow py-3 bg-primary text-secondary dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold uppercase tracking-widest hover:bg-accent dark:hover:bg-accent hover:text-primary dark:hover:text-primary transition-all rounded-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG</span>
              </button>

              {/* Add to Wishlist Toggle */}
              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className="p-3 border border-secondary dark:border-zinc-800 rounded-full hover:border-accent transition-colors text-zinc-500 hover:text-red-500 cursor-pointer"
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
