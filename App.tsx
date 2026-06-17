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

type Language = 'en' | 'ja';

const TRANSLATIONS = {
  en: {
    tabText: "TEXT",
    tabMark: "MARK MAKER",
    tabStyle: "STYLING",
    tab3d: "3D STUDIO",
    apiTitle: "API KEY CONFIG",
    apiDesc: "API key is required to use Mark Maker.",
    saveClose: "SAVE & CLOSE",
    baseImageTooltip: "Show 2D Base Image",
    scene3dTooltip: "Show 3D Preview",
    bgModeTooltip: "Toggle Background (Transparent/Solid)",
    resetViewTooltip: "Reset View & Zoom",
    construct3dTooltip: "Generate/Update 3D Model",
    btnCopySource: "COPY 3D SOURCE",
    copySourceTooltip: "Copy HTML source code for rendering 3D model",
    btnPngSolid: "PNG (SOLID)",
    pngSolidTooltip: "Download PNG with solid background",
    btnPngAlpha: "PNG (ALPHA)",
    pngAlphaTooltip: "Download PNG with transparent background",
    btnSaveCache: "SAVE TO CACHE",
    saveCacheTooltip: "Save current 3D settings and image to cache",
    btnClearCache: "CLEAR CACHE",
    clearCacheTooltip: "Clear cache and 3D preview",
    btnExport3d: "EXPORT 3D",
    export3dTooltip: "Export 3D model as HTML file",
    appTitle: "SOLID LOGO & TYPOGRAPHY STUDIO",
    labelTextInput: "TEXT INPUT",
    labelFontSelection: "FONT SELECTION",
    labelTextAlign: "TEXT ALIGN",
    labelLineHeight: "LINE HEIGHT",
    labelFontWeight: "FONT WEIGHT",
    labelLetterSpacing: "LETTER SPACING",
    labelTransform: "TEXT TRANSFORM",
    valUppercase: "UPPERCASE",
    valNone: "NONE",
    labelOrnaments: "ORNAMENTS",
    labelBasePanel: "BASE PANEL SETTINGS",
    labelBgColor: "BACKGROUND COLOR",
    labelPadding: "PADDING",
    labelTrimSpace: "TRIM TRANSPARENT SPACE",
    descMark1: "Uses Google Gemini 2.5 Flash to automatically generate black & white typography/marks.",
    descMark2: "Wait around 10-15 seconds.",
    phMark: "e.g., Dragon and Geometric Patterns",
    btnGenerateMark: "GENERATE MARK",
    statusGenerating: "Generating...",
    labelStock: "STOCKS",
    labelSelectedActions: "ACTIONS FOR SELECTED",
    btnLocalFile: "LOCAL FILE",
    btnDownload: "DOWNLOAD",
    btnInvert: "INVERT",
    btnRemove: "REMOVE",
    btnAttach: "ATTACH TO BASE",
    btnRemoveAttach: "REMOVE FROM BASE",
    labelEffect: "EFFECT TYPE",
    labelGeometry: "GEOMETRY SETTINGS",
    labelDepth: "DEPTH",
    labelSize: "SIZE",
    labelGap: "GAP",
    labelLight: "LIGHTING & ENVIRONMENT",
    labelSpeed: "ROTATION SPEED",
    labelMetalness: "METALNESS",
    labelRoughness: "ROUGHNESS",
    labelHistory: "CACHE HISTORY",
    statusReady: "APP_READY",
    statusGeneratingBase: "GENERATING_BASE_IMAGE...",
    statusFetching3d: "FETCHING_3D_SCENE...",
    statusError: "ERROR_OCCURRED",
    themeLabel: "THEME:",
    ornamentNone: "None",
    ornamentBorder: "Bauhaus Border",
    ornamentCircle: "Bauhaus Circle",
    ornamentWings: "Retro Wings",
    ornamentLine: "Horizontal Line",
    tabTextLabel: "TEXT",
    tabMarkLabel: "AI MARK",
    tabStyleLabel: "DESIGN",
    tab3dLabel: "3D ENGINE",
    markMakerPromptDesc: "AI generates black and white marks based on motives.",
    markMakerResultDesc: "Click an image to apply it to the canvas and render in 3D.",
    markBtnUploadTooltip: "Import Local Image",
    markInvertTooltip: "Invert Colors",
    markAddStockTooltip: "Add to Stock",
    markPngTooltip: "Download PNG (Solid)",
    markPngAlphaTooltip: "Download PNG (Transparent)",
    markDeleteTooltip: "Delete",
    btnGenerateMarkStop: "Stop Generation",
    generateTwiceBtn: "Generate 2 Variations",
    emptyStockMsg: "No stocks available. Upload from the top right button.",
    labelMotif: "Logo Motif",
    labelResult: "Generated Results",
    labelMainText: "Main Text",
    labelSubText: "Sub Text",
    btnApply: "Apply",
    labelAttachedBase: "Attached Base Image",
    labelScale: "Scale",
    labelOffsetX: "Offset X",
    labelOffsetY: "Offset Y",
    labelOffset: "PLACEMENT OFFSET",
    labelMainX: "MAIN X",
    labelMainY: "MAIN Y",
    labelSubX: "SUB X",
    labelSubY: "SUB Y",
    labelAISettings: "AI MARK SETTINGS",
    labelMarkX: "MARK X",
    labelMarkY: "MARK Y",
    labelCharSettings: "CHAR SETTINGS",
    labelAlignLeft: "Left",
    labelAlignCenter: "Center",
    labelAlignRight: "Right",
    labelMainTracking: "MAIN TRACK",
    labelSubTracking: "SUB TRACK",
    labelMainLineSpace: "MAIN LINE",
    labelSubLineSpace: "SUB LINE",
    labelGrid: "GRID",
    labelColorSettings: "COLOR SETTINGS",
    labelFaceColor: "FACE",
    labelSideColor: "SIDE",
    labelBgColor2: "BG",
    labelOrnament1: "ORNAMENT 1",
    labelOrnament2: "ORNAMENT 2",
    labelHorizontalPos: "POS X",
    labelVerticalPos: "POS Y",
    labelOrnamentScale: "SCALE",
    labelOrnamentWidth: "WIDTH",
    labelOrnamentThickness: "THICKNESS",
    labelOrnamentDash: "DASH",
    labelResolution: "RESOLUTION",
    labelAutoRotate: "AUTO ROTATE",
    label2DSkew: "2D SKEW",
    labelSkewX: "SKEW X",
    labelSkewY: "SKEW Y",
    labelRenderSettings: "RENDER SETTINGS",
    labelMeshDensity: "MESH DENSITY",
    labelExtrudeDepth: "EXTRUDE DEPTH",
    labelAutoRotate2: "AUTO ROTATE",
    btnConfigExport: "EXPORT",
    btnConfigImport: "IMPORT",
    label3DEffects: "3D EFFECTS"
  },
  ja: {
    tabText: "TEXT",
    tabMark: "MARK MAKER",
    tabStyle: "STYLING",
    tab3d: "3D STUDIO",
    apiTitle: "API KEY CONFIG",
    apiDesc: "MARK MAKER（画像生成）機能を使用するには、APIキーの設定が必要です。",
    saveClose: "保存して閉じる",
    baseImageTooltip: "2Dベース画像を表示",
    scene3dTooltip: "3Dプレビューを表示",
    bgModeTooltip: "背景モード切替（透過 / ベタ塗り）",
    resetViewTooltip: "表示位置とズームをリセット",
    construct3dTooltip: "3Dモデルを生成・更新",
    btnCopySource: "COPY 3D SOURCE",
    copySourceTooltip: "3Dモデルを描画するHTMLソースコードをクリップボードにコピーします",
    btnPngSolid: "PNG (SOLID)",
    pngSolidTooltip: "背景色を含めたPNG画像としてダウンロードします",
    btnPngAlpha: "PNG (ALPHA)",
    pngAlphaTooltip: "背景を透過したPNG画像としてダウンロードします",
    btnSaveCache: "SAVE TO CACHE",
    saveCacheTooltip: "現在の3D設定と画像をキャッシュに保存します",
    btnClearCache: "CLEAR CACHE",
    clearCacheTooltip: "キャッシュと3Dプレビューをリセットします",
    btnExport3d: "EXPORT 3D",
    export3dTooltip: "3DモデルをHTMLファイルとしてエクスポートします",
    appTitle: "SOLID LOGO & TYPOGRAPHY STUDIO",
    labelTextInput: "テキスト入力",
    labelFontSelection: "フォント選択",
    labelTextAlign: "テキスト配置",
    labelLineHeight: "行の高さ",
    labelFontWeight: "フォントウェイト",
    labelLetterSpacing: "文字間隔 (TRACKING)",
    labelTransform: "テキスト変換",
    valUppercase: "すべて大文字",
    valNone: "なし",
    labelOrnaments: "装飾",
    labelBasePanel: "ベースパネル設定",
    labelBgColor: "背景色",
    labelPadding: "パディング",
    labelTrimSpace: "透明な余白をトリミングする",
    descMark1: "Google Gemini 2.5 Flashを使用して、白黒のタイポグラフィとマークを自動生成します。",
    descMark2: "約10〜15秒お待ちください。",
    phMark: "例：龍、幾何学模様、歯車など",
    btnGenerateMark: "GENERATE MARK",
    statusGenerating: "生成中...",
    labelStock: "ストック",
    labelSelectedActions: "選択中のアクション",
    btnLocalFile: "LOCAL FILE",
    btnDownload: "DOWNLOAD",
    btnInvert: "色反転 (INVERT)",
    btnRemove: "削除",
    btnAttach: "ベース画像を添付",
    btnRemoveAttach: "ベースから削除",
    labelEffect: "エフェクトタイプ",
    labelGeometry: "ジオメトリ設定",
    labelDepth: "深度 (DEPTH)",
    labelSize: "SIZE",
    labelGap: "間隔 (GAP)",
    labelLight: "環境光・マテリアル",
    labelSpeed: "回転速度",
    labelMetalness: "金属感 (METALNESS)",
    labelRoughness: "粗さ (ROUGHNESS)",
    labelHistory: "キャッシュ履歴",
    statusReady: "APP_READY",
    statusGeneratingBase: "GENERATING_BASE_IMAGE...",
    statusFetching3d: "FETCHING_3D_SCENE...",
    statusError: "ERROR_OCCURRED",
    themeLabel: "テーマ:",
    ornamentNone: "なし",
    ornamentBorder: "バウハウス枠",
    ornamentCircle: "バウハウス円",
    ornamentWings: "レトロウィング",
    ornamentLine: "水平線",
    tabTextLabel: "テキスト",
    tabMarkLabel: "AIマーク",
    tabStyleLabel: "デザイン",
    tab3dLabel: "3Dエンジン",
    markMakerPromptDesc: "AIがモチーフから白黒のマークを生成します。",
    markMakerResultDesc: "画像をクリックするとキャンバスに適用され、3D化されます。",
    markBtnUploadTooltip: "画像をインポート",
    markInvertTooltip: "白黒反転",
    markAddStockTooltip: "ストックに追加",
    markPngTooltip: "PNG(透過なし)ダウンロード",
    markPngAlphaTooltip: "PNG(透過)ダウンロード",
    markDeleteTooltip: "削除",
    btnGenerateMarkStop: "生成を停止",
    generateTwiceBtn: "2パターン生成する",
    emptyStockMsg: "ストックはありません。<br/>右上のボタンからアップロードできます。",
    labelMotif: "ロゴのモチーフ",
    labelResult: "生成結果一覧",
    labelMainText: "メインテキスト",
    labelSubText: "サブテキスト",
    btnApply: "適用",
    labelAttachedBase: "貼り付けられたベース画像",
    labelScale: "スケール",
    labelOffsetX: "オフセット X",
    labelOffsetY: "オフセット Y",
    labelOffset: "配置オフセット",
    labelMainX: "メインX軸",
    labelMainY: "メインY軸",
    labelSubX: "サブX軸",
    labelSubY: "サブY軸",
    labelAISettings: "AIマーク設定",
    labelMarkX: "マークX軸",
    labelMarkY: "マークY軸",
    labelCharSettings: "文字設定",
    labelAlignLeft: "左揃え",
    labelAlignCenter: "中央",
    labelAlignRight: "右揃え",
    labelMainTracking: "メイン字送り",
    labelSubTracking: "サブ字送り",
    labelMainLineSpace: "メイン行間隔",
    labelSubLineSpace: "サブ行間隔",
    labelGrid: "グリッド表示",
    labelColorSettings: "カラー設定",
    labelFaceColor: "表面色",
    labelSideColor: "側面色",
    labelBgColor2: "背景色",
    labelOrnament1: "装飾 1",
    labelOrnament2: "装飾 2",
    labelHorizontalPos: "X軸",
    labelVerticalPos: "Y軸",
    labelOrnamentScale: "全体ｽｹｰﾙ",
    labelOrnamentWidth: "水平ｽｹｰﾙ",
    labelOrnamentThickness: "太さ",
    labelOrnamentDash: "破線間隔",
    labelResolution: "解像度・品質",
    labelAutoRotate: "自動回転",
    label2DSkew: "2D歪み",
    labelSkewX: "水平傾斜",
    labelSkewY: "垂直傾斜",
    labelRenderSettings: "レンダリング設定",
    labelMeshDensity: "メッシュ密度",
    labelExtrudeDepth: "押し出し厚さ",
    labelAutoRotate2: "自動回転",
    btnConfigExport: "EXPORT",
    btnConfigImport: "IMPORT",
    label3DEffects: "3Dエフェクト"
  }
};

