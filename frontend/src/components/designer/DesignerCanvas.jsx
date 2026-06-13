import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useDesigner } from '../../context/DesignerContext';

// Symmetrical crew-neck T-shirt outline paths (centered inside 600x600 canvas)
const FRONT_GARMENT_PATH = "M 300,74 C 278,74 256,79 240,88 C 220,100 170,128 170,128 L 84,204 L 122,260 L 178,222 L 180,518 C 180,518 300,523 420,518 L 422,222 L 478,260 L 516,204 L 430,128 C 430,128 380,100 360,88 C 344,79 322,74 300,74 Z";
const BACK_GARMENT_PATH = "M 300,82 C 278,82 256,85 240,90 C 220,100 170,128 170,128 L 84,204 L 122,260 L 178,222 L 180,518 C 180,518 300,523 420,518 L 422,222 L 478,260 L 516,204 L 430,128 C 430,128 380,100 360,90 C 344,85 322,82 300,82 Z";

const DesignerCanvas = () => {
  const {
    canvas,
    setCanvas,
    activeView,
    template,
    product,
    baseColor,
    setActiveObject,
    pushToHistory,
    calculatePrice,
    loadViewState,
    printAreas,
    zoom,
    isPanning,
    snapToGrid,
    isPreviewMode,
  } = useDesigner();

  const canvasContainerRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  // Pan offsets
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Reset panOffset on active view change
  useEffect(() => {
    setPanOffset({ x: 0, y: 0 });
  }, [activeView]);

  // Find active view mockup configurations
  const currentViewConfig = template?.views?.find((v) => v.viewId === activeView) || {
    mockupImageUrl: product?.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
    width: 600,
    height: 600,
  };

  // Find print area for active view
  const dbPrintArea = printAreas?.find((p) => p.viewId === activeView);
  const printArea = {
    x: dbPrintArea ? dbPrintArea.x : 185,
    y: dbPrintArea ? dbPrintArea.y : 110,
    width: dbPrintArea ? dbPrintArea.width : 230,
    height: dbPrintArea ? dbPrintArea.height : 380,
  };

  const isFullGarmentView = activeView === 'front' || activeView === 'back';
  
  // Set canvas dimensions based on view (full garment vs small print box)
  const canvasWidth = isFullGarmentView ? 600 : printArea.width;
  const canvasHeight = isFullGarmentView ? 600 : printArea.height;

  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    // Initialize Fabric Canvas
    const fCanvas = new fabric.Canvas(fabricCanvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      preserveObjectStacking: true,
      backgroundColor: 'rgba(0,0,0,0)', // transparent so backdrop garment shows through
    });

    // Generate and apply clipping mask for front/back garment outlines
    if (isFullGarmentView) {
      const pathString = activeView === 'front' ? FRONT_GARMENT_PATH : BACK_GARMENT_PATH;
      const maskPath = new fabric.Path(pathString, {
        fill: 'transparent',
        strokeWidth: 0,
        selectable: false,
        evented: false,
      });
      maskPath.absolutePositioned = true;
      fCanvas.clipPath = maskPath;
    }

    setCanvas(fCanvas);

    // Track Canvas mutations for history and pricing
    const handleCanvasModified = () => {
      const state = JSON.stringify(fCanvas.toJSON());
      pushToHistory(state);
      calculatePrice();
    };

    // Track selection changes
    const handleSelectionCreated = (e) => {
      setActiveObject(e.selected[0]);
    };

    const handleSelectionUpdated = (e) => {
      setActiveObject(e.selected[0]);
    };

    const handleSelectionCleared = () => {
      setActiveObject(null);
    };

    fCanvas.on('object:added', handleCanvasModified);
    fCanvas.on('object:modified', handleCanvasModified);
    fCanvas.on('object:removed', handleCanvasModified);
    fCanvas.on('selection:created', handleSelectionCreated);
    fCanvas.on('selection:updated', handleSelectionUpdated);
    fCanvas.on('selection:cleared', handleSelectionCleared);

    // Smart Snapping guidelines logic
    fCanvas.on('object:moving', (options) => {
      if (!snapToGrid) return;
      const obj = options.target;
      if (!obj) return;
      const snapThreshold = 10;
      
      // Horizontal Center Snap
      const canvasCenterX = canvasWidth / 2;
      const objCenterX = obj.left + (obj.width * obj.scaleX) / 2;
      if (Math.abs(objCenterX - canvasCenterX) < snapThreshold) {
        obj.set({ left: canvasCenterX - (obj.width * obj.scaleX) / 2 });
      }

      // Vertical Center Snap
      const canvasCenterY = canvasHeight / 2;
      const objCenterY = obj.top + (obj.height * obj.scaleY) / 2;
      if (Math.abs(objCenterY - canvasCenterY) < snapThreshold) {
        obj.set({ top: canvasCenterY - (obj.height * obj.scaleY) / 2 });
      }
    });

    // Initial load of view state if any exists
    const existingState = fCanvas.toJSON();
    pushToHistory(JSON.stringify(existingState));

    return () => {
      fCanvas.off('object:added', handleCanvasModified);
      fCanvas.off('object:modified', handleCanvasModified);
      fCanvas.off('object:removed', handleCanvasModified);
      fCanvas.off('selection:created', handleSelectionCreated);
      fCanvas.off('selection:updated', handleSelectionUpdated);
      fCanvas.off('selection:cleared', handleSelectionCleared);
      fCanvas.dispose();
      setCanvas(null);
    };
  }, [activeView, setCanvas, canvasWidth, canvasHeight, snapToGrid]);

  // Load view state whenever canvas or view changes
  useEffect(() => {
    if (canvas) {
      loadViewState(activeView);
    }
  }, [activeView, canvas]);

  // Disable object controls when panning or preview is active
  useEffect(() => {
    if (!canvas) return;
    if (isPreviewMode) {
      canvas.discardActiveObject();
      canvas.forEachObject((obj) => {
        obj.selectable = false;
        obj.evented = false;
        obj.hasControls = false;
      });
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'default';
      canvas.requestRenderAll();
    } else {
      canvas.forEachObject((obj) => {
        const locked = obj.lockMovementX;
        obj.selectable = !isPanning && !locked;
        obj.evented = !isPanning && !locked;
        obj.hasControls = !locked;
      });
      canvas.defaultCursor = isPanning ? 'grab' : 'default';
      canvas.hoverCursor = isPanning ? 'grab' : 'move';
      canvas.requestRenderAll();
    }
  }, [canvas, isPanning, isPreviewMode]);

  // Handle Drag-Panning on the Container
  const handleContainerMouseDown = (e) => {
    if (!isPanning) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPanX = panOffset.x;
    const startPanY = panOffset.y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setPanOffset({ x: startPanX + dx, y: startPanY + dy });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const baseImgStyle = {
    backgroundColor: 'transparent',
    width: '600px',
    height: '600px',
    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
    transformOrigin: 'center center',
    transition: isPanning ? 'none' : 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  return (
    <div 
      className={`relative flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-inner overflow-hidden p-6 w-full max-w-[650px] aspect-square mx-auto ${
        isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
      onMouseDown={handleContainerMouseDown}
    >
      {/* Container holding mockup backdrop + fabric canvas overlay */}
      <div 
        ref={canvasContainerRef}
        className="relative shadow-xl rounded-2xl overflow-hidden transition-all duration-300 select-none"
        style={baseImgStyle}
      >
        {/* Render Vector Plain T-shirt backdrop instead of the image mockup */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10 select-none">
          {activeView === 'front' && (
            <svg viewBox="0 0 600 600" className="w-full h-full">
              {/* Inner Neck Shadow */}
              <path d="M 240,88 C 240,88 270,120 300,120 C 330,120 360,88 360,88 C 360,88 330,96 300,96 C 270,96 240,88 240,88 Z" fill="#e4e4e7" stroke="#3f3f46" strokeWidth="1.5" />
              
              {/* T-Shirt Main Body Filled with baseColor */}
              <path d="M 300,74 C 278,74 256,79 240,88 C 220,100 170,128 170,128 L 84,204 L 122,260 L 178,222 L 180,518 C 180,518 300,523 420,518 L 422,222 L 478,260 L 516,204 L 430,128 C 430,128 380,100 360,88 C 344,79 322,74 300,74 Z" fill={baseColor} stroke="#18181b" strokeWidth="2" />
              
              {/* Collar Ribbing Overlay */}
              <path d="M 240,88 C 255,100 275,106 300,106 C 325,106 345,100 360,88 C 344,79 322,74 300,74 C 278,74 256,79 240,88 Z" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />
              
              {/* Shoulder & Sleeve Stitch Lines */}
              <path d="M 240,88 L 170,128" stroke="#3f3f46" strokeWidth="1" strokeDasharray="3,3" />
              <path d="M 360,88 L 430,128" stroke="#3f3f46" strokeWidth="1" strokeDasharray="3,3" />
              <path d="M 170,128 L 180,220" stroke="#3f3f46" strokeWidth="1.5" />
              <path d="M 430,128 L 420,220" stroke="#3f3f46" strokeWidth="1.5" />
              
              {/* Sleeve Hems Stitching */}
              <path d="M 94,213 L 132,248" stroke="#3f3f46" strokeWidth="1" strokeDasharray="2,2" />
              <path d="M 506,213 L 468,248" stroke="#3f3f46" strokeWidth="1" strokeDasharray="2,2" />
              
              {/* Bottom Hem Stitching */}
              <path d="M 180,505 C 300,510 300,510 420,505" stroke="#3f3f46" strokeWidth="1" strokeDasharray="2,2" />
              <path d="M 180,509 C 300,514 300,514 420,509" stroke="#3f3f46" strokeWidth="1" strokeDasharray="2,2" />
            </svg>
          )}

          {activeView === 'back' && (
            <svg viewBox="0 0 600 600" className="w-full h-full">
              {/* T-Shirt Main Body Filled with baseColor */}
              <path d="M 300,82 C 278,82 256,85 240,90 C 220,100 170,128 170,128 L 84,204 L 122,260 L 178,222 L 180,518 C 180,518 300,523 420,518 L 422,222 L 478,260 L 516,204 L 430,128 C 430,128 380,100 360,90 C 344,85 322,82 300,82 Z" fill={baseColor} stroke="#18181b" strokeWidth="2" />
              
              {/* Collar Ribbing (Rear View) */}
              <path d="M 240,90 C 255,83 275,80 300,80 C 325,80 345,83 360,90 C 344,85 322,82 300,82 C 278,82 256,85 240,90 Z" fill="#e4e4e7" stroke="#18181b" strokeWidth="1.5" />
              
              {/* Stitching lines */}
              <path d="M 240,90 L 170,128" stroke="#3f3f46" strokeWidth="1" strokeDasharray="3,3" />
              <path d="M 360,90 L 430,128" stroke="#3f3f46" strokeWidth="1" strokeDasharray="3,3" />
              <path d="M 170,128 L 180,220" stroke="#3f3f46" strokeWidth="1.5" />
              <path d="M 430,128 L 420,220" stroke="#3f3f46" strokeWidth="1.5" />
              
              {/* Sleeve Hems Stitching */}
              <path d="M 94,213 L 132,248" stroke="#3f3f46" strokeWidth="1" strokeDasharray="2,2" />
              <path d="M 506,213 L 468,248" stroke="#3f3f46" strokeWidth="1" strokeDasharray="2,2" />
              
              {/* Bottom Hem Stitching */}
              <path d="M 180,505 C 300,510 300,510 420,505" stroke="#3f3f46" strokeWidth="1" strokeDasharray="2,2" />
              <path d="M 180,509 C 300,514 300,514 420,509" stroke="#3f3f46" strokeWidth="1" strokeDasharray="2,2" />
            </svg>
          )}

          {(activeView === 'left-sleeve' || activeView === 'right-sleeve') && (
            <svg viewBox="0 0 600 600" className="w-full h-full">
              {/* Sleeve Panel */}
              <path d="M 150,150 C 250,120 350,120 450,150 L 530,350 L 70,350 Z" fill={baseColor} stroke="#18181b" strokeWidth="2" />
              {/* Sleeve Cuff stitching */}
              <path d="M 70,335 L 530,335" stroke="#3f3f46" strokeWidth="1.2" strokeDasharray="3,3" />
              <path d="M 70,339 L 530,339" stroke="#3f3f46" strokeWidth="1.2" strokeDasharray="3,3" />
            </svg>
          )}

          {activeView === 'collar' && (
            <svg viewBox="0 0 600 600" className="w-full h-full">
              {/* Collar shape at top */}
              <path d="M 100,50 C 200,150 400,150 500,50 L 550,50 C 550,50 400,200 300,200 C 200,200 50,50 50,50 Z" fill="#e4e4e7" stroke="#18181b" strokeWidth="2" />
              {/* Collar ribbing pattern lines */}
              <path d="M 100,50 Q 300,180 500,50" stroke="#a1a1aa" strokeWidth="1.5" fill="none" strokeDasharray="3,3" />
              
              {/* Back neck inner fabric area */}
              <path d="M 50,50 Q 300,200 550,50 L 550,600 L 50,600 Z" fill={baseColor} stroke="#18181b" strokeWidth="2" />

              {/* Stitching collar lines */}
              <path d="M 50,160 Q 300,310 550,160" stroke="#3f3f46" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
            </svg>
          )}
        </div>

        {/* Dash border print-area guide: render for all views when editing */}
        {!isPreviewMode && (
          <div
            className="absolute border border-dashed border-zinc-400 pointer-events-none z-20"
            style={{
              left: `${printArea.x}px`,
              top: `${printArea.y}px`,
              width: `${printArea.width}px`,
              height: `${printArea.height}px`,
            }}
          />
        )}

        {/* Absolute Fabric Canvas element */}
        <div
          className="absolute z-20"
          style={{
            left: isFullGarmentView ? 0 : `${printArea.x}px`,
            top: isFullGarmentView ? 0 : `${printArea.y}px`,
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
          }}
        >
          <canvas ref={fabricCanvasRef} />
        </div>
      </div>
    </div>
  );
};

export default DesignerCanvas;
