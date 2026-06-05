import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Warehouse,
  AlertTriangle,
  FileCheck,
  TrendingDown,
  ChevronDown,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Box,
  Plus,
  Minus
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { useAdmin } from '../../context/AdminContext';

export default function AdminInventory() {
  const { products, updateProduct, alerts } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, Low, Out
  const [adjustingSku, setAdjustingSku] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  // Compute stats
  const totalSKUs = products.length;
  const lowStockSKUs = products.filter(p => (p.stock ?? 15) <= 5 && (p.stock ?? 15) > 0).length;
  const outOfStockSKUs = products.filter(p => (p.stock ?? 15) === 0).length;
  const totalStockVolume = products.reduce((sum, p) => sum + (p.stock ?? 15), 0);

  // Filter products list
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                          product.id.toLowerCase().includes(search.toLowerCase());
    
    const stock = product.stock ?? 15;
    if (filterType === 'Low') return matchesSearch && stock <= 5 && stock > 0;
    if (filterType === 'Out') return matchesSearch && stock === 0;
    return matchesSearch;
  });

  // Calculate stock by category for bar chart
  const categoryStockData = [
    { name: 'Tournament', stock: products.filter(p => p.category === 'Tournament Wear').reduce((sum, p) => sum + (p.stock ?? 15), 0), color: '#111111' },
    { name: 'T-Shirts', stock: products.filter(p => p.category === 'T-Shirts').reduce((sum, p) => sum + (p.stock ?? 15), 0), color: '#C9A87C' },
    { name: 'Shirts', stock: products.filter(p => p.category === 'Shirts').reduce((sum, p) => sum + (p.stock ?? 15), 0), color: '#8E8E8E' },
    { name: 'Shoes', stock: products.filter(p => p.category === 'Shoes').reduce((sum, p) => sum + (p.stock ?? 15), 0), color: '#E4E4E7' }
  ];

  const handleUpdateStock = (productId, type = 'add') => {
    const quantity = parseInt(adjustAmount, 10);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid positive number");
      return;
    }

    const currentProduct = products.find(p => p.id === productId);
    if (currentProduct) {
      const currentStock = currentProduct.stock ?? 15;
      const newStock = type === 'add' ? currentStock + quantity : Math.max(0, currentStock - quantity);
      
      updateProduct(productId, { stock: newStock });
      setAdjustingSku(null);
      setAdjustAmount('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-luxury-serif">Inventory & Warehousing</h1>
        <p className="text-sm text-zinc-500">Monitor live warehouse stock levels and allocate resources.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "Total Items Volume", value: totalStockVolume, icon: Box, details: "Units across all SKUs" },
          { title: "Active catalog SKUs", value: totalSKUs, icon: Warehouse, details: "Different product lines" },
          { title: "Low Stock Items", value: lowStockSKUs, icon: AlertTriangle, details: "5 units or less left", warning: lowStockSKUs > 0 },
          { title: "Out of Stock", value: outOfStockSKUs, icon: TrendingDown, details: "Requires restock immediate", error: outOfStockSKUs > 0 }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-xl border bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between ${
                stat.error
                  ? 'border-red-200 dark:border-red-900/30 ring-1 ring-red-100 dark:ring-red-950/20'
                  : stat.warning
                  ? 'border-amber-200 dark:border-amber-900/30 ring-1 ring-amber-100 dark:ring-amber-950/20'
                  : 'border-zinc-200/60 dark:border-zinc-800'
              }`}
            >
              <div className="text-left space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">{stat.title}</p>
                <p className="text-2xl font-bold font-luxury-serif text-zinc-950 dark:text-white">{stat.value}</p>
                <p className="text-[10px] text-zinc-400">{stat.details}</p>
              </div>
              <span className={`p-2 rounded-lg border ${
                stat.error 
                  ? 'bg-red-50 text-red-600 border-red-100' 
                  : stat.warning 
                  ? 'bg-amber-50 text-amber-600 border-amber-100' 
                  : 'bg-zinc-50 text-zinc-600 border-zinc-150 dark:bg-zinc-950/40 dark:border-zinc-800'
              }`}>
                <Icon className="w-4 h-4" />
              </span>
            </div>
          );
        })}
      </div>

      {/* Chart and Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category levels bar chart */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div>
            <h3 className="font-semibold text-sm font-luxury-serif">Warehouse Allocation by Category</h3>
            <p className="text-xs text-zinc-400">Total units distribution per department.</p>
          </div>
          <div className="h-56 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStockData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                  {categoryStockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Warning Panel */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-semibold text-sm font-luxury-serif">Low Stock Alerts</h3>
            <p className="text-xs text-zinc-400">Restock lists generated dynamically.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-48 scrollbar-none">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <div key={index} className="flex justify-between items-center text-xs p-2.5 rounded bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-150 dark:border-zinc-850">
                  <div className="text-left min-w-0">
                    <p className="font-bold truncate text-zinc-900 dark:text-zinc-100">{alert.name}</p>
                    <p className="text-[10px] text-zinc-400">Size: {alert.size} - Stock left: {alert.stock}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                    alert.stock === 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {alert.stock === 0 ? 'RESTOCK' : alert.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-zinc-400 text-center py-6">
                All SKUs are fully allocated.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Quick stock adjustment list */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm font-luxury-serif">All SKUs Stock Allocation</h3>
            <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] text-zinc-400">Adjustments enabled</span>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by SKU name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-xs pl-8 pr-4 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:outline-none"
              />
            </div>
            <div className="flex bg-zinc-100 dark:bg-zinc-850 p-0.5 rounded-lg text-xs font-semibold">
              {['All', 'Low', 'Out'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    filterType === t
                      ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-650'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-150 dark:border-zinc-800 text-zinc-400 font-semibold uppercase bg-zinc-50/50 dark:bg-zinc-950/10">
                <th className="py-3.5 px-6">SKU ID</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 font-mono">Stock Level</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-6 text-right">Fulfillment adjustment</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stock = product.stock ?? 15;
                const isAdjusting = adjustingSku === product.id;

                return (
                  <tr key={product.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <td className="py-3.5 px-6 font-semibold font-mono text-zinc-400">{product.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-900 dark:text-zinc-100">{product.name}</td>
                    <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400">{product.category}</td>
                    <td className="py-3.5 px-4 font-bold font-mono">{stock} units</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        stock === 0
                          ? 'bg-red-100 text-red-750'
                          : stock <= 5
                          ? 'bg-amber-100 text-amber-750'
                          : 'bg-emerald-100 text-emerald-750'
                      }`}>
                        {stock === 0 ? 'OUT OF STOCK' : stock <= 5 ? 'LOW LEVEL' : 'STOCK HEALTHY'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      {isAdjusting ? (
                        <div className="flex justify-end items-center gap-2">
                          <input
                            type="number"
                            placeholder="Qty"
                            value={adjustAmount}
                            onChange={(e) => setAdjustAmount(e.target.value)}
                            className="w-16 p-1 border border-zinc-200 dark:border-zinc-800 rounded text-center text-xs bg-white dark:bg-zinc-950 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateStock(product.id, 'add')}
                            className="p-1 rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold"
                            title="Add stock"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleUpdateStock(product.id, 'remove')}
                            className="p-1 rounded bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                            title="Subtract stock"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setAdjustingSku(null)}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAdjustingSku(product.id);
                            setAdjustAmount('');
                          }}
                          className="px-2.5 py-1 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded font-semibold text-[10px]"
                        >
                          Quick Adjust
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
