import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Cart state: [ { key, id, name, price, image, size, color, quantity } ]
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('bhondu_cart');
    return localData ? JSON.parse(localData) : [];
  });

  // Wishlist state: [ productId ]
  const [wishlist, setWishlist] = useState(() => {
    const localData = localStorage.getItem('bhondu_wishlist');
    return localData ? JSON.parse(localData) : [];
  });

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const localTheme = localStorage.getItem('bhondu_theme');
    if (localTheme) {
      return localTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Modal and Drawer UI states
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist cart
  useEffect(() => {
    localStorage.setItem('bhondu_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem('bhondu_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Apply dark mode class to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bhondu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bhondu_theme', 'light');
    }
  }, [isDarkMode]);

  // Cart operations
  const addToCart = (product, size, color, quantity = 1) => {
    const key = `${product.id}-${size}-${color}`;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.key === key);
      if (existingItem) {
        return prevItems.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prevItems,
          {
            key,
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size,
            color,
            quantity
          }
        ];
      }
    });
    toast.success(`${product.name} added to cart!`);
    // Open cart drawer on add to cart for better premium UX feedback
    setIsCartOpen(true);
  };

  const removeFromCart = (key) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.key === key);
      if (item) {
        toast.success(`${item.name} removed from cart.`);
      }
      return prevItems.filter((item) => item.key !== key);
    });
  };

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) {
      removeFromCart(key);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.key === key ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        toast.success('Removed from wishlist.');
        return prevWishlist.filter((id) => id !== productId);
      } else {
        toast.success('Added to wishlist!');
        return [...prevWishlist, productId];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Dark Mode toggler
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        wishlist,
        isDarkMode,
        quickViewProduct,
        isCartOpen,
        isWishlistOpen,
        isSearchOpen,
        isMobileMenuOpen,
        searchQuery,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        toggleDarkMode,
        setQuickViewProduct,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsSearchOpen,
        setIsMobileMenuOpen,
        setSearchQuery,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
