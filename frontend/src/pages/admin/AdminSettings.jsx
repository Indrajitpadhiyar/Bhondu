import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Truck,
  CreditCard,
  Search,
  Shield,
  Palette,
  Check,
  Save,
  Plus,
  Trash2,
  Lock,
  Users,
  Edit2
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminSettings() {
  const { settings, saveSettings } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('general');

  // Sync tab with URL search parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab('general');
    }
  }, [location.search]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(`/admin/settings?tab=${tabName}`);
  };

  // Forms states
  const [storeForm, setStoreForm] = useState({
    storeName: settings.storeName,
    supportEmail: settings.supportEmail,
    contactPhone: settings.contactPhone,
    currency: settings.currency,
    taxRate: settings.taxRate
  });

  const [brandForm, setBrandForm] = useState({
    primary: settings.brandColors.primary,
    accent: settings.brandColors.accent,
    background: settings.brandColors.background
  });

  const [seoForm, setSeoForm] = useState({
    title: settings.seo.title,
    metaDescription: settings.seo.metaDescription
  });

  const [shippingMethods, setShippingMethods] = useState(settings.shippingMethods || []);
  const [paymentMethods, setPaymentMethods] = useState(settings.paymentMethods);

  // Sync shippingMethods when settings change in context
  useEffect(() => {
    if (settings.shippingMethods) {
      setShippingMethods(settings.shippingMethods);
    }
  }, [settings.shippingMethods]);

  // Custom Shipping Form State
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingForm, setShippingForm] = useState({ id: '', name: '', price: '' });

  const handleOpenCreateShipping = () => {
    setShippingForm({ id: '', name: '', price: '' });
    setShowShippingForm(true);
  };

  const handleOpenEditShipping = (method) => {
    setShippingForm({ id: method.id, name: method.name, price: String(method.price) });
    setShowShippingForm(true);
  };

  const handleSaveShippingMethod = (e) => {
    e.preventDefault();
    if (!shippingForm.name.trim() || !shippingForm.price.trim()) {
      alert("Please enter a name and rate.");
      return;
    }
    const priceNum = Number(shippingForm.price);
    if (isNaN(priceNum) || priceNum < 0) {
      alert("Rate must be a positive number.");
      return;
    }

    let updated;
    if (shippingForm.id) {
      // Editing existing
      updated = shippingMethods.map(sm => 
        sm.id === shippingForm.id 
          ? { ...sm, name: shippingForm.name, price: priceNum }
          : sm
      );
    } else {
      // Creating new
      const newMethod = {
        id: `sm-${Date.now()}`,
        name: shippingForm.name,
        price: priceNum,
        active: true
      };
      updated = [...shippingMethods, newMethod];
    }

    setShippingMethods(updated);
    saveSettings({ shippingMethods: updated });
    setShowShippingForm(false);
    setShippingForm({ id: '', name: '', price: '' });
  };

  const handleDeleteShippingMethod = (id) => {
    if (window.confirm("Are you sure you want to delete this shipping method?")) {
      const updated = shippingMethods.filter(sm => sm.id !== id);
      setShippingMethods(updated);
      saveSettings({ shippingMethods: updated });
      if (shippingForm.id === id) {
        setShowShippingForm(false);
        setShippingForm({ id: '', name: '', price: '' });
      }
    }
  };

  // System Users List
  const [systemUsers, setSystemUsers] = useState([
    { id: 'usr-1', name: 'Indrajit Padhiyar', email: 'owner@bhondu.com', role: 'Store Owner', status: 'Active' },
    { id: 'usr-2', name: 'Amit Kumar', email: 'amit.k@bhondu.com', role: 'Administrator', status: 'Active' },
    { id: 'usr-3', name: 'Sneha Rao', email: 'sneha.r@bhondu.com', role: 'Moderator', status: 'Away' }
  ]);

  const handleSaveStoreInfo = (e) => {
    e.preventDefault();
    saveSettings(storeForm);
    alert("Store settings saved successfully!");
  };

  const handleSaveBrandColors = (e) => {
    e.preventDefault();
    saveSettings({ brandColors: brandForm });
    alert("Brand custom colors saved successfully!");
  };

  const handleSaveSEO = (e) => {
    e.preventDefault();
    saveSettings({ seo: seoForm });
    alert("SEO settings saved successfully!");
  };

  const toggleShippingActive = (id) => {
    const updated = shippingMethods.map(sm => sm.id === id ? { ...sm, active: !sm.active } : sm);
    setShippingMethods(updated);
    saveSettings({ shippingMethods: updated });
  };

  const togglePaymentActive = (key) => {
    const updated = { ...paymentMethods, [key]: !paymentMethods[key] };
    setPaymentMethods(updated);
    saveSettings({ paymentMethods: updated });
  };

  const menuItems = [
    { id: 'general', label: 'Store Information', icon: Settings },
    { id: 'theme', label: 'Brand & Styling', icon: Palette },
    { id: 'shipping', label: 'Shipping Methods', icon: Truck },
    { id: 'payments', label: 'Payment Channels', icon: CreditCard },
    { id: 'seo', label: 'SEO & Metadata', icon: Search },
    { id: 'users', label: 'Admin Users & Roles', icon: Users }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-luxury-serif">Configuration Settings</h1>
        <p className="text-sm text-zinc-500">Configure global parameters, payment triggers, and styling tokens.</p>
      </div>

      {/* Main settings split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Settings Nav Menu (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'users' && activeTab === 'permissions');
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-850/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Form Config Panels (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm p-6">
          
          {/* 1. General Store Info */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveStoreInfo} className="space-y-5 text-xs text-left">
              <div className="pb-3 border-b border-zinc-150 dark:border-zinc-800">
                <h3 className="font-semibold text-sm font-luxury-serif text-zinc-900 dark:text-white">Store Information</h3>
                <p className="text-[11px] text-zinc-400">Configure basic company details and currency parameters.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Brand / Store Name</label>
                <input
                  type="text"
                  required
                  value={storeForm.storeName}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, storeName: e.target.value }))}
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Support Desk Email</label>
                  <input
                    type="email"
                    required
                    value={storeForm.supportEmail}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, supportEmail: e.target.value }))}
                    className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Support Phone</label>
                  <input
                    type="text"
                    required
                    value={storeForm.contactPhone}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                    className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Default Store Currency</label>
                  <select
                    value={storeForm.currency}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (&euro;)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Tax Assessment Rate (IGST %)</label>
                  <input
                    type="number"
                    required
                    value={storeForm.taxRate}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, taxRate: e.target.value }))}
                    className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg hover:bg-zinc-850 dark:hover:bg-zinc-100 font-semibold flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Store Profile
              </button>
            </form>
          )}

          {/* 2. Theme Brand Colors */}
          {activeTab === 'theme' && (
            <form onSubmit={handleSaveBrandColors} className="space-y-5 text-xs text-left">
              <div className="pb-3 border-b border-zinc-150 dark:border-zinc-800">
                <h3 className="font-semibold text-sm font-luxury-serif text-zinc-900 dark:text-white">Brand & CSS Styling</h3>
                <p className="text-[11px] text-zinc-400">Tweak color tokens. Layout elements adjust dynamically.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-150 dark:border-zinc-850">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">Primary Base Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandForm.primary}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, primary: e.target.value }))}
                      className="w-10 h-10 border rounded cursor-pointer bg-transparent"
                    />
                    <span className="font-mono text-zinc-500 font-bold">{brandForm.primary}</span>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-150 dark:border-zinc-850">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">Accent Color Token</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandForm.accent}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, accent: e.target.value }))}
                      className="w-10 h-10 border rounded cursor-pointer bg-transparent"
                    />
                    <span className="font-mono text-zinc-500 font-bold">{brandForm.accent}</span>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-150 dark:border-zinc-850">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">Site Background</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandForm.background}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, background: e.target.value }))}
                      className="w-10 h-10 border rounded cursor-pointer bg-transparent"
                    />
                    <span className="font-mono text-zinc-500 font-bold">{brandForm.background}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg hover:bg-zinc-850 dark:hover:bg-zinc-100 font-semibold flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Brand Styling Tokens
              </button>
            </form>
          )}

          {/* 3. Shipping configurations */}
          {activeTab === 'shipping' && (
            <div className="space-y-5 text-xs text-left">
              <div className="pb-3 border-b border-zinc-150 dark:border-zinc-800 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-sm font-luxury-serif text-zinc-900 dark:text-white">Shipping & Freight Allocators</h3>
                  <p className="text-[11px] text-zinc-400">Configure delivery channels and flat pricing rates.</p>
                </div>
                {!showShippingForm && (
                  <button
                    onClick={handleOpenCreateShipping}
                    className="px-2.5 py-1.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create Method
                  </button>
                )}
              </div>

              {/* Edit/Create Shipping Form */}
              {showShippingForm && (
                <form onSubmit={handleSaveShippingMethod} className="p-4 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4">
                  <h4 className="font-semibold text-xs text-zinc-850 dark:text-zinc-150 uppercase tracking-wider">
                    {shippingForm.id ? 'Edit Shipping Method' : 'Create Shipping Method'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Method Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Standard Delivery (3-5 days)"
                        value={shippingForm.name}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-850 dark:text-zinc-150"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Rate (₹)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 99"
                        value={shippingForm.price}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-850 dark:text-zinc-150"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowShippingForm(false)}
                      className="px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-500 cursor-pointer bg-transparent"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Method
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {shippingMethods.map((sm) => (
                  <div
                    key={sm.id}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                      sm.active
                        ? 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800'
                        : 'bg-zinc-100/40 text-zinc-400 border-zinc-200 dark:border-zinc-850 dark:bg-zinc-950/10'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">{sm.name}</p>
                      <p className="text-[10px] text-[#C9A87C] font-semibold font-mono mt-0.5">₹{sm.price.toFixed(2)} rate</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditShipping(sm)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer bg-transparent border-0"
                        title="Edit Method"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteShippingMethod(sm.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 cursor-pointer bg-transparent border-0"
                        title="Delete Method"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleShippingActive(sm.id)}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                          sm.active
                            ? 'bg-red-55 hover:bg-red-100 text-red-650 border-red-200'
                            : 'bg-emerald-55 hover:bg-emerald-100 text-emerald-650 border-emerald-200'
                        }`}
                      >
                        {sm.active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Payment configurations */}
          {activeTab === 'payments' && (
            <div className="space-y-5 text-xs text-left">
              <div className="pb-3 border-b border-zinc-150 dark:border-zinc-800">
                <h3 className="font-semibold text-sm font-luxury-serif text-zinc-900 dark:text-white">Active Payment Gateways</h3>
                <p className="text-[11px] text-zinc-400">Toggle gateways that load on the checkout page.</p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'creditCard', name: 'Credit & Debit Cards (Stripe / Razorpay)', details: 'Accepts Visa, Mastercard, RuPay, Amex' },
                  { key: 'upi', name: 'UPI Gateway (Google Pay, PhonePe, Paytm)', details: 'Instant bank settlements via UPI link' },
                  { key: 'cod', name: 'Cash on Delivery (COD) Option', details: 'Charges custom shipping premiums' },
                  { key: 'netbanking', name: 'Retail Net Banking', details: 'Over 55 connected Indian banks' }
                ].map((pay) => {
                  const isEnabled = paymentMethods[pay.key];
                  return (
                    <div
                      key={pay.key}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                        isEnabled
                          ? 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800'
                          : 'bg-zinc-100/40 text-zinc-400 border-zinc-200 dark:border-zinc-850 dark:bg-zinc-950/10'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">{pay.name}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{pay.details}</p>
                      </div>
                      <button
                        onClick={() => togglePaymentActive(pay.key)}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                          isEnabled
                            ? 'bg-red-50 hover:bg-red-100 text-red-655 border-red-250'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-655 border-emerald-250'
                        }`}
                      >
                        {isEnabled ? 'Turn Off' : 'Activate'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. SEO Configuration */}
          {activeTab === 'seo' && (
            <form onSubmit={handleSaveSEO} className="space-y-5 text-xs text-left">
              <div className="pb-3 border-b border-zinc-150 dark:border-zinc-800">
                <h3 className="font-semibold text-sm font-luxury-serif text-zinc-900 dark:text-white">SEO Settings</h3>
                <p className="text-[11px] text-zinc-400">Configure global metadata injected in search engine crawlers.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Homepage Meta Title</label>
                <input
                  type="text"
                  required
                  value={seoForm.title}
                  onChange={(e) => setSeoForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Homepage Meta Description</label>
                <textarea
                  rows="4"
                  required
                  value={seoForm.metaDescription}
                  onChange={(e) => setSeoForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg hover:bg-zinc-850 dark:hover:bg-zinc-100 font-semibold flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save SEO Tags
              </button>
            </form>
          )}

          {/* 6. Admin Users Directory */}
          {(activeTab === 'users' || activeTab === 'permissions') && (
            <div className="space-y-5 text-xs text-left">
              <div className="pb-3 border-b border-zinc-150 dark:border-zinc-800 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-sm font-luxury-serif text-zinc-900 dark:text-white">Admin Users & Permissions</h3>
                  <p className="text-[11px] text-zinc-400">Grant or restrict console access to team members.</p>
                </div>
                <button
                  onClick={() => alert("Inviting a new administrative user...")}
                  className="px-2.5 py-1.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded text-[10px] font-bold"
                >
                  Invite Team
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-150 dark:border-zinc-800 text-zinc-400 font-semibold uppercase bg-zinc-50/50 dark:bg-zinc-950/10">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Access Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemUsers.map((user) => (
                      <tr key={user.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/35">
                        <td className="py-3.5 px-4">
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white">{user.name}</p>
                            <p className="text-[10px] text-zinc-400">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded border border-zinc-200 font-mono text-[9px] font-bold bg-white dark:bg-zinc-950 dark:border-zinc-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                          {user.status}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            disabled={user.role === 'Store Owner'}
                            onClick={() => alert(`Modifying permissions for user: ${user.name}`)}
                            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
