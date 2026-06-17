import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  User,
  MapPin,
  Lock,
  Camera,
  Plus,
  Trash2,
  CheckCircle,
  RotateCw,
  PlusCircle,
  Eye,
  EyeOff,
  Edit2,
  Check,
  X,
  Compass,
  ArrowLeft,
  ShoppingBag,
  Package,
  Clock,
  CreditCard,
  Truck,
  Copy
} from 'lucide-react';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation
} from '../services/userApi';
import { useChangePasswordMutation } from '../services/authApi';
import { useGetOrdersQuery } from '../services/orderApi';

const trackingStages = [
  { label: 'Order Placed', desc: 'Order received & confirmed', icon: ShoppingBag },
  { label: 'Processing', desc: 'Quality checking & packaging custom items', icon: RotateCw },
  { label: 'Shipped', desc: 'Handed over to courier partner', icon: Truck },
  { label: 'Out for Delivery', desc: 'In route with local agent', icon: Compass },
  { label: 'Delivered', desc: 'Fulfillment completed successfully', icon: CheckCircle }
];

const getTrackingStepIndex = (status) => {
  switch (status) {
    case 'Pending': return 0;
    case 'Processing': return 1;
    case 'Shipped':
    case 'Shipping': return 2;
    case 'Delivered': return 4;
    case 'Cancelled': return -1;
    default: return 0;
  }
};

const generateTrackingLogs = (order, activeIndex) => {
  const logs = [];
  const baseDate = new Date(order.createdAt);
  const userCity = order.shippingAddress?.city || 'your destination';

  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (activeIndex >= 0) {
    logs.push({
      title: 'Order Verified',
      desc: 'Fulfillment order verified and sent to warehouse pipeline.',
      time: addDays(baseDate, 0)
    });
  }
  if (activeIndex >= 1) {
    logs.push({
      title: 'Custom Designing & Quality Check',
      desc: 'Custom jersey player name/numbers tailored, printing verified, and package prepared.',
      time: addDays(baseDate, 0.5)
    });
  }
  if (activeIndex >= 2) {
    logs.push({
      title: 'Dispatched from Hub',
      desc: `Consignment shipped via BHONDU Express. Handed over to logistics carrier at Okhla Sorting Facility, New Delhi.`,
      time: addDays(baseDate, 1.5)
    });
  }
  if (activeIndex >= 2 && (order.status === 'Shipped' || order.status === 'Shipping' || order.status === 'Delivered')) {
    logs.push({
      title: 'Arrived at local facility',
      desc: `Consignment received at sorting hub in ${userCity}.`,
      time: addDays(baseDate, 3)
    });
  }
  if (activeIndex >= 4) {
    logs.push({
      title: 'Delivered',
      desc: `Consignment successfully hand-delivered to recipient at destination: ${userCity}.`,
      time: addDays(baseDate, 4)
    });
  }
  return logs.reverse();
};