function useTranslation(lang: Language) {
  return (key: keyof typeof TRANSLATIONS['en']) => TRANSLATIONS[lang][key] || key;
}

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
  { id: 'none', labelKey: 'ornamentNone' as const },
  { id: 'bauhaus_border', labelKey: 'ornamentBorder' as const },
  { id: 'bauhaus_circle', labelKey: 'ornamentCircle' as const },
  { id: 'retro_wings', labelKey: 'ornamentWings' as const },
  { id: 'horizontal_line', labelKey: 'ornamentLine' as const }
];

const ResetBtn = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="opacity-50 hover:opacity-100 hover:text-emerald-400 p-1" title="Reset">
    <RotateCcw size={10} />
  </button>
);

function trimCanvas(canvas: HTMLCanvasElement, originX?: number, originY?: number): string {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas.toDataURL('image/png');
  
  const width = canvas.width;
  const height = canvas.height;
  const pixels = ctx.getImageData(0, 0, width, height);
  const l = pixels.data.length;
  
  const cx = originX !== undefined ? originX : Math.floor(width / 2);
  const cy = originY !== undefined ? originY : Math.floor(height / 2);
  let maxDx = 0;
  let maxDy = 0;
  
  // Find boundaries relative to center
  for (let i = 0; i < l; i += 4) {
    if (pixels.data[i + 3] > 0) { // alpha > 0
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      const dx = Math.abs(x - cx);
      const dy = Math.abs(y - cy);
      if (dx > maxDx) maxDx = dx;
      if (dy > maxDy) maxDy = dy;
    }
  }

  // If empty, return original
  if (maxDx === 0 && maxDy === 0) {
    return canvas.toDataURL('image/png');
  }

  const padding = 120; // Safe padding for shadows
  maxDx += padding;
  maxDy += padding;

  const trimWidth = Math.max(1, maxDx * 2);
  const trimHeight = Math.max(1, maxDy * 2);

  const startX = cx - maxDx;
  const startY = cy - maxDy;

  const trimmed = document.createElement('canvas');
  trimmed.width = trimWidth;
  trimmed.height = trimHeight;
  const tCtx = trimmed.getContext('2d');
  if (tCtx) {
    try {
      tCtx.putImageData(ctx.getImageData(startX, startY, trimWidth, trimHeight), 0, 0);
    } catch(e) {
      console.warn("trimCanvas putImageData failed", e);
    }
  }
  return trimmed.toDataURL('image/png');
}

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('solid_typography_lang') as Language) || 'ja');
  useEffect(() => { localStorage.setItem('solid_typography_lang', lang); }, [lang]);
  const t = useTranslation(lang);

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
  const [prompt, setPrompt] = useState(() => localStorage.getItem('solid_typography_prompt') || 'WATANABE');
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

  const [mainOffsetX, setMainOffsetX] = useState(0);
  const [mainOffsetY, setMainOffsetY] = useState(-50);

  const [subOffsetX, setSubOffsetX] = useState(0);
  const [subOffsetY, setSubOffsetY] = useState(100);
  
  const [textAlign, setTextAlign] = useState<'left'|'center'|'right'>('center');
  const [mainLetterSpacing, setMainLetterSpacing] = useState(5);
  const [mainLineHeight, setMainLineHeight] = useState(1.2);
  const [subLetterSpacing, setSubLetterSpacing] = useState(5);
  const [subLineHeight, setSubLineHeight] = useState(1.5);
  
  // DESIGN
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const [colorFace, setColorFace] = useState(() => localStorage.getItem('solid_typography_colorFace') || '#000000');
  useEffect(() => localStorage.setItem('solid_typography_colorFace', colorFace), [colorFace]);

  const [colorMain, setColorMain] = useState(() => localStorage.getItem('solid_typography_colorMain') || localStorage.getItem('solid_typography_colorFace') || '#000000');
  useEffect(() => localStorage.setItem('solid_typography_colorMain', colorMain), [colorMain]);

  const [colorSub, setColorSub] = useState(() => localStorage.getItem('solid_typography_colorSub') || localStorage.getItem('solid_typography_colorFace') || '#000000');
  useEffect(() => localStorage.setItem('solid_typography_colorSub', colorSub), [colorSub]);

  const [colorMark, setColorMark] = useState(() => localStorage.getItem('solid_typography_colorMark') || localStorage.getItem('solid_typography_colorFace') || '#000000');
  useEffect(() => localStorage.setItem('solid_typography_colorMark', colorMark), [colorMark]);

  const [colorSide, setColorSide] = useState(() => localStorage.getItem('solid_typography_colorSide') || '#808080');
  useEffect(() => localStorage.setItem('solid_typography_colorSide', colorSide), [colorSide]);

  const [bgColor, setBgColor] = useState(() => localStorage.getItem('solid_typography_bgColor') || '#FFFFFF');
  useEffect(() => localStorage.setItem('solid_typography_bgColor', bgColor), [bgColor]);
  const [ornaments, setOrnaments] = useState<{ type: string, offsetX: number, offsetY: number, scale: number, width: number, thickness: number, dash: number, color: string, outlineColor?: string, outlineWidth?: number }[]>(() => {
    try {
      const saved = localStorage.getItem('solid_typography_ornaments');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { type: 'bauhaus_circle', offsetX: 0, offsetY: 0, scale: 0.35, width: 1.0, thickness: 13, dash: 15, color: '#000000' },
      { type: 'horizontal_line', offsetX: 0, offsetY: 90, scale: 1.0, width: 2.2, thickness: 5, dash: 0, color: '#000000' }
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

  const [outlineMain, setOutlineMain] = useState('#000000');
  const [outlineWidthMain, setOutlineWidthMain] = useState(0);
  const [outlineSub, setOutlineSub] = useState('#000000');
  const [outlineWidthSub, setOutlineWidthSub] = useState(0);
  const [outlineMark, setOutlineMark] = useState('#000000');
  const [outlineWidthMark, setOutlineWidthMark] = useState(0);

  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(5);
  
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
  const [imageZoom, setImageZoom] = useState(1.0);
  const [previewBgMode, setPreviewBgMode] = useState<'transparent' | 'solid'>('solid');
  const [showGrid, setShowGrid] = useState(true);
  const isDraggingImage = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== 'image') return;
    setImageZoom(prev => Math.max(0.1, Math.min(5.0, prev - e.deltaY * 0.001)));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (viewMode === 'image' && (e.button === 0 || e.button === 2)) {
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
    mainOffsetX, mainOffsetY,
    subOffsetX, subOffsetY,
    textAlign, mainLetterSpacing, mainLineHeight, subLetterSpacing, subLineHeight,
    skewX, skewY, colorFace, colorMain, colorSub, colorMark, colorSide, bgColor,
    outlineMain, outlineWidthMain, outlineSub, outlineWidthSub, outlineMark, outlineWidthMark,
    shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY,
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
            if (settings.mainOffsetX !== undefined) setMainOffsetX(settings.mainOffsetX);
            if (settings.mainOffsetY !== undefined) setMainOffsetY(settings.mainOffsetY);
            if (settings.subOffsetX !== undefined) setSubOffsetX(settings.subOffsetX);
            if (settings.subOffsetY !== undefined) setSubOffsetY(settings.subOffsetY);
            if (settings.textAlign !== undefined) setTextAlign(settings.textAlign);
            if (settings.mainLetterSpacing !== undefined) setMainLetterSpacing(settings.mainLetterSpacing);
            if (settings.mainLineHeight !== undefined) setMainLineHeight(settings.mainLineHeight);
            if (settings.subLetterSpacing !== undefined) setSubLetterSpacing(settings.subLetterSpacing);
            if (settings.subLineHeight !== undefined) setSubLineHeight(settings.subLineHeight);
            if (settings.skewX !== undefined) setSkewX(settings.skewX);
            if (settings.skewY !== undefined) setSkewY(settings.skewY);
            if (settings.colorFace !== undefined) setColorFace(settings.colorFace);
            if (settings.colorMain !== undefined) setColorMain(settings.colorMain);
            if (settings.colorSub !== undefined) setColorSub(settings.colorSub);
            if (settings.colorMark !== undefined) setColorMark(settings.colorMark);
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
    setPrompt("WATANABE");
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
    setColorFace('#000000');
    setColorSide('#333333');
    setBgColor('#FFFFFF');
    setOrnaments([
      { type: 'bauhaus_circle', offsetX: 0, offsetY: 0, scale: 0.35, width: 1.0, thickness: 13, dash: 15 },
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
  }, [
    prompt, subPrompt, fontMain, sizeMain, fontSub, sizeSub, 
    mainLetterSpacing, mainLineHeight, subLetterSpacing, subLineHeight, 
    textAlign, colorFace, colorMain, colorSub, colorMark, 
    mainOffsetX, mainOffsetY, subOffsetX, subOffsetY, skewX, skewY, 
    JSON.stringify(ornaments), attachedMarkScale, attachedMarkOffsetX, attachedMarkOffsetY,
    outlineMain, outlineWidthMain, outlineSub, outlineWidthSub, outlineMark, outlineWidthMark,
    shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY
  ]);

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
          const palette = [colorFace, colorMain, colorSub, colorMark, outlineMain, outlineSub, outlineMark, shadowColor, ...ornaments.flatMap(o => [o.color || colorFace, o.outlineColor || colorFace])];
          const code = buildThreeJsScene(imageData, effectStyle, resolution, lighting, autoRotate, palette, colorSide, bgColor, thickness, previewBgMode === 'transparent', imageZoom, imagePan.x, imagePan.y);
          setSceneCode(code);
        } catch (e) {
          console.error(e);
        }
      }, 50);
    }
  }, [imageData, effectStyle, resolution, autoRotate, colorFace, colorSide, bgColor, thickness, viewMode, previewBgMode, imageZoom, imagePan.x, imagePan.y]);

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

    const actualLineHeight = sizeMain * mainLineHeight;
    const subLineHeightVal = sizeSub * subLineHeight;
    
    const mainHeight = actualLineHeight * lines.length;
    const subHeight = subLineHeightVal * subLines.length;
    
    const mainTop = mainOffsetY - mainHeight / 2;
    const mainBottom = mainOffsetY + mainHeight / 2;
    const subTop = subOffsetY - subHeight / 2;
    const subBottom = subOffsetY + subHeight / 2;
    
    const baseOrnamentHeight = Math.max(300, 
        Math.max(mainBottom, subBottom) - Math.min(mainTop, subTop)
    );
    
    let minX = 0; let maxX = 0; 
    let minY = mainTop; let maxY = mainBottom;
    if (subLines.length > 0) {
        minY = Math.min(minY, subTop);
        maxY = Math.max(maxY, subBottom);
    }
    
    ornaments.forEach(o => {
        if (o.type !== 'none') {
            const w = 500 * o.width * o.scale;
            const h = (baseOrnamentHeight + 300) * o.scale;
            minX = Math.min(minX, o.offsetX - w/2);
            maxX = Math.max(maxX, o.offsetX + w/2);
            minY = Math.min(minY, o.offsetY - h/2);
            maxY = Math.max(maxY, o.offsetY + h/2);
        }
    });
    
    if (attachedMarkImgRef.current) {
        const mw = attachedMarkImgRef.current.width * attachedMarkScale;
        const mh = attachedMarkImgRef.current.height * attachedMarkScale;
        minX = Math.min(minX, attachedMarkOffsetX - mw/2);
        maxX = Math.max(maxX, attachedMarkOffsetX + mw/2);
        minY = Math.min(minY, attachedMarkOffsetY - mh/2);
        maxY = Math.max(maxY, attachedMarkOffsetY + mh/2);
    }
    
    const skewPadX = Math.abs(skewX)*20;
    const skewPadY = Math.abs(skewY)*20;
    const spacingPad = Math.max(0, mainLetterSpacing * 10, subLetterSpacing * 10);
    minX -= (400 + skewPadX + spacingPad);
    maxX += (400 + skewPadX + spacingPad);
    minY -= (400 + skewPadY);
    maxY += (400 + skewPadY);
    
    const proposedWidth = maxX - minX;
    const proposedHeight = maxY - minY;
    
    canvas.width = Math.min(12000, Math.max(1024, proposedWidth));
    canvas.height = Math.min(12000, Math.max(1024, proposedHeight));
    
    const originX = -minX;
    const originY = -minY;
    
    // Clear background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(originX, originY);
    ctx.transform(1, Math.tan(skewY * Math.PI/180), Math.tan(skewX * Math.PI/180), 1, 0, 0);

    if (shadowBlur > 0) {
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = shadowOffsetX;
      ctx.shadowOffsetY = shadowOffsetY;
    }

    // Ornaments
    ornaments.forEach(o => {
      if (o.type !== 'none') {
        ctx.save();
        ctx.translate(o.offsetX, o.offsetY);

        ctx.strokeStyle = o.color;
        ctx.fillStyle = o.color;
        ctx.lineWidth = o.thickness;
        
        if (o.dash > 0) {
          ctx.setLineDash([o.dash, o.dash]);
        } else {
          ctx.setLineDash([]);
        }
        
        const bbW = 500 * o.width * o.scale;
        const bbH = (baseOrnamentHeight + 80) * o.scale;

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
    ctx.setLineDash([]);
    
    let currentMainY = mainTop + actualLineHeight / 2;

    const getX = (offset: number) => {
      if(textAlign === 'left') return -300 + offset;
      if(textAlign === 'right') return 300 + offset;
      return offset;
    }

    ctx.fillStyle = colorMain;
    ctx.font = `bold ${sizeMain}px ${fontMain}`;
    (ctx as any).letterSpacing = `${mainLetterSpacing}px`;

    lines.forEach(line => {
      if (outlineWidthMain > 0) {
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.lineWidth = outlineWidthMain;
        ctx.strokeStyle = outlineMain;
        ctx.strokeText(line, getX(mainOffsetX), currentMainY);
      }
      ctx.fillText(line, getX(mainOffsetX), currentMainY);
      currentMainY += actualLineHeight;
    });

    if (subLines.length > 0) {
      let currentSubY = subTop + subLineHeightVal / 2;
      ctx.fillStyle = colorSub;
      ctx.font = `bold ${sizeSub}px ${fontSub}`;
      (ctx as any).letterSpacing = `${subLetterSpacing}px`;
      
      subLines.forEach(line => {
        if (outlineWidthSub > 0) {
          ctx.lineJoin = 'round';
          ctx.miterLimit = 2;
          ctx.lineWidth = outlineWidthSub;
          ctx.strokeStyle = outlineSub;
          ctx.strokeText(line, getX(subOffsetX), currentSubY);
        }
        ctx.fillText(line, getX(subOffsetX), currentSubY);
        currentSubY += subLineHeightVal;
      });
    }

    if (attachedMarkImgRef.current) {
        ctx.save();
        ctx.translate(attachedMarkOffsetX, attachedMarkOffsetY);
        ctx.scale(attachedMarkScale, attachedMarkScale);
        
        const markCanvas = document.createElement('canvas');
        markCanvas.width = attachedMarkImgRef.current.width;
        markCanvas.height = attachedMarkImgRef.current.height;
        const mctx = markCanvas.getContext('2d')!;
        mctx.drawImage(attachedMarkImgRef.current, 0, 0);
        mctx.globalCompositeOperation = 'source-in';
        mctx.fillStyle = colorMark;
        mctx.fillRect(0, 0, markCanvas.width, markCanvas.height);
        
        // rudimentary stroke for mark
        if (outlineWidthMark > 0) {
           ctx.shadowColor = 'transparent'; // temporally disable
           const steps = Math.max(16, Math.min(64, Math.ceil(outlineWidthMark * 2)));
           const radius = outlineWidthMark;
           
           // We need a separate canvas to create the outline
           const outlineCanvas = document.createElement('canvas');
           outlineCanvas.width = markCanvas.width + radius * 2;
           outlineCanvas.height = markCanvas.height + radius * 2;
           const octx = outlineCanvas.getContext('2d')!;
           
           // Draw shadow/outline by shifting the image
           for (let i=0; i<steps; i++) {
               const angle = (i / steps) * Math.PI * 2;
               const dx = Math.cos(angle) * radius;
               const dy = Math.sin(angle) * radius;
               octx.drawImage(attachedMarkImgRef.current, radius + dx, radius + dy);
           }
           
           // Fill it with outline color
           octx.globalCompositeOperation = 'source-in';
           octx.fillStyle = outlineMark;
           octx.fillRect(0, 0, outlineCanvas.width, outlineCanvas.height);

           // Draw outline behind the original mark
           ctx.drawImage(outlineCanvas, -outlineCanvas.width / 2, -outlineCanvas.height / 2);
        }
        
        // Draw original mark over the outline
        ctx.drawImage(markCanvas, -markCanvas.width / 2, -markCanvas.height / 2);
        
        ctx.restore();
    }

    ctx.restore();

    setImageData(trimCanvas(canvas, originX, originY));
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
        const palette = [colorFace, colorMain, colorSub, colorMark, outlineMain, outlineSub, outlineMark, shadowColor, ...ornaments.flatMap(o => [o.color || colorFace, o.outlineColor || colorFace])];
        const code = buildThreeJsScene(imageData, effectStyle, resolution, lighting, autoRotate, palette, colorSide, bgColor, thickness, previewBgMode === 'transparent', imageZoom, imagePan.x, imagePan.y);
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
        if (setts.mainOffsetX !== undefined) setMainOffsetX(setts.mainOffsetX);
        if (setts.mainOffsetY !== undefined) setMainOffsetY(setts.mainOffsetY);
        if (setts.subOffsetX !== undefined) setSubOffsetX(setts.subOffsetX);
        if (setts.subOffsetY !== undefined) setSubOffsetY(setts.subOffsetY);
        if (setts.textAlign !== undefined) setTextAlign(setts.textAlign);
        if (setts.mainLetterSpacing !== undefined) setMainLetterSpacing(setts.mainLetterSpacing);
        if (setts.mainLineHeight !== undefined) setMainLineHeight(setts.mainLineHeight);
        if (setts.subLetterSpacing !== undefined) setSubLetterSpacing(setts.subLetterSpacing);
        if (setts.subLineHeight !== undefined) setSubLineHeight(setts.subLineHeight);
        if (setts.skewX !== undefined) setSkewX(setts.skewX);
        if (setts.skewY !== undefined) setSkewY(setts.skewY);
        if (setts.colorFace !== undefined) setColorFace(setts.colorFace);
        if (setts.colorMain !== undefined) setColorMain(setts.colorMain);
        if (setts.colorSub !== undefined) setColorSub(setts.colorSub);
        if (setts.colorMark !== undefined) setColorMark(setts.colorMark);
        if (setts.colorSide !== undefined) setColorSide(setts.colorSide);
        if (setts.bgColor !== undefined) setBgColor(setts.bgColor);
        if (setts.outlineMain !== undefined) setOutlineMain(setts.outlineMain);
        if (setts.outlineWidthMain !== undefined) setOutlineWidthMain(setts.outlineWidthMain);
        if (setts.outlineSub !== undefined) setOutlineSub(setts.outlineSub);
        if (setts.outlineWidthSub !== undefined) setOutlineWidthSub(setts.outlineWidthSub);
        if (setts.outlineMark !== undefined) setOutlineMark(setts.outlineMark);
        if (setts.outlineWidthMark !== undefined) setOutlineWidthMark(setts.outlineWidthMark);
        if (setts.shadowColor !== undefined) setShadowColor(setts.shadowColor);
        if (setts.shadowBlur !== undefined) setShadowBlur(setts.shadowBlur);
        if (setts.shadowOffsetX !== undefined) setShadowOffsetX(setts.shadowOffsetX);
        if (setts.shadowOffsetY !== undefined) setShadowOffsetY(setts.shadowOffsetY);
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
    'WHITE': 'from-[#edf1f5] to-[#e2e8f0]',
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
          <div className="flex items-center gap-1 border border-[#2d3a4d] rounded overflow-hidden mr-2">
             <button onClick={() => setLang('en')} className={`px-2 py-0.5 text-[9px] font-bold ${lang === 'en' ? 'bg-white text-black' : 'text-[#4e5d74] hover:text-[var(--text-bright)]'} transition-colors`}>EN</button>
             <button onClick={() => setLang('ja')} className={`px-2 py-0.5 text-[9px] font-bold ${lang === 'ja' ? 'bg-white text-black' : 'text-[#4e5d74] hover:text-[var(--text-bright)]'} transition-colors`}>JP</button>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'idle' ? 'bg-[#00FFFF]' : 'bg-yellow-500 animate-pulse'}`}></div>
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
            <button onClick={() => setActiveTab('text')} className={`flex-1 py-3 text-[9px] font-bold tracking-wider transition-colors ${activeTab === 'text' ? 'text-[#00FFFF] bg-[var(--bg-btn-active)]' : 'text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]'}`}>{t('tabTextLabel')}</button>
            <button onClick={() => setActiveTab('mark')} className={`flex-1 py-3 text-[9px] font-bold tracking-wider transition-colors ${activeTab === 'mark' ? 'text-[#00FFFF] bg-[var(--bg-btn-active)]' : 'text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]'}`}>{t('tabMarkLabel')}</button>
            <button onClick={() => setActiveTab('style')} className={`flex-1 py-3 text-[9px] font-bold tracking-wider transition-colors ${activeTab === 'style' ? 'text-[#00FFFF] bg-[var(--bg-btn-active)]' : 'text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]'}`}>{t('tabStyleLabel')}</button>
            <button onClick={() => setActiveTab('3d')} className={`flex-1 py-3 text-[9px] font-bold tracking-wider transition-colors ${activeTab === '3d' ? 'text-[#00FFFF] bg-[var(--bg-btn-active)]' : 'text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]'}`}>{t('tab3dLabel')}</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          
          {activeTab === 'mark' && (
            <div className="flex flex-col gap-4 animate-fade-in relative">
              <div className="ss-panel p-3">
                <div className="ss-label mb-2 mt-1 flex justify-between items-center">
                  <div>
                    <span className="ss-number">01</span>
                    <span className="ss-title">{t('labelMotif')}</span>
                  </div>
                  <button onClick={() => setShowApiSettings(!showApiSettings)} className="text-[var(--text-base)] hover:text-[var(--text-bright)]" title="API Settings">
                    <Settings size={12} />
                  </button>
                </div>
                
                {showApiSettings && (
                  <div className="mb-4 p-3 bg-black/40 border border-[#343d4a] rounded shadow-lg">
                    <div className="text-[10px] text-[#8a95a3] mb-2">{t('apiTitle')}</div>
                    <input 
                      type="password" 
                      className="ss-input py-1.5 px-2 text-[10px] w-full mb-1" 
                      placeholder="API KEY" 
                      value={customApiKey} 
                      onChange={e => handleCustomApiKey(e.target.value)}
                    />
                    <div className="text-[8px] text-[#4e5d74]">{t('apiDesc')}</div>
                  </div>
                )}

                <input 
                  type="text" 
                  className="ss-input py-2 px-3 text-[12px] h-10 w-full mb-3" 
                  placeholder={t('phMark')} 
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
                    <Zap size={12}/>{t('generateTwiceBtn')}
                  </button>
                ) : (
                  <button 
                    className="ss-btn ss-btn-primary border-red-500 text-red-500 bg-transparent hover:bg-red-500/10 mb-2 w-full flex items-center justify-center gap-2"
                    onClick={handleCancelAiGeneration}
                  >
                    <span className="animate-pulse flex items-center justify-center gap-2 w-full"><Square fill="currentColor" size={10} /> {t('btnGenerateMarkStop')}</span>
                  </button>
                )}
                <div className="text-[9px] text-[#4e5d74] text-center mt-1">
                  {t('markMakerPromptDesc')}
                </div>
              </div>

              {generatedMarks.length > 0 && (
                <div className="ss-panel p-3">
                  <div className="ss-label mb-3 mt-1 flex justify-between items-center">
                    <div>
                      <span className="ss-number">02</span>
                      <span className="ss-title">{t('labelResult')}</span>
                    </div>
                    <ResetBtn onClick={() => setGeneratedMarks([])} />
                  </div>
                  <div className="text-[10px] text-[var(--text-base)] mb-3 leading-relaxed">
                    {t('markMakerResultDesc')}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {generatedMarks.map((markBase64, idx) => (
                      <div 
                        key={idx} 
                        className="group relative aspect-square bg-white border border-[var(--border-base)] rounded cursor-pointer hover:border-[#00FFFF] transition-colors flex items-center justify-center p-2 overflow-hidden bg-white"
                        onClick={() => processGeneratedMark(markBase64)}
                      >
                        <img src={markBase64} alt={`Mark ${idx}`} className="w-full h-full object-contain" />
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-black/80 p-1 rounded">
                           <button onClick={(e) => { e.stopPropagation(); handleInvert(markBase64, idx, undefined); }} className="text-[var(--text-base)] hover:text-[var(--text-bright)] p-0.5" title={t('markInvertTooltip')}>
                             <Contrast size={12} />
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); handleStockAdd(markBase64); }} className="text-[var(--text-base)] hover:text-[#00FFFF] p-0.5" title={t('markAddStockTooltip')}>
                             <BookmarkPlus size={12} />
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); downloadPng(markBase64, false); }} className="text-[var(--text-base)] hover:text-blue-500 p-0.5" title={t('markPngTooltip')}>
                             <ImageIcon size={12} />
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); downloadPng(markBase64, true); }} className="text-[var(--text-base)] hover:text-blue-500 p-0.5" title={t('markPngAlphaTooltip')}>
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
                      <span className="ss-title">{t('labelStock')} ({stockedMarks.length})</span>
                    </div>
                    <div>
                      <label className="cursor-pointer text-[var(--text-base)] hover:text-[var(--text-bright)] transition-colors bg-[var(--bg-btn)] hover:bg-[var(--bg-btn-active)] border border-[var(--border-base)] p-1 rounded inline-flex items-center" title={t('markBtnUploadTooltip')}>
                        <Upload size={14} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleLocalImageUpload} />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-3 pt-2 pb-2 bg-[var(--bg-panel)] border border-[var(--border-base)] rounded justify-center items-center">
                     <span className="text-[10px] text-[var(--text-base)] font-bold tracking-widest mr-2">MENU</span>
                     <button onClick={handleSelectedInvert} disabled={selectedStockId === null} className={`p-1 transition-colors ${selectedStockId !== null ? 'text-[var(--text-base)] hover:text-[var(--text-bright)] cursor-pointer' : 'opacity-40 cursor-not-allowed'}`} title={t('markInvertTooltip')}>
                       <Contrast size={12} />
                     </button>
                     <button onClick={() => handleSelectedDownload(false)} disabled={selectedStockId === null} className={`p-1 transition-colors ${selectedStockId !== null ? 'text-[var(--text-base)] hover:text-blue-500 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`} title={t('markPngTooltip')}>
                       <ImageIcon size={12} />
                     </button>
                     <button onClick={() => handleSelectedDownload(true)} disabled={selectedStockId === null} className={`p-1 transition-colors ${selectedStockId !== null ? 'text-[var(--text-base)] hover:text-blue-500 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`} title={t('markPngAlphaTooltip')}>
                       <Download size={12} />
                     </button>
                     <button onClick={handleSelectedRemove} disabled={selectedStockId === null} className={`p-1 ml-1 ${selectedStockId !== null ? 'text-gray-300 hover:text-red-400 cursor-pointer' : 'text-gray-600 cursor-not-allowed'}`} title={t('markDeleteTooltip')}>
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
                          className={`group relative aspect-square bg-white border ${isSelected ? 'border-[#00FFFF] scale-95' : 'border-[var(--border-base)] hover:border-[#00FFFF]'} rounded cursor-pointer transition-all flex items-center justify-center p-1.5 overflow-hidden`}
                          onClick={() => processGeneratedMark(markBase64)}
                        >
                          <img src={markBase64} alt={`Stock ${idx}`} className={`w-full h-full object-contain ${isSelected ? 'opacity-80' : ''}`} />
                          <div 
                            className={`absolute top-1 right-1 w-4 h-4 bg-black/60 border border-gray-400 rounded-sm flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} 
                            onClick={(e) => { e.stopPropagation(); toggleStockSelection(idx); }}
                          >
                            {isSelected && <div className="w-2 h-2 bg-[#00FFFF] rounded-sm" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  ) : (
                    <div className="text-center py-6 text-[10px] text-gray-500 border border-dashed border-[#2d3a4d] rounded mt-2" dangerouslySetInnerHTML={{__html: t('emptyStockMsg')}}>
                    </div>
                  )}
                </div>
            </div>
          )}

          {activeTab === 'text' && (
            <>
            {attachedMark && (
              <div className="ss-panel p-3 animate-fade-in">
                <div className="ss-label mb-2 mt-1 flex justify-between items-center w-full">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="ss-number">01</span>
                    <span className="ss-title">AI MARK</span>
                    <button onClick={() => setAttachedMark(null)} className="opacity-50 hover:opacity-100 p-1 transition-opacity text-[var(--text-base)] hover:text-white" title={t('markDeleteTooltip')}>
                      <Trash2 size={12} />
                    </button>
                    <div className="flex-1"></div>
                    <span className="flex items-center gap-1">
                      EDGE <input type="color" value={outlineMark} onChange={e => setOutlineMark(e.target.value)} className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0" />
                    </span>
                    <span className="flex items-center gap-1">
                      COLOR <input type="color" value={colorMark} onChange={e => setColorMark(e.target.value)} className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0" />
                    </span>
                  </div>
                </div>
                <div className="ss-label mb-2 text-[9px] flex items-center mt-3">
                  <span>EDGE WIDTH</span><span className="ml-auto opacity-70 mr-2">{outlineWidthMark}PX</span><ResetBtn onClick={() => setOutlineWidthMark(0)} />
                </div>
                <input type="range" min="0" max="100" step="1" value={outlineWidthMark} onChange={e => setOutlineWidthMark(Number(e.target.value))} className="ss-slider mb-4" />

                <div className="ss-label mb-2 text-[9px] flex items-center mt-3">
                  <span>{t('labelScale')}</span><span className="ml-auto opacity-70 mr-2">{attachedMarkScale.toFixed(2)}</span><ResetBtn onClick={() => setAttachedMarkScale(1.0)} />
                </div>
                <input type="range" min="0.1" max="15.0" step="0.1" value={attachedMarkScale} onChange={e => setAttachedMarkScale(Number(e.target.value))} className="ss-slider mb-4" />

                <div className="ss-label mb-2 text-[9px] flex items-center">
                  <span>{t('labelMarkX')}</span><span className="ml-auto opacity-70 mr-2">{attachedMarkOffsetX}PX</span><ResetBtn onClick={() => setAttachedMarkOffsetX(0)} />
                </div>
                <input type="range" min="-1500" max="1500" step="10" value={attachedMarkOffsetX} onChange={e => setAttachedMarkOffsetX(Number(e.target.value))} className="ss-slider mb-4" />
                
                <div className="ss-label mb-2 text-[9px] flex items-center">
                  <span>{t('labelMarkY')}</span><span className="ml-auto opacity-70 mr-2">{attachedMarkOffsetY}PX</span><ResetBtn onClick={() => setAttachedMarkOffsetY(-150)} />
                </div>
                <input type="range" min="-1500" max="1500" step="10" value={attachedMarkOffsetY} onChange={e => setAttachedMarkOffsetY(Number(e.target.value))} className="ss-slider mb-2" />
              </div>
            )}

            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1">
                <span className="ss-number">{attachedMark ? '02' : '01'}</span>
                <span className="ss-title flex-1">{t('labelMainText')}</span>
                <span className="flex items-center gap-1 mx-2">
                  EDGE <input type="color" value={outlineMain} onChange={e => setOutlineMain(e.target.value)} className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0" />
                </span>
                <span className="flex items-center gap-1">
                  COLOR <input type="color" value={colorMain} onChange={e => setColorMain(e.target.value)} className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0" />
                </span>
              </div>
               <textarea 
                className="ss-input py-2 px-3 text-[12px] h-16 resize-none leading-relaxed mb-3" 
                value={prompt} onChange={e => setPrompt(e.target.value)}
              />
              <select value={fontMain} onChange={e => setFontMain(e.target.value)} className="ss-select w-full mb-3" style={{ fontFamily: fontMain }}>
                {FONTS.map(f => <option key={f.name} value={f.value} style={{fontFamily: f.value}}>{f.name}</option>)}
              </select>
              <div className="ss-label mb-2 flex items-center">
                <span>{t('labelSize')}</span><span className="ml-auto opacity-70 mr-2">{sizeMain}PX</span><ResetBtn onClick={() => setSizeMain(160)} />
              </div>
              <input type="range" min="40" max="400" step="10" value={sizeMain} onChange={e => setSizeMain(Number(e.target.value))} className="ss-slider mb-4" />

              <div className="ss-label mb-2 flex items-center">
                <span>EDGE WIDTH</span><span className="ml-auto opacity-70 mr-2">{outlineWidthMain}PX</span><ResetBtn onClick={() => setOutlineWidthMain(0)} />
              </div>
              <input type="range" min="0" max="50" step="1" value={outlineWidthMain} onChange={e => setOutlineWidthMain(Number(e.target.value))} className="ss-slider mb-4" />

              <div className="ss-label mb-2 flex items-center">
                <span>{t('labelMainTracking')}</span><span className="ml-auto opacity-70 mr-2">{mainLetterSpacing}PX</span><ResetBtn onClick={() => setMainLetterSpacing(5)} />
              </div>
              <input type="range" min="-20" max="100" step="1" value={mainLetterSpacing} onChange={e => setMainLetterSpacing(Number(e.target.value))} className="ss-slider mb-4" />

              <div className="ss-label mb-2 flex items-center">
                <span>{t('labelMainLineSpace')}</span><span className="ml-auto opacity-70 mr-2">{mainLineHeight.toFixed(1)}</span><ResetBtn onClick={() => setMainLineHeight(1.2)} />
              </div>
              <input type="range" min="0.5" max="3.0" step="0.1" value={mainLineHeight} onChange={e => setMainLineHeight(Number(e.target.value))} className="ss-slider mb-4" />

              <div className="ss-label mb-2 text-[9px] flex items-center">
                <span>{t('labelMainX')}</span><span className="ml-auto opacity-70 mr-2">{mainOffsetX}PX</span><ResetBtn onClick={() => setMainOffsetX(0)} />
              </div>
              <input type="range" min="-1500" max="1500" step="10" value={mainOffsetX} onChange={e => setMainOffsetX(Number(e.target.value))} className="ss-slider mb-4" />
              
              <div className="ss-label mb-2 text-[9px] flex items-center">
                <span>{t('labelMainY')}</span><span className="ml-auto opacity-70 mr-2">{mainOffsetY}PX</span><ResetBtn onClick={() => setMainOffsetY(-50)} />
              </div>
              <input type="range" min="-1500" max="1500" step="10" value={mainOffsetY} onChange={e => setMainOffsetY(Number(e.target.value))} className="ss-slider mb-2" />
            </div>

            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1">
                <span className="ss-number">{attachedMark ? '03' : '02'}</span>
                <span className="ss-title flex-1">{t('labelSubText')}</span>
                <span className="flex items-center gap-1 mx-2">
                  EDGE <input type="color" value={outlineSub} onChange={e => setOutlineSub(e.target.value)} className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0" />
                </span>
                <span className="flex items-center gap-1">
                  COLOR <input type="color" value={colorSub} onChange={e => setColorSub(e.target.value)} className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0" />
                </span>
              </div>
               <textarea 
                className="ss-input py-2 px-3 text-[10px] h-12 resize-none leading-relaxed mb-3" 
                value={subPrompt} onChange={e => setSubPrompt(e.target.value)}
              />
              <select value={fontSub} onChange={e => setFontSub(e.target.value)} className="ss-select w-full mb-3" style={{ fontFamily: fontSub }}>
                {FONTS.map(f => <option key={f.name} value={f.value} style={{fontFamily: f.value}}>{f.name}</option>)}
              </select>
              <div className="ss-label mb-2 flex items-center">
                <span>{t('labelSize')}</span><span className="ml-auto opacity-70 mr-2">{sizeSub}PX</span><ResetBtn onClick={() => setSizeSub(30)} />
              </div>
              <input type="range" min="10" max="100" step="1" value={sizeSub} onChange={e => setSizeSub(Number(e.target.value))} className="ss-slider mb-4" />

              <div className="ss-label mb-2 flex items-center">
                <span>EDGE WIDTH</span><span className="ml-auto opacity-70 mr-2">{outlineWidthSub}PX</span><ResetBtn onClick={() => setOutlineWidthSub(0)} />
              </div>
              <input type="range" min="0" max="50" step="1" value={outlineWidthSub} onChange={e => setOutlineWidthSub(Number(e.target.value))} className="ss-slider mb-4" />

              <div className="ss-label mb-2 flex items-center">
                <span>{t('labelSubTracking')}</span><span className="ml-auto opacity-70 mr-2">{subLetterSpacing}PX</span><ResetBtn onClick={() => setSubLetterSpacing(5)} />
              </div>
              <input type="range" min="-20" max="100" step="1" value={subLetterSpacing} onChange={e => setSubLetterSpacing(Number(e.target.value))} className="ss-slider mb-4" />

              <div className="ss-label mb-2 flex items-center">
                <span>{t('labelSubLineSpace')}</span><span className="ml-auto opacity-70 mr-2">{subLineHeight.toFixed(1)}</span><ResetBtn onClick={() => setSubLineHeight(1.5)} />
              </div>
              <input type="range" min="0.5" max="3.0" step="0.1" value={subLineHeight} onChange={e => setSubLineHeight(Number(e.target.value))} className="ss-slider mb-4" />

              <div className="ss-label mb-2 text-[9px] flex items-center">
                <span>{t('labelSubX')}</span><span className="ml-auto opacity-70 mr-2">{subOffsetX}PX</span><ResetBtn onClick={() => setSubOffsetX(0)} />
              </div>
              <input type="range" min="-1500" max="1500" step="10" value={subOffsetX} onChange={e => setSubOffsetX(Number(e.target.value))} className="ss-slider mb-4" />
              
              <div className="ss-label mb-2 text-[9px] flex items-center">
                <span>{t('labelSubY')}</span><span className="ml-auto opacity-70 mr-2">{subOffsetY}PX</span><ResetBtn onClick={() => setSubOffsetY(100)} />
              </div>
              <input type="range" min="-1500" max="1500" step="10" value={subOffsetY} onChange={e => setSubOffsetY(Number(e.target.value))} className="ss-slider mb-2" />
            </div>

            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1">
                <span className="ss-number">{attachedMark ? '04' : '03'}</span>
                <span className="ss-title">{t('labelCharSettings')}</span>
              </div>

              <div className="flex justify-between items-center gap-2 mb-2 mt-3">
                <button 
                  onClick={() => setTextAlign('left')} 
                  className={`flex-1 ss-btn py-1.5 flex justify-center ${textAlign === 'left' ? 'ss-btn-active' : ''}`}
                >
                  {t('labelAlignLeft')}
                </button>
                <button 
                  onClick={() => setTextAlign('center')} 
                  className={`flex-1 ss-btn py-1.5 flex justify-center ${textAlign === 'center' ? 'ss-btn-active' : ''}`}
                >
                  {t('labelAlignCenter')}
                </button>
                <button 
                  onClick={() => setTextAlign('right')} 
                  className={`flex-1 ss-btn py-1.5 flex justify-center ${textAlign === 'right' ? 'ss-btn-active' : ''}`}
                >
                  {t('labelAlignRight')}
                </button>
              </div>
            </div>
            </>
          )}

          {activeTab === 'style' && (
            <>
            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1">
                <span className="ss-number">01</span>
                <span className="ss-title">{t('labelColorSettings')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div>
                  <div className="ss-label mb-1 text-[8px] justify-between">{t('labelFaceColor')} <ResetBtn onClick={() => {
                    const c = '#F0E6D2';
                    setColorFace(c); setColorMain(c); setColorSub(c); setColorMark(c); setOrnaments(ornaments.map(o => ({...o, color: c})));
                  }} /></div>
                  <div className="flex bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                    <input type="color" value={colorFace} onChange={e => {
                      const c = e.target.value;
                      setColorFace(c); setColorMain(c); setColorSub(c); setColorMark(c); setOrnaments(ornaments.map(o => ({...o, color: c})));
                    }} className="w-full h-8 cursor-pointer border-none bg-transparent" />
                  </div>
                </div>
                <div>
                  <div className="ss-label mb-1 text-[8px] justify-between">{t('labelSideColor')} <ResetBtn onClick={() => setColorSide('#808080')} /></div>
                  <div className="flex bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                    <input type="color" value={colorSide} onChange={e => setColorSide(e.target.value)} className="w-full h-8 cursor-pointer border-none bg-transparent" />
                  </div>
                </div>
                <div>
                  <div className="ss-label mb-1 text-[8px] justify-between">{t('labelBgColor2')} <ResetBtn onClick={() => setBgColor('#1A1A1A')} /></div>
                  <div className="flex bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-8 cursor-pointer border-none bg-transparent" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => { 
                    const c = '#000000';
                    setColorFace(c); setColorMain(c); setColorSub(c); setColorMark(c); setOrnaments(ornaments.map(o => ({...o, color: c})));
                    setColorSide('#333333'); 
                    setBgColor('#FFFFFF'); 
                  }}
                  className="flex-1 ss-btn py-1 px-2 border border-[#2d3a4d] text-[9px] hover:bg-white hover:text-black flex items-center justify-center gap-1 transition-colors"
                >
                  <div className="w-2 h-2 bg-black border border-gray-400"></div> B on W
                </button>
                <button 
                  onClick={() => { 
                    const c = '#FFFFFF';
                    setColorFace(c); setColorMain(c); setColorSub(c); setColorMark(c); setOrnaments(ornaments.map(o => ({...o, color: c})));
                    setColorSide('#CCCCCC'); 
                    setBgColor('#000000'); 
                  }}
                  className="flex-1 ss-btn py-1 px-2 border border-[#2d3a4d] text-[9px] hover:bg-white hover:text-black flex items-center justify-center gap-1 transition-colors"
                >
                  <div className="w-2 h-2 bg-white border border-gray-400"></div> W on B
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-base)]">
                <div className="ss-label mb-2 text-[10px] flex items-center">
                   <span className="flex-1">SHADOW</span>
                   COLOR <input type="color" value={shadowColor} onChange={e => setShadowColor(e.target.value)} className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0 ml-2" />
                </div>
                <div className="ss-label mb-2 text-[9px] flex items-center mt-3">
                  <span>BLUR</span><span className="ml-auto opacity-70 mr-2">{shadowBlur}PX</span><ResetBtn onClick={() => setShadowBlur(0)} />
                </div>
                <input type="range" min="0" max="100" step="1" value={shadowBlur} onChange={e => setShadowBlur(Number(e.target.value))} className="ss-slider mb-3" />
                
                <div className="flex gap-2">
                   <div className="flex-1">
                     <div className="ss-label mb-2 text-[9px] flex items-center">
                       <span>OFFSET X</span><span className="ml-auto opacity-70 mr-1">{shadowOffsetX}</span><ResetBtn onClick={() => setShadowOffsetX(0)} />
                     </div>
                     <input type="range" min="-100" max="100" step="1" value={shadowOffsetX} onChange={e => setShadowOffsetX(Number(e.target.value))} className="ss-slider mb-2" />
                   </div>
                   <div className="flex-1">
                     <div className="ss-label mb-2 text-[9px] flex items-center">
                       <span>OFFSET Y</span><span className="ml-auto opacity-70 mr-1">{shadowOffsetY}</span><ResetBtn onClick={() => setShadowOffsetY(5)} />
                     </div>
                     <input type="range" min="-100" max="100" step="1" value={shadowOffsetY} onChange={e => setShadowOffsetY(Number(e.target.value))} className="ss-slider mb-2" />
                   </div>
                </div>
              </div>
            </div>

            <div className="ss-panel p-3 animate-fade-in">
              <div className="ss-label mb-2 mt-1 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="ss-number">02</span>
                  <span className="ss-title">{t('labelOrnament1')}</span>
                  {ornaments[0].type !== 'none' && (
                    <span className="flex items-center gap-1 ml-2 text-[var(--text-base)]">
                      COLOR <input type="color" value={ornaments[0].color} onChange={e => {
                        const newOrn = [...ornaments];
                        newOrn[0].color = e.target.value;
                        setOrnaments(newOrn);
                      }} className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0" />
                    </span>
                  )}
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
                {ORNAMENTS.map(o => <option key={o.id} value={o.id}>{t(o.labelKey as any)}</option>)}
              </select>
              
              {ornaments[0].type !== 'none' && (
                <div className="animate-fade-in mt-2 border-t border-[var(--border-base)] pt-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>{t('labelHorizontalPos')}</span><span className="ml-auto opacity-70 mr-1">{ornaments[0].offsetX}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[0].offsetX = 0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="-1000" max="1000" step="10" value={ornaments[0].offsetX} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[0].offsetX = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-4" />
                    </div>
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>{t('labelVerticalPos')}</span><span className="ml-auto opacity-70 mr-1">{ornaments[0].offsetY}</span>
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
                        <span>{t('labelOrnamentScale')}</span><span className="ml-auto opacity-70 mr-1">{ornaments[0].scale.toFixed(1)}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[0].scale = 1.0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="0.1" max="5.0" step="0.1" value={ornaments[0].scale} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[0].scale = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-4" />
                    </div>
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>{t('labelOrnamentWidth')}</span><span className="ml-auto opacity-70 mr-1">{ornaments[0].width.toFixed(1)}</span>
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
                        <span>{t('labelOrnamentThickness')}</span><span className="ml-auto opacity-70 mr-1">{ornaments[0].thickness}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[0].thickness = 15; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="1" max="100" step="1" value={ornaments[0].thickness} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[0].thickness = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-2" />
                    </div>
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>{t('labelOrnamentDash')}</span><span className="ml-auto opacity-70 mr-1">{ornaments[0].dash}</span>
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
                <div className="flex items-center gap-2">
                  <span className="ss-number">03</span>
                  <span className="ss-title">{t('labelOrnament2')}</span>
                  {ornaments[1].type !== 'none' && (
                    <span className="flex items-center gap-1 ml-2 text-[var(--text-base)]">
                      COLOR <input type="color" value={ornaments[1].color} onChange={e => {
                        const newOrn = [...ornaments];
                        newOrn[1].color = e.target.value;
                        setOrnaments(newOrn);
                      }} className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0" />
                    </span>
                  )}
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
                {ORNAMENTS.map(o => <option key={o.id} value={o.id}>{t(o.labelKey as any)}</option>)}
              </select>
              
              {ornaments[1].type !== 'none' && (
                <div className="animate-fade-in mt-2 border-t border-[var(--border-base)] pt-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>{t('labelHorizontalPos')}</span><span className="ml-auto opacity-70 mr-1">{ornaments[1].offsetX}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[1].offsetX = 0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="-1000" max="1000" step="10" value={ornaments[1].offsetX} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[1].offsetX = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-4" />
                    </div>
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>{t('labelVerticalPos')}</span><span className="ml-auto opacity-70 mr-1">{ornaments[1].offsetY}</span>
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
                        <span>{t('labelOrnamentScale')}</span><span className="ml-auto opacity-70 mr-1">{ornaments[1].scale.toFixed(1)}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[1].scale = 1.0; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="0.1" max="5.0" step="0.1" value={ornaments[1].scale} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[1].scale = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-4" />
                    </div>
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>{t('labelOrnamentWidth')}</span><span className="ml-auto opacity-70 mr-1">{ornaments[1].width.toFixed(1)}</span>
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
                        <span>{t('labelOrnamentThickness')}</span><span className="ml-auto opacity-70 mr-1">{ornaments[1].thickness}</span>
                        <ResetBtn onClick={() => { const newOrn = [...ornaments]; newOrn[1].thickness = 15; setOrnaments(newOrn); }} />
                      </div>
                      <input type="range" min="1" max="100" step="1" value={ornaments[1].thickness} onChange={e => {
                        const newOrn = [...ornaments]; newOrn[1].thickness = Number(e.target.value); setOrnaments(newOrn);
                      }} className="ss-slider mb-2" />
                    </div>
                    <div className="flex-1">
                      <div className="ss-label mb-2 text-[9px] flex items-center">
                        <span>{t('labelOrnamentDash')}</span><span className="ml-auto opacity-70 mr-1">{ornaments[1].dash}</span>
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
                  <span className="ss-title">{t('label2DSkew')}</span>
                </div>
                <ResetBtn onClick={() => { setSkewX(0); setSkewY(0); }} />
              </div>
              
              <div className="ss-label mb-2 mt-4 text-[9px] flex items-center">
                <span>{t('labelSkewX')}</span><span className="ml-auto opacity-70 mr-2">{skewX}°</span><ResetBtn onClick={() => setSkewX(0)} />
              </div>
              <input type="range" min="-45" max="45" step="1" value={skewX} onChange={e => setSkewX(Number(e.target.value))} className="ss-slider mb-2" />

              <div className="ss-label mb-2 mt-4 text-[9px] flex items-center">
                <span>{t('labelSkewY')}</span><span className="ml-auto opacity-70 mr-2">{skewY}°</span><ResetBtn onClick={() => setSkewY(0)} />
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
                <span className="ss-title">{t('labelRenderSettings')}</span> 
              </div>
              <div className="ss-label mb-2 mt-3 text-[10px]">
                <span className="">{t('labelMeshDensity')}</span>
                <span className="ml-auto opacity-70 mr-2">{resolution}</span><ResetBtn onClick={() => setResolution(128)} />
              </div>
              <input type="range" min="32" max="512" step="16" value={resolution} onChange={e => setResolution(Number(e.target.value))} className="ss-slider" />

              <div className="ss-label mb-2 mt-4 text-[10px] flex items-center">
                <span>{t('labelExtrudeDepth')}</span><span className="ml-auto opacity-70 mr-2">{thickness.toFixed(1)}</span><ResetBtn onClick={() => setThickness(5)}/>
              </div>
              <input type="range" min="0.1" max="20" step="0.5" value={thickness} onChange={e => setThickness(Number(e.target.value))} className="ss-slider" />

              <div className="ss-label mb-2 mt-4 text-[10px]">
                <span className="">{t('labelAutoRotate2')}</span>
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
                <span className="ss-title">{t('label3DEffects')}</span>
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
              className={`w-full ss-btn py-2 flex items-center justify-center gap-1 transition-colors !bg-transparent ${uiTheme === 'WHITE' ? '!border-black !text-black hover:!bg-black hover:!text-white' : '!border-white !text-white hover:!bg-white hover:!text-black'}`}
            >
              <Download size={12} /> <span className="text-[9px] tracking-widest font-bold">{t('btnConfigExport')}</span>
            </button>
            <label className={`w-full ss-btn py-2 flex items-center justify-center gap-1 transition-colors cursor-pointer !bg-transparent ${uiTheme === 'WHITE' ? '!border-black !text-black hover:!bg-black hover:!text-white' : '!border-white !text-white hover:!bg-white hover:!text-black'}`}>
              <Upload size={12} /> <span className="text-[9px] tracking-widest font-bold">{t('btnConfigImport')}</span>
              <input type="file" accept=".json" className="hidden" onChange={importSettings} />
            </label>
          </div>
        </aside>

        {/* MAIN VIEWPORT */}
        <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg-main)]/20 relative">
          {/* Viewport Header */}
          <div className="flex bg-[var(--bg-panel)]/60 border-b border-[var(--border-base)] shrink-0 h-[42px]">
            
            <div className="flex-1 px-4 flex items-center">
               {viewMode === 'image' && (
                 <div className="flex gap-2 h-[28px]">
                   <button 
                    onClick={() => setPreviewBgMode(p => p === 'transparent' ? 'solid' : 'transparent')}
                    className="ss-btn !flex-none w-[220px] !py-0 flex gap-2 items-center justify-center tracking-widest transition-colors active:!scale-100"
                    title="背景モード切替（透過 / ベタ塗り）"
                   >
                     <Contrast size={12} /> 
                     <span className="text-[10px] font-bold flex gap-1">
                       BACKGROUND MODE: 
                       <span className="inline-block w-[40px] text-left">{previewBgMode === 'transparent' ? 'ALPHA' : 'SOLID'}</span>
                     </span>
                   </button>
                   <button onClick={() => setShowGrid(!showGrid)} className="ss-btn !flex-none min-w-[140px] px-3 w-auto !py-0 flex gap-2 items-center justify-center tracking-widest transition-colors active:!scale-100" title="Toggle Grid overlay">
                     <Grid size={12} /> <span className="text-[10px] font-bold whitespace-nowrap">{t('labelGrid')}: {showGrid ? 'ON' : 'OFF'}</span>
                   </button>
                   <button onClick={() => { setImagePan({x:0, y:0}); setImageZoom(1.0); }} className="ss-btn !flex-none w-[140px] !py-0 flex gap-2 items-center justify-center tracking-widest transition-colors active:!scale-100" title="表示位置とズームをリセット">
                     <Maximize2 size={12} /> <span className="text-[10px] font-bold">RESET VIEW</span>
                   </button>
                 </div>
               )}
            </div>

            <div className="flex shrink-0">
               <button 
                onClick={() => setViewMode('image')} 
                className={`w-[140px] px-4 py-0 flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-wider transition-colors border-l border-[var(--border-base)] ${viewMode === 'image' ? 'text-[#00FFFF] bg-[var(--bg-btn-active)]' : 'text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]'}`} 
                title="2Dベース画像を表示"
              >
                <Type size={14} /> <span>BASE_MAP</span>
              </button>
               <button 
                onClick={handleConstructScene} 
                disabled={status !== 'idle' || !imageData} 
                className={`w-[160px] px-4 py-0 flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-wider transition-colors border-l border-[var(--border-base)]
                  ${viewMode === 'scene' 
                    ? 'text-[#00FFFF] bg-[var(--bg-btn-active)]' 
                    : 'text-white bg-[#2d3a4d] hover:bg-[#3a4a5e]'}
                  ${(status !== 'idle' && status !== 'generating_scene') || !imageData ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                title="3Dモデルを生成・更新"
              >
                {viewMode === 'scene' ? (
                  <>
                    <ImageIcon size={14} className={status === 'generating_scene' ? 'animate-spin' : ''} /> 
                    <span>3D_STUDIO</span>
                  </>
                ) : (
                  <>
                    <Cpu size={14} className={status === 'generating_scene' ? 'animate-spin' : ''} /> 
                    <span>CONSTRUCT_3D</span>
                  </>
                )}
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
              style={
                previewBgMode === 'solid' ? { 
                  backgroundColor: bgColor,
                  backgroundImage: 'none'
                } : {
                  backgroundColor: '#f3f4f6',
                  backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb), linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 10px 10px'
                }
              }
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
                <div className="w-full h-full flex items-center justify-center overflow-hidden relative cursor-grab active:cursor-grabbing">
                  <div 
                    className="relative flex items-center justify-center pointer-events-none"
                    style={{ transform: `translate(${imagePan.x}px, ${imagePan.y}px) scale(${imageZoom * 0.5})` }}
                  >
                    {showGrid && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 z-0">
                        <div className="w-[3000px] h-[1px] bg-[#666666] absolute"></div>
                        <div className="h-[3000px] w-[1px] bg-[#666666] absolute"></div>
                        <div className="w-[100px] h-[100px] border border-[#666666] rounded-full absolute"></div>
                        <span className="absolute -mt-[110px] text-[#666666] text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full border border-[#666666]/30 bg-[#111] bg-opacity-10 backdrop-blur-sm">CENTER (0,0)</span>
                      </div>
                    )}
                    <img 
                      src={imageData} 
                      alt="2D Preview"
                      className="relative z-10 pointer-events-none max-w-none max-h-none"
                      style={{ filter: previewBgMode === 'transparent' ? 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.5))' : 'none' }}
                    />
                  </div>
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
              <span className="ss-title">{t('labelLight')}</span> 
              <span className="ml-auto text-white text-[10px]">{lighting.toFixed(1)}</span>
            </div>
            <input type="range" min="0.1" max="3.0" step="0.1" value={lighting} onChange={e => setLighting(Number(e.target.value))} className="ss-slider" />
          </div>

          <div className="ss-label">
            <span className="ss-number">06</span>
            <span className="ss-title">{t('themeLabel')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
             {Object.keys(themeClasses).map(th => (
                <button key={th} onClick={() => setUiTheme(th)} className={`ss-btn py-1.5 ${uiTheme === th ? 'ss-btn-active' : ''}`}>{th}</button>
              ))}
          </div>
          
          <div className="h-[1px] bg-[var(--border-base)] my-2"></div>
          
          <div className="ss-label">
            <span className="ss-number">07</span>
            <span className="ss-title">{t('labelHistory')}</span>
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
         <button onClick={copyToClipboard} title="3Dモデルを描画するHTMLソースコードをクリップボードにコピーします" className="flex-1 bg-[var(--bg-btn)] hover:bg-[var(--bg-btn-active)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] text-[var(--text-base)] hover:text-[var(--text-bright)] tracking-widest flex items-center justify-center">COPY 3D SOURCE</button>
         
         <div className="flex-[2] flex gap-3">
           <button onClick={() => handleExport2D(false)} title="背景色を含めたPNG画像としてダウンロードします" disabled={!imageData} className={`flex-1 bg-[var(--bg-btn)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] tracking-widest flex items-center justify-center ${imageData ? 'hover:bg-[var(--bg-btn-active)] text-[var(--text-base)] hover:text-[var(--text-bright)] cursor-pointer' : 'opacity-50 text-[var(--text-base)] cursor-not-allowed'}`}>PNG (SOLID)</button>
           <button onClick={() => handleExport2D(true)} title="背景を透過したPNG画像としてダウンロードします" disabled={!imageData} className={`flex-1 bg-[var(--bg-btn)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] tracking-widest flex items-center justify-center ${imageData ? 'hover:bg-[var(--bg-btn-active)] text-[#00FFFF] hover:opacity-80 cursor-pointer' : 'opacity-50 text-[var(--text-base)] cursor-not-allowed'}`}>PNG (ALPHA)</button>
         </div>
         
         <button onClick={handleSaveToCache} title="現在の3D設定と画像をキャッシュに保存します" disabled={!imageData} className={`flex-1 bg-[var(--bg-btn)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] tracking-widest flex items-center justify-center ${imageData ? 'hover:bg-[var(--bg-btn-active)] text-[var(--text-base)] hover:text-[var(--text-bright)] cursor-pointer' : 'opacity-50 text-[var(--text-base)] cursor-not-allowed'}`}>SAVE TO CACHE</button>
         
         <button onClick={() => {setSceneCode(null); setViewMode('image'); setHistory([]);}} title="キャッシュと3Dプレビューをリセットします" className="flex-1 bg-[var(--bg-btn)] hover:bg-[var(--bg-btn-active)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] text-red-500 hover:text-red-400 tracking-widest flex items-center justify-center">CLEAR CACHE</button>
         
         <button onClick={downloadSceneHtml} title="3DモデルをHTMLファイルとしてエクスポートします" disabled={!sceneCode} className={`flex-1 bg-[var(--bg-btn)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] tracking-widest flex items-center justify-center ${sceneCode ? 'hover:bg-[var(--bg-btn-active)] text-blue-500 hover:text-blue-400 cursor-pointer' : 'opacity-50 text-[var(--text-base)] cursor-not-allowed'}`}>EXPORT 3D</button>
      </footer>

      {/* DEBUG STRIP */}
      <div className="ss-status-bar h-5 shrink-0 px-6 bg-[var(--bg-panel)] border-t border-[var(--border-base)] flex items-center">
        <div className="flex gap-6 flex-1">
          <span className="flex items-center gap-1 text-[#00FFFF] uppercase font-bold"><CheckCircle2 size={10}/> KERNEL_ACTIVE</span>
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

