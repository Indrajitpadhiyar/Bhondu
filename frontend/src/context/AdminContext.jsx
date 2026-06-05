import React, { createContext, useContext, useState } from 'react';
import { products as initialProducts } from '../data/products';
import {
  initialOrders,
  initialCustomers,
  initialCoupons,
  inventoryAlerts,
  initialSubscribers,
  initialCMS
} from '../data/adminMockData';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [alerts, setAlerts] = useState(inventoryAlerts);
  const [cms, setCms] = useState(initialCMS);
  
  const [settings, setSettings] = useState({
    storeName: "BHONDU Store",
    supportEmail: "support@bhondu.com",
    contactPhone: "+91 98765 43210",
    currency: "INR",
    taxRate: 18,
    brandColors: {
      primary: "#111111",
      accent: "#C9A87C",
      background: "#F8F7F4"
    },
    shippingMethods: [
      { id: "sm-1", name: "Standard Delivery (3-5 Business Days)", price: 99, active: true },
      { id: "sm-2", name: "Premium Express Courier (Next Day)", price: 299, active: true },
      { id: "sm-3", name: "International Insured Cargo", price: 1499, active: false }
    ],
    paymentMethods: {
      creditCard: true,
      upi: true,
      cod: true,
      netbanking: true
    },
    seo: {
      title: "BHONDU | Premium Luxury E-Sports & Fashion Wear",
      metaDescription: "Curated premium minimalist street wear and custom-tailored gaming jerseys for elite performance and luxury comfort."
    }
  });

  // Action methods to simulate admin database updates
  const addProduct = (newProduct) => {
    const formattedProduct = {
      id: `m-${products.length + 100}`,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.salePrice || newProduct.price),
      discount: newProduct.salePrice ? Math.round(((newProduct.price - newProduct.salePrice) / newProduct.price) * 100) : 0,
      rating: 5.0,
      reviewsCount: 0,
      images: newProduct.images || ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"],
      gender: newProduct.gender,
      category: newProduct.category,
      subcategory: newProduct.subcategory || "New Category",
      sizes: newProduct.sizes || ["M", "L"],
      colors: newProduct.colors || ["#111111"],
      isNewArrival: true,
      isBestSeller: false,
      isTrending: false,
      description: newProduct.description,
      stock: Number(newProduct.stock || 20),
      ...newProduct
    };
    setProducts((prev) => [formattedProduct, ...prev]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    
    // Update user timeline history if user exists
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.name === order.customerName) {
            return {
              ...c,
              history: [
                { date: new Date().toISOString().split('T')[0], event: `Order ${orderId} updated to ${newStatus}` },
                ...c.history
              ]
            };
          }
          return c;
        })
      );
    }
  };

  const addCoupon = (newCoupon) => {
    setCoupons((prev) => [
      { ...newCoupon, usageCount: 0, status: "Active" },
      ...prev
    ]);
  };

  const deleteCoupon = (code) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  const updateCMS = (section, itemIndex, updatedItem) => {
    setCms((prev) => {
      const updatedSection = [...prev[section]];
      updatedSection[itemIndex] = { ...updatedSection[itemIndex], ...updatedItem };
      return { ...prev, [section]: updatedSection };
    });
  };

  const saveSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        customers,
        coupons,
        subscribers,
        alerts,
        cms,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        addCoupon,
        deleteCoupon,
        updateCMS,
        saveSettings
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
