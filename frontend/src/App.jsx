import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Man from './pages/Man';
import Women from './pages/Women';
import About from './pages/About';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ScrollProgressBar from './components/ScrollProgressBar';
import BackToTop from './components/BackToTop';
import QuickViewModal from './components/QuickViewModal';
import Loader from './components/Loader';
import { AnimatePresence } from 'framer-motion';

// Admin Imports
import { AdminProvider } from './context/AdminContext';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminInventory from './pages/admin/AdminInventory';
import AdminMarketing from './pages/admin/AdminMarketing';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminCMS from './pages/admin/AdminCMS';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAuth from './pages/admin/AdminAuth';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import SizeGuide from './pages/SizeGuide';
import Careers from './pages/Careers';
import Sustainability from './pages/Sustainability';
import Privacy from './pages/Privacy';

// Protection Guards
import PersistLogin from './components/common/PersistLogin';
import AdminRoute from './components/common/AdminRoute';
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  const [isLoading, setIsLoading] = useState(() => {
    return !sessionStorage.getItem('bhondu_loaded');
  });
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');
  const isAuth = location.pathname === '/login';
  const isHideGlobalUI = isAdmin || isAuth;

  return (
    <AdminProvider>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader
            finishLoading={() => {
              sessionStorage.setItem('bhondu_loaded', 'true');
              setIsLoading(false);
            }}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col transition-colors duration-300 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {/* Premium UI Overlay components */}
        {!isHideGlobalUI && <ScrollProgressBar />}
        <CustomCursor />
        
        {/* Sticky glassmorphic navbar */}
        {!isHome && !isHideGlobalUI && <Navbar />}

        {/* Main content body */}
        <main className="flex-grow">
            <Routes>
              <Route element={<PersistLogin />}>
                {/* Storefront Routes (Accessible to everyone) */}
                <Route path="/" element={<Home />} />
                <Route path="/man" element={<Man />} />
                <Route path="/women" element={<Women />} />
                <Route path="/about" element={<About />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/login" element={<AdminAuth />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/size-guide" element={<SizeGuide />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/sustainability" element={<Sustainability />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Panel Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="marketing" element={<AdminMarketing />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="cms" element={<AdminCMS />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>
            </Routes>
        </main>

        {/* Global storefront footer: Hide only on admin panel routes */}
        {!isAdmin && <Footer />}

        {/* Interactive global utilities */}
        {!isHideGlobalUI && <QuickViewModal />}
        {!isHideGlobalUI && <BackToTop />}
      </div>
    </AdminProvider>
  );
}

export default App;

