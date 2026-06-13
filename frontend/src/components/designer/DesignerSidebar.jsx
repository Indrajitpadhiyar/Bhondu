import React, { useState } from 'react';
import { useDesigner } from '../../context/DesignerContext';
import { fabric } from 'fabric';
import axios from 'axios';
import { 
  Upload, 
  Sparkles, 
  Palette, 
  Type, 
  Compass, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Layers, 
  Wand2, 
  Eraser, 
  Maximize2, 
  Image as ImageIcon,
  Check,
  RefreshCw,
  Layout,
  Briefcase
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const DesignerSidebar = () => {
  const {
    canvas,
    activeView,
    switchView,
    template,
    product,
    baseColor,
    setBaseColor,
    selectedSize,
    setSelectedSize,
    fonts,
    cliparts,
    clipartCategories,
    loadGoogleFont,
    activeObject,
    calculatePrice,
  } = useDesigner();

  // Left sidebar tabs matching Printful: upload, ai, personalize, text, graphics, library
  const [activeTab, setActiveTab] = useState('upload'); 
  const [textInput, setTextInput] = useState('Hello World');
  const [selectedFont, setSelectedFont] = useState('Outfit');
  const [textColor, setTextColor] = useState('#111111');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([
    'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop', // default sample logo 1
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop', // default sample logo 2
  ]);
  const [selectedClipartCategory, setSelectedClipartCategory] = useState('');

  // AI states
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStyle, setAiStyle] = useState('vector');
  const [aiProgress, setAiProgress] = useState(0);
  const [aiStep, setAiStep] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

  // Add text helper
  const handleAddText = () => {
    if (!canvas) return;
    loadGoogleFont(selectedFont);

    const text = new fabric.IText(textInput, {
      left: 150,
      top: 150,
      fontFamily: selectedFont,
      fontSize: 32,
      fill: textColor,
      cornerColor: '#6366f1',
      cornerSize: 8,
      transparentCorners: false,
      charSpacing: 0,
      lineHeight: 1.15,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    calculatePrice();
    canvas.fire('object:modified');
  };

  // Add shape helper
  const handleAddShape = (shapeType) => {
    if (!canvas) return;
    let shape;

    const baseProps = {
      left: 200,
      top: 200,
      fill: '#6366f1',
      cornerColor: '#6366f1',
      cornerSize: 8,
      transparentCorners: false,
    };

    if (shapeType === 'rect') {
      shape = new fabric.Rect({
        ...baseProps,
        width: 100,
        height: 100,
      });
    } else if (shapeType === 'circle') {
      shape = new fabric.Circle({
        ...baseProps,
        radius: 50,
      });
    } else if (shapeType === 'triangle') {
      shape = new fabric.Triangle({
        ...baseProps,
        width: 100,
        height: 100,
      });
    }

    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
      calculatePrice();
      canvas.fire('object:modified');
    }
  };

  // Add Image/Clipart helper
  const handleAddImage = (url) => {
    if (!canvas) return;
    fabric.Image.fromURL(
      url,
      (img) => {
        img.scaleToWidth(180);
        img.set({
          left: 150,
          top: 150,
          cornerColor: '#6366f1',
          cornerSize: 8,
          transparentCorners: false,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        calculatePrice();
        canvas.fire('object:modified');
      },
      { crossOrigin: 'anonymous' }
    );
  };

  // Image Upload helper
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('images', file);

    setIsUploading(true);
    try {
      const res = await axios.post(`${API_URL}/upload/review-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const url = res.data.data.urls[0];
      setUploadedImages(prev => [url, ...prev]);
      handleAddImage(url);
      toast.success('Asset uploaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload. Adding local preview.');
      // Fallback local blob URL
      const localUrl = URL.createObjectURL(file);
      setUploadedImages(prev => [localUrl, ...prev]);
      handleAddImage(localUrl);
    } finally {
      setIsUploading(false);
    }
  };

  // Simulated AI design generator
  const triggerAiGeneration = () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a generation prompt.');
      return;
    }
    setIsGenerating(true);
    setAiProgress(10);
    setAiStep('Parsing creative parameters...');

    const steps = [
      { p: 30, text: 'Mapping design styles...' },
      { p: 55, text: 'Rendering vector details...' },
      { p: 80, text: 'Enhancing resolution grids...' },
      { p: 100, text: 'Optimizing SVGs...' }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setAiProgress(step.p);
        setAiStep(step.text);
        if (step.p === 100) {
          setTimeout(() => {
            // Add a beautiful generated mockup image (e.g. dynamic design graphics)
            const generatedUrls = {
              vector: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=200', // floral
              cyberpunk: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=200', // neon
              watercolor: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=200', // abstract
            };
            const resultUrl = generatedUrls[aiStyle] || generatedUrls.vector;
            handleAddImage(resultUrl);
            setIsGenerating(false);
            setAiPrompt('');
            toast.success('AI Graphic Generated!');
          }, 600);
        }
      }, (idx + 1) * 1200);
    });
  };

  // Simulated AI Background removal
  const triggerBackgroundRemoval = () => {
    const active = canvas?.getActiveObject();
    if (!active || !active.isType('image')) {
      toast.error('Please select an image layer on the canvas first.');
      return;
    }
    toast.loading('AI Background Remover is running...', { duration: 2000 });
    setTimeout(() => {
      // Background removal logic: apply white-removal filter or replace with transparent logo
      active.set({
        // Simulate transparent mask overlay or scale
        opacity: 0.95
      });
      canvas.renderAll();
      toast.success('Background Removed!');
    }, 2000);
  };

  // Simulated Logo Vectorization
  const triggerVectorization = () => {
    const active = canvas?.getActiveObject();
    if (!active) {
      toast.error('Please select an object to vectorize.');
      return;
    }
    toast.loading('Converting to vector curves...', { duration: 1800 });
    setTimeout(() => {
      toast.success('Object Vectorized successfully!');
    }, 1800);
  };

  // Layers panel logic
  const getCanvasObjects = () => {
    if (!canvas) return [];
    return canvas.getObjects().map((obj, index) => ({
      index,
      type: obj.type,
      text: obj.text || (obj.isType('image') ? 'Uploaded Image' : 'Shape'),
      visible: obj.visible,
      locked: obj.lockMovementX,
      ref: obj,
    })).reverse(); // top layer first
  };

  const toggleLayerVisibility = (obj) => {
    obj.visible = !obj.visible;
    canvas.renderAll();
    canvas.fire('object:modified');
  };

  const toggleLayerLock = (obj) => {
    const isLocked = !obj.lockMovementX;
    obj.set({
      lockMovementX: isLocked,
      lockMovementY: isLocked,
      lockRotation: isLocked,
      lockScalingX: isLocked,
      lockScalingY: isLocked,
      hasControls: !isLocked,
    });
    canvas.renderAll();
    canvas.fire('object:modified');
  };

  const deleteLayer = (obj) => {
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.renderAll();
    calculatePrice();
  };

  return (
    <div className="flex bg-white border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden h-[620px] w-full max-w-[480px]">
      {/* 1. Left Icon Navigation Bar with labels */}
      <div className="flex flex-col items-center bg-white border-r border-zinc-200 py-4 w-20 shrink-0 gap-1 overflow-y-auto select-none">
        {[
          { id: 'upload', label: 'Upload', icon: <Upload size={18} /> },
          { id: 'ai', label: 'AI', icon: <Sparkles size={18} /> },
          { id: 'personalize', label: 'Personalize', icon: <Palette size={18} /> },
          { id: 'text', label: 'Add text', icon: <Type size={18} /> },
          { id: 'library', label: 'My library', icon: <FolderOpen size={18} /> },
          { id: 'graphics', label: 'Graphics', icon: <Compass size={18} /> },
          { id: 'templates', label: 'My templates', icon: <Layout size={18} /> },
          { id: 'shutterstock', label: 'Shutterstock', icon: <ImageIcon size={18} /> },
          { id: 'fiverr', label: 'Fiverr', icon: <Briefcase size={18} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full py-3.5 transition-all ${
              activeTab === tab.id
                ? 'text-[#5b5c47] border-l-4 border-[#5b5c47] bg-zinc-50/50'
                : 'text-zinc-400 hover:text-zinc-650 hover:bg-zinc-50/20'
            }`}
          >
            {tab.icon}
            <span className={`text-[9px] font-semibold mt-1 text-center whitespace-nowrap px-1 overflow-hidden truncate max-w-full ${
              activeTab === tab.id ? 'text-[#5b5c47]' : 'text-zinc-500'
            }`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* 2. Tool Configuration Panels */}
      <div className="flex-grow p-6 overflow-y-auto">
        
        {/* Tab: Personalize */}
        {activeTab === 'personalize' && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Personalize Product</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Select garments color, sizes, and active panels.</p>
            </div>

            {/* Base Colors */}
            {product?.colors && product.colors.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Garment Base Color</span>
                <div className="flex gap-2.5 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBaseColor(color)}
                      className={`w-8 h-8 rounded-full border transition-all ${
                        baseColor === color ? 'border-indigo-650 ring-2 ring-indigo-500/20 scale-105 shadow-sm' : 'border-zinc-200 dark:border-zinc-700'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {baseColor === color && (
                        <Check size={14} className={color === '#ffffff' || color === '#fff' ? 'text-zinc-800 mx-auto' : 'text-white mx-auto'} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product?.sizes && product.sizes.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Available Sizes</span>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-9 rounded-xl border text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'border-[#5b5c47] bg-[#5b5c47]/10 text-[#5b5c47]'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-660 dark:text-zinc-330 hover:bg-zinc-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Upload */}
        {activeTab === 'upload' && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Upload Designs</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Import custom logos, images, or graphics.</p>
            </div>

            {/* Upload Area */}
            <label className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-[#5b5c47] rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center gap-2 group transition-all bg-white dark:bg-zinc-950">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                disabled={isUploading}
              />
              <div className="w-11 h-11 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-[#5b5c47] group-hover:bg-[#5b5c47]/10 transition-all">
                {isUploading ? (
                  <RefreshCw size={18} className="animate-spin text-[#5b5c47]" />
                ) : (
                  <Upload size={18} />
                )}
              </div>
              <span className="text-xs font-semibold mt-1">
                {isUploading ? 'Uploading to server...' : 'Upload from Device'}
              </span>
              <span className="text-[10px] text-zinc-400">Supports PNG, JPG, WebP (Max 5MB)</span>
            </label>
          </div>
        )}

        {/* Tab: AI Studio */}
        {activeTab === 'ai' && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">AI Design Studio</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Leverage advanced neural engines to modify assets.</p>
            </div>

            {/* AI Generation */}
            <div className="flex flex-col gap-3 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl">
              <span className="text-xs font-semibold text-[#5b5c47] flex items-center gap-1">
                <Wand2 size={12} /> Text-to-Graphic Generator
              </span>
              
              <textarea
                placeholder="Describe your design (e.g., 'Retro cyberpunk tiger face vector logo...')"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#5b5c47] bg-white dark:bg-zinc-950"
                rows="2"
                disabled={isGenerating}
              />

              <div className="flex gap-2">
                <select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value)}
                  className="flex-grow border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#5b5c47] bg-white dark:bg-zinc-950"
                  disabled={isGenerating}
                >
                  <option value="vector">Vector Flat Logo</option>
                  <option value="cyberpunk">Cyberpunk Neon</option>
                  <option value="watercolor">Soft Watercolor</option>
                </select>

                <button
                  onClick={triggerAiGeneration}
                  disabled={isGenerating}
                  className="bg-[#5b5c47] hover:bg-[#4a4b39] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  Generate
                </button>
              </div>

              {isGenerating && (
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>{aiStep}</span>
                    <span>{aiProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#5b5c47] transition-all duration-300"
                      style={{ width: `${aiProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* AI Image Operations */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">AI Edit Operations</span>
              
              <button
                onClick={triggerBackgroundRemoval}
                className="flex items-center justify-between border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-left transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-red-500/10 text-red-500"><Eraser size={14} /></span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">Remove Background</span>
                    <span className="text-[10px] text-zinc-400">Isolate logos from solid backgrounds</span>
                  </div>
                </div>
              </button>

              <button
                onClick={triggerVectorization}
                className="flex items-center justify-between border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-left transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Sparkles size={14} /></span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">Vectorize Raster Graphics</span>
                    <span className="text-[10px] text-zinc-400">Convert JPG/PNG to scalable vectors</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Tab: Add Text */}
        {activeTab === 'text' && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Add Text</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Insert rich typographic layers.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400">Text Content</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#5b5c47] bg-transparent"
                rows="2"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400">Font Family</label>
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#5b5c47] bg-transparent"
              >
                <option value="Inter">Inter (Sans)</option>
                <option value="Outfit">Outfit (Display)</option>
                <option value="Orbitron">Orbitron (Tech)</option>
                <option value="Montserrat">Montserrat (Classic)</option>
                {fonts.map(font => (
                  <option key={font._id} value={font.family}>{font.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400">Text Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0 cursor-pointer overflow-hidden"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-1.5 text-[10px] text-center w-24 bg-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleAddText}
              className="w-full py-3 bg-[#5b5c47] hover:bg-[#4a4b39] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-zinc-600/10 flex items-center justify-center gap-1.5 mt-2"
            >
              <Plus size={16} /> Add Text Layer
            </button>
          </div>
        )}

        {/* Tab: Graphics */}
        {activeTab === 'graphics' && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Graphics & Shapes</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Insert preloaded vectors or standard shape elements.</p>
            </div>

            {/* Standard Vector Shapes */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Vector Shapes</span>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleAddShape('rect')}
                  className="aspect-square bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-[#5b5c47] transition-all text-[10px] font-bold shadow-sm"
                >
                  <div className="w-8 h-8 border-2 border-[#5b5c47] bg-[#5b5c47]/10 rounded-sm" />
                  Square
                </button>
                <button
                  onClick={() => handleAddShape('circle')}
                  className="aspect-square bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-[#5b5c47] transition-all text-[10px] font-bold shadow-sm"
                >
                  <div className="w-8 h-8 border-2 border-[#5b5c47] bg-[#5b5c47]/10 rounded-full" />
                  Circle
                </button>
                <button
                  onClick={() => handleAddShape('triangle')}
                  className="aspect-square bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-[#5b5c47] transition-all text-[10px] font-bold shadow-sm"
                >
                  <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-[#5b5c47]/70" />
                  Triangle
                </button>
              </div>
            </div>

            {/* SVG Cliparts Library */}
            <div className="flex flex-col gap-3 border-t border-zinc-200/50 dark:border-zinc-800/80 pt-4">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">SVG Clipart Assets</span>
              <div className="grid grid-cols-3 gap-2">
                {cliparts.map((clip) => (
                  <button
                    key={clip._id}
                    onClick={() => handleAddImage(clip.svgUrl)}
                    className="aspect-square bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 flex items-center justify-center hover:border-[#5b5c47] hover:scale-105 transition-all shadow-sm"
                  >
                    <img src={clip.svgUrl} alt={clip.name} className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: My Library */}
        {activeTab === 'library' && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">My Library</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Manage uploaded assets and active canvas layers.</p>
            </div>

            {/* Library Uploaded Graphics */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Library Images</span>
              <div className="grid grid-cols-3 gap-2">
                {uploadedImages.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddImage(url)}
                    className="aspect-square bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden p-1 flex items-center justify-center hover:border-[#5b5c47] hover:scale-105 transition-all"
                  >
                    <img src={url} alt="Library Item" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Active Canvas Layers Inspector */}
            <div className="flex flex-col gap-2 border-t border-zinc-200/50 dark:border-zinc-800/80 pt-4">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Layers size={12} /> Active Canvas Layers
              </span>
              <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                {getCanvasObjects().map((layer) => (
                  <div
                    key={layer.index}
                    className="flex items-center justify-between border border-zinc-100 dark:border-zinc-800 rounded-xl p-2 bg-zinc-50/30 dark:bg-zinc-900/20 gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all"
                  >
                    <span className="text-[10px] font-semibold truncate max-w-[120px] text-zinc-700 dark:text-zinc-300">
                      {layer.text}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleLayerVisibility(layer.ref)}
                        className={`p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 ${
                          layer.visible ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-300 dark:text-zinc-700'
                        }`}
                        title="Visibility"
                      >
                        {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                      </button>
                      <button
                        onClick={() => toggleLayerLock(layer.ref)}
                        className={`p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 ${
                          layer.locked ? 'text-amber-500' : 'text-zinc-300 dark:text-zinc-700'
                        }`}
                        title="Lock"
                      >
                        {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
                      </button>
                      <button
                        onClick={() => deleteLayer(layer.ref)}
                        className="p-1 rounded hover:bg-red-50 text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                {getCanvasObjects().length === 0 && (
                  <p className="text-[10px] text-zinc-400 italic text-center py-4">No layers on this canvas view.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: My Templates */}
        {activeTab === 'templates' && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Design Templates</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Start with one of our pre-designed templates.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Retro Sunset', desc: 'Warm gradients & sun curves', action: () => {
                  if (!canvas) return;
                  canvas.clear();
                  const circle = new fabric.Circle({
                    left: 200, top: 180, radius: 80, fill: '#ff7a59', selectable: true
                  });
                  const text = new fabric.IText('RETRO SUN', {
                    left: 170, top: 360, fontFamily: 'Montserrat', fontSize: 36, fill: '#111111', fontWeight: 'bold'
                  });
                  canvas.add(circle, text);
                  canvas.renderAll();
                  calculatePrice();
                  toast.success('Retro Sunset loaded!');
                }},
                { name: 'Minimalist Tag', desc: 'Clean, framed modern look', action: () => {
                  if (!canvas) return;
                  canvas.clear();
                  const rect = new fabric.Rect({
                    left: 170, top: 150, width: 260, height: 160, fill: 'transparent', stroke: '#111111', strokeWidth: 4, selectable: true
                  });
                  const text = new fabric.IText('BHONDU ATELIER', {
                    left: 185, top: 215, fontFamily: 'Outfit', fontSize: 24, fill: '#111111', tracking: 400
                  });
                  canvas.add(rect, text);
                  canvas.renderAll();
                  calculatePrice();
                  toast.success('Minimalist Tag loaded!');
                }},
                { name: 'Athletics Team', desc: 'College sport outline styles', action: () => {
                  if (!canvas) return;
                  canvas.clear();
                  const text1 = new fabric.IText('BHONDU', {
                    left: 150, top: 160, fontFamily: 'Outfit', fontSize: 64, fill: 'transparent', stroke: '#5b5c47', strokeWidth: 2, fontWeight: 'bold'
                  });
                  const text2 = new fabric.IText('CO. 26', {
                    left: 250, top: 250, fontFamily: 'Outfit', fontSize: 32, fill: '#5b5c47', fontWeight: 'bold'
                  });
                  canvas.add(text1, text2);
                  canvas.renderAll();
                  calculatePrice();
                  toast.success('Athletics Team loaded!');
                }},
                { name: 'Abstract Vibe', desc: 'Modern geometric curves', action: () => {
                  if (!canvas) return;
                  canvas.clear();
                  const triangle = new fabric.Triangle({
                    left: 220, top: 140, width: 160, height: 160, fill: '#a2a392', selectable: true
                  });
                  const text = new fabric.IText('ESSENCE', {
                    left: 200, top: 320, fontFamily: 'Inter', fontSize: 36, fill: '#111111', fontWeight: 'bold', charSpacing: 100
                  });
                  canvas.add(triangle, text);
                  canvas.renderAll();
                  calculatePrice();
                  toast.success('Abstract Vibe loaded!');
                }}
              ].map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={tpl.action}
                  className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-400 bg-white dark:bg-zinc-905 text-left transition-all"
                >
                  <span className="text-xs font-bold block text-zinc-850 dark:text-zinc-200">{tpl.name}</span>
                  <span className="text-[10px] text-zinc-400 mt-1 block">{tpl.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Shutterstock */}
        {activeTab === 'shutterstock' && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Shutterstock Images</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Search and license millions of premium stock assets.</p>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search premium stock photos..."
                className="flex-grow border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none bg-transparent"
                defaultValue="abstract graphic"
              />
              <button className="bg-[#5b5c47] text-white px-3 py-2 rounded-xl text-xs font-bold">Search</button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=200',
                'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=200',
                'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=200',
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200',
                'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200',
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=200'
              ].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddImage(img)}
                  className="aspect-square border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-[#5b5c47] hover:scale-105 transition-all shadow-sm"
                >
                  <img src={img} alt="Stock option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Fiverr */}
        {activeTab === 'fiverr' && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Hire a Fiverr Designer</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Need custom vector illustration or apparel branding?</p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">
                FI
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold">Freelance Design Atelier</h4>
                <p className="text-[11px] text-zinc-400">Collaborate with high-caliber designers starting from just ₹450 to create custom artwork for your apparel brand.</p>
              </div>
              <button 
                onClick={() => window.open('https://fiverr.com', '_blank')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 cursor-pointer w-full"
              >
                Find Designers on Fiverr
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignerSidebar;
