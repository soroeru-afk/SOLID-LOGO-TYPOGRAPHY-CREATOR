/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { buildThreeJsScene } from './services/sceneBuilder';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, 
  Upload, 
  Image as ImageIcon, 
  Cpu, 
  Download, 
  RotateCcw,
  Undo2,
  CheckCircle2,
  Zap,
  Terminal,
  Grid,
  Maximize2,
  Trash2,
  AlignLeft, AlignCenter, AlignRight,
  BookmarkPlus, Contrast, X, Settings, Square
} from 'lucide-react';

type AppStatus = 'idle' | 'generating_scene' | 'error';

const FONTS = [
  { name: 'Dela Gothic One', value: '"Dela Gothic One", cursive' },
  { name: 'Train One', value: '"Train One", cursive' },
  { name: 'Reggae One', value: '"Reggae One", cursive' },
  { name: 'DotGothic16', value: '"DotGothic16", sans-serif' },
  { name: 'M PLUS 1p', value: '"M PLUS 1p", sans-serif' },
  { name: 'Noto Sans JP', value: '"Noto Sans JP", sans-serif' },
  { name: 'Noto Serif JP', value: '"Noto Serif JP", serif' },
  { name: 'Shippori Mincho', value: '"Shippori Mincho", serif' },
  { name: 'Hina Mincho', value: '"Hina Mincho", serif' },
  { name: 'Zen Old Mincho', value: '"Zen Old Mincho", serif' },
  { name: 'Zen Dots', value: '"Zen Dots", cursive' },
  { name: 'Rampart One', value: '"Rampart One", cursive' },
  { name: 'Kaisei Decol', value: '"Kaisei Decol", serif' },
  { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
];

const EFFECTS = [
  { id: 'solid_voxel', name: 'SOLID_VOXELS', prompt: '' },
  { id: 'wireframe_block', name: 'WIREFRAME_BLOCKS', prompt: '' },
  { id: 'dot_matrix', name: 'DOT_MATRIX', prompt: '' },
  { id: 'clean_flat', name: 'CLEAN_FLAT', prompt: '' }
];

const ORNAMENTS = [
  { id: 'none', name: 'なし' },
  { id: 'bauhaus_border', name: 'バウハウス枠' },
  { id: 'bauhaus_circle', name: 'バウハウス円' },
  { id: 'retro_wings', name: 'レトロウィング' },
  { id: 'horizontal_line', name: '水平線' }
];

const ResetBtn = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="opacity-50 hover:opacity-100 hover:text-emerald-400 p-1" title="Reset">
    <RotateCcw size={10} />
  </button>
);

