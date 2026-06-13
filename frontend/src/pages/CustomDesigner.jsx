import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DesignerProvider, useDesigner } from '../context/DesignerContext';
import { ShopContext } from '../context/ShopContext';
import DesignerCanvas from '../components/designer/DesignerCanvas';
import DesignerSidebar from '../components/designer/DesignerSidebar';
import DesignerToolbar from '../components/designer/DesignerToolbar';
import { fabric } from 'fabric';
import { 
  Save, 
  ShoppingBag, 
  ArrowLeft, 
  Loader2, 
  ZoomIn, 
  ZoomOut, 
  Hand, 
  Download, 
  Eye, 
  Edit3,
  Info,
  Undo,
  Redo,
  Maximize2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomDesignerContent = () => {
  const {
    product,
    template,
    estimatedPrice,
    designName,
    setDesignName,
    isSaving,
    saveDesignToDatabase,
    baseColor,
    selectedSize,
    activeView,
    switchView,
    canvas,
    undo,
    redo,
    duplicateActiveObject,
    deleteActiveObject,
    copyActiveObject,
    pasteObject,
    zoom,
    setZoom,
    isPanning,
    setIsPanning,
    isPreviewMode,
    setIsPreviewMode,
  } = useDesigner();

  const { addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // Preview mockup style switcher
  const [mockupType, setMockupType] = useState('flat'); // 'flat' or 'folded'
  const [designSnapshot, setDesignSnapshot] = useState('');

  // Capture canvas designs when entering preview mode or swapping views
  useEffect(() => {
    if (isPreviewMode && canvas) {
      try {
        // Deselect first to make sure bounds aren't exported in preview snapshot
        canvas.discardActiveObject().requestRenderAll();
        
        // Grab transparent PNG of canvas objects
        const snapshotUrl = canvas.toDataURL({
          format: 'png',
          quality: 1.0,
        });
        setDesignSnapshot(snapshotUrl);
      } catch (err) {
        console.error('Failed to capture canvas snapshot:', err);
      }
    }
  }, [isPreviewMode, mockupType, canvas, activeView]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!canvas) return;
      const active = canvas.getActiveObject();
      const isEditingText = active && active.isEditing;
      if (isEditingText) return; // skip if user is typing

      // Delete/Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteActiveObject();
      }

      // Ctrl + Z (Undo)
      if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }

      // Ctrl + Y (Redo)
      if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }

      // Ctrl + D (Duplicate)
      if (e.ctrlKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateActiveObject();
      }

      // Ctrl + C (Copy)
      if (e.ctrlKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copyActiveObject();
      }

      // Ctrl + V (Paste)
      if (e.ctrlKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        pasteObject();
      }

      // Arrow Key Nudging
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && active) {
        e.preventDefault();
        const nudgeAmount = e.shiftKey ? 10 : 1;
        switch (e.key) {
          case 'ArrowUp':
            active.set('top', active.top - nudgeAmount);
            break;
          case 'ArrowDown':
            active.set('top', active.top + nudgeAmount);
            break;
          case 'ArrowLeft':
            active.set('left', active.left - nudgeAmount);
            break;
          case 'ArrowRight':
            active.set('left', active.left + nudgeAmount);
            break;
        }
        active.setCoords();
        canvas.renderAll();
        canvas.fire('object:modified');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, deleteActiveObject, undo, redo, duplicateActiveObject, copyActiveObject, pasteObject]);

  const handleSaveDraft = async () => {
    await saveDesignToDatabase();
  };

  const handleAddToCart = async () => {
    const savedDesign = await saveDesignToDatabase();
    if (!savedDesign) return;
    const customImage = savedDesign.views.find(v => v.viewId === 'front')?.thumbnailUrl || product.images[0];
    addToCart(
      product,
      selectedSize,
      baseColor,
      1,
      savedDesign._id,
      estimatedPrice,
      customImage
    );
  };

  // High-Resolution 300 DPI Export function (runs on offscreen canvas)
  const handleExport = (format) => {
    if (!canvas) return;
    setShowExportOptions(false);
    toast.loading(`Generating high-res ${format.toUpperCase()} (300 DPI Print-Ready)...`, { duration: 1500 });

    setTimeout(() => {
      const exportWidth = 3000;
      const exportHeight = 3000;

      // Create high-res offscreen canvas
      const tempElement = document.createElement('canvas');
      tempElement.width = exportWidth;
      tempElement.height = exportHeight;

      const tempCanvas = new fabric.Canvas(tempElement, {
        width: exportWidth,
        height: exportHeight,
        backgroundColor: 'rgba(0,0,0,0)',
      });

      const currentJSON = canvas.toJSON();
      tempCanvas.loadFromJSON(currentJSON, () => {
        const multiplier = exportWidth / canvas.width;
        
        // Scale all objects proportionally
        const objects = tempCanvas.getObjects();
        objects.forEach((obj) => {
          obj.set({
            left: obj.left * multiplier,
            top: obj.top * multiplier,
            scaleX: (obj.scaleX || 1) * multiplier,
            scaleY: (obj.scaleY || 1) * multiplier,
          });
          obj.setCoords();
        });

        tempCanvas.renderAll();

        let fileData, filename;
        if (format === 'svg') {
          fileData = tempCanvas.toSVG();
          filename = `${designName.toLowerCase().replace(/\s+/g, '-')}-300dpi.svg`;
          const blob = new Blob([fileData], { type: 'image/svg+xml' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          link.click();
        } else {
          fileData = tempCanvas.toDataURL({
            format: format === 'jpg' ? 'jpeg' : 'png',
            quality: 1.0,
          });
          filename = `${designName.toLowerCase().replace(/\s+/g, '-')}-300dpi.${format}`;
          const link = document.createElement('a');
          link.href = fileData;
          link.download = filename;
          link.click();
        }
        toast.success(`High-res 300 DPI ${format.toUpperCase()} Exported!`);
      });
    }, 1500);
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <p className="text-zinc-500 font-medium">Loading apparel configuration...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col text-zinc-800 dark:text-zinc-200">
      
      {/* 1. Header Bar */}
      <header className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800/80 px-6 py-3 flex items-center justify-between z-40 shadow-sm">
        {/* Left: Back, Info & Undo/Redo */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-650"
            title="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <button 
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-400"
            title="Information"
          >
            <Info size={16} />
          </button>
          <div className="w-[1px] h-4 bg-zinc-200 mx-1.5" />
          <button 
            onClick={undo}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-400"
            title="Undo"
          >
            <Undo size={16} />
          </button>
          <button 
            onClick={redo}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-400"
            title="Redo"
          >
            <Redo size={16} />
          </button>
        </div>

        {/* Right side controls: Edit / Preview, Expander */}
        <div className="flex items-center gap-4">
          {/* Edit / Preview Toggle */}
          <div className="flex bg-[#f3f4f0] p-1 rounded-lg border border-zinc-200/60 shadow-sm gap-0.5">
            <button
              onClick={() => setIsPreviewMode(false)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                !isPreviewMode 
                  ? 'bg-[#5b5c47] text-white shadow-sm' 
                  : 'text-zinc-555 hover:text-zinc-850 bg-white'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setIsPreviewMode(true)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                isPreviewMode 
                  ? 'bg-[#5b5c47] text-white shadow-sm' 
                  : 'text-zinc-555 hover:text-zinc-850 bg-white'
              }`}
            >
              Preview
            </button>
          </div>

          <button 
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-650"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={16} />
          </button>

          <div className="flex flex-col items-end">
            <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider">Total Est.</span>
            <span className="text-base font-bold text-[#5b5c47]">₹{estimatedPrice}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Save Draft
            </button>
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 rounded-xl bg-[#5b5c47] hover:bg-[#4a4b39] text-white text-xs font-bold transition-all shadow-md shadow-zinc-600/10 flex items-center gap-1.5"
            >
              <ShoppingBag size={13} /> Add to Cart
            </button>
          </div>
        </div>
      </header>

      {/* 2. Workspace Body Layout */}
      <div className="flex-grow flex flex-col lg:flex-row relative">
        
        {/* Left Sidebar Pane: Hidden in Preview Mode */}
        <div 
          className={`shrink-0 border-r border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 flex justify-center transition-all duration-300 ${
            isPreviewMode ? 'w-0 opacity-0 overflow-hidden p-0' : 'w-full lg:w-[480px]'
          }`}
        >
          <DesignerSidebar />
        </div>

        {/* Center Canvas Pane */}
        <div className="flex-grow flex flex-col items-center justify-between p-6 relative gap-4 min-h-[500px]">
          
          {/* Top Canvas Toolbar / Preview Mockup Switcher */}
          <div className="w-full max-w-[650px]">
            {isPreviewMode ? (
              <div className="flex items-center justify-between bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-3 shadow-md w-full transition-all">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-2">
                  Presentation Mode
                </span>
                
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-700">
                  <button
                    onClick={() => setMockupType('flat')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      mockupType === 'flat' 
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700'
                    }`}
                  >
                    Flat Garment
                  </button>
                  <button
                    onClick={() => setMockupType('folded')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      mockupType === 'folded' 
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700'
                    }`}
                  >
                    Folded Flatlay
                  </button>
                </div>
              </div>
            ) : (
              <DesignerToolbar />
            )}
          </div>

          {/* Centralized Canvas component */}
          <div className="flex-grow flex items-center justify-center w-full relative z-10">
            {isPreviewMode && mockupType === 'folded' ? (
              <div 
                className="relative shadow-2xl rounded-3xl overflow-hidden w-[600px] h-[600px] bg-zinc-100"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                {/* Folded T-shirt backdrop flatlay */}
                <img
                  src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop"
                  alt="Folded T-Shirt Mockup"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Design overlay aligned to chest with fold-matching distortion */}
                {designSnapshot && (
                  <img
                    src={designSnapshot}
                    alt="Design Print on Chest"
                    className="absolute w-[140px] h-[140px] object-contain pointer-events-none"
                    style={{
                      top: '39%',
                      left: '37.5%',
                      transform: 'rotate(-4.5deg) skewX(-2deg)',
                      opacity: 0.88,
                      mixBlendMode: 'multiply'
                    }}
                  />
                )}
              </div>
            ) : (
              <DesignerCanvas />
            )}
          </div>

          {/* Bottom center: View switcher below canvas */}
          <div className="flex bg-[#f3f4f0] p-1 rounded-full border border-zinc-200/60 shadow-sm gap-1 z-30 mt-4">
            {[
              { id: 'front', label: 'Front side' },
              { id: 'back', label: 'Back side' },
              { id: 'left-sleeve', label: 'Sleeve left' },
              { id: 'right-sleeve', label: 'Sleeve right' },
              { id: 'collar', label: 'Neck label Inner' }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => switchView(view.id)}
                className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeView === view.id
                    ? 'bg-[#5b5c47] text-white shadow-sm'
                    : 'text-zinc-650 hover:text-zinc-900 bg-white'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>

          {/* Floating UI Overlays: Zoom & Export */}
          
          {/* Bottom Left: Zoom and Pan controls */}
          <div className="absolute bottom-6 left-6 flex items-center gap-1 bg-white/90 border border-zinc-200/60 shadow-md p-1 rounded-xl z-30 text-zinc-700">
            <button
              onClick={() => setZoom(Math.max(0.2, zoom - 0.1))}
              className="px-2 py-1 rounded-lg hover:bg-zinc-150 text-zinc-650 font-bold"
              title="Zoom Out"
            >
              -
            </button>
            
            <div className="relative px-2 flex items-center gap-1 font-bold text-xs cursor-pointer select-none">
              <span>{Math.round(zoom * 100)}%</span>
              <span className="text-[9px] text-zinc-400">▼</span>
            </div>

            <button
              onClick={() => setZoom(Math.min(2.5, zoom + 0.1))}
              className="px-2 py-1 rounded-lg hover:bg-zinc-150 text-zinc-650 font-bold"
              title="Zoom In"
            >
              +
            </button>

            <div className="w-[1px] h-4 bg-zinc-200 mx-1.5" />

            <button
              onClick={() => setIsPanning(!isPanning)}
              className={`p-2 rounded-lg transition-all ${
                isPanning 
                  ? 'bg-[#5b5c47] text-white' 
                  : 'text-zinc-600 hover:bg-zinc-150'
              }`}
              title="Hand Pan Tool"
            >
              <Hand size={14} />
            </button>
          </div>

          {/* Bottom Right: Export options */}
          <div className="absolute bottom-6 right-6 z-30">
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border border-zinc-350 px-6 py-2.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Download size={13} /> Save product
              </button>

              {showExportOptions && (
                <div className="absolute bottom-12 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-xl flex flex-col gap-1 w-44">
                  <div className="px-2 py-1 text-[9px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 mb-1">
                    Export Print Files
                  </div>
                  <button onClick={() => handleExport('png')} className="text-left px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs rounded-lg font-medium">PNG (Transparent)</button>
                  <button onClick={() => handleExport('jpg')} className="text-left px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs rounded-lg font-medium">JPG (Flat Backdrop)</button>
                  <button onClick={() => handleExport('svg')} className="text-left px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs rounded-lg font-medium">SVG (Vector Outlines)</button>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

const CustomDesigner = () => {
  const { productId } = useParams();
  return (
    <DesignerProvider productId={productId}>
      <CustomDesignerContent />
    </DesignerProvider>
  );
};

export default CustomDesigner;
