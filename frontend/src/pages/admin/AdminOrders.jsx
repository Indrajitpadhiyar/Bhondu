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
  ShoppingBag,
  Check,
  Download,
  Barcode
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// CODE 39 BARCODE DICTIONARY
const CODE39_ALPHABET = {
  '0': 'n n n w w n w n n',
  '1': 'w n n w n n n n w',
  '2': 'n n w w n n n n w',
  '3': 'w n w w n n n n n',
  '4': 'n n n w w n n n w',
  '5': 'w n n w w n n n n',
  '6': 'n n w w w n n n n',
  '7': 'n n n w n n w n w',
  '8': 'w n n w n n w n n',
  '9': 'n n w w n n w n n',
  'A': 'w n n n n w n n w',
  'B': 'n n w n n w n n w',
  'C': 'w n w n n w n n n',
  'D': 'n n n n w w n n w',
  'E': 'w n n n w w n n n',
  'F': 'n n w n w w n n n',
  'G': 'n n n n n w w n w',
  'H': 'w n n n n w w n n',
  'I': 'n n w n n w w n n',
  'J': 'n n n n w w w n n',
  'K': 'w n n n n n n w w',
  'L': 'n n w n n n n w w',
  'M': 'w n w n n n n w n',
  'N': 'n n n n w n n w w',
  'O': 'w n n n w n n w n',
  'P': 'n n w n w n n w n',
  'Q': 'n n n n n n w w w',
  'R': 'w n n n n n w w n',
  'S': 'n n w n n n w w n',
  'T': 'n n n n w n w w n',
  'U': 'w w n n n n n n w',
  'V': 'n w w n n n n n w',
  'W': 'w w w n n n n n n',
  'X': 'n w n n w n n n w',
  'Y': 'w w n n w n n n n',
  'Z': 'n w w n w n n n n',
  '-': 'n w n n n n w n w',
  '.': 'w w n n n n w n n',
  ' ': 'n w w n n n w n n',
  '*': 'n w n n w n w n n',
  '$': 'n w n w n w n n n',
  '/': 'n w n w n n n w n',
  '+': 'n w n n n w n w n',
  '%': 'n n n w n w n w n'
};

function generateCode39(value) {
  const cleaned = String(value || '')
    .toUpperCase()
    .split('')
    .map(char => (CODE39_ALPHABET[char] ? char : ' '))
    .join('');
    
  const upperVal = `*${cleaned}*`;
  const bars = [];
  let currentX = 0;
  
  const NARROW_WIDTH = 1.5;
  const WIDE_WIDTH = 4.5;
  const GAP_WIDTH = 1.5;
  
  for (let i = 0; i < upperVal.length; i++) {
    const char = upperVal[i];
    const pattern = CODE39_ALPHABET[char];
    if (!pattern) continue;
    
    const elements = pattern.split(' ');
    for (let j = 0; j < elements.length; j++) {
      const type = elements[j];
      const width = type === 'w' ? WIDE_WIDTH : NARROW_WIDTH;
      const isBar = j % 2 === 0;
      
      if (isBar) {
        bars.push({ x: currentX, width });
      }
      currentX += width;
    }
    if (i < upperVal.length - 1) {
      currentX += GAP_WIDTH;
    }
  }
  
  return { bars, totalWidth: currentX };
}

