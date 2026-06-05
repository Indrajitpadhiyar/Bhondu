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

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Loader finishLoading={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col transition-colors duration-300 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Premium UI Overlay components */}
      <ScrollProgressBar />
      <CustomCursor />
      
      {/* Sticky glassmorphic navbar */}
      {!isHome && <Navbar />}

      {/* Main content body with fade transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/man" element={<Man />} />
            <Route path="/women" element={<Women />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Conditional footer: Hide on landing page for split-screen focus */}
      {!isHome && <Footer />}

      {/* Interactive global utilities */}
      <QuickViewModal />
      <BackToTop />
    </div>
  </>
);
}

export default App;
