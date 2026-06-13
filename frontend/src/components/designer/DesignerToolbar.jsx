import React, { useState } from 'react';
import { useDesigner } from '../../context/DesignerContext';
import { fabric } from 'fabric';
import { 
  Undo2, 
  Redo2, 
  Trash2, 
  AlignCenter, 
  Bold, 
  Italic, 
  RotateCw,
  Sparkles,
  AlignLeft,
  AlignRight,
  AlignVerticalSpaceAround,
  AlignHorizontalSpaceAround,
  Layers,
  ChevronDown,
  ChevronUp,
  Maximize,
  Sliders,
  Type
} from 'lucide-react';

const DesignerToolbar = () => {
  const {
    canvas,
    activeObject,
    setActiveObject,
    undo,
    redo,
    hasUndo,
    hasRedo,
    calculatePrice,
    duplicateActiveObject,
    deleteActiveObject,
  } = useDesigner();

  // Sub-menus state
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  if (!canvas) return null;

  const isTextSelected = activeObject && (activeObject.type === 'text' || activeObject.type === 'i-text');
  const isImageSelected = activeObject && activeObject.type === 'image';

  // Smart Alignment Operations
  const handleAlign = (type) => {
    const active = canvas.getActiveObject();
    if (!active) return;

    // Use current canvas dimensions (adapts to full garment or sleeve print boundary)
    const bounds = active.getBoundingRect();

    switch (type) {
      case 'left':
        active.set({ left: 0 });
        break;
      case 'center-h':
        canvas.centerObjectH(active);
        break;
      case 'right':
        active.set({ left: canvas.width - bounds.width });
        break;
      case 'top':
        active.set({ top: 0 });
        break;
      case 'center-v':
        canvas.centerObjectV(active);
        break;
      case 'bottom':
        active.set({ top: canvas.height - bounds.height });
        break;
      default:
        break;
    }

    active.setCoords();
    canvas.renderAll();
    canvas.fire('object:modified');
  };

  // Layer Management inside toolbar
  const handleLayerOrder = (action) => {
    const active = canvas.getActiveObject();
    if (!active) return;

    switch (action) {
      case 'front':
        canvas.bringToFront(active);
        break;
      case 'back':
        canvas.sendToBack(active);
        break;
      case 'forward':
        canvas.bringForward(active);
        break;
      case 'backward':
        canvas.sendBackwards(active);
        break;
      default:
        break;
    }
    canvas.renderAll();
    canvas.fire('object:modified');
  };

  // Rotate helper
  const handleRotate = () => {
    const active = canvas.getActiveObject();
    if (!active) return;
    const currentAngle = active.angle || 0;
    active.set('angle', (currentAngle + 90) % 360);
    canvas.renderAll();
    canvas.fire('object:modified');
  };

  // Image Filter helper
  const handleImageFilter = (filterName, checked) => {
    const active = canvas.getActiveObject();
    if (!active || active.type !== 'image') return;

    let filter;
    if (filterName === 'grayscale') {
      filter = new fabric.Image.filters.Grayscale();
    } else if (filterName === 'sepia') {
      filter = new fabric.Image.filters.Sepia();
    } else if (filterName === 'invert') {
      filter = new fabric.Image.filters.Invert();
    }

    if (checked) {
      active.filters.push(filter);
    } else {
      const idx = active.filters.findIndex(f => {
        if (filterName === 'grayscale') return f instanceof fabric.Image.filters.Grayscale;
        if (filterName === 'sepia') return f instanceof fabric.Image.filters.Sepia;
        if (filterName === 'invert') return f instanceof fabric.Image.filters.Invert;
        return false;
      });
      if (idx > -1) active.filters.splice(idx, 1);
    }

    active.applyFilters();
    canvas.renderAll();
    canvas.fire('object:modified');
  };

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 shadow-lg w-full gap-3 select-none">
      {/* 1. Main Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* History Action Group */}
        <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
          <button
            onClick={undo}
            disabled={!hasUndo}
            className={`p-2 rounded-lg transition-all ${
              hasUndo 
                ? 'text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 shadow-sm' 
                : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={!hasRedo}
            className={`p-2 rounded-lg transition-all ${
              hasRedo 
                ? 'text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 shadow-sm' 
                : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo2 size={16} />
          </button>
        </div>

        {/* Selected Object Utilities */}
        {activeObject ? (
          <div className="flex flex-wrap items-center gap-1.5 bg-indigo-50/30 dark:bg-indigo-950/10 p-1.5 rounded-xl border border-indigo-100/50 dark:border-indigo-900/20">
            <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider px-1.5 flex items-center gap-0.5">
              <Sparkles size={11} /> Edit Controls
            </span>

            {/* Smart Align Toggle */}
            <div className="relative">
              <button
                onClick={() => { setShowAlignMenu(!showAlignMenu); setShowLayerMenu(false); setShowFilterMenu(false); }}
                className="p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-indigo-500/10 hover:text-indigo-600 flex items-center gap-0.5 text-xs font-semibold"
                title="Smart Alignment"
              >
                Align <ChevronDown size={12} />
              </button>
              {showAlignMenu && (
                <div className="absolute top-10 left-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl shadow-xl z-50 flex flex-col gap-1 w-32">
                  <button onClick={() => handleAlign('left')} className="text-left px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs rounded-lg">Align Left</button>
                  <button onClick={() => handleAlign('center-h')} className="text-left px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs rounded-lg">Center H</button>
                  <button onClick={() => handleAlign('right')} className="text-left px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs rounded-lg">Align Right</button>
                  <button onClick={() => handleAlign('top')} className="text-left px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs rounded-lg">Align Top</button>
                  <button onClick={() => handleAlign('center-v')} className="text-left px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs rounded-lg">Center V</button>
                  <button onClick={() => handleAlign('bottom')} className="text-left px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs rounded-lg">Align Bottom</button>
                </div>
              )}
            </div>

            {/* Layers Toggle */}
            <div className="relative">
              <button
                onClick={() => { setShowLayerMenu(!showLayerMenu); setShowAlignMenu(false); setShowFilterMenu(false); }}
                className="p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-indigo-500/10 hover:text-indigo-600 flex items-center gap-0.5 text-xs font-semibold"
                title="Arrange Layers"
              >
                Arrange <ChevronDown size={12} />
              </button>
              {showLayerMenu && (
                <div className="absolute top-10 left-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl shadow-xl z-50 flex flex-col gap-1 w-36">
                  <button onClick={() => handleLayerOrder('front')} className="text-left px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs rounded-lg">Bring to Front</button>
                  <button onClick={() => handleLayerOrder('forward')} className="text-left px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs rounded-lg">Bring Forward</button>
                  <button onClick={() => handleLayerOrder('backward')} className="text-left px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs rounded-lg">Send Backward</button>
                  <button onClick={() => handleLayerOrder('back')} className="text-left px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs rounded-lg">Send to Back</button>
                </div>
              )}
            </div>

            {/* Quick transformations */}
            <button
              onClick={handleRotate}
              className="p-2 rounded-lg hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
              title="Rotate 90°"
            >
              <RotateCw size={15} />
            </button>
            <button
              onClick={duplicateActiveObject}
              className="p-2 rounded-lg hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold"
              title="Duplicate"
            >
              Duplicate
            </button>

            {/* Text Styling Group */}
            {isTextSelected && (
              <div className="flex items-center gap-1.5 border-l border-indigo-100/50 dark:border-indigo-900/30 pl-2">
                <button
                  onClick={() => {
                    const nextWeight = activeObject.fontWeight === 'bold' ? 'normal' : 'bold';
                    activeObject.set('fontWeight', nextWeight);
                    canvas.renderAll();
                    canvas.fire('object:modified');
                  }}
                  className={`p-2 rounded-lg hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ${activeObject.fontWeight === 'bold' ? 'bg-indigo-500/20' : ''}`}
                  title="Bold"
                >
                  <Bold size={15} />
                </button>
                <button
                  onClick={() => {
                    const nextStyle = activeObject.fontStyle === 'italic' ? 'normal' : 'italic';
                    activeObject.set('fontStyle', nextStyle);
                    canvas.renderAll();
                    canvas.fire('object:modified');
                  }}
                  className={`p-2 rounded-lg hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ${activeObject.fontStyle === 'italic' ? 'bg-indigo-500/20' : ''}`}
                  title="Italic"
                >
                  <Italic size={15} />
                </button>
              </div>
            )}

            {/* Image Filters group */}
            {isImageSelected && (
              <div className="relative">
                <button
                  onClick={() => { setShowFilterMenu(!showFilterMenu); setShowAlignMenu(false); setShowLayerMenu(false); }}
                  className="p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-indigo-500/10 hover:text-indigo-600 flex items-center gap-0.5 text-xs font-semibold"
                  title="Image Filters"
                >
                  Filters <ChevronDown size={12} />
                </button>
                {showFilterMenu && (
                  <div className="absolute top-10 left-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl shadow-xl z-50 flex flex-col gap-2 w-44">
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input 
                        type="checkbox" 
                        onChange={(e) => handleImageFilter('grayscale', e.target.checked)}
                        className="accent-indigo-600"
                      /> Grayscale
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input 
                        type="checkbox" 
                        onChange={(e) => handleImageFilter('sepia', e.target.checked)}
                        className="accent-indigo-600"
                      /> Sepia
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input 
                        type="checkbox" 
                        onChange={(e) => handleImageFilter('invert', e.target.checked)}
                        className="accent-indigo-600"
                      /> Invert
                    </label>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={deleteActiveObject}
              className="p-2 rounded-lg hover:bg-red-50 text-red-500 dark:text-red-400 ml-1"
              title="Delete Element"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ) : (
          <span className="text-xs text-zinc-400 dark:text-zinc-500 italic px-2">
            Select any canvas element to adjust parameters
          </span>
        )}
      </div>

      {/* 2. Detailed Parameter Editing Row (renders context-specific inputs) */}
      {activeObject && (
        <div className="flex flex-wrap items-center gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 px-3.5 py-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
          
          {/* Text-specific parameter slider fields */}
          {isTextSelected && (
            <div className="flex flex-wrap items-center gap-4 w-full">
              {/* Curve Slider */}
              <div className="flex items-center gap-2 flex-grow min-w-[150px]">
                <span className="text-[10px] font-bold text-zinc-400 uppercase w-12">Curve</span>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  defaultValue="0"
                  onChange={(e) => {
                    const curveVal = parseInt(e.target.value);
                    if (curveVal === 0) {
                      activeObject.set('path', null);
                    } else {
                      const textWidth = activeObject.width;
                      const bend = curveVal;
                      const path = new fabric.Path(`M 0,${bend > 0 ? 0 : -bend} Q ${textWidth / 2},${bend > 0 ? bend : 0} ${textWidth},${bend > 0 ? 0 : -bend}`, {
                        visible: false,
                        fill: null,
                        stroke: null,
                      });
                      activeObject.set('path', path);
                    }
                    canvas.renderAll();
                    canvas.fire('object:modified');
                  }}
                  className="w-full accent-indigo-600 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Letter Spacing */}
              <div className="flex items-center gap-2 flex-grow min-w-[150px]">
                <span className="text-[10px] font-bold text-zinc-400 uppercase w-12">Spacing</span>
                <input
                  type="range"
                  min="-100"
                  max="500"
                  value={activeObject.charSpacing || 0}
                  onChange={(e) => {
                    activeObject.set('charSpacing', parseInt(e.target.value));
                    canvas.renderAll();
                    canvas.fire('object:modified');
                  }}
                  className="w-full accent-indigo-600 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Line Height */}
              <div className="flex items-center gap-2 flex-grow min-w-[150px]">
                <span className="text-[10px] font-bold text-zinc-400 uppercase w-16">Line Height</span>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.05"
                  value={activeObject.lineHeight || 1.15}
                  onChange={(e) => {
                    activeObject.set('lineHeight', parseFloat(e.target.value));
                    canvas.renderAll();
                    canvas.fire('object:modified');
                  }}
                  className="w-full accent-indigo-600 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Text Shadow */}
              <div className="flex items-center gap-2 flex-grow min-w-[120px]">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Shadow</span>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    activeObject.set('shadow', e.target.checked ? new fabric.Shadow({
                      color: 'rgba(0,0,0,0.3)',
                      blur: 8,
                      offsetX: 4,
                      offsetY: 4
                    }) : null);
                    canvas.renderAll();
                    canvas.fire('object:modified');
                  }}
                  className="accent-indigo-600"
                />
              </div>
            </div>
          )}

          {/* Image-specific parameter slider fields */}
          {isImageSelected && (
            <div className="flex flex-wrap items-center gap-4 w-full">
              {/* Image Opacity */}
              <div className="flex items-center gap-2 flex-grow min-w-[200px]">
                <span className="text-[10px] font-bold text-zinc-400 uppercase w-12">Opacity</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={activeObject.opacity || 1}
                  onChange={(e) => {
                    activeObject.set('opacity', parseFloat(e.target.value));
                    canvas.renderAll();
                    canvas.fire('object:modified');
                  }}
                  className="w-full accent-indigo-600 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Image Blend Modes */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Blend Mode</span>
                <select
                  value={activeObject.globalCompositeOperation || 'source-over'}
                  onChange={(e) => {
                    activeObject.set('globalCompositeOperation', e.target.value);
                    canvas.renderAll();
                    canvas.fire('object:modified');
                  }}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-1.5 text-xs bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="source-over">Normal</option>
                  <option value="multiply">Multiply</option>
                  <option value="screen">Screen</option>
                  <option value="overlay">Overlay</option>
                  <option value="darken">Darken</option>
                  <option value="lighten">Lighten</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DesignerToolbar;
