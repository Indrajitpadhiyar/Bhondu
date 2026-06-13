import React, { useState, useEffect, useCallback } from 'react';
import { useImageUpload } from '../../hooks/useImageUpload';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  Search,
  Filter,
  HardDrive,
  Sparkles,
  TrendingDown,
  Globe,
  RotateCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AdminMedia() {
  const [assets, setAssets] = useState([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalOriginalSize: 0,
    totalOptimizedSize: 0,
    avgCompression: 0,
    bandwidthSaved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  // Active copy states to show checkmarks
  const [copiedId, setCopiedId] = useState(null);

  // Hook config
  const { uploadFiles, isUploading, progressMap, errors: uploadErrors } = useImageUpload({
    folder: 'products',
    maxRetries: 3
  });

  // Fetch Assets
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/upload/assets', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          folder: folderFilter || undefined,
          search: search || undefined
        }
      });
      if (response.data?.status === 'success') {
        setAssets(response.data.data.assets);
        setTotalPages(response.data.pages || 1);
        setTotalItems(response.data.total || 0);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch media assets.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, folderFilter, search]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await axiosInstance.get('/upload/assets/stats');
      if (response.data?.status === 'success') {
        setStats(response.data.data.stats);
      }
    } catch (err) {
      console.error('Stats loading failed', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Initial and reactive loading
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, isUploading]);

  // Handle Drag & Drop events
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUploads(e.dataTransfer.files);
    }
  };

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processUploads(e.target.files);
    }
  };

  const processUploads = async (filesList) => {
    const res = await uploadFiles(filesList);
    if (res.urls && res.urls.length > 0) {
      toast.success(`Successfully uploaded and optimized ${res.urls.length} image(s)!`);
      setCurrentPage(1); // Go to first page
      fetchAssets();
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this asset from the database and Cloudinary?')) {
      return;
    }
    try {
      await axiosInstance.delete(`/upload/assets/${id}`);
      toast.success('Asset deleted successfully!');
      fetchAssets();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete asset.');
    }
  };

  // Helper: Format bytes to human readable string
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Copy to clipboard helper
  const handleCopyUrl = (url, type, id) => {
    navigator.clipboard.writeText(url);
    const key = `${id}-${type}`;
    setCopiedId(key);
    toast.success(`${type} URL copied!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-luxury-serif">Media Optimization Engine</h1>
        <p className="text-sm text-zinc-500">
          Upload and deliver media optimized with Cloudinary perceptual compression and responsive scaling.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Files Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-650 dark:text-zinc-350">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-405 dark:text-zinc-500">Total Optimized</p>
            {statsLoading ? (
              <RotateCw className="w-5 h-5 animate-spin mt-1 text-zinc-400" />
            ) : (
              <p className="text-xl font-bold font-mono mt-0.5">{stats.totalFiles} files</p>
            )}
          </div>
        </div>

        {/* Space Saved / Bandwidth Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-450 rounded-lg">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-405 dark:text-zinc-500">Storage Saved</p>
            {statsLoading ? (
              <RotateCw className="w-5 h-5 animate-spin mt-1 text-zinc-400" />
            ) : (
              <p className="text-xl font-bold font-mono mt-0.5 text-emerald-600 dark:text-emerald-400">
                {formatBytes(stats.bandwidthSaved)}
              </p>
            )}
          </div>
        </div>

        {/* Average Compression Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#C9A87C]/10 text-[#C9A87C] rounded-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-405 dark:text-zinc-500">Avg. Compression</p>
            {statsLoading ? (
              <RotateCw className="w-5 h-5 animate-spin mt-1 text-zinc-400" />
            ) : (
              <p className="text-xl font-bold font-mono mt-0.5 text-[#C9A87C]">
                {stats.avgCompression}%
              </p>
            )}
          </div>
        </div>

        {/* Bandwidth / CDN Performance Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-650 dark:text-blue-450 rounded-lg">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-405 dark:text-zinc-500">CDN Edge Cache</p>
            <p className="text-xl font-bold mt-0.5 font-mono text-blue-600 dark:text-blue-400">Active</p>
          </div>
        </div>

      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-450 dark:text-zinc-400 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#C9A87C]" /> Upload Sandbox
            </h3>
            
            <label
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-xl cursor-pointer p-4 text-center transition-all ${
                isDragActive
                  ? 'border-[#C9A87C] bg-[#C9A87C]/5'
                  : 'border-zinc-200 hover:border-[#C9A87C] dark:border-zinc-850 dark:hover:border-[#C9A87C] bg-zinc-50/50 dark:bg-zinc-950/20'
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-2 text-zinc-400">
                <Upload className="w-8 h-8 text-[#C9A87C] mb-1 animate-pulse" />
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-widest font-logo">
                  Drag & Drop Images
                </p>
                <p className="text-[10px] text-zinc-400">
                  PNG, JPG, JPEG, WEBP, AVIF (Max 10MB)
                </p>
                <span className="px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-md text-[10px] font-bold shadow-sm hover:scale-102 transition-transform mt-2">
                  Browse Files
                </span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Upload Progress mapping */}
          {Object.keys(progressMap).length > 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-xl shadow-sm space-y-3">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Queue</h4>
              <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                {Object.entries(progressMap).map(([filename, progress]) => (
                  <div key={filename} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium text-zinc-700 dark:text-zinc-300">
                      <span className="truncate max-w-[180px]">{filename}</span>
                      {progress === -1 ? (
                        <span className="text-red-500 font-bold">Failed</span>
                      ) : progress === 100 ? (
                        <span className="text-emerald-500 font-bold">Optimized</span>
                      ) : (
                        <span className="font-mono text-[10px] text-[#C9A87C]">{progress}%</span>
                      )}
                    </div>
                    
                    {/* Progress Track */}
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${progress === -1 ? 100 : progress}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          progress === -1
                            ? 'bg-red-500'
                            : progress === 100
                            ? 'bg-emerald-500'
                            : 'bg-[#C9A87C]'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Errors display */}
          {uploadErrors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 p-4 rounded-xl space-y-1.5">
              <h4 className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wider">Upload Errors</h4>
              <ul className="list-disc list-inside text-[10px] text-red-700 dark:text-red-500 space-y-1">
                {uploadErrors.map((err, idx) => (
                  <li key={idx} className="truncate">{err}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Optimized Assets Datatable */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
            
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search uploads..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 focus:outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2.5 w-full md:w-auto">
              <select
                value={folderFilter}
                onChange={(e) => { setFolderFilter(e.target.value); setCurrentPage(1); }}
                className="text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 focus:outline-none w-full md:w-40"
              >
                <option value="">All folders</option>
                <option value="products">Products</option>
                <option value="avatars">Avatars</option>
                <option value="reviews">Reviews</option>
              </select>
            </div>

          </div>

          {/* List display */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="py-24 flex flex-col justify-center items-center text-zinc-400 gap-2">
                <RotateCw className="w-8 h-8 animate-spin text-[#C9A87C]" />
                <span className="text-xs tracking-wider font-logo uppercase">Analyzing Cloudinary pipeline...</span>
              </div>
            ) : assets.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {assets.map((asset) => (
                  <div key={asset._id} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10 transition-colors">
                    
                    {/* Image Thumbnail Info */}
                    <div className="flex gap-3 items-center min-w-0">
                      <div className="w-14 h-18 rounded border border-zinc-150 dark:border-zinc-800 overflow-hidden bg-zinc-100 dark:bg-zinc-950 flex-shrink-0 relative group">
                        <img src={asset.thumbnailUrl || asset.optimizedUrl} alt={asset.originalName} className="w-full h-full object-cover" />
                        <a
                          href={asset.optimizedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-white" />
                        </a>
                      </div>
                      
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]" title={asset.originalName}>
                          {asset.originalName}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1.5 font-mono">
                          <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-850 rounded uppercase text-[8px] font-bold font-sans">
                            {asset.format}
                          </span>
                          <span>•</span>
                          <span>Folder: {asset.folder}</span>
                        </p>
                        <p className="text-[9px] text-zinc-400 mt-1 font-mono">
                          {new Date(asset.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Compression Comparison details */}
                    <div className="flex gap-6 sm:gap-10 font-mono text-[11px] text-zinc-500 border-t sm:border-t-0 border-zinc-100 pt-2 sm:pt-0 w-full sm:w-auto justify-between sm:justify-start">
                      
                      {/* Original */}
                      <div className="text-left">
                        <p className="text-[9px] text-zinc-400 uppercase font-sans font-bold">Original</p>
                        <p className="font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">{formatBytes(asset.originalSize)}</p>
                        <p className="text-[9px] text-zinc-400 mt-0.5">{asset.originalWidth}x{asset.originalHeight}</p>
                      </div>

                      {/* Optimized */}
                      <div className="text-left">
                        <p className="text-[9px] text-zinc-400 uppercase font-sans font-bold text-[#C9A87C]">Optimized</p>
                        <p className="font-semibold text-[#C9A87C] mt-0.5">{formatBytes(asset.optimizedSize)}</p>
                        <p className="text-[9px] text-zinc-400 mt-0.5">{asset.optimizedWidth}x{asset.optimizedHeight}</p>
                      </div>

                      {/* Gains % */}
                      <div className="text-left">
                        <p className="text-[9px] text-zinc-400 uppercase font-sans font-bold text-emerald-600 dark:text-emerald-400">Saved</p>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">-{asset.compressionRatio}%</p>
                      </div>

                    </div>

                    {/* Action buttons (Copy Links & Delete) */}
                    <div className="flex gap-2.5 items-center justify-end w-full sm:w-auto mt-2 sm:mt-0">
                      
                      {/* Copy selectors */}
                      <div className="flex border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/20 text-[10px] font-semibold text-zinc-500">
                        <button
                          onClick={() => handleCopyUrl(asset.optimizedUrl, 'Optimized', asset._id)}
                          className="px-2.5 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-850 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === `${asset._id}-Optimized` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>Optimized</span>
                        </button>
                        <button
                          onClick={() => handleCopyUrl(asset.thumbnailUrl || asset.optimizedUrl, 'Thumb', asset._id)}
                          className="px-2.5 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-850 flex items-center gap-1 cursor-pointer"
                          title="Copy 300px width responsive URL"
                        >
                          {copiedId === `${asset._id}-Thumb` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>Thumb</span>
                        </button>
                        <button
                          onClick={() => handleCopyUrl(asset.mediumUrl || asset.optimizedUrl, 'Medium', asset._id)}
                          className="px-2.5 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1 cursor-pointer"
                          title="Copy 600px width responsive URL"
                        >
                          {copiedId === `${asset._id}-Medium` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>Card</span>
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(asset._id)}
                        className="p-2 border border-zinc-200 hover:border-red-200 dark:border-zinc-800 dark:hover:border-red-900/40 text-zinc-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center text-zinc-400 text-xs">
                No optimized media assets found. Upload some above!
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10">
                <span className="text-[11px] text-zinc-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
