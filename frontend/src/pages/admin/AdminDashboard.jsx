import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Shirt,
  AlertCircle,
  IndianRupee,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

// Empty analytics state fallback
const dashboardAnalytics = {
  monthlyRevenue: [],
  trafficSources: [],
  conversionFunnel: [],
  categoryPerformance: []
};

// Reusable Counter Animation Component
const AnimatedCounter = ({ value, prefix = "", duration = 1.2 }) => {
  const [count, setCount] = React.useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end) || end === 0) {
      setCount(value);
      return;
    }
    
    const totalMiliseconds = duration * 1000;
    const incrementTime = 30;
    const steps = totalMiliseconds / incrementTime;
    const increment = (end - start) / steps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value, duration]);

  const formatNumber = (num) => {
    if (typeof num !== 'number') return num;
    return num.toLocaleString('en-IN');
  };

  return <span>{prefix}{formatNumber(count)}</span>;
};

export default function AdminDashboard() {
  const { products, orders, customers } = useAdmin();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // GSAP Entrance Stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance of stats cards
      gsap.from('.stat-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out'
      });
      // Slide-up charts and recent tables
      gsap.from('.dashboard-section', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Compute stats dynamically from context state
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.amount, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  
  // Calculate today's sales (simulated from current date orders)
  const todayDate = "2026-06-05";
  const todaySales = orders
    .filter(o => o.date === todayDate && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.amount, 0);

  // Compute dynamic monthly revenue trend for past 6 months
  const getMonthlyRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        month: months[d.getMonth()],
        year: d.getFullYear(),
        monthNum: d.getMonth(),
        revenue: 0
      });
    }

    orders.forEach(order => {
      if (order.status === 'Cancelled') return;
      const orderDate = new Date(order.createdAt);
      if (isNaN(orderDate.getTime())) return;
      
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();
      
      const match = last6Months.find(m => m.monthNum === orderMonth && m.year === orderYear);
      if (match) {
        match.revenue += order.amount;
      }
    });

    return last6Months;
  };

  const monthlyRevenueData = getMonthlyRevenueData();

  // Simulated traffic channel acquisition metrics
  const trafficSourcesData = [
    { name: 'Direct Search', value: 45, color: '#C9A87C' },
    { name: 'Social Media', value: 30, color: '#111111' },
    { name: 'Referrals', value: 15, color: '#71717a' },
    { name: 'Email Campaign', value: 10, color: '#a1a1aa' }
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: totalRevenue,
      prefix: '₹',
      icon: IndianRupee,
      change: '+12.4% vs last month',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      prefix: '',
      icon: ShoppingBag,
      change: '+8.2% vs last week',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    {
      title: 'Total Customers',
      value: totalCustomers,
      prefix: '',
      icon: Users,
      change: '+15.1% since launch',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    {
      title: 'Total Products',
      value: totalProducts,
      prefix: '',
      icon: Shirt,
      change: 'Active in 12 categories',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      prefix: '',
      icon: AlertCircle,
      change: 'Requires confirmation',
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    },
    {
      title: "Today's Sales",
      value: todaySales,
      prefix: '₹',
      icon: TrendingUp,
      change: 'Calculated in real-time',
      color: 'bg-zinc-900/10 text-zinc-900 dark:bg-white/10 dark:text-white border-zinc-200'
    }
  ];

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-luxury-serif">
            Atelier Overview
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Here's what's happening with BHONDU store today.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/products?action=add')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-semibold shadow transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.01 }}
              className="stat-card p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500">
                  {stat.title}
                </span>
                <span className={`p-1.5 rounded-lg border ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold tracking-tight font-luxury-serif">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} />
                </h3>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block">
                  {stat.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Performance AreaChart */}
        <div className="dashboard-section lg:col-span-3 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-base font-luxury-serif">Revenue & Sales Trends</h3>
              <p className="text-xs text-zinc-400">Monthly overview of transactions generated.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold border border-zinc-200 dark:border-zinc-800 rounded-lg p-1">
              <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-900 dark:text-white">Monthly</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A87C" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C9A87C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" className="dark:stroke-zinc-800" />
                <XAxis dataKey="month" stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e4e4e7', borderRadius: '8px', color: '#111' }}
                  itemStyle={{ color: '#111' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C9A87C" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic / Channel Sources Pie Chart - Commented out as requested
        <div className="dashboard-section p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="mb-6">
            <h3 className="font-semibold text-base font-luxury-serif">Acquisition Channels</h3>
            <p className="text-xs text-zinc-400">Where visitor traffic originates from.</p>
          </div>
          <div className="h-64 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-bold font-luxury-serif">12.5k</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Total visits</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {trafficSourcesData.map((source, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                <span className="text-zinc-500 dark:text-zinc-400 truncate">{source.name}</span>
                <span className="font-semibold ml-auto">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
        */}

      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="dashboard-section lg:col-span-2 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-base font-luxury-serif">Recent Customer Orders</h3>
              <p className="text-xs text-zinc-400">Newly placed orders across the platform.</p>
            </div>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-xs text-[#C9A87C] font-semibold hover:underline flex items-center gap-1"
            >
              All Orders <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-zinc-50 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/35 transition-colors duration-150">
                    <td className="py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                      {order.id}
                    </td>
                    <td className="py-3.5">{order.customerName}</td>
                    <td className="py-3.5 text-zinc-400">{order.date}</td>
                    <td className="py-3.5 font-medium">₹{order.amount.toFixed(2)}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : order.status === 'Shipped'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/20 dark:text-indigo-400'
                            : order.status === 'Processing'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400'
                            : order.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="dashboard-section p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-base font-luxury-serif">Top Performers</h3>
              <p className="text-xs text-zinc-400">Products with highest transaction volumes.</p>
            </div>
            <button
              onClick={() => navigate('/admin/products')}
              className="text-xs text-[#C9A87C] font-semibold hover:underline"
            >
              All Items
            </button>
          </div>

          <div className="space-y-4">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center gap-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-10 h-12 rounded object-cover border border-zinc-100 dark:border-zinc-800"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate text-zinc-900 dark:text-zinc-100">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wide">
                    {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    ₹{product.salePrice || product.price}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    {product.reviewsCount || 24} sold
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
