import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Plus,
  Sparkles,
  Save,
  Image as ImageIcon,
  Check,
  Star
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminCMS() {
  const { cms, updateCMS } = useAdmin();
  
  // Section layout ordering (reordering homepage segments)
  const [sectionsOrder, setSectionsOrder] = useState([
    { id: 'sec-1', name: 'Hero Sliders', icon: ImageIcon, active: true },
    { id: 'sec-2', name: 'Trending Lookbook Grid', icon: Layers, active: true },
    { id: 'sec-3', name: 'Testimonials Slider', icon: Star, active: true }
  ]);

  const [editingHeroId, setEditingHeroId] = useState(null);
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '', image: '' });

  // Move section layout up
  const moveSection = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= sectionsOrder.length) return;
    
    const updated = [...sectionsOrder];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    
    setSectionsOrder(updated);
  };

  const toggleSectionActive = (id) => {
    setSectionsOrder(prev =>
      prev.map(sec => sec.id === id ? { ...sec, active: !sec.active } : sec)
    );
  };

  const handleEditHeroClick = (banner) => {
    setEditingHeroId(banner.id);
    setHeroForm({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image
    });
  };

  const handleSaveHero = (bannerIndex) => {
    updateCMS('heroBanners', bannerIndex, heroForm);
    setEditingHeroId(null);
  };

  const toggleHeroActive = (bannerIndex, currentStatus) => {
    // If making this active, deactivate others to simulate slider highlight
    cms.heroBanners.forEach((b, idx) => {
      updateCMS('heroBanners', idx, { active: idx === bannerIndex ? !currentStatus : false });
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-luxury-serif">Homepage Builder (CMS)</h1>
        <p className="text-sm text-zinc-500">Edit storefront sections, configure hero slide decks, and toggle looking grids.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Section ordering & builder list (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
            <h3 className="font-semibold text-sm font-luxury-serif mb-3">Homepage Sections Order</h3>
            <p className="text-xs text-zinc-400 mb-4">Reorganize visual blocks. Changes replicate instantly on storefront.</p>
            
            <div className="space-y-2.5">
              {sectionsOrder.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.id}
                    layout
                    className={`p-3 rounded-lg border flex items-center justify-between text-xs transition-all ${
                      section.active
                        ? 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800'
                        : 'bg-zinc-100/40 text-zinc-400 border-zinc-200 dark:border-zinc-850 dark:bg-zinc-950/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-zinc-400" />
                      <span className="font-semibold">{section.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleSectionActive(section.id)}
                        className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        title={section.active ? "Hide Section" : "Show Section"}
                      >
                        {section.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        disabled={index === 0}
                        onClick={() => moveSection(index, -1)}
                        className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={index === sectionsOrder.length - 1}
                        onClick={() => moveSection(index, 1)}
                        className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Edit section details tabs (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hero sliders editor */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-150 dark:border-zinc-800">
              <h3 className="font-semibold text-sm font-luxury-serif">Hero Banner Slides Manager</h3>
              <button
                onClick={() => alert("Creating blank hero slide...")}
                className="px-2.5 py-1.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded text-[10px] font-bold"
              >
                Add Slide
              </button>
            </div>

            <div className="space-y-4">
              {cms.heroBanners.map((banner, index) => {
                const isEditing = editingHeroId === banner.id;
                
                return (
                  <div key={banner.id} className="p-4 bg-zinc-50 dark:bg-zinc-950/30 rounded-xl border border-zinc-150 dark:border-zinc-850 flex flex-col md:flex-row gap-4">
                    {/* Visual image preview */}
                    <div className="w-full md:w-32 h-20 rounded overflow-hidden border border-zinc-200 bg-zinc-100 flex-shrink-0">
                      <img src={isEditing ? heroForm.image : banner.image} alt={banner.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Edit Form / Text details */}
                    <div className="flex-grow min-w-0 text-xs text-left space-y-3">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={heroForm.title}
                            onChange={(e) => setHeroForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full p-2 border rounded border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-bold"
                            placeholder="Title Header"
                          />
                          <input
                            type="text"
                            value={heroForm.subtitle}
                            onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))}
                            className="w-full p-2 border rounded border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                            placeholder="Subtitle / Slogan"
                          />
                          <input
                            type="text"
                            value={heroForm.image}
                            onChange={(e) => setHeroForm(prev => ({ ...prev, image: e.target.value }))}
                            className="w-full p-2 border rounded border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                            placeholder="Image URL"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-zinc-950 dark:text-white truncate">{banner.title}</h4>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                              banner.active ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-400'
                            }`}>
                              {banner.active ? 'ACTIVE' : 'DRAFT'}
                            </span>
                          </div>
                          <p className="text-zinc-500 truncate">{banner.subtitle}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveHero(index)}
                            className="px-3 py-1.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold rounded flex items-center gap-1 text-[10px]"
                          >
                            <Save className="w-3 h-3" /> Save Changes
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditHeroClick(banner)}
                            className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded flex items-center gap-1 hover:bg-white text-[10px]"
                          >
                            <Edit2 className="w-3 h-3" /> Edit Slide
                          </button>
                        )}
                        <button
                          onClick={() => toggleHeroActive(index, banner.active)}
                          className={`px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded font-semibold text-[10px] ${
                            banner.active ? 'text-red-500 hover:bg-red-50/10' : 'text-emerald-600 hover:bg-emerald-50/10'
                          }`}
                        >
                          {banner.active ? 'Deactivate' : 'Publish Slide'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lookbook Gallery grid editor */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-150 dark:border-zinc-800">
              <h3 className="font-semibold text-sm font-luxury-serif">Lookbook Gallery Portfolios</h3>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wide">Masonry layout configurations</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cms.lookbook.map((lb, index) => (
                <div key={lb.id} className="border border-zinc-150 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950/20 text-xs">
                  <div className="h-32 bg-zinc-100 overflow-hidden relative">
                    <img src={lb.image} alt={lb.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white rounded text-[9px]">
                      Grid Width: {lb.columns} col
                    </span>
                  </div>
                  <div className="p-3 text-left space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-zinc-900 dark:text-white truncate">{lb.title}</p>
                      <button className="text-[#C9A87C] hover:underline text-[10px] font-bold">Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
