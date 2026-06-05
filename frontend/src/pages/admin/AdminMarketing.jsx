import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag,
  Plus,
  Trash2,
  Mail,
  Send,
  Calendar,
  Sparkles,
  Search,
  CheckCircle,
  FileSpreadsheet,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminMarketing() {
  const { coupons, addCoupon, deleteCoupon, subscribers } = useAdmin();
  
  // Coupon Builder state
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState('Percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Email Campaign state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [campaignSent, setCampaignSent] = useState(false);

  // Search filter for subscribers
  const [subSearch, setSubSearch] = useState('');

  // Handle coupon submission
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!couponCode || !discountValue || !expiryDate) {
      alert("Please enter all required coupon details");
      return;
    }

    addCoupon({
      code: couponCode.toUpperCase().replace(/\s+/g, ''),
      type: discountType,
      value: Number(discountValue),
      expiry: expiryDate
    });

    // Reset Form
    setCouponCode('');
    setDiscountValue('');
    setExpiryDate('');
  };

  const handleSendCampaign = (e) => {
    e.preventDefault();
    if (!emailSubject || !emailBody) {
      alert("Please enter email subject and newsletter body content.");
      return;
    }
    
    // Simulate sending email to subscribers
    setCampaignSent(true);
    setTimeout(() => {
      setCampaignSent(false);
      setEmailSubject('');
      setEmailBody('');
      alert(`Newsletter campaign dispatched to all ${subscribers.filter(s => s.status === 'Subscribed').length} subscribers!`);
    }, 2000);
  };

  const filteredSubs = subscribers.filter(s => 
    s.email.toLowerCase().includes(subSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-luxury-serif">Marketing & Campaigns</h1>
        <p className="text-sm text-zinc-500">Formulate promotional campaigns, generate gift coupons, and dispatch newsletter digests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Coupon curation & active promo table (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Coupon Curation Box */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
            <h3 className="font-semibold text-sm font-luxury-serif flex items-center gap-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-[#C9A87C]" />
              Promotional Coupon Builder
            </h3>
            
            <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON30"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed Amount">Fixed (₹)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Value</label>
                <input
                  type="number"
                  required
                  placeholder={discountType === 'Percentage' ? '20' : '1500'}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-400"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-4 mt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg hover:bg-zinc-850 dark:hover:bg-zinc-100 font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Publish Promo Code
                </button>
              </div>
            </form>
          </div>

          {/* Active Promo Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-150 dark:border-zinc-800">
              <h3 className="font-semibold text-sm font-luxury-serif">Published Promo Coupons</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-150 dark:border-zinc-800 text-zinc-400 font-semibold uppercase bg-zinc-50/50 dark:bg-zinc-950/10">
                    <th className="py-3 px-4">Promo Code</th>
                    <th className="py-3 px-4">Discount Rate</th>
                    <th className="py-3 px-4">Expiry Date</th>
                    <th className="py-3 px-4">Used Count</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon, index) => (
                    <tr key={index} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="py-3 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">{coupon.code}</td>
                      <td className="py-3 px-4">
                        {coupon.type === 'Percentage' ? `${coupon.value}% Off` : `₹${coupon.value} Off`}
                      </td>
                      <td className="py-3 px-4 text-zinc-400">{coupon.expiry}</td>
                      <td className="py-3 px-4 font-mono">{coupon.usageCount} times</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                          coupon.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-855'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}>
                          {coupon.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteCoupon(coupon.code)}
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-400 hover:text-red-650 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right column: Subscribers & Newsletter Dispatch (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Email Campaign Builder */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
            <h3 className="font-semibold text-sm font-luxury-serif flex items-center gap-1.5 mb-4">
              <Mail className="w-4 h-4 text-[#C9A87C]" />
              Newsletter Dispatcher
            </h3>
            
            <form onSubmit={handleSendCampaign} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">Email Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introducing The AETHER PRO Esports Jersey Collection"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">Newsletter Body (HTML/Markdown supported)</label>
                <textarea
                  rows="5"
                  required
                  placeholder="Write the brand launch message here..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-950 dark:text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={campaignSent}
                className="w-full py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-850 dark:hover:bg-zinc-100 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {campaignSent ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Dispatching emails...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send Campaign Digest
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Subscribers Index */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm font-luxury-serif">Insider Subscribers</h3>
              <span className="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-950 rounded text-[9px] text-zinc-400 font-mono">
                {subscribers.filter(s => s.status === 'Subscribed').length} Insiders
              </span>
            </div>

            {/* Subscriber Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search email list..."
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:outline-none"
              />
            </div>

            {/* List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-none">
              {filteredSubs.map((sub, index) => (
                <div key={index} className="flex justify-between items-center text-xs p-2 bg-zinc-50 dark:bg-zinc-950 rounded">
                  <span className="truncate text-zinc-800 dark:text-zinc-300 font-semibold">{sub.email}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                    sub.status === 'Subscribed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
