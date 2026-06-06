import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetProductsQuery } from '../services/productApi';
import ProductCard from '../components/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Flame, Star, Gift, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import "@fontsource/orbitron/700.css";

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Man = () => {
  const location = useLocation();
  const { data: products = [], isLoading } = useGetProductsQuery({ gender: 'man' });

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSubcategory, setSelectedSubcategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Mock Men's categories list
  const categoriesList = [
    { name: 'ALL', count: products.length },
    { name: 'Tournament Wear', count: products.filter(p => p.category === 'Tournament Wear').length },
    { name: 'T-Shirts', count: products.filter(p => p.category === 'T-Shirts').length },
    { name: 'Shirts', count: products.filter(p => p.category === 'Shirts').length },
    { name: 'Shoes', count: products.filter(p => p.category === 'Shoes').length },
  ];

  // Subcategories mapping
  const subcategoriesMap = {
    'ALL': [],
    'Tournament Wear': ['Tournament T-Shirts', 'Gaming Jerseys', 'Esports Jerseys', 'Custom Tournament Wear'],
    'T-Shirts': ['Oversized', 'Printed', 'Plain'],
    'Shirts': ['Casual Shirts', 'Formal Shirts', 'Linen Shirts'],
    'Shoes': ['Sneakers', 'Sports Shoes', 'Casual Shoes'],
  };

  // Sync category from search parameters (if any)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    if (catParam) {
      const match = categoriesList.find(c => c.name.toLowerCase() === catParam.toLowerCase());
      if (match) {
        setSelectedCategory(match.name);
      }
    }
  }, [location.search, products]);

  // Filter effect
  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== 'ALL') {
      result = result.filter(p => p.category === selectedCategory);
      
      if (selectedSubcategory !== 'ALL') {
        result = result.filter(p => p.subcategory === selectedSubcategory);
      }
    }

    // Apply Sorting
    if (sortBy === 'PRICE_LOW') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PRICE_HIGH') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'RATING') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, selectedSubcategory, sortBy]);

  // Handle Category Change
  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    setSelectedSubcategory('ALL'); // Reset subcategory
  };

  // Timer countdown simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 24, seconds: 58 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 }; // Loop simulation
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const newArrivals = products.filter(p => p.isNewArrival);
  const bestSellers = products.filter(p => p.isBestSeller);

  // Scroll to products anchor
  const productsSectionRef = useRef(null);
  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 transition-colors duration-300">
      
      {/* ==================== HERO BANNER ==================== */}
      <div className="relative h-[65vh] sm:h-[80vh] w-full flex items-center justify-center overflow-hidden bg-primary">
        <img
          src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1600&auto=format&fit=crop"
          alt="Premium Men Collection Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-60 filter brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70 z-10" />
        <div className="relative z-20 text-center text-white px-4 space-y-6 max-w-3xl">
          <span className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase">
            ATELIER COLLECTION 2026
          </span>
          <h1 className="font-luxury-serif text-4xl sm:text-6xl font-bold uppercase tracking-wider leading-none">
            ELEVATE YOUR STYLE
          </h1>
          <p className="text-xs sm:text-sm tracking-widest text-zinc-300 uppercase font-light">
            PREMIUM MEN'S COLLECTION DESIGNED FOR THE MODERN ICON
          </p>
          <div className="pt-4">
            <button
              onClick={scrollToProducts}
              className="px-8 py-4 bg-accent hover:bg-white text-primary hover:text-primary transition-all text-xs font-bold uppercase tracking-widest cursor-pointer"
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </div>

      {/* ==================== BRAND VALUE PROPOSITIONS ==================== */}
      <div className="bg-secondary/40 dark:bg-zinc-900/40 border-b border-secondary dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs tracking-widest text-zinc-500 uppercase">
          <div className="flex flex-col items-center space-y-2">
            <Truck className="w-5 h-5 text-accent stroke-[1.5]" />
            <span>FREE EXPRESS SHIPPING</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <RefreshCw className="w-5 h-5 text-accent stroke-[1.5]" />
            <span>30-DAY EASY RETURN</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <ShieldCheck className="w-5 h-5 text-accent stroke-[1.5]" />
            <span>SECURE CHECKOUT</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Gift className="w-5 h-5 text-accent stroke-[1.5]" />
            <span>PREMIUM EMBALLAGE</span>
          </div>
        </div>
      </div>

      {/* ==================== CATEGORIES SECTION ==================== */}
      <div ref={productsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] font-bold text-accent tracking-[0.25em] uppercase">SHOP BY CATEGORY</span>
          <h2 className="font-luxury-serif text-3xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
            DISCOVER THE FIT
          </h2>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
          {categoriesList.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryChange(cat.name)}
              className={`px-5 py-3 border text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${selectedCategory === cat.name ? 'border-primary bg-primary text-white dark:border-accent dark:bg-accent dark:text-primary' : 'border-secondary dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 hover:border-accent'}`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Subcategories (Dynamic display) */}
        {selectedCategory !== 'ALL' && subcategoriesMap[selectedCategory] && (
          <div className="flex flex-wrap justify-center gap-2 mb-12 border-t border-secondary dark:border-zinc-800 pt-6">
            <button
              onClick={() => setSelectedSubcategory('ALL')}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${selectedSubcategory === 'ALL' ? 'text-accent border-b border-accent' : 'text-zinc-500 hover:text-accent'}`}
            >
              ALL SUB-CATEGORIES
            </button>
            {subcategoriesMap[selectedCategory].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${selectedSubcategory === sub ? 'text-accent border-b border-accent' : 'text-zinc-500 hover:text-accent'}`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Sorting header controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-secondary dark:border-zinc-800 pb-4 mb-8 text-xs tracking-wider uppercase text-zinc-400">
          <p>{filteredProducts.length} PRODUCTS FOUND</p>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <span>SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border border-secondary dark:border-zinc-800 text-xs py-1 px-3 text-primary dark:text-zinc-100 outline-none rounded-none cursor-pointer"
            >
              <option value="DEFAULT">DEFAULT</option>
              <option value="PRICE_LOW">PRICE: LOW TO HIGH</option>
              <option value="PRICE_HIGH">PRICE: HIGH TO LOW</option>
              <option value="RATING">POPULARITY</option>
            </select>
          </div>
        </div>

        {/* Shop Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-sm tracking-widest text-zinc-400">
            NO PRODUCTS FOUND UNDER THIS SELECTION.
          </div>
        )}
      </div>

      {/* ==================== NEW ARRIVALS SLIDER ==================== */}
      <div className="bg-secondary/25 dark:bg-zinc-900/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-accent tracking-[0.25em] uppercase">NEW COLLECTION</span>
              <h2 className="font-luxury-serif text-3xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
                NEW ARRIVALS
              </h2>
            </div>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {newArrivals.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ==================== SALE BANNER WITH TIMER ==================== */}
      <div className="relative py-24 sm:py-32 w-full flex items-center justify-center overflow-hidden bg-primary text-white text-center">
        <img
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1600&auto=format&fit=crop"
          alt="Sale Promo background"
          className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-[0.5]"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 px-4 space-y-6 max-w-xl mx-auto">
          <div className="flex items-center justify-center space-x-2 text-accent text-xs font-bold tracking-[0.3em] uppercase">
            <Flame className="w-4 h-4 fill-accent animate-pulse" />
            <span>SEASONAL PRIVATE SALE</span>
          </div>
          <h2 className="font-luxury-serif text-3xl sm:text-5xl font-bold uppercase tracking-widest">
            UP TO 30% OFF ATELIER PIECES
          </h2>
          <p className="text-xs text-zinc-300 tracking-widest leading-relaxed uppercase">
            ACCESS OUR EXCLUSIVE END-OF-SEASON PRIVATE SALE. STYLES ARE SELLING FAST. OFFERS DISAPPEAR IN:
          </p>
          
          {/* Countdown Clock */}
          <div className="flex justify-center space-x-6 pt-4 font-luxury-sans">
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-bold text-accent">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[9px] text-zinc-400 tracking-widest mt-1">HOURS</span>
            </div>
            <span className="text-3xl text-accent font-light">:</span>
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-bold text-accent">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[9px] text-zinc-400 tracking-widest mt-1">MINUTES</span>
            </div>
            <span className="text-3xl text-accent font-light">:</span>
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-bold text-accent">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[9px] text-zinc-400 tracking-widest mt-1">SECONDS</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== BEST SELLERS GRID ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] font-bold text-accent tracking-[0.25em] uppercase">CUSTOMER FAVORITES</span>
          <h2 className="font-luxury-serif text-3xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
            BEST SELLERS
          </h2>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* ==================== CUSTOMER REVIEWS ==================== */}
      <div className="bg-secondary/45 dark:bg-zinc-900/40 py-20 border-t border-b border-secondary dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-[10px] font-bold text-accent tracking-[0.25em] uppercase">TESTIMONIALS</span>
          <h2 className="font-luxury-serif text-2xl sm:text-3xl font-bold uppercase tracking-widest mt-3 mb-10 text-primary dark:text-zinc-100">
            WHAT THEY SAY
          </h2>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            <SwiperSlide>
              <div className="space-y-6">
                <div className="flex justify-center space-x-1 text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                </div>
                <p className="font-luxury-serif text-lg sm:text-xl italic text-zinc-700 dark:text-zinc-200 leading-relaxed uppercase tracking-wider">
                  "THE SIZING ON THE MINIMALIST OVERSIZED TEE IS PERFECT. THE FABRIC WEIGHT DRAWS A SENSE OF LUXURY STRETCHED BEYOND STANDARD CASUAL PIECES. HIGHLY RECOMMEND."
                </p>
                <div className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
                  - NICHOLAS K. | VERIFIED BUYER
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="space-y-6">
                <div className="flex justify-center space-x-1 text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                </div>
                <p className="font-luxury-serif text-lg sm:text-xl italic text-zinc-700 dark:text-zinc-200 leading-relaxed uppercase tracking-wider">
                  "BHONDU MONOLITH LEATHER SNEAKERS COMPETE DIRECTLY WITH ITALIAN HOUSES THAT CHARGE TRIPLE. OUTSTANDING COMFORT AND BUILD QUALITY."
                </p>
                <div className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
                  - MARCUS R. | VERIFIED BUYER
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="space-y-6">
                <div className="flex justify-center space-x-1 text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                </div>
                <p className="font-luxury-serif text-lg sm:text-xl italic text-zinc-700 dark:text-zinc-200 leading-relaxed uppercase tracking-wider">
                  "THE ESPORTS JERSEYS FEELS AMAZING. BREATHABLE, SITS WELL, AND THE EMBROIDERIES FEEL PREMIUM. PERFECT TOURNAMENT GEAR."
                </p>
                <div className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
                  - ARTHUR D. | ESPORTS ATHLETE
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

    </div>
  );
};

export default Man;
