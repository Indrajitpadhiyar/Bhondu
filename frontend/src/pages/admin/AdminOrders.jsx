import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  X,
  Printer,
  Truck,
  CreditCard,
  User,
  MapPin,
  Calendar,
  IndianRupee,
  ShoppingBag
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  // Selected order details drawer state
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Search and tabs state
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Sync tab with URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');
    if (statusParam) {
      // capitalize first letter to match tab values
      const capitalStatus = statusParam.charAt(0).toUpperCase() + statusParam.slice(1);
      setActiveTab(capitalStatus);
    } else {
      setActiveTab('All');
    }
  }, [location.search]);

  const tabs = ['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'All') {
      navigate('/admin/orders');
    } else {
      navigate(`/admin/orders?status=${tab.toLowerCase()}`);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = activeTab === 'All' ? true : order.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30';
      case 'Cancelled':
      default:
        return 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200/50 dark:border-red-900/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-luxury-serif">Orders Fulfillment</h1>
        <p className="text-sm text-zinc-500">Track and dispatch customer orders.</p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-px">
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-6 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`pb-3.5 text-sm font-semibold transition-all relative ${
                activeTab === tab
                  ? 'text-zinc-950 dark:text-white'
                  : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A87C]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80 relative mb-3 md:mb-0">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Order ID, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-150 dark:border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-950/10">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Items Count</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-100">
                        {order.id}
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{order.customerName}</p>
                          <p className="text-[10px] text-zinc-400 font-normal">{order.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-zinc-500 dark:text-zinc-400">
                        {order.date}
                      </td>
                      <td className="py-4 px-4 font-mono font-medium">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-4 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                        ₹{order.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadgeStyles(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg text-[10px] font-bold text-zinc-700 dark:text-zinc-300"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-zinc-400 dark:text-zinc-500 bg-zinc-50/10">
                    No orders matching selection found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order details sliding drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#F8F7F4] dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 z-50 p-6 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h3 className="font-semibold text-lg font-luxury-serif text-zinc-950 dark:text-white">
                    Order Details: {selectedOrder.id}
                  </h3>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Placed on {selectedOrder.date}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Order Info & Status Update */}
              <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin">
                
                {/* Status Update Form */}
                <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Fulfillment status</p>
                    <p className="text-xs font-bold mt-0.5 text-zinc-900 dark:text-zinc-100">
                      Currently: <span className="text-[#C9A87C]">{selectedOrder.status}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {['Pending', 'Processing', 'Delivered', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, status);
                          // Sync local drawer view state
                          setSelectedOrder(prev => ({ ...prev, status }));
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          selectedOrder.status === status
                            ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900'
                            : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 hover:bg-zinc-50 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Details Summary */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Customer Info</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200/50 dark:border-zinc-800/70 text-xs space-y-1">
                      <p className="font-semibold text-zinc-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Billing</p>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-1">{selectedOrder.customerName}</p>
                      <p className="text-zinc-400 truncate">{selectedOrder.email}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200/50 dark:border-zinc-800/70 text-xs space-y-1">
                      <p className="font-semibold text-zinc-400 flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Payment</p>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-1">{selectedOrder.paymentMethod}</p>
                      <p className="text-zinc-400">Term: Cash/Prepaid</p>
                    </div>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200/50 dark:border-zinc-800/70 text-xs space-y-1">
                    <p className="font-semibold text-zinc-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Delivery Address</p>
                    <p className="text-zinc-800 dark:text-zinc-200 font-medium mt-1 leading-relaxed">{selectedOrder.address}</p>
                  </div>
                </div>

                {/* Items Summary list */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Items List</h4>
                  <div className="space-y-2.5">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-150 dark:border-zinc-850">
                        <div className="w-10 h-12 bg-zinc-100 dark:bg-zinc-900 rounded flex-shrink-0 flex items-center justify-center font-bold text-zinc-400">
                          <ShoppingBag className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="flex-grow min-w-0 text-xs">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{item.name}</p>
                          <p className="text-[10px] text-zinc-400">
                            Size: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{item.size}</span> | 
                            Color: <span className="inline-block w-2.5 h-2.5 rounded-full border align-middle ml-1" style={{ backgroundColor: item.color }} />
                          </p>
                        </div>
                        <div className="text-right text-xs">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">₹{item.price * item.quantity}</p>
                          <p className="text-[10px] text-zinc-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 text-xs space-y-2">
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal</span>
                    <span>₹{(selectedOrder.amount * 0.82).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>IGST (18% estimated)</span>
                    <span>₹{(selectedOrder.amount * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Courier Shipping</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-zinc-900 dark:text-white pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                    <span>Grand Total</span>
                    <span>₹{selectedOrder.amount.toFixed(2)}</span>
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                <button
                  onClick={() => alert(`Printing packing slip for order: ${selectedOrder.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Invoice
                </button>
                <button
                  onClick={() => alert(`Marking package dispatched for order: ${selectedOrder.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-850 dark:hover:bg-zinc-100"
                >
                  <Truck className="w-3.5 h-3.5" />
                  Ship Package
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
