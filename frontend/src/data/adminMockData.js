// BHONDU Luxury eCommerce Admin Mock Data

export const initialOrders = [
  {
    id: "BND-8942",
    customerName: "Aishwarya Sen",
    email: "aishwarya.sen@gmail.com",
    date: "2026-06-05",
    amount: 325.00,
    status: "Pending",
    items: [
      { id: "m-1", name: "Aether Pro Esports Jersey", price: 89, quantity: 1, size: "M", color: "#111111" },
      { id: "w-10", name: "Capri Leather Strap Heels", price: 210, quantity: 1, size: "38", color: "#C9A87C" }
    ],
    address: "Flat 4B, Alpine Heights, Sector V, Salt Lake, Kolkata, 700091",
    paymentMethod: "Credit Card (Visa)"
  },
  {
    id: "BND-8941",
    customerName: "Vikram Rathore",
    email: "vikram.r@outlook.com",
    date: "2026-06-05",
    amount: 145.00,
    status: "Processing",
    items: [
      { id: "m-2", name: "Vanguard Custom Tournament Jacket", price: 145, quantity: 1, size: "L", color: "#111111" }
    ],
    address: "A-12, Green Park, New Delhi, 110016",
    paymentMethod: "UPI (Google Pay)"
  },
  {
    id: "BND-8940",
    customerName: "Sneha Kapoor",
    email: "sneha.kapoor@yahoo.com",
    date: "2026-06-04",
    amount: 230.00,
    status: "Delivered",
    items: [
      { id: "w-7", name: "Relaxed Linen Oversized Shirt", price: 115, quantity: 2, size: "S", color: "#FFFFFF" }
    ],
    address: "Infinity Towers, Tower 3, Flat 1802, Gurgaon, 122002",
    paymentMethod: "Net Banking"
  },
  {
    id: "BND-8939",
    customerName: "Kabir Mehta",
    email: "kabir.m@rediffmail.com",
    date: "2026-06-04",
    amount: 190.00,
    status: "Delivered",
    items: [
      { id: "m-11", name: "Monolith Leather Sneakers", price: 190, quantity: 1, size: "42", color: "#FFFFFF" }
    ],
    address: "Villa 42, Palm Meadows, Whitefield, Bangalore, 560066",
    paymentMethod: "Credit Card (Amex)"
  },
  {
    id: "BND-8938",
    customerName: "Ananya Iyer",
    email: "ananya.iyer@gmail.com",
    date: "2026-06-03",
    amount: 95.00,
    status: "Cancelled",
    items: [
      { id: "w-9", name: "Tailored Crisp Cotton Shirt", price: 95, quantity: 1, size: "M", color: "#FFFFFF" }
    ],
    address: "7th Cross, JP Nagar Phase 3, Bangalore, 560078",
    paymentMethod: "Cash on Delivery"
  },
  {
    id: "BND-8937",
    customerName: "Rohan Das",
    email: "rohan.das@hotmail.com",
    date: "2026-06-03",
    amount: 405.00,
    status: "Delivered",
    items: [
      { id: "m-8", name: "Classic Linen Resort Shirt", price: 110, quantity: 1, size: "XL", color: "#F5F1EB" },
      { id: "m-1", name: "Aether Pro Esports Jersey", price: 89, quantity: 1, size: "L", color: "#C9A87C" },
      { id: "w-10", name: "Capri Leather Strap Heels", price: 210, quantity: 1, size: "37", color: "#111111" }
    ],
    address: "18, Park Street, Flat 2A, Kolkata, 700016",
    paymentMethod: "UPI (PhonePe)"
  },
  {
    id: "BND-8936",
    customerName: "Priya Sharma",
    email: "sharma.priya@gmail.com",
    date: "2026-06-02",
    amount: 155.00,
    status: "Processing",
    items: [
      { id: "w-12", name: "Atelier Suede Pointed Flats", price: 155, quantity: 1, size: "38", color: "#C9A87C" }
    ],
    address: "Sector 15, Vashi, Flat 301, Navi Mumbai, 400703",
    paymentMethod: "Credit Card (Mastercard)"
  },
  {
    id: "BND-8935",
    customerName: "Aditya Nair",
    email: "aditya.nair@gmail.com",
    date: "2026-06-02",
    amount: 295.00,
    status: "Delivered",
    items: [
      { id: "m-11", name: "Monolith Leather Sneakers", price: 190, quantity: 1, size: "43", color: "#111111" },
      { id: "m-5", name: "Minimalist Oversized Tee", price: 49, quantity: 2, size: "L", color: "#222222" }
    ],
    address: "Asset Homes, Apartment C3, Kakkanad, Kochi, 682030",
    paymentMethod: "Net Banking"
  },
  {
    id: "BND-8934",
    customerName: "Divya Verma",
    email: "divya.v@gmail.com",
    date: "2026-06-01",
    amount: 110.00,
    status: "Pending",
    items: [
      { id: "m-8", name: "Classic Linen Resort Shirt", price: 110, quantity: 1, size: "M", color: "#FFFFFF" }
    ],
    address: "Gokulam Apartments, Block B, 4th Floor, Adyar, Chennai, 600020",
    paymentMethod: "UPI (Google Pay)"
  },
  {
    id: "BND-8933",
    customerName: "Karan Johar",
    email: "karan.j@gmail.com",
    date: "2026-06-01",
    amount: 290.00,
    status: "Delivered",
    items: [
      { id: "m-12", name: "Apex Knit Running Shoes", price: 165, quantity: 1, size: "42", color: "#111111" },
      { id: "m-9", name: "Tailored Formal Oxford Shirt", price: 125, quantity: 1, size: "M", color: "#FFFFFF" }
    ],
    address: "Bungalow 7, Juhu Scheme, Mumbai, 400049",
    paymentMethod: "Credit Card (Visa)"
  }
];

