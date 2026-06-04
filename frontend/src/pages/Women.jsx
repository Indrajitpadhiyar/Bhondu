import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Star, Truck, ShieldCheck, Heart, Sparkles, Compass } from 'lucide-react';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Women = () => {
  const location = useLocation();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSubcategory, setSelectedSubcategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Mock Women's categories list
  const categoriesList = [
    { name: 'ALL', count: products.filter(p => p.gender === 'women').length },
    { name: 'Tournament Wear', count: products.filter(p => p.gender === 'women' && p.category === 'Tournament Wear').length },
    { name: 'T-Shirts', count: products.filter(p => p.gender === 'women' && p.category === 'T-Shirts').length },
    { name: 'Shirts', count: products.filter(p => p.gender === 'women' && p.category === 'Shirts').length },
    { name: 'Shoes', count: products.filter(p => p.gender === 'women' && p.category === 'Shoes').length },
  ];

  // Subcategories mapping
  const subcategoriesMap = {
    'ALL': [],
    'Tournament Wear': ['Tournament T-Shirts', 'Women Gaming Jerseys', 'Tournament Jerseys'],
    'T-Shirts': ['Oversized Tees', 'Crop Tops', 'Printed Tees'],
    'Shirts': ['Formal Shirts', 'Casual Shirts', 'Oversized Shirts'],
    'Shoes': ['Heels', 'Sneakers', 'Flats'],
  };

  // Sync category from URL parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    if (catParam) {
      const match = categoriesList.find(c => c.name.toLowerCase() === catParam.toLowerCase());
      if (match) {
        setSelectedCategory(match.name);
      }
    }
  }, [location.search]);

  // Filter effect
  useEffect(() => {
    let result = products.filter(p => p.gender === 'women');

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
  }, [selectedCategory, selectedSubcategory, sortBy]);

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    setSelectedSubcategory('ALL');
  };

  const womenProducts = products.filter(p => p.gender === 'women');
  const trendingNow = womenProducts.filter(p => p.isTrending);
  const newArrivals = womenProducts.filter(p => p.isNewArrival);
  const bestSellers = womenProducts.filter(p => p.isBestSeller);

  // Lookbook items mapping
  const lookbookItems = [
    { id: 1, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop', caption: 'Linen Harmony', height: 'h-80' },
    { id: 2, image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop', caption: 'Summer Solstice', height: 'h-96' },
    { id: 3, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop', caption: 'Studio Rib Drape', height: 'h-72' },
    { id: 4, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop', caption: 'Classic Tailoring', height: 'h-[420px]' },
    { id: 5, image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=600&auto=format&fit=crop', caption: 'Editorial Moods', height: 'h-80' },
    { id: 6, image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop', caption: 'Aether Silhouette', height: 'h-96' },
  ];

  const productsSectionRef = useRef(null);
  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 transition-colors duration-300">
      
      {/* ==================== HERO BANNER ==================== */}
      <div className="relative h-[65vh] sm:h-[80vh] w-full flex items-center justify-center overflow-hidden bg-[#EADCC9]">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop"
          alt="Elegant Women Collection Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50 filter brightness-[0.8] dark:brightness-[0.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/10 via-[#FAF7F2]/10 to-[#FAF7F2]/75 dark:to-zinc-950/75 z-10" />
        <div className="relative z-20 text-center text-primary dark:text-white px-4 space-y-6 max-w-3xl">
          <span className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase">
            ELEGANCE REDEFINED
          </span>
          <h1 className="font-luxury-serif text-4xl sm:text-6xl font-bold uppercase tracking-wider leading-none m-0">
            DISCOVER YOUR PERFECT STYLE
          </h1>
          <p className="text-xs sm:text-sm tracking-widest text-zinc-600 dark:text-zinc-300 uppercase font-light">
            ELEGANT WOMEN'S COLLECTION FOR A STATE-OF-THE-ART VIBE
          </p>
          <div className="pt-4">
            <button
              onClick={scrollToProducts}
              className="px-8 py-4 bg-primary text-white hover:bg-accent hover:text-primary dark:bg-accent dark:text-primary dark:hover:bg-white dark:hover:text-primary transition-all text-xs font-bold uppercase tracking-widest cursor-pointer"
            >
              EXPLORE COLLECTION
            </button>
          </div>
        </div>
      </div>

      {/* ==================== CORE COLLECTIONS GRID / SLIDERS ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] font-bold text-accent tracking-[0.25em] uppercase">EDIT AND MOOD</span>
          <h2 className="font-luxury-serif text-3xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
            TRENDING NOW
          </h2>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-12"
        >
          {trendingNow.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ==================== MAIN SHOP & CATEGORIES FILTER ==================== */}
      <div ref={productsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-secondary dark:border-zinc-800 scroll-mt-20">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] font-bold text-accent tracking-[0.25em] uppercase">COLLECTIONS</span>
          <h2 className="font-luxury-serif text-3xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
            THE CATALOGUE
          </h2>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
        </div>

        {/* Categories selector */}
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

        {/* Subcategories */}
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

        {/* Sorting controls */}
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

        {/* Catalog grid */}
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

      {/* ==================== MASONRY LOOKBOOK GALLERY ==================== */}
      <div className="bg-secondary/20 dark:bg-zinc-900/30 py-20 border-t border-secondary dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold text-accent tracking-[0.25em] uppercase">EDITORIAL Lookbook</span>
            <h2 className="font-luxury-serif text-3xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
              FASHION LOOKBOOK
            </h2>
            <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
          </div>

          {/* Pinterest-style masonry layout using CSS Columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {lookbookItems.map((item) => (
              <div 
                key={item.id}
                className="break-inside-avoid relative overflow-hidden group border border-secondary dark:border-zinc-850 rounded-xs bg-white dark:bg-zinc-900 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={item.image}
                  alt={item.caption}
                  className="w-full object-cover grayscale group-hover:grayscale-0 transform scale-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                />
                {/* Overlay Text details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white text-left">
                  <span className="text-[10px] font-bold text-accent tracking-[0.3em] uppercase mb-1">ATELIER VIBES</span>
                  <h4 className="font-luxury-serif text-lg font-bold tracking-wider uppercase leading-tight">{item.caption}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== REVIEWS CAROUSEL ==================== */}
      <div className="py-20 border-b border-secondary dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-[10px] font-bold text-accent tracking-[0.25em] uppercase">EDITORIAL REVIEWS</span>
          <h2 className="font-luxury-serif text-2xl sm:text-3xl font-bold uppercase tracking-widest mt-3 mb-10 text-primary dark:text-zinc-100">
            CLIENT WORDS
          </h2>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            <SwiperSlide>
              <div className="space-y-6">
                <div className="flex justify-center space-x-1 text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                </div>
                <p className="font-luxury-serif text-lg sm:text-xl italic text-zinc-700 dark:text-zinc-200 leading-relaxed uppercase tracking-wider">
                  "THE CAPRI LEATHER STRAP HEELS EXCEED EXPECTATIONS. THE CONTOURED HEEL BLOCK SITS PERFECTLY, DELIVERING A STYLISH PROFILE THAT PULLS COMPLIMENTS CONSTANTLY."
                </p>
                <div className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
                  - ELENA V. | VERIFIED BUYER
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="space-y-6">
                <div className="flex justify-center space-x-1 text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                </div>
                <p className="font-luxury-serif text-lg sm:text-xl italic text-zinc-700 dark:text-zinc-200 leading-relaxed uppercase tracking-wider">
                  "THE OVERSIZED SHIRTS FIT DRAPES BEAUTIFULLY. THE LINEN BLEND STAYS CRISP YET SOFT. IT IS AN ESSENTIAL WARDROBE COMPANION."
                </p>
                <div className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
                  - SOFIA M. | VERIFIED BUYER
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

    </div>
  );
};

export default Women;
