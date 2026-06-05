import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Mail,
  UserCheck,
  Calendar,
  Sparkles,
  Award,
  Clock,
  History,
  TrendingUp,
  LineChart as LineChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useAdmin } from '../../context/AdminContext';

export default function AdminCustomers() {
  const { customers } = useAdmin();
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || null);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Filtering
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesTier = tierFilter ? customer.tier === tierFilter : true;
    
    return matchesSearch && matchesTier;
  });

  // Customer growth data for charts
  const customerGrowthData = [
    { month: 'Jan', count: 120 },
    { month: 'Feb', count: 180 },
    { month: 'Mar', count: 240 },
    { month: 'Apr', count: 350 },
    { month: 'May', count: 480 },
    { month: 'Jun', count: 620 }
  ];

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900';
      case 'VIP':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border-amber-300';
      case 'Regular':
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-luxury-serif">Customer Directory</h1>
        <p className="text-sm text-zinc-500">Track subscriber portfolios, loyalty tiers, and purchase history.</p>
      </div>

      {/* Analytics row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LTV & Growth Stats */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-sm font-luxury-serif">Customer Base Expansion</h3>
              <p className="text-xs text-zinc-400">Total registered members on BHONDU.com</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>+28.5% YoY</span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerGrowthData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" className="dark:stroke-zinc-850" />
                <XAxis dataKey="month" stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#C9A87C" strokeWidth={2.5} dot={{ stroke: '#C9A87C', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tier Distribution summary */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm font-luxury-serif">VIP Distribution</h3>
            <p className="text-xs text-zinc-400">Insiders distribution by customer tier.</p>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-white" />
                <span>Platinum Insiders</span>
              </div>
              <span className="font-bold">48 members</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>VIP Loyalists</span>
              </div>
              <span className="font-bold">115 members</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                <span>Regular Customers</span>
              </div>
              <span className="font-bold">457 members</span>
            </div>
          </div>
          <div className="border-t border-zinc-150 dark:border-zinc-800 pt-3 mt-3 text-[11px] text-zinc-400">
            VIP members represent <strong>68%</strong> of total monthly revenue.
          </div>
        </div>
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Directory List (4 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:outline-none"
              />
            </div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="text-xs px-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:outline-none"
            >
              <option value="">All Tiers</option>
              <option value="Platinum">Platinum</option>
              <option value="VIP">VIP</option>
              <option value="Regular">Regular</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredCustomers.map((customer) => {
              const isSelected = customer.id === selectedCustomer.id;
              return (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-900 border-[#C9A87C] shadow-sm ring-1 ring-[#C9A87C]'
                      : 'bg-white/60 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/80 hover:bg-white dark:hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200/50"
                    />
                    <div className="text-left text-xs min-w-0">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{customer.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">₹{customer.totalSpent.toLocaleString('en-IN')}</p>
                    <span className={`px-2 py-0.5 rounded border text-[8px] font-bold mt-1 inline-block ${getTierBadgeColor(customer.tier)}`}>
                      {customer.tier}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Profiles & Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm p-6 space-y-6">
          {selectedCustomer ? (
            <>
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-6 border-b border-zinc-150 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#C9A87C]"
                  />
                  <div className="text-left">
                    <h3 className="font-bold text-lg font-luxury-serif text-zinc-950 dark:text-white">
                      {selectedCustomer.name}
                    </h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                      {selectedCustomer.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-start gap-2.5 sm:text-right">
                  <span className={`px-2.5 py-1 rounded border text-[10px] font-bold flex items-center gap-1.5 ${getTierBadgeColor(selectedCustomer.tier)}`}>
                    <Award className="w-3.5 h-3.5" />
                    {selectedCustomer.tier} Partner
                  </span>
                  <span className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Member since {selectedCustomer.signupDate}
                  </span>
                </div>
              </div>

              {/* Stat Highlights */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-150 dark:border-zinc-850 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Total Revenue</p>
                  <p className="text-lg font-bold font-luxury-serif text-[#C9A87C] mt-1">
                    ₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-150 dark:border-zinc-850 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Orders Count</p>
                  <p className="text-lg font-bold font-luxury-serif text-zinc-900 dark:text-white mt-1">
                    {selectedCustomer.orderCount} orders
                  </p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-150 dark:border-zinc-850 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">User Status</p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white mt-2 flex items-center justify-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Active
                  </p>
                </div>
              </div>

              {/* Customer Activity Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                  <History className="w-4 h-4 text-zinc-400" />
                  Interaction & Purchase Timeline
                </h4>
                
                <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-3 space-y-4">
                  {selectedCustomer.history.map((event, idx) => (
                    <div key={idx} className="relative pl-6">
                      {/* Timeline dot */}
                      <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-900 dark:bg-white ring-4 ring-white dark:ring-zinc-900" />
                      
                      <div className="text-xs">
                        <span className="text-[10px] text-zinc-400 font-semibold font-mono block">
                          {event.date}
                        </span>
                        <p className="text-zinc-700 dark:text-zinc-300 mt-0.5">
                          {event.event}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-400">
              Select a customer profile to view metrics.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