export const initialCustomers = [
  {
    id: "CST-01",
    name: "Aishwarya Sen",
    email: "aishwarya.sen@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    totalSpent: 1845.50,
    orderCount: 8,
    status: "Active",
    tier: "Platinum",
    signupDate: "2025-08-15",
    history: [
      { date: "2026-06-05", event: "Placed order BND-8942 worth ₹325.00" },
      { date: "2026-05-12", event: "Reviewed Aether Pro Esports Jersey - 5 stars" },
      { date: "2026-04-20", event: "Placed order BND-8712 worth ₹450.00" },
      { date: "2025-08-15", event: "Joined the BHONDU insider circle" }
    ]
  },
  {
    id: "CST-02",
    name: "Vikram Rathore",
    email: "vikram.r@outlook.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    totalSpent: 920.00,
    orderCount: 5,
    status: "Active",
    tier: "VIP",
    signupDate: "2025-11-03",
    history: [
      { date: "2026-06-05", event: "Placed order BND-8941 worth ₹145.00" },
      { date: "2026-03-14", event: "Opened support ticket #SUP-2940 (Resolved)" },
      { date: "2026-02-10", event: "Placed order BND-8511 worth ₹310.00" }
    ]
  },
  {
    id: "CST-03",
    name: "Sneha Kapoor",
    email: "sneha.kapoor@yahoo.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    totalSpent: 2150.00,
    orderCount: 12,
    status: "Active",
    tier: "Platinum",
    signupDate: "2025-01-20",
    history: [
      { date: "2026-06-04", event: "Placed order BND-8940 worth ₹230.00" },
      { date: "2026-05-25", event: "Updated shipping details" }
    ]
  },
  {
    id: "CST-04",
    name: "Kabir Mehta",
    email: "kabir.m@rediffmail.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    totalSpent: 190.00,
    orderCount: 1,
    status: "Active",
    tier: "Regular",
    signupDate: "2026-06-01",
    history: [
      { date: "2026-06-04", event: "Placed first order BND-8939 worth ₹190.00" },
      { date: "2026-06-01", event: "Registered new account" }
    ]
  },
  {
    id: "CST-05",
    name: "Ananya Iyer",
    email: "ananya.iyer@gmail.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    totalSpent: 420.00,
    orderCount: 3,
    status: "Inactive",
    tier: "Regular",
    signupDate: "2025-09-11",
    history: [
      { date: "2026-06-03", event: "Cancelled order BND-8938 worth ₹95.00" }
    ]
  }
];