export default function Profile() {
  const navigate = useNavigate();
  const { data: profileData, isLoading: isProfileLoading, refetch } = useGetProfileQuery();
  const user = profileData?.data?.user;

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdatingAddress }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeletingAddress }] = useDeleteAddressMutation();
  const [setDefaultAddress, { isLoading: isSettingDefault }] = useSetDefaultAddressMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const { data: orders, isLoading: isOrdersLoading } = useGetOrdersQuery();

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'addresses' | 'security' | 'orders'

  // Synchronize tab state with URL query search parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['general', 'addresses', 'security', 'orders'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [window.location.search]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(`/profile?tab=${tabName}`);
  };

  // General profile form states
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Password change states
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);

  // Order tracking states
  const [expandedTrackings, setExpandedTrackings] = useState({});
  const [copiedTrackingId, setCopiedTrackingId] = useState(null);

  const toggleTracking = (orderId) => {
    setExpandedTrackings(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedTrackingId(text);
    setTimeout(() => setCopiedTrackingId(null), 2000);
    toast.success("Tracking ID copied successfully!");
  };

  // Address edit/add modal/inline form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null); // null means adding new
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false
  });

  // Load user data into form on load/query success
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || ''
      });
      setAvatarPreview(user.avatar?.url || '');
    }
  }, [user]);

  // Dynamic password strength helper
  const checkPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, checks: { length: false, lowercase: false, uppercase: false, number: false, special: false } };
    
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd)
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { score, checks };
  };

  const getStrengthLabel = (score) => {
    if (score === 0) return { label: 'Empty', color: 'bg-zinc-200 dark:bg-zinc-850', textColor: 'text-zinc-400' };
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-550 dark:text-red-400' };
    if (score <= 4) return { label: 'Moderate', color: 'bg-amber-500', textColor: 'text-amber-550 dark:text-amber-400' };
    return { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-550 dark:text-emerald-400' };
  };

  const pwdStrength = checkPasswordStrength(passwordForm.newPassword);

  // Profile Form submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', profileForm.name);
    formData.append('phone', profileForm.phone);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile coordinates updated successfully!");
      setAvatarFile(null);
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Failed to update profile coordinates.");
    }
  };

  // Avatar file select change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Add or Edit Address submit
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.postalCode || !addressForm.country) {
      toast.error("Please populate all address fields.");
      return;
    }

    try {
      if (editingAddressId) {
        await updateAddress({ addressId: editingAddressId, data: addressForm }).unwrap();
        toast.success("Address coordinates updated successfully!");
      } else {
        await addAddress(addressForm).unwrap();
        toast.success("New address coordinates logged successfully!");
      }
      resetAddressForm();
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Failed to submit address coordinate details.");
    }
  };

  // Setup edit address mode
  const startEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      name: addr.name || '',
      phone: addr.phone || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || '',
      isDefault: addr.isDefault || false
    });
    setShowAddressForm(true);
  };

  // Remove address handler
  const handleDeleteAddress = async (addrId) => {
    if (window.confirm("Are you sure you want to remove this delivery address?")) {
      try {
        await deleteAddress(addrId).unwrap();
        toast.success("Address coordinates deleted.");
        refetch();
      } catch (err) {
        toast.error(err.data?.message || "Failed to remove address.");
      }
    }
  };

  // Set default address handler
  const handleSetDefault = async (addrId) => {
    try {
      await setDefaultAddress(addrId).unwrap();
      toast.success("Default shipping destination updated.");
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Failed to update default state.");
    }
  };

  const resetAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: false
    });
  };

  // Security password update submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all authentication fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (pwdStrength.score < 5) {
      toast.error("Password must fully meet all strength checklist criteria.");
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success("Security keys updated. Please log in again.");
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // Wait for navigation or token invalidation to take effect
    } catch (err) {
      toast.error(err.data?.message || "Security password update rejected.");
    }
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4] dark:bg-zinc-950">
        <RotateCw className="w-8 h-8 text-[#C9A87C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-zinc-950 transition-colors duration-300 font-sans pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Header Title */}
        <div className="text-center md:text-left space-y-3 mb-10">
          <span className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase">CONSOLE OPERATIONS</span>
          <h1 className="font-luxury-serif text-3xl sm:text-5xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
            MY CODESPACE
          </h1>
          <div className="w-16 h-[1px] bg-accent md:mx-0 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar Panel */}
          <div className="lg:col-span-1 space-y-2">
            <button
              onClick={() => handleTabChange('general')}
              className={`w-full text-left py-3.5 px-4 border rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${
                activeTab === 'general'
                  ? 'border-accent bg-white dark:bg-zinc-900 text-accent shadow-sm'
                  : 'border-secondary/45 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 text-zinc-500 hover:text-primary dark:hover:text-zinc-200'
              }`}
            >
              <User className="w-4 h-4" />
              General profile
            </button>
            <button
              onClick={() => handleTabChange('orders')}
              className={`w-full text-left py-3.5 px-4 border rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${
                activeTab === 'orders'
                  ? 'border-accent bg-white dark:bg-zinc-900 text-accent shadow-sm'
                  : 'border-secondary/45 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 text-zinc-500 hover:text-primary dark:hover:text-zinc-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              My Orders
            </button>
            <button
              onClick={() => handleTabChange('addresses')}
              className={`w-full text-left py-3.5 px-4 border rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${
                activeTab === 'addresses'
                  ? 'border-accent bg-white dark:bg-zinc-900 text-accent shadow-sm'
                  : 'border-secondary/45 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 text-zinc-500 hover:text-primary dark:hover:text-zinc-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Saved destinations
            </button>
            <button
              onClick={() => handleTabChange('security')}
              className={`w-full text-left py-3.5 px-4 border rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${
                activeTab === 'security'
                  ? 'border-accent bg-white dark:bg-zinc-900 text-accent shadow-sm'
                  : 'border-secondary/45 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 text-zinc-500 hover:text-primary dark:hover:text-zinc-200'
              }`}
            >
              <Lock className="w-4 h-4" />
              Security Gateway
            </button>

            {/* Backwards navigation options */}
            <div className="pt-4 border-t border-secondary/20 dark:border-zinc-800/80 mt-4 space-y-2">
              {(user?.role === 'Admin' || user?.role === 'Store Owner') && (
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full text-left py-3.5 px-4 border border-secondary/45 dark:border-zinc-800 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer hover:opacity-90"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={() => navigate(-1)}
                className="w-full text-left py-3.5 px-4 border border-secondary/45 dark:border-zinc-800 bg-transparent text-zinc-500 hover:text-primary dark:hover:text-zinc-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Backward
              </button>
            </div>
          </div>

          {/* Main Panel Content Box */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-zinc-900 border border-secondary/45 dark:border-zinc-800 p-6 sm:p-10 rounded-sm shadow-sm min-h-[450px]">
              
              <AnimatePresence mode="wait">
                {/* 1. GENERAL COORDINATES PANEL */}
                {activeTab === 'general' && (
                  <motion.div
                    key="general-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    <div className="border-b border-secondary/45 dark:border-zinc-800 pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-zinc-100">Profile Details</h3>
                      <p className="text-[11px] text-zinc-400 mt-1">Configure your personal coordinate details and console credentials.</p>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      
                      {/* Avatar Upload Selection Grid */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 pb-4">
                        <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-accent/40 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center cursor-pointer select-none">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt={user?.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
                          )}
                          <label className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold text-white tracking-widest cursor-pointer uppercase gap-1">
                            <Camera className="w-4 h-4 text-accent" />
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div className="text-center sm:text-left space-y-1">
                          <p className="text-xs font-bold tracking-wider text-primary dark:text-zinc-100">{user?.name?.toUpperCase()}</p>
                          <p className="text-[11px] text-zinc-400">{user?.email}</p>
                          <span className="inline-block px-2.5 py-0.5 border border-accent/30 rounded-full text-[9px] uppercase tracking-wider text-accent font-semibold bg-accent/5">
                            {user?.role || 'Customer'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-left">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Verification Name</label>
                          <input
                            type="text"
                            required
                            value={profileForm.name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full pl-3 pr-3 py-3 border border-secondary/45 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 focus:outline-none focus:border-accent text-zinc-850 dark:text-zinc-150 transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Contact Phone Coordinates</label>
                          <input
                            type="text"
                            placeholder="+91 XXXXX XXXXX"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full pl-3 pr-3 py-3 border border-secondary/45 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 focus:outline-none focus:border-accent text-zinc-850 dark:text-zinc-150 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="pt-4 text-right">
                        <button
                          type="submit"
                          disabled={isUpdatingProfile}
                          className="px-6 py-3.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-100 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ml-auto cursor-pointer"
                        >
                          {isUpdatingProfile ? (
                            <>
                              <RotateCw className="w-3.5 h-3.5 animate-spin" />
                              Syncing Coordinates...
                            </>
                          ) : (
                            <>
                              Save updates
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* 2. SAVED SHIPPINGS/DESTINATIONS PANEL */}
                {activeTab === 'addresses' && (
                  <motion.div
                    key="addresses-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    <div className="flex justify-between items-center border-b border-secondary/45 dark:border-zinc-800 pb-4">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-zinc-100">Saved Destinations</h3>
                        <p className="text-[11px] text-zinc-400 mt-1">Manage delivery locations and primary logistical destinations.</p>
                      </div>
                      {!showAddressForm && (
                        <button
                          onClick={() => {
                            setEditingAddressId(null);
                            setAddressForm({ name: '', phone: '', street: '', city: '', state: '', postalCode: '', country: '', isDefault: false });
                            setShowAddressForm(true);
                          }}
                          className="px-3.5 py-2 border border-accent rounded-sm text-[10px] font-bold uppercase tracking-widest text-accent hover:bg-accent/5 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          New address
                        </button>
                      )}
                    </div>

                    {/* Address Add/Edit Form Overlay */}
                    {showAddressForm ? (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-secondary/15 dark:bg-zinc-950/20 border border-secondary/35 dark:border-zinc-850 p-5 rounded-sm space-y-4 text-xs text-left"
                        onSubmit={handleAddressSubmit}
                      >
                        <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                          {editingAddressId ? 'Edit Logistics Destination' : 'Add New Shipping Point'}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-zinc-450 dark:text-zinc-500 font-bold block">Full Name</label>
                            <input
                              type="text"
                              required
                              value={addressForm.name}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-secondary/45 dark:border-zinc-850 bg-white dark:bg-zinc-900 rounded-sm focus:outline-none focus:border-accent text-zinc-800 dark:text-zinc-200"
                              placeholder="Recipient's Name"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-zinc-450 dark:text-zinc-500 font-bold block">Mobile Number</label>
                            <input
                              type="tel"
                              required
                              pattern="[0-9]{10,15}"
                              value={addressForm.phone}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-secondary/45 dark:border-zinc-850 bg-white dark:bg-zinc-900 rounded-sm focus:outline-none focus:border-accent text-zinc-800 dark:text-zinc-200"
                              placeholder="10-digit mobile number"
                            />
                          </div>

                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[9px] uppercase tracking-wider text-zinc-450 dark:text-zinc-500 font-bold block">Street Address</label>
                            <input
                              type="text"
                              required
                              value={addressForm.street}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-secondary/45 dark:border-zinc-850 bg-white dark:bg-zinc-900 rounded-sm focus:outline-none focus:border-accent text-zinc-800 dark:text-zinc-200"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-zinc-450 dark:text-zinc-500 font-bold block">City</label>
                            <input
                              type="text"
                              required
                              value={addressForm.city}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-secondary/45 dark:border-zinc-850 bg-white dark:bg-zinc-900 rounded-sm focus:outline-none focus:border-accent text-zinc-800 dark:text-zinc-200"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-zinc-450 dark:text-zinc-500 font-bold block">State / Region</label>
                            <input
                              type="text"
                              required
                              value={addressForm.state}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-secondary/45 dark:border-zinc-850 bg-white dark:bg-zinc-900 rounded-sm focus:outline-none focus:border-accent text-zinc-800 dark:text-zinc-200"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-zinc-450 dark:text-zinc-500 font-bold block">Postal / Zip Code</label>
                            <input
                              type="text"
                              required
                              value={addressForm.postalCode}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-secondary/45 dark:border-zinc-850 bg-white dark:bg-zinc-900 rounded-sm focus:outline-none focus:border-accent text-zinc-800 dark:text-zinc-200"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-zinc-450 dark:text-zinc-500 font-bold block">Country</label>
                            <input
                              type="text"
                              required
                              value={addressForm.country}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-secondary/45 dark:border-zinc-850 bg-white dark:bg-zinc-900 rounded-sm focus:outline-none focus:border-accent text-zinc-800 dark:text-zinc-200"
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                            className="rounded border-zinc-200 dark:border-zinc-800 focus:ring-accent text-zinc-900"
                          />
                          <span className="text-[11px] text-zinc-500 font-medium select-none">Set as primary default shipping address</span>
                        </label>

                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            type="button"
                            onClick={resetAddressForm}
                            className="px-4 py-2 border border-secondary/45 dark:border-zinc-800 rounded-sm hover:bg-secondary/5 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isAddingAddress || isUpdatingAddress}
                            className="px-4 py-2 bg-zinc-900 dark:bg-white dark:text-zinc-950 text-white rounded-sm hover:opacity-90 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            {(isAddingAddress || isUpdatingAddress) && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
                            Commit address
                          </button>
                        </div>
                      </motion.form>
                    ) : null}

                    {/* Address card grids */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user?.addresses && user.addresses.length > 0 ? (
                        user.addresses.map((addr) => (
                          <div
                            key={addr._id}
                            className={`p-4 border rounded-sm flex flex-col justify-between min-h-[160px] text-left transition-all ${
                              addr.isDefault
                                ? 'border-accent bg-accent/[0.02] shadow-sm'
                                : 'border-secondary/45 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/10'
                            }`}
                          >
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between items-start">
                                <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-400">Destination</span>
                                {addr.isDefault && (
                                  <span className="px-2 py-0.5 border border-accent rounded-full text-[8px] uppercase tracking-wider text-accent font-bold bg-accent/5">
                                    Primary
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-between items-center text-zinc-800 dark:text-zinc-200 mt-1">
                                <span className="font-bold">{addr.name}</span>
                                <span className="text-[11px] text-zinc-400 font-medium">{addr.phone}</span>
                              </div>
                              <p className="font-semibold text-zinc-800 dark:text-zinc-200">{addr.street}</p>
                              <p className="text-zinc-500 dark:text-zinc-400">{addr.city}, {addr.state} - {addr.postalCode}</p>
                              <p className="text-[10px] text-zinc-450 dark:text-zinc-500 uppercase tracking-wider font-semibold">{addr.country}</p>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-secondary/30 dark:border-zinc-850/30 mt-4 text-[10px] font-bold uppercase tracking-widest">
                              <div>
                                {!addr.isDefault && (
                                  <button
                                    onClick={() => handleSetDefault(addr._id)}
                                    disabled={isSettingDefault}
                                    className="text-zinc-400 hover:text-accent transition-colors cursor-pointer"
                                  >
                                    Set Default
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => startEditAddress(addr)}
                                  className="text-zinc-400 hover:text-primary dark:hover:text-zinc-100 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAddress(addr._id)}
                                  disabled={isDeletingAddress}
                                  className="text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 py-12 border border-dashed border-secondary/45 dark:border-zinc-800 flex flex-col items-center justify-center text-center space-y-3 rounded-sm opacity-80">
                          <Compass className="w-10 h-10 text-zinc-300 dark:text-zinc-700 stroke-[1]" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">No Shipping Points Saved Yet</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 3. SECURITY GATEWAY / CHANGE PASSWORD */}
                {activeTab === 'security' && (
                  <motion.div
                    key="security-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    <div className="border-b border-secondary/45 dark:border-zinc-800 pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-zinc-100">Security Configuration</h3>
                      <p className="text-[11px] text-zinc-400 mt-1">Rotate security password keys to update dashboard validation protocols.</p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-5 text-xs text-left max-w-xl">
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPass ? 'text' : 'password'}
                            required
                            placeholder="••••••••"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full text-xs pl-3 pr-8 py-3 border border-secondary/45 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 focus:outline-none focus:border-accent text-zinc-800 dark:text-zinc-200"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">New Password</label>
                          <div className="relative">
                            <input
                              type={showPass ? 'text' : 'password'}
                              required
                              placeholder="••••••••"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="w-full text-xs pl-3 pr-8 py-3 border border-secondary/45 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 focus:outline-none focus:border-accent text-zinc-800 dark:text-zinc-200"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPass(!showPass)}
                              className="absolute right-2.5 top-3.5 text-zinc-400 hover:text-zinc-650"
                            >
                              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showPass ? 'text' : 'password'}
                              required
                              placeholder="••••••••"
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="w-full text-xs pl-3 pr-8 py-3 border border-secondary/45 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 focus:outline-none focus:border-accent text-zinc-800 dark:text-zinc-200"
                            />
                          </div>
                        </div>

                        {/* Real-time Password Strength indicator from Login flow */}
                        <AnimatePresence>
                          {passwordForm.newPassword && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="col-span-1 sm:col-span-2 space-y-2 pt-1 overflow-hidden"
                            >
                              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                                <span className="text-zinc-450 dark:text-zinc-500 font-bold">New Security Key Strength</span>
                                <span className={getStrengthLabel(pwdStrength.score).textColor}>
                                  {getStrengthLabel(pwdStrength.score).label}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-5 gap-1.5">
                                {[1, 2, 3, 4, 5].map((index) => (
                                  <div
                                    key={index}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                      index <= pwdStrength.score
                                        ? getStrengthLabel(pwdStrength.score).color
                                        : 'bg-zinc-250 dark:bg-zinc-850'
                                    }`}
                                  />
                                ))}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1 text-[11px]">
                                <div className="flex items-center gap-1.5">
                                  {pwdStrength.checks.length ? (
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-350 dark:border-zinc-750 flex items-center justify-center text-[8px] font-bold text-zinc-400 dark:text-zinc-600 shrink-0">1</div>
                                  )}
                                  <span className={pwdStrength.checks.length ? 'text-zinc-800 dark:text-zinc-200 transition-colors font-medium' : 'text-zinc-400'}>
                                    Min 8 characters
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {pwdStrength.checks.uppercase ? (
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-350 dark:border-zinc-750 flex items-center justify-center text-[8px] font-bold text-zinc-400 dark:text-zinc-600 shrink-0">2</div>
                                  )}
                                  <span className={pwdStrength.checks.uppercase ? 'text-zinc-800 dark:text-zinc-200 transition-colors font-medium' : 'text-zinc-400'}>
                                    At least one uppercase
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {pwdStrength.checks.lowercase ? (
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-350 dark:border-zinc-750 flex items-center justify-center text-[8px] font-bold text-zinc-400 dark:text-zinc-600 shrink-0">3</div>
                                  )}
                                  <span className={pwdStrength.checks.lowercase ? 'text-zinc-800 dark:text-zinc-200 transition-colors font-medium' : 'text-zinc-400'}>
                                    At least one lowercase
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {pwdStrength.checks.number ? (
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-350 dark:border-zinc-750 flex items-center justify-center text-[8px] font-bold text-zinc-400 dark:text-zinc-600 shrink-0">4</div>
                                  )}
                                  <span className={pwdStrength.checks.number ? 'text-zinc-800 dark:text-zinc-200 transition-colors font-medium' : 'text-zinc-400'}>
                                    At least one number
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:col-span-2">
                                  {pwdStrength.checks.special ? (
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-350 dark:border-zinc-750 flex items-center justify-center text-[8px] font-bold text-zinc-400 dark:text-zinc-600 shrink-0">5</div>
                                  )}
                                  <span className={pwdStrength.checks.special ? 'text-zinc-800 dark:text-zinc-200 transition-colors font-medium' : 'text-zinc-400'}>
                                    At least one symbol (!@#$%^& etc.)
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="pt-4 text-right">
                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="px-6 py-3.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-100 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ml-auto cursor-pointer"
                        >
                          {isChangingPassword ? (
                            <>
                              <RotateCw className="w-3.5 h-3.5 animate-spin" />
                              Committing security keys...
                            </>
                          ) : (
                            <>
                              Commit new credentials
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* 4. ORDERS HISTORY PANEL */}
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8 text-left text-xs"
                  >
                    <div className="border-b border-secondary/45 dark:border-zinc-800 pb-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-zinc-100">Order History</h3>
                        <p className="text-[11px] text-zinc-400 mt-1">Review past orders, check fulfillment logs, and track shipments.</p>
                      </div>
                    </div>

                    {isOrdersLoading ? (
                      <div className="py-20 flex items-center justify-center">
                        <RotateCw className="w-8 h-8 text-[#C9A87C] animate-spin" />
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div
                            key={order._id}
                            className="border border-secondary/45 dark:border-zinc-800 rounded-sm p-5 space-y-4 bg-zinc-50/20 dark:bg-zinc-950/10 hover:shadow-md transition-shadow"
                          >
                            {/* Order Header Info */}
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-secondary/30 dark:border-zinc-850/30 pb-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span className="text-primary dark:text-zinc-100 font-mono">ORDER ID: #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                                <span>DATE: {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-zinc-550 dark:text-zinc-450">Total: ₹{order.totalPrice.toFixed(2)}</span>
                                <span className={`px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wider font-semibold ${
                                  order.status === 'Delivered'
                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                                    : order.status === 'Shipping'
                                    ? 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400'
                                    : 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>

                            {/* Order items grid */}
                            <div className="space-y-3">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                  <img
                                    src={item.image || (item.product?.images && item.product.images[0]) || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"}
                                    alt={item.name || (item.product && item.product.name)}
                                    className="w-12 h-14 object-cover rounded-sm border border-secondary/20 dark:border-zinc-800"
                                  />
                                  <div className="flex-1 min-w-0 text-left">
                                    <p className="font-bold text-zinc-800 dark:text-zinc-200 truncate uppercase tracking-wider">
                                      {item.name || (item.product && item.product.name)}
                                    </p>
                                    <p className="text-[10px] text-zinc-450 dark:text-zinc-450 mt-0.5">
                                      Size: {item.size} | Qty: {item.quantity}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <span className="text-[10px] text-zinc-450 dark:text-zinc-550">Color:</span>
                                      <span
                                        className="inline-block w-3 h-3 rounded-full border align-middle"
                                        style={{ backgroundColor: item.color }}
                                      />
                                    </div>
                                    {item.teamName && (
                                      <p className="text-[10px] text-zinc-450 dark:text-zinc-450 mt-0.5">
                                        Team: <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase">{item.teamName}</span>
                                      </p>
                                    )}
                                    {item.backsidePlayerName && (
                                      <p className="text-[10px] text-zinc-450 dark:text-zinc-450 mt-0.5">
                                        Player: <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase">{item.backsidePlayerName} {item.playerNumber ? `#${item.playerNumber}` : ''}</span>
                                      </p>
                                    )}
                                    {!item.backsidePlayerName && item.playerNumber && (
                                      <p className="text-[10px] text-zinc-450 dark:text-zinc-450 mt-0.5">
                                        Number: <span className="font-bold text-zinc-800 dark:text-zinc-200">#{item.playerNumber}</span>
                                      </p>
                                    )}
                                    {item.chestLogo && (
                                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-450 dark:text-zinc-450">
                                        <span>Logo:</span>
                                        <img src={item.chestLogo} alt="Logo" className="w-6 h-6 object-contain border border-secondary dark:border-zinc-800 rounded-sm" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right font-bold text-zinc-900 dark:text-zinc-100">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Address details and Payment details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-secondary/20 dark:border-zinc-850/20 text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                              <div>
                                <span className="block uppercase tracking-wider text-zinc-400 font-bold mb-1">Logistics Destination</span>
                                <p className="text-zinc-650 dark:text-zinc-350">
                                  {order.shippingAddress.name} ({order.shippingAddress.phone})<br />
                                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                </p>
                              </div>
                              <div className="sm:text-right space-y-1">
                                <div>
                                  <span className="uppercase tracking-wider text-zinc-400 font-bold">Payment Method:</span>{' '}
                                  <span className="text-zinc-650 dark:text-zinc-350 uppercase font-mono">{order.paymentMethod}</span>
                                </div>
                                <div>
                                  <span className="uppercase tracking-wider text-zinc-400 font-bold">Payment Status:</span>{' '}
                                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold font-mono ${
                                    order.paymentStatus === 'Paid'
                                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                  }`}>
                                    {order.paymentStatus}
                                  </span>
                                </div>
                                </div>
                            </div>

                            {/* Tracking Toggle and Est Delivery Row */}
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center pt-4 border-t border-secondary/20 dark:border-zinc-850/20 mt-4 text-[10px] font-bold uppercase tracking-widest gap-2">
                              <div>
                                <button
                                  type="button"
                                  onClick={() => toggleTracking(order._id)}
                                  className="text-accent hover:opacity-80 flex items-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider transition-opacity py-1.5 font-sans"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  {expandedTrackings[order._id] ? 'Hide Tracking Details' : 'Track Consignment'}
                                </button>
                              </div>
                              <div className="text-zinc-455 font-mono text-[9px] select-all sm:text-right py-1">
                                EST. ARRIVAL: {new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>

                            {/* Dynamic Order Tracking Stepper Timeline */}
                            <AnimatePresence>
                              {expandedTrackings[order._id] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden border-t border-secondary/30 dark:border-zinc-850/30 pt-5 mt-4 text-xs space-y-6"
                                >
                                  {/* Waybill & Courier Partner Metadata */}
                                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 bg-zinc-50/50 dark:bg-zinc-950/20 border border-secondary/35 dark:border-zinc-850 rounded-sm">
                                    <div className="space-y-1">
                                      <p className="text-[9px] uppercase tracking-wider font-bold text-zinc-450 dark:text-zinc-500">Logistical Dispatcher</p>
                                      <p className="text-zinc-850 dark:text-zinc-200 font-bold flex items-center gap-1.5">
                                        <Truck className="w-4 h-4 text-accent" /> BHONDU EXPRESS FULFILLMENT
                                      </p>
                                    </div>
                                    <div className="space-y-1 text-left sm:text-right">
                                      <p className="text-[9px] uppercase tracking-wider font-bold text-zinc-450 dark:text-zinc-500">Waybill Tracking Number</p>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-mono text-zinc-750 dark:text-zinc-305 font-bold select-all">
                                          BHDEX-{order._id.substring(order._id.length - 12).toUpperCase()}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => copyToClipboard(`BHDEX-${order._id.substring(order._id.length - 12).toUpperCase()}`)}
                                          className="p-1 hover:bg-secondary/25 dark:hover:bg-zinc-850 text-zinc-400 hover:text-accent rounded transition-colors cursor-pointer"
                                          title="Copy Waybill ID"
                                        >
                                          {copiedTrackingId === `BHDEX-${order._id.substring(order._id.length - 12).toUpperCase()}` ? (
                                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                                          ) : (
                                            <Copy className="w-3.5 h-3.5" />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Terminal Cancellation Banner */}
                                  {order.status === 'Cancelled' ? (
                                    <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-red-500/25 bg-red-500/5 rounded-sm space-y-2">
                                      <X className="w-8 h-8 text-red-500 bg-red-500/10 rounded-full p-1.5 border border-red-500/20" />
                                      <h4 className="font-bold text-red-500 uppercase tracking-widest text-[10px]">Logistical Journey Terminated</h4>
                                      <p className="text-[10px] text-zinc-450 max-w-sm">This package dispatcher sequence was cancelled. Tracking history is archived.</p>
                                    </div>
                                  ) : (
                                    <>
                                      {/* Visual Stepper Progress Bar */}
                                      <div className="py-4 select-none">
                                        {/* Desktop Timeline */}
                                        <div className="hidden md:flex justify-between items-start relative mb-10 pl-4 pr-4">
                                          {/* BG Stepper Connector Line */}
                                          <div className="absolute top-[18px] left-[55px] right-[55px] h-0.5 bg-zinc-200 dark:bg-zinc-800 z-0" />
                                          {/* Active Connector Progress Line */}
                                          <div 
                                            className="absolute top-[18px] left-[55px] h-0.5 bg-accent z-0 transition-all duration-700" 
                                            style={{ 
                                              width: `calc(${Math.min(getTrackingStepIndex(order.status), 4) / 4 * 100}% - ${Math.min(getTrackingStepIndex(order.status), 4) === 0 ? '0px' : Math.min(getTrackingStepIndex(order.status), 4) === 4 ? '1px' : '0px'})` 
                                            }}
                                          />

                                          {trackingStages.map((stage, idx) => {
                                            const activeIndex = getTrackingStepIndex(order.status);
                                            const isCompleted = idx < activeIndex;
                                            const isActive = idx === activeIndex;
                                            const StageIcon = stage.icon;

                                            return (
                                              <div key={idx} className="flex flex-col items-center text-center z-10 w-32 relative">
                                                <div 
                                                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                                    isCompleted 
                                                      ? 'bg-accent border-accent text-zinc-950 font-bold'
                                                      : isActive
                                                      ? 'bg-white dark:bg-zinc-900 border-accent text-accent shadow-lg shadow-accent/25 ring-4 ring-accent/20 animate-pulse font-bold'
                                                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400'
                                                  }`}
                                                >
                                                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <StageIcon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />}
                                                </div>
                                                <div className="mt-3 space-y-0.5">
                                                  <p className={`font-bold text-[9px] uppercase tracking-wider ${isActive ? 'text-accent' : isCompleted ? 'text-zinc-850 dark:text-zinc-200' : 'text-zinc-400'}`}>
                                                    {stage.label}
                                                  </p>
                                                  <p className="text-[8px] text-zinc-455 font-medium leading-tight max-w-[100px] mx-auto">
                                                    {stage.desc}
                                                  </p>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>

                                        {/* Mobile Timeline */}
                                        <div className="flex flex-col gap-6 md:hidden relative pl-6 border-l border-zinc-200 dark:border-zinc-850 ml-3 py-1">
                                          <div 
                                            className="absolute left-[-1px] top-0 w-[2px] bg-accent transition-all duration-700"
                                            style={{ 
                                              height: `${Math.min(getTrackingStepIndex(order.status), 4) / 4 * 100}%`
                                            }}
                                          />

                                          {trackingStages.map((stage, idx) => {
                                            const activeIndex = getTrackingStepIndex(order.status);
                                            const isCompleted = idx < activeIndex;
                                            const isActive = idx === activeIndex;
                                            const StageIcon = stage.icon;

                                            return (
                                              <div key={idx} className="flex gap-4 relative">
                                                <div 
                                                  className={`w-7 h-7 rounded-full flex items-center justify-center border absolute left-[-31px] top-0.5 z-10 transition-all duration-300 ${
                                                    isCompleted 
                                                      ? 'bg-accent border-accent text-zinc-950 font-bold'
                                                      : isActive
                                                      ? 'bg-white dark:bg-zinc-900 border-accent text-accent shadow-lg shadow-accent/25 ring-4 ring-accent/20 animate-pulse font-bold'
                                                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400'
                                                  }`}
                                                >
                                                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : <StageIcon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : ''}`} />}
                                                </div>
                                                <div className="space-y-0.5 text-left pl-1">
                                                  <p className={`font-bold text-[9px] uppercase tracking-wider ${isActive ? 'text-accent' : isCompleted ? 'text-zinc-850 dark:text-zinc-200' : 'text-zinc-400'}`}>
                                                    {stage.label}
                                                  </p>
                                                  <p className="text-[10px] text-zinc-450 leading-normal">
                                                    {stage.desc}
                                                  </p>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Logistical Update List */}
                                      <div className="space-y-3 bg-secondary/5 dark:bg-zinc-950/10 border border-secondary/25 dark:border-zinc-850 p-4 rounded-sm">
                                        <h5 className="text-[9px] uppercase tracking-wider font-bold text-zinc-400 flex items-center gap-1.5 border-b border-secondary/20 dark:border-zinc-850/20 pb-2">
                                          <Compass className="w-3.5 h-3.5 text-accent" /> Shipment Progress History
                                        </h5>
                                        <div className="space-y-3">
                                          {generateTrackingLogs(order, getTrackingStepIndex(order.status)).map((log, lIdx) => (
                                            <div key={lIdx} className="flex items-start gap-3 text-[10px] leading-relaxed font-sans">
                                              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${lIdx === 0 ? 'bg-accent shadow-sm shadow-accent' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                                              <div className="flex-1 text-left">
                                                <div className="flex justify-between items-baseline gap-2">
                                                  <span className={`font-bold ${lIdx === 0 ? 'text-zinc-850 dark:text-zinc-200' : 'text-zinc-450 dark:text-zinc-500'}`}>{log.title}</span>
                                                  <span className="text-[8px] font-mono text-zinc-450 shrink-0">{log.time}</span>
                                                </div>
                                                <p className="text-zinc-550 dark:text-zinc-400 mt-0.5 font-medium">{log.desc}</p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-16 border border-dashed border-secondary/45 dark:border-zinc-800 flex flex-col items-center justify-center text-center space-y-4 rounded-sm">
                        <ShoppingBag className="w-12 h-12 text-zinc-350 dark:text-zinc-650 stroke-[1]" />
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Order Logs Empty</p>
                          <p className="text-[10px] text-zinc-400 font-medium">You have not logged any purchases inside this account context yet.</p>
                        </div>
                        <button
                          onClick={() => navigate('/man')}
                          className="px-5 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-sm cursor-pointer"
                        >
                          Explore Collections
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