const BarcodeComponent = ({ value, height = 45 }) => {
  const { bars, totalWidth } = generateCode39(value);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: '4px', borderRadius: '4px' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${totalWidth} ${height}`}
        preserveAspectRatio="none"
        style={{ height: `${height}px`, width: '100%' }}
      >
        {bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y={0}
            width={bar.width}
            height={height}
            fill="black"
          />
        ))}
      </svg>
      <span style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '0.2em', fontWeight: 'bold', color: '#1f2937', marginTop: '4px', textTransform: 'uppercase' }}>
        {value}
      </span>
    </div>
  );
};

const stickerStyles = {
  container: {
    width: '380px',
    backgroundColor: '#ffffff',
    color: '#000000',
    fontFamily: '"Outfit", "Helvetica Neue", Arial, sans-serif',
    border: '3px solid #000000',
    padding: '16px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  header: {
    borderBottom: '2px solid #000000',
    paddingBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '22px',
    fontWeight: '950',
    letterSpacing: '3px',
    margin: 0,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  subtitle: {
    fontSize: '9px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#374151',
    fontWeight: '700',
    margin: 0,
  },
  billingBannerCod: {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '10px',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: '14px',
    letterSpacing: '1.5px',
    borderRadius: '4px',
  },
  billingBannerPrepaid: {
    border: '3px solid #000000',
    color: '#000000',
    padding: '8px',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: '14px',
    letterSpacing: '1.5px',
    borderRadius: '4px',
  },
  sectionHeading: {
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: '1.5px solid #000000',
    paddingBottom: '4px',
    marginBottom: '6px',
    color: '#000000',
  },
  addressBox: {
    border: '1.5px solid #000000',
    padding: '10px',
    fontSize: '11px',
    lineHeight: '1.5',
    backgroundColor: '#fafafa',
  },
  itemTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '10px',
    marginTop: '4px',
  },
  tableHeaderCell: {
    borderBottom: '1.5px solid #000000',
    textAlign: 'left',
    fontWeight: '800',
    paddingBottom: '4px',
    textTransform: 'uppercase',
    fontSize: '9px',
  },
  tableCell: {
    padding: '6px 0',
    borderBottom: '1px solid #e5e7eb',
    verticalAlign: 'top',
  },
  returnBox: {
    fontSize: '9px',
    color: '#374151',
    lineHeight: '1.4',
    borderTop: '1px dashed #000000',
    paddingTop: '8px',
  }
};

const handleDownloadSticker = (order) => {
  const element = document.getElementById(`sticker-container-${order.id}`);
  if (!element) return;
  
  const width = 380;
  const height = element.offsetHeight || 580;
  
  const htmlContent = element.outerHTML;
  
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&amp;display=swap');
          * {
            font-family: 'Outfit', sans-serif !important;
          }
        </style>
      </defs>
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="background: white; width: ${width}px; height: ${height}px; padding: 0; margin: 0;">
          ${htmlContent}
        </div>
      </foreignObject>
    </svg>
  `;
  
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const URL = window.URL || window.webkitURL || window;
  const blobURL = URL.createObjectURL(svgBlob);
  
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0);
    
    try {
      const pngURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngURL;
      downloadLink.download = `bhondu_shipping_label_${order.id.substring(order.id.length - 8).toUpperCase()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      const downloadLink = document.createElement('a');
      downloadLink.href = blobURL;
      downloadLink.download = `bhondu_shipping_label_${order.id.substring(order.id.length - 8).toUpperCase()}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    URL.revokeObjectURL(blobURL);
  };
  image.src = blobURL;
};

