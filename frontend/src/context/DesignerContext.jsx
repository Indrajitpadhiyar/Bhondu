import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const DesignerContext = createContext();

export const useDesigner = () => useContext(DesignerContext);

export const DesignerProvider = ({ children, productId }) => {
  const [product, setProduct] = useState(null);
  const [template, setTemplate] = useState(null);
  const [activeView, setActiveView] = useState('front'); // front, back, left-sleeve, right-sleeve
  const [canvas, setCanvas] = useState(null);
  const [activeObject, setActiveObject] = useState(null);
  const [baseColor, setBaseColor] = useState('#ffffff');
  const [selectedSize, setSelectedSize] = useState('M');
  const [fonts, setFonts] = useState([]);
  const [cliparts, setCliparts] = useState([]);
  const [clipartCategories, setClipartCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [designId, setDesignId] = useState(null);
  const [designName, setDesignName] = useState('My Custom Jersey');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [printAreas, setPrintAreas] = useState([]);

  // Zoom and Pan States
  const [zoom, setZoom] = useState(1); // 1 = 100%
  const [isPanning, setIsPanning] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const clipboardRef = useRef(null);

  // History Stacks
  const [history, setHistory] = useState({}); // { [viewId]: { undo: [], redo: [] } }

  // Store the canvas serialized states per view
  const canvasStatesRef = useRef({}); // { [viewId]: jsonString }

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

  // Load product, template, fonts, cliparts
  useEffect(() => {
    const fetchDesignerData = async () => {
      try {
        // 1. Fetch Product details
        const prodRes = await axios.get(`${API_URL}/products/${productId}`, { withCredentials: true });
        const prod = prodRes.data.data.product;
        setProduct(prod);
        setBaseColor(prod.colors && prod.colors.length > 0 ? prod.colors[0] : '#ffffff');
        setEstimatedPrice(prod.price);

        // 2. Fetch Blank Templates
        const tempRes = await axios.get(`${API_URL}/templates/product/${productId}`);
        const templates = tempRes.data.data.templates;
        if (templates && templates.length > 0) {
          // Fetch complete template details (includes printAreas)
          const detailRes = await axios.get(`${API_URL}/templates/${templates[0]._id}`);
          const fullTemplate = detailRes.data.data.template;
          const loadedPrintAreas = detailRes.data.data.printAreas || [];

          setTemplate(fullTemplate);
          setPrintAreas(loadedPrintAreas);

          // Initialize canvasStatesRef with empty canvas JSONs
          fullTemplate.views.forEach(v => {
            canvasStatesRef.current[v.viewId] = JSON.stringify({ version: '5.3.0', objects: [] });
            setHistory(prev => ({
              ...prev,
              [v.viewId]: { undo: [], redo: [] }
            }));
          });
          setActiveView(fullTemplate.views[0].viewId);
        }

        // 3. Fetch Fonts
        const fontRes = await axios.get(`${API_URL}/fonts`);
        setFonts(fontRes.data.data.fonts || []);

        // 4. Fetch Clipart & Categories
        const clipRes = await axios.get(`${API_URL}/graphics`);
        setCliparts(clipRes.data.data.graphics || []);
        
        const catRes = await axios.get(`${API_URL}/graphics/categories`);
        setClipartCategories(catRes.data.data.categories || []);

      } catch (err) {
        console.error('Error fetching designer data:', err);
        toast.error('Failed to load apparel designer assets.');
      }
    };

    fetchDesignerData();
  }, [productId]);

  // Load Google Font helper
  const loadGoogleFont = (fontFamily) => {
    if (!fontFamily) return;
    const id = `gfont-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;700&display=swap`;
    document.head.appendChild(link);
  };

  // Save Canvas State to JSON ref before switching view
  const saveCurrentViewState = () => {
    if (canvas) {
      canvasStatesRef.current[activeView] = JSON.stringify(canvas.toJSON());
    }
  };

  // Load state when switching view
  const loadViewState = (viewId) => {
    if (!canvas) return;
    const state = canvasStatesRef.current[viewId];
    if (state) {
      canvas.loadFromJSON(state, () => {
        canvas.renderAll();
        // Recalculate estimated price
        calculatePrice();
      });
    } else {
      canvas.clear();
      canvas.renderAll();
    }
  };

  const switchView = (viewId) => {
    if (viewId === activeView) return;
    saveCurrentViewState();
    setActiveView(viewId);
  };

  // Recalculate price based on objects on canvas
  const calculatePrice = () => {
    if (!product) return;
    let base = product.salePrice || product.price;
    let customizationCost = 0;

    // Count custom objects across all view states
    let totalCustomObjects = 0;
    
    // Save current active state before calculating
    if (canvas) {
      canvasStatesRef.current[activeView] = JSON.stringify(canvas.toJSON());
    }

    Object.keys(canvasStatesRef.current).forEach(vid => {
      try {
        const state = JSON.parse(canvasStatesRef.current[vid]);
        if (state && state.objects) {
          totalCustomObjects += state.objects.length;
          // Charge ₹50 per view that has custom print elements
          if (state.objects.length > 0) {
            customizationCost += 50; 
          }
        }
      } catch (e) {
        console.error(e);
      }
    });

    // Charge ₹30 per individual canvas object (text, image, graphic)
    customizationCost += totalCustomObjects * 30;

    setEstimatedPrice(base + customizationCost);
  };

  // History tracking
  const pushToHistory = (json) => {
    setHistory(prev => {
      const viewHistory = prev[activeView] || { undo: [], redo: [] };
      // Limit undo stack to 30 items
      const newUndo = [...viewHistory.undo, json].slice(-30);
      return {
        ...prev,
        [activeView]: {
          undo: newUndo,
          redo: [], // clear redo on new action
        }
      };
    });
  };

  const undo = () => {
    const viewHistory = history[activeView];
    if (!viewHistory || viewHistory.undo.length === 0 || !canvas) return;

    const currentJSON = JSON.stringify(canvas.toJSON());
    const previousJSON = viewHistory.undo[viewHistory.undo.length - 1];
    const newUndo = viewHistory.undo.slice(0, -1);
    const newRedo = [currentJSON, ...viewHistory.redo];

    setHistory(prev => ({
      ...prev,
      [activeView]: { undo: newUndo, redo: newRedo }
    }));

    canvas.loadFromJSON(previousJSON, () => {
      canvas.renderAll();
      canvasStatesRef.current[activeView] = previousJSON;
      calculatePrice();
    });
  };

  const redo = () => {
    const viewHistory = history[activeView];
    if (!viewHistory || viewHistory.redo.length === 0 || !canvas) return;

    const currentJSON = JSON.stringify(canvas.toJSON());
    const nextJSON = viewHistory.redo[0];
    const newUndo = [...viewHistory.undo, currentJSON];
    const newRedo = viewHistory.redo.slice(1);

    setHistory(prev => ({
      ...prev,
      [activeView]: { undo: newUndo, redo: newRedo }
    }));

    canvas.loadFromJSON(nextJSON, () => {
      canvas.renderAll();
      canvasStatesRef.current[activeView] = nextJSON;
      calculatePrice();
    });
  };

  // API Call: Save design to MongoDB
  const saveDesignToDatabase = async () => {
    saveCurrentViewState();
    setIsSaving(true);

    // Prepare views payload
    const payloadViews = Object.keys(canvasStatesRef.current).map(vid => {
      // Find thumbnail or generate blank mockup fallback
      const stateObj = JSON.parse(canvasStatesRef.current[vid]);
      // Optimize state to avoid storing large image buffers inside JSON (extract them if needed)
      
      // Generate a canvas thumbnail URL if we have canvas reference
      let viewThumbnail = '';
      if (vid === activeView && canvas) {
        // Optimistic client-side render thumbnail
        viewThumbnail = canvas.toDataURL({ format: 'png', quality: 0.8 });
      }

      return {
        viewId: vid,
        canvasJSON: canvasStatesRef.current[vid],
        thumbnailUrl: viewThumbnail || template?.views.find(v => v.viewId === vid)?.mockupImageUrl || '',
      };
    });

    try {
      const payload = {
        productId,
        templateId: template?._id,
        name: designName,
        selectedColor: baseColor,
        selectedSize,
        views: payloadViews,
        estimatedPrice,
      };

      let res;
      if (designId) {
        // Update existing design
        res = await axios.patch(`${API_URL}/designs/${designId}`, payload, { withCredentials: true });
        toast.success('Design updated successfully!');
      } else {
        // Create new design
        res = await axios.post(`${API_URL}/designs`, payload, { withCredentials: true });
        setDesignId(res.data.data.design._id);
        toast.success('Design saved to drafts!');
      }
      setIsSaving(false);
      return res.data.data.design;
    } catch (err) {
      console.error('Error saving design:', err);
      toast.error(err.response?.data?.message || 'Failed to save design.');
      setIsSaving(false);
      return null;
    }
  };

  // Clipboard Operations
  const copyActiveObject = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    active.clone((cloned) => {
      clipboardRef.current = cloned;
      toast.success('Element copied!');
    });
  };

  const pasteObject = () => {
    if (!canvas || !clipboardRef.current) return;
    clipboardRef.current.clone((clonedObj) => {
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 20,
        top: clonedObj.top + 20,
        evented: true,
      });
      if (clonedObj.type === 'activeSelection') {
        clonedObj.canvas = canvas;
        clonedObj.forEachObject((obj) => {
          canvas.add(obj);
        });
        clonedObj.setCoords();
      } else {
        canvas.add(clonedObj);
      }
      clipboardRef.current.top += 20;
      clipboardRef.current.left += 20;
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
      calculatePrice();
      canvas.fire('object:modified');
    });
  };

  const duplicateActiveObject = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    active.clone((clonedObj) => {
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 20,
        top: clonedObj.top + 20,
        evented: true,
      });
      canvas.add(clonedObj);
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
      calculatePrice();
      canvas.fire('object:modified');
    });
  };

  const deleteActiveObject = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    if (active.type === 'activeSelection') {
      active.forEachObject((obj) => {
        canvas.remove(obj);
      });
      canvas.discardActiveObject();
    } else {
      canvas.remove(active);
      canvas.discardActiveObject();
    }
    canvas.requestRenderAll();
    calculatePrice();
    canvas.fire('object:modified');
  };

  return (
    <DesignerContext.Provider
      value={{
        product,
        template,
        activeView,
        switchView,
        canvas,
        setCanvas,
        activeObject,
        setActiveObject,
        baseColor,
        setBaseColor,
        selectedSize,
        setSelectedSize,
        fonts,
        cliparts,
        clipartCategories,
        isSaving,
        designId,
        designName,
        setDesignName,
        estimatedPrice,
        calculatePrice,
        undo,
        redo,
        hasUndo: (history[activeView]?.undo?.length || 0) > 0,
        hasRedo: (history[activeView]?.redo?.length || 0) > 0,
        pushToHistory,
        saveDesignToDatabase,
        loadGoogleFont,
        loadViewState,
        canvasStatesRef,
        printAreas,
        zoom,
        setZoom,
        isPanning,
        setIsPanning,
        snapToGrid,
        setSnapToGrid,
        copyActiveObject,
        pasteObject,
        duplicateActiveObject,
        deleteActiveObject,
        isPreviewMode,
        setIsPreviewMode,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
};
