import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Funnel,
  FunnelChart
} from 'recharts';
import {
  Calendar,
  TrendingUp,
  Download,
  Percent,
  IndianRupee,
  ShoppingBag,
  Users,
  Eye,
  Globe2,
  RefreshCw
} from 'lucide-react';
// Empty analytics state fallback
const dashboardAnalytics = {
  monthlyRevenue: [],
  trafficSources: [],
  conversionFunnel: [],
  categoryPerformance: []
};

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('6m');

  const COLORS = ['#111111', '#C9A87C', '#8E8E8E', '#D4AF37', '#E4E4E7'];

  // Analytical stats totals
  const totalRevenue = 92200;
  const avgOrderVal = 4980;
  const convRate = 2.56;
  const visitorCount = 12500;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-luxury-serif">Analytics & Intelligence</h1>
          <p className="text-sm text-zinc-500">Formulate data-driven assessments of BHONDU brand metrics.</p>
        </div>
        <div className="flex gap-2">
          {/* Time range switcher */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:outline-none font-semibold text-zinc-700 dark:text-zinc-300"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>

          <button
            onClick={() => alert("Downloading PDF report metrics...")}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold rounded-lg text-zinc-700 dark:text-zinc-300"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "Gross Revenue Sales", value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, change: "+14.2% MoM", isUp: true },
          { title: "Average Ticket Value", value: `₹${avgOrderVal.toLocaleString('en-IN')}`, icon: ShoppingBag, change: "+3.8% MoM", isUp: true },
          { title: "Conversion Ratio", value: `${convRate}%`, icon: Percent, change: "-0.15% vs last week", isUp: false },
          { title: "Store Web Visitors", value: visitorCount.toLocaleString('en-IN'), icon: Globe2, change: "+24.8% MoM", isUp: true }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-xl shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">{stat.title}</p>
                <p className="text-xl font-bold font-luxury-serif text-zinc-900 dark:text-white">{stat.value}</p>
                <span className={`text-[10px] font-bold ${stat.isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
              <span className="p-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-150 dark:border-zinc-800 text-zinc-500 rounded-lg">
                <Icon className="w-4 h-4" />
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Double Line chart: Revenue vs Sales */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-sm font-luxury-serif">Revenue & Sales Performance</h3>
            <p className="text-xs text-zinc-400">Comparing total money made with number of orders.</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardAnalytics.monthlyRevenue} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A87C" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C9A87C" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111111" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" className="dark:stroke-zinc-850" vertical={false} />
                <XAxis dataKey="month" stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#C9A87C" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="revenue" fill="url(#revenueGrad)" stroke="#C9A87C" strokeWidth={2} name="Revenue (₹)" />
                <Area yAxisId="right" type="monotone" dataKey="sales" fill="url(#salesGrad)" stroke="#111111" strokeWidth={1.5} name="Orders Count" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel chart: Conversion Funnel Analysis */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-sm font-luxury-serif">eCommerce Conversion Funnel</h3>
            <p className="text-xs text-zinc-400">Track drop-off percentage from session to purchase.</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {/* Displaying horizontal funnel bars */}
            <div className="w-full space-y-3.5 text-xs">
              {dashboardAnalytics.conversionFunnel.map((funnel, index) => {
                const baseCount = dashboardAnalytics.conversionFunnel[0]?.count || 1;
                const percentage = Math.round((funnel.count / baseCount) * 100);
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>{funnel.stage}</span>
                      <span className="text-zinc-400 font-mono">{funnel.count.toLocaleString()} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-950 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          index === 0 ? 'bg-zinc-900 dark:bg-white' :
                          index === 4 ? 'bg-[#C9A87C]' : 'bg-zinc-400 dark:bg-zinc-700'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Traffic channel & Category split pie charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Share Distribution */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="mb-6">
            <h3 className="font-semibold text-sm font-luxury-serif">Revenue Split by Collection</h3>
            <p className="text-xs text-zinc-400">Allocation ratio across brand collections.</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardAnalytics.categoryPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="sales"
                >
                  {dashboardAnalytics.categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-bold font-luxury-serif">₹1.11L</span>
              <span className="text-[9px] text-zinc-400 uppercase tracking-wider">Gross Sales</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 text-xs mt-2 flex-wrap">
            {dashboardAnalytics.categoryPerformance.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-zinc-500 truncate">{entry.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic acquisition channels */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="mb-6">
            <h3 className="font-semibold text-sm font-luxury-serif">Acquisition Breakdown</h3>
            <p className="text-xs text-zinc-400">Total conversion sources split details.</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardAnalytics.trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  dataKey="value"
                >
                  {dashboardAnalytics.trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs mt-2 flex-wrap">
            {dashboardAnalytics.trafficSources.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-zinc-500 truncate">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
