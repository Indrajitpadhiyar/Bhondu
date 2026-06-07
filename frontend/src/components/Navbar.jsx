import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Heart, ShoppingBag, User, Menu, X,
  Trash2, Plus, Minus, Moon, Sun, ArrowRight, ShoppingCart,
  CreditCard, Truck, RotateCw, MapPin, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLogoutMutation } from '../services/authApi';
import { ShopContext } from '../context/ShopContext';
import { useGetProductsQuery } from '../services/productApi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice.js';
import { useGetProfileQuery, useAddAddressMutation } from '../services/userApi.js';
import { useCreateOrderMutation } from '../services/orderApi.js';

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
    addToCart,
    clearCart
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { data: products = [] } = useGetProductsQuery();
  const [logout] = useLogoutMutation();

  const { data: profileData, refetch: refetchProfile } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const userProfile = profileData?.data?.user;
  const savedAddresses = userProfile?.addresses || [];

  const [addAddress] = useAddAddressMutation();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay' | 'COD'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: true
  });

  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId) {
      const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  }, [savedAddresses, selectedAddressId]);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order.");
      setIsCartOpen(false);
      navigate('/login', { state: { from: location } });
      return;
    }
    
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    if (savedAddresses.length === 0) {
      setIsAddingNewAddress(true);
    } else {
      setIsAddingNewAddress(false);
      const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const selectedAddress = savedAddresses.find(a => a._id === selectedAddressId);

  const handlePayment = async () => {
    if (!selectedAddressId || !selectedAddress) {
      toast.error('Please select or add a shipping address.');
      return;
    }

    if (paymentMethod === 'Razorpay') {
      setIsProcessing(true);
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_Sylrq9o8DJmUYd',
        amount: Math.round((displayCartTotal + shippingPrice) * 100), // amount in paise
        currency: 'INR',
        name: 'BHONDU Store',
        description: 'Order Payment',
        image: '/bhondu_logo.png',
        handler: async function (response) {
          try {
            const orderData = {
              items: displayCartItems.map(item => ({
                product: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                image: item.image
              })),
              shippingAddress: {
                street: selectedAddress.street,
                city: selectedAddress.city,
                state: selectedAddress.state,
                postalCode: selectedAddress.postalCode,
                country: selectedAddress.country
              },
              totalPrice: displayCartTotal + shippingPrice,
              shippingPrice: shippingPrice,
              paymentStatus: 'Paid',
              paymentMethod: 'Online'
            };
            
            await createOrder(orderData).unwrap();
            clearCart();
            setIsCheckoutOpen(false);
            toast.success('Payment successful and order placed!');
          } catch (err) {
            toast.error(err.data?.message || 'Failed to place order.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: userProfile?.name || '',
          email: userProfile?.email || '',
          contact: userProfile?.phone || ''
        },
        theme: {
          color: '#C9A87C'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Cash on Delivery
      try {
        setIsProcessing(true);
        const orderData = {
          items: displayCartItems.map(item => ({
            product: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image
          })),
          shippingAddress: {
            street: selectedAddress.street,
            city: selectedAddress.city,
            state: selectedAddress.state,
            postalCode: selectedAddress.postalCode,
            country: selectedAddress.country
          },
          totalPrice: displayCartTotal + shippingPrice,
          shippingPrice: shippingPrice,
          paymentStatus: 'Pending',
          paymentMethod: 'COD'
        };
        await createOrder(orderData).unwrap();
        clearCart();
        setIsCheckoutOpen(false);
        toast.success('Order placed successfully (Cash on Delivery)!');
      } catch (err) {
        toast.error(err.data?.message || 'Failed to place order.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    try {
      await logout().unwrap();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed.');
    }
  };

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

  const shippingPrice = displayCartItems.length > 0
    ? displayCartItems.reduce((max, item) => {
        const product = products.find(p => p.id === item.id);
        const itemShipping = product?.shippingCost ?? 99;
        return Math.max(max, itemShipping);
      }, 0)
    : 0;

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
          <div className="flex justify-between items-center h-20 relative">

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
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <Link
                to="/"
                className="flex items-center space-x-3 flavors-extrabold text-2xl sm:text-3xl md:text-4xl tracking-[0.1em] sm:tracking-[0.25em] text-primary dark:text-zinc-100 hover:text-accent transition-colors"
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
                        <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-zinc-700 dark:text-zinc-200 hover:bg-secondary dark:hover:bg-zinc-800 transition-colors">MY PROFILE</Link>
                        <a href="#orders" className="block px-4 py-2 text-zinc-700 dark:text-zinc-200 hover:bg-secondary dark:hover:bg-zinc-800 transition-colors">MY ORDERS</a>
                        <a href="#settings" className="block px-4 py-2 text-zinc-700 dark:text-zinc-200 hover:bg-secondary dark:hover:bg-zinc-800 transition-colors">SETTINGS</a>
                        <div className="border-t border-secondary dark:border-zinc-800 my-1" />
                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-red-500 hover:bg-secondary dark:hover:bg-zinc-800 transition-colors cursor-pointer">
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
                  <span className="font-logo text-2xl tracking-[0.2em] text-primary dark:text-zinc-100">BHONDU</span>
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
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 hover:text-accent py-1.5 text-zinc-500 dark:text-zinc-400">
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  <a href="#orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 hover:text-accent py-1.5">
                    <ShoppingBag className="w-4 h-4" />
                    <span>My Orders</span>
                  </a>
                  <button
                    onClick={handleLogout}
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
                            <span className="text-xs font-bold text-accent">₹{p.price}</span>
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
                          <span className="text-xs font-bold text-accent">₹{item.price * item.quantity}</span>
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
                    <span className="font-luxury-sans text-lg font-bold text-accent">₹{displayCartTotal}</span>
                  </div>
                  <button
                    onClick={handleProceedToCheckout}
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
                            <p className="text-xs font-bold text-accent mt-2">₹{product.price}</p>
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

      {/* 5. Checkout / Payment Gateway Drawer */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isProcessing) setIsCheckoutOpen(false);
              }}
              className="fixed inset-0 bg-black"
            />

            {/* Drawer Body - Full Height, Wider width */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-full max-w-5xl bg-[#F8F7F4] dark:bg-zinc-950 shadow-2xl z-10 flex flex-col h-full text-left"
            >
              {/* Header Bar */}
              <div className="p-6 border-b border-secondary/45 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900">
                <div>
                  <span className="text-[9px] font-bold text-accent tracking-[0.25em] uppercase">Checkout Gateway</span>
                  <h3 className="font-luxury-serif text-lg sm:text-xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100 mt-0.5">
                    Logistics & Payment
                  </h3>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  disabled={isProcessing}
                  className="p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-primary dark:text-zinc-150 transition-colors disabled:opacity-30 cursor-pointer bg-transparent"
                  aria-label="Close checkout"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Content Area split into 2 columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 overflow-hidden">
                
                {/* Left Column: Forms and selection */}
                <div className="lg:col-span-7 p-6 sm:p-8 overflow-y-auto space-y-6">
                  {isAddingNewAddress ? (
                    /* Address addition Form */
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!newAddressForm.street || !newAddressForm.city || !newAddressForm.state || !newAddressForm.postalCode || !newAddressForm.country) {
                          toast.error("Please populate all address fields.");
                          return;
                        }
                        try {
                          setIsProcessing(true);
                          await addAddress(newAddressForm).unwrap();
                          const freshProfile = await refetchProfile().unwrap();
                          const freshAddresses = freshProfile?.data?.user?.addresses || [];
                          if (freshAddresses.length > 0) {
                            const newAddr = freshAddresses[freshAddresses.length - 1];
                            setSelectedAddressId(newAddr._id);
                          }
                          setIsAddingNewAddress(false);
                          toast.success("Delivery coordinates saved successfully!");
                        } catch (err) {
                          toast.error(err.data?.message || "Failed to save address coordinates.");
                        } finally {
                          setIsProcessing(false);
                        }
                      }}
                      className="space-y-4 text-xs"
                    >
                      <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Add Shipping Point
                      </h4>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Street Address</label>
                        <input
                          type="text"
                          required
                          value={newAddressForm.street}
                          onChange={(e) => setNewAddressForm(prev => ({ ...prev, street: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-secondary/45 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-sm focus:outline-none focus:border-accent text-zinc-850 dark:text-zinc-150 transition-colors"
                          placeholder="e.g. 123 Luxury Avenue, Floor 2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">City</label>
                          <input
                            type="text"
                            required
                            value={newAddressForm.city}
                            onChange={(e) => setNewAddressForm(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full px-3 py-2.5 border border-secondary/45 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-sm focus:outline-none focus:border-accent text-zinc-850 dark:text-zinc-150 transition-colors"
                            placeholder="e.g. Mumbai"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">State</label>
                          <input
                            type="text"
                            required
                            value={newAddressForm.state}
                            onChange={(e) => setNewAddressForm(prev => ({ ...prev, state: e.target.value }))}
                            className="w-full px-3 py-2.5 border border-secondary/45 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-sm focus:outline-none focus:border-accent text-zinc-850 dark:text-zinc-150 transition-colors"
                            placeholder="e.g. Maharashtra"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Postal Code</label>
                          <input
                            type="text"
                            required
                            value={newAddressForm.postalCode}
                            onChange={(e) => setNewAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
                            className="w-full px-3 py-2.5 border border-secondary/45 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-sm focus:outline-none focus:border-accent text-zinc-850 dark:text-zinc-150 transition-colors"
                            placeholder="e.g. 400001"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Country</label>
                          <input
                            type="text"
                            required
                            value={newAddressForm.country}
                            onChange={(e) => setNewAddressForm(prev => ({ ...prev, country: e.target.value }))}
                            className="w-full px-3 py-2.5 border border-secondary/45 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-sm focus:outline-none focus:border-accent text-zinc-850 dark:text-zinc-150 transition-colors"
                            placeholder="e.g. India"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-4">
                        {savedAddresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setIsAddingNewAddress(false)}
                            disabled={isProcessing}
                            className="px-4 py-2.5 border border-secondary/45 dark:border-zinc-800 rounded-sm hover:bg-secondary/5 font-semibold transition-colors cursor-pointer bg-transparent text-zinc-650 dark:text-zinc-350"
                          >
                            Use Saved Address
                          </button>
                        )}
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="px-6 py-2.5 bg-zinc-900 dark:bg-white dark:text-zinc-950 text-white font-bold uppercase tracking-widest rounded-sm hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          {isProcessing && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
                          Save Address
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Standard Confirmation & Payment Panel */
                    <div className="space-y-6 text-xs">
                      {/* Delivery Address Details */}
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                          <span>DELIVERY DESTINATION</span>
                          <button
                            onClick={() => {
                              setNewAddressForm({ street: '', city: '', state: '', postalCode: '', country: '', isDefault: true });
                              setIsAddingNewAddress(true);
                            }}
                            disabled={isProcessing}
                            className="text-accent hover:underline cursor-pointer border-0 bg-transparent font-bold tracking-wider"
                          >
                            + Add Address
                          </button>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {savedAddresses.map((addr) => (
                            <label
                              key={addr._id}
                              className={`p-3 border rounded-sm flex items-start gap-3 cursor-pointer transition-all ${
                                selectedAddressId === addr._id
                                  ? 'border-accent bg-accent/[0.02] shadow-sm'
                                  : 'border-secondary dark:border-zinc-800 hover:border-accent/40 bg-zinc-50/50 dark:bg-zinc-950/10'
                              }`}
                            >
                              <input
                                type="radio"
                                name="checkoutAddress"
                                checked={selectedAddressId === addr._id}
                                onChange={() => setSelectedAddressId(addr._id)}
                                disabled={isProcessing}
                                className="mt-0.5 accent-accent"
                              />
                              <div className="flex-1 space-y-0.5">
                                <p className="font-semibold text-zinc-800 dark:text-zinc-200">{addr.street}</p>
                                <p className="text-[11px] text-zinc-400">{addr.city}, {addr.state} - {addr.postalCode}, {addr.country}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Payment Mode Selector */}
                      <div className="space-y-2.5">
                        <h4 className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                          SELECT PAYMENT CHANNEL
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setPaymentMethod('Razorpay')}
                            disabled={isProcessing}
                            className={`p-4 border rounded-sm flex flex-col items-center justify-center gap-2 transition-all cursor-pointer bg-transparent ${
                              paymentMethod === 'Razorpay'
                                ? 'border-accent text-accent bg-accent/[0.02]'
                                : 'border-secondary dark:border-zinc-800 text-zinc-400 hover:border-accent/40 hover:text-zinc-650'
                            }`}
                          >
                            <CreditCard className="w-5 h-5" />
                            <span className="font-bold tracking-wider uppercase text-[9px]">Pay Online (Razorpay)</span>
                          </button>
                          <button
                            onClick={() => setPaymentMethod('COD')}
                            disabled={isProcessing}
                            className={`p-4 border rounded-sm flex flex-col items-center justify-center gap-2 transition-all cursor-pointer bg-transparent ${
                              paymentMethod === 'COD'
                                ? 'border-accent text-accent bg-accent/[0.02]'
                                : 'border-secondary dark:border-zinc-800 text-zinc-400 hover:border-accent/40 hover:text-zinc-650'
                            }`}
                          >
                            <Truck className="w-5 h-5" />
                            <span className="font-bold tracking-wider uppercase text-[9px]">Cash on Delivery</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Order Summary & Action (Sidebar) */}
                <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border-t lg:border-t-0 lg:border-l border-secondary/45 dark:border-zinc-800 p-6 sm:p-8 flex flex-col justify-between h-full overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400">Order Summary</h4>
                      <div className="w-8 h-[1px] bg-accent mt-1" />
                    </div>

                    {/* Cart Items Scroll Area */}
                    <div className="space-y-4 max-h-[30vh] lg:max-h-[40vh] overflow-y-auto pr-1">
                      {displayCartItems.map((item, idx) => (
                        <div key={idx} className="flex gap-3 pb-3 border-b border-secondary/20 dark:border-zinc-800/40 last:border-b-0 animate-fade-in">
                          <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-sm border border-secondary/20 dark:border-zinc-800" />
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-bold text-zinc-800 dark:text-zinc-100 truncate uppercase tracking-wider">{item.name}</p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">Size: {item.size} | Qty: {item.quantity}</p>
                            <p className="inline-block w-3.5 h-3.5 rounded-full border align-middle mt-1" style={{ backgroundColor: item.color }} />
                          </div>
                          <div className="text-right text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cost breakdown */}
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950/30 border border-secondary dark:border-zinc-800 rounded-sm space-y-2 text-xs font-medium">
                      <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase tracking-wider">
                        <span>Cart Subtotal</span>
                        <span>₹{displayCartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase tracking-wider">
                        <span>Standard shipping</span>
                        <span>₹{shippingPrice.toFixed(2)}</span>
                      </div>
                      <div className="h-[1px] bg-secondary dark:bg-zinc-800/80 my-1" />
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
                        <span>Grand Total</span>
                        <span className="text-accent text-sm">₹{(displayCartTotal + shippingPrice).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main checkout confirm button */}
                  <div className="pt-6 border-t border-secondary/20 dark:border-zinc-800/40">
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing || isCreatingOrder || !selectedAddressId || isAddingNewAddress}
                      className="w-full py-4 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold uppercase tracking-widest hover:bg-accent dark:hover:bg-accent hover:text-primary dark:hover:text-primary transition-all rounded-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>PROCESSING...</span>
                        </>
                      ) : (
                        <>
                          <span>CONFIRM & PLACE ORDER</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    {!selectedAddressId && !isAddingNewAddress && (
                      <p className="text-[10px] text-red-500 font-semibold text-center mt-2">
                        Please select or add a delivery address to place order.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
