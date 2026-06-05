import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Heart, ShoppingBag, User, Menu, X,
  Trash2, Plus, Minus, Moon, Sun, ArrowRight, ShoppingCart
} from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { products } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const {
    cartItems,
    wishlist,
    isDarkMode,
    isCartOpen,
    isWishlistOpen,
    isSearchOpen,
    isMobileMenuOpen,
    searchQuery,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    toggleDarkMode,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsMobileMenuOpen,
    setSearchQuery,
    cartCount,
    cartTotal,
    addToCart
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const location = useLocation();

  // Profile dropdown open state
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Quick helper to determine active link
  const isActive = (path) => location.pathname === path;

  const currentGender = location.pathname.includes('women') ? 'women' : location.pathname.includes('man') ? 'man' : null;

  // Filter cart items by active section gender
  const displayCartItems = cartItems.filter(item => {
    const product = products.find(p => p.id === item.id);
    return currentGender ? product?.gender === currentGender : true;
  });

  const displayCartCount = displayCartItems.reduce((acc, item) => acc + item.quantity, 0);
  const displayCartTotal = displayCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Filter wishlist items by active section gender
  const displayWishlist = wishlist.filter(id => {
    const product = products.find(p => p.id === id);
    return currentGender ? product?.gender === currentGender : true;
  });

  // Filtered products for search overlay (only matching the current active gender section if inside one)
  const searchResults = searchQuery.trim() === ''
    ? []
    : products.filter(p => {
      const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGender = currentGender ? p.gender === currentGender : true;
      return matchesQuery && matchesGender;
    }).slice(0, 5);

  const handleSearchItemClick = (gender, productId) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const handleCategoryNav = (categoryName) => {
    // Navigate to Man or Women depending on current view context, or fallback to Man
    const currentGender = location.pathname.includes('women') ? 'women' : 'man';
    navigate(`/${currentGender === 'women' ? 'women' : 'man'}?category=${encodeURIComponent(categoryName)}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Sticky Glass Navbar */}
      <nav className="sticky top-0 left-0 right-0 z-50 glass-nav border-b border-secondary/45 dark:border-zinc-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Left Section: Mobile Menu Trigger & Main Links */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-primary dark:text-zinc-100 hover:text-accent transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Desktop Menu Navigation Links (Hiding Men/Women links since departments are isolated) */}
              <div className="hidden lg:flex lg:space-x-8 xl:space-x-10 text-xs font-semibold tracking-widest uppercase">
                <Link
                  to="/"
                  className={`hover:text-accent transition-colors py-2 ${isActive('/') ? 'text-accent border-b border-accent' : 'text-primary dark:text-zinc-100'}`}
                >
                  Home
                </Link>
                <button
                  onClick={() => handleCategoryNav('Tournament Wear')}
                  className="hover:text-accent transition-colors py-2 text-primary dark:text-zinc-100 cursor-pointer"
                >
                  Tournament Wear
                </button>
                <button
                  onClick={() => handleCategoryNav('T-Shirts')}
                  className="hover:text-accent transition-colors py-2 text-primary dark:text-zinc-100 cursor-pointer"
                >
                  T-Shirts
                </button>
                <button
                  onClick={() => handleCategoryNav('Shirts')}
                  className="hover:text-accent transition-colors py-2 text-primary dark:text-zinc-100 cursor-pointer"
                >
                  Shirts
                </button>
                <button
                  onClick={() => handleCategoryNav('Shoes')}
                  className="hover:text-accent transition-colors py-2 text-primary dark:text-zinc-100 cursor-pointer"
                >
                  Shoes
                </button>
              </div>
            </div>

            {/* Center Section: BRAND LOGO */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link
                to="/"
                className="flex items-center space-x-3 flavors-extrabold text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.1em] sm:tracking-[0.25em] text-primary dark:text-zinc-100 hover:text-accent transition-colors"
              >
                <span>BHONDU</span>
              </Link>
            </div>

            {/* Right Section: Icons Controls */}
            <div className="flex items-center space-x-3 sm:space-x-5">

              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-primary dark:text-zinc-100 hover:text-accent transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="hidden sm:block p-2 text-primary dark:text-zinc-100 hover:text-accent transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Wishlist Trigger */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="hidden sm:block p-2 text-primary dark:text-zinc-100 hover:text-accent transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {displayWishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
                )}
              </button>

              {/* Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-primary dark:text-zinc-100 hover:text-accent transition-colors relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {displayCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-primary dark:text-zinc-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-luxury-sans">
                    {displayCartCount}
                  </span>
                )}
              </button>

              {/* Profile Toggle */}
              <div className="hidden sm:block relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 text-primary dark:text-zinc-100 hover:text-accent transition-colors"
                  aria-label="Profile menu"
                >
                  <User className="w-5 h-5" />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-secondary dark:border-zinc-800 shadow-2xl py-2 z-50 rounded-sm text-xs tracking-wider"
                      >
                        <a href="#profile" className="block px-4 py-2 text-zinc-700 dark:text-zinc-200 hover:bg-secondary dark:hover:bg-zinc-800 transition-colors">MY PROFILE</a>
                        <a href="#orders" className="block px-4 py-2 text-zinc-700 dark:text-zinc-200 hover:bg-secondary dark:hover:bg-zinc-800 transition-colors">MY ORDERS</a>
                        <a href="#settings" className="block px-4 py-2 text-zinc-700 dark:text-zinc-200 hover:bg-secondary dark:hover:bg-zinc-800 transition-colors">SETTINGS</a>
                        <div className="border-t border-secondary dark:border-zinc-800 my-1" />
                        <button onClick={() => { setIsProfileOpen(false); alert('Profile logged out simulated'); }} className="w-full text-left block px-4 py-2 text-red-500 hover:bg-secondary dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                          LOG OUT
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* ==================== DRAWERS & OVERLAYS ==================== */}

      {/* 1. Mobile Side Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-[100]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-zinc-950 shadow-2xl z-[101] flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-black border border-accent/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src="/bhondu_logo.png"
                      alt="BHONDU Logo"
                      className="w-full h-full object-cover scale-105"
                    />
                  </div>
                  <span className="font-luxury-serif text-2xl font-bold tracking-[0.2em] text-primary dark:text-zinc-100">BHONDU</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-500 hover:text-primary dark:text-zinc-100 cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col space-y-6 text-sm font-semibold tracking-widest uppercase">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent transition-colors py-2 text-primary dark:text-zinc-100 border-b border-secondary dark:border-zinc-800">Home</Link>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent transition-colors py-2 text-primary dark:text-zinc-100 border-b border-secondary dark:border-zinc-800">About</Link>
                <button onClick={() => handleCategoryNav('Tournament Wear')} className="text-left hover:text-accent transition-colors py-2 text-primary dark:text-zinc-100 border-b border-secondary dark:border-zinc-800 cursor-pointer">Tournament Wear</button>
                <button onClick={() => handleCategoryNav('T-Shirts')} className="text-left hover:text-accent transition-colors py-2 text-primary dark:text-zinc-100 border-b border-secondary dark:border-zinc-800 cursor-pointer">T-Shirts</button>
                <button onClick={() => handleCategoryNav('Shirts')} className="text-left hover:text-accent transition-colors py-2 text-primary dark:text-zinc-100 border-b border-secondary dark:border-zinc-800 cursor-pointer">Shirts</button>
                <button onClick={() => handleCategoryNav('Shoes')} className="text-left hover:text-accent transition-colors py-2 text-primary dark:text-zinc-100 border-b border-secondary dark:border-zinc-800 cursor-pointer">Shoes</button>
              </div>

              {/* Mobile Drawer Actions (Wishlist, Dark Mode, Profile) */}
              <div className="mt-8 pt-6 border-t border-secondary dark:border-zinc-800 flex flex-col space-y-4 text-xs font-semibold tracking-widest uppercase">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsWishlistOpen(true); }}
                  className="flex items-center space-x-3 text-primary dark:text-zinc-100 hover:text-accent py-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4" />
                  <span>Wishlist ({displayWishlist.length})</span>
                </button>
                
                <button
                  onClick={() => { toggleDarkMode(); }}
                  className="flex items-center space-x-3 text-primary dark:text-zinc-100 hover:text-accent py-2 cursor-pointer"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <div className="border-t border-secondary dark:border-zinc-800 my-2" />

                <div className="space-y-3 pl-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <a href="#profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 hover:text-accent py-1.5">
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </a>
                  <a href="#orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 hover:text-accent py-1.5">
                    <ShoppingBag className="w-4 h-4" />
                    <span>My Orders</span>
                  </a>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); alert('Profile logged out simulated'); }}
                    className="w-full text-left flex items-center space-x-3 text-red-500 hover:text-red-650 py-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>

              <div className="mt-auto pt-6 text-[10px] text-zinc-400 uppercase tracking-widest text-center">
                © {new Date().getFullYear()} BHONDU Luxury
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. Fullscreen Blur Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg flex flex-col p-6 sm:p-12 md:p-24 overflow-y-auto"
          >
            <div className="flex justify-end mb-8">
              <button
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="p-3 border border-secondary dark:border-zinc-800 rounded-full text-zinc-500 hover:text-primary dark:text-zinc-100 hover:border-accent transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="max-w-2xl mx-auto w-full">
              <p className="text-[10px] font-bold tracking-[0.25em] text-accent uppercase mb-2">Search BHONDU Store</p>
              <div className="relative border-b-2 border-accent dark:border-accent/40 focus-within:border-accent/100 py-3 flex items-center">
                <input
                  type="text"
                  placeholder="WHAT ARE YOU LOOKING FOR?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-luxury-serif text-xl sm:text-3xl tracking-widest text-primary dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-700 uppercase"
                  autoFocus
                />
                <Search className="w-6 h-6 text-accent ml-4" />
              </div>

              {/* Dynamic Search Results */}
              <div className="mt-12">
                {searchResults.length > 0 ? (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 border-b border-secondary dark:border-zinc-800 pb-2">SUGGESTIONS</h3>
                    <div className="space-y-4">
                      {searchResults.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleSearchItemClick(p.gender, p.id)}
                          className="flex items-center justify-between p-3 border border-secondary dark:border-zinc-800/50 rounded-sm hover:border-accent cursor-pointer group transition-all"
                        >
                          <div className="flex items-center space-x-4">
                            <img src={p.images[0]} alt={p.name} className="w-12 h-14 object-cover grayscale group-hover:grayscale-0 transition-all rounded-xs" />
                            <div>
                              <p className="text-xs font-bold tracking-wider text-primary dark:text-zinc-100 group-hover:text-accent transition-colors">{p.name.toUpperCase()}</p>
                              <p className="text-[10px] text-zinc-400 tracking-widest uppercase">{p.category} | {p.subcategory}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-accent">${p.price}</span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-accent transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : searchQuery.trim() !== '' ? (
                  <p className="text-sm tracking-widest text-zinc-400 text-center py-12">NO PRODUCTS FOUND MATCHING YOUR SEARCH.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold tracking-widest uppercase text-zinc-500">
                    <button onClick={() => { setSearchQuery('jersey'); }} className="p-4 border border-secondary dark:border-zinc-800 text-center hover:border-accent hover:text-accent cursor-pointer">JERSEYS</button>
                    <button onClick={() => { setSearchQuery('linen'); }} className="p-4 border border-secondary dark:border-zinc-800 text-center hover:border-accent hover:text-accent cursor-pointer">LINEN SHIRTS</button>
                    <button onClick={() => { setSearchQuery('sneakers'); }} className="p-4 border border-secondary dark:border-zinc-800 text-center hover:border-accent hover:text-accent cursor-pointer">SNEAKERS</button>
                    <button onClick={() => { setSearchQuery('oversized'); }} className="p-4 border border-secondary dark:border-zinc-800 text-center hover:border-accent hover:text-accent cursor-pointer">OVERSIZED TEES</button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Slide-out Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-zinc-950 shadow-2xl z-[101] flex flex-col"
            >
              <div className="p-6 border-b border-secondary dark:border-zinc-800 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-accent" />
                  <span className="font-luxury-sans text-xs font-bold tracking-widest uppercase text-primary dark:text-zinc-100">SHOPPING BAG ({displayCartCount})</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 text-zinc-500 hover:text-primary dark:text-zinc-100 cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {displayCartItems.length > 0 ? (
                  displayCartItems.map((item) => (
                    <div key={item.key} className="flex space-x-4 border-b border-secondary/50 dark:border-zinc-800/50 pb-6 last:border-b-0">
                      <img
                        onClick={() => { setIsCartOpen(false); navigate(`/product/${item.id}`); }}
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-24 object-cover rounded-xs cursor-pointer hover:opacity-85 transition-opacity"
                      />
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between">
                            <h4
                              onClick={() => { setIsCartOpen(false); navigate(`/product/${item.id}`); }}
                              className="text-xs font-bold uppercase tracking-wider text-primary dark:text-zinc-100 cursor-pointer hover:text-accent transition-colors"
                            >
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.key)}
                              className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[10px] text-zinc-400 tracking-wider uppercase mt-1">SIZE: {item.size} | COLOR: {item.color}</p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center border border-secondary dark:border-zinc-800">
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              className="p-1 px-2 hover:bg-secondary dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs px-3 font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              className="p-1 px-2 hover:bg-secondary dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs font-bold text-accent">${item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <ShoppingBag className="w-12 h-12 text-zinc-300 dark:text-zinc-700 stroke-[1]" />
                    <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">YOUR SHOPPING BAG IS EMPTY</p>
                    <button
                      onClick={() => { setIsCartOpen(false); navigate('/man'); }}
                      className="px-6 py-3 border border-primary dark:border-zinc-100 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 transition-all cursor-pointer"
                    >
                      EXPLORE MEN
                    </button>
                  </div>
                )}
              </div>

              {/* Checkout / Footer Area */}
              {displayCartItems.length > 0 && (
                <div className="p-6 border-t border-secondary dark:border-zinc-800 bg-secondary/30 dark:bg-zinc-900/30">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">SUBTOTAL</span>
                    <span className="font-luxury-sans text-lg font-bold text-accent">${displayCartTotal}</span>
                  </div>
                  <button
                    onClick={() => { alert(`Checkout complete! Simulated purchase of $${displayCartTotal} successful.`); }}
                    className="w-full py-4 bg-primary text-secondary dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold uppercase tracking-widest hover:bg-accent dark:hover:bg-accent hover:text-primary dark:hover:text-primary transition-all rounded-xs flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 4. Slide-out Wishlist Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="fixed inset-0 bg-black z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-zinc-950 shadow-2xl z-[101] flex flex-col"
            >
              <div className="p-6 border-b border-secondary dark:border-zinc-800 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-accent" />
                  <span className="font-luxury-sans text-xs font-bold tracking-widest uppercase text-primary dark:text-zinc-100">WISHLIST ({displayWishlist.length})</span>
                </div>
                <button onClick={() => setIsWishlistOpen(false)} className="p-1 text-zinc-500 hover:text-primary dark:text-zinc-100 cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Wishlist Items List */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {displayWishlist.length > 0 ? (
                  displayWishlist.map((id) => {
                    const product = products.find((p) => p.id === id);
                    if (!product) return null;
                    return (
                      <div key={product.id} className="flex space-x-4 border-b border-secondary/50 dark:border-zinc-800/50 pb-6 last:border-b-0">
                        <img
                          onClick={() => { setIsWishlistOpen(false); navigate(`/product/${product.id}`); }}
                          src={product.images[0]}
                          alt={product.name}
                          className="w-20 h-24 object-cover rounded-xs cursor-pointer hover:opacity-85 transition-opacity"
                        />
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between">
                              <h4
                                onClick={() => { setIsWishlistOpen(false); navigate(`/product/${product.id}`); }}
                                className="text-xs font-bold uppercase tracking-wider text-primary dark:text-zinc-100 cursor-pointer hover:text-accent transition-colors"
                              >
                                {product.name}
                              </h4>
                              <button
                                onClick={() => toggleWishlist(product.id)}
                                className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                                aria-label="Remove wishlist"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs font-bold text-accent mt-2">${product.price}</p>
                          </div>
                          <button
                            onClick={() => {
                              addToCart(product, product.sizes[0], product.colors[0]);
                              setIsWishlistOpen(false);
                            }}
                            className="mt-4 py-2 border border-primary dark:border-zinc-100 hover:bg-primary hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                          >
                            ADD TO BAG
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <Heart className="w-12 h-12 text-zinc-300 dark:text-zinc-700 stroke-[1]" />
                    <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">YOUR WISHLIST IS EMPTY</p>
                    <button
                      onClick={() => { setIsWishlistOpen(false); navigate('/women'); }}
                      className="px-6 py-3 border border-primary dark:border-zinc-100 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 transition-all cursor-pointer"
                    >
                      EXPLORE WOMEN
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
