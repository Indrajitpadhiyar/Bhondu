import React, { useContext, useState } from 'react';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist, addToCart, setQuickViewProduct } = useContext(ShopContext);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const favorited = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    // Quick add default first size and color
    addToCart(product, product.sizes[0], product.colors[0]);
  };

  return (
    <div 
      id={`product-${product.id}`}
      className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-secondary dark:border-zinc-800/80 rounded-xs overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area */}
      <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative aspect-[3/4] bg-secondary/20 dark:bg-zinc-850 overflow-hidden cursor-pointer"
      >
        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-4 left-4 z-10 bg-accent text-primary dark:text-zinc-950 text-[10px] font-bold px-2.5 py-1 tracking-widest uppercase">
            -{product.discount}% OFF
          </span>
        )}

        {/* Wishlist Toggle Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-4 right-4 z-10 p-2.5 rounded-full border border-secondary/20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md text-zinc-500 hover:text-red-500 hover:scale-110 transition-all cursor-pointer`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute bottom-16 right-4 z-10 p-2.5 rounded-full border border-secondary/20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md text-zinc-500 hover:text-accent hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 cursor-pointer"
          aria-label="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Actual Image Zoom */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Add To Cart slide-up banner */}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden h-12 z-20">
          <button
            onClick={handleQuickAdd}
            className="w-full h-full bg-primary/95 text-secondary dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hover:bg-accent dark:hover:bg-accent hover:text-primary dark:hover:text-primary cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>ADD TO BAG</span>
          </button>
        </div>
      </div>

      {/* Info details */}
      <div className="p-4 flex flex-col flex-grow bg-white dark:bg-zinc-900 transition-colors duration-300">
        <h3 
          onClick={() => navigate(`/product/${product.id}`)}
          className="text-xs font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200 hover:text-accent transition-colors line-clamp-1 mb-1 cursor-pointer"
        >
          {product.name}
        </h3>
        <p className="text-[10px] text-zinc-400 tracking-wider uppercase mb-3">
          {product.subcategory}
        </p>
        <div className="mt-auto flex items-center space-x-2.5">
          <span className="text-xs font-bold text-accent">${product.price}</span>
          {product.discount > 0 && (
            <span className="text-[10px] text-zinc-400 line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
