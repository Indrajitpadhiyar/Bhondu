import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../services/productApi';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../services/orderApi';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

const EMPTY_ARRAY = [];

export const AdminProvider = ({ children }) => {
  const { data: dbProductsData } = useGetProductsQuery();
  const dbProducts = dbProductsData || EMPTY_ARRAY;
  
  const { data: dbOrdersData } = useGetOrdersQuery();
  const dbOrders = dbOrdersData || EMPTY_ARRAY;

  const [createProduct] = useCreateProductMutation();
  const [mutateUpdateProduct] = useUpdateProductMutation();
  const [mutateDeleteProduct] = useDeleteProductMutation();
  const [mutateUpdateOrderStatus] = useUpdateOrderStatusMutation();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [cms, setCms] = useState({
    heroBanners: [],
    lookbook: [],
    testimonials: []
  });

  useEffect(() => {
    if (dbProductsData && dbProductsData !== products) {
      setProducts(dbProductsData);
    }
  }, [dbProductsData, products]);

  useEffect(() => {
    if (dbOrdersData) {
      // Map order items to direct status
      setOrders(dbOrdersData.map(o => ({
        ...o,
        id: o._id,
        customerName: o.user?.name || o.shippingAddress?.fullName || 'Anonymous Customer',
        amount: o.totalPrice,
        date: new Date(o.createdAt).toISOString().split('T')[0],
        address: o.shippingAddress
          ? `${o.shippingAddress.street}, ${o.shippingAddress.city}, ${o.shippingAddress.state} - ${o.shippingAddress.postalCode}, ${o.shippingAddress.country}`
          : 'No Address Specified'
      })));
    }
  }, [dbOrdersData]);
  
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

  // Action methods linked to real database mutations
  const addProduct = async (newProduct) => {
    try {
      const formatted = {
        name: newProduct.name,
        price: Number(newProduct.price),
        salePrice: newProduct.salePrice ? Number(newProduct.salePrice) : null,
        images: newProduct.images || ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"],
        gender: newProduct.gender,
        category: newProduct.category,
        subcategory: newProduct.subcategory || "New Category",
        sizes: newProduct.sizes || ["M", "L"],
        colors: newProduct.colors || ["#111111"],
        description: newProduct.description,
        stock: Number(newProduct.stock || 20)
      };
      await createProduct(formatted).unwrap();
      toast.success('Product created successfully in database!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to create product.');
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      await mutateUpdateProduct({ productId: id, data: updatedProduct }).unwrap();
      toast.success('Product updated in database!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update product.');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await mutateDeleteProduct(id).unwrap();
      toast.success('Product deleted from database!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to delete product.');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await mutateUpdateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success('Order status updated successfully!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update status.');
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
