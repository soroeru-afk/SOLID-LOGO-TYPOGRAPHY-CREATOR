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
  AlignLeft, AlignCenter, AlignRight
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

  const trimHeight = bound.bottom - bound.top;
  const trimWidth = bound.right - bound.left;

  const trimmed = document.createElement('canvas');
  trimmed.width = trimWidth;
  trimmed.height = trimHeight;
  const tCtx = trimmed.getContext('2d');
  if (tCtx) {
    tCtx.putImageData(ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight), 0, 0);
  }
  return trimmed.toDataURL('image/png');
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'style' | '3d'>('text');
  
  // TEXT
  const [prompt, setPrompt] = useState('漢字\nWATANABE');
  const [fontMain, setFontMain] = useState(FONTS[7].value);
  const [sizeMain, setSizeMain] = useState(160);
  
  const [subPrompt, setSubPrompt] = useState('BAUHAUS TYPOGRAPHY');
  const [fontSub, setFontSub] = useState(FONTS[1].value);
  const [sizeSub, setSizeSub] = useState(30);

  const [subOffsetX, setSubOffsetX] = useState(0);
  const [subOffsetY, setSubOffsetY] = useState(-60);
  
  const [textAlign, setTextAlign] = useState<'left'|'center'|'right'>('center');
  const [letterSpacing, setLetterSpacing] = useState(5);
  const [lineHeight, setLineHeight] = useState(1.2);
  
  // DESIGN
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const [colorFace, setColorFace] = useState('#F0E6D2'); // Bauhaus off-white
  const [colorSide, setColorSide] = useState('#4A4742'); // Neutral dark grey
  const [bgColor, setBgColor] = useState('#1A1A1A'); // Dark bg
  const [ornaments, setOrnaments] = useState([
    { type: 'retro_wings', offsetX: 0, offsetY: -238, scale: 1.0, width: 0.8, thickness: 15, dash: 0 },
    { type: 'horizontal_line', offsetX: 0, offsetY: 90, scale: 1.0, width: 2.2, thickness: 5, dash: 0 }
  ]);

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
  const [history, setHistory] = useState<{id: string, image: string, code: string, title: string}[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  const exportSettings = () => {
    const settings = {
      prompt, fontMain, sizeMain,
      subPrompt, fontSub, sizeSub,
      subOffsetX, subOffsetY,
      textAlign, letterSpacing, lineHeight,
      skewX, skewY, colorFace, colorSide, bgColor,
      ornaments, resolution, thickness, autoRotate, lighting, effectStyle
    };
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
  }, [prompt, subPrompt, fontMain, sizeMain, fontSub, sizeSub, letterSpacing, lineHeight, textAlign, colorFace, subOffsetX, subOffsetY, skewX, skewY, JSON.stringify(ornaments)]);

  // Auto-rebuild the 3D scene when rendering parameters change
  useEffect(() => {
    if (viewMode === 'scene' && imageData) {
      if (iframeRef.current && iframeRef.current.contentWindow) {
         iframeRef.current.style.opacity = '0.5';
      }
      setTimeout(() => {
        const code = buildThreeJsScene(imageData, effectStyle, resolution, lighting, autoRotate, colorFace, colorSide, bgColor, thickness);
        setSceneCode(code);
      }, 50);
    }
  }, [imageData, effectStyle, resolution, autoRotate, colorFace, colorSide, bgColor, thickness]);

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

    ctx.restore();

    setImageData(trimCanvas(canvas));
    if(!sceneCode) setViewMode('image');
  };

  const handleConstructScene = () => {
    if (!imageData || status !== 'idle') return;
    setStatus('generating_scene');
    setErrorMsg('');
    setThinkingText('COMPILING SHADER TOPOLOGY...');
    
    try {
      setTimeout(() => {
        const code = buildThreeJsScene(imageData, effectStyle, resolution, lighting, autoRotate, colorFace, colorSide, bgColor, thickness);
        setSceneCode(code);

        // Add to history
        const newSnapshot = {
          id: Date.now().toString(),
          image: imageData,
          code: code,
          title: prompt.split('\\n')[0].substring(0, 10).trim() || 'UNNAMED_TYPO'
        };
        setHistory(prev => [newSnapshot, ...prev].slice(0, 5));

        setViewMode('scene');
        setStatus('idle');
        setThinkingText(null);
      }, 50);
    } catch (err) {
      handleError(err);
    }
  };

  const loadSnapshot = (sn: typeof history[0]) => {
    setImageData(sn.image);
    setSceneCode(sn.code);
    setViewMode('scene');
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
          <h1 className="text-[var(--text-bright)] text-sm font-bold tracking-[0.3em] whitespace-nowrap">SOLID TYPOGRAPHY DESIGNER</h1>
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
            <button onClick={() => setActiveTab('text')} className={`flex-1 py-3 text-[10px] font-bold tracking-wider ${activeTab === 'text' ? 'text-white border-b-2 border-emerald-500 bg-[#252f41]' : 'text-gray-500 hover:text-white'}`}>テキスト</button>
            <button onClick={() => setActiveTab('style')} className={`flex-1 py-3 text-[10px] font-bold tracking-wider ${activeTab === 'style' ? 'text-white border-b-2 border-emerald-500 bg-[#252f41]' : 'text-gray-500 hover:text-white'}`}>デザイン</button>
            <button onClick={() => setActiveTab('3d')} className={`flex-1 py-3 text-[10px] font-bold tracking-wider ${activeTab === '3d' ? 'text-white border-b-2 border-emerald-500 bg-[#252f41]' : 'text-gray-500 hover:text-white'}`}>3Dエンジン</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          
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

            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1">
                <span className="ss-number">04</span>
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
                  <div className="ss-label mb-1 text-[8px] justify-between">側面色 <ResetBtn onClick={() => setColorSide('#D32F2F')} /></div>
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
          <div className="flex bg-[var(--bg-panel)]/60 border-b border-[var(--border-base)] shrink-0">
             <div className={`ss-tab ${viewMode === 'image' ? 'ss-tab-active' : ''}`} onClick={() => setViewMode('image')}>
              <Type size={10} /> BASE_MAP
            </div>
            <div className={`ss-tab ${viewMode === 'scene' ? 'ss-tab-active' : ''}`} onClick={() => sceneCode && setViewMode('scene')}>
              <ImageIcon size={10} /> 3D_STUDIO
            </div>
            <div className="flex-1"></div>
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
            
            <div className="w-full h-full relative" style={{ backgroundImage: "radial-gradient(var(--border-base) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
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
                <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden relative">
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, var(--bg-main) 80%)' }}></div>
                  <img 
                    src={imageData} 
                    alt="2D Preview"
                    className="relative z-10 max-w-full max-h-full object-contain drop-shadow-2xl"
                    style={{ transform: 'scale(0.95)' }}
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
      <footer className="h-10 border-t border-[var(--border-base)] bg-[var(--bg-panel)] shrink-0 flex divide-x divide-[var(--border-base)]">
         <button onClick={copyToClipboard} className="flex-1 ss-btn border-none hover:bg-white hover:text-black transition-colors uppercase font-bold text-[9px]">Copy Source Code</button>
         <button onClick={() => {setSceneCode(null); setViewMode('image'); setHistory([]);}} className="flex-1 ss-btn border-none hover:bg-white hover:text-black transition-colors uppercase font-bold text-[9px]">Flush Cache</button>
         <button 
          onClick={downloadSceneHtml}
          disabled={!sceneCode}
          className={`flex-1 ss-btn border-none transition-colors uppercase font-bold text-[9px] ${sceneCode ? 'ss-btn-active hover:bg-white hover:text-black' : 'opacity-20'}`}
         >
          Export 3D Scene
         </button>
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