const handlePrintSticker = (order) => {
  const element = document.getElementById(`sticker-container-${order.id}`);
  if (!element) return;
  
  const printWindow = window.open('', '_blank', 'width=600,height=800');
  printWindow.document.write(`
    <html>
      <head>
        <title>Shipping Label - ${order.id}</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: 'Outfit', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #ffffff;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div>
          ${element.outerHTML}
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

const handlePrintInvoice = (order) => {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">
        ${item.name}
        ${item.teamName ? `<div style="font-size: 10px; color: #4b5563; text-transform: uppercase;">Team: ${item.teamName}</div>` : ''}
        ${item.backsidePlayerName ? `<div style="font-size: 10px; color: #4b5563; text-transform: uppercase;">Player: ${item.backsidePlayerName} ${item.playerNumber ? `#${item.playerNumber}` : ''}</div>` : ''}
        ${!item.backsidePlayerName && item.playerNumber ? `<div style="font-size: 10px; color: #4b5563; text-transform: uppercase;">Number: #${item.playerNumber}</div>` : ''}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.size || '-'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; border: 1px solid #cccccc; background-color: ${item.color || 'transparent'}; vertical-align: middle;"></span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice - ${order.id}</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 40px;
            font-family: 'Outfit', sans-serif;
            color: #1f2937;
            background-color: #ffffff;
            font-size: 13px;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #e5e7eb;
            padding: 30px;
            border-radius: 8px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #1f2937;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .title {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #111111;
          }
          .details-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .section-title {
            font-weight: 700;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
            color: #6b7280;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 4px;
            margin-bottom: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            background-color: #f9fafb;
            padding: 10px;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 10px;
            color: #4b5563;
            border-bottom: 1px solid #d1d5db;
          }
          .totals {
            margin-left: auto;
            width: 300px;
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 8px;
            font-size: 12px;
            border-top: 1px dashed #d1d5db;
            padding-top: 12px;
          }
          @media print {
            body {
              margin: 0;
            }
            .invoice-container {
              border: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div>
              <div class="title">BHONDU</div>
              <div style="font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 1.5px;">Premium Luxury Wear</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 16px; font-weight: 700; color: #111111;">TAX INVOICE</div>
              <div style="color: #4b5563; margin-top: 4px;">Order ID: ${order.id}</div>
              <div style="color: #6b7280; font-size: 11px;">Date: ${order.date}</div>
            </div>
          </div>
          
          <div class="details-grid">
            <div>
              <div class="section-title">Billing & Shipping Details</div>
              <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${order.customerName}</div>
              <div style="color: #4b5563; line-height: 1.5;">
                ${order.shippingAddress ? `
                  ${order.shippingAddress.street || ''}<br/>
                  ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} - ${order.shippingAddress.postalCode || ''}<br/>
                  ${order.shippingAddress.country || ''}
                ` : order.address}
              </div>
              <div style="margin-top: 8px; font-weight: 600;">Phone: ${order.shippingAddress?.phone || 'N/A'}</div>
              <div style="color: #6b7280; font-size: 11px;">Email: ${order.email}</div>
            </div>
            <div style="text-align: right;">
              <div class="section-title" style="text-align: right;">Payment Operations</div>
              <div style="font-size: 13px; font-weight: 700; margin-bottom: 4px;">Method: ${order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Prepaid (Online)'}</div>
              <div>Status: <span style="font-weight: 700; color: ${order.paymentStatus === 'Paid' ? '#10b981' : '#f59e0b'}">${order.paymentStatus}</span></div>
              <div style="margin-top: 15px;">
                <div style="font-size: 10px; color: #6b7280; text-transform: uppercase;">Sold By</div>
                <div style="font-weight: 700;">BHONDU Store</div>
                <div style="font-size: 11px; color: #6b7280;">GSTIN: 07AAAAA1111A1Z1</div>
              </div>
            </div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 10px; border-bottom: 1px solid #d1d5db;">Item & Description</th>
                <th style="padding: 10px; border-bottom: 1px solid #d1d5db;">Size</th>
                <th style="padding: 10px; border-bottom: 1px solid #d1d5db;">Color</th>
                <th style="padding: 10px; border-bottom: 1px solid #d1d5db;">Qty</th>
                <th style="text-align: right; padding: 10px; border-bottom: 1px solid #d1d5db;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="totals">
            <div style="color: #6b7280;">Subtotal:</div>
            <div style="text-align: right; font-weight: 600;">₹${(order.amount * 0.82).toFixed(2)}</div>
            
            <div style="color: #6b7280;">GST (18%):</div>
            <div style="text-align: right; font-weight: 600;">₹${(order.amount * 0.18).toFixed(2)}</div>
            
            <div style="color: #6b7280;">Shipping:</div>
            <div style="text-align: right; font-weight: 700; color: #10b981;">FREE</div>
            
            <div style="color: #111111; font-weight: 700; font-size: 14px; border-top: 1px solid #111111; padding-top: 8px;">Total:</div>
            <div style="text-align: right; font-weight: 800; font-size: 15px; border-top: 1px solid #111111; padding-top: 8px; color: #111111;">₹${order.amount.toFixed(2)}</div>
          </div>
          
          <div style="margin-top: 60px; border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center; color: #9ca3af; font-size: 11px;">
            This is a computer-generated invoice. No signature required.
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  // Selected order details drawer state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Shipping sticker modal state
  const [stickerOrder, setStickerOrder] = useState(null);

  useEffect(() => {
    if (selectedOrder) {
      setSelectedStatus(selectedOrder.status);
    } else {
      setSelectedStatus('');
    }
  }, [selectedOrder]);

  const getAllowedStatuses = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending':
        return ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
      case 'Processing':
        return ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
      case 'Shipped':
        return ['Shipped', 'Delivered', 'Cancelled'];
      case 'Delivered':
      case 'Cancelled':
      default:
        return [];
    }
  };
  
  // Search and tabs state
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

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

  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

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

    const matchesPayment = paymentFilter === 'All' ? true : order.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20';
      case 'Cancelled':
      default:
        return 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-500/20';
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

      {/* Payment Method Filter Toggle */}
      <div className="flex items-center gap-2 text-xs py-1">
        <span className="text-zinc-400 font-medium mr-2">Payment Method:</span>
        {[
          { label: 'All Payments', value: 'All' },
          { label: 'Already Paid (Prepaid)', value: 'Online' },
          { label: 'Cash on Delivery (COD)', value: 'COD' }
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setPaymentFilter(item.value)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all border ${
              paymentFilter === item.value
                ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900 shadow-sm'
                : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            {item.label}
          </button>
        ))}
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
                      <td className="py-4 px-4">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100">
                          ₹{order.amount.toFixed(2)}
                        </div>
                        <div className="mt-1 flex flex-col gap-1 items-start">
                          {order.paymentMethod === 'COD' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30 uppercase tracking-wider">
                              COD
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 uppercase tracking-wider">
                              Already Paid
                            </span>
                          )}
                        </div>
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
                <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Fulfillment status</p>
                      <p className="text-xs font-bold mt-0.5 text-zinc-900 dark:text-zinc-100">
                        Currently:{' '}
                        <span className={`font-extrabold ${
                          selectedOrder.status === 'Delivered' ? 'text-emerald-600 dark:text-emerald-400' :
                          selectedOrder.status === 'Shipped' ? 'text-indigo-600 dark:text-indigo-400' :
                          selectedOrder.status === 'Processing' ? 'text-blue-600 dark:text-blue-400' :
                          selectedOrder.status === 'Pending' ? 'text-amber-600 dark:text-amber-400' :
                          'text-red-650 dark:text-red-400'
                        }`}>
                          {selectedOrder.status}
                        </span>
                      </p>
                    </div>
                    {getAllowedStatuses(selectedOrder.status).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {getAllowedStatuses(selectedOrder.status).map((status) => (
                          <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                              selectedStatus === status
                                ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900 shadow-sm'
                                : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 hover:bg-zinc-50 text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] px-2.5 py-1 rounded-md bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 font-semibold">
                        Fulfillment Completed
                      </span>
                    )}
                  </div>
                  {selectedStatus !== selectedOrder.status && (
                    <div className="flex justify-end pt-2 border-t border-dashed border-zinc-100 dark:border-zinc-800/50">
                      <button
                        onClick={async () => {
                          try {
                            await updateOrderStatus(selectedOrder.id, selectedStatus);
                            setSelectedOrder(prev => ({ ...prev, status: selectedStatus }));
                          } catch (err) {
                            // Handled by context toast
                          }
                        }}
                        className="px-4 py-1.5 bg-[#C9A87C] text-white hover:bg-[#b59469] rounded-lg text-[10px] font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Save Status
                      </button>
                    </div>
                  )}
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
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                        {selectedOrder.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Already Paid (Online)'}
                      </p>
                      <p className="text-zinc-400">
                        Status: <span className={selectedOrder.paymentStatus === 'Paid' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600 dark:text-amber-400 font-semibold'}>
                          {selectedOrder.paymentStatus || 'Pending'}
                        </span>
                      </p>
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
                        <div className="w-10 h-12 bg-zinc-100 dark:bg-zinc-900 rounded flex-shrink-0 flex items-center justify-center font-bold overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <ShoppingBag className="w-4 h-4 text-zinc-400" />
                          )}
                        </div>
                        <div className="flex-grow min-w-0 text-xs">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{item.name}</p>
                          <p className="text-[10px] text-zinc-400">
                            Size: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{item.size}</span> | 
                            Color: <span className="inline-block w-2.5 h-2.5 rounded-full border align-middle ml-1" style={{ backgroundColor: item.color }} />
                          </p>
                          {(item.teamName || item.backsidePlayerName || item.playerNumber || item.chestLogo) && (
                            <div className="mt-1.5 p-1.5 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50/50 dark:bg-zinc-900/10 text-[9px] uppercase tracking-wider text-zinc-500 space-y-0.5 leading-normal">
                              {item.teamName && <div>Team: <span className="font-bold text-zinc-800 dark:text-zinc-200">{item.teamName}</span></div>}
                              {item.backsidePlayerName && <div>Player: <span className="font-bold text-zinc-800 dark:text-zinc-200">{item.backsidePlayerName} {item.playerNumber ? `#${item.playerNumber}` : ''}</span></div>}
                              {!item.backsidePlayerName && item.playerNumber && <div>Number: <span className="font-bold text-zinc-800 dark:text-zinc-200">#{item.playerNumber}</span></div>}
                              {item.chestLogo && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span>Logo:</span>
                                  <a href={item.chestLogo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-bold">
                                    View Logo
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                          {item.designId && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'}/designs/${item.designId}/export`, { withCredentials: true });
                                  const url = res.data.data.url;
                                  window.open(url, '_blank');
                                } catch (err) {
                                  toast.error('Failed to get download link for custom design.');
                                }
                              }}
                              className="mt-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                            >
                              <Download className="w-3 h-3" /> Download Print Layout
                            </button>
                          )}
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
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handlePrintInvoice(selectedOrder)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Invoice
                </button>
                <button
                  onClick={() => setStickerOrder(selectedOrder)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-[#C9A87C]/30 bg-[#C9A87C]/5 hover:bg-[#C9A87C]/10 dark:border-[#C9A87C]/20 dark:bg-[#C9A87C]/5 rounded-lg text-xs font-semibold text-[#C9A87C]"
                >
                  <Barcode className="w-3.5 h-3.5" />
                  Generate Sticker
                </button>
                {selectedStatus !== selectedOrder.status ? (
                  <button
                    onClick={async () => {
                      try {
                        await updateOrderStatus(selectedOrder.id, selectedStatus);
                        setSelectedOrder(prev => ({ ...prev, status: selectedStatus }));
                      } catch (err) {
                        // Handled by updateOrderStatus toast in context
                      }
                    }}
                    className="flex-grow flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#C9A87C] text-white rounded-lg text-xs font-semibold hover:bg-[#b59469] transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save Status to {selectedStatus}
                  </button>
                ) : selectedOrder.status === 'Delivered' ? (
                  <button
                    disabled
                    className="flex-grow flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 rounded-lg text-xs font-semibold cursor-not-allowed"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Delivered
                  </button>
                ) : selectedOrder.status === 'Cancelled' ? (
                  <button
                    disabled
                    className="flex-grow flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 rounded-lg text-xs font-semibold cursor-not-allowed"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancelled
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      const nextStatus = (selectedOrder.status === 'Pending' || selectedOrder.status === 'Processing') 
                        ? 'Shipped' 
                        : 'Delivered';
                      try {
                        await updateOrderStatus(selectedOrder.id, nextStatus);
                        setSelectedOrder(prev => ({ ...prev, status: nextStatus }));
                      } catch (err) {
                        // Handled by updateOrderStatus toast in context
                      }
                    }}
                    className="flex-grow flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-850 dark:hover:bg-zinc-100"
                  >
                    {selectedOrder.status === 'Shipped' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Deliver Package
                      </>
                    ) : (
                      <>
                        <Truck className="w-3.5 h-3.5" />
                        Ship Package
                      </>
                    )}
                  </button>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Shipping Sticker Modal */}
      <AnimatePresence>
        {stickerOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setStickerOrder(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-[90vh] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl z-[61] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-5 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div>
                  <h3 className="font-bold text-lg text-zinc-950 dark:text-white flex items-center gap-2">
                    <Barcode className="w-5 h-5 text-[#C9A87C]" />
                    Shipping Sticker Preview
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Preview, print, or download order shipping label.</p>
                </div>
                <button
                  onClick={() => setStickerOrder(null)}
                  className="p-1 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Preview Area */}
              <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-zinc-200/50 dark:bg-zinc-950/20">
                {/* The Actual Sticker DOM element */}
                <div
                  id={`sticker-container-${stickerOrder.id}`}
                  style={stickerStyles.container}
                >
                  {/* Sticker Header */}
                  <div style={stickerStyles.header}>
                    <div>
                      <h2 style={stickerStyles.title}>BHONDU</h2>
                      <p style={stickerStyles.subtitle}>Premium Esports &amp; Fashion</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '9px', fontWeight: 'bold' }}>
                      <div>DATE: {stickerOrder.date}</div>
                      <div>LABEL ID: BH-${stickerOrder.id.substring(stickerOrder.id.length - 6).toUpperCase()}</div>
                    </div>
                  </div>

                  {/* Billing Banner */}
                  {stickerOrder.paymentMethod === 'COD' ? (
                    <div style={stickerStyles.billingBannerCod}>
                      CASH ON DELIVERY (COD) - COLLECT ₹{stickerOrder.amount.toFixed(2)}
                    </div>
                  ) : (
                    <div style={stickerStyles.billingBannerPrepaid}>
                      PREPAID (ONLINE) - ₹0.00 TO COLLECT
                    </div>
                  )}

                  {/* Address Section */}
                  <div>
                    <div style={stickerStyles.sectionHeading}>SHIP TO:</div>
                    <div style={stickerStyles.addressBox}>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '2px' }}>
                        {stickerOrder.customerName}
                      </div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        Tel: {stickerOrder.shippingAddress?.phone || 'N/A'}
                      </div>
                      <div>
                        {stickerOrder.shippingAddress ? (
                          <>
                            {stickerOrder.shippingAddress.street},<br />
                            {stickerOrder.shippingAddress.city}, {stickerOrder.shippingAddress.state} - <strong>{stickerOrder.shippingAddress.postalCode}</strong>,<br />
                            {stickerOrder.shippingAddress.country}
                          </>
                        ) : (
                          stickerOrder.address
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Barcode Section */}
                  <div style={{ padding: '4px 0', borderBottom: '1.5px solid #000000', borderTop: '1.5px solid #000000' }}>
                    <BarcodeComponent value={stickerOrder.id} />
                  </div>

                  {/* Product items table */}
                  <div>
                    <div style={stickerStyles.sectionHeading}>PACKAGE CONTENT DETAILS:</div>
                    <table style={stickerStyles.itemTable}>
                      <thead>
                        <tr>
                          <th style={stickerStyles.tableHeaderCell}>Item Description</th>
                          <th style={stickerStyles.tableHeaderCell}>Size/Color</th>
                          <th style={{ ...stickerStyles.tableHeaderCell, textAlign: 'right' }}>Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stickerOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td style={stickerStyles.tableCell}>
                              <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                              {item.teamName && <div style={{ fontSize: '8px', color: '#374151' }}>TEAM: {item.teamName}</div>}
                              {item.backsidePlayerName && <div style={{ fontSize: '8px', color: '#374151' }}>PLAYER: {item.backsidePlayerName} #{item.playerNumber}</div>}
                              {!item.backsidePlayerName && item.playerNumber && <div style={{ fontSize: '8px', color: '#374151' }}>NUMBER: #{item.playerNumber}</div>}
                            </td>
                            <td style={stickerStyles.tableCell}>
                              <div>SIZE: {item.size || 'N/A'}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                COLOR: <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', border: '0.5px solid #000000', backgroundColor: item.color }} />
                              </div>
                            </td>
                            <td style={{ ...stickerStyles.tableCell, textAlign: 'right', fontWeight: 'bold' }}>
                              {item.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Return Address & Instructions */}
                  <div style={stickerStyles.returnBox}>
                    <div style={{ fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>Return Address (Sender):</div>
                    <div>BHONDU Logistics &amp; Fulfillment Center, Block A, Okhla Industrial Area Phase II, New Delhi - 110020, Delhi, India</div>
                    <div style={{ fontWeight: 'bold', marginTop: '4px' }}>If undelivered, please return to sender.</div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex gap-3">
                <button
                  onClick={() => setStickerOrder(null)}
                  className="px-4 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownloadSticker(stickerOrder)}
                  className="flex-1 px-4 py-2 border border-[#C9A87C]/30 bg-[#C9A87C]/5 hover:bg-[#C9A87C]/15 text-[#C9A87C] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download PNG
                </button>
                <button
                  onClick={() => handlePrintSticker(stickerOrder)}
                  className="flex-1 px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 rounded-xl text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Print Sticker
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