export const initialCoupons = [
  { code: "BHONDUGIFT", type: "Percentage", value: 20, status: "Active", expiry: "2026-12-31", usageCount: 245 },
  { code: "LUXURY50", type: "Fixed Amount", value: 50, status: "Active", expiry: "2026-08-30", usageCount: 112 },
  { code: "WELCOME10", type: "Percentage", value: 10, status: "Active", expiry: "2027-01-01", usageCount: 894 },
  { code: "TOURNAMENTPRO", type: "Percentage", value: 15, status: "Expired", expiry: "2026-05-01", usageCount: 43 }
];

export const inventoryAlerts = [
  { id: "m-4", name: "Championship Tournament T-Shirt", size: "S", stock: 2, status: "Critical" },
  { id: "w-4", name: "Studio Crop Rib Tee", size: "XS", stock: 5, status: "Low Stock" },
  { id: "m-12", name: "Apex Knit Running Shoes", size: "44", stock: 3, status: "Low Stock" },
  { id: "w-2", name: "Championship Panel Tee", size: "M", stock: 0, status: "Out of Stock" }
];

export const initialSubscribers = [
  { email: "rohit.garg@gmail.com", date: "2026-06-05", status: "Subscribed" },
  { email: "isha.k@gmail.com", date: "2026-06-05", status: "Subscribed" },
  { email: "dev.mehta@yahoo.com", date: "2026-06-04", status: "Subscribed" },
  { email: "neha.sen@outlook.com", date: "2026-06-03", status: "Subscribed" },
  { email: "arjun.nair@gmail.com", date: "2026-06-02", status: "Unsubscribed" }
];

export const dashboardAnalytics = {
  monthlyRevenue: [
    { month: "Jan", revenue: 8400, sales: 62 },
    { month: "Feb", revenue: 11200, sales: 78 },
    { month: "Mar", revenue: 9800, sales: 71 },
    { month: "Apr", revenue: 15400, sales: 112 },
    { month: "May", revenue: 21900, sales: 154 },
    { month: "Jun", revenue: 24500, sales: 185 }
  ],
  trafficSources: [
    { name: "Direct", value: 35, color: "#111111" },
    { name: "Instagram Ads", value: 40, color: "#C9A87C" },
    { name: "Google Search", value: 15, color: "#8E8E8E" },
    { name: "YouTube Referrals", value: 10, color: "#D4AF37" }
  ],
  conversionFunnel: [
    { stage: "Sessions", count: 12500 },
    { stage: "Product View", count: 7800 },
    { stage: "Add to Cart", count: 2400 },
    { stage: "Checkout Started", count: 1100 },
    { stage: "Purchased", count: 320 }
  ],
  categoryPerformance: [
    { category: "Tournament Collection", sales: 48000, color: "#111111" },
    { category: "Men Collection", sales: 34000, color: "#C9A87C" },
    { category: "Women Collection", sales: 29000, color: "#8E8E8E" }
  ]
};

export const initialCMS = {
  heroBanners: [
    { id: 1, title: "AETHER PRO COLLECTION", subtitle: "E-Sports meets Premium Luxury Tailoring", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop", active: true },
    { id: 2, title: "THE SUMMER ATELIER", subtitle: "Structured Linen & Premium Accessories", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop", active: false }
  ],
  lookbook: [
    { id: 101, title: "Cyber-Athletic Minimalist", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop", columns: 1 },
    { id: 102, title: "Resort Layering", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop", columns: 2 }
  ],
  testimonials: [
    { id: 1, author: "Rajesh K.", text: "The fabric quality of the Esports Jersey is unlike anything I've seen. Outstanding drape.", rating: 5 },
    { id: 2, author: "Meghna S.", text: "Capri heels are stunning. Worth every rupee. Real leather feel and super comfortable.", rating: 5 }
  ]
};