function trimCanvas(canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas.toDataURL('image/png');
  
  const width = canvas.width;
  const height = canvas.height;
  const pixels = ctx.getImageData(0, 0, width, height);
  const l = pixels.data.length;
  let bound = {
    top: height,
    left: width,
    right: 0,
    bottom: 0
  };
  let x = 0, y = 0;
  
  // Find boundaries
  for (let i = 0; i < l; i += 4) {
    if (pixels.data[i + 3] > 0) { // alpha > 0
      x = (i / 4) % width;
      y = Math.floor((i / 4) / width);
      if (x < bound.left) bound.left = x;
      if (x > bound.right) bound.right = x;
      if (y < bound.top) bound.top = y;
      if (y > bound.bottom) bound.bottom = y;
    }
  }

  // If empty, return original
  if (bound.top >= bound.bottom || bound.left >= bound.right) {
    return canvas.toDataURL('image/png');
  }

  const padding = 40; // Safe padding
  bound.top = Math.max(0, bound.top - padding);
  bound.left = Math.max(0, bound.left - padding);
  bound.bottom = Math.min(height, bound.bottom + padding);
  bound.right = Math.min(width, bound.right + padding);

  const trimHeight = Math.max(1, bound.bottom - bound.top);
  const trimWidth = Math.max(1, bound.right - bound.left);

  const trimmed = document.createElement('canvas');
  trimmed.width = trimWidth;
  trimmed.height = trimHeight;
  const tCtx = trimmed.getContext('2d');
  if (tCtx) {
    try {
      tCtx.putImageData(ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight), 0, 0);
    } catch(e) {
      console.warn("trimCanvas putImageData failed", e);
    }
  }
  return trimmed.toDataURL('image/png');
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'mark' | 'style' | '3d'>('text');
  
  // MARK MAKER
  const [markPrompt, setMarkPrompt] = useState(() => localStorage.getItem('solid_typography_markPrompt') || '龍と幾何学模様');
  useEffect(() => {
    localStorage.setItem('solid_typography_markPrompt', markPrompt);
  }, [markPrompt]);

  const [generatingMarks, setGeneratingMarks] = useState(false);
  const [generatedMarks, setGeneratedMarks] = useState<string[]>([]);
  const [stockedMarks, setStockedMarks] = useState<string[]>([]);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
  const [customApiKey, setCustomApiKey] = useState('');
  const [showApiSettings, setShowApiSettings] = useState(false);

  const [attachedMark, setAttachedMark] = useState<string | null>(() => localStorage.getItem('solid_typography_attachedMark'));
  useEffect(() => {
    try {
      if (attachedMark === null) localStorage.removeItem('solid_typography_attachedMark');
      else localStorage.setItem('solid_typography_attachedMark', attachedMark);
    } catch(e) {
      console.warn("Storage quota exceeded for attachedMark");
      localStorage.removeItem('solid_typography_attachedMark');
    }
  }, [attachedMark]);

  const [attachedMarkScale, setAttachedMarkScale] = useState(() => {
    const s = localStorage.getItem('solid_typography_attachedMarkScale');
    return s ? parseFloat(s) : 1.0;
  });
  useEffect(() => localStorage.setItem('solid_typography_attachedMarkScale', attachedMarkScale.toString()), [attachedMarkScale]);

  const [attachedMarkOffsetX, setAttachedMarkOffsetX] = useState(() => {
    const s = localStorage.getItem('solid_typography_attachedMarkOffsetX');
    return s ? parseInt(s, 10) : 0;
  });
  useEffect(() => localStorage.setItem('solid_typography_attachedMarkOffsetX', attachedMarkOffsetX.toString()), [attachedMarkOffsetX]);

  const [attachedMarkOffsetY, setAttachedMarkOffsetY] = useState(() => {
    const s = localStorage.getItem('solid_typography_attachedMarkOffsetY');
    return s ? parseInt(s, 10) : -150;
  });
  useEffect(() => localStorage.setItem('solid_typography_attachedMarkOffsetY', attachedMarkOffsetY.toString()), [attachedMarkOffsetY]);

  const attachedMarkImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (attachedMark) {
        const img = new Image();
        img.onload = () => {
            attachedMarkImgRef.current = img;
            renderTextToImage();
        };
        img.onerror = () => {
            console.error("Failed to load attachedMark");
            attachedMarkImgRef.current = null;
            renderTextToImage();
        };
        img.src = attachedMark;
    } else {
        attachedMarkImgRef.current = null;
        renderTextToImage();
    }
  }, [attachedMark]);


  useEffect(() => {
    try {
      const storedMarks = localStorage.getItem('solid_typography_stocks');
      if (storedMarks) setStockedMarks(JSON.parse(storedMarks));
      const storedKey = localStorage.getItem('solid_typography_apikey');
      if (storedKey) setCustomApiKey(storedKey);
    } catch(e) {}
  }, []);

  const handleCustomApiKey = (val: string) => {
    setCustomApiKey(val);
    localStorage.setItem('solid_typography_apikey', val);
  };

  const toggleStockSelection = (idx: number) => {
    setSelectedStockId(prev => (prev === idx ? null : idx));
  };

  const handleSelectedRemove = () => {
    if (selectedStockId === null) return;
    handleStockRemove(selectedStockId);
    setSelectedStockId(null);
  };

  const handleSelectedDownload = (transparent: boolean) => {
    if (selectedStockId === null) return;
    downloadPng(stockedMarks[selectedStockId], transparent);
  };

  const handleSelectedInvert = () => {
    if (selectedStockId === null) return;
    handleInvert(stockedMarks[selectedStockId], undefined, selectedStockId);
  };

  const handleLocalImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const img = new Image();
        img.onload = () => {
          const MAX_SIZE = 1024;
          let w = img.width;
          let h = img.height;
          if (w > MAX_SIZE || h > MAX_SIZE) {
            const ratio = Math.min(MAX_SIZE / w, MAX_SIZE / h);
            w = w * ratio;
            h = h * ratio;
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          // fill white background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          handleStockAdd(canvas.toDataURL('image/png'));
        };
        img.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // reset
  };

  const handleStockAdd = (base64: string) => {
    const next = [base64, ...stockedMarks].slice(0, 50);
    setStockedMarks(next);
    
    const saveStocksSafe = (arr: string[]) => {
       try {
         localStorage.setItem('solid_typography_stocks', JSON.stringify(arr));
       } catch (e) {
         if (arr.length > 1) {
            saveStocksSafe(arr.slice(0, arr.length - 1));
         } else {
            localStorage.removeItem('solid_typography_stocks');
         }
       }
    };
    saveStocksSafe(next);
  };

  const handleStockRemove = (idx: number) => {
    const next = [...stockedMarks];
    next.splice(idx, 1);
    setStockedMarks(next);
    try {
      localStorage.setItem('solid_typography_stocks', JSON.stringify(next));
    } catch(e) {}
  };

  const handleInvert = (base64: string, applyToGeneratedIdx?: number, applyToStockIdx?: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if(!ctx) return;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0,0,canvas.width, canvas.height);
      for(let i=0; i<data.data.length; i+=4) {
        data.data[i] = 255 - data.data[i];
        data.data[i+1] = 255 - data.data[i+1];
        data.data[i+2] = 255 - data.data[i+2];
      }
      ctx.putImageData(data, 0, 0);
      const inverted = canvas.toDataURL('image/png');
      if (applyToGeneratedIdx !== undefined) {
         const next = [...generatedMarks];
         next[applyToGeneratedIdx] = inverted;
         setGeneratedMarks(next);
      } else if (applyToStockIdx !== undefined) {
         const next = [...stockedMarks];
         next[applyToStockIdx] = inverted;
         setStockedMarks(next);
         try {
           localStorage.setItem('solid_typography_stocks', JSON.stringify(next));
         } catch(e) {}
      }
    };
    img.src = base64;
  };

  const downloadPng = (base64: string, transparent: boolean) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Ensure white bg
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Extract mask with anti-aliasing
      for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          const luminance = 0.299*r + 0.587*g + 0.114*b;
          
          // Pure white background becomes fully transparent.
          // Dark lines become opaque black.
          // Gray anti-aliased edges become partially transparent black.
          const alpha = 255 - luminance;
          
          data[i] = 0;
          data[i+1] = 0;
          data[i+2] = 0;
          data[i+3] = alpha;
      }
      ctx.putImageData(imgData, 0, 0);
      
      const trimmedCanvas = document.createElement('canvas');
      const tempCtx = trimmedCanvas.getContext('2d');
      const tempImg = new Image();
      tempImg.onload = () => {
         trimmedCanvas.width = tempImg.width;
         trimmedCanvas.height = tempImg.height;
         const trimCtx = trimmedCanvas.getContext('2d');
         if (!trimCtx) return;
         if (!transparent) {
            trimCtx.fillStyle = '#FFFFFF';
            trimCtx.fillRect(0, 0, trimmedCanvas.width, trimmedCanvas.height);
         }
         trimCtx.drawImage(tempImg, 0, 0);
         
         const a = document.createElement('a');
         a.href = trimmedCanvas.toDataURL('image/png');
         a.download = transparent ? `mark_transparent_${Date.now()}.png` : `mark_solid_${Date.now()}.png`;
         a.click();
      };
      tempImg.src = trimCanvas(canvas);
    };
    img.src = base64;
  };

  // TEXT
  const [prompt, setPrompt] = useState(() => localStorage.getItem('solid_typography_prompt') || '漢字\nWATANABE');
  useEffect(() => {
    localStorage.setItem('solid_typography_prompt', prompt);
  }, [prompt]);

  const [fontMain, setFontMain] = useState(() => localStorage.getItem('solid_typography_fontMain') || FONTS[7].value);
  useEffect(() => localStorage.setItem('solid_typography_fontMain', fontMain), [fontMain]);

  const [sizeMain, setSizeMain] = useState(() => {
    const s = localStorage.getItem('solid_typography_sizeMain');
    return s ? parseInt(s, 10) : 160;
  });
  useEffect(() => localStorage.setItem('solid_typography_sizeMain', sizeMain.toString()), [sizeMain]);

  const [subPrompt, setSubPrompt] = useState(() => localStorage.getItem('solid_typography_subPrompt') || 'BAUHAUS TYPOGRAPHY');
  useEffect(() => {
    localStorage.setItem('solid_typography_subPrompt', subPrompt);
  }, [subPrompt]);

  const [fontSub, setFontSub] = useState(() => localStorage.getItem('solid_typography_fontSub') || FONTS[1].value);
  useEffect(() => localStorage.setItem('solid_typography_fontSub', fontSub), [fontSub]);

  const [sizeSub, setSizeSub] = useState(() => {
    const s = localStorage.getItem('solid_typography_sizeSub');
    return s ? parseInt(s, 10) : 30;
  });
  useEffect(() => localStorage.setItem('solid_typography_sizeSub', sizeSub.toString()), [sizeSub]);

  const [subOffsetX, setSubOffsetX] = useState(0);
  const [subOffsetY, setSubOffsetY] = useState(-60);
  
  const [textAlign, setTextAlign] = useState<'left'|'center'|'right'>('center');
  const [letterSpacing, setLetterSpacing] = useState(5);
  const [lineHeight, setLineHeight] = useState(1.2);
  
  // DESIGN
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const [colorFace, setColorFace] = useState(() => localStorage.getItem('solid_typography_colorFace') || '#F0E6D2');
  useEffect(() => localStorage.setItem('solid_typography_colorFace', colorFace), [colorFace]);

  const [colorSide, setColorSide] = useState(() => localStorage.getItem('solid_typography_colorSide') || '#808080');
  useEffect(() => localStorage.setItem('solid_typography_colorSide', colorSide), [colorSide]);

  const [bgColor, setBgColor] = useState(() => localStorage.getItem('solid_typography_bgColor') || '#1A1A1A');
  useEffect(() => localStorage.setItem('solid_typography_bgColor', bgColor), [bgColor]);
  const [ornaments, setOrnaments] = useState<{ type: string, offsetX: number, offsetY: number, scale: number, width: number, thickness: number, dash: number }[]>(() => {
    try {
      const saved = localStorage.getItem('solid_typography_ornaments');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { type: 'retro_wings', offsetX: 0, offsetY: -238, scale: 1.0, width: 0.8, thickness: 15, dash: 0 },
      { type: 'horizontal_line', offsetX: 0, offsetY: 90, scale: 1.0, width: 2.2, thickness: 5, dash: 0 }
    ];
  });
  useEffect(() => {
    try {
      localStorage.setItem('solid_typography_ornaments', JSON.stringify(ornaments));
    } catch (e) {}
  }, [ornaments]);

  const [imageData, setImageData] = useState<string | null>(null);
  const [sceneCode, setSceneCode] = useState<string | null>(null);
  
  // Settings
  const [resolution, setResolution] = useState(256);
  const [thickness, setThickness] = useState(16.6);
  const [autoRotate, setAutoRotate] = useState(false);
  const [lighting, setLighting] = useState(2.0);
  const [effectStyle, setEffectStyle] = useState(EFFECTS[0].id);
  const [uiTheme, setUiTheme] = useState('DARK');
  
  // UI State
  const [status, setStatus] = useState<AppStatus>('idle');
  const [viewMode, setViewMode] = useState<'image' | 'scene'>('image');
  const [errorMsg, setErrorMsg] = useState('');
  const [thinkingText, setThinkingText] = useState<string | null>(null);
  const [history, setHistory] = useState<{id: string, image: string, code: string | null, title: string, settings?: any}[]>(() => {
    try {
      const saved = localStorage.getItem('solid_typography_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  useEffect(() => {
    const saveHistorySafe = (histArr: typeof history) => {
      try {
        localStorage.setItem('solid_typography_history', JSON.stringify(histArr));
      } catch (e) {
        if (histArr.length > 1) {
          saveHistorySafe(histArr.slice(0, histArr.length - 1));
        } else {
          localStorage.removeItem('solid_typography_history');
        }
      }
    };
    saveHistorySafe(history);
  }, [history]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const aiGenerationIdRef = useRef(0);

  // 2D View Controls
  const [imagePan, setImagePan] = useState({ x: 0, y: 0 });
  const [imageZoom, setImageZoom] = useState(0.95);
  const [previewBgMode, setPreviewBgMode] = useState<'transparent' | 'solid'>('transparent');
  const isDraggingImage = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== 'image') return;
    setImageZoom(prev => Math.max(0.1, Math.min(5.0, prev - e.deltaY * 0.001)));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (viewMode === 'image' && e.button === 2) {
      isDraggingImage.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (viewMode === 'image' && isDraggingImage.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setImagePan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingImage.current) {
      isDraggingImage.current = false;
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (viewMode === 'image') {
      e.preventDefault();
    }
  };

  const getCurrentSettings = () => ({
    prompt, fontMain, sizeMain,
    subPrompt, fontSub, sizeSub,
    subOffsetX, subOffsetY,
    textAlign, letterSpacing, lineHeight,
    skewX, skewY, colorFace, colorSide, bgColor,
    ornaments, resolution, thickness, autoRotate, lighting, effectStyle,
    attachedMark, attachedMarkScale, attachedMarkOffsetX, attachedMarkOffsetY
  });

  const exportSettings = () => {
    const settings = getCurrentSettings();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings));
    const exportFileDefaultName = 'typography_settings.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataStr);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const settings = JSON.parse(e.target?.result as string);
            if (settings.prompt !== undefined) setPrompt(settings.prompt);
            if (settings.fontMain !== undefined) setFontMain(settings.fontMain);
            if (settings.sizeMain !== undefined) setSizeMain(settings.sizeMain);
            if (settings.subPrompt !== undefined) setSubPrompt(settings.subPrompt);
            if (settings.fontSub !== undefined) setFontSub(settings.fontSub);
            if (settings.sizeSub !== undefined) setSizeSub(settings.sizeSub);
            if (settings.subOffsetX !== undefined) setSubOffsetX(settings.subOffsetX);
            if (settings.subOffsetY !== undefined) setSubOffsetY(settings.subOffsetY);
            if (settings.textAlign !== undefined) setTextAlign(settings.textAlign);
            if (settings.letterSpacing !== undefined) setLetterSpacing(settings.letterSpacing);
            if (settings.lineHeight !== undefined) setLineHeight(settings.lineHeight);
            if (settings.skewX !== undefined) setSkewX(settings.skewX);
            if (settings.skewY !== undefined) setSkewY(settings.skewY);
            if (settings.colorFace !== undefined) setColorFace(settings.colorFace);
            if (settings.colorSide !== undefined) setColorSide(settings.colorSide);
            if (settings.bgColor !== undefined) setBgColor(settings.bgColor);
            if (settings.ornaments !== undefined) setOrnaments(settings.ornaments);
            if (settings.resolution !== undefined) setResolution(settings.resolution);
            if (settings.thickness !== undefined) setThickness(settings.thickness);
            if (settings.autoRotate !== undefined) setAutoRotate(settings.autoRotate);
            if (settings.lighting !== undefined) setLighting(settings.lighting);
            if (settings.effectStyle !== undefined) setEffectStyle(settings.effectStyle);
            if (settings.attachedMark !== undefined) setAttachedMark(settings.attachedMark);
            if (settings.attachedMarkScale !== undefined) setAttachedMarkScale(settings.attachedMarkScale);
            if (settings.attachedMarkOffsetX !== undefined) setAttachedMarkOffsetX(settings.attachedMarkOffsetX);
            if (settings.attachedMarkOffsetY !== undefined) setAttachedMarkOffsetY(settings.attachedMarkOffsetY);
        } catch (err) {
            console.error("Invalid settings file");
            alert("Invalid settings file");
        }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const resetAll = () => {
    setPrompt("漢字\nWATANABE");
    setFontMain(FONTS[7].value);
    setSizeMain(160);
    setSubPrompt("BAUHAUS TYPOGRAPHY");
    setFontSub(FONTS[1].value);
    setSizeSub(30);
    setSubOffsetX(0);
    setSubOffsetY(-60);
    setTextAlign('center');
    setLetterSpacing(5);
    setLineHeight(1.2);
    setSkewX(0);
    setSkewY(0);
    setColorFace('#F0E6D2');
    setColorSide('#4A4742');
    setBgColor('#1A1A1A');
    setOrnaments([
      { type: 'retro_wings', offsetX: 0, offsetY: -238, scale: 1.0, width: 0.8, thickness: 15, dash: 0 },
      { type: 'horizontal_line', offsetX: 0, offsetY: 90, scale: 1.0, width: 2.2, thickness: 5, dash: 0 }
    ]);
    setResolution(256);
    setThickness(16.6);
    setLighting(2.0);
    setAutoRotate(false);
    setEffectStyle(EFFECTS[0].id);
  };

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', uiTheme);
  }, [uiTheme]);

  // Initial render when fonts load
  useEffect(() => {
    document.fonts.ready.then(() => {
      renderTextToImage();
    });
  }, []);

  // Auto-render text image when typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      renderTextToImage();
    }, 150);
    return () => clearTimeout(timer);
  }, [prompt, subPrompt, fontMain, sizeMain, fontSub, sizeSub, letterSpacing, lineHeight, textAlign, colorFace, subOffsetX, subOffsetY, skewX, skewY, JSON.stringify(ornaments), attachedMarkScale, attachedMarkOffsetX, attachedMarkOffsetY]);

  // Handle activeTab changes for text tab specifically
  useEffect(() => {
    if (activeTab === 'text') {
       if(!sceneCode) setViewMode('image');
       renderTextToImage();
    }
  }, [activeTab]);

  // Auto-rebuild the 3D scene when rendering parameters change
  useEffect(() => {
    if (viewMode === 'scene' && imageData) {
      if (iframeRef.current && iframeRef.current.contentWindow) {
         iframeRef.current.style.opacity = '0.5';
      }
      setTimeout(() => {
        try {
          const code = buildThreeJsScene(imageData, effectStyle, resolution, lighting, autoRotate, colorFace, colorSide, bgColor, thickness);
          setSceneCode(code);
        } catch (e) {
          console.error(e);
        }
      }, 50);
    }
  }, [imageData, effectStyle, resolution, autoRotate, colorFace, colorSide, bgColor, thickness, viewMode]);

  // Dynamic Lighting Update
  useEffect(() => {
    if (viewMode === 'scene' && iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({
        type: 'UPDATE_LIGHT',
        value: lighting
      }, '*');
    }
  }, [lighting, viewMode]);

  const handleError = (err: any) => {
    setStatus('error');
    setErrorMsg(err.message || 'SYSTEM_FAILURE');
    console.error(err);
  };

  const processGeneratedMark = (base64Image: string) => {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Ensure white bg
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Extract mask with anti-aliasing
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2];
            const luminance = 0.299*r + 0.587*g + 0.114*b;
            const alpha = 255 - luminance;
            data[i] = 0;
            data[i+1] = 0;
            data[i+2] = 0;
            data[i+3] = alpha;
        }
        ctx.putImageData(imgData, 0, 0);
        
        const trimmed = trimCanvas(canvas);
        setAttachedMark(trimmed);
        setActiveTab('text');
    };
    img.src = base64Image;
  };

  const handleCancelAiGeneration = () => {
    aiGenerationIdRef.current += 1;
    setGeneratingMarks(false);
    setThinkingText(null);
  };

  const generateAiMarks = async () => {
    if (!markPrompt) return;
    
    aiGenerationIdRef.current += 1;
    const currentGenerationId = aiGenerationIdRef.current;
    
    setGeneratingMarks(true);
    setThinkingText('GENERATING MARKS VIA AI...');
    try {
      const { GoogleGenAI } = await import('@google/genai');
      // @ts-ignore
      const activeKey = customApiKey || process.env.GEMINI_API_KEY;
      if (!activeKey) {
        setShowApiSettings(true);
        throw new Error("APIキーが設定されていません。環境変数または設定から入力してください。");
      }
      const ai = new GoogleGenAI({ apiKey: activeKey });
      const prompt = `[モチーフ：${markPrompt}] をテーマにしたロゴマーク。白背景に、黒一色の塗りつぶし（Solid black silhouettes）。陰影やグラデーションは一切なし。ミニマルでフラットなデザイン。2Dのベクターロゴスタイル。`;
      
      const promises = Array.from({ length: 2 }).map(() => ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt
      }).catch(err => {
         console.warn("Generation error:", err);
         return null;
      }));

      const responses = await Promise.all(promises);
      
      if (aiGenerationIdRef.current !== currentGenerationId) return;

      const newMarks: string[] = [];
      responses.forEach(res => {
         if (!res) return;
         try {
           const parts = res.candidates?.[0]?.content?.parts;
           if (parts) {
             for (const part of parts) {
               if (part.inlineData && part.inlineData.data) {
                 newMarks.push(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
                 break;
               }
             }
           }
         } catch(e) {}
      });

      if (newMarks.length > 0) {
         setGeneratedMarks(prev => [...newMarks, ...prev].slice(0, 20));
      } else {
         throw new Error("画像の生成に失敗しました。時間をおいて再試行してください。");
      }
    } catch (err: any) {
       if (aiGenerationIdRef.current !== currentGenerationId) return;
       
       console.error("SDK Error details:", err);
       if (err.message && err.message.toLowerCase().includes('quota')) {
         handleError({ message: 'APIの無料利用枠の上限に達しました。[API設定]からご自身のGemini APIキーを設定するか、時間をおいて再試行してください。' });
       } else {
         handleError(err);
       }
    } finally {
      if (aiGenerationIdRef.current === currentGenerationId) {
        setGeneratingMarks(false);
        setThinkingText(null);
      }
    }
  };

  const renderTextToImage = () => {
    const canvas = hiddenCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const lines = prompt.split('\n');
    const subLines = subPrompt.split('\n').filter(l => l.trim() !== '');

    const actualLineHeight = sizeMain * lineHeight;
    const subLineHeight = sizeSub * 1.5;
    
    const mainHeight = actualLineHeight * lines.length;
    const subHeight = subLines.length > 0 ? (subLineHeight * subLines.length + Math.abs(subOffsetY)) : 0;
    
    const totalHeight = mainHeight + subHeight + Math.abs(subOffsetY);
    
    let maxOrnamentSize = 0;
    ornaments.forEach(o => {
        if (o.type !== 'none') {
            const w = 1000 * o.width * o.scale; // increased base multiplier
            const h = (totalHeight + 300) * o.scale;
            const dim = Math.max(w, h) + Math.max(Math.abs(o.offsetX), Math.abs(o.offsetY)) * 2;
            if (dim > maxOrnamentSize) maxOrnamentSize = dim;
        }
    });
    
    const padding = Math.max(800, maxOrnamentSize) + Math.abs(skewX)*20 + Math.abs(skewY)*20;
    
    // limit canvas dimension to 3000 to prevent crashing the browser tab, usually enough for heavy scale
    canvas.width = Math.min(3000, 1024 + padding * 2);
    canvas.height = Math.min(3000, 1024 + padding * 2);
    
    // Clear background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.transform(1, Math.tan(skewY * Math.PI/180), Math.tan(skewX * Math.PI/180), 1, 0, 0);

    // Ornaments
    ornaments.forEach(o => {
      if (o.type !== 'none') {
        ctx.save();
        ctx.translate(o.offsetX, o.offsetY);

        ctx.strokeStyle = colorFace;
        ctx.fillStyle = colorFace;
        ctx.lineWidth = o.thickness;
        
        if (o.dash > 0) {
          ctx.setLineDash([o.dash, o.dash]);
        } else {
          ctx.setLineDash([]);
        }
        
        const bbW = 500 * o.width * o.scale;
        const bbH = (totalHeight + 80) * o.scale;

        if (o.type === 'bauhaus_border') {
           ctx.strokeRect(-bbW/2, -bbH/2, bbW, bbH);
           ctx.fillRect(-bbW/2, -bbH/2 - 25, bbW, 25);
           ctx.fillRect(-bbW/2, bbH/2, bbW, 25);
        } 
        else if (o.type === 'horizontal_line') {
           ctx.beginPath();
           ctx.moveTo(-bbW/2, 0);
           ctx.lineTo(bbW/2, 0);
           ctx.stroke();
        }
        else if (o.type === 'bauhaus_circle') {
           const circleW = (Math.max(500, totalHeight + 80) + 100) * o.scale * o.width;
           const circleH = (Math.max(500, totalHeight + 80) + 100) * o.scale;
           
           ctx.beginPath();
           ctx.ellipse(0, 0, circleW/2, circleH/2, 0, 0, Math.PI * 2);
           ctx.stroke();
           
           ctx.beginPath();
           // protect against negative radius
           const rX = Math.max(1, circleW/2 - 30 * o.scale * o.width);
           const rY = Math.max(1, circleH/2 - 30 * o.scale);
           ctx.ellipse(0, 0, rX, rY, 0, 0, Math.PI * 2);
           ctx.lineWidth = Math.max(1, o.thickness / 3);
           ctx.stroke();
        }
        else if (o.type === 'retro_wings') {
           const drawWing = (dir: number) => {
             ctx.save();
             ctx.scale(dir * o.width * o.scale, o.scale);
             ctx.translate(250 + 20, 0); // 250 is half base width 500
             
             ctx.beginPath();
             ctx.moveTo(0, 40);
             ctx.bezierCurveTo(80, 40, 150, 10, 250, -90);
             ctx.bezierCurveTo(200, -40, 150, -10, 50, -10);
             ctx.fill();

             ctx.beginPath();
             ctx.moveTo(0, 70);
             ctx.bezierCurveTo(60, 70, 120, 40, 200, -30);
             ctx.bezierCurveTo(150, 10, 100, 20, 30, 30);
             ctx.fill();
             
             ctx.beginPath();
             ctx.moveTo(0, 100);
             ctx.bezierCurveTo(40, 100, 80, 70, 140, 10);
             ctx.bezierCurveTo(100, 60, 50, 70, 10, 70);
             ctx.fill();
             
             ctx.restore();
           };
           drawWing(1);
           drawWing(-1);
        }
        ctx.restore();
      }
    });

    ctx.textBaseline = 'middle';
    ctx.textAlign = textAlign;
    
    let mainStartY = -(totalHeight / 2) + actualLineHeight / 2;

    const getX = () => {
      if(textAlign === 'left') return -300;
      if(textAlign === 'right') return 300;
      return 0;
    }

    ctx.fillStyle = colorFace;
    ctx.font = `bold ${sizeMain}px ${fontMain}`;
    (ctx as any).letterSpacing = `${letterSpacing}px`;

    lines.forEach(line => {
      ctx.fillText(line, getX(), mainStartY);
      mainStartY += actualLineHeight;
    });

    if (subLines.length > 0) {
      let subStartY = mainStartY + subOffsetY;
      ctx.font = `bold ${sizeSub}px ${fontSub}`;
      (ctx as any).letterSpacing = `${letterSpacing * 0.5}px`;
      
      subLines.forEach(line => {
        ctx.fillText(line, getX() + subOffsetX, subStartY);
        subStartY += subLineHeight;
      });
    }

    if (attachedMarkImgRef.current) {
        ctx.save();
        ctx.translate(attachedMarkOffsetX, attachedMarkOffsetY);
        ctx.scale(attachedMarkScale, attachedMarkScale);
        ctx.drawImage(attachedMarkImgRef.current, -attachedMarkImgRef.current.width / 2, -attachedMarkImgRef.current.height / 2);
        ctx.restore();
    }

    // Colorize everything (text + ornaments + mark) to colorFace
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = colorFace;
    ctx.fillRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);
    ctx.globalCompositeOperation = 'source-over';

    ctx.restore();

    setImageData(trimCanvas(canvas));
    if(!sceneCode && activeTab === 'text') setViewMode('image');
  };

  const executeExport = (baseImageSrc: string, transparent: boolean, prefix: string) => {
    const img = new Image();
    img.onload = () => {
      // Add padding by creating a slightly larger canvas
      const padding = 100;
      const canvas = document.createElement('canvas');
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (!transparent) {
         ctx.fillStyle = bgColor; // Use user's selected background color
         ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, padding, padding);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      
      const now = new Date();
      const yyyy = now.getFullYear();
      const MM = String(now.getMonth() + 1).padStart(2, '0');
      const DD = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      const dateStr = `${yyyy}${MM}${DD}_${hh}${mm}${ss}`;

      a.download = `logo_${dateStr}_${prefix}_${transparent ? 'alpha' : 'solid'}.png`;
      a.click();
    };
    img.src = baseImageSrc;
  };

  const handleExport2D = async (transparent: boolean) => {
    if (viewMode === 'scene' && iframeRef.current?.contentWindow) {
      const dataUrl = await new Promise<string>(resolve => {
        let resolved = false;
        const handler = (e: MessageEvent) => {
          if (e.data.type === 'THUMBNAIL_DATA') {
            window.removeEventListener('message', handler);
            if (!resolved) {
              resolved = true;
              resolve(e.data.dataUrl);
            }
          }
        };
        window.addEventListener('message', handler);
        iframeRef.current?.contentWindow?.postMessage({ type: 'REQUEST_THUMBNAIL' }, '*');
        setTimeout(() => {
          window.removeEventListener('message', handler);
          if (!resolved) {
            resolved = true;
            resolve("");
          }
        }, 1000);
      });
      if (dataUrl) {
         executeExport(dataUrl, transparent, '3d');
         return;
      }
    }
    if (!imageData) return;
    executeExport(imageData, transparent, '2d');
  };

  const getThumbnail = (base64: string): Promise<string> => {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            const MAX_DIM = 400;
            let w = img.width;
            let h = img.height;
            if (w > MAX_DIM || h > MAX_DIM) {
                const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
                w *= ratio;
                h *= ratio;
            }
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, w);
            canvas.height = Math.max(1, h);
            const ctx = canvas.getContext('2d');
            if (ctx) {
               ctx.drawImage(img, 0, 0, w, h);
               resolve(canvas.toDataURL('image/png'));
            } else {
               resolve(base64);
            }
        };
        img.onerror = () => resolve(base64);
        img.src = base64;
    });
  };

  const handleSaveToCache = async () => {
    if (!imageData) return;
    
    let thumb = "";
    if (viewMode === 'scene' && iframeRef.current?.contentWindow) {
      thumb = await new Promise<string>(resolve => {
        let resolved = false;
        const handler = (e: MessageEvent) => {
          if (e.data.type === 'THUMBNAIL_DATA') {
             window.removeEventListener('message', handler);
             if (!resolved) {
                 resolved = true;
                 // It's a high-res canvas, so let's scale it down using getThumbnail
                 getThumbnail(e.data.dataUrl).then(resolve);
             }
          }
        };
        window.addEventListener('message', handler);
        iframeRef.current?.contentWindow?.postMessage({ type: 'REQUEST_THUMBNAIL' }, '*');
        
        setTimeout(() => {
           window.removeEventListener('message', handler);
           if (!resolved) {
               resolved = true;
               resolve("");
           }
        }, 500);
      });
    }

    if (!thumb) {
        thumb = await getThumbnail(imageData);
    }
    
    const newSnapshot = {
      id: Date.now().toString(),
      image: thumb,
      code: viewMode === 'scene' ? "3d" : "",
      title: prompt.split('\n')[0].substring(0, 10).trim() || 'CACHE',
      settings: getCurrentSettings()
    };
    setHistory(prev => [newSnapshot, ...prev].slice(0, 4));
  };

  const handleConstructScene = async () => {
    if (!imageData) return;
    setStatus('generating_scene');
    setErrorMsg('');
    setThinkingText('COMPILING SHADER TOPOLOGY...');
    
    try {
      setTimeout(() => {
        const code = buildThreeJsScene(imageData, effectStyle, resolution, lighting, autoRotate, colorFace, colorSide, bgColor, thickness);
        setSceneCode(code);

        setViewMode('scene');
        setStatus('idle');
        setThinkingText(null);
      }, 50);
    } catch (err) {
      handleError(err);
    }
  };

  const loadSnapshot = (sn: typeof history[0]) => {
    // We intentionally don't set imageData to sn.image because it is a low-res thumbnail.
    if (!sn.code || sn.code === "") {
       setSceneCode(null);
       setViewMode('image');
       setActiveTab('text');
    } else {
       setViewMode('scene');
    }
    
    if (sn.settings) {
        const setts = sn.settings;
        if (setts.prompt !== undefined) setPrompt(setts.prompt);
        if (setts.fontMain !== undefined) setFontMain(setts.fontMain);
        if (setts.sizeMain !== undefined) setSizeMain(setts.sizeMain);
        if (setts.subPrompt !== undefined) setSubPrompt(setts.subPrompt);
        if (setts.fontSub !== undefined) setFontSub(setts.fontSub);
        if (setts.sizeSub !== undefined) setSizeSub(setts.sizeSub);
        if (setts.subOffsetX !== undefined) setSubOffsetX(setts.subOffsetX);
        if (setts.subOffsetY !== undefined) setSubOffsetY(setts.subOffsetY);
        if (setts.textAlign !== undefined) setTextAlign(setts.textAlign);
        if (setts.letterSpacing !== undefined) setLetterSpacing(setts.letterSpacing);
        if (setts.lineHeight !== undefined) setLineHeight(setts.lineHeight);
        if (setts.skewX !== undefined) setSkewX(setts.skewX);
        if (setts.skewY !== undefined) setSkewY(setts.skewY);
        if (setts.colorFace !== undefined) setColorFace(setts.colorFace);
        if (setts.colorSide !== undefined) setColorSide(setts.colorSide);
        if (setts.bgColor !== undefined) setBgColor(setts.bgColor);
        if (setts.ornaments !== undefined) setOrnaments(setts.ornaments);
        if (setts.resolution !== undefined) setResolution(setts.resolution);
        if (setts.thickness !== undefined) setThickness(setts.thickness);
        if (setts.autoRotate !== undefined) setAutoRotate(setts.autoRotate);
        if (setts.lighting !== undefined) setLighting(setts.lighting);
        if (setts.effectStyle !== undefined) setEffectStyle(setts.effectStyle);
        if (setts.attachedMark !== undefined) setAttachedMark(setts.attachedMark);
        if (setts.attachedMarkScale !== undefined) setAttachedMarkScale(setts.attachedMarkScale);
        if (setts.attachedMarkOffsetX !== undefined) setAttachedMarkOffsetX(setts.attachedMarkOffsetX);
        if (setts.attachedMarkOffsetY !== undefined) setAttachedMarkOffsetY(setts.attachedMarkOffsetY);
    } else {
       // fallback if no settings found
       if (!sn.code) setAttachedMark(null);
    }
  };

  const downloadSceneHtml = () => {
    if (!sceneCode) return;
    const blob = new Blob([sceneCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solid-typography-export-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!sceneCode) return;
    navigator.clipboard.writeText(sceneCode);
    setThinkingText('COPIED_TO_CLIPBOARD');
    setTimeout(() => setThinkingText(null), 2000);
  };

  const themeClasses: Record<string, string> = {
    'DARK': 'from-[#0a0c10] to-[#12161b]',
    'BLACK': 'from-black to-[#050505]',
    'MID': 'from-[#1a1f26] to-[#2d3640]',
    'BLUE': 'from-[#0a1120] to-[#111c33]',
    'GREEN': 'from-[#0a1410] to-[#11241c]',
    'RED': 'from-[#140a0a] to-[#241111]',
  };

  return (
    <div className={`h-screen w-screen bg-gradient-to-br ${themeClasses[uiTheme] || themeClasses['DARK']} text-[var(--text-base)] flex flex-col font-mono selection:bg-[#2d3a4d] overflow-hidden`}>
      <canvas ref={hiddenCanvasRef} className="hidden" />
      
      {/* 00 HEADER */}
      <header className="flex justify-between items-center shrink-0 border-b border-[var(--border-base)] px-6 py-3 bg-[var(--bg-panel)]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3 w-1/4">
          <Terminal size={14} className="text-[var(--text-bright)]" />
          <h1 className="text-[var(--text-bright)] text-sm font-bold tracking-normal whitespace-nowrap">SOLID LOGO &amp; TYPOGRAPHY CREATOR</h1>
        </div>
        
        <div className="flex-1 flex justify-center px-12 text-[#2d3a4d] text-[10px] tracking-widest font-bold">
          3D TYPOGRAPHY / ALGORITHMIC GENERATOR
        </div>

        <div className="flex items-center gap-4 w-1/4 justify-end">
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'idle' ? 'bg-emerald-500' : 'bg-yellow-500 animate-pulse'}`}></div>
            <span className="text-[9px] tracking-widest opacity-60">STABLE</span>
          </div>
          <div className="h-4 w-[1px] bg-[var(--border-base)]"></div>
          <span className="text-[9px] tracking-widest opacity-60">VER_2.1.0</span>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* LEFT SIDEBAR: PARAMETERS */}
        <aside className="w-72 border-r border-[var(--border-base)] bg-[var(--bg-panel)]/40 backdrop-blur-sm flex flex-col shrink-0 overflow-hidden">
          <div className="flex bg-[var(--bg-panel)] border-b border-[var(--border-base)] shrink-0">
            <button onClick={() => setActiveTab('text')} className={`flex-1 py-3 text-[9px] font-bold tracking-wider ${activeTab === 'text' ? 'text-white border-b-2 border-emerald-500 bg-[#252f41]' : 'text-gray-500 hover:text-white'}`}>テキスト</button>
            <button onClick={() => setActiveTab('mark')} className={`flex-1 py-3 text-[9px] font-bold tracking-wider ${activeTab === 'mark' ? 'text-white border-b-2 border-emerald-500 bg-[#252f41]' : 'text-gray-500 hover:text-white'}`}>AIマーク</button>
            <button onClick={() => setActiveTab('style')} className={`flex-1 py-3 text-[9px] font-bold tracking-wider ${activeTab === 'style' ? 'text-white border-b-2 border-emerald-500 bg-[#252f41]' : 'text-gray-500 hover:text-white'}`}>デザイン</button>
            <button onClick={() => setActiveTab('3d')} className={`flex-1 py-3 text-[9px] font-bold tracking-wider ${activeTab === '3d' ? 'text-white border-b-2 border-emerald-500 bg-[#252f41]' : 'text-gray-500 hover:text-white'}`}>3Dエンジン</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          
          {activeTab === 'mark' && (
            <div className="flex flex-col gap-4 animate-fade-in relative">
              <div className="ss-panel p-3">
                <div className="ss-label mb-2 mt-1 flex justify-between items-center">
                  <div>
                    <span className="ss-number">01</span>
                    <span className="ss-title">ロゴのモチーフ</span>
                  </div>
                  <button onClick={() => setShowApiSettings(!showApiSettings)} className="text-[#4e5d74] hover:text-white" title="API Settings">
                    <Settings size={12} />
                  </button>
                </div>
                
                {showApiSettings && (
                  <div className="mb-4 p-3 bg-black/40 border border-[#343d4a] rounded shadow-lg">
                    <div className="text-[10px] text-[#8a95a3] mb-2">Gemini API Key (PWA等の外部環境用)</div>
                    <input 
                      type="password" 
                      className="ss-input py-1.5 px-2 text-[10px] w-full mb-1" 
                      placeholder="AI Studioでは不要です" 
                      value={customApiKey} 
                      onChange={e => handleCustomApiKey(e.target.value)}
                    />
                    <div className="text-[8px] text-[#4e5d74]">※ブラウザのローカルストレージに保存されます</div>
                  </div>
                )}

                <input 
                  type="text" 
                  className="ss-input py-2 px-3 text-[12px] h-10 w-full mb-3" 
                  placeholder="例：龍、幾何学模様、歯車など" 
                  value={markPrompt} 
                  onChange={e => setMarkPrompt(e.target.value)}
                  disabled={generatingMarks}
                />
                {!generatingMarks ? (
                  <button 
                    className="ss-btn ss-btn-primary border-emerald-500 text-emerald-500 bg-transparent hover:bg-emerald-500/10 mb-2 w-full flex items-center justify-center gap-2"
                    disabled={!markPrompt}
                    onClick={generateAiMarks}
                  >
                    <Zap size={12}/>2パターン生成する
                  </button>
                ) : (
                  <button 
                    className="ss-btn ss-btn-primary border-red-500 text-red-500 bg-transparent hover:bg-red-500/10 mb-2 w-full flex items-center justify-center gap-2"
                    onClick={handleCancelAiGeneration}
                  >
                    <span className="animate-pulse flex items-center justify-center gap-2 w-full"><Square fill="currentColor" size={10} /> 生成を停止</span>
                  </button>
                )}
                <div className="text-[9px] text-[#4e5d74] text-center mt-1">
                  AIがモチーフから白黒のマークを生成します。
                </div>
              </div>

              {generatedMarks.length > 0 && (
                <div className="ss-panel p-3">
                  <div className="ss-label mb-3 mt-1 flex justify-between items-center">
                    <div>
                      <span className="ss-number">02</span>
                      <span className="ss-title">生成結果一覧</span>
                    </div>
                    <ResetBtn onClick={() => setGeneratedMarks([])} />
                  </div>
                  <div className="text-[10px] text-[var(--text-base)] mb-3 leading-relaxed">
                    画像をクリックするとキャンバスに適用され、3D化されます。
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {generatedMarks.map((markBase64, idx) => (
                      <div 
                        key={idx} 
                        className="group relative aspect-square bg-white border border-[var(--border-base)] rounded cursor-pointer hover:border-emerald-500 transition-colors flex items-center justify-center p-2 overflow-hidden bg-white"
                        onClick={() => processGeneratedMark(markBase64)}
                      >
                        <img src={markBase64} alt={`Mark ${idx}`} className="w-full h-full object-contain" />
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-black/80 p-1 rounded">
                           <button onClick={(e) => { e.stopPropagation(); handleInvert(markBase64, idx, undefined); }} className="text-gray-300 hover:text-white p-0.5" title="白黒反転">
                             <Contrast size={12} />
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); handleStockAdd(markBase64); }} className="text-gray-300 hover:text-emerald-400 p-0.5" title="ストックに追加">
                             <BookmarkPlus size={12} />
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); downloadPng(markBase64, false); }} className="text-gray-300 hover:text-blue-400 p-0.5" title="PNG(透過なし)ダウンロード">
                             <ImageIcon size={12} />
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); downloadPng(markBase64, true); }} className="text-gray-300 hover:text-blue-400 p-0.5" title="PNG(透過)ダウンロード">
                             <Download size={12} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                <div className="ss-panel p-3">
                  <div className="ss-label mb-3 mt-1 flex justify-between items-center">
                    <div>
                      <span className="ss-number">03</span>
                      <span className="ss-title">ストック ({stockedMarks.length})</span>
                    </div>
                    <div>
                      <label className="cursor-pointer text-gray-400 hover:text-white transition-colors bg-[#1a1f26] border border-[#2d3a4d] p-1 rounded inline-flex items-center" title="画像をインポート">
                        <Upload size={14} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleLocalImageUpload} />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-3 pt-2 pb-2 bg-[#1a1f26] border border-[#2d3a4d] rounded justify-center items-center">
                     <span className="text-[10px] text-gray-400 font-bold tracking-widest mr-2">MENU</span>
                     <button onClick={handleSelectedInvert} disabled={selectedStockId === null} className={`p-1 ${selectedStockId !== null ? 'text-gray-300 hover:text-white cursor-pointer' : 'text-gray-600 cursor-not-allowed'}`} title="白黒反転">
                       <Contrast size={12} />
                     </button>
                     <button onClick={() => handleSelectedDownload(false)} disabled={selectedStockId === null} className={`p-1 ${selectedStockId !== null ? 'text-gray-300 hover:text-blue-400 cursor-pointer' : 'text-gray-600 cursor-not-allowed'}`} title="PNG(透過なし)ダウンロード">
                       <ImageIcon size={12} />
                     </button>
                     <button onClick={() => handleSelectedDownload(true)} disabled={selectedStockId === null} className={`p-1 ${selectedStockId !== null ? 'text-gray-300 hover:text-blue-400 cursor-pointer' : 'text-gray-600 cursor-not-allowed'}`} title="PNG(透過)ダウンロード">
                       <Download size={12} />
                     </button>
                     <button onClick={handleSelectedRemove} disabled={selectedStockId === null} className={`p-1 ml-1 ${selectedStockId !== null ? 'text-gray-300 hover:text-red-400 cursor-pointer' : 'text-gray-600 cursor-not-allowed'}`} title="削除">
                       <Trash2 size={12} />
                     </button>
                  </div>

                  {stockedMarks.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {stockedMarks.map((markBase64, idx) => {
                      const isSelected = selectedStockId === idx;
                      return (
                        <div 
                          key={`stock-${idx}`} 
                          className={`group relative aspect-square bg-white border ${isSelected ? 'border-emerald-500 scale-95' : 'border-[var(--border-base)] hover:border-emerald-500'} rounded cursor-pointer transition-all flex items-center justify-center p-1.5 overflow-hidden`}
                          onClick={() => processGeneratedMark(markBase64)}
                        >
                          <img src={markBase64} alt={`Stock ${idx}`} className={`w-full h-full object-contain ${isSelected ? 'opacity-80' : ''}`} />
                          <div 
                            className={`absolute top-1 right-1 w-4 h-4 bg-black/60 border border-gray-400 rounded-sm flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} 
                            onClick={(e) => { e.stopPropagation(); toggleStockSelection(idx); }}
                          >
                            {isSelected && <div className="w-2 h-2 bg-emerald-500 rounded-sm" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  ) : (
                    <div className="text-center py-6 text-[10px] text-gray-500 border border-dashed border-[#2d3a4d] rounded mt-2">
                      ストックはありません。<br/>右上のボタンからアップロードできます。
                    </div>
                  )}
                </div>
            </div>
          )}

          {activeTab === 'text' && (
            <>
            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1">
                <span className="ss-number">01</span>
                <span className="ss-title">メインテキスト</span>
              </div>
               <textarea 
                className="ss-input py-2 px-3 text-[12px] h-16 resize-none leading-relaxed mb-3" 
                value={prompt} onChange={e => setPrompt(e.target.value)}
              />
              <select value={fontMain} onChange={e => setFontMain(e.target.value)} className="ss-select w-full mb-3" style={{ fontFamily: fontMain }}>
                {FONTS.map(f => <option key={f.name} value={f.value} style={{fontFamily: f.value}}>{f.name}</option>)}
              </select>
              <div className="ss-label mb-2 flex items-center">
                <span>SIZE</span><span className="ml-auto opacity-70 mr-2">{sizeMain}PX</span><ResetBtn onClick={() => setSizeMain(160)} />
              </div>
              <input type="range" min="40" max="400" step="10" value={sizeMain} onChange={e => setSizeMain(Number(e.target.value))} className="ss-slider" />
            </div>

            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1">
                <span className="ss-number">02</span>
                <span className="ss-title">サブテキスト</span>
              </div>
               <textarea 
                className="ss-input py-2 px-3 text-[10px] h-12 resize-none leading-relaxed mb-3" 
                value={subPrompt} onChange={e => setSubPrompt(e.target.value)}
              />
              <select value={fontSub} onChange={e => setFontSub(e.target.value)} className="ss-select w-full mb-3" style={{ fontFamily: fontSub }}>
                {FONTS.map(f => <option key={f.name} value={f.value} style={{fontFamily: f.value}}>{f.name}</option>)}
              </select>
              <div className="ss-label mb-2 flex items-center">
                <span>SIZE</span><span className="ml-auto opacity-70 mr-2">{sizeSub}PX</span><ResetBtn onClick={() => setSizeSub(30)} />
              </div>
              <input type="range" min="10" max="100" step="1" value={sizeSub} onChange={e => setSizeSub(Number(e.target.value))} className="ss-slider" />
            </div>

            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1 flex justify-between items-center">
                <div>  
                  <span className="ss-number">03</span>
                  <span className="ss-title">配置オフセット</span>
                </div>
                <ResetBtn onClick={() => { setSubOffsetX(0); setSubOffsetY(40); }} />
              </div>
              <div className="ss-label mb-2 text-[9px] flex items-center mt-3">
                <span>サブX軸</span><span className="ml-auto opacity-70 mr-2">{subOffsetX}PX</span><ResetBtn onClick={() => setSubOffsetX(0)} />
              </div>
              <input type="range" min="-300" max="300" step="10" value={subOffsetX} onChange={e => setSubOffsetX(Number(e.target.value))} className="ss-slider mb-4" />
              
              <div className="ss-label mb-2 text-[9px] flex items-center">
                <span>サブY軸</span><span className="ml-auto opacity-70 mr-2">{subOffsetY}PX</span><ResetBtn onClick={() => setSubOffsetY(40)} />
              </div>
              <input type="range" min="-300" max="300" step="10" value={subOffsetY} onChange={e => setSubOffsetY(Number(e.target.value))} className="ss-slider mb-2" />
            </div>

            {attachedMark && (
              <div className="ss-panel p-3 animate-fade-in">
                <div className="ss-label mb-2 mt-1 flex justify-between items-center">
                  <div>  
                    <span className="ss-number">04</span>
                    <span className="ss-title">AIマーク設定</span>
                  </div>
                  <button onClick={() => setAttachedMark(null)} className="text-red-400 hover:text-red-300 p-1" title="削除">
                    <Trash2 size={10} />
                  </button>
                </div>
                <div className="ss-label mb-2 text-[9px] flex items-center mt-3">
                  <span>スケール</span><span className="ml-auto opacity-70 mr-2">{attachedMarkScale.toFixed(2)}</span><ResetBtn onClick={() => setAttachedMarkScale(1.0)} />
                </div>
                <input type="range" min="0.1" max="5.0" step="0.1" value={attachedMarkScale} onChange={e => setAttachedMarkScale(Number(e.target.value))} className="ss-slider mb-4" />

                <div className="ss-label mb-2 text-[9px] flex items-center">
                  <span>マークX軸</span><span className="ml-auto opacity-70 mr-2">{attachedMarkOffsetX}PX</span><ResetBtn onClick={() => setAttachedMarkOffsetX(0)} />
                </div>
                <input type="range" min="-500" max="500" step="10" value={attachedMarkOffsetX} onChange={e => setAttachedMarkOffsetX(Number(e.target.value))} className="ss-slider mb-4" />
                
                <div className="ss-label mb-2 text-[9px] flex items-center">
                  <span>マークY軸</span><span className="ml-auto opacity-70 mr-2">{attachedMarkOffsetY}PX</span><ResetBtn onClick={() => setAttachedMarkOffsetY(-150)} />
                </div>
                <input type="range" min="-500" max="500" step="10" value={attachedMarkOffsetY} onChange={e => setAttachedMarkOffsetY(Number(e.target.value))} className="ss-slider mb-2" />
              </div>
            )}

            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1">
                <span className="ss-number">{attachedMark ? '05' : '04'}</span>
                <span className="ss-title">文字設定</span>
              </div>

               <div className="flex justify-between items-center gap-2 mb-4 mt-3">
                <button 
                  onClick={() => setTextAlign('left')} 
                  className={`flex-1 ss-btn py-1.5 flex justify-center ${textAlign === 'left' ? 'ss-btn-active' : ''}`}
                >
                  左揃え
                </button>
                <button 
                  onClick={() => setTextAlign('center')} 
                  className={`flex-1 ss-btn py-1.5 flex justify-center ${textAlign === 'center' ? 'ss-btn-active' : ''}`}
                >
                  中央
                </button>
                <button 
                  onClick={() => setTextAlign('right')} 
                  className={`flex-1 ss-btn py-1.5 flex justify-center ${textAlign === 'right' ? 'ss-btn-active' : ''}`}
                >
                  右揃え
                </button>
              </div>

              <div className="ss-label mb-2 flex items-center">
                <span>字送り</span><span className="ml-auto opacity-70 mr-2">{letterSpacing}PX</span><ResetBtn onClick={() => setLetterSpacing(5)} />
              </div>
              <input type="range" min="-20" max="100" step="1" value={letterSpacing} onChange={e => setLetterSpacing(Number(e.target.value))} className="ss-slider mb-4" />

              <div className="ss-label mb-2 flex items-center">
                <span>行間隔</span><span className="ml-auto opacity-70 mr-2">{lineHeight.toFixed(1)}</span><ResetBtn onClick={() => setLineHeight(1.2)} />
              </div>
              <input type="range" min="0.5" max="3.0" step="0.1" value={lineHeight} onChange={e => setLineHeight(Number(e.target.value))} className="ss-slider mb-2" />
            </div>
            </>
          )}

          {activeTab === 'style' && (
            <>
            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1">
                <span className="ss-number">05</span>
                <span className="ss-title">カラー設定</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div>
                  <div className="ss-label mb-1 text-[8px] justify-between">表面色 <ResetBtn onClick={() => setColorFace('#F0E6D2')} /></div>
                  <div className="flex bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                    <input type="color" value={colorFace} onChange={e => setColorFace(e.target.value)} className="w-full h-8 cursor-pointer border-none bg-transparent" />
                  </div>
                </div>
                <div>
                  <div className="ss-label mb-1 text-[8px] justify-between">側面色 <ResetBtn onClick={() => setColorSide('#808080')} /></div>
                  <div className="flex bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                    <input type="color" value={colorSide} onChange={e => setColorSide(e.target.value)} className="w-full h-8 cursor-pointer border-none bg-transparent" />
                  </div>
                </div>
                <div>
                  <div className="ss-label mb-1 text-[8px] justify-between">背景色 <ResetBtn onClick={() => setBgColor('#1A1A1A')} /></div>
                  <div className="flex bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-8 cursor-pointer border-none bg-transparent" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => { setColorFace('#000000'); setColorSide('#333333'); setBgColor('#FFFFFF'); }}
                  className="flex-1 ss-btn py-1 px-2 border border-[#2d3a4d] text-[9px] hover:bg-white hover:text-black flex items-center justify-center gap-1 transition-colors"
                >
                  <div className="w-2 h-2 bg-black border border-gray-400"></div> B on W
                </button>
                <button 
                  onClick={() => { setColorFace('#FFFFFF'); setColorSide('#CCCCCC'); setBgColor('#000000'); }}
                  className="flex-1 ss-btn py-1 px-2 border border-[#2d3a4d] text-[9px] hover:bg-white hover:text-black flex items-center justify-center gap-1 transition-colors"
                >
                  <div className="w-2 h-2 bg-white border border-gray-400"></div> W on B
                </button>
              </div>
            </div>

            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1 flex justify-between items-center">
                <div>
                  <span className="ss-number">05</span>
                  <span className="ss-title">装飾 1</span>
                </div>
                <ResetBtn onClick={() => {
                  const newOrn = [...ornaments];
                  newOrn[0] = { type: 'retro_wings', offsetX: 0, offsetY: 0, scale: 1.0, width: 1.0, thickness: 15, dash: 0 };
                  setOrnaments(newOrn);
                }} />
              </div>
              <select 
                value={ornaments[0].type} 
                onChange={e => {
                  const newOrn = [...ornaments];
                  newOrn[0].type = e.target.value;
                 setOrnaments(newOrn);
                }} 
                className="ss-select w-full mb-3"
              >
                {ORNAMENTS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
              
              {ornaments[0].type !== 'none' && (
                <div className="animate-fade-in mt-2 border-t border-[var(--border-base)] pt-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>水平位置</span><span className="ml-auto opacity-70 mr-1">{ornaments[0].offsetX}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[0].offsetX = 0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="-1000" max="1000" step="10" value={ornaments[0].offsetX} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[0].offsetX = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-4" />
                    </div>
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>垂直位置</span><span className="ml-auto opacity-70 mr-1">{ornaments[0].offsetY}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[0].offsetY = 0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="-1000" max="1000" step="10" value={ornaments[0].offsetY} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[0].offsetY = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-4" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>全体ｽｹｰﾙ</span><span className="ml-auto opacity-70 mr-1">{ornaments[0].scale.toFixed(1)}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[0].scale = 1.0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="0.1" max="5.0" step="0.1" value={ornaments[0].scale} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[0].scale = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-4" />
                    </div>
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>水平ｽｹｰﾙ</span><span className="ml-auto opacity-70 mr-1">{ornaments[0].width.toFixed(1)}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[0].width = 1.0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="0.1" max="5.0" step="0.1" value={ornaments[0].width} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[0].width = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-4" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>太さ</span><span className="ml-auto opacity-70 mr-1">{ornaments[0].thickness}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[0].thickness = 15; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="1" max="100" step="1" value={ornaments[0].thickness} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[0].thickness = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-2" />
                    </div>
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>破線間隔</span><span className="ml-auto opacity-70 mr-1">{ornaments[0].dash}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[0].dash = 0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="0" max="100" step="5" value={ornaments[0].dash} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[0].dash = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-2" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1 flex justify-between items-center">
                <div>
                  <span className="ss-number">06</span>
                  <span className="ss-title">装飾 2</span>
                </div>
                <ResetBtn onClick={() => {
                  const newOrn = [...ornaments];
                  newOrn[1] = { type: 'none', offsetX: 0, offsetY: 0, scale: 1.0, width: 1.0, thickness: 15, dash: 0 };
                  setOrnaments(newOrn);
                }} />
              </div>
              <select 
                value={ornaments[1].type} 
                onChange={e => {
                  const newOrn = [...ornaments];
                  newOrn[1].type = e.target.value;
                 setOrnaments(newOrn);
                }} 
                className="ss-select w-full mb-3"
              >
                {ORNAMENTS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
              
              {ornaments[1].type !== 'none' && (
                <div className="animate-fade-in mt-2 border-t border-[var(--border-base)] pt-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>水平位置</span><span className="ml-auto opacity-70 mr-1">{ornaments[1].offsetX}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[1].offsetX = 0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="-1000" max="1000" step="10" value={ornaments[1].offsetX} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[1].offsetX = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-4" />
                    </div>
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>垂直位置</span><span className="ml-auto opacity-70 mr-1">{ornaments[1].offsetY}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[1].offsetY = 0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="-1000" max="1000" step="10" value={ornaments[1].offsetY} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[1].offsetY = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-4" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>全体ｽｹｰﾙ</span><span className="ml-auto opacity-70 mr-1">{ornaments[1].scale.toFixed(1)}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[1].scale = 1.0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="0.1" max="5.0" step="0.1" value={ornaments[1].scale} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[1].scale = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-4" />
                    </div>
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>水平ｽｹｰﾙ</span><span className="ml-auto opacity-70 mr-1">{ornaments[1].width.toFixed(1)}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[1].width = 1.0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="0.1" max="5.0" step="0.1" value={ornaments[1].width} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[1].width = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-4" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>太さ</span><span className="ml-auto opacity-70 mr-1">{ornaments[1].thickness}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[1].thickness = 15; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="1" max="100" step="1" value={ornaments[1].thickness} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[1].thickness = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-2" />
                    </div>
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>破線間隔</span><span className="ml-auto opacity-70 mr-1">{ornaments[1].dash}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[1].dash = 0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="0" max="100" step="5" value={ornaments[1].dash} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[1].dash = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-2" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="ss-panel p-3 animate-fade-in">
               <div className="ss-label mb-2 mt-1 flex justify-between items-center">
                <div>
                  <span className="ss-number">07</span>
                  <span className="ss-title">2D歪み</span>
                </div>
                <ResetBtn onClick={() => { setSkewX(0); setSkewY(0); }} />
              </div>
              
              <div className="ss-label mb-2 mt-4 text-[9px] flex items-center">
                <span>水平傾斜</span><span className="ml-auto opacity-70 mr-2">{skewX}°</span><ResetBtn onClick={() => setSkewX(0)} />
              </div>
              <input type="range" min="-45" max="45" step="1" value={skewX} onChange={e => setSkewX(Number(e.target.value))} className="ss-slider mb-2" />

              <div className="ss-label mb-2 mt-4 text-[9px] flex items-center">
                <span>垂直傾斜</span><span className="ml-auto opacity-70 mr-2">{skewY}°</span><ResetBtn onClick={() => setSkewY(0)} />
              </div>
              <input type="range" min="-45" max="45" step="1" value={skewY} onChange={e => setSkewY(Number(e.target.value))} className="ss-slider mb-2" />
            </div>
            </>
          )}

          {activeTab === '3d' && (
            <>
            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1">
                <span className="ss-number">08</span>
                <span className="ss-title">レンダリング設定</span> 
              </div>
              <div className="ss-label mb-2 mt-3 text-[10px]">
                <span className="">メッシュ密度</span>
                <span className="ml-auto opacity-70 mr-2">{resolution}</span><ResetBtn onClick={() => setResolution(128)} />
              </div>
              <input type="range" min="32" max="512" step="16" value={resolution} onChange={e => setResolution(Number(e.target.value))} className="ss-slider" />

              <div className="ss-label mb-2 mt-4 text-[10px] flex items-center">
                <span>押し出し厚さ</span><span className="ml-auto opacity-70 mr-2">{thickness.toFixed(1)}</span><ResetBtn onClick={() => setThickness(5)}/>
              </div>
              <input type="range" min="0.1" max="20" step="0.5" value={thickness} onChange={e => setThickness(Number(e.target.value))} className="ss-slider" />

              <div className="ss-label mb-2 mt-4 text-[10px]">
                <span className="">自動回転</span>
              </div>
              <button 
                  onClick={() => setAutoRotate(!autoRotate)} 
                  className={`ss-btn py-1.5 w-full flex justify-center ${autoRotate ? 'ss-btn-active' : ''}`}
                >
                  {autoRotate ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-3 mt-1">
                <span className="ss-number">09</span>
                <span className="ss-title">3Dエフェクト</span>
              </div>
              <div className="flex flex-col gap-1 overflow-y-auto">
                {EFFECTS.map(e => (
                  <button key={e.id} onClick={() => setEffectStyle(e.id)} className={`ss-btn py-1.5 ${effectStyle === e.id ? 'ss-btn-active' : ''}`}>{e.name}</button>
                ))}
              </div>
            </div>
            </>
          )}
          </div>
          
          <div className="p-3 border-t border-[var(--border-base)] shrink-0 bg-[var(--bg-panel)] backdrop-blur-md grid grid-cols-2 gap-2">
            <button 
              onClick={exportSettings}
              className="w-full ss-btn py-2 text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 hover:text-blue-200 border border-blue-900/30 flex items-center justify-center gap-1 transition-colors"
            >
              <Download size={12} /> <span className="text-[9px] tracking-widest font-bold">EXPORT</span>
            </button>
            <label className="w-full ss-btn py-2 text-green-300 bg-green-900/20 hover:bg-green-900/40 hover:text-green-200 border border-green-900/30 flex items-center justify-center gap-1 transition-colors cursor-pointer">
              <Upload size={12} /> <span className="text-[9px] tracking-widest font-bold">IMPORT</span>
              <input type="file" accept=".json" className="hidden" onChange={importSettings} />
            </label>
          </div>
        </aside>

        {/* MAIN VIEWPORT */}
        <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg-main)]/20 relative">
          {/* Viewport Header */}
          <div className="flex bg-[var(--bg-panel)]/60 border-b border-[var(--border-base)] shrink-0 items-center">
             <div className="flex">
               <div className={`ss-tab ${viewMode === 'image' ? 'ss-tab-active' : ''}`} onClick={() => setViewMode('image')}>
                <Type size={10} /> BASE_MAP
              </div>
              <div className={`ss-tab ${viewMode === 'scene' ? 'ss-tab-active' : ''}`} onClick={() => sceneCode && setViewMode('scene')}>
                <ImageIcon size={10} /> 3D_STUDIO
              </div>
            </div>
            
            <div className="flex-1 px-4">
               {viewMode === 'image' && (
                 <div className="flex gap-2">
                   <button 
                    onClick={() => setPreviewBgMode(p => p === 'transparent' ? 'solid' : 'transparent')}
                    className="ss-btn py-1 px-3 text-[#8b9bb4] border border-[#3e4f69] hover:bg-[#2d3a4d] hover:text-white flex gap-2 items-center tracking-widest"
                   >
                     <Contrast size={12} /> <span className="text-[10px] font-bold">BACKGROUND MODE: {previewBgMode.toUpperCase()}</span>
                   </button>
                   <button onClick={() => { setImagePan({x:0, y:0}); setImageZoom(0.95); }} className="ss-btn py-1 px-3 text-[#8b9bb4] border border-[#3e4f69] hover:bg-[#2d3a4d] hover:text-white flex gap-2 items-center tracking-widest">
                     <Maximize2 size={12} /> <span className="text-[10px] font-bold">RESET VIEW</span>
                   </button>
                 </div>
               )}
            </div>

            <div className="flex items-center pr-2 gap-2">
               <button 
                onClick={handleConstructScene} 
                disabled={status !== 'idle' || !imageData} 
                className="ss-btn py-1 px-3 bg-[#2d3a4d] text-white flex items-center gap-2 hover:bg-[#3a4a5e]"
              >
                <Cpu size={12} className={status === 'generating_scene' ? 'animate-spin' : ''} /> <span className="text-[9px]">CONSTRUCT_3D</span>
              </button>
            </div>
          </div>

          {/* Viewport Render Box */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[radial-gradient(#1d2533_1px,transparent_1px)] [background-size:32px_32px]">
            <AnimatePresence mode="wait">
              {status !== 'idle' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#0a0e14]/90 z-30 flex flex-col items-center justify-center gap-6"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-[#1d2533] border-t-white rounded-full animate-spin"></div>
                    <Terminal size={24} className="absolute inset-0 m-auto text-white opacity-20" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] tracking-[0.4em] text-white uppercase font-bold">{thinkingText || status.replace('_', ' ')}</span>
                    <span className="text-[8px] text-[#4e5d74]">WRITING_THREE_JS_SHADERS...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div 
              className="w-full h-full relative" 
              style={{ 
                backgroundColor: viewMode === 'image' && previewBgMode === 'solid' ? bgColor : undefined,
                backgroundImage: viewMode === 'image' && previewBgMode === 'solid' ? 'none' : "radial-gradient(var(--border-base) 1px, transparent 1px)", 
                backgroundSize: viewMode === 'image' && previewBgMode === 'solid' ? "auto" : "20px 20px" 
              }}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onContextMenu={handleContextMenu}
            >
              {viewMode === 'scene' && sceneCode ? (
                <iframe 
                  ref={iframeRef}
                  title="3D View" 
                  srcDoc={sceneCode} 
                  className="w-full h-full border-none transition-opacity duration-300" 
                  sandbox="allow-scripts allow-same-origin"
                  onLoad={(e) => { (e.currentTarget as HTMLIFrameElement).style.opacity = '1'; }}
                />
              ) : viewMode === 'image' && imageData ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden relative cursor-grab active:cursor-grabbing">
                  {previewBgMode === 'transparent' && <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, var(--bg-main) 80%)' }}></div>}
                  <img 
                    src={imageData} 
                    alt="2D Preview"
                    className="relative z-10 max-w-full max-h-full object-contain pointer-events-none"
                    style={{ transform: `translate(${imagePan.x}px, ${imagePan.y}px) scale(${imageZoom})`, filter: previewBgMode === 'transparent' ? 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.5))' : 'none' }}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-[#2d3a4d]">
                  <Grid size={64} className="opacity-10" />
                  <span className="text-[10px] tracking-[0.5em] uppercase italic">NO_OUTPUT_BUFFER</span>
                </div>
              )}
            </div>

            {/* Overlays */}
            {sceneCode && viewMode === 'scene' && (
              <div className="absolute top-4 left-4 p-2 bg-[#0a0e14]/80 backdrop-blur-md border border-[#1d2533] text-[8px] flex flex-col gap-1 pointer-events-none">
                <div className="flex justify-between gap-8"><span className="opacity-60">STYLE:</span> <span className="text-white font-bold">{EFFECTS.find(e => e.id === effectStyle)?.name}</span></div>
                <div className="flex justify-between gap-8"><span className="opacity-60">GRID:</span> <span className="text-white">{resolution}x{resolution}</span></div>
              </div>
            )}

            <div className="absolute bottom-4 right-4 flex gap-2">
               <button 
                onClick={downloadSceneHtml}
                disabled={!(sceneCode)}
                className="w-8 h-8 ss-panel items-center justify-center p-0 hover:bg-[#252f41] cursor-pointer"
              >
                <Download size={14} className="opacity-60 hover:opacity-100" />
              </button>
              <button 
                onClick={() => {setSceneCode(null); setViewMode('image');}}
                className="w-8 h-8 ss-panel items-center justify-center p-0 hover:bg-[#252f41] cursor-pointer"
              >
                <RotateCcw size={14} className="opacity-60 hover:opacity-100" />
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR: HISTORY/PRESETS */}
        <aside className="w-48 border-l border-[var(--border-base)] bg-[var(--bg-panel)]/40 backdrop-blur-sm p-4 flex flex-col gap-4 shrink-0 overflow-y-auto">
          
           <div className="ss-panel p-3 mb-2">
            <div className="ss-label mb-2">
              <span className="ss-number">05</span>
              <span className="ss-title">ATMOS_LIGHTING</span> 
              <span className="ml-auto text-white text-[10px]">{lighting.toFixed(1)}</span>
            </div>
            <input type="range" min="0.1" max="3.0" step="0.1" value={lighting} onChange={e => setLighting(Number(e.target.value))} className="ss-slider" />
          </div>

          <div className="ss-label">
            <span className="ss-number">06</span>
            <span className="ss-title">UI_THEMES</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
             {Object.keys(themeClasses).map(t => (
                <button key={t} onClick={() => setUiTheme(t)} className={`ss-btn py-1.5 ${uiTheme === t ? 'ss-btn-active' : ''}`}>{t}</button>
              ))}
          </div>
          
          <div className="h-[1px] bg-[var(--border-base)] my-2"></div>
          
          <div className="ss-label">
            <span className="ss-number">07</span>
            <span className="ss-title">STUDIO_CACHE</span>
          </div>
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
             {history.length > 0 ? history.map(sn => (
               <div 
                key={sn.id} 
                onClick={() => loadSnapshot(sn)}
                className="ss-panel p-1 cursor-pointer hover:border-[#4d5e7a] group bg-black/40 border-black/50"
               >
                 <img src={sn.image} className="w-full h-16 object-cover opacity-60 group-hover:opacity-100 transition-all shadow-lg mix-blend-screen" alt="Thumb" />
                 <div className="p-1 text-[7px] truncate opacity-40 group-hover:opacity-100 mt-1">{sn.title}</div>
               </div>
             )) : (
               <div className="flex-1 border border-dashed border-[#1d2533] p-4 flex items-center justify-center opacity-30">
                 <span className="text-[9px] text-[#2d3a4d] rotate-90 uppercase tracking-widest">Cache_Empty</span>
               </div>
             )}
          </div>
        </aside>
      </div>

      {/* FOOTER BAR */}
      <footer className="p-3 border-t border-[var(--border-base)] bg-[var(--bg-panel)] shrink-0 flex gap-3 h-[60px]">
         <button onClick={copyToClipboard} className="flex-1 bg-[var(--bg-btn)] hover:bg-[var(--bg-btn-active)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] text-[var(--text-base)] hover:text-[var(--text-bright)] tracking-widest flex items-center justify-center">COPY SOURCE</button>
         
         <div className="flex-[2] flex gap-3">
           <button onClick={() => handleExport2D(false)} disabled={!imageData} className={`flex-1 bg-[var(--bg-btn)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] tracking-widest flex items-center justify-center ${imageData ? 'hover:bg-[var(--bg-btn-active)] text-[var(--text-base)] hover:text-[var(--text-bright)] cursor-pointer' : 'opacity-50 text-[var(--text-base)] cursor-not-allowed'}`}>PNG (SOLID)</button>
           <button onClick={() => handleExport2D(true)} disabled={!imageData} className={`flex-1 bg-[var(--bg-btn)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] tracking-widest flex items-center justify-center ${imageData ? 'hover:bg-[var(--bg-btn-active)] text-emerald-500 hover:text-emerald-400 cursor-pointer' : 'opacity-50 text-[var(--text-base)] cursor-not-allowed'}`}>PNG (ALPHA)</button>
         </div>
         
         <button onClick={handleSaveToCache} disabled={!imageData} className={`flex-1 bg-[var(--bg-btn)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] tracking-widest flex items-center justify-center ${imageData ? 'hover:bg-[var(--bg-btn-active)] text-[var(--text-base)] hover:text-[var(--text-bright)] cursor-pointer' : 'opacity-50 text-[var(--text-base)] cursor-not-allowed'}`}>SAVE TO CACHE</button>
         
         <button onClick={() => {setSceneCode(null); setViewMode('image'); setHistory([]);}} className="flex-1 bg-[var(--bg-btn)] hover:bg-[var(--bg-btn-active)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] text-red-500 hover:text-red-400 tracking-widest flex items-center justify-center">CLEAR CACHE</button>
         
         <button onClick={downloadSceneHtml} disabled={!sceneCode} className={`flex-1 bg-[var(--bg-btn)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] tracking-widest flex items-center justify-center ${sceneCode ? 'hover:bg-[var(--bg-btn-active)] text-blue-500 hover:text-blue-400 cursor-pointer' : 'opacity-50 text-[var(--text-base)] cursor-not-allowed'}`}>EXPORT 3D</button>
      </footer>

      {/* DEBUG STRIP */}
      <div className="ss-status-bar h-5 shrink-0 px-6 bg-[var(--bg-panel)] border-t border-[var(--border-base)] flex items-center">
        <div className="flex gap-6 flex-1">
          <span className="flex items-center gap-1 text-emerald-500 uppercase font-bold"><CheckCircle2 size={10}/> KERNEL_ACTIVE</span>
          <span className="opacity-50">NODE_LOAD: {status === 'idle' ? '1.84%' : '94.12%'}</span>
          <span className="opacity-50 uppercase">Canvas: {resolution}px Grid</span>
          {errorMsg && <span className="text-red-500 opacity-100 uppercase">{errorMsg}</span>}
        </div>
        <div className="text-[#4e5d74] text-[9px] tracking-widest uppercase font-bold">© 2026 SOLID_TYPOGRAPHY</div>
      </div>
    </div>
  );
};

export default App;

