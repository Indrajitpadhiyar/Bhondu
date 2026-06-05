import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Users,
  Warehouse,
  Megaphone,
  BarChart3,
  Globe,
  Settings,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Bell,
  Search,
  Clock,
  LogOut,
  Maximize2,
  Minimize2,
  Sparkles,
  Command,
  Moon,
  Sun
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // tracking open submenu dropdowns
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [quickCmdOpen, setQuickCmdOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localstorage or default to true for modern dark dashboard feel
    return localStorage.getItem('admin-theme') === 'light' ? false : true;
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { alerts, orders } = useAdmin();

  // Tick current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('admin-theme', 'light');
    }
  }, [darkMode]);

  // Command palette listener (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setQuickCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSubmenu = (menuName) => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const navMenuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin'
    },
    {
      name: 'Products',
      icon: Shirt,
      submenu: [
        { name: 'All Products', path: '/admin/products' },
        { name: 'Add Product', path: '/admin/products?action=add' },
        { name: 'Categories', path: '/admin/products?tab=categories' },
        { name: 'Brands', path: '/admin/products?tab=brands' },
        { name: 'Product Reviews', path: '/admin/products?tab=reviews' }
      ]
    },
    {
      name: 'Orders',
      icon: ShoppingBag,
      submenu: [
        { name: 'All Orders', path: '/admin/orders' },
        { name: 'Pending Orders', path: '/admin/orders?status=Pending' },
        { name: 'Processing Orders', path: '/admin/orders?status=Processing' },
        { name: 'Delivered Orders', path: '/admin/orders?status=Delivered' },
        { name: 'Cancelled Orders', path: '/admin/orders?status=Cancelled' }
      ]
    },
    {
      name: 'Customers',
      icon: Users,
      submenu: [
        { name: 'All Customers', path: '/admin/customers' },
        { name: 'Customer Details', path: '/admin/customers?tab=details' },
        { name: 'Customer Analytics', path: '/admin/customers?tab=analytics' }
      ]
    },
    {
      name: 'Inventory',
      icon: Warehouse,
      submenu: [
        { name: 'Stock Management', path: '/admin/inventory' },
        { name: 'Low Stock Alerts', path: '/admin/inventory?filter=low' },
        { name: 'Inventory Reports', path: '/admin/inventory?tab=reports' }
      ]
    },
    {
      name: 'Marketing',
      icon: Megaphone,
      submenu: [
        { name: 'Coupons', path: '/admin/marketing' },
        { name: 'Banners', path: '/admin/marketing?tab=banners' },
        { name: 'Promotions', path: '/admin/marketing?tab=promotions' },
        { name: 'Newsletter', path: '/admin/marketing?tab=newsletter' }
      ]
    },
    {
      name: 'Tournament Collection',
      icon: Sparkles,
      submenu: [
        { name: 'Tournament Jerseys', path: '/admin/products?category=Tournament Wear&subcategory=Esports Jerseys' },
        { name: 'Gaming T-Shirts', path: '/admin/products?category=Tournament Wear&subcategory=Tournament T-Shirts' },
        { name: 'Custom Team Wear', path: '/admin/products?category=Tournament Wear&subcategory=Custom Tournament Wear' }
      ]
    },
    {
      name: 'Men Collection',
      icon: Shirt,
      submenu: [
        { name: 'Men Products', path: '/admin/products?gender=man' },
        { name: 'Men Categories', path: '/admin/products?gender=man&tab=categories' }
      ]
    },
    {
      name: 'Women Collection',
      icon: Shirt,
      submenu: [
        { name: 'Women Products', path: '/admin/products?gender=women' },
        { name: 'Women Categories', path: '/admin/products?gender=women&tab=categories' }
      ]
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      submenu: [
        { name: 'Revenue', path: '/admin/analytics' },
        { name: 'Sales Reports', path: '/admin/analytics?tab=sales' },
        { name: 'Traffic Reports', path: '/admin/analytics?tab=traffic' }
      ]
    },
    {
      name: 'Content Management',
      icon: Globe,
      submenu: [
        { name: 'Homepage Sections', path: '/admin/cms' },
        { name: 'Hero Banners', path: '/admin/cms?tab=hero' },
        { name: 'Testimonials', path: '/admin/cms?tab=testimonials' },
        { name: 'Lookbook Gallery', path: '/admin/cms?tab=lookbook' }
      ]
    },
    {
      name: 'Users',
      icon: ShieldCheck,
      submenu: [
        { name: 'Admin Users', path: '/admin/settings?tab=users' },
        { name: 'Roles & Permissions', path: '/admin/settings?tab=permissions' }
      ]
    },
    {
      name: 'Settings',
      icon: Settings,
      submenu: [
        { name: 'General', path: '/admin/settings' },
        { name: 'Shipping', path: '/admin/settings?tab=shipping' },
        { name: 'Payments', path: '/admin/settings?tab=payments' },
        { name: 'SEO', path: '/admin/settings?tab=seo' },
        { name: 'Theme Settings', path: '/admin/settings?tab=theme' }
      ]
    }
  ];

  const handleSubmenuLinkClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="min-h-screen flex bg-[#F8F7F4] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300 font-sans">
      
      {/* 1. Collapsible Left Sidebar (Desktop/Tablet) */}
      <aside
        className={`hidden md:flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-30 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Brand Logo & Collapse Trigger */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100 dark:border-zinc-800">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-zinc-900 dark:bg-white flex items-center justify-center font-bold text-white dark:text-zinc-900">
              B
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-xl uppercase tracking-widest font-logo">
                BHONDU<span className="text-[#C9A87C] font-sans text-xs lowercase ml-1">admin</span>
              </span>
            )}
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
          <nav className="space-y-1.5">
            {navMenuItems.map((menu) => {
              const Icon = menu.icon;
              const hasSubmenu = !!menu.submenu;
              const isOpen = activeMenu === menu.name;
              
              const isMenuPartiallyActive = hasSubmenu 
                ? menu.submenu.some(sub => location.pathname + location.search === sub.path || location.pathname === sub.path.split('?')[0])
                : location.pathname === menu.path;

              return (
                <div key={menu.name} className="w-full">
                  {hasSubmenu ? (
                    <button
                      onClick={() => toggleSubmenu(menu.name)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        isMenuPartiallyActive
                          ? 'bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-950 dark:text-white'
                          : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
                        {!sidebarCollapsed && <span>{menu.name}</span>}
                      </div>
                      {!sidebarCollapsed && (
                        <motion.div
                          animate={{ rotate: isOpen ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        </motion.div>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={menu.path}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        location.pathname === menu.path
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-medium'
                          : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {!sidebarCollapsed && <span>{menu.name}</span>}
                    </Link>
                  )}

                  {/* Submenu links */}
                  {!sidebarCollapsed && hasSubmenu && isOpen && (
                    <div className="pl-9 mt-1 space-y-1 border-l border-zinc-100 dark:border-zinc-800/70 ml-5">
                      {menu.submenu.map((sub) => {
                        const isSubActive = location.pathname + location.search === sub.path || location.pathname === sub.path.split('?')[0];
                        return (
                          <button
                            key={sub.name}
                            onClick={() => handleSubmenuLinkClick(sub.path)}
                            className={`w-full text-left py-1.5 px-3 rounded text-xs transition-colors duration-150 ${
                              isSubActive
                                ? 'text-zinc-950 dark:text-white font-medium bg-zinc-50 dark:bg-zinc-800/40'
                                : 'text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-white'
                            }`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs gap-2"
          >
            {sidebarCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            {!sidebarCollapsed && <span>Collapse Sidebar</span>}
          </button>
        </div>
      </aside>

      {/* 2. Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Mobile Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-50 p-6 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-xl uppercase tracking-widest font-logo">
                  BHONDU
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-full border border-zinc-200 dark:border-zinc-850"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items (Scrollable) */}
              <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none pr-1">
                {navMenuItems.map((menu) => {
                  const Icon = menu.icon;
                  const hasSubmenu = !!menu.submenu;
                  const isOpen = activeMenu === menu.name;

                  return (
                    <div key={menu.name} className="w-full">
                      {hasSubmenu ? (
                        <div>
                          <button
                            onClick={() => toggleSubmenu(menu.name)}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4" />
                              <span>{menu.name}</span>
                            </div>
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isOpen ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="pl-9 mt-1 space-y-1 border-l border-zinc-100 dark:border-zinc-800 ml-5">
                              {menu.submenu.map((sub) => (
                                <button
                                  key={sub.name}
                                  onClick={() => handleSubmenuLinkClick(sub.path)}
                                  className="w-full text-left py-1.5 px-3 rounded text-xs text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-white"
                                >
                                  {sub.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={menu.path}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm ${
                            location.pathname === menu.path
                              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{menu.name}</span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center justify-center p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 hover:text-red-500 text-xs gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit Admin Panel</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main Dashboard Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg text-zinc-500 dark:text-zinc-400 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Quick Command shortcut display */}
            <div
              onClick={() => setQuickCmdOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/30 text-xs text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search products, orders...</span>
              <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900 text-[10px]">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* System Clock */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {currentTime.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}{' '}
                - {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })}
              </span>
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Center Trigger */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 relative"
            >
              <Bell className="w-4 h-4" />
              {(alerts.length > 0 || pendingOrders > 0) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900 animate-pulse" />
              )}
            </button>

            {/* Profile Dropdown Indicator */}
            <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                alt="Admin Avatar"
                className="w-8 h-8 rounded-full border border-[#C9A87C] object-cover"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold">Indrajit P.</p>
                <p className="text-[10px] text-zinc-400">Store Owner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow p-4 md:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* 4. Notification Drawer */}
      <AnimatePresence>
        {notificationsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotificationsOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 z-50 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Notifications Center</h3>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1 rounded-full border border-zinc-150 dark:border-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Warnings / Action List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {/* Pending orders alerts */}
                {pendingOrders > 0 && (
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30">
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                      Pending Action Required
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      You have {pendingOrders} orders waiting for status confirmation.
                    </p>
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate('/admin/orders?status=Pending');
                      }}
                      className="mt-2 text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase hover:underline"
                    >
                      Process Orders &rarr;
                    </button>
                  </div>
                )}

                {/* Stock alerts */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-3">
                    Inventory Alerts ({alerts.length})
                  </h4>
                  <div className="space-y-2">
                    {alerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border text-xs flex justify-between items-center ${
                          alert.status === 'Critical' || alert.stock === 0
                            ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30'
                            : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        <div>
                          <p className="font-medium">{alert.name}</p>
                          <p className="text-[10px] text-zinc-400">
                            Size: {alert.size} - Stock: {alert.stock} units
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            alert.status === 'Critical' || alert.stock === 0
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}
                        >
                          {alert.stock === 0 ? 'Out of Stock' : alert.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5. Command Palette (Search Overlay) */}
      <AnimatePresence>
        {quickCmdOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickCmdOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -40 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-50 overflow-hidden"
            >
              <div className="flex items-center px-4 py-3.5 border-b border-zinc-150 dark:border-zinc-800">
                <Search className="w-5 h-5 text-zinc-400 mr-3" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 text-sm focus:outline-none focus:ring-0 text-zinc-950 dark:text-white"
                  autoFocus
                />
                <button
                  onClick={() => setQuickCmdOpen(false)}
                  className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded text-[10px] text-zinc-400 uppercase font-mono"
                >
                  ESC
                </button>
              </div>

              {/* Navigation Quick Shortcuts */}
              <div className="p-3 max-h-80 overflow-y-auto text-xs space-y-1">
                <div className="px-3 py-1.5 text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                  Quick Navigation
                </div>
                {[
                  { label: "Go to Dashboard", path: "/admin" },
                  { label: "View All Products", path: "/admin/products" },
                  { label: "Add New Product", path: "/admin/products?action=add" },
                  { label: "View Orders", path: "/admin/orders" },
                  { label: "View Customer list", path: "/admin/customers" },
                  { label: "Coupons & Marketing", path: "/admin/marketing" },
                  { label: "General Settings", path: "/admin/settings" }
                ].filter(cmd => cmd.label.toLowerCase().includes(searchQuery.toLowerCase())).map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(cmd.path);
                      setQuickCmdOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-between items-center text-zinc-700 dark:text-zinc-300 font-medium"
                  >
                    <span>{cmd.label}</span>
                    <span className="text-[10px] text-zinc-400">&crarr; Go</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
