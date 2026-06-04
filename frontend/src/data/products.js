export const products = [
  // ==================== MEN'S COLLECTION ====================
  // Tournament Wear
  {
    id: "m-1",
    name: "Aether Pro Esports Jersey",
    price: 89,
    originalPrice: 119,
    discount: 25,
    rating: 4.8,
    reviewsCount: 42,
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "Tournament Wear",
    subcategory: "Esports Jerseys",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#111111", "#C9A87C"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    description: "Engineered for elite performance. The Aether Pro Esports Jersey blends ultra-breathable moisture-wicking technology with structured athletic tailoring. Features a sleek, modern collar and premium sublimation details."
  },
  {
    id: "m-2",
    name: "Vanguard Custom Tournament Jacket",
    price: 145,
    originalPrice: 145,
    discount: 0,
    rating: 4.9,
    reviewsCount: 18,
    images: [
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "Tournament Wear",
    subcategory: "Custom Tournament Wear",
    sizes: ["M", "L", "XL"],
    colors: ["#111111", "#F5F1EB"],
    isNewArrival: false,
    isBestSeller: true,
    isTrending: false,
    description: "A tailored warm-up armor. Built with windproof technical fabric and custom heat-press embroidery panels. Clean silhouette inspired by premium minimalist luxury streetwear."
  },
  {
    id: "m-3",
    name: "Eclipse Gaming Jersey",
    price: 75,
    originalPrice: 95,
    discount: 21,
    rating: 4.6,
    reviewsCount: 29,
    images: [
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "Tournament Wear",
    subcategory: "Gaming Jerseys",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#222222", "#C9A87C"],
    isNewArrival: true,
    isBestSeller: false,
    isTrending: true,
    description: "The official Eclipse team training shirt. Engineered with ergonomic side seams and mesh ventilation zones to support long gaming sessions under pressure."
  },
  {
    id: "m-4",
    name: "Championship Tournament T-Shirt",
    price: 55,
    originalPrice: 55,
    discount: 0,
    rating: 4.7,
    reviewsCount: 15,
    images: [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "Tournament Wear",
    subcategory: "Tournament T-Shirts",
    sizes: ["S", "M", "L"],
    colors: ["#111111", "#FFFFFF"],
    isNewArrival: false,
    isBestSeller: false,
    isTrending: false,
    description: "Commemorative custom-fit heavyweight tournament tee. Crafted from 280GSM organic cotton with fine silkscreen details on the back."
  },

  // T-Shirts
  {
    id: "m-5",
    name: "Minimalist Oversized Tee",
    price: 49,
    originalPrice: 65,
    discount: 24,
    rating: 4.5,
    reviewsCount: 88,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "T-Shirts",
    subcategory: "Oversized",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#F5F1EB", "#222222", "#C9A87C"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    description: "A staple oversized silhouette with dropped shoulders and a heavy rib collar. Made from 100% premium Peruvian cotton for structural drape."
  },
  {
    id: "m-6",
    name: "Signature Printed T-Shirt",
    price: 59,
    originalPrice: 59,
    discount: 0,
    rating: 4.4,
    reviewsCount: 34,
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "T-Shirts",
    subcategory: "Printed",
    sizes: ["S", "M", "L"],
    colors: ["#FFFFFF", "#111111"],
    isNewArrival: false,
    isBestSeller: false,
    isTrending: false,
    description: "Features high-density tonal rubber branding across the chest. Classic cut designed to transition effortlessly from casual settings to night layering."
  },
  {
    id: "m-7",
    name: "Premium Linen Plain Tee",
    price: 65,
    originalPrice: 85,
    discount: 23,
    rating: 4.8,
    reviewsCount: 56,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "T-Shirts",
    subcategory: "Plain",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#F5F1EB", "#C9A87C"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: false,
    description: "Breathable plain tee crafted from a soft cotton-linen blend. Ideal for high-summer styling and warm resort layers."
  },

  // Shirts
  {
    id: "m-8",
    name: "Classic Linen Resort Shirt",
    price: 110,
    originalPrice: 140,
    discount: 21,
    rating: 4.9,
    reviewsCount: 67,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "Shirts",
    subcategory: "Linen Shirts",
    sizes: ["M", "L", "XL"],
    colors: ["#F5F1EB", "#FFFFFF", "#C9A87C"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    description: "Relaxed linen resort shirt with a clean camp collar and button-through front. Pre-washed for maximum softness and natural drape."
  },
  {
    id: "m-9",
    name: "Tailored Formal Oxford Shirt",
    price: 125,
    originalPrice: 125,
    discount: 0,
    rating: 4.7,
    reviewsCount: 112,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "Shirts",
    subcategory: "Formal Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#FFFFFF", "#111111"],
    isNewArrival: false,
    isBestSeller: true,
    isTrending: false,
    description: "Crafted from double-ply luxury Egyptian cotton. Designed with a structured semi-spread collar, mother-of-pearl buttons, and rounded double cuffs."
  },
  {
    id: "m-10",
    name: "Atelier Casual Utility Shirt",
    price: 98,
    originalPrice: 120,
    discount: 18,
    rating: 4.5,
    reviewsCount: 23,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "Shirts",
    subcategory: "Casual Shirts",
    sizes: ["S", "M", "L"],
    colors: ["#C9A87C", "#222222"],
    isNewArrival: true,
    isBestSeller: false,
    isTrending: false,
    description: "Utility-inspired button-up with dual flap chest pockets. Constructed from textured canvas twill for a rugged, modern, premium finish."
  },

  // Shoes
  {
    id: "m-11",
    name: "Monolith Leather Sneakers",
    price: 190,
    originalPrice: 240,
    discount: 20,
    rating: 4.8,
    reviewsCount: 92,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "Shoes",
    subcategory: "Sneakers",
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["#FFFFFF", "#111111"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    description: "Italian calfskin leather sneakers with a custom chunky rubber sole. Handcrafted with subtle embossed branding and high-density memory foam insoles."
  },
  {
    id: "m-12",
    name: "Apex Knit Running Shoes",
    price: 165,
    originalPrice: 165,
    discount: 0,
    rating: 4.6,
    reviewsCount: 47,
    images: [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "Shoes",
    subcategory: "Sports Shoes",
    sizes: ["41", "42", "43", "44"],
    colors: ["#111111", "#C9A87C"],
    isNewArrival: false,
    isBestSeller: false,
    isTrending: true,
    description: "Seamless engineered-knit running shoes. Lightweight carbon-infused midsole provides energy return, while the luxury design maintains style points."
  },
  {
    id: "m-13",
    name: "Nomad Suede Loafers",
    price: 175,
    originalPrice: 210,
    discount: 16,
    rating: 4.9,
    reviewsCount: 55,
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "man",
    category: "Shoes",
    subcategory: "Casual Shoes",
    sizes: ["40", "41", "42", "43"],
    colors: ["#C9A87C", "#111111"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: false,
    description: "Velvety Italian suede loafers with detailed contrast hand-stitching. Flexible leather outsoles deliver absolute comfort for formal-casual transitions."
  },

  // ==================== WOMEN'S COLLECTION ====================
  // Tournament Wear
  {
    id: "w-1",
    name: "Aegis Pro Women Jersey",
    price: 89,
    originalPrice: 119,
    discount: 25,
    rating: 4.8,
    reviewsCount: 31,
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "women",
    category: "Tournament Wear",
    subcategory: "Women Gaming Jerseys",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#111111", "#C9A87C"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    description: "High-performance women's fit gaming jersey. Featuring a tapered waistline, double-knit cooling mesh, and gold foil logo print accents."
  },
  {
    id: "w-2",
    name: "Championship Panel Tee",
    price: 55,
    originalPrice: 55,
    discount: 0,
    rating: 4.7,
    reviewsCount: 12,
    images: [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "women",
    category: "Tournament Wear",
    subcategory: "Tournament Jerseys",
    sizes: ["S", "M", "L"],
    colors: ["#FFFFFF", "#C9A87C"],
    isNewArrival: false,
    isBestSeller: false,
    isTrending: false,
    description: "Premium cotton tournament jersey featuring panel detail block construction. Light, soft, and breathable cut for hot arenas."
  },
  {
    id: "w-3",
    name: "Bhondu Elite Tournament Tee",
    price: 65,
    originalPrice: 80,
    discount: 18,
    rating: 4.9,
    reviewsCount: 22,
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "women",
    category: "Tournament Wear",
    subcategory: "Tournament T-Shirts",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#111111", "#F5F1EB"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    description: "Premium oversized tournament wear. Bold, clean style with minimal graphics on chest and oversized structure on shoulders."
  },

  // T-Shirts
  {
    id: "w-4",
    name: "Studio Crop Rib Tee",
    price: 39,
    originalPrice: 55,
    discount: 29,
    rating: 4.7,
    reviewsCount: 104,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "women",
    category: "T-Shirts",
    subcategory: "Crop Tops",
    sizes: ["XS", "S", "M"],
    colors: ["#FFFFFF", "#F5F1EB", "#222222"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    description: "Ribbed crop tee with a subtle crew neck and stretch-fit construction. An essential luxury base layer for mid-rise tailoring."
  },
  {
    id: "w-5",
    name: "Luxury Oversized Slit Tee",
    price: 49,
    originalPrice: 49,
    discount: 0,
    rating: 4.5,
    reviewsCount: 65,
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "women",
    category: "T-Shirts",
    subcategory: "Oversized Tees",
    sizes: ["S", "M", "L"],
    colors: ["#F5F1EB", "#111111"],
    isNewArrival: false,
    isBestSeller: false,
    isTrending: false,
    description: "Relaxed oversized tee featuring detailed side slits. Cut from ultra-soft supima cotton for a luxurious touch against the skin."
  },
  {
    id: "w-6",
    name: "Abstract Printed Graphic Tee",
    price: 55,
    originalPrice: 75,
    discount: 26,
    rating: 4.4,
    reviewsCount: 40,
    images: [
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "women",
    category: "T-Shirts",
    subcategory: "Printed Tees",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#111111", "#FFFFFF"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    description: "Features a modern abstract silkscreen layout on the front. Adds a creative, clean statement to casual streetwear looks."
  },

  // Shirts
  {
    id: "w-7",
    name: "Relaxed Linen Oversized Shirt",
    price: 115,
    originalPrice: 150,
    discount: 23,
    rating: 4.9,
    reviewsCount: 89,
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "women",
    category: "Shirts",
    subcategory: "Oversized Shirts",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#F5F1EB", "#FFFFFF", "#C9A87C"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    description: "Flowy, relaxed fit linen shirt. Elegant dropped shoulders and longer length create the perfect premium casual coordinate."
  },
  {
    id: "w-8",
    name: "Silk Blend Formal Blouse",
    price: 140,
    originalPrice: 140,
    discount: 0,
    rating: 4.8,
    reviewsCount: 43,
    images: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "women",
    category: "Shirts",
    subcategory: "Formal Shirts",
    sizes: ["S", "M", "L"],
    colors: ["#FFFFFF", "#C9A87C"],
    isNewArrival: false,
    isBestSeller: true,
    isTrending: false,
    description: "Premium silk blend formal shirt with covered button placket and tall statement cuffs. A timeless asset for high-end tailoring."
  },
  {
    id: "w-9",
    name: "Tailored Crisp Cotton Shirt",
    price: 95,
    originalPrice: 120,
    discount: 20,
    rating: 4.6,
    reviewsCount: 52,
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "women",
    category: "Shirts",
    subcategory: "Casual Shirts",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#FFFFFF", "#111111"],
    isNewArrival: true,
    isBestSeller: false,
    isTrending: false,
    description: "Crisp poplin cotton shirt with standard fit and classic collar. Pre-shrunk and custom enzyme washed for refined structure."
  },

  // Shoes
  {
    id: "w-10",
    name: "Capri Leather Strap Heels",
    price: 210,
    originalPrice: 280,
    discount: 25,
    rating: 4.9,
    reviewsCount: 76,
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "women",
    category: "Shoes",
    subcategory: "Heels",
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["#C9A87C", "#111111"],
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    description: "Elegant strappy leather heels. Soft cushioned leather footbed and custom block heel make it the ideal selection for evening wear."
  },
  {
    id: "w-11",
    name: "Luxe Platform Sneakers",
    price: 180,
    originalPrice: 180,
    discount: 0,
    rating: 4.7,
    reviewsCount: 61,
    images: [
      "https://images.unsplash.com/photo-1596568300556-a3b9f4f4f6b8?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "women",
    category: "Shoes",
    subcategory: "Sneakers",
    sizes: ["37", "38", "39", "40"],
    colors: ["#FFFFFF", "#111111"],
    isNewArrival: false,
    isBestSeller: true,
    isTrending: false,
    description: "Crisp white platform sneakers crafted from smooth Nappa leather. Adds a sporty yet sophisticated edge to standard fashion wear."
  },
  {
    id: "w-12",
    name: "Atelier Suede Pointed Flats",
    price: 155,
    originalPrice: 195,
    discount: 20,
    rating: 4.5,
    reviewsCount: 39,
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "women",
    category: "Shoes",
    subcategory: "Flats",
    sizes: ["36", "37", "38", "39"],
    colors: ["#C9A87C", "#111111", "#F5F1EB"],
    isNewArrival: true,
    isBestSeller: false,
    isTrending: true,
    description: "Ultra-comfy pointed flats in soft premium goat suede. Flexible sole construction allows for effortless all-day wear."
  }
];
