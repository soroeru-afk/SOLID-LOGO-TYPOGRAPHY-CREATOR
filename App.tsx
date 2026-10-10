/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
import { buildThreeJsScene } from "./services/sceneBuilder";
import { motion, AnimatePresence } from "motion/react";
import {
  Type,
  Upload,
  Image as ImageIcon,
  Cpu,
  Download,
  RotateCcw,
  Undo2,
  Redo2,
  CheckCircle2,
  Zap,
  Terminal,
  Grid,
  Maximize2,
  Maximize,
  Minimize,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  BookmarkPlus,
  Contrast,
  X,
  Settings,
  Square,
  Eraser,
  FilePlus,
  Shapes,
  Palette,
  Sparkles,
  FileText,
  Layers,
  Eye,
  EyeOff,
  Plus,
  GripVertical,
  ChevronsUp,
  ChevronsDown,
} from "lucide-react";
import { PRESET_PHOTOS, PhotoImageItem } from "./services/presetPhotos";
export const OFFICIAL_ICON_DATA_URL = "data:image/jpeg;base64,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5v8AGmnWL8/8v1yf+2zf41TooAuf2tfH/l8uP+/rf40n9rX2f+Py4/7+t/jVWl5oAtf2vfj/AJfbn/v63+NO/trUB/y/3X/f5v8AGqXNLQBeHiDVF+7qV4PpO/8AjRc69qd5AYJ9Ru54T1jknZlP4E1Q6UpxQAmM0mKUmk6UAFFFFABS4FJRQAUUUUABooooAKKKKACiiigAooooABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAADilpKKACiiigAooooAM0UUUAFFFFABS+tJRQAUUUUAFGKKKAF7UlBOaKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooxQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf//Z";


type AppStatus = "idle" | "generating_scene" | "error";

type Language = "en" | "ja";

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
    descMark1:
      "Uses Google Gemini 2.5 Flash to automatically generate black & white typography/marks.",
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
    ornamentSquare: "Solid Square",
    ornamentCircle: "Solid Circle",
    ornamentSquareLine: "Line Square",
    ornamentCircleLine: "Line Circle",
    ornamentTriangle: "Solid Triangle",
    ornamentTriangleLine: "Line Triangle",
    ornamentLine: "Horizontal Line",
    tabTextLabel: "TEXT",
    tabObjectsLabel: "TEXT & OBJECTS",
    tabMarkLabel: "AI MARK & LOGO",
    tabDataLabel: "DATA",
    tabLayoutColorLabel: "LAYOUT & COLOR",
    tab3dLabel: "3D ENGINE",
    confirmClearAll: "Are you sure you want to clear all tabs?",
    markMakerPromptDesc: "AI generates black and white marks based on motives.",
    markMakerResultDesc:
      "Click an image to apply it to the canvas and render in 3D.",
    markBtnUploadTooltip: "Import Local Image",
    markInvertTooltip: "Invert Colors",
    markAddStockTooltip: "Add to Stock",
    markPngTooltip: "Download PNG (Solid)",
    markPngAlphaTooltip: "Download PNG (Transparent)",
    markDeleteTooltip: "Delete",
    btnGenerateMarkStop: "Stop Generation",
    generateTwiceBtn: "Generate 2 Variations",
    dragAndDropMsg: "Drag & Drop images here to add",
    emptyStockMsg: "No stocks available. Upload from the top right button.",
    labelMotif: "Logo Motif",
    labelResult: "Generated Results",
    labelMainText: "Main Text",
    labelSubText: "Sub Text",
    btnApply: "Apply",
    labelAttachedBase: "Attached Base Image",
    labelScale: "Scale",
    labelGlobalScale: "GLOBAL SCALE",
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
    labelOrnament3: "ORNAMENT 3",
    labelHorizontalPos: "POS X",
    labelVerticalPos: "POS Y",
    labelOrnamentScale: "SCALE",
    labelOrnamentWidth: "WIDTH",
    labelOrnamentThickness: "THICKNESS",
    labelOrnamentDash: "DASH",
    labelOrnamentRotation: "ROTATION",
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
    label3DEffects: "3D EFFECTS",
    btnUndo: "UNDO",
    btnRedo: "REDO",
  },
  ja: {
    tabText: "TEXT",
    tabMark: "MARK MAKER",
    tabStyle: "STYLING",
    tab3d: "3D STUDIO",
    apiTitle: "API KEY CONFIG",
    apiDesc:
      "MARK MAKER（画像生成）機能を使用するには、APIキーの設定が必要です。",
    saveClose: "保存して閉じる",
    baseImageTooltip: "2Dベース画像を表示",
    scene3dTooltip: "3Dプレビューを表示",
    bgModeTooltip: "背景モード切替（透過 / ベタ塗り）",
    resetViewTooltip: "表示位置とズームをリセット",
    construct3dTooltip: "3Dモデルを生成・更新",
    btnCopySource: "COPY 3D SOURCE",
    copySourceTooltip:
      "3Dモデルを描画するHTMLソースコードをクリップボードにコピーします",
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
    descMark1:
      "Google Gemini 2.5 Flashを使用して、白黒のタイポグラフィとマークを自動生成します。",
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
    ornamentSquare: "ベタ塗り 四角",
    ornamentCircle: "ベタ塗り 円",
    ornamentSquareLine: "枠線 四角",
    ornamentCircleLine: "枠線 円",
    ornamentTriangle: "ベタ塗り 三角",
    ornamentTriangleLine: "枠線 三角",
    ornamentLine: "水平線",
    tabTextLabel: "テキスト",
    tabObjectsLabel: "テキスト＆オブジェクト",
    tabMarkLabel: "AI・マーク＆ロゴ",
    tabDataLabel: "データ",
    tabLayoutColorLabel: "レイアウト＆カラー",
    tab3dLabel: "3Dエンジン",
    confirmClearAll: "すべてのタブを削除してもよろしいですか？",
    markMakerPromptDesc: "AIがモチーフから白黒のマークを生成します。",
    markMakerResultDesc:
      "画像をクリックするとキャンバスに適用され、3D化されます。",
    markBtnUploadTooltip: "画像をインポート",
    markInvertTooltip: "白黒反転",
    markAddStockTooltip: "ストックに追加",
    markPngTooltip: "PNG(透過なし)ダウンロード",
    markPngAlphaTooltip: "PNG(透過)ダウンロード",
    markDeleteTooltip: "削除",
    btnGenerateMarkStop: "生成を停止",
    generateTwiceBtn: "2パターン生成する",
    dragAndDropMsg: "画像をドラッグ&ドロップで追加できます",
    emptyStockMsg:
      "ストックはありません。<br/>右上のボタンからアップロードできます。",
    labelMotif: "ロゴのモチーフ",
    labelResult: "生成結果一覧",
    labelMainText: "メインテキスト",
    labelSubText: "サブテキスト",
    btnApply: "適用",
    labelAttachedBase: "貼り付けられたベース画像",
    labelScale: "スケール",
    labelGlobalScale: "全体スケール",
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
    labelOrnament3: "装飾 3",
    labelHorizontalPos: "X軸",
    labelVerticalPos: "Y軸",
    labelOrnamentScale: "全体ｽｹｰﾙ",
    labelOrnamentWidth: "水平ｽｹｰﾙ",
    labelOrnamentThickness: "太さ",
    labelOrnamentDash: "破線間隔",
    labelOrnamentRotation: "回転",
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
    label3DEffects: "3Dエフェクト",
    btnUndo: "戻る",
    btnRedo: "進む",
  },
};

function useTranslation(lang: Language) {
  return (key: keyof (typeof TRANSLATIONS)["en"]) =>
    TRANSLATIONS[lang][key] || key;
}

const FONTS = [
  { name: "Dela Gothic One", value: '"Dela Gothic One", cursive' },
  { name: "Train One", value: '"Train One", cursive' },
  { name: "Reggae One", value: '"Reggae One", cursive' },
  { name: "DotGothic16", value: '"DotGothic16", sans-serif' },
  { name: "M PLUS 1p", value: '"M PLUS 1p", sans-serif' },
  { name: "Noto Sans JP", value: '"Noto Sans JP", sans-serif' },
  { name: "Noto Serif JP", value: '"Noto Serif JP", serif' },
  { name: "Shippori Mincho", value: '"Shippori Mincho", serif' },
  { name: "Hina Mincho", value: '"Hina Mincho", serif' },
  { name: "Zen Old Mincho", value: '"Zen Old Mincho", serif' },
  { name: "Zen Dots", value: '"Zen Dots", cursive' },
  { name: "Rampart One", value: '"Rampart One", cursive' },
  { name: "Kaisei Decol", value: '"Kaisei Decol", serif' },
  { name: "Helvetica", value: "Helvetica, Arial, sans-serif" },
];

const EFFECTS = [
  { id: "solid_voxel", name: "SOLID_VOXELS", prompt: "" },
  { id: "wireframe_block", name: "WIREFRAME_BLOCKS", prompt: "" },
  { id: "dot_matrix", name: "DOT_MATRIX", prompt: "" },
  { id: "dot_matrix_3d", name: "DOT_MATRIX_3D", prompt: "" },
  { id: "clean_flat", name: "CLEAN_FLAT", prompt: "" },
];

const ORNAMENTS = [
  { id: "none", labelKey: "ornamentNone" as const },
  { id: "solid_square", labelKey: "ornamentSquare" as const },
  { id: "solid_circle", labelKey: "ornamentCircle" as const },
  { id: "line_square", labelKey: "ornamentSquareLine" as const },
  { id: "line_circle", labelKey: "ornamentCircleLine" as const },
  { id: "solid_triangle", labelKey: "ornamentTriangle" as const },
  { id: "line_triangle", labelKey: "ornamentTriangleLine" as const },
  { id: "horizontal_line", labelKey: "ornamentLine" as const },
];

const ResetBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="opacity-50 hover:opacity-100 hover:text-emerald-400 p-1"
    title="Reset"
  >
    <RotateCcw size={10} />
  </button>
);

function trimCanvas(
  canvas: HTMLCanvasElement,
  originX?: number,
  originY?: number,
): string {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return canvas.toDataURL("image/png");

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
    if (pixels.data[i + 3] > 0) {
      // alpha > 0
      const x = (i / 4) % width;
      const y = Math.floor(i / 4 / width);
      const dx = Math.abs(x - cx);
      const dy = Math.abs(y - cy);
      if (dx > maxDx) maxDx = dx;
      if (dy > maxDy) maxDy = dy;
    }
  }

  // If empty, return original
  if (maxDx === 0 && maxDy === 0) {
    return canvas.toDataURL("image/png");
  }

  // Safely clamp maxDx and maxDy to canvas bounds so center never shifts
  maxDx = Math.min(maxDx, cx, width - cx);
  maxDy = Math.min(maxDy, cy, height - cy);
  const padding = 120;
  const trimWidth = Math.max(1, maxDx * 2) + padding * 2;
  const trimHeight = Math.max(1, maxDy * 2) + padding * 2;

  const startX = cx - maxDx;
  const startY = cy - maxDy;
  const sourceWidth = maxDx * 2;
  const sourceHeight = maxDy * 2;

  const trimmed = document.createElement("canvas");
  trimmed.width = trimWidth;
  trimmed.height = trimHeight;
  const tCtx = trimmed.getContext("2d");
  if (tCtx) {
    try {
      tCtx.drawImage(
        canvas,
        startX,
        startY,
        sourceWidth,
        sourceHeight,
        padding,
        padding,
        sourceWidth,
        sourceHeight,
      );
    } catch (e) {
      console.warn("trimCanvas drawImage failed", e);
    }
  }
  return trimmed.toDataURL("image/png");
}

const getInitialEffectSettings = () => {
  const defaultEffect = EFFECTS[0].id;
  let effectStyle = defaultEffect;
  try {
    effectStyle =
      localStorage.getItem("solid_typography_effectStyle") || defaultEffect;
  } catch (e) {}

  let resolution = 512;
  let thickness = 20;
  let lighting = 2.0;

  try {
    const savedMapRaw = localStorage.getItem(
      "solid_typography_effect_settings_map",
    );
    if (savedMapRaw) {
      const savedMap = JSON.parse(savedMapRaw);
      if (savedMap[effectStyle]) {
        if (savedMap[effectStyle].resolution !== undefined)
          resolution = savedMap[effectStyle].resolution;
        if (savedMap[effectStyle].thickness !== undefined)
          thickness = savedMap[effectStyle].thickness;
        if (savedMap[effectStyle].lighting !== undefined)
          lighting = savedMap[effectStyle].lighting;
      }
    }
  } catch (e) {}

  return { effectStyle, resolution, thickness, lighting };
};

const App: React.FC = () => {
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("solid_typography_left_width");
    return saved ? parseInt(saved, 10) : 288;
  });
  const [rightSidebarWidth, setRightSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("solid_typography_right_width");
    return saved ? parseInt(saved, 10) : 256;
  });

  useEffect(() => {
    localStorage.setItem(
      "solid_typography_left_width",
      leftSidebarWidth.toString(),
    );
  }, [leftSidebarWidth]);

  useEffect(() => {
    localStorage.setItem(
      "solid_typography_right_width",
      rightSidebarWidth.toString(),
    );
  }, [rightSidebarWidth]);
  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const rightSidebarRef = useRef<HTMLDivElement>(null);

  const handleLeftSidebarResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftSidebarWidth;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(
        200,
        Math.min(startWidth + (e.clientX - startX), 600),
      );
      setLeftSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
  };

  const handleRightSidebarResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightSidebarWidth;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(
        200,
        Math.min(startWidth - (e.clientX - startX), 600),
      );
      setRightSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
  };
  const [lang, setLang] = useState<Language>(
    () => (localStorage.getItem("solid_typography_lang") as Language) || "ja",
  );
  useEffect(() => {
    localStorage.setItem("solid_typography_lang", lang);
  }, [lang]);
  const t = useTranslation(lang);

  const [activeTab, setActiveTab] = useState<"objects" | "mark" | "style" | "image">(
    "objects",
  );
  const [activeRightTab, setActiveRightTab] = useState<"3d" | "data">("3d");

  // MARK MAKER
  const [markPrompt, setMarkPrompt] = useState(
    () =>
      localStorage.getItem("solid_typography_markPrompt") || "龍と幾何学模様",
  );
  useEffect(() => {
    localStorage.setItem("solid_typography_markPrompt", markPrompt);
  }, [markPrompt]);

  const [generatingMarks, setGeneratingMarks] = useState(false);
  const [generatedMarks, setGeneratedMarks] = useState<string[]>([]);
  const [stockedMarks, setStockedMarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("solid_typography_stockedMarks");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!parsed.includes(OFFICIAL_ICON_DATA_URL)) return [OFFICIAL_ICON_DATA_URL, ...parsed];
          return parsed;
        }
      }
    } catch (e) {}
    return [OFFICIAL_ICON_DATA_URL];
  });

  useEffect(() => {
    try {
      localStorage.setItem("solid_typography_stockedMarks", JSON.stringify(stockedMarks));
    } catch (e) {}
  }, [stockedMarks]);
  const [selectedStockIds, setSelectedStockIds] = useState<number[]>([]);
  const [isDragOverStock, setIsDragOverStock] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");
  const handleSetOfficialIcon = () => {
    setAttachedMark(OFFICIAL_ICON_DATA_URL);
    setVisibleMark(true);
    setStockedMarks((prev) => {
      if (!prev.includes(OFFICIAL_ICON_DATA_URL)) {
        return [OFFICIAL_ICON_DATA_URL, ...prev];
      }
      return prev;
    });
  };

  const [showApiSettings, setShowApiSettings] = useState(false);

  const [attachedMark, setAttachedMark] = useState<string | null>(() =>
    localStorage.getItem("solid_typography_attachedMark"),
  );
  useEffect(() => {
    try {
      if (attachedMark === null)
        localStorage.removeItem("solid_typography_attachedMark");
      else localStorage.setItem("solid_typography_attachedMark", attachedMark);
    } catch (e) {
      console.warn("Storage quota exceeded for attachedMark");
      localStorage.removeItem("solid_typography_attachedMark");
    }
  }, [attachedMark]);

  const [attachedMarkScale, setAttachedMarkScale] = useState(() => {
    const s = localStorage.getItem("solid_typography_attachedMarkScale");
    return s ? parseFloat(s) : 1.0;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_attachedMarkScale",
        attachedMarkScale.toString(),
      ),
    [attachedMarkScale],
  );

  const [attachedMarkOffsetX, setAttachedMarkOffsetX] = useState(() => {
    const s = localStorage.getItem("solid_typography_attachedMarkOffsetX");
    return s ? parseInt(s, 10) : 0;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_attachedMarkOffsetX",
        attachedMarkOffsetX.toString(),
      ),
    [attachedMarkOffsetX],
  );

  const [attachedMarkOffsetY, setAttachedMarkOffsetY] = useState(() => {
    const s = localStorage.getItem("solid_typography_attachedMarkOffsetY");
    return s ? parseInt(s, 10) : -150;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_attachedMarkOffsetY",
        attachedMarkOffsetY.toString(),
      ),
    [attachedMarkOffsetY],
  );

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
      const storedMarks = localStorage.getItem("solid_typography_stocks");
      if (storedMarks) setStockedMarks(JSON.parse(storedMarks));
      const storedKey = localStorage.getItem("solid_typography_apikey");
      if (storedKey) setCustomApiKey(storedKey);
    } catch (e) {}
  }, []);

  const handleCustomApiKey = (val: string) => {
    setCustomApiKey(val);
    localStorage.setItem("solid_typography_apikey", val);
  };

  const toggleStockSelection = (idx: number) => {
    setSelectedStockIds((prev) =>
      prev.includes(idx) ? prev.filter((id) => id !== idx) : [...prev, idx],
    );
  };

  const handleSelectedRemove = () => {
    if (selectedStockIds.length === 0) return;
    setStockedMarks((prev) => {
      const next = prev.filter((_, idx) => !selectedStockIds.includes(idx));
      try {
        localStorage.setItem("solid_typography_stocks", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setSelectedStockIds([]);
  };

  const handleSelectedDownload = (transparent: boolean) => {
    selectedStockIds.forEach((idx) => {
      downloadPng(stockedMarks[idx], transparent);
    });
  };

  const handleSelectedInvert = () => {
    selectedStockIds.forEach((idx) => {
      handleInvert(stockedMarks[idx], undefined, idx);
    });
  };

  const handleLocalImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    processImageFiles(Array.from(files));
    event.target.value = ""; // reset
  };

  const processImageFiles = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === "string") {
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
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const isPng = file.type === "image/png" || file.type.includes("png");
            if (isPng) {
              ctx.clearRect(0, 0, w, h);
              ctx.drawImage(img, 0, 0, w, h);
              handleStockAdd(canvas.toDataURL("image/png"));
            } else {
              ctx.fillStyle = "#FFFFFF";
              ctx.fillRect(0, 0, w, h);
              ctx.drawImage(img, 0, 0, w, h);
              handleStockAdd(canvas.toDataURL("image/jpeg", 0.9));
            }
          };
          img.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOverStock = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverStock(true);
  };
  const handleDragLeaveStock = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverStock(false);
  };
  const handleDropStock = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverStock(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFiles(
        Array.from(e.dataTransfer.files).filter((f) =>
          f.type.startsWith("image/"),
        ),
      );
    }
  };

  const handleStockAdd = (base64: string) => {
    setStockedMarks((prev) => {
      const next = [base64, ...prev].slice(0, 50);
      const saveStocksSafe = (arr: string[]) => {
        try {
          localStorage.setItem("solid_typography_stocks", JSON.stringify(arr));
        } catch (e) {
          if (arr.length > 1) {
            saveStocksSafe(arr.slice(0, arr.length - 1));
          } else {
            localStorage.removeItem("solid_typography_stocks");
          }
        }
      };
      saveStocksSafe(next);
      return next;
    });
  };

  const handleStockRemove = (idx: number) => {
    const next = [...stockedMarks];
    next.splice(idx, 1);
    setStockedMarks(next);
    try {
      localStorage.setItem("solid_typography_stocks", JSON.stringify(next));
    } catch (e) {}
  };

  const handleInvert = (
    base64: string,
    applyToGeneratedIdx?: number,
    applyToStockIdx?: number,
  ) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < data.data.length; i += 4) {
        data.data[i] = 255 - data.data[i];
        data.data[i + 1] = 255 - data.data[i + 1];
        data.data[i + 2] = 255 - data.data[i + 2];
      }
      ctx.putImageData(data, 0, 0);
      const inverted = canvas.toDataURL("image/jpeg", 0.9);
      if (applyToGeneratedIdx !== undefined) {
        setGeneratedMarks((prev) => {
          const next = [...prev];
          next[applyToGeneratedIdx] = inverted;
          return next;
        });
      } else if (applyToStockIdx !== undefined) {
        setStockedMarks((prev) => {
          const next = [...prev];
          next[applyToStockIdx] = inverted;
          try {
            localStorage.setItem(
              "solid_typography_stocks",
              JSON.stringify(next),
            );
          } catch (e) {}
          return next;
        });
      }
    };
    img.src = base64;
  };

  const downloadPng = (base64: string, transparent: boolean) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Ensure white bg
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Extract mask with anti-aliasing
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        // Pure white background becomes fully transparent.
        // Dark lines become opaque black.
        // Gray anti-aliased edges become partially transparent black.
        const alpha = 255 - luminance;

        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = alpha;
      }
      ctx.putImageData(imgData, 0, 0);

      const trimmedCanvas = document.createElement("canvas");
      const tempCtx = trimmedCanvas.getContext("2d");
      const tempImg = new Image();
      tempImg.onload = () => {
        trimmedCanvas.width = tempImg.width;
        trimmedCanvas.height = tempImg.height;
        const trimCtx = trimmedCanvas.getContext("2d");
        if (!trimCtx) return;
        if (!transparent) {
          trimCtx.fillStyle = "#FFFFFF";
          trimCtx.fillRect(0, 0, trimmedCanvas.width, trimmedCanvas.height);
        }
        trimCtx.drawImage(tempImg, 0, 0);

        const now = new Date();
        const yyyy = now.getFullYear();
        const MM = String(now.getMonth() + 1).padStart(2, "0");
        const DD = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const dateStr = `${yyyy}${MM}${DD}_${hh}${mm}${ss}`;

        const a = document.createElement("a");
        a.href = trimmedCanvas.toDataURL("image/png");
        a.download = transparent
          ? `mark_transparent_${dateStr}.png`
          : `mark_solid_${dateStr}.png`;
        a.click();
      };
      tempImg.src = trimCanvas(canvas);
    };
    img.src = base64;
  };

  // TEXT
  const [prompt, setPrompt] = useState(
    () => localStorage.getItem("solid_typography_prompt") || "MARK DESIGN",
  );
  useEffect(() => {
    localStorage.setItem("solid_typography_prompt", prompt);
  }, [prompt]);

  const [fontMain, setFontMain] = useState(
    () => localStorage.getItem("solid_typography_fontMain") || FONTS[6].value,
  );
  useEffect(
    () => localStorage.setItem("solid_typography_fontMain", fontMain),
    [fontMain],
  );

  const [sizeMain, setSizeMain] = useState(() => {
    const s = localStorage.getItem("solid_typography_sizeMain");
    return s ? parseInt(s, 10) : 160;
  });
  useEffect(
    () =>
      localStorage.setItem("solid_typography_sizeMain", sizeMain.toString()),
    [sizeMain],
  );

  const [subPrompt, setSubPrompt] = useState(
    () =>
      localStorage.getItem("solid_typography_subPrompt") || "LOGO & TYPOGRAPHY",
  );
  useEffect(() => {
    localStorage.setItem("solid_typography_subPrompt", subPrompt);
  }, [subPrompt]);

  const [fontSub, setFontSub] = useState(
    () => localStorage.getItem("solid_typography_fontSub") || FONTS[1].value,
  );
  useEffect(
    () => localStorage.setItem("solid_typography_fontSub", fontSub),
    [fontSub],
  );

  const [sizeSub, setSizeSub] = useState(() => {
    const s = localStorage.getItem("solid_typography_sizeSub");
    return s ? parseInt(s, 10) : 30;
  });
  useEffect(
    () => localStorage.setItem("solid_typography_sizeSub", sizeSub.toString()),
    [sizeSub],
  );

  const [globalOffsetX, setGlobalOffsetX] = useState(() => {
    const saved = localStorage.getItem("solid_typography_globalOffsetX");
    return saved !== null ? Number(saved) : 0;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_globalOffsetX",
        globalOffsetX.toString(),
      ),
    [globalOffsetX],
  );
  const [globalOffsetY, setGlobalOffsetY] = useState(() => {
    const saved = localStorage.getItem("solid_typography_globalOffsetY");
    return saved !== null ? Number(saved) : 0;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_globalOffsetY",
        globalOffsetY.toString(),
      ),
    [globalOffsetY],
  );
  const [globalScale, setGlobalScale] = useState(() => {
    const saved = localStorage.getItem("solid_typography_globalScale");
    return saved !== null ? Number(saved) : 1.0;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_globalScale",
        globalScale.toString(),
      ),
    [globalScale],
  );
  const [mainOffsetX, setMainOffsetX] = useState(() => {
    const saved = localStorage.getItem("solid_typography_mainOffsetX");
    return saved !== null ? Number(saved) : 0;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_mainOffsetX",
        mainOffsetX.toString(),
      ),
    [mainOffsetX],
  );
  const [mainOffsetY, setMainOffsetY] = useState(() => {
    const saved = localStorage.getItem("solid_typography_mainOffsetY");
    return saved !== null ? Number(saved) : -50;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_mainOffsetY",
        mainOffsetY.toString(),
      ),
    [mainOffsetY],
  );

  const [subOffsetX, setSubOffsetX] = useState(() => {
    const saved = localStorage.getItem("solid_typography_subOffsetX");
    return saved !== null ? Number(saved) : 0;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_subOffsetX",
        subOffsetX.toString(),
      ),
    [subOffsetX],
  );
  const [subOffsetY, setSubOffsetY] = useState(() => {
    const saved = localStorage.getItem("solid_typography_subOffsetY");
    return saved !== null ? Number(saved) : 100;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_subOffsetY",
        subOffsetY.toString(),
      ),
    [subOffsetY],
  );

  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "center",
  );
  const [mainLetterSpacing, setMainLetterSpacing] = useState(() => {
    const saved = localStorage.getItem("solid_typography_mainLetterSpacing");
    return saved !== null ? Number(saved) : 5;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_mainLetterSpacing",
        mainLetterSpacing.toString(),
      ),
    [mainLetterSpacing],
  );
  const [mainLineHeight, setMainLineHeight] = useState(() => {
    const saved = localStorage.getItem("solid_typography_mainLineHeight");
    return saved !== null ? Number(saved) : 1.2;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_mainLineHeight",
        mainLineHeight.toString(),
      ),
    [mainLineHeight],
  );
  const [subLetterSpacing, setSubLetterSpacing] = useState(() => {
    const saved = localStorage.getItem("solid_typography_subLetterSpacing");
    return saved !== null ? Number(saved) : 5;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_subLetterSpacing",
        subLetterSpacing.toString(),
      ),
    [subLetterSpacing],
  );
  const [subLineHeight, setSubLineHeight] = useState(() => {
    const saved = localStorage.getItem("solid_typography_subLineHeight");
    return saved !== null ? Number(saved) : 1.5;
  });
  useEffect(
    () =>
      localStorage.setItem(
        "solid_typography_subLineHeight",
        subLineHeight.toString(),
      ),
    [subLineHeight],
  );

  // DESIGN
  const [skewX, setSkewX] = useState(() => {
    const saved = localStorage.getItem("solid_typography_skewX");
    return saved !== null ? Number(saved) : 0;
  });
  useEffect(
    () => localStorage.setItem("solid_typography_skewX", skewX.toString()),
    [skewX],
  );
  const [skewY, setSkewY] = useState(() => {
    const saved = localStorage.getItem("solid_typography_skewY");
    return saved !== null ? Number(saved) : 0;
  });
  useEffect(
    () => localStorage.setItem("solid_typography_skewY", skewY.toString()),
    [skewY],
  );
  const [colorFace, setColorFace] = useState(
    () => localStorage.getItem("solid_typography_colorFace") || "#000000",
  );
  useEffect(
    () => localStorage.setItem("solid_typography_colorFace", colorFace),
    [colorFace],
  );

  const [colorMain, setColorMain] = useState(
    () =>
      localStorage.getItem("solid_typography_colorMain") ||
      localStorage.getItem("solid_typography_colorFace") ||
      "#000000",
  );
  useEffect(
    () => localStorage.setItem("solid_typography_colorMain", colorMain),
    [colorMain],
  );

  const [colorSub, setColorSub] = useState(
    () =>
      localStorage.getItem("solid_typography_colorSub") ||
      localStorage.getItem("solid_typography_colorFace") ||
      "#000000",
  );
  useEffect(
    () => localStorage.setItem("solid_typography_colorSub", colorSub),
    [colorSub],
  );

  const [colorMark, setColorMark] = useState(
    () =>
      localStorage.getItem("solid_typography_colorMark") ||
      localStorage.getItem("solid_typography_colorFace") ||
      "#000000",
  );
  useEffect(
    () => localStorage.setItem("solid_typography_colorMark", colorMark),
    [colorMark],
  );

  const [colorSide, setColorSide] = useState(
    () => localStorage.getItem("solid_typography_colorSide") || "#808080",
  );
  useEffect(
    () => localStorage.setItem("solid_typography_colorSide", colorSide),
    [colorSide],
  );

  const [bgColor, setBgColor] = useState(
    () => localStorage.getItem("solid_typography_bgColor") || "#FFFFFF",
  );
  useEffect(
    () => localStorage.setItem("solid_typography_bgColor", bgColor),
    [bgColor],
  );
  const [collapsedMark, setCollapsedMark] = useState(true);
  const [collapsedMain, setCollapsedMain] = useState(true);
  const [collapsedSub, setCollapsedSub] = useState(true);
  const [collapsedOrnaments, setCollapsedOrnaments] = useState<boolean[]>([
    true,
    true,
    true,
  ]);
  const [ornaments, setOrnaments] = useState<
    {
      id: number;
      type: string;
      offsetX: number;
      offsetY: number;
      scale: number;
      width: number;
      thickness: number;
      dash: number;
      rotation: number;
      color: string;
      outlineColor?: string;
      outlineWidth?: number;
      visible?: boolean;
    }[]
  >(() => {
    try {
      const saved = localStorage.getItem("solid_typography_ornaments");
      if (saved) {
        let parsed = JSON.parse(saved);
        parsed = parsed.map((p: any, i: number) => ({
          ...p,
          id: p.id || i + 1,
          rotation: p.rotation || 0,
        }));
        while (parsed.length < 3) {
          parsed.push({
            id: parsed.length + 1,
            type: "none",
            offsetX: 0,
            offsetY: parsed.length === 1 ? 90 : -90,
            scale: 1.0,
            width: 2.2,
            thickness: 5,
            dash: 0,
            rotation: 0,
            color: "#000000",
          });
        }
        return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 1,
        type: "solid_circle",
        offsetX: 0,
        offsetY: 0,
        scale: 0.35,
        width: 1.0,
        thickness: 13,
        dash: 15,
        rotation: 0,
        color: "#000000",
      },
      {
        id: 2,
        type: "none",
        offsetX: 0,
        offsetY: 90,
        scale: 1.0,
        width: 2.2,
        thickness: 5,
        dash: 0,
        rotation: 0,
        color: "#000000",
      },
      {
        id: 3,
        type: "none",
        offsetX: 0,
        offsetY: -90,
        scale: 1.0,
        width: 2.2,
        thickness: 5,
        dash: 0,
        rotation: 0,
        color: "#000000",
      },
    ];
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        "solid_typography_ornaments",
        JSON.stringify(ornaments),
      );
    } catch (e) {}
  }, [ornaments]);

  const [photoImages, setPhotoImages] = useState<PhotoImageItem[]>(() => {
    try {
      const saved = localStorage.getItem("solid_typography_photo_images");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: "photo-1",
        name: "🌸 桜と春の花々",
        src: PRESET_PHOTOS[0].dataUrl,
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        opacity: 0.9,
        visible: true,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "solid_typography_photo_images",
        JSON.stringify(photoImages),
      );
    } catch (e) {}
  }, [photoImages]);

  const [collapsedPhotos, setCollapsedPhotos] = useState<{ [id: string]: boolean }>({});
  const [visibleMainText, setVisibleMainText] = useState<boolean>(() => {
    try {
      const s = localStorage.getItem("solid_typography_visibleMainText");
      return s !== null ? JSON.parse(s) : true;
    } catch {
      return true;
    }
  });
  const [visibleSubText, setVisibleSubText] = useState<boolean>(() => {
    try {
      const s = localStorage.getItem("solid_typography_visibleSubText");
      return s !== null ? JSON.parse(s) : true;
    } catch {
      return true;
    }
  });
  const [visibleMark, setVisibleMark] = useState<boolean>(() => {
    try {
      const s = localStorage.getItem("solid_typography_visibleMark");
      return s !== null ? JSON.parse(s) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("solid_typography_visibleMainText", JSON.stringify(visibleMainText));
    } catch {}
  }, [visibleMainText]);

  useEffect(() => {
    try {
      localStorage.setItem("solid_typography_visibleSubText", JSON.stringify(visibleSubText));
    } catch {}
  }, [visibleSubText]);

  useEffect(() => {
    try {
      localStorage.setItem("solid_typography_visibleMark", JSON.stringify(visibleMark));
    } catch {}
  }, [visibleMark]);

  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [dragOverLayerId, setDragOverLayerId] = useState<string | null>(null);

  const handleDrop = (targetLayerId: string) => {
    if (!draggingLayerId || draggingLayerId === targetLayerId) {
      setDraggingLayerId(null);
      setDragOverLayerId(null);
      return;
    }
    setLayerOrder((prev) => {
      const srcIdx = prev.indexOf(draggingLayerId);
      const tgtIdx = prev.indexOf(targetLayerId);
      if (srcIdx === -1 || tgtIdx === -1) return prev;
      const next = [...prev];
      const [removed] = next.splice(srcIdx, 1);
      next.splice(tgtIdx, 0, removed);
      return next;
    });
    setDraggingLayerId(null);
    setDragOverLayerId(null);
  };
  const [extractedPhotoPalette, setExtractedPhotoPalette] = useState<string[]>([]);

  const photoImgElementsRef = useRef<{ [id: string]: HTMLImageElement }>({});

  useEffect(() => {
    photoImages.forEach((photo) => {
      if (!photo.src) return;
      const cached = photoImgElementsRef.current[photo.id];
      if (!cached || cached.src !== photo.src) {
        const img = new Image();
        img.onload = () => {
          renderTextToImage();
        };
        img.onerror = () => {
          console.warn("Failed to load photo image:", photo.id);
        };
        img.src = photo.src;
        photoImgElementsRef.current[photo.id] = img;
      }
    });
  }, [photoImages]);

  const addPhotoImage = (src: string, name?: string) => {
    const newId = `photo-${Date.now()}`;
    const newPhoto: PhotoImageItem = {
      id: newId,
      name: name || `Photo ${photoImages.length + 1}`,
      src,
      scale: 1.0,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      opacity: 1.0,
      visible: true,
    };
    setPhotoImages((prev) => [...prev, newPhoto]);
    setLayerOrder((prev) => {
      const markIdx = prev.indexOf("mark");
      const insertAt = markIdx !== -1 ? markIdx + 1 : 2;
      const next = [...prev];
      next.splice(insertAt, 0, newId);
      return next;
    });
  };

  const removePhotoImage = (id: string) => {
    setPhotoImages((prev) => prev.filter((p) => p.id !== id));
    setLayerOrder((prev) => prev.filter((layerId) => layerId !== id));
  };

  const updatePhotoImage = (id: string, updates: Partial<PhotoImageItem>) => {
    setPhotoImages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const [layerOrder, setLayerOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("solid_typography_layerOrder");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return [
      "text_main",
      "text_sub",
      "mark",
      "photo-1",
      "ornament_0",
      "ornament_1",
      "ornament_2",
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "solid_typography_layerOrder",
        JSON.stringify(layerOrder),
      );
    } catch (e) {}
  }, [layerOrder]);

  const moveLayerUp = (id: string) => {
    setLayerOrder((prev) => {
      const idx = prev.indexOf(id);
      if (idx <= 0) return prev;
      const next = [...prev];
      const temp = next[idx - 1];
      next[idx - 1] = next[idx];
      next[idx] = temp;
      return next;
    });
  };

  const moveLayerDown = (id: string) => {
    setLayerOrder((prev) => {
      const idx = prev.indexOf(id);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      const temp = next[idx + 1];
      next[idx + 1] = next[idx];
      next[idx] = temp;
      return next;
    });
  };

  const moveLayerToTop = (id: string) => {
    setLayerOrder((prev) => {
      const idx = prev.indexOf(id);
      if (idx <= 0) return prev;
      const next = prev.filter((item) => item !== id);
      return [id, ...next];
    });
  };

  const moveLayerToBottom = (id: string) => {
    setLayerOrder((prev) => {
      const idx = prev.indexOf(id);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = prev.filter((item) => item !== id);
      return [...next, id];
    });
  };

  const [imageData, setImageData] = useState<string | null>(null);
  const [sceneCode, setSceneCode] = useState<string | null>(null);

  // Settings
  const initialEffectSettings = useMemo(() => getInitialEffectSettings(), []);
  const [resolution, setResolution] = useState(
    initialEffectSettings.resolution,
  );
  const [thickness, setThickness] = useState(initialEffectSettings.thickness);
  const [lighting, setLighting] = useState(initialEffectSettings.lighting);
  const [effectStyle, setEffectStyle] = useState(
    initialEffectSettings.effectStyle,
  );

  const [autoRotate, setAutoRotate] = useState(false);
  const [uiTheme, setUiTheme] = useState(() => {
    try {
      return localStorage.getItem("solid_typography_uiTheme") || "DARK";
    } catch (e) {
      return "DARK";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("solid_typography_effectStyle", effectStyle);
      const savedMapRaw = localStorage.getItem(
        "solid_typography_effect_settings_map",
      );
      const savedMap = savedMapRaw ? JSON.parse(savedMapRaw) : {};
      savedMap[effectStyle] = { resolution, thickness, lighting };
      localStorage.setItem(
        "solid_typography_effect_settings_map",
        JSON.stringify(savedMap),
      );
    } catch (e) {}
  }, [effectStyle, resolution, thickness, lighting]);

  const handleEffectStyleChange = (newStyleId: string) => {
    setEffectStyle(newStyleId);
    try {
      const savedMapRaw = localStorage.getItem(
        "solid_typography_effect_settings_map",
      );
      if (savedMapRaw) {
        const savedMap = JSON.parse(savedMapRaw);
        if (savedMap[newStyleId]) {
          const {
            resolution: r,
            thickness: t,
            lighting: l,
          } = savedMap[newStyleId];
          if (r !== undefined) setResolution(r);
          if (t !== undefined) setThickness(t);
          if (l !== undefined) setLighting(l);
          return;
        }
      }
    } catch (e) {}

    // Defaults if not saved
    if (newStyleId === "solid_voxel" || newStyleId === "clean_flat") {
      setResolution(512);
    } else {
      setResolution(256);
    }
    setThickness(20);
    setLighting(2.0);
  };

  const [outlineMain, setOutlineMain] = useState("#000000");
  const [outlineWidthMain, setOutlineWidthMain] = useState(0);
  const [outlineSub, setOutlineSub] = useState("#000000");
  const [outlineWidthSub, setOutlineWidthSub] = useState(0);
  const [outlineMark, setOutlineMark] = useState("#000000");
  const [outlineWidthMark, setOutlineWidthMark] = useState(0);

  const [shadowColor, setShadowColor] = useState("#000000");
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(5);

  // UI State
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .catch((err) => console.error(`Error: ${err.message}`));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const [status, setStatus] = useState<AppStatus>("idle");
  const [viewMode, setViewMode] = useState<"image" | "scene">("image");
  const [errorMsg, setErrorMsg] = useState("");
  const [thinkingText, setThinkingText] = useState<string | null>(null);
  const [history, setHistory] = useState<
    {
      id: string;
      image: string;
      code: string | null;
      title: string;
      settings?: any;
    }[]
  >(() => {
    try {
      const saved = localStorage.getItem("solid_typography_history");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  useEffect(() => {
    const saveHistorySafe = (histArr: typeof history) => {
      try {
        localStorage.setItem(
          "solid_typography_history",
          JSON.stringify(histArr),
        );

        console.log("Saved history size:", JSON.stringify(histArr).length);
      } catch (e) {
        if (histArr.length > 1) {
          console.log("Failed to save, reducing size...");
          saveHistorySafe(histArr.slice(0, histArr.length - 1));
        } else {
          localStorage.removeItem("solid_typography_history");
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
  const [previewBgMode, setPreviewBgMode] = useState<"transparent" | "solid">(
    "solid",
  );
  const [showGrid, setShowGrid] = useState(true);

  // Tab Management
  const [tabs, setTabs] = useState<
    { id: string; name: string; settings: any }[]
  >(() => {
    try {
      const saved = localStorage.getItem("solid_typography_tabs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [{ id: "tab-1", name: "TAB 01", settings: null }];
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("solid_typography_activeTabId");
      if (saved) return saved;
    } catch (e) {}
    return "tab-1";
  });

  useEffect(() => {
    try {
      localStorage.setItem("solid_typography_tabs", JSON.stringify(tabs));
    } catch (e) {}
  }, [tabs]);

  useEffect(() => {
    try {
      localStorage.setItem("solid_typography_activeTabId", activeTabId);
    } catch (e) {}
  }, [activeTabId]);

  // Restore active tab's settings on initial mount if present
  useEffect(() => {
    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (activeTab && activeTab.settings) {
      applySettings(activeTab.settings);
    }
  }, []);

  // Continuously sync active tab settings so all tabs in localStorage stay up-to-date
  useEffect(() => {
    const timer = setTimeout(() => {
      const cur = getCurrentSettings();
      setTabs((prev) => {
        const existing = prev.find((t) => t.id === activeTabId);
        if (existing && JSON.stringify(existing.settings) === JSON.stringify(cur)) {
          return prev;
        }
        return prev.map((t) => (t.id === activeTabId ? { ...t, settings: cur } : t));
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [
    activeTabId,
    prompt,
    fontMain,
    sizeMain,
    subPrompt,
    fontSub,
    sizeSub,
    globalScale,
    globalOffsetX,
    globalOffsetY,
    mainOffsetX,
    mainOffsetY,
    subOffsetX,
    subOffsetY,
    textAlign,
    mainLetterSpacing,
    mainLineHeight,
    subLetterSpacing,
    subLineHeight,
    skewX,
    skewY,
    colorFace,
    colorMain,
    colorSub,
    colorMark,
    colorSide,
    bgColor,
    outlineMain,
    outlineWidthMain,
    outlineSub,
    outlineWidthSub,
    outlineMark,
    outlineWidthMark,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    ornaments,
    resolution,
    thickness,
    autoRotate,
    lighting,
    effectStyle,
    attachedMark,
    attachedMarkScale,
    attachedMarkOffsetX,
    attachedMarkOffsetY,
    layerOrder,
    photoImages,
    visibleMainText,
    visibleSubText,
    visibleMark,
  ]);
  const isDraggingImage = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== "image") return;
    setImageZoom((prev) =>
      Math.max(0.1, Math.min(5.0, prev - e.deltaY * 0.001)),
    );
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (viewMode === "image" && (e.button === 0 || e.button === 2)) {
      isDraggingImage.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (viewMode === "image" && isDraggingImage.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setImagePan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
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
    if (viewMode === "image") {
      e.preventDefault();
    }
  };

  const applySettings = (setts: any) => {
    if (!setts) return;
    if (setts.prompt !== undefined) setPrompt(setts.prompt);
    if (setts.fontMain !== undefined) setFontMain(setts.fontMain);
    if (setts.sizeMain !== undefined) setSizeMain(setts.sizeMain);
    if (setts.subPrompt !== undefined) setSubPrompt(setts.subPrompt);
    if (setts.fontSub !== undefined) setFontSub(setts.fontSub);
    if (setts.sizeSub !== undefined) setSizeSub(setts.sizeSub);
    if (setts.globalScale !== undefined) setGlobalScale(setts.globalScale);
    if (setts.globalOffsetX !== undefined)
      setGlobalOffsetX(setts.globalOffsetX);
    if (setts.globalOffsetY !== undefined)
      setGlobalOffsetY(setts.globalOffsetY);
    if (setts.mainOffsetX !== undefined) setMainOffsetX(setts.mainOffsetX);
    if (setts.mainOffsetY !== undefined) setMainOffsetY(setts.mainOffsetY);
    if (setts.subOffsetX !== undefined) setSubOffsetX(setts.subOffsetX);
    if (setts.subOffsetY !== undefined) setSubOffsetY(setts.subOffsetY);
    if (setts.textAlign !== undefined) setTextAlign(setts.textAlign);
    if (setts.mainLetterSpacing !== undefined)
      setMainLetterSpacing(setts.mainLetterSpacing);
    if (setts.mainLineHeight !== undefined)
      setMainLineHeight(setts.mainLineHeight);
    if (setts.subLetterSpacing !== undefined)
      setSubLetterSpacing(setts.subLetterSpacing);
    if (setts.subLineHeight !== undefined)
      setSubLineHeight(setts.subLineHeight);
    if (setts.skewX !== undefined) setSkewX(setts.skewX);
    if (setts.skewY !== undefined) setSkewY(setts.skewY);
    if (setts.colorFace !== undefined) setColorFace(setts.colorFace);
    if (setts.colorMain !== undefined) setColorMain(setts.colorMain);
    if (setts.colorSub !== undefined) setColorSub(setts.colorSub);
    if (setts.colorMark !== undefined) setColorMark(setts.colorMark);
    if (setts.colorSide !== undefined) setColorSide(setts.colorSide);
    if (setts.bgColor !== undefined) setBgColor(setts.bgColor);
    if (setts.ornaments !== undefined) setOrnaments(setts.ornaments);
    if (setts.resolution !== undefined) setResolution(setts.resolution);
    if (setts.thickness !== undefined) setThickness(setts.thickness);
    if (setts.autoRotate !== undefined) setAutoRotate(setts.autoRotate);
    if (setts.lighting !== undefined) setLighting(setts.lighting);
    if (setts.effectStyle !== undefined) setEffectStyle(setts.effectStyle);
    if (setts.attachedMark !== undefined) setAttachedMark(setts.attachedMark);
    if (setts.attachedMarkScale !== undefined)
      setAttachedMarkScale(setts.attachedMarkScale);
    if (setts.attachedMarkOffsetX !== undefined)
      setAttachedMarkOffsetX(setts.attachedMarkOffsetX);
    if (setts.attachedMarkOffsetY !== undefined)
      setAttachedMarkOffsetY(setts.attachedMarkOffsetY);
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
    if (setts.photoImages !== undefined && Array.isArray(setts.photoImages)) setPhotoImages(setts.photoImages);
    if (setts.visibleMainText !== undefined) setVisibleMainText(setts.visibleMainText);
    if (setts.visibleSubText !== undefined) setVisibleSubText(setts.visibleSubText);
    if (setts.visibleMark !== undefined) setVisibleMark(setts.visibleMark);
    if (setts.layerOrder !== undefined && Array.isArray(setts.layerOrder))
      setLayerOrder(setts.layerOrder);
  };

  const getCurrentSettings = () => ({
    prompt,
    fontMain,
    sizeMain,
    subPrompt,
    fontSub,
    sizeSub,
    globalScale,
    globalOffsetX,
    globalOffsetY,
    mainOffsetX,
    mainOffsetY,
    subOffsetX,
    subOffsetY,
    textAlign,
    mainLetterSpacing,
    mainLineHeight,
    subLetterSpacing,
    subLineHeight,
    skewX,
    skewY,
    colorFace,
    colorMain,
    colorSub,
    colorMark,
    colorSide,
    bgColor,
    outlineMain,
    outlineWidthMain,
    outlineSub,
    outlineWidthSub,
    outlineMark,
    outlineWidthMark,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    ornaments,
    resolution,
    thickness,
    autoRotate,
    lighting,
    effectStyle,
    attachedMark,
    attachedMarkScale,
    attachedMarkOffsetX,
    attachedMarkOffsetY,
    layerOrder,
    photoImages,
    visibleMainText,
    visibleSubText,
    visibleMark,
  });

  // ==========================================
  // 作業履歴 (Undo / Redo) システム
  // ==========================================
  const [historyState, setHistoryState] = useState<{
    stack: any[];
    index: number;
  }>({
    stack: [],
    index: -1,
  });
  const historyStateRef = useRef(historyState);
  historyStateRef.current = historyState;

  const isApplyingHistory = useRef(false);
  const historyInitializedRef = useRef(false);
  const tabHistoriesRef = useRef<{
    [tabId: string]: { stack: any[]; index: number };
  }>({});

  const canUndo = historyState.index > 0;
  const canRedo =
    historyState.index >= 0 &&
    historyState.index < historyState.stack.length - 1;

  // 初期化時に現在のキャンバス状態を履歴の先頭 (index: 0) に登録
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!historyInitializedRef.current) {
        const cur = getCurrentSettings();
        const initial = { stack: [cur], index: 0 };
        setHistoryState(initial);
        tabHistoriesRef.current[activeTabId] = initial;
        historyInitializedRef.current = true;
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // キャンバス設定変更時に履歴を追跡・記録 (500msデバウンスでスライダーの連続操作も1ステップに集約)
  useEffect(() => {
    if (!historyInitializedRef.current) return;
    if (isApplyingHistory.current) return;

    const timer = setTimeout(() => {
      if (isApplyingHistory.current) return;
      const cur = getCurrentSettings();

      setHistoryState((prev) => {
        const currentRecorded =
          prev.index >= 0 && prev.index < prev.stack.length
            ? prev.stack[prev.index]
            : null;

        // 記録済みの最新状態と同一なら追加しない
        if (
          currentRecorded &&
          JSON.stringify(currentRecorded) === JSON.stringify(cur)
        ) {
          return prev;
        }

        // 新しい編集が行われた場合、現在の位置以降の進む履歴を破棄して新しい状態を追加
        const newStack = prev.stack.slice(0, prev.index + 1);
        newStack.push(cur);

        // 最大60ステップまで保持
        if (newStack.length > 60) {
          newStack.shift();
        }

        const next = { stack: newStack, index: newStack.length - 1 };
        tabHistoriesRef.current[activeTabId] = next;
        return next;
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [
    activeTabId,
    prompt,
    fontMain,
    sizeMain,
    subPrompt,
    fontSub,
    sizeSub,
    globalScale,
    globalOffsetX,
    globalOffsetY,
    mainOffsetX,
    mainOffsetY,
    subOffsetX,
    subOffsetY,
    textAlign,
    mainLetterSpacing,
    mainLineHeight,
    subLetterSpacing,
    subLineHeight,
    skewX,
    skewY,
    colorFace,
    colorMain,
    colorSub,
    colorMark,
    colorSide,
    bgColor,
    outlineMain,
    outlineWidthMain,
    outlineSub,
    outlineWidthSub,
    outlineMark,
    outlineWidthMark,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    ornaments,
    resolution,
    thickness,
    autoRotate,
    lighting,
    effectStyle,
    attachedMark,
    attachedMarkScale,
    attachedMarkOffsetX,
    attachedMarkOffsetY,
    layerOrder,
    photoImages,
    visibleMainText,
    visibleSubText,
    visibleMark,
  ]);

  // 作業履歴: 戻る (Undo)
  const handleUndo = () => {
    const currentState = historyStateRef.current;
    const cur = getCurrentSettings();
    const currentRecorded =
      currentState.index >= 0 && currentState.index < currentState.stack.length
        ? currentState.stack[currentState.index]
        : null;

    let effectiveStack = currentState.stack;
    let effectiveIndex = currentState.index;

    // デバウンス未完了の最新変更がある場合、まずそれを記録してから前へ戻る
    if (
      currentRecorded &&
      JSON.stringify(currentRecorded) !== JSON.stringify(cur)
    ) {
      effectiveStack = [
        ...currentState.stack.slice(0, currentState.index + 1),
        cur,
      ];
      if (effectiveStack.length > 60) effectiveStack.shift();
      effectiveIndex = effectiveStack.length - 1;
    }

    if (effectiveIndex <= 0) return;

    const targetIndex = effectiveIndex - 1;
    const targetSettings = effectiveStack[targetIndex];
    if (!targetSettings) return;

    isApplyingHistory.current = true;
    const next = { stack: effectiveStack, index: targetIndex };
    setHistoryState(next);
    tabHistoriesRef.current[activeTabId] = next;

    applySettings(targetSettings);

    setTimeout(() => {
      isApplyingHistory.current = false;
    }, 150);
  };

  // 作業履歴: 進む (Redo)
  const handleRedo = () => {
    const currentState = historyStateRef.current;
    if (
      currentState.index < 0 ||
      currentState.index >= currentState.stack.length - 1
    )
      return;

    const targetIndex = currentState.index + 1;
    const targetSettings = currentState.stack[targetIndex];
    if (!targetSettings) return;

    isApplyingHistory.current = true;
    const next = { stack: currentState.stack, index: targetIndex };
    setHistoryState(next);
    tabHistoriesRef.current[activeTabId] = next;

    applySettings(targetSettings);

    setTimeout(() => {
      isApplyingHistory.current = false;
    }, 150);
  };

  // キーボードショートカット (Ctrl+Z / Cmd+Z で戻る, Ctrl+Y / Cmd+Shift+Z で進む)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (isInput) return; // テキスト入力欄の中ではブラウザ標準の元に戻すを優先
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        if (isInput) return;
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const exportSettings = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const DD = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const dateStr = `${yyyy}${MM}${DD}_${hh}${mm}${ss}`;
    const formattedDate = `${yyyy}-${MM}-${DD} ${hh}:${mm}:${ss}`;

    const current = getCurrentSettings();
    // Update active tab in tabs array with current canvas settings
    const updatedTabs = tabs.map((t) =>
      t.id === activeTabId ? { ...t, settings: current } : t,
    );
    setTabs(updatedTabs);

    const exportData = {
      version: 2,
      exportedAt: now.toISOString(),
      exportedDate: formattedDate,
      activeTabId,
      tabs: updatedTabs,
      ...current,
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportData, null, 2));
    const exportFileDefaultName = `typography_settings_${dateStr}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataStr);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data && Array.isArray(data.tabs) && data.tabs.length > 0) {
          // Full multi-tab export file
          setTabs(data.tabs);
          const targetId =
            data.activeTabId && data.tabs.some((t: any) => t.id === data.activeTabId)
              ? data.activeTabId
              : data.tabs[0].id;
          setActiveTabId(targetId);
          const activeTab = data.tabs.find((t: any) => t.id === targetId) || data.tabs[0];
          if (activeTab && activeTab.settings) {
            applySettings(activeTab.settings);
          } else {
            applySettings(data);
          }
        } else {
          // Single-tab legacy export file
          applySettings(data);
          setTabs((prev) =>
            prev.map((t) =>
              t.id === activeTabId ? { ...t, settings: getCurrentSettings() } : t,
            ),
          );
        }

        // インポート完了後、作業履歴の起点を初期化
        setTimeout(() => {
          const fresh = { stack: [getCurrentSettings()], index: 0 };
          setHistoryState(fresh);
          tabHistoriesRef.current[activeTabId] = fresh;
        }, 100);
      } catch (err) {
        console.error("Invalid settings file", err);
        alert("Invalid settings file");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const switchTab = (tabId: string) => {
    const current = getCurrentSettings();
    const updatedTabs = tabs.map((t) =>
      t.id === activeTabId ? { ...t, settings: current } : t,
    );
    setTabs(updatedTabs);

    // 現在のタブの作業履歴を保存
    tabHistoriesRef.current[activeTabId] = historyStateRef.current;

    const targetTab = updatedTabs.find((t) => t.id === tabId);
    isApplyingHistory.current = true;
    if (targetTab && targetTab.settings) {
      applySettings(targetTab.settings);
    } else {
      clearCanvas();
    }
    setTimeout(() => {
      isApplyingHistory.current = false;
    }, 150);

    setActiveTabId(tabId);

    // 移動先タブの作業履歴を復元
    const savedHistory = tabHistoriesRef.current[tabId];
    if (savedHistory && savedHistory.stack.length > 0) {
      setHistoryState(savedHistory);
    } else {
      const initialSettings = targetTab?.settings || getCurrentSettings();
      const freshHistory = { stack: [initialSettings], index: 0 };
      tabHistoriesRef.current[tabId] = freshHistory;
      setHistoryState(freshHistory);
    }
  };

  const addNewTab = () => {
    const current = getCurrentSettings();
    const newId =
      "tab-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
    const index = tabs.length + 1;
    const newTab = {
      id: newId,
      name: `TAB ${String(index).padStart(2, "0")}`,
      settings: null,
    };
    const updatedTabs = tabs.map((t) =>
      t.id === activeTabId ? { ...t, settings: current } : t,
    );
    setTabs([...updatedTabs, newTab]);

    // 現在のタブの作業履歴を保存
    tabHistoriesRef.current[activeTabId] = historyStateRef.current;

    setActiveTabId(newId);
    isApplyingHistory.current = true;
    clearCanvas();
    setTimeout(() => {
      isApplyingHistory.current = false;
    }, 150);

    setTimeout(() => {
      const freshSettings = getCurrentSettings();
      const freshHistory = { stack: [freshSettings], index: 0 };
      tabHistoriesRef.current[newId] = freshHistory;
      setHistoryState(freshHistory);
    }, 50);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    delete tabHistoriesRef.current[tabId];
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      const nextTab = newTabs[newTabs.length - 1];
      isApplyingHistory.current = true;
      if (nextTab && nextTab.settings) {
        applySettings(nextTab.settings);
      } else {
        clearCanvas();
      }
      setTimeout(() => {
        isApplyingHistory.current = false;
      }, 150);
      setActiveTabId(nextTab.id);

      const savedHistory = tabHistoriesRef.current[nextTab.id];
      if (savedHistory && savedHistory.stack.length > 0) {
        setHistoryState(savedHistory);
      } else {
        const freshHistory = {
          stack: nextTab.settings ? [nextTab.settings] : [getCurrentSettings()],
          index: 0,
        };
        tabHistoriesRef.current[nextTab.id] = freshHistory;
        setHistoryState(freshHistory);
      }
    }
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const clearAllTabs = () => {
    setShowClearConfirm(true);
  };
  const executeClearAll = () => {
    const newId =
      "tab-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
    setTabs([{ id: newId, name: "TAB 01", settings: null }]);
    setActiveTabId(newId);
    clearCanvas();
    setShowClearConfirm(false);
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
    setTextAlign("center");
    setMainLetterSpacing(5);
    setMainLineHeight(1.2);
    setGlobalOffsetX(0);
    setGlobalOffsetY(0);
    setMainOffsetX(0);
    setMainOffsetY(-50);
    setSkewX(0);
    setSkewY(0);
    setColorFace("#000000");
    setColorSide("#333333");
    setBgColor("#FFFFFF");
    setOrnaments([
      {
        type: "solid_circle",
        offsetX: 0,
        offsetY: 0,
        scale: 0.35,
        width: 1.0,
        thickness: 13,
        dash: 15,
      },
      {
        id: 2,
        type: "none",
        offsetX: 0,
        offsetY: 90,
        scale: 1.0,
        width: 2.2,
        thickness: 5,
        dash: 0,
      },
    ]);
    setResolution(512);
    setThickness(20);
    setLighting(2.0);
    setAutoRotate(false);
    setEffectStyle(EFFECTS[0].id);
    setPhotoImages([
      {
        id: "photo-1",
        name: "🌸 桜と春の花々",
        src: PRESET_PHOTOS[0].dataUrl,
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        opacity: 0.9,
        visible: true,
      },
    ]);
    setLayerOrder(["text_main", "text_sub", "mark", "photo-1", "ornament_0", "ornament_1", "ornament_2"]);
  };

  const clearCanvas = () => {
    setPrompt("");
    setSubPrompt("");
    setAttachedMark(null);
    setPhotoImages([]);
    setOrnaments([
      {
        type: "none",
        offsetX: 0,
        offsetY: 0,
        scale: 0.35,
        width: 1.0,
        thickness: 13,
        dash: 15,
      },
      {
        id: 2,
        type: "none",
        offsetX: 0,
        offsetY: 90,
        scale: 1.0,
        width: 2.2,
        thickness: 5,
        dash: 0,
      },
    ]);
  };

  const openNewTab = () => {
    try {
      const targetUrl = new URL(window.location.href);
      targetUrl.searchParams.set("new", "1");
      window.open(targetUrl.toString(), "_blank");
    } catch (e) {
      window.open("?new=1", "_blank");
    }
  };

  useEffect(() => {
    if (window.location.search.includes("new=1")) {
      resetAll();
      try {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("new");
        window.history.replaceState({}, document.title, cleanUrl.toString());
      } catch (e) {}
    }
  }, []);

  // Theme Sync & PWA theme-color dynamic update
  useEffect(() => {
    try {
      localStorage.setItem("solid_typography_uiTheme", uiTheme);
    } catch (e) {}
    document.documentElement.setAttribute("data-theme", uiTheme);

    let themeColor = "#111418";
    if (uiTheme === "BLACK") themeColor = "#0d0d0d";
    else if (uiTheme === "RED") themeColor = "#170707";
    else if (uiTheme === "WHITE") themeColor = "#ffffff";
    else if (uiTheme === "DARK") themeColor = "#111418";

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute("content", themeColor);
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
    prompt,
    subPrompt,
    fontMain,
    sizeMain,
    fontSub,
    sizeSub,
    mainLetterSpacing,
    mainLineHeight,
    subLetterSpacing,
    subLineHeight,
    textAlign,
    colorFace,
    colorMain,
    colorSub,
    colorMark,
    globalScale,
    globalOffsetX,
    globalOffsetY,
    mainOffsetX,
    mainOffsetY,
    subOffsetX,
    subOffsetY,
    skewX,
    skewY,
    JSON.stringify(ornaments),
    attachedMarkScale,
    attachedMarkOffsetX,
    attachedMarkOffsetY,
    outlineMain,
    outlineWidthMain,
    outlineSub,
    outlineWidthSub,
    outlineMark,
    outlineWidthMark,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    JSON.stringify(layerOrder),
    visibleMainText,
    visibleSubText,
    visibleMark,
    JSON.stringify(photoImages),
  ]);

  // Handle activeTab changes for text tab specifically
  useEffect(() => {
    if (activeTab === "objects") {
      if (!sceneCode) setViewMode("image");
      renderTextToImage();
    }
  }, [activeTab]);

  // Auto-rebuild the 3D scene when rendering parameters change
  useEffect(() => {
    if (viewMode === "scene" && imageData) {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.style.opacity = "0.5";
      }
      setTimeout(() => {
        try {
          const palette = [
            colorFace,
            colorMain,
            colorSub,
            colorMark,
            outlineMain,
            outlineSub,
            outlineMark,
            shadowColor,
            ...ornaments.flatMap((o) => [
              o.color || colorFace,
              o.outlineColor || colorFace,
            ]),
            ...extractedPhotoPalette,
          ];
          const code = buildThreeJsScene(
            imageData,
            effectStyle,
            resolution,
            lighting,
            autoRotate,
            palette,
            colorSide,
            bgColor,
            thickness,
            previewBgMode === "transparent",
            imageZoom,
            imagePan.x,
            imagePan.y,
          );

          setSceneCode(code);
        } catch (e) {
          console.error(e);
        }
      }, 50);
    }
  }, [
    imageData,
    effectStyle,
    resolution,
    autoRotate,
    colorFace,
    colorSide,
    bgColor,
    thickness,
    viewMode,
    previewBgMode,
    imageZoom,
    imagePan.x,
    imagePan.y,
    globalScale,
    globalOffsetX,
    globalOffsetY,
  ]);

  // Dynamic Lighting Update
  useEffect(() => {
    if (viewMode === "scene" && iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          type: "UPDATE_LIGHT",
          value: lighting,
        },
        "*",
      );
    }
  }, [lighting, viewMode]);

  const handleError = (err: any) => {
    setStatus("error");
    setErrorMsg(err.message || "SYSTEM_FAILURE");
    console.error(err);
  };

  const processGeneratedMark = (base64Image: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      let hasAlpha = false;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 200) {
          hasAlpha = true;
          break;
        }
      }

      if (hasAlpha) {
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
        }
      } else {
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          const alpha = 255 - luminance;
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = alpha;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      const trimmed = trimCanvas(canvas);
      setAttachedMark(trimmed);
      setActiveTab("objects");
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
    setThinkingText("GENERATING MARKS VIA AI...");
    try {
      const { GoogleGenAI } = await import("@google/genai");
      // @ts-ignore
      const activeKey = customApiKey || process.env.GEMINI_API_KEY;
      if (!activeKey) {
        setShowApiSettings(true);
        throw new Error(
          "APIキーが設定されていません。環境変数または設定から入力してください。",
        );
      }
      const ai = new GoogleGenAI({ apiKey: activeKey });
      const prompt = `[モチーフ：${markPrompt}] をテーマにしたロゴマーク。白背景に、黒一色の塗りつぶし（Solid black silhouettes）。陰影やグラデーションは一切なし。ミニマルでフラットなデザイン。2Dのベクターロゴスタイル。`;

      const promises = Array.from({ length: 2 }).map(() =>
        ai.models
          .generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
          })
          .catch((err) => {
            console.warn("Generation error:", err);
            return null;
          }),
      );

      const responses = await Promise.all(promises);

      if (aiGenerationIdRef.current !== currentGenerationId) return;

      const newMarks: string[] = [];
      responses.forEach((res) => {
        if (!res) return;
        try {
          const parts = res.candidates?.[0]?.content?.parts;
          if (parts) {
            for (const part of parts) {
              if (part.inlineData && part.inlineData.data) {
                newMarks.push(
                  `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`,
                );

                break;
              }
            }
          }
        } catch (e) {}
      });

      if (newMarks.length > 0) {
        setGeneratedMarks((prev) => [...newMarks, ...prev].slice(0, 20));
      } else {
        throw new Error(
          "画像の生成に失敗しました。時間をおいて再試行してください。",
        );
      }
    } catch (err: any) {
      if (aiGenerationIdRef.current !== currentGenerationId) return;

      console.error("SDK Error details:", err);
      if (err.message && err.message.toLowerCase().includes("quota")) {
        handleError({
          message:
            "APIの無料利用枠の上限に達しました。[API設定]からご自身のGemini APIキーを設定するか、時間をおいて再試行してください。",
        });
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
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const lines = prompt.split("\n");
    const subLines = subPrompt.split("\n").filter((l) => l.trim() !== "");

    const actualLineHeight = sizeMain * mainLineHeight;
    const subLineHeightVal = sizeSub * subLineHeight;

    const mainHeight = actualLineHeight * lines.length;
    const subHeight = subLineHeightVal * subLines.length;

    const mainTop = mainOffsetY - mainHeight / 2;
    const mainBottom = mainOffsetY + mainHeight / 2;
    const subTop = subOffsetY - subHeight / 2;
    const subBottom = subOffsetY + subHeight / 2;

    // Independent fixed base ornament size so moving text never distorts or moves ornaments
    const baseOrnamentHeight = 500;

    let minX = 0;
    let maxX = 0;
    let minY = mainTop;
    let maxY = mainBottom;
    if (visibleSubText && subLines.length > 0) {
      minY = Math.min(minY, subTop);
      maxY = Math.max(maxY, subBottom);
    }

    // 1. Measure true visual ink boundaries (actualBoundingBox) centered at X=0
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = `bold ${sizeMain}px ${fontMain}`;
    (ctx as any).letterSpacing = `${mainLetterSpacing}px`;

    const mainLineMetrics = (visibleMainText && lines.length > 0)
      ? lines.map((line) => {
          const m = ctx.measureText(line);
          const leftInk = ((m.actualBoundingBoxLeft !== undefined && m.actualBoundingBoxLeft > 0)
            ? m.actualBoundingBoxLeft
            : m.width / 2) + outlineWidthMain / 2;
          const rightInk = ((m.actualBoundingBoxRight !== undefined && m.actualBoundingBoxRight > 0)
            ? m.actualBoundingBoxRight
            : m.width / 2) + outlineWidthMain / 2;
          const ascent = m.actualBoundingBoxAscent || sizeMain * 0.8;
          const descent = m.actualBoundingBoxDescent || sizeMain * 0.2;
          return { line, leftInk, rightInk, ascent, descent, width: m.width };
        })
      : [];

    ctx.font = `bold ${sizeSub}px ${fontSub}`;
    (ctx as any).letterSpacing = `${subLetterSpacing}px`;

    const subLineMetrics = (visibleSubText && subLines.length > 0)
      ? subLines.map((line) => {
          const m = ctx.measureText(line);
          const leftInk = ((m.actualBoundingBoxLeft !== undefined && m.actualBoundingBoxLeft > 0)
            ? m.actualBoundingBoxLeft
            : m.width / 2) + outlineWidthSub / 2;
          const rightInk = ((m.actualBoundingBoxRight !== undefined && m.actualBoundingBoxRight > 0)
            ? m.actualBoundingBoxRight
            : m.width / 2) + outlineWidthSub / 2;
          const ascent = m.actualBoundingBoxAscent || sizeSub * 0.8;
          const descent = m.actualBoundingBoxDescent || sizeSub * 0.2;
          return { line, leftInk, rightInk, ascent, descent, width: m.width };
        })
      : [];
    ctx.restore();

    // 2. Find outer visual ink boundaries across all visible lines
    let visualAnchorLeft = mainOffsetX;
    let visualAnchorRight = mainOffsetX;
    let hasAnchor = false;

    mainLineMetrics.forEach((m) => {
      const l = mainOffsetX - m.leftInk;
      const r = mainOffsetX + m.rightInk;
      if (!hasAnchor) {
        visualAnchorLeft = l;
        visualAnchorRight = r;
        hasAnchor = true;
      } else {
        if (l < visualAnchorLeft) visualAnchorLeft = l;
        if (r > visualAnchorRight) visualAnchorRight = r;
      }
    });

    subLineMetrics.forEach((m) => {
      const l = subOffsetX - m.leftInk;
      const r = subOffsetX + m.rightInk;
      if (!hasAnchor) {
        visualAnchorLeft = l;
        visualAnchorRight = r;
        hasAnchor = true;
      } else {
        if (l < visualAnchorLeft) visualAnchorLeft = l;
        if (r > visualAnchorRight) visualAnchorRight = r;
      }
    });

    // 3. Helper functions for line center X:
    // Left-aligned: left ink edge snaps 100% identically to visualAnchorLeft
    // Right-aligned: right ink edge snaps 100% identically to visualAnchorRight
    // The longest line NEVER moves its center!
    const getMainLineX = (m: typeof mainLineMetrics[0]) => {
      if (textAlign === "left") return visualAnchorLeft + m.leftInk;
      if (textAlign === "right") return visualAnchorRight - m.rightInk;
      return mainOffsetX;
    };

    const getSubLineX = (m: typeof subLineMetrics[0]) => {
      const delta = subOffsetX - mainOffsetX;
      if (textAlign === "left") return visualAnchorLeft + m.leftInk + delta;
      if (textAlign === "right") return visualAnchorRight - m.rightInk + delta;
      return subOffsetX;
    };

    let measureMainY = mainTop + actualLineHeight / 2;
    mainLineMetrics.forEach((m) => {
      const x = getMainLineX(m);
      const y = measureMainY;
      minY = Math.min(minY, y - m.ascent - outlineWidthMain);
      maxY = Math.max(maxY, y + m.descent + outlineWidthMain);
      minX = Math.min(minX, x - m.leftInk);
      maxX = Math.max(maxX, x + m.rightInk);
      measureMainY += actualLineHeight;
    });

    let measureSubY = subTop + subLineHeightVal / 2;
    subLineMetrics.forEach((m) => {
      const x = getSubLineX(m);
      const y = measureSubY;
      minY = Math.min(minY, y - m.ascent - outlineWidthSub);
      maxY = Math.max(maxY, y + m.descent + outlineWidthSub);
      minX = Math.min(minX, x - m.leftInk);
      maxX = Math.max(maxX, x + m.rightInk);
      measureSubY += subLineHeightVal;
    });

    [...ornaments].reverse().forEach((o) => {
      if (o.visible !== false && o.type !== "none") {
        const w = 500 * o.width * o.scale;
        const h = (baseOrnamentHeight + 300) * o.scale;
        const diag = Math.sqrt(w * w + h * h);
        minX = Math.min(minX, o.offsetX - diag / 2);
        maxX = Math.max(maxX, o.offsetX + diag / 2);
        minY = Math.min(minY, o.offsetY - diag / 2);
        maxY = Math.max(maxY, o.offsetY + diag / 2);
      }
    });

    if (visibleMark && attachedMarkImgRef.current) {
      const mw = attachedMarkImgRef.current.width * attachedMarkScale;
      const mh = attachedMarkImgRef.current.height * attachedMarkScale;
      minX = Math.min(minX, attachedMarkOffsetX - mw / 2);
      maxX = Math.max(maxX, attachedMarkOffsetX + mw / 2);
      minY = Math.min(minY, attachedMarkOffsetY - mh / 2);
      maxY = Math.max(maxY, attachedMarkOffsetY + mh / 2);
    }

    photoImages.forEach((photo) => {
      if (photo.visible && photo.src) {
        const img = photoImgElementsRef.current[photo.id];
        if (img && img.naturalWidth > 0) {
          const pw = img.naturalWidth * photo.scale;
          const ph = img.naturalHeight * photo.scale;
          const diag = Math.sqrt(pw * pw + ph * ph);
          minX = Math.min(minX, photo.offsetX - diag / 2);
          maxX = Math.max(maxX, photo.offsetX + diag / 2);
          minY = Math.min(minY, photo.offsetY - diag / 2);
          maxY = Math.max(maxY, photo.offsetY + diag / 2);
        } else {
          const pw = 400 * photo.scale;
          const ph = 300 * photo.scale;
          minX = Math.min(minX, photo.offsetX - pw / 2);
          maxX = Math.max(maxX, photo.offsetX + pw / 2);
          minY = Math.min(minY, photo.offsetY - ph / 2);
          maxY = Math.max(maxY, photo.offsetY + ph / 2);
        }
      }
    });

    const skewPadX = Math.abs(skewX) * 20;
    const skewPadY = Math.abs(skewY) * 20;
    const spacingPad = Math.max(
      0,
      mainLetterSpacing * 10,
      subLetterSpacing * 10,
    );
    minX -= 800 + skewPadX + spacingPad;
    maxX += 800 + skewPadX + spacingPad;
    minY -= 800 + skewPadY;
    maxY += 800 + skewPadY;

    const maxAbsX =
      (Math.max(Math.abs(minX), Math.abs(maxX)) + Math.abs(globalOffsetX)) *
      globalScale;
    const maxAbsY =
      (Math.max(Math.abs(minY), Math.abs(maxY)) + Math.abs(globalOffsetY)) *
      globalScale;
    const proposedWidth = maxAbsX * 2;
    const proposedHeight = maxAbsY * 2;

    // Keep a generous, stable square canvas so origin (center) never fluctuates or clips layers
    const canvasDim = Math.max(3600, proposedWidth, proposedHeight);
    canvas.width = Math.min(12000, canvasDim);
    canvas.height = Math.min(12000, canvasDim);

    const originX = canvas.width / 2;
    const originY = canvas.height / 2;

    // Clear background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(
      originX + globalOffsetX * globalScale,
      originY + globalOffsetY * globalScale,
    );
    ctx.scale(globalScale, globalScale);
    ctx.transform(
      1,
      Math.tan((skewY * Math.PI) / 180),
      Math.tan((skewX * Math.PI) / 180),
      1,
      0,
      0,
    );

    if (shadowBlur > 0) {
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = shadowOffsetX;
      ctx.shadowOffsetY = shadowOffsetY;
    }

    const drawOrnament = (o: any) => {
      if (!o || o.visible === false || o.type === "none") return;
      ctx.save();
      ctx.translate(o.offsetX, o.offsetY);
      if (o.rotation) ctx.rotate((o.rotation * Math.PI) / 180);

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

      if (o.type === "horizontal_line") {
        ctx.beginPath();
        ctx.moveTo(-bbW / 2, 0);
        ctx.lineTo(bbW / 2, 0);
        ctx.stroke();
      } else if (o.type === "solid_square") {
        const sqW =
          (Math.max(500, baseOrnamentHeight + 80) + 100) * o.scale * o.width;
        const sqH = (Math.max(500, baseOrnamentHeight + 80) + 100) * o.scale;
        ctx.fillRect(-sqW / 2, -sqH / 2, sqW, sqH);
      } else if (o.type === "line_square") {
        const sqW =
          (Math.max(500, baseOrnamentHeight + 80) + 100) * o.scale * o.width;
        const sqH = (Math.max(500, baseOrnamentHeight + 80) + 100) * o.scale;
        ctx.strokeRect(-sqW / 2, -sqH / 2, sqW, sqH);
      } else if (o.type === "solid_circle") {
        const circleW =
          (Math.max(500, baseOrnamentHeight + 80) + 100) * o.scale * o.width;
        const circleH =
          (Math.max(500, baseOrnamentHeight + 80) + 100) * o.scale;
        ctx.beginPath();
        ctx.ellipse(0, 0, circleW / 2, circleH / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (o.type === "line_circle") {
        const circleW =
          (Math.max(500, baseOrnamentHeight + 80) + 100) * o.scale * o.width;
        const circleH =
          (Math.max(500, baseOrnamentHeight + 80) + 100) * o.scale;
        ctx.beginPath();
        ctx.ellipse(0, 0, circleW / 2, circleH / 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (o.type === "solid_triangle" || o.type === "line_triangle") {
        const size = (Math.max(500, baseOrnamentHeight + 80) + 100) * o.scale;
        const h = size;
        const a = (2 * h) / Math.sqrt(3);
        const topY = -(2 / 3) * h;
        const bottomY = (1 / 3) * h;
        const halfW = (a / 2) * o.width;
        ctx.beginPath();
        ctx.moveTo(0, topY);
        ctx.lineTo(halfW, bottomY);
        ctx.lineTo(-halfW, bottomY);
        ctx.closePath();
        if (o.type === "solid_triangle") {
          ctx.fill();
        } else {
          ctx.stroke();
        }
      }
      ctx.restore();
    };

    const drawMainText = () => {
      if (!visibleMainText || !prompt || mainLineMetrics.length === 0) return;
      ctx.save();
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.setLineDash([]);
      let currentMainY = mainTop + actualLineHeight / 2;
      ctx.fillStyle = colorMain;
      ctx.font = `bold ${sizeMain}px ${fontMain}`;
      (ctx as any).letterSpacing = `${mainLetterSpacing}px`;
      mainLineMetrics.forEach((m) => {
        const lineX = getMainLineX(m);
        if (outlineWidthMain > 0) {
          ctx.lineJoin = "round";
          ctx.miterLimit = 2;
          ctx.lineWidth = outlineWidthMain;
          ctx.strokeStyle = outlineMain;
          ctx.strokeText(m.line, lineX, currentMainY);
        }
        ctx.fillText(m.line, lineX, currentMainY);
        currentMainY += actualLineHeight;
      });
      ctx.restore();
    };

    const drawSubText = () => {
      if (!visibleSubText || !subPrompt || subLineMetrics.length === 0) return;
      ctx.save();
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.setLineDash([]);
      let currentSubY = subTop + subLineHeightVal / 2;
      ctx.fillStyle = colorSub;
      ctx.font = `bold ${sizeSub}px ${fontSub}`;
      (ctx as any).letterSpacing = `${subLetterSpacing}px`;
      subLineMetrics.forEach((m) => {
        const lineX = getSubLineX(m);
        if (outlineWidthSub > 0) {
          ctx.lineJoin = "round";
          ctx.miterLimit = 2;
          ctx.lineWidth = outlineWidthSub;
          ctx.strokeStyle = outlineSub;
          ctx.strokeText(m.line, lineX, currentSubY);
        }
        ctx.fillText(m.line, lineX, currentSubY);
        currentSubY += subLineHeightVal;
      });
      ctx.restore();
    };

    const drawMark = () => {
      if (!visibleMark || !attachedMarkImgRef.current) return;
      ctx.save();
      ctx.translate(attachedMarkOffsetX, attachedMarkOffsetY);
      ctx.scale(attachedMarkScale, attachedMarkScale);
      const markCanvas = document.createElement("canvas");
      markCanvas.width = attachedMarkImgRef.current.width;
      markCanvas.height = attachedMarkImgRef.current.height;
      const mctx = markCanvas.getContext("2d")!;
      mctx.drawImage(attachedMarkImgRef.current, 0, 0);
      mctx.globalCompositeOperation = "source-in";
      mctx.fillStyle = colorMark;
      mctx.fillRect(0, 0, markCanvas.width, markCanvas.height);

      if (outlineWidthMark > 0) {
        const steps = Math.max(
          16,
          Math.min(64, Math.ceil(outlineWidthMark * 2)),
        );
        const radius = outlineWidthMark;
        const outlineCanvas = document.createElement("canvas");
        outlineCanvas.width = markCanvas.width + radius * 2;
        outlineCanvas.height = markCanvas.height + radius * 2;
        const octx = outlineCanvas.getContext("2d")!;

        for (let i = 0; i < steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          const dx = Math.cos(angle) * radius;
          const dy = Math.sin(angle) * radius;
          octx.drawImage(attachedMarkImgRef.current, radius + dx, radius + dy);
        }

        octx.globalCompositeOperation = "source-in";
        octx.fillStyle = outlineMark;
        octx.fillRect(0, 0, outlineCanvas.width, outlineCanvas.height);

        ctx.drawImage(
          outlineCanvas,
          -outlineCanvas.width / 2,
          -outlineCanvas.height / 2,
        );
      }

      ctx.drawImage(markCanvas, -markCanvas.width / 2, -markCanvas.height / 2);
      ctx.restore();
    };

    const drawPhoto = (photo: PhotoImageItem) => {
      if (!photo.visible || !photo.src) return;
      let img = photoImgElementsRef.current[photo.id];
      if (!img) {
        img = new Image();
        img.onload = () => {
          renderTextToImage();
        };
        img.src = photo.src;
        photoImgElementsRef.current[photo.id] = img;
        return;
      }
      if (!img.complete || img.naturalWidth === 0) return;

      ctx.save();
      ctx.translate(photo.offsetX, photo.offsetY);
      if (photo.rotation) ctx.rotate((photo.rotation * Math.PI) / 180);
      ctx.scale(photo.scale, photo.scale);
      ctx.globalAlpha = Math.max(0, Math.min(1, photo.opacity));

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    };

    // Render layers in back-to-front order (reverse of layerOrder)
    const drawOrder = [...layerOrder].reverse();
    drawOrder.forEach((layerId) => {
      if (layerId === "mark") {
        drawMark();
      } else if (layerId === "text_main") {
        drawMainText();
      } else if (layerId === "text_sub") {
        drawSubText();
      } else if (layerId.startsWith("ornament_")) {
        const idx = parseInt(layerId.replace("ornament_", ""), 10);
        if (ornaments[idx]) {
          drawOrnament(ornaments[idx]);
        }
      } else if (layerId.startsWith("photo-")) {
        const photo = photoImages.find((p) => p.id === layerId);
        if (photo) {
          drawPhoto(photo);
        }
      }
    });

    ctx.restore();

    if (photoImages.some((p) => p.visible)) {
      try {
        const idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = idata.data;
        const colorCounts: { [hex: string]: number } = {};
        const step = Math.max(
          6,
          Math.floor(Math.sqrt((canvas.width * canvas.height) / 1500)),
        );
        for (let y = 0; y < canvas.height; y += step) {
          for (let x = 0; x < canvas.width; x += step) {
            const idx = (y * canvas.width + x) * 4;
            if (data[idx + 3] > 64) {
              const r = Math.round(data[idx] / 16) * 16;
              const g = Math.round(data[idx + 1] / 16) * 16;
              const b = Math.round(data[idx + 2] / 16) * 16;
              const hex = `#${Math.min(255, r).toString(16).padStart(2, "0")}${Math.min(255, g).toString(16).padStart(2, "0")}${Math.min(255, b).toString(16).padStart(2, "0")}`.toUpperCase();
              colorCounts[hex] = (colorCounts[hex] || 0) + 1;
            }
          }
        }
        const sorted = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 18)
          .map(([hex]) => hex);
        setExtractedPhotoPalette(sorted);
      } catch (e) {}
    } else {
      setExtractedPhotoPalette([]);
    }

    setImageData(trimCanvas(canvas, originX, originY));
    if (!sceneCode && activeTab === "objects") setViewMode("image");
  };

  const executeExport = (
    baseImageSrc: string,
    transparent: boolean,
    prefix: string,
  ) => {
    const img = new Image();
    img.onload = () => {
      // Add padding by creating a slightly larger canvas
      const padding = 100;
      const canvas = document.createElement("canvas");
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (!transparent) {
        ctx.fillStyle = bgColor; // Use user's selected background color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, padding, padding);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");

      const now = new Date();
      const yyyy = now.getFullYear();
      const MM = String(now.getMonth() + 1).padStart(2, "0");
      const DD = String(now.getDate()).padStart(2, "0");
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const dateStr = `${yyyy}${MM}${DD}_${hh}${mm}${ss}`;

      a.download = `logo_${dateStr}_${prefix}_${transparent ? "alpha" : "solid"}.png`;
      a.click();
    };
    img.src = baseImageSrc;
  };

  const handleExport2D = async (transparent: boolean) => {
    if (viewMode === "scene" && iframeRef.current?.contentWindow) {
      const dataUrl = await new Promise<string>((resolve) => {
        let resolved = false;
        const handler = (e: MessageEvent) => {
          if (e.data.type === "THUMBNAIL_DATA") {
            window.removeEventListener("message", handler);
            if (!resolved) {
              resolved = true;
              resolve(e.data.dataUrl);
            }
          }
        };
        window.addEventListener("message", handler);
        iframeRef.current?.contentWindow?.postMessage(
          { type: "REQUEST_THUMBNAIL" },
          "*",
        );

        setTimeout(() => {
          window.removeEventListener("message", handler);
          if (!resolved) {
            resolved = true;
            resolve("");
          }
        }, 1000);
      });
      if (dataUrl) {
        executeExport(dataUrl, transparent, "3d");
        return;
      }
    }
    if (!imageData) return;
    executeExport(imageData, transparent, "2d");
  };

  const getThumbnail = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 160;
        let w = img.width;
        let h = img.height;
        if (w > MAX_DIM || h > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
          w *= ratio;
          h *= ratio;
        }
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, w);
        canvas.height = Math.max(1, h);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.6));
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
    if (viewMode === "scene" && iframeRef.current?.contentWindow) {
      thumb = await new Promise<string>((resolve) => {
        let resolved = false;
        const handler = (e: MessageEvent) => {
          if (e.data.type === "THUMBNAIL_DATA") {
            window.removeEventListener("message", handler);
            if (!resolved) {
              resolved = true;
              // It's a high-res canvas, so let's scale it down using getThumbnail
              getThumbnail(e.data.dataUrl).then(resolve);
            }
          }
        };
        window.addEventListener("message", handler);
        iframeRef.current?.contentWindow?.postMessage(
          { type: "REQUEST_THUMBNAIL" },
          "*",
        );

        setTimeout(() => {
          window.removeEventListener("message", handler);
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

    const currentSetts = getCurrentSettings();
    delete currentSetts.attachedMark; // Remove large base64 image from history to prevent localStorage quota exceeded

    const newSnapshot = {
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substring(2, 6),
      image: thumb,
      code: viewMode === "scene" ? "3d" : "",
      title: prompt.split("\n")[0].substring(0, 10).trim() || "CACHE",
      settings: currentSetts,
    };
    setHistory((prev) => [newSnapshot, ...prev].slice(0, 50));
  };

  const handleConstructScene = async () => {
    if (!imageData) return;
    setStatus("generating_scene");
    setErrorMsg("");
    setThinkingText("COMPILING SHADER TOPOLOGY...");

    try {
      setTimeout(() => {
        const palette = [
          colorFace,
          colorMain,
          colorSub,
          colorMark,
          outlineMain,
          outlineSub,
          outlineMark,
          shadowColor,
          ...ornaments.flatMap((o) => [
            o.color || colorFace,
            o.outlineColor || colorFace,
          ]),
        ];
        const code = buildThreeJsScene(
          imageData,
          effectStyle,
          resolution,
          lighting,
          autoRotate,
          palette,
          colorSide,
          bgColor,
          thickness,
          previewBgMode === "transparent",
          imageZoom,
          imagePan.x,
          imagePan.y,
        );

        setSceneCode(code);

        setViewMode("scene");
        setStatus("idle");
        setThinkingText(null);
      }, 50);
    } catch (err) {
      handleError(err);
    }
  };

  const loadSnapshot = (sn: (typeof history)[0]) => {
    // We intentionally don't set imageData to sn.image because it is a low-res thumbnail.
    if (!sn.code || sn.code === "") {
      setSceneCode(null);
      setViewMode("image");
      setActiveTab("objects");
    } else {
      setViewMode("scene");
    }

    if (sn.settings) {
      const setts = sn.settings;
      if (setts.layerOrder !== undefined && Array.isArray(setts.layerOrder)) setLayerOrder(setts.layerOrder);
      if (setts.prompt !== undefined) setPrompt(setts.prompt);
      if (setts.fontMain !== undefined) setFontMain(setts.fontMain);
      if (setts.sizeMain !== undefined) setSizeMain(setts.sizeMain);
      if (setts.subPrompt !== undefined) setSubPrompt(setts.subPrompt);
      if (setts.fontSub !== undefined) setFontSub(setts.fontSub);
      if (setts.sizeSub !== undefined) setSizeSub(setts.sizeSub);
      if (setts.globalScale !== undefined) setGlobalScale(setts.globalScale);
      if (setts.globalOffsetX !== undefined)
        setGlobalOffsetX(setts.globalOffsetX);
      if (setts.globalOffsetY !== undefined)
        setGlobalOffsetY(setts.globalOffsetY);
      if (setts.mainOffsetX !== undefined) setMainOffsetX(setts.mainOffsetX);
      if (setts.mainOffsetY !== undefined) setMainOffsetY(setts.mainOffsetY);
      if (setts.subOffsetX !== undefined) setSubOffsetX(setts.subOffsetX);
      if (setts.subOffsetY !== undefined) setSubOffsetY(setts.subOffsetY);
      if (setts.textAlign !== undefined) setTextAlign(setts.textAlign);
      if (setts.mainLetterSpacing !== undefined)
        setMainLetterSpacing(setts.mainLetterSpacing);
      if (setts.mainLineHeight !== undefined)
        setMainLineHeight(setts.mainLineHeight);
      if (setts.subLetterSpacing !== undefined)
        setSubLetterSpacing(setts.subLetterSpacing);
      if (setts.subLineHeight !== undefined)
        setSubLineHeight(setts.subLineHeight);
      if (setts.skewX !== undefined) setSkewX(setts.skewX);
      if (setts.skewY !== undefined) setSkewY(setts.skewY);
      if (setts.colorFace !== undefined) setColorFace(setts.colorFace);
      if (setts.colorMain !== undefined) setColorMain(setts.colorMain);
      if (setts.colorSub !== undefined) setColorSub(setts.colorSub);
      if (setts.colorMark !== undefined) setColorMark(setts.colorMark);
      if (setts.colorSide !== undefined) setColorSide(setts.colorSide);
      if (setts.bgColor !== undefined) setBgColor(setts.bgColor);
      if (setts.outlineMain !== undefined) setOutlineMain(setts.outlineMain);
      if (setts.outlineWidthMain !== undefined)
        setOutlineWidthMain(setts.outlineWidthMain);
      if (setts.outlineSub !== undefined) setOutlineSub(setts.outlineSub);
      if (setts.outlineWidthSub !== undefined)
        setOutlineWidthSub(setts.outlineWidthSub);
      if (setts.outlineMark !== undefined) setOutlineMark(setts.outlineMark);
      if (setts.outlineWidthMark !== undefined)
        setOutlineWidthMark(setts.outlineWidthMark);
      if (setts.shadowColor !== undefined) setShadowColor(setts.shadowColor);
      if (setts.shadowBlur !== undefined) setShadowBlur(setts.shadowBlur);
      if (setts.shadowOffsetX !== undefined)
        setShadowOffsetX(setts.shadowOffsetX);
      if (setts.shadowOffsetY !== undefined)
        setShadowOffsetY(setts.shadowOffsetY);
      if (setts.ornaments !== undefined) setOrnaments(setts.ornaments);
      if (setts.resolution !== undefined) setResolution(setts.resolution);
      if (setts.thickness !== undefined) setThickness(setts.thickness);
      if (setts.autoRotate !== undefined) setAutoRotate(setts.autoRotate);
      if (setts.lighting !== undefined) setLighting(setts.lighting);
      if (setts.effectStyle !== undefined) setEffectStyle(setts.effectStyle);
      if (setts.attachedMark !== undefined) setAttachedMark(setts.attachedMark);
      if (setts.attachedMarkScale !== undefined)
        setAttachedMarkScale(setts.attachedMarkScale);
      if (setts.attachedMarkOffsetX !== undefined)
        setAttachedMarkOffsetX(setts.attachedMarkOffsetX);
      if (setts.attachedMarkOffsetY !== undefined)
        setAttachedMarkOffsetY(setts.attachedMarkOffsetY);
    } else {
      // fallback if no settings found
      if (!sn.code) setAttachedMark(null);
    }
  };

  const downloadSceneHtml = () => {
    if (!sceneCode) return;
    const blob = new Blob([sceneCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const now = new Date();
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const DD = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const dateStr = `${yyyy}${MM}${DD}_${hh}${mm}${ss}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `solid-typography-export-${dateStr}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!sceneCode) return;
    navigator.clipboard.writeText(sceneCode);
    setThinkingText("COPIED_TO_CLIPBOARD");
    setTimeout(() => setThinkingText(null), 2000);
  };

  const themeClasses: Record<string, string> = {
    DARK: "from-[#0a0c10] to-[#12161b]",
    BLACK: "from-black to-[#050505]",
    RED: "from-[#0d0404] to-[#170707]",
    WHITE: "from-[#f1f5f9] to-[#e2e8f0]",
  };

  return (
    <div
      className={`h-screen w-screen bg-gradient-to-br ${themeClasses[uiTheme] || themeClasses["DARK"]} text-[var(--text-base)] flex flex-col font-mono selection:bg-[var(--accent)] overflow-hidden`}
    >
      <canvas ref={hiddenCanvasRef} className="hidden" />

      {/* 00 HEADER */}
      <header className="flex justify-between items-center shrink-0 border-b border-[var(--border-base)] px-6 py-3 bg-[var(--bg-panel)]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3 flex-1">
          <div className="border border-[var(--text-bright)] w-6 h-6 flex items-center justify-center shrink-0">
            <Terminal
              size={14}
              strokeWidth={2.5}
              className="text-[var(--text-bright)] ml-0.5"
            />
          </div>
          <h1 className="text-[var(--text-bright)] text-[18px] font-bold tracking-normal whitespace-nowrap leading-none">
            SOLID LOGO &amp; TYPOGRAPHY CREATOR
          </h1>
        </div>

        <div className="flex shrink-0 justify-center px-8 text-[var(--text-base)] opacity-80 text-[10px] tracking-widest font-bold">
          3D TYPOGRAPHY / ALGORITHMIC GENERATOR
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end shrink-0 min-w-max">
          <div className="flex items-center border border-[var(--border-base)] rounded overflow-hidden shrink-0">
            {Object.keys(themeClasses).map((th) => (
              <button
                key={th}
                onClick={() => setUiTheme(th)}
                className={`px-3 py-1 text-[10px] whitespace-nowrap font-bold ${uiTheme === th ? "bg-[var(--text-bright)] text-[var(--bg-main)]" : "text-[#4e5d74] hover:text-[var(--text-bright)]"} transition-colors`}
              >
                {th}
              </button>
            ))}
          </div>
          <div className="flex items-center border border-[var(--border-base)] rounded overflow-hidden shrink-0">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 text-[10px] whitespace-nowrap font-bold ${lang === "en" ? "bg-white text-black" : "text-[#4e5d74] hover:text-[var(--text-bright)]"} transition-colors`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("ja")}
              className={`px-3 py-1 text-[10px] whitespace-nowrap font-bold ${lang === "ja" ? "bg-white text-black" : "text-[#4e5d74] hover:text-[var(--text-bright)]"} transition-colors`}
            >
              JP
            </button>
          </div>
          <button
            onClick={toggleFullScreen}
            className="p-1 border border-[var(--border-base)] rounded text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)] transition-colors mr-2 flex items-center justify-center"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />}
          </button>
          <div className="flex items-center gap-1">
            <div
              className={`w-1.5 h-1.5 rounded-full ${status === "idle" ? "bg-[var(--active-color)]" : "bg-yellow-500 animate-pulse"}`}
            ></div>
            <span className="text-[9px] tracking-widest opacity-60">
              STABLE
            </span>
          </div>
          <div className="h-4 w-[2px] bg-[var(--border-base)]"></div>
          <span className="text-[9px] tracking-widest opacity-60">
            VER_2.1.0
          </span>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* LEFT SIDEBAR: PARAMETERS */}
        <aside
          ref={leftSidebarRef}
          style={{ width: leftSidebarWidth }}
          className="border-r border-[var(--border-base)] bg-[var(--bg-panel)]/40 backdrop-blur-sm flex flex-col shrink-0 overflow-hidden"
        >
          <div className="px-4 pt-4 pb-0 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-[var(--text-base)] uppercase tracking-widest mb-1">
                CREATIVE SECTION
              </span>
              <span className="text-[12px] font-bold text-[var(--text-bright)] tracking-wider">
                {activeTab === "objects" && t("tabObjectsLabel")}
                {activeTab === "image" && (lang === "ja" ? "写真・画像" : "IMAGE / PHOTO")}
                {activeTab === "style" && t("tabLayoutColorLabel")}
                {activeTab === "mark" && t("tabMarkLabel")}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 px-4 pt-3 pb-0 gap-2">
            <button
              onClick={() => setActiveTab("objects")}
              className={`flex-1 ss-btn py-2 flex flex-col items-center justify-center gap-1.5 ${activeTab === "objects" ? "ss-btn-active" : ""}`}
              title={t("tabObjectsLabel")}
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab("image")}
              className={`flex-1 ss-btn py-2 flex flex-col items-center justify-center gap-1.5 ${activeTab === "image" ? "ss-btn-active" : ""}`}
              title={lang === "ja" ? "写真・画像" : "Images / Photos"}
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab("style")}
              className={`flex-1 ss-btn py-2 flex flex-col items-center justify-center gap-1.5 ${activeTab === "style" ? "ss-btn-active" : ""}`}
              title={t("tabLayoutColorLabel")}
            >
              <Palette className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveTab("mark"); }}
              className={`flex-1 ss-btn py-2 flex flex-col items-center justify-center gap-1.5 ${activeTab === "mark" ? "ss-btn-active" : ""}`}
              title={t("tabMarkLabel")}
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-scroll p-4 flex flex-col gap-4 relative">
            {activeTab === "objects" && (
              <div className="flex flex-col gap-4">
                <div className="border border-[var(--border-base)] bg-black/20 rounded-md p-2 flex flex-col gap-2">
                  <div className="text-[10px] font-bold text-[var(--text-bright)] opacity-60 ml-2 mt-1 mb-1 uppercase tracking-widest flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers size={12} />
                      LAYERS / OBJECTS
                    </div>
                    <span className="text-[8px] opacity-60 font-mono tracking-normal">{lang === "ja" ? "ドラッグまたは矢印で並び替え" : "DRAG OR USE ARROWS"}</span>
                  </div>

                  {layerOrder.map((layerId, index) => {
                    const isFirst = index === 0;
                    const isLast = index === layerOrder.length - 1;
                    const numStr = String(index + 1).padStart(2, "0");
                    const isDragging = draggingLayerId === layerId;
                    const isDragOver = dragOverLayerId === layerId;

                    const upDownControls = (
                      <div className="flex items-center gap-0 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayerToTop(layerId);
                          }}
                          disabled={isFirst}
                          className={`w-5 h-6 shrink-0 flex items-center justify-center p-0.5 transition-opacity ${isFirst ? "opacity-20 cursor-not-allowed" : "hover:text-[var(--active-color)] opacity-70 hover:opacity-100 cursor-pointer"}`}
                          title="一番上へ移動 (最前面)"
                        >
                          <ChevronsUp size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayerToBottom(layerId);
                          }}
                          disabled={isLast}
                          className={`w-5 h-6 shrink-0 flex items-center justify-center p-0.5 transition-opacity ${isLast ? "opacity-20 cursor-not-allowed" : "hover:text-[var(--active-color)] opacity-70 hover:opacity-100 cursor-pointer"}`}
                          title="一番下へ移動 (最背面)"
                        >
                          <ChevronsDown size={13} />
                        </button>
                      </div>
                    );

                    // Card acts as drop zone only, so inner sliders never trigger drag
                    const dropZoneProps = {
                      onDragOver: (e: React.DragEvent) => {
                        e.preventDefault();
                        if (dragOverLayerId !== layerId) setDragOverLayerId(layerId);
                      },
                      onDragLeave: () => {
                        if (dragOverLayerId === layerId) setDragOverLayerId(null);
                      },
                      onDrop: (e: React.DragEvent) => {
                        e.preventDefault();
                        handleDrop(layerId);
                      },
                    };

                    // Only the grip handle triggers dragging!
                    const dragHandleProps = {
                      draggable: true,
                      onClick: (e: React.MouseEvent) => e.stopPropagation(),
                      onDragStart: (e: React.DragEvent) => {
                        e.stopPropagation();
                        e.dataTransfer.setData("text/plain", layerId);
                        e.dataTransfer.effectAllowed = "move";
                        setDraggingLayerId(layerId);
                      },
                      onDragEnd: (e: React.DragEvent) => {
                        e.stopPropagation();
                        setDraggingLayerId(null);
                        setDragOverLayerId(null);
                      },
                    };

                    if (layerId === "mark") {
                      if (!attachedMark) {
                        return (
                          <div
                            key="layer-mark"
                            {...dropZoneProps}
                            className={`ss-panel py-2 px-3 opacity-60 hover:opacity-100 transition-all ${isDragging ? "opacity-30 border-dashed" : ""} ${isDragOver ? "border-[var(--active-color)] bg-[var(--active-color)]/10" : ""}`}
                          >
                            <div className="ss-label flex justify-between items-center w-full">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <div
                                  {...dragHandleProps}
                                  onClick={(e) => e.stopPropagation()}
                                  className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-[var(--active-color)] p-1 shrink-0 rounded hover:bg-white/10 transition-colors"
                                  title="Drag to reorder"
                                >
                                  <GripVertical size={14} />
                                </div>
                                <span className="ss-number">{numStr}</span>
                                <span className={`ss-title truncate ${!visibleMark ? "line-through opacity-50" : ""}`}>AI MARK / IMAGE</span>
                                <span className="text-[8px] text-gray-500 ml-1">(EMPTY)</span>
                              </div>
                              <div className="flex items-center shrink-0 ml-auto w-[108px] justify-end gap-1">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setActiveTab("mark"); }}
                                  className="text-[9px] px-2 py-0.5 border border-[var(--border-base)] rounded text-[var(--text-base)] hover:text-[var(--active-color)]"
                                >
                                  Add
                                </button>
                                {upDownControls}
                                <button
                                  onClick={(e) => { e.stopPropagation(); setVisibleMark(!visibleMark); }}
                                  className={`w-6 h-6 shrink-0 flex items-center justify-center p-1 transition-opacity ${visibleMark ? "text-[var(--text-bright)] opacity-80" : "text-gray-500 opacity-40 hover:opacity-80"}`}
                                  title={visibleMark ? "Hide AI Mark" : "Show AI Mark"}
                                >
                                  {visibleMark ? <Eye size={12} /> : <EyeOff size={12} />}
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleSetOfficialIcon(); }}
                              className="ss-btn text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/10 py-1 px-2 flex items-center justify-center gap-1.5 w-full mt-2"
                              title={lang === "ja" ? "公式アイコンを設定 (2026 TYPOGRAPHY CREATOR)" : "Set Official Icon"}
                            >
                              <Sparkles size={12} />
                              <span className="text-[9px] font-bold tracking-wider">
                                {lang === "ja" ? "アイコン変更 (2026 TYPOGRAPHY CREATOR)" : "CHANGE ICON (OFFICIAL)"}
                              </span>
                            </button>
                          </div>
                        );
                      }
                      return (
                        <div
                          key="layer-mark"
                          {...dropZoneProps}
                          className={`ss-panel animate-fade-in py-2 px-3 transition-all ${isDragging ? "opacity-30 border-dashed" : ""} ${isDragOver ? "border-[var(--active-color)] bg-[var(--active-color)]/10" : ""}`}
                        >
                          <div
                            onClick={(e) => { e.stopPropagation(); setCollapsedMark(!collapsedMark); }}
                            className={`ss-label flex justify-between items-center w-full cursor-pointer select-none hover:text-[var(--text-bright)] transition-colors ${collapsedMark ? "mb-0" : "mb-3"}`}
                          >
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <div
                                {...dragHandleProps}
                                className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-[var(--active-color)] p-1 shrink-0 rounded hover:bg-white/10 transition-colors"
                                title="Drag to reorder"
                              >
                                <GripVertical size={14} />
                              </div>
                              <span className="ss-number">{numStr}</span>
                              <span className={`ss-title truncate ${!visibleMark ? "line-through opacity-50" : ""}`}>AI MARK / IMAGE</span>
                            </div>
                            <div className="flex items-center shrink-0 ml-auto w-[114px] justify-between">
                              <button
                                onClick={(e) => { e.stopPropagation(); setCollapsedMark(!collapsedMark); }}
                                className="w-5 h-6 shrink-0 flex items-center justify-center p-0.5 text-[var(--text-base)] hover:text-[var(--active-color)] opacity-70 hover:opacity-100"
                              >
                                {collapsedMark ? "＋" : "−"}
                              </button>
                              {upDownControls}
                              <button
                                onClick={(e) => { e.stopPropagation(); setVisibleMark(!visibleMark); }}
                                className={`w-5 h-6 shrink-0 flex items-center justify-center p-0.5 transition-opacity ${visibleMark ? "text-[var(--text-bright)] opacity-80" : "text-gray-500 opacity-40 hover:opacity-80"}`}
                                title={visibleMark ? "Hide AI Mark" : "Show AI Mark"}
                              >
                                {visibleMark ? <Eye size={12} /> : <EyeOff size={12} />}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setAttachedMark(null); }}
                                className="w-5 h-6 shrink-0 flex items-center justify-center opacity-50 hover:opacity-100 p-0.5 transition-opacity text-[var(--text-base)] hover:text-white"
                                title={t("markDeleteTooltip")}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          {!collapsedMark && (
                            <div onMouseDown={(e) => e.stopPropagation()} className="pt-1">
                              <div className="ss-label mb-2 text-[9px] flex items-center mt-3">
                                <span>EDGE WIDTH</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {outlineWidthMark}PX
                                </span>
                                <ResetBtn onClick={() => setOutlineWidthMark(0)} />
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={outlineWidthMark}
                                onChange={(e) =>
                                  setOutlineWidthMark(Number(e.target.value))
                                }
                                className="ss-slider mb-4"
                              />

                              <div className="ss-label mb-2 text-[9px] flex items-center mt-3">
                                <span>{t("labelScale")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {attachedMarkScale.toFixed(2)}
                                </span>
                                <ResetBtn
                                  onClick={() => setAttachedMarkScale(1.0)}
                                />
                              </div>
                              <input
                                type="range"
                                min="0.1"
                                max="5.0"
                                step="0.05"
                                value={attachedMarkScale}
                                onChange={(e) =>
                                  setAttachedMarkScale(Number(e.target.value))
                                }
                                className="ss-slider mb-4"
                              />

                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelOffsetX")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {attachedMarkOffsetX}PX
                                </span>
                                <ResetBtn
                                  onClick={() => setAttachedMarkOffsetX(0)}
                                />
                              </div>
                              <input
                                type="range"
                                min="-1500"
                                max="1500"
                                step="10"
                                value={attachedMarkOffsetX}
                                onChange={(e) =>
                                  setAttachedMarkOffsetX(Number(e.target.value))
                                }
                                className="ss-slider mb-4"
                              />

                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelOffsetY")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {attachedMarkOffsetY}PX
                                </span>
                                <ResetBtn
                                  onClick={() => setAttachedMarkOffsetY(0)}
                                />
                              </div>
                              <input
                                type="range"
                                min="-1500"
                                max="1500"
                                step="10"
                                value={attachedMarkOffsetY}
                                onChange={(e) =>
                                  setAttachedMarkOffsetY(Number(e.target.value))
                                }
                                className="ss-slider mb-2"
                              />
                            </div>
                            )}
                          </div>
                      );
                    }

                    if (layerId === "text_main") {
                      return (
                        <div
                          key="layer-text-main"
                          {...dropZoneProps}
                          className={`ss-panel animate-fade-in py-2 px-3 transition-all ${isDragging ? "opacity-30 border-dashed" : ""} ${isDragOver ? "border-[var(--active-color)] bg-[var(--active-color)]/10" : ""}`}
                        >
                          <div
                            onClick={(e) => { e.stopPropagation(); setCollapsedMain(!collapsedMain); }}
                            className={`ss-label flex justify-between items-center w-full cursor-pointer select-none hover:text-[var(--text-bright)] transition-colors ${collapsedMain ? "mb-0" : "mb-3"}`}
                          >
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <div
                                {...dragHandleProps}
                                className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-[var(--active-color)] p-1 shrink-0 rounded hover:bg-white/10 transition-colors"
                                title="Drag to reorder"
                              >
                                <GripVertical size={14} />
                              </div>
                              <span className="ss-number">{numStr}</span>
                              <span className={`ss-title truncate ${!visibleMainText ? "line-through opacity-50" : ""}`}>
                                {t("labelMainText")}
                              </span>
                            </div>
                            <div className="flex items-center shrink-0 ml-auto w-[114px] justify-between">
                              <button
                                onClick={(e) => { e.stopPropagation(); setCollapsedMain(!collapsedMain); }}
                                className="w-5 h-6 shrink-0 flex items-center justify-center p-0.5 text-[var(--text-base)] hover:text-[var(--active-color)] opacity-70 hover:opacity-100"
                              >
                                {collapsedMain ? "＋" : "−"}
                              </button>
                              {upDownControls}
                              <button
                                onClick={(e) => { e.stopPropagation(); setVisibleMainText(!visibleMainText); }}
                                className={`w-5 h-6 shrink-0 flex items-center justify-center p-0.5 transition-opacity ${visibleMainText ? "text-[var(--text-bright)] opacity-80" : "text-gray-500 opacity-40 hover:opacity-80"}`}
                                title={visibleMainText ? "Hide Main Text" : "Show Main Text"}
                              >
                                {visibleMainText ? <Eye size={12} /> : <EyeOff size={12} />}
                              </button>
                              <div className="w-5 h-6 shrink-0" />
                            </div>
                          </div>
                          {!collapsedMain && (
                            <div onMouseDown={(e) => e.stopPropagation()} className="pt-1">
                              <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="ss-input mb-4 h-20 resize-none font-bold"
                                placeholder={t("promptPlaceholder")}
                              />
                              <div className="ss-label mb-2 flex items-center">
                                <span>{t("labelFont")}</span>
                              </div>
                              <select
                                value={fontMain}
                                onChange={(e) => setFontMain(e.target.value)}
                                className="ss-select mb-4"
                              >
                                {FONTS.map((f) => (
                                  <option key={f.value} value={f.value}>
                                    {f.name}
                                  </option>
                                ))}
                              </select>
                              <div className="ss-label mb-2 flex items-center">
                                <span>{t("labelSize")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {sizeMain}PX
                                </span>
                                <ResetBtn onClick={() => setSizeMain(160)} />
                              </div>
                              <input
                                type="range"
                                min="20"
                                max="300"
                                value={sizeMain}
                                onChange={(e) =>
                                  setSizeMain(Number(e.target.value))
                                }
                                className="ss-slider mb-4"
                              />
                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelTracking")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {mainLetterSpacing}PX
                                </span>
                                <ResetBtn
                                  onClick={() => setMainLetterSpacing(5)}
                                />
                              </div>
                              <input
                                type="range"
                                min="-20"
                                max="100"
                                value={mainLetterSpacing}
                                onChange={(e) =>
                                  setMainLetterSpacing(Number(e.target.value))
                                }
                                className="ss-slider mb-4"
                              />
                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelLineHeight")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {mainLineHeight}
                                </span>
                                <ResetBtn
                                  onClick={() => setMainLineHeight(1.2)}
                                />
                              </div>
                              <input
                                type="range"
                                min="0.5"
                                max="3.0"
                                step="0.1"
                                value={mainLineHeight}
                                onChange={(e) =>
                                  setMainLineHeight(Number(e.target.value))
                                }
                                className="ss-slider mb-4"
                              />
                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelOffsetX")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {mainOffsetX}PX
                                </span>
                                <ResetBtn onClick={() => setMainOffsetX(0)} />
                              </div>
                              <input
                                type="range"
                                min="-1500"
                                max="1500"
                                step="10"
                                value={mainOffsetX}
                                onChange={(e) =>
                                  setMainOffsetX(Number(e.target.value))
                                }
                                className="ss-slider mb-4"
                              />
                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelOffsetY")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {mainOffsetY}PX
                                </span>
                                <ResetBtn onClick={() => setMainOffsetY(-50)} />
                              </div>
                              <input
                                type="range"
                                min="-1500"
                                max="1500"
                                step="10"
                                value={mainOffsetY}
                                onChange={(e) =>
                                  setMainOffsetY(Number(e.target.value))
                                }
                                className="ss-slider mb-2"
                              />
                            </div>
                            )}
                          </div>
                      );
                    }

                    if (layerId === "text_sub") {
                      return (
                        <div
                          key="layer-text-sub"
                          {...dropZoneProps}
                          className={`ss-panel animate-fade-in py-2 px-3 transition-all ${isDragging ? "opacity-30 border-dashed" : ""} ${isDragOver ? "border-[var(--active-color)] bg-[var(--active-color)]/10" : ""}`}
                        >
                          <div
                            onClick={(e) => { e.stopPropagation(); setCollapsedSub(!collapsedSub); }}
                            className={`ss-label flex justify-between items-center w-full cursor-pointer select-none hover:text-[var(--text-bright)] transition-colors ${collapsedSub ? "mb-0" : "mb-3"}`}
                          >
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <div
                                {...dragHandleProps}
                                className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-[var(--active-color)] p-1 shrink-0 rounded hover:bg-white/10 transition-colors"
                                title="Drag to reorder"
                              >
                                <GripVertical size={14} />
                              </div>
                              <span className="ss-number">{numStr}</span>
                              <span className={`ss-title truncate ${!visibleSubText ? "line-through opacity-50" : ""}`}>
                                {t("labelSubText")}
                              </span>
                            </div>
                            <div className="flex items-center shrink-0 ml-auto w-[114px] justify-between">
                              <button
                                onClick={(e) => { e.stopPropagation(); setCollapsedSub(!collapsedSub); }}
                                className="w-5 h-6 shrink-0 flex items-center justify-center p-0.5 text-[var(--text-base)] hover:text-[var(--active-color)] opacity-70 hover:opacity-100"
                              >
                                {collapsedSub ? "＋" : "−"}
                              </button>
                              {upDownControls}
                              <button
                                onClick={(e) => { e.stopPropagation(); setVisibleSubText(!visibleSubText); }}
                                className={`w-5 h-6 shrink-0 flex items-center justify-center p-0.5 transition-opacity ${visibleSubText ? "text-[var(--text-bright)] opacity-80" : "text-gray-500 opacity-40 hover:opacity-80"}`}
                                title={visibleSubText ? "Hide Sub Text" : "Show Sub Text"}
                              >
                                {visibleSubText ? <Eye size={12} /> : <EyeOff size={12} />}
                              </button>
                              <div className="w-5 h-6 shrink-0" />
                            </div>
                          </div>
                          {!collapsedSub && (
                            <div onMouseDown={(e) => e.stopPropagation()} className="pt-1">
                              <input
                                type="text"
                                value={subPrompt}
                                onChange={(e) => setSubPrompt(e.target.value)}
                                className="ss-input mb-4 font-bold"
                                placeholder={t("subPromptPlaceholder")}
                              />
                              <div className="ss-label mb-2 flex items-center">
                                <span>{t("labelFont")}</span>
                              </div>
                              <select
                                value={fontSub}
                                onChange={(e) => setFontSub(e.target.value)}
                                className="ss-select mb-4"
                              >
                                {FONTS.map((f) => (
                                  <option key={f.value} value={f.value}>
                                    {f.name}
                                  </option>
                                ))}
                              </select>
                              <div className="ss-label mb-2 flex items-center">
                                <span>{t("labelSize")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {sizeSub}PX
                                </span>
                                <ResetBtn onClick={() => setSizeSub(30)} />
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="100"
                                value={sizeSub}
                                onChange={(e) =>
                                  setSizeSub(Number(e.target.value))
                                }
                                className="ss-slider mb-4"
                              />
                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelTracking")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {subLetterSpacing}PX
                                </span>
                                <ResetBtn
                                  onClick={() => setSubLetterSpacing(5)}
                                />
                              </div>
                              <input
                                type="range"
                                min="-10"
                                max="50"
                                value={subLetterSpacing}
                                onChange={(e) =>
                                  setSubLetterSpacing(Number(e.target.value))
                                }
                                className="ss-slider mb-4"
                              />
                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelLineHeight")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {subLineHeight}
                                </span>
                                <ResetBtn onClick={() => setSubLineHeight(1.2)} />
                              </div>
                              <input
                                type="range"
                                min="0.5"
                                max="3.0"
                                step="0.1"
                                value={subLineHeight}
                                onChange={(e) =>
                                  setSubLineHeight(Number(e.target.value))
                                }
                                className="ss-slider mb-4"
                              />
                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelOffsetX")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {subOffsetX}PX
                                </span>
                                <ResetBtn onClick={() => setSubOffsetX(0)} />
                              </div>
                              <input
                                type="range"
                                min="-1500"
                                max="1500"
                                step="10"
                                value={subOffsetX}
                                onChange={(e) =>
                                  setSubOffsetX(Number(e.target.value))
                                }
                                className="ss-slider mb-4"
                              />
                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelOffsetY")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {subOffsetY}PX
                                </span>
                                <ResetBtn onClick={() => setSubOffsetY(-60)} />
                              </div>
                              <input
                                type="range"
                                min="-1500"
                                max="1500"
                                step="10"
                                value={subOffsetY}
                                onChange={(e) =>
                                  setSubOffsetY(Number(e.target.value))
                                }
                                className="ss-slider mb-2"
                              />
                            </div>
                            )}
                          </div>
                      );
                    }

                    if (layerId.startsWith("photo-")) {
                      const photo = photoImages.find((p) => p.id === layerId);
                      if (!photo) return null;
                      const isCollapsed = !!collapsedPhotos[photo.id];
                      return (
                        <div
                          key={`layer-${photo.id}`}
                          {...dropZoneProps}
                          className={`ss-panel animate-fade-in py-2 px-3 transition-all ${isDragging ? "opacity-30 border-dashed" : ""} ${isDragOver ? "border-[var(--active-color)] bg-[var(--active-color)]/10" : ""}`}
                        >
                          <div
                            onClick={() =>
                              setCollapsedPhotos((prev) => ({
                                ...prev,
                                [photo.id]: !prev[photo.id],
                              }))
                            }
                            className={`ss-label flex justify-between items-center w-full cursor-pointer select-none hover:text-[var(--text-bright)] transition-colors ${isCollapsed ? "mb-0" : "mb-3"}`}
                          >
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <div
                                {...dragHandleProps}
                                className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-[var(--active-color)] p-1 shrink-0 rounded hover:bg-white/10 transition-colors"
                                title="Drag to reorder"
                              >
                                <GripVertical size={14} />
                              </div>
                              <span className="ss-number">{numStr}</span>
                              <span className={`ss-title truncate flex items-center gap-1.5 min-w-0 ${!photo.visible ? "line-through opacity-50" : ""}`}>
                                <span className="shrink-0">PHOTO:</span>
                                {!photo.isPreset && !photo.id.startsWith("preset-") && (
                                  <ImageIcon size={12} className="shrink-0 text-[var(--text-bright)] opacity-85 inline-block -mt-0.5" />
                                )}
                                <span className="truncate">{photo.name}</span>
                              </span>
                            </div>
                            <div className="flex items-center shrink-0 ml-auto w-[114px] justify-between">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCollapsedPhotos((prev) => ({
                                    ...prev,
                                    [photo.id]: !prev[photo.id],
                                  }));
                                }}
                                className="w-5 h-6 shrink-0 flex items-center justify-center p-0.5 text-[var(--text-base)] hover:text-[var(--active-color)] opacity-70 hover:opacity-100"
                              >
                                {isCollapsed ? "＋" : "−"}
                              </button>
                              {upDownControls}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updatePhotoImage(photo.id, {
                                    visible: !photo.visible,
                                  });
                                }}
                                className={`w-5 h-6 shrink-0 flex items-center justify-center p-0.5 transition-opacity ${photo.visible ? "text-[var(--text-bright)] opacity-80" : "text-gray-500 opacity-40 hover:opacity-80"}`}
                                title={photo.visible ? "Hide Photo" : "Show Photo"}
                              >
                                {photo.visible ? (
                                  <Eye size={12} />
                                ) : (
                                  <EyeOff size={12} />
                                )}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); removePhotoImage(photo.id); }}
                                className="w-5 h-6 shrink-0 flex items-center justify-center opacity-50 hover:opacity-100 p-0.5 transition-opacity text-[var(--text-base)] hover:text-red-400"
                                title="Delete Photo"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          {!isCollapsed && (
                            <div onMouseDown={(e) => e.stopPropagation()} className="pt-1">
                              <div className="flex items-center gap-3 mb-3 p-1.5 bg-black/30 rounded border border-[var(--border-base)]/50">
                                <img
                                  src={photo.src}
                                  alt={photo.name}
                                  className="w-12 h-12 object-contain bg-black/40 rounded border border-[var(--border-base)] shrink-0"
                                />
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                  <span className="text-[10px] font-bold text-[var(--text-bright)] truncate">
                                    {photo.name}
                                  </span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setActiveTab("image")}
                                      className="text-[9px] px-2 py-0.5 border border-[var(--border-base)] rounded text-[var(--text-base)] hover:text-[var(--active-color)]"
                                    >
                                      Edit in Image Tab
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); removePhotoImage(photo.id); }}
                                      className="text-[9px] px-2 py-0.5 border border-red-900/50 text-red-400 hover:bg-red-900/20 rounded"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="ss-label mb-2 flex items-center">
                                <span>{t("labelScale")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {photo.scale.toFixed(2)}
                                </span>
                                <ResetBtn
                                  onClick={() =>
                                    updatePhotoImage(photo.id, { scale: 1.0 })
                                  }
                                />
                              </div>
                              <input
                                type="range"
                                min="0.1"
                                max="5.0"
                                step="0.05"
                                value={photo.scale}
                                onChange={(e) =>
                                  updatePhotoImage(photo.id, {
                                    scale: Number(e.target.value),
                                  })
                                }
                                className="ss-slider mb-4"
                              />
                              <div className="ss-label mb-2 flex items-center">
                                <span>OPACITY</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {Math.round(photo.opacity * 100)}%
                                </span>
                                <ResetBtn
                                  onClick={() =>
                                    updatePhotoImage(photo.id, { opacity: 1.0 })
                                  }
                                />
                              </div>
                              <input
                                type="range"
                                min="0.05"
                                max="1.0"
                                step="0.05"
                                value={photo.opacity}
                                onChange={(e) =>
                                  updatePhotoImage(photo.id, {
                                    opacity: Number(e.target.value),
                                  })
                                }
                                className="ss-slider mb-4"
                              />
                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelOffsetX")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {photo.offsetX}PX
                                </span>
                                <ResetBtn
                                  onClick={() =>
                                    updatePhotoImage(photo.id, { offsetX: 0 })
                                  }
                                />
                              </div>
                              <input
                                type="range"
                                min="-1500"
                                max="1500"
                                step="10"
                                value={photo.offsetX}
                                onChange={(e) =>
                                  updatePhotoImage(photo.id, {
                                    offsetX: Number(e.target.value),
                                  })
                                }
                                className="ss-slider mb-4"
                              />
                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelOffsetY")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {photo.offsetY}PX
                                </span>
                                <ResetBtn
                                  onClick={() =>
                                    updatePhotoImage(photo.id, { offsetY: 0 })
                                  }
                                />
                              </div>
                              <input
                                type="range"
                                min="-1500"
                                max="1500"
                                step="10"
                                value={photo.offsetY}
                                onChange={(e) =>
                                  updatePhotoImage(photo.id, {
                                    offsetY: Number(e.target.value),
                                  })
                                }
                                className="ss-slider mb-2"
                              />
                            </div>
                            )}
                          </div>
                      );
                    }

                    if (layerId.startsWith("ornament_")) {
                      const idx = parseInt(layerId.replace("ornament_", ""), 10);
                      const ornament = ornaments[idx];
                      if (!ornament) return null;
                      const isVisible = ornament.visible !== false;
                      return (
                        <div
                          key={`ornament-${idx}`}
                          {...dropZoneProps}
                          className={`ss-panel animate-fade-in py-2 px-3 transition-all ${isDragging ? "opacity-30 border-dashed" : ""} ${isDragOver ? "border-[var(--active-color)] bg-[var(--active-color)]/10" : ""}`}
                        >
                          <div
                            onClick={() => {
                              setCollapsedOrnaments((prev) => {
                                const next = [...prev];
                                next[idx] = !next[idx];
                                return next;
                              });
                            }}
                            className={`ss-label flex justify-between items-center w-full cursor-pointer select-none hover:text-[var(--text-bright)] transition-colors ${collapsedOrnaments[idx] ? "mb-0" : "mb-3"}`}
                          >
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <div
                                {...dragHandleProps}
                                className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-[var(--active-color)] p-1 shrink-0 rounded hover:bg-white/10 transition-colors"
                                title="Drag to reorder"
                              >
                                <GripVertical size={14} />
                              </div>
                              <span className="ss-number">{numStr}</span>
                              <span className={`ss-title truncate ${!isVisible ? "line-through opacity-50" : ""}`}>
                                {t(`labelOrnament${ornament.id}` as any) ||
                                  `ORNAMENT ${ornament.id}`}
                              </span>
                            </div>
                            <div className="flex items-center shrink-0 ml-auto w-[114px] justify-between">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCollapsedOrnaments((prev) => {
                                    const next = [...prev];
                                    next[idx] = !next[idx];
                                    return next;
                                  });
                                }}
                                className="w-5 h-6 shrink-0 flex items-center justify-center p-0.5 text-[var(--text-base)] hover:text-[var(--active-color)] opacity-70 hover:opacity-100"
                              >
                                {collapsedOrnaments[idx] ? "＋" : "−"}
                              </button>
                              {upDownControls}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOrnaments((prev) => {
                                    const next = [...prev];
                                    const curr = next[idx]?.visible !== false;
                                    next[idx] = { ...next[idx], visible: !curr };
                                    return next;
                                  });
                                }}
                                className={`w-5 h-6 shrink-0 flex items-center justify-center p-0.5 transition-opacity ${isVisible ? "text-[var(--text-bright)] opacity-80" : "text-gray-500 opacity-40 hover:opacity-80"}`}
                                title={isVisible ? "Hide Ornament" : "Show Ornament"}
                              >
                                {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                              </button>
                              <div className="w-5 h-6 shrink-0" />
                            </div>
                          </div>
                          {!collapsedOrnaments[idx] && (
                            <div onMouseDown={(e) => e.stopPropagation()} className="pt-1">
                              <div className="ss-label mb-2 flex items-center">
                                <span>{t("labelType")}</span>
                              </div>
                              <select
                                value={ornament.type}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setOrnaments((prev) => {
                                    const next = [...prev];
                                    next[idx] = { ...next[idx], type: val };
                                    return next;
                                  });
                                }}
                                className="ss-select mb-4"
                              >
                                {ORNAMENTS.map((ot) => (
                                  <option key={ot.id} value={ot.id}>
                                    {t(ot.labelKey)}
                                  </option>
                                ))}
                              </select>

                              {ornament.type !== "none" && (
                                <>
                                  <div className="ss-label mb-2 text-[9px] flex items-center">
                                    <span>{t("labelOrnamentScale")}</span>
                                    <span className="ml-auto opacity-70 mr-2">
                                      {ornament.scale.toFixed(2)}
                                    </span>
                                    <ResetBtn
                                      onClick={() => {
                                        setOrnaments((prev) => {
                                          const next = [...prev];
                                          next[idx] = {
                                            ...next[idx],
                                            scale: 1.0,
                                          };
                                          return next;
                                        });
                                      }}
                                    />
                                  </div>
                                  <input
                                    type="range"
                                    min="0.1"
                                    max="3.0"
                                    step="0.05"
                                    value={ornament.scale}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setOrnaments((prev) => {
                                        const next = [...prev];
                                        next[idx] = {
                                          ...next[idx],
                                          scale: val,
                                        };
                                        return next;
                                      });
                                    }}
                                    className="ss-slider mb-4"
                                  />

                                  <div className="ss-label mb-2 text-[9px] flex items-center">
                                    <span>{t("labelOrnamentWidth")}</span>
                                    <span className="ml-auto opacity-70 mr-2">
                                      {ornament.width.toFixed(1)}
                                    </span>
                                    <ResetBtn
                                      onClick={() => {
                                        setOrnaments((prev) => {
                                          const next = [...prev];
                                          next[idx] = {
                                            ...next[idx],
                                            width: 1.0,
                                          };
                                          return next;
                                        });
                                      }}
                                    />
                                  </div>
                                  <input
                                    type="range"
                                    min="0.1"
                                    max="5.0"
                                    step="0.1"
                                    value={ornament.width}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setOrnaments((prev) => {
                                        const next = [...prev];
                                        next[idx] = {
                                          ...next[idx],
                                          width: val,
                                        };
                                        return next;
                                      });
                                    }}
                                    className="ss-slider mb-4"
                                  />

                                  <div className="ss-label mb-2 text-[9px] flex items-center">
                                    <span>{t("labelOrnamentThickness")}</span>
                                    <span className="ml-auto opacity-70 mr-2">
                                      {ornament.thickness}PX
                                    </span>
                                    <ResetBtn
                                      onClick={() => {
                                        setOrnaments((prev) => {
                                          const next = [...prev];
                                          next[idx] = {
                                            ...next[idx],
                                            thickness: 10,
                                          };
                                          return next;
                                        });
                                      }}
                                    />
                                  </div>
                                  <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={ornament.thickness}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setOrnaments((prev) => {
                                        const next = [...prev];
                                        next[idx] = {
                                          ...next[idx],
                                          thickness: val,
                                        };
                                        return next;
                                      });
                                    }}
                                    className="ss-slider mb-4"
                                  />

                                  <div className="ss-label mb-2 text-[9px] flex items-center">
                                    <span>{t("labelOrnamentDash")}</span>
                                    <span className="ml-auto opacity-70 mr-2">
                                      {ornament.dash}
                                    </span>
                                    <ResetBtn
                                      onClick={() => {
                                        setOrnaments((prev) => {
                                          const next = [...prev];
                                          next[idx] = { ...next[idx], dash: 0 };
                                          return next;
                                        });
                                      }}
                                    />
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={ornament.dash}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setOrnaments((prev) => {
                                        const next = [...prev];
                                        next[idx] = { ...next[idx], dash: val };
                                        return next;
                                      });
                                    }}
                                    className="ss-slider mb-4"
                                  />

                                  <div className="ss-label mb-2 text-[9px] flex items-center">
                                    <span>{t("labelOrnamentRotation")}</span>
                                    <span className="ml-auto opacity-70 mr-2">
                                      {ornament.rotation}°
                                    </span>
                                    <ResetBtn
                                      onClick={() => {
                                        setOrnaments((prev) => {
                                          const next = [...prev];
                                          next[idx] = {
                                            ...next[idx],
                                            rotation: 0,
                                          };
                                          return next;
                                        });
                                      }}
                                    />
                                  </div>
                                  <input
                                    type="range"
                                    min="-180"
                                    max="180"
                                    step="5"
                                    value={ornament.rotation}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setOrnaments((prev) => {
                                        const next = [...prev];
                                        next[idx] = {
                                          ...next[idx],
                                          rotation: val,
                                        };
                                        return next;
                                      });
                                    }}
                                    className="ss-slider mb-4"
                                  />

                                  <div className="ss-label mb-2 text-[9px] flex items-center">
                                    <span>{t("labelOffsetX")}</span>
                                    <span className="ml-auto opacity-70 mr-2">
                                      {ornament.offsetX}PX
                                    </span>
                                    <ResetBtn
                                      onClick={() => {
                                        setOrnaments((prev) => {
                                          const next = [...prev];
                                          next[idx] = {
                                            ...next[idx],
                                            offsetX: 0,
                                          };
                                          return next;
                                        });
                                      }}
                                    />
                                  </div>
                                  <input
                                    type="range"
                                    min="-1500"
                                    max="1500"
                                    step="10"
                                    value={ornament.offsetX}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setOrnaments((prev) => {
                                        const next = [...prev];
                                        next[idx] = {
                                          ...next[idx],
                                          offsetX: val,
                                        };
                                        return next;
                                      });
                                    }}
                                    className="ss-slider mb-4"
                                  />

                                  <div className="ss-label mb-2 text-[9px] flex items-center">
                                    <span>{t("labelOffsetY")}</span>
                                    <span className="ml-auto opacity-70 mr-2">
                                      {ornament.offsetY}PX
                                    </span>
                                    <ResetBtn
                                      onClick={() => {
                                        setOrnaments((prev) => {
                                          const next = [...prev];
                                          next[idx] = {
                                            ...next[idx],
                                            offsetY: 0,
                                          };
                                          return next;
                                        });
                                      }}
                                    />
                                  </div>
                                  <input
                                    type="range"
                                    min="-1500"
                                    max="1500"
                                    step="10"
                                    value={ornament.offsetY}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setOrnaments((prev) => {
                                        const next = [...prev];
                                        next[idx] = {
                                          ...next[idx],
                                          offsetY: val,
                                        };
                                        return next;
                                      });
                                    }}
                                    className="ss-slider mb-2"
                                  />
                                </>
                              )}
                            </div>
                            )}
                          </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Common typography alignment */}
                <div className="border border-[var(--border-base)] bg-black/20 rounded-md p-2 flex flex-col gap-2">
                  <div className="text-[10px] font-bold text-[var(--text-bright)] opacity-60 ml-2 mt-1 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={12} />
                    {t("labelCharSettings")}
                  </div>
                  <div className="ss-panel p-3 animate-fade-in">
                    <div className="flex justify-between items-center gap-2">
                      <button
                        onClick={() => setTextAlign("left")}
                        className={`flex-1 ss-btn py-1.5 flex items-center justify-center gap-1.5 ${textAlign === "left" ? "ss-btn-active" : ""}`}
                      >
                        <AlignLeft size={13} />
                        <span>{t("labelAlignLeft")}</span>
                      </button>
                      <button
                        onClick={() => setTextAlign("center")}
                        className={`flex-1 ss-btn py-1.5 flex items-center justify-center gap-1.5 ${textAlign === "center" ? "ss-btn-active" : ""}`}
                      >
                        <AlignCenter size={13} />
                        <span>{t("labelAlignCenter")}</span>
                      </button>
                      <button
                        onClick={() => setTextAlign("right")}
                        className={`flex-1 ss-btn py-1.5 flex items-center justify-center gap-1.5 ${textAlign === "right" ? "ss-btn-active" : ""}`}
                      >
                        <AlignRight size={13} />
                        <span>{t("labelAlignRight")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
                        {activeTab === "image" && (
              <div className="flex flex-col gap-4 animate-fade-in">
                {/* Section 1: Active Photo Layers on Canvas */}
                <div className="border border-[var(--border-base)] bg-black/20 rounded-md p-2 flex flex-col gap-2">
                  <div className="text-[10px] font-bold text-[var(--text-bright)] opacity-60 ml-2 mt-1 mb-1 uppercase tracking-widest flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon size={12} />
                      {lang === "ja" ? "キャンバス上の写真レイヤー" : "CANVAS PHOTO LAYERS"}
                    </div>
                    <span className="text-[9px] opacity-60 font-mono">
                      {photoImages.length} {lang === "ja" ? "枚" : "ITEMS"}
                    </span>
                  </div>

                  {photoImages.length === 0 ? (
                    <div className="p-4 text-center text-[10px] text-[var(--text-base)] opacity-70 border border-dashed border-[var(--border-base)] rounded">
                      {lang === "ja"
                        ? "写真がまだ追加されていません。下の「PCからアップロード」または「サンプル写真」から追加してください。"
                        : "No photos on canvas yet. Add one below!"}
                    </div>
                  ) : (
                    photoImages.map((photo, pIdx) => {
                      const isCollapsed = !!collapsedPhotos[photo.id];
                      return (
                        <div
                          key={`panel-photo-${photo.id}`}
                          className="ss-panel animate-fade-in py-2 px-3"
                        >
                          <div
                            className={`ss-label flex justify-between items-center w-full ${isCollapsed ? "mb-0" : "mb-3"}`}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="ss-number">
                                {String(pIdx + 1).padStart(2, "0")}
                              </span>
                              <span className="ss-title truncate flex items-center gap-1.5 min-w-0">
                                {!photo.isPreset && !photo.id.startsWith("preset-") && (
                                  <ImageIcon size={12} className="shrink-0 text-[var(--text-bright)] opacity-85 inline-block -mt-0.5" />
                                )}
                                <span className="truncate">{photo.name}</span>
                              </span>
                            </div>
                            <div className="flex items-center shrink-0 ml-auto w-[104px] justify-between">
                              <button
                                onClick={() =>
                                  setCollapsedPhotos((prev) => ({
                                    ...prev,
                                    [photo.id]: !prev[photo.id],
                                  }))
                                }
                                className="w-6 h-6 shrink-0 flex items-center justify-center p-1 text-[var(--text-base)] hover:text-[var(--active-color)] opacity-70 hover:opacity-100"
                              >
                                {isCollapsed ? "＋" : "−"}
                              </button>
                              <button
                                onClick={() =>
                                  updatePhotoImage(photo.id, {
                                    visible: !photo.visible,
                                  })
                                }
                                className={`w-6 h-6 shrink-0 flex items-center justify-center p-1 transition-opacity ${photo.visible ? "text-[var(--text-bright)] opacity-80" : "text-gray-500 opacity-40 hover:opacity-80"}`}
                                title={photo.visible ? "Hide" : "Show"}
                              >
                                {photo.visible ? (
                                  <Eye size={12} />
                                ) : (
                                  <EyeOff size={12} />
                                )}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); removePhotoImage(photo.id); }}
                                className="w-6 h-6 shrink-0 flex items-center justify-center opacity-50 hover:opacity-100 p-1 transition-opacity text-[var(--text-base)] hover:text-red-400"
                                title="Delete Photo"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          {!isCollapsed && (
                            <div onMouseDown={(e) => e.stopPropagation()} className="pt-1">
                              <div className="flex gap-3 mb-3 p-2 bg-black/40 rounded border border-[var(--border-base)]/60 items-center">
                                <img
                                  src={photo.src}
                                  alt={photo.name}
                                  className="w-16 h-16 object-contain bg-black/50 rounded border border-[var(--border-base)] shrink-0"
                                />
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                  <input
                                    type="text"
                                    value={photo.name}
                                    onChange={(e) =>
                                      updatePhotoImage(photo.id, {
                                        name: e.target.value,
                                      })
                                    }
                                    className="ss-input py-1 px-2 text-[10px]"
                                    placeholder="Photo name"
                                  />
                                  <div className="flex items-center gap-1 mt-1">
                                    <button
                                      onClick={() => setActiveTab("objects")}
                                      className="text-[9px] px-2 py-0.5 border border-[var(--border-base)] rounded text-[var(--text-base)] hover:text-[var(--active-color)]"
                                    >
                                      {lang === "ja" ? "レイヤー順序を変更" : "Adjust Layer Order"}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="ss-label mb-2 flex items-center">
                                <span>{t("labelScale")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {photo.scale.toFixed(2)}
                                </span>
                                <ResetBtn
                                  onClick={() =>
                                    updatePhotoImage(photo.id, { scale: 1.0 })
                                  }
                                />
                              </div>
                              <input
                                type="range"
                                min="0.1"
                                max="5.0"
                                step="0.05"
                                value={photo.scale}
                                onChange={(e) =>
                                  updatePhotoImage(photo.id, {
                                    scale: Number(e.target.value),
                                  })
                                }
                                className="ss-slider mb-4"
                              />

                              <div className="ss-label mb-2 flex items-center">
                                <span>OPACITY (不透明度)</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {Math.round(photo.opacity * 100)}%
                                </span>
                                <ResetBtn
                                  onClick={() =>
                                    updatePhotoImage(photo.id, { opacity: 1.0 })
                                  }
                                />
                              </div>
                              <input
                                type="range"
                                min="0.05"
                                max="1.0"
                                step="0.05"
                                value={photo.opacity}
                                onChange={(e) =>
                                  updatePhotoImage(photo.id, {
                                    opacity: Number(e.target.value),
                                  })
                                }
                                className="ss-slider mb-4"
                              />

                              <div className="ss-label mb-2 flex items-center">
                                <span>{t("labelRotation")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {photo.rotation}°
                                </span>
                                <ResetBtn
                                  onClick={() =>
                                    updatePhotoImage(photo.id, { rotation: 0 })
                                  }
                                />
                              </div>
                              <input
                                type="range"
                                min="-180"
                                max="180"
                                step="5"
                                value={photo.rotation}
                                onChange={(e) =>
                                  updatePhotoImage(photo.id, {
                                    rotation: Number(e.target.value),
                                  })
                                }
                                className="ss-slider mb-4"
                              />

                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelOffsetX")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {photo.offsetX}PX
                                </span>
                                <ResetBtn
                                  onClick={() =>
                                    updatePhotoImage(photo.id, { offsetX: 0 })
                                  }
                                />
                              </div>
                              <input
                                type="range"
                                min="-1500"
                                max="1500"
                                step="10"
                                value={photo.offsetX}
                                onChange={(e) =>
                                  updatePhotoImage(photo.id, {
                                    offsetX: Number(e.target.value),
                                  })
                                }
                                className="ss-slider mb-4"
                              />

                              <div className="ss-label mb-2 text-[9px] flex items-center">
                                <span>{t("labelOffsetY")}</span>
                                <span className="ml-auto opacity-70 mr-2">
                                  {photo.offsetY}PX
                                </span>
                                <ResetBtn
                                  onClick={() =>
                                    updatePhotoImage(photo.id, { offsetY: 0 })
                                  }
                                />
                              </div>
                              <input
                                type="range"
                                min="-1500"
                                max="1500"
                                step="10"
                                value={photo.offsetY}
                                onChange={(e) =>
                                  updatePhotoImage(photo.id, {
                                    offsetY: Number(e.target.value),
                                  })
                                }
                                className="ss-slider mb-2"
                              />
                            </div>
                            )}
                          </div>
                      );
                    })
                  )}
                </div>

                {/* Section 2: Upload Local Photo (JPEG, PNG, WebP) */}
                <div className="border border-[var(--border-base)] bg-black/20 rounded-md p-2 flex flex-col gap-2">
                  <div className="text-[10px] font-bold text-[var(--text-bright)] opacity-60 ml-2 mt-1 uppercase tracking-widest flex items-center gap-2">
                    <Upload size={12} />
                    {lang === "ja" ? "PCから写真・画像をアップロード" : "UPLOAD LOCAL PHOTO"}
                  </div>
                  <div className="ss-panel p-3">
                    <label
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.type.startsWith("image/")) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const result = ev.target?.result as string;
                            if (result) {
                              addPhotoImage(result, file.name);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="border-2 border-dashed border-[var(--border-base)] hover:border-[var(--active-color)] rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-black/10 hover:bg-black/30"
                    >
                      <Upload className="w-6 h-6 text-[var(--text-base)] opacity-70" />
                      <span className="text-[11px] font-bold text-[var(--text-bright)]">
                        {lang === "ja" ? "写真ファイルをドロップ、または選択" : "Drop photo here or click to browse"}
                      </span>
                      <span className="text-[9px] text-[var(--text-base)] opacity-60">
                        PNG, JPG, WebP, GIF対応
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const result = ev.target?.result as string;
                              if (result) {
                                addPhotoImage(result, file.name);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Section 3: Preset Sample Photos (Flower, Landscape, Ocean, etc.) */}
                <div className="border border-[var(--border-base)] bg-black/20 rounded-md p-2 flex flex-col gap-2">
                  <div className="text-[10px] font-bold text-[var(--text-bright)] opacity-60 ml-2 mt-1 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={12} />
                    {lang === "ja" ? "サンプル写真プリセット（風景・花・海など）" : "PRESET PHOTO SAMPLES"}
                  </div>
                  <div className="ss-panel p-3">
                    <p className="text-[9px] text-[var(--text-base)] opacity-70 mb-3">
                      {lang === "ja"
                        ? "クリックするとキャンバスに写真画像として追加されます。"
                        : "Click any sample to add it directly to the canvas."}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_PHOTOS.map((preset) => (
                        <div
                          key={preset.id}
                          className="border border-[var(--border-base)] rounded overflow-hidden bg-black/40 hover:border-[var(--active-color)] transition-all flex flex-col group cursor-pointer"
                          onClick={() => {
                            addPhotoImage(preset.dataUrl, lang === "ja" ? preset.nameJa : preset.name);
                          }}
                        >
                          <div className="w-full aspect-[4/3] bg-black/60 relative overflow-hidden">
                            <img
                              src={preset.dataUrl}
                              alt={preset.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[9px] font-bold px-2 py-1 bg-[var(--active-color)] text-black rounded flex items-center gap-1 shadow">
                                <Plus size={10} /> {lang === "ja" ? "追加する" : "Add"}
                              </span>
                            </div>
                          </div>
                          <div className="p-2 flex flex-col">
                            <span className="text-[10px] font-bold text-[var(--text-bright)] truncate">
                              {lang === "ja" ? preset.nameJa : preset.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "mark" && (
              <>
                <div className="flex flex-col gap-4 animate-fade-in relative">
                  <div className="ss-panel p-3">
                    <button
                      onClick={handleSetOfficialIcon}
                      className="ss-btn ss-btn-primary border-cyan-500/80 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 mb-3 w-full flex items-center justify-center gap-2 py-2"
                      title={lang === "ja" ? "公式アイコンを設定 (2026 TYPOGRAPHY CREATOR)" : "Set Official Icon"}
                    >
                      <Sparkles size={14} />
                      <span className="text-[10px] font-bold tracking-widest">
                        {lang === "ja" ? "アイコン変更 (2026 TYPOGRAPHY CREATOR)" : "CHANGE ICON (2026 TYPOGRAPHY CREATOR)"}
                      </span>
                    </button>
                    <div className="ss-label mb-2 mt-1 flex justify-between items-center">
                      <div>
                        <span className="ss-number">01</span>
                        <span className="ss-title">{t("labelMotif")}</span>
                      </div>
                      <button
                        onClick={() => setShowApiSettings(!showApiSettings)}
                        className="text-[var(--text-base)] hover:text-[var(--text-bright)]"
                        title="API Settings"
                      >
                        <Settings size={12} />
                      </button>
                    </div>

                    {showApiSettings && (
                      <div className="mb-4 p-3 bg-black/40 border border-[#343d4a] rounded shadow-lg">
                        <div className="text-[10px] text-[#8a95a3] mb-2">
                          {t("apiTitle")}
                        </div>
                        <input
                          type="password"
                          className="ss-input py-1.5 px-2 text-[10px] w-full mb-1"
                          placeholder="API KEY"
                          value={customApiKey}
                          onChange={(e) => handleCustomApiKey(e.target.value)}
                        />
                        <div className="text-[8px] text-[#4e5d74]">
                          {t("apiDesc")}
                        </div>
                      </div>
                    )}

                    <input
                      type="text"
                      className="ss-input py-2 px-3 text-[12px] h-10 w-full mb-3"
                      placeholder={t("phMark")}
                      value={markPrompt}
                      onChange={(e) => setMarkPrompt(e.target.value)}
                      disabled={generatingMarks}
                    />
                    {!generatingMarks ? (
                      <button
                        className="ss-btn ss-btn-primary border-emerald-500 text-emerald-500 bg-transparent hover:bg-emerald-500/10 mb-2 w-full flex items-center justify-center gap-2"
                        disabled={!markPrompt}
                        onClick={generateAiMarks}
                      >
                        <Zap size={12} />
                        {t("generateTwiceBtn")}
                      </button>
                    ) : (
                      <button
                        className="ss-btn ss-btn-primary border-red-500 text-red-500 bg-transparent hover:bg-red-500/10 mb-2 w-full flex items-center justify-center gap-2"
                        onClick={handleCancelAiGeneration}
                      >
                        <span className="animate-pulse flex items-center justify-center gap-2 w-full">
                          <Square fill="currentColor" size={10} />{" "}
                          {t("btnGenerateMarkStop")}
                        </span>
                      </button>
                    )}
                    <div className="text-[9px] text-[#4e5d74] text-center mt-1">
                      {t("markMakerPromptDesc")}
                    </div>
                  </div>

                  {generatedMarks.length > 0 && (
                    <div className="ss-panel p-3">
                      <div className="ss-label mb-3 mt-1 flex justify-between items-center">
                        <div>
                          <span className="ss-number">02</span>
                          <span className="ss-title">{t("labelResult")}</span>
                        </div>
                        <ResetBtn onClick={() => setGeneratedMarks([])} />
                      </div>
                      <div className="text-[10px] text-[var(--text-base)] mb-3 leading-relaxed">
                        {t("markMakerResultDesc")}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {generatedMarks.map((markBase64, idx) => (
                          <div
                            key={idx}
                            className="group relative aspect-square bg-white border border-[var(--border-base)] rounded cursor-pointer hover:border-[var(--active-color)] transition-colors flex items-center justify-center p-2 overflow-hidden bg-white"
                            onClick={() => processGeneratedMark(markBase64)}
                          >
                            <img
                              src={markBase64}
                              alt={`Mark ${idx}`}
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-black/80 p-1 rounded">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInvert(markBase64, idx, undefined);
                                }}
                                className="text-[var(--text-base)] hover:text-[var(--text-bright)] p-0.5"
                                title={t("markInvertTooltip")}
                              >
                                <Contrast size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStockAdd(markBase64);
                                }}
                                className="text-[var(--text-base)] hover:text-[var(--active-color)] p-0.5"
                                title={t("markAddStockTooltip")}
                              >
                                <BookmarkPlus size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadPng(markBase64, false);
                                }}
                                className="text-[var(--text-base)] hover:text-blue-500 p-0.5"
                                title={t("markPngTooltip")}
                              >
                                <ImageIcon size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadPng(markBase64, true);
                                }}
                                className="text-[var(--text-base)] hover:text-blue-500 p-0.5"
                                title={t("markPngAlphaTooltip")}
                              >
                                <Download size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className={`ss-panel p-3 transition-colors ${isDragOverStock ? "bg-[var(--bg-btn-active)] border-dashed border-[var(--text-bright)]" : ""}`}
                    onDragOver={handleDragOverStock}
                    onDragLeave={handleDragLeaveStock}
                    onDrop={handleDropStock}
                  >
                    <div className="ss-label mb-3 mt-1 flex justify-between items-center">
                      <div>
                        <span className="ss-number">03</span>
                        <span className="ss-title">
                          {t("labelStock")} ({stockedMarks.length})
                        </span>
                      </div>
                      <div>
                        <label
                          className="cursor-pointer text-[var(--text-base)] hover:text-[var(--text-bright)] transition-colors bg-[var(--bg-btn)] hover:bg-[var(--bg-btn-active)] border border-[var(--border-base)] p-1 rounded inline-flex items-center"
                          title={t("markBtnUploadTooltip")}
                        >
                          <Upload size={14} />
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleLocalImageUpload}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="text-[10px] text-[var(--text-base)] opacity-70 mb-3 text-center border border-dashed border-[var(--border-base)] py-2 rounded">
                      {t("dragAndDropMsg")}
                    </div>

                    <div className="flex gap-2 mb-3 pt-2 pb-2 bg-[var(--bg-panel)] border border-[var(--border-base)] rounded justify-center items-center">
                      <span className="text-[10px] text-[var(--text-base)] font-bold tracking-widest mr-2">
                        MENU
                      </span>
                      <button
                        onClick={handleSelectedInvert}
                        disabled={selectedStockIds.length === 0}
                        className={`p-1 transition-colors ${selectedStockIds.length > 0 ? "text-[var(--text-base)] hover:text-[var(--text-bright)] cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                        title={t("markInvertTooltip")}
                      >
                        <Contrast size={12} />
                      </button>
                      <button
                        onClick={() => handleSelectedDownload(false)}
                        disabled={selectedStockIds.length === 0}
                        className={`p-1 transition-colors ${selectedStockIds.length > 0 ? "text-[var(--text-base)] hover:text-blue-500 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                        title={t("markPngTooltip")}
                      >
                        <ImageIcon size={12} />
                      </button>
                      <button
                        onClick={() => handleSelectedDownload(true)}
                        disabled={selectedStockIds.length === 0}
                        className={`p-1 transition-colors ${selectedStockIds.length > 0 ? "text-[var(--text-base)] hover:text-blue-500 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                        title={t("markPngAlphaTooltip")}
                      >
                        <Download size={12} />
                      </button>
                      <button
                        onClick={handleSelectedRemove}
                        disabled={selectedStockIds.length === 0}
                        className={`p-1 ml-1 ${selectedStockIds.length > 0 ? "text-gray-300 hover:text-red-400 cursor-pointer" : "text-gray-600 cursor-not-allowed"}`}
                        title={t("markDeleteTooltip")}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {stockedMarks.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {stockedMarks.map((markBase64, idx) => {
                          const isSelected = selectedStockIds.includes(idx);
                          return (
                            <div
                              key={`stock-${idx}`}
                              className={`group relative aspect-square bg-white border ${isSelected ? "border-[var(--active-color)] scale-95" : "border-[var(--border-base)] hover:border-[var(--active-color)]"} rounded cursor-pointer transition-all flex items-center justify-center p-1.5 overflow-hidden`}
                              onClick={() => processGeneratedMark(markBase64)}
                            >
                              <img
                                src={markBase64}
                                alt={`Stock ${idx}`}
                                className={`w-full h-full object-contain ${isSelected ? "opacity-80" : ""}`}
                              />
                              <div
                                className={`absolute top-1 right-1 w-4 h-4 bg-black/60 border border-gray-400 rounded-sm flex items-center justify-center transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStockSelection(idx);
                                }}
                              >
                                {isSelected && (
                                  <div className="w-2 h-2 bg-[var(--active-color)] rounded-sm" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div
                        className="text-center py-6 text-[10px] text-[var(--text-base)] border border-dashed border-[var(--border-base)] rounded mt-2"
                        dangerouslySetInnerHTML={{ __html: t("emptyStockMsg") }}
                      ></div>
                    )}
                  </div>
                </div>
              </>
            )}
            {activeTab === "style" && (
              <>
                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1">
                    <span className="ss-title flex-1">{t("labelOffset")}</span>
                  </div>
                  <div className="ss-label mb-2 mt-3 text-[9px] flex items-center">
                    <span>{t("labelGlobalScale")}</span>
                    <span className="ml-auto opacity-70 mr-2">
                      {globalScale.toFixed(2)}
                    </span>
                    <ResetBtn onClick={() => setGlobalScale(1.0)} />
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.05"
                    value={globalScale}
                    onChange={(e) => setGlobalScale(Number(e.target.value))}
                    className="ss-slider mb-4"
                  />
                  <div className="ss-label mb-2 text-[9px] flex items-center">
                    <span>{t("labelOffsetX")}</span>
                    <span className="ml-auto opacity-70 mr-2">
                      {globalOffsetX}PX
                    </span>
                    <ResetBtn onClick={() => setGlobalOffsetX(0)} />
                  </div>
                  <input
                    type="range"
                    min="-1000"
                    max="1000"
                    step="10"
                    value={globalOffsetX}
                    onChange={(e) => setGlobalOffsetX(Number(e.target.value))}
                    className="ss-slider mb-4"
                  />
                  <div className="ss-label mb-2 text-[9px] flex items-center">
                    <span>{t("labelOffsetY")}</span>
                    <span className="ml-auto opacity-70 mr-2">
                      {globalOffsetY}PX
                    </span>
                    <ResetBtn onClick={() => setGlobalOffsetY(0)} />
                  </div>
                  <input
                    type="range"
                    min="-1000"
                    max="1000"
                    step="10"
                    value={globalOffsetY}
                    onChange={(e) => setGlobalOffsetY(Number(e.target.value))}
                    className="ss-slider"
                  />
                </div>
                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1">
                    <span className="ss-number">01</span>
                    <span className="ss-title">{t("labelColorSettings")}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3"></div>

                  <div className="border-t border-[var(--border-base)] mt-4 pt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <div className="ss-label text-[9px] mb-1 opacity-80">
                        {t("labelMainText")}
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]">
                          FACE
                          <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                            <input
                              type="color"
                              value={colorMain}
                              onChange={(e) => setColorMain(e.target.value)}
                              className="w-full h-4 cursor-pointer border-none bg-transparent"
                            />
                          </div>
                        </label>
                        <label className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]">
                          EDGE
                          <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                            <input
                              type="color"
                              value={outlineMain}
                              onChange={(e) => setOutlineMain(e.target.value)}
                              className="w-full h-4 cursor-pointer border-none bg-transparent"
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                    <div>
                      <div className="ss-label text-[9px] mb-1 opacity-80">
                        {t("labelSubText")}
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]">
                          FACE
                          <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                            <input
                              type="color"
                              value={colorSub}
                              onChange={(e) => setColorSub(e.target.value)}
                              className="w-full h-4 cursor-pointer border-none bg-transparent"
                            />
                          </div>
                        </label>
                        <label className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]">
                          EDGE
                          <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                            <input
                              type="color"
                              value={outlineSub}
                              onChange={(e) => setOutlineSub(e.target.value)}
                              className="w-full h-4 cursor-pointer border-none bg-transparent"
                            />
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="col-span-2 flex">
                      {attachedMark ? (
                        <div className="w-1/2 pr-2 border-r border-[var(--border-base)]">
                          <div className="ss-label text-[9px] mb-1 opacity-80">
                            AI MARK
                          </div>
                          <div className="flex gap-2">
                            <label className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]">
                              FACE
                              <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                                <input
                                  type="color"
                                  value={colorMark}
                                  onChange={(e) => setColorMark(e.target.value)}
                                  className="w-full h-4 cursor-pointer border-none bg-transparent"
                                />
                              </div>
                            </label>
                            <label className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]">
                              EDGE
                              <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                                <input
                                  type="color"
                                  value={outlineMark}
                                  onChange={(e) =>
                                    setOutlineMark(e.target.value)
                                  }
                                  className="w-full h-4 cursor-pointer border-none bg-transparent"
                                />
                              </div>
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="w-1/2 pr-2 border-r border-[var(--border-base)]"></div>
                      )}
                      <div className="w-1/2 pl-2">
                        <div className="ss-label text-[9px] mb-1 opacity-80 flex justify-between w-full">
                          {t("labelBgColor2")}
                          <ResetBtn onClick={() => setBgColor("#1A1A1A")} />
                        </div>
                        <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                          <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="w-full h-4 cursor-pointer border-none bg-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 mt-1">
                      <div className="ss-label text-[9px] mb-1 opacity-80">
                        ORNAMENTS
                      </div>
                      <div className="flex gap-2">
                        {ornaments.map((ornament, idx) => (
                          <label
                            key={idx}
                            className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]"
                          >
                            {t(`labelOrnament${ornament.id}` as any) ||
                              `ORN ${ornament.id}`}
                            <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                              <input
                                type="color"
                                value={ornament.color}
                                onChange={(e) => {
                                  const newOrn = [...ornaments];
                                  newOrn[idx].color = e.target.value;
                                  setOrnaments(newOrn);
                                }}
                                className="w-full h-4 cursor-pointer border-none bg-transparent"
                              />
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-base)]">
                    <div className="ss-label mb-2 text-[10px] flex items-center">
                      <span className="flex-1">SHADOW</span>
                      COLOR{" "}
                      <input
                        type="color"
                        value={shadowColor}
                        onChange={(e) => setShadowColor(e.target.value)}
                        className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0 ml-2"
                      />
                    </div>
                    <div className="ss-label mb-2 text-[9px] flex items-center mt-3">
                      <span>BLUR</span>
                      <span className="ml-auto opacity-70 mr-2">
                        {shadowBlur}PX
                      </span>
                      <ResetBtn onClick={() => setShadowBlur(0)} />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={shadowBlur}
                      onChange={(e) => setShadowBlur(Number(e.target.value))}
                      className="ss-slider mb-3"
                    />

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="ss-label mb-2 text-[9px] flex items-center">
                          <span>OFFSET X</span>
                          <span className="ml-auto opacity-70 mr-1">
                            {shadowOffsetX}
                          </span>
                          <ResetBtn onClick={() => setShadowOffsetX(0)} />
                        </div>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          step="1"
                          value={shadowOffsetX}
                          onChange={(e) =>
                            setShadowOffsetX(Number(e.target.value))
                          }
                          className="ss-slider mb-2"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="ss-label mb-2 text-[9px] flex items-center">
                          <span>OFFSET Y</span>
                          <span className="ml-auto opacity-70 mr-1">
                            {shadowOffsetY}
                          </span>
                          <ResetBtn onClick={() => setShadowOffsetY(5)} />
                        </div>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          step="1"
                          value={shadowOffsetY}
                          onChange={(e) =>
                            setShadowOffsetY(Number(e.target.value))
                          }
                          className="ss-slider mb-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1 flex justify-between items-center">
                    <div>
                      <span className="ss-number">07</span>
                      <span className="ss-title">{t("label2DSkew")}</span>
                    </div>
                    <ResetBtn
                      onClick={() => {
                        setSkewX(0);
                        setSkewY(0);
                      }}
                    />
                  </div>

                  <div className="ss-label mb-2 mt-4 text-[9px] flex items-center">
                    <span>{t("labelSkewX")}</span>
                    <span className="ml-auto opacity-70 mr-2">{skewX}°</span>
                    <ResetBtn onClick={() => setSkewX(0)} />
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={skewX}
                    onChange={(e) => setSkewX(Number(e.target.value))}
                    className="ss-slider mb-2"
                  />

                  <div className="ss-label mb-2 mt-4 text-[9px] flex items-center">
                    <span>{t("labelSkewY")}</span>
                    <span className="ml-auto opacity-70 mr-2">{skewY}°</span>
                    <ResetBtn onClick={() => setSkewY(0)} />
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={skewY}
                    onChange={(e) => setSkewY(Number(e.target.value))}
                    className="ss-slider mb-2"
                  />
                </div>
            </>
          )}
          </div>
          <div className="p-3 border-t border-[var(--border-base)] shrink-0 bg-[var(--bg-panel)] backdrop-blur-md grid grid-cols-2 gap-2">
            <button
              onClick={exportSettings}
              className={`w-full ss-btn py-2 flex items-center justify-center gap-1 transition-colors !bg-transparent ${uiTheme === "WHITE" ? "!border-black !text-black hover:!bg-black hover:!text-white" : "!border-white !text-white hover:!bg-white hover:!text-black"}`}
            >
              <Download size={12} />{" "}
              <span className="text-[9px] tracking-widest font-bold">
                {t("btnConfigExport")}
              </span>
            </button>
            <label
              className={`w-full ss-btn py-2 flex items-center justify-center gap-1 transition-colors cursor-pointer !bg-transparent ${uiTheme === "WHITE" ? "!border-black !text-black hover:!bg-black hover:!text-white" : "!border-white !text-white hover:!bg-white hover:!text-black"}`}
            >
              <Upload size={12} />{" "}
              <span className="text-[9px] tracking-widest font-bold">
                {t("btnConfigImport")}
              </span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={importSettings}
              />
            </label>
          </div>
        </aside>

        <div
          className="group w-2 -ml-1 -mr-1 bg-transparent cursor-col-resize shrink-0 z-10 flex justify-center transition-colors"
          onMouseDown={handleLeftSidebarResize}
        >
          <div className="w-[2px] h-full bg-transparent group-hover:bg-[var(--active-color)] transition-colors" />
        </div>
        {/* MAIN VIEWPORT */}
        <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg-main)]/20 relative">
          {/* Tabs Bar */}
          <div className="flex bg-[var(--bg-main)] text-[9px] font-bold shrink-0 border-b border-[var(--border-base)] overflow-x-auto scroller-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`px-4 py-2 border-r border-[var(--border-base)] flex items-center gap-2 transition-colors ${activeTabId === tab.id ? "bg-[var(--bg-panel)] text-[var(--text-bright)]" : "text-[var(--text-base)] hover:bg-[var(--bg-btn)]"}`}
              >
                {tab.name}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="hover:text-red-500 rounded p-[1px] -mr-1"
                >
                  <X size={10} />
                </span>
              </button>
            ))}
            <button
              onClick={addNewTab}
              className="px-4 py-2 border-r border-[var(--border-base)] text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)] transition-colors flex items-center justify-center"
            >
              <span className="text-sm leading-none -mt-0.5">+</span>
            </button>
          </div>

          {/* Viewport Header */}
          <div className="flex bg-[var(--bg-panel)]/60 border-b border-[var(--border-base)] shrink-0 h-[42px]">
            <div className="flex-1 px-4 flex items-center overflow-x-auto scroller-hidden">
              {viewMode === "image" && (
                <div className="flex gap-2 h-[28px]">
                  <button
                    onClick={() =>
                      setPreviewBgMode((p) =>
                        p === "transparent" ? "solid" : "transparent",
                      )
                    }
                    className="ss-btn !flex-none w-[220px] !py-0 flex gap-2 items-center justify-center tracking-widest transition-colors active:!scale-100"
                    title="背景モード切替（透過 / ベタ塗り）"
                  >
                    <Contrast size={12} />
                    <span className="text-[10px] font-bold flex gap-1">
                      BACKGROUND MODE:
                      <span className="inline-block w-[40px] text-left">
                        {previewBgMode === "transparent" ? "ALPHA" : "SOLID"}
                      </span>
                    </span>
                  </button>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className="ss-btn !flex-none min-w-[140px] px-3 w-auto !py-0 flex gap-2 items-center justify-center tracking-widest transition-colors active:!scale-100"
                    title="Toggle Grid overlay"
                  >
                    <Grid size={12} />{" "}
                    <span className="text-[10px] font-bold whitespace-nowrap">
                      {t("labelGrid")}: {showGrid ? "ON" : "OFF"}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setImagePan({ x: 0, y: 0 });
                      setImageZoom(1.0);
                    }}
                    className="ss-btn !flex-none w-[140px] !py-0 flex gap-2 items-center justify-center tracking-widest transition-colors active:!scale-100"
                    title="表示位置とズームをリセット"
                  >
                    <Maximize2 size={12} />{" "}
                    <span className="text-[10px] font-bold">RESET VIEW</span>
                  </button>

                  <div className="h-4 w-[1px] bg-[var(--border-base)] self-center mx-1 shrink-0" />

                  {/* 作業履歴 戻る (Undo) */}
                  <button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className={`ss-btn !flex-none px-3.5 !py-0 flex gap-1.5 items-center justify-center tracking-wider transition-colors active:!scale-100 ${
                      !canUndo
                        ? "opacity-30 cursor-not-allowed pointer-events-none"
                        : "hover:bg-[var(--bg-btn)] cursor-pointer"
                    }`}
                    title={
                      lang === "ja"
                        ? "作業履歴を戻る (Ctrl+Z)"
                        : "Undo (Ctrl+Z)"
                    }
                  >
                    <Undo2 size={13} />
                    <span className="text-[10px] font-bold whitespace-nowrap">
                      {t("btnUndo")}
                    </span>
                  </button>

                  {/* 作業履歴 進む (Redo) */}
                  <button
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className={`ss-btn !flex-none px-3.5 !py-0 flex gap-1.5 items-center justify-center tracking-wider transition-colors active:!scale-100 ${
                      !canRedo
                        ? "opacity-30 cursor-not-allowed pointer-events-none"
                        : "hover:bg-[var(--bg-btn)] cursor-pointer"
                    }`}
                    title={
                      lang === "ja"
                        ? "作業履歴を進む (Ctrl+Y / Ctrl+Shift+Z)"
                        : "Redo (Ctrl+Y / Ctrl+Shift+Z)"
                    }
                  >
                    <Redo2 size={13} />
                    <span className="text-[10px] font-bold whitespace-nowrap">
                      {t("btnRedo")}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex shrink-0">
              <button
                onClick={() => setViewMode("image")}
                className={`w-[140px] px-4 py-0 flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-wider transition-colors border-l border-[var(--border-base)] ${viewMode === "image" ? "bg-white text-black" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
                title="2Dベース画像を表示"
              >
                <Type size={14} /> <span>BASE_MAP</span>
              </button>
              <button
                onClick={handleConstructScene}
                disabled={status !== "idle" || !imageData}
                className={`w-[160px] px-4 py-0 flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-wider transition-colors border-l border-[var(--border-base)]
                  ${
                    viewMode === "scene"
                      ? "bg-white text-black"
                      : "text-white bg-[var(--accent)] hover:opacity-80"
                  }
                  ${(status !== "idle" && status !== "generating_scene") || !imageData ? "opacity-50 cursor-not-allowed" : ""}
                `}
                title="3Dモデルを生成・更新"
              >
                {viewMode === "scene" ? (
                  <>
                    <ImageIcon
                      size={14}
                      className={
                        status === "generating_scene" ? "animate-spin" : ""
                      }
                    />
                    <span>3D_STUDIO</span>
                  </>
                ) : (
                  <>
                    <Cpu
                      size={14}
                      className={
                        status === "generating_scene" ? "animate-spin" : ""
                      }
                    />
                    <span>CONSTRUCT_3D</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Viewport Render Box */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[radial-gradient(#1d2533_1px,transparent_1px)] [background-size:32px_32px]">
            <AnimatePresence mode="wait">
              {status !== "idle" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#0a0e14]/90 z-30 flex flex-col items-center justify-center gap-6"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-[#1d2533] border-t-white rounded-full animate-spin"></div>
                    <Terminal
                      size={24}
                      className="absolute inset-0 m-auto text-white opacity-20"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] tracking-[0.4em] text-white uppercase font-bold">
                      {thinkingText || status.replace("_", " ")}
                    </span>
                    <span className="text-[8px] text-[#4e5d74]">
                      WRITING_THREE_JS_SHADERS...
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="w-full h-full relative"
              style={
                previewBgMode === "solid"
                  ? {
                      backgroundColor: bgColor,
                      backgroundImage: "none",
                    }
                  : {
                      backgroundColor: "#f3f4f6",
                      backgroundImage:
                        "linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb), linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb)",
                      backgroundSize: "20px 20px",
                      backgroundPosition: "0 0, 10px 10px",
                    }
              }
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onContextMenu={handleContextMenu}
            >
              {viewMode === "scene" && sceneCode ? (
                <iframe
                  ref={iframeRef}
                  title="3D View"
                  srcDoc={sceneCode}
                  className="w-full h-full border-none transition-opacity duration-300"
                  sandbox="allow-scripts allow-same-origin"
                  onLoad={(e) => {
                    (e.currentTarget as HTMLIFrameElement).style.opacity = "1";
                  }}
                />
              ) : viewMode === "image" && imageData ? (
                <div className="w-full h-full overflow-hidden relative cursor-grab active:cursor-grabbing">
                  <div
                    className="absolute top-1/2 left-1/2 pointer-events-none flex items-center justify-center"
                    style={{
                      transform: `translate(calc(-50% + ${imagePan.x}px), calc(-50% + ${imagePan.y}px)) scale(${imageZoom * 0.5})`,
                    }}
                  >
                    {showGrid && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 z-0">
                        <div className="w-[3000px] h-[1px] bg-[#666666] absolute"></div>
                        <div className="h-[3000px] w-[2px] bg-[#666666] absolute"></div>
                        <div className="w-[100px] h-[100px] border border-[#666666] rounded-full absolute"></div>
                        <span className="absolute -mt-[110px] text-[#666666] text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full border border-[#666666]/30 bg-[#111] bg-opacity-10 backdrop-blur-sm">
                          CENTER (0,0)
                        </span>
                      </div>
                    )}
                    <img
                      src={imageData}
                      alt="2D Preview"
                      className="relative z-10 pointer-events-none max-w-none max-h-none"
                      style={{
                        filter:
                          previewBgMode === "transparent"
                            ? "drop-shadow(0 25px 25px rgb(0 0 0 / 0.5))"
                            : "none",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-[var(--border-base)]">
                  <Grid size={64} className="opacity-10" />
                  <span className="text-[10px] tracking-[0.5em] uppercase italic">
                    NO_OUTPUT_BUFFER
                  </span>
                </div>
              )}
            </div>

            {/* Overlays */}
            {sceneCode && viewMode === "scene" && (
              <div className="absolute top-4 left-4 p-2 bg-[#0a0e14]/80 backdrop-blur-md border border-[#1d2533] text-[8px] flex flex-col gap-1 pointer-events-none">
                <div className="flex justify-between gap-8">
                  <span className="opacity-60">STYLE:</span>{" "}
                  <span className="text-white font-bold">
                    {EFFECTS.find((e) => e.id === effectStyle)?.name}
                  </span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="opacity-60">GRID:</span>{" "}
                  <span className="text-white">
                    {resolution}x{resolution}
                  </span>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={downloadSceneHtml}
                disabled={!sceneCode}
                className="w-8 h-8 ss-panel items-center justify-center p-0 hover:bg-[#252f41] cursor-pointer"
              >
                <Download size={14} className="opacity-60 hover:opacity-100" />
              </button>
              <button
                onClick={() => {
                  setSceneCode(null);
                  setViewMode("image");
                }}
                className="w-8 h-8 ss-panel items-center justify-center p-0 hover:bg-[#252f41] cursor-pointer"
              >
                <RotateCcw size={14} className="opacity-60 hover:opacity-100" />
              </button>
            </div>
          </div>

          {showClearConfirm && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[var(--bg-panel)] border border-[var(--border-base)] p-6 w-full max-w-sm rounded shadow-2xl flex flex-col gap-4 animate-fade-in">
                <div className="text-[12px] font-bold text-[var(--text-bright)] mb-2">
                  {t("confirmClearAll")}
                </div>
                <div className="flex gap-3 justify-end mt-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 text-[10px] uppercase font-bold border border-[var(--border-base)] text-[var(--text-base)] hover:bg-[var(--bg-btn)] transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={executeClearAll}
                    className="px-4 py-2 text-[10px] uppercase font-bold bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 transition-colors"
                  >
                    CLEAR ALL
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <div
          className="group w-2 -ml-1 -mr-1 bg-transparent cursor-col-resize shrink-0 z-10 flex justify-center transition-colors"
          onMouseDown={handleRightSidebarResize}
        >
          <div className="w-[2px] h-full bg-transparent group-hover:bg-[var(--active-color)] transition-colors" />
        </div>
        {/* RIGHT SIDEBAR: SETTINGS & HISTORY */}
        <aside
          ref={rightSidebarRef}
          style={{ width: rightSidebarWidth }}
          className="border-l border-[var(--border-base)] bg-[var(--bg-panel)]/40 backdrop-blur-sm flex flex-col shrink-0 overflow-hidden"
        >
          <div className="flex shrink-0 px-4 pt-4 pb-0 gap-2 border-b border-[var(--border-base)] pb-3 mb-1">
            <button
              onClick={() => setActiveRightTab("3d")}
              className={`flex-1 ss-btn py-1.5 flex justify-center ${activeRightTab === "3d" ? "ss-btn-active" : ""}`}
            >
              {t("tab3dLabel")}
            </button>
            <button
              onClick={() => setActiveRightTab("data")}
              className={`flex-1 ss-btn py-1.5 flex justify-center ${activeRightTab === "data" ? "ss-btn-active" : ""}`}
            >
              {t("tabDataLabel")}
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-scroll p-4 flex flex-col gap-4 relative">
            {activeRightTab === "3d" && (
              <>
                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1">
                    <span className="ss-number">01</span>
                    <span className="ss-title">{t("labelRenderSettings")}</span>
                  </div>
                  <div className="ss-label mb-2 mt-3 text-[10px]">
                    <span className="">{t("labelMeshDensity")}</span>
                    <span className="ml-auto opacity-70 mr-2">
                      {resolution}
                    </span>
                    <ResetBtn onClick={() => setResolution(512)} />
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="512"
                    step="16"
                    value={resolution}
                    onChange={(e) => setResolution(Number(e.target.value))}
                    className="ss-slider"
                  />
                  <div className="ss-label mb-2 mt-4 text-[10px] flex items-center">
                    <span>{t("labelExtrudeDepth")}</span>
                    <span className="ml-auto opacity-70 mr-2">
                      {thickness.toFixed(1)}
                    </span>
                    <ResetBtn onClick={() => setThickness(20)} />
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="100"
                    step="0.5"
                    value={thickness}
                    onChange={(e) => setThickness(Number(e.target.value))}
                    className="ss-slider"
                  />
                  <div className="ss-label mb-2 mt-4 text-[10px] flex items-center">
                    <span>{t("labelSideColor")}</span>
                    <span className="ml-auto opacity-70 mr-2">{colorSide}</span>
                    <ResetBtn onClick={() => setColorSide("#808080")} />
                  </div>
                  <div className="flex bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                    <input
                      type="color"
                      value={colorSide}
                      onChange={(e) => setColorSide(e.target.value)}
                      className="w-full h-6 cursor-pointer border-none bg-transparent"
                    />
                  </div>
                  <div className="ss-label mb-2 mt-4 text-[10px]">
                    <span className="">{t("labelAutoRotate2")}</span>
                  </div>
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`ss-btn py-1.5 w-full flex justify-center ${autoRotate ? "ss-btn-active" : ""}`}
                  >
                    {autoRotate ? "ON" : "OFF"}
                  </button>
                </div>

                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-3 mt-1">
                    <span className="ss-number">02</span>
                    <span className="ss-title">{t("label3DEffects")}</span>
                  </div>
                  <div className="flex flex-col gap-1 overflow-y-scroll">
                    {EFFECTS.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => handleEffectStyleChange(e.id)}
                        className={`ss-btn py-1.5 ${effectStyle === e.id ? "ss-btn-active" : ""}`}
                      >
                        {e.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ss-panel p-3 mb-2">
                  <div className="ss-label mb-2">
                    <span className="ss-number">03</span>
                    <span className="ss-title">{t("labelLight")}</span>
                    <span className="ml-auto text-white text-[10px]">
                      {lighting.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={lighting}
                    onChange={(e) => setLighting(Number(e.target.value))}
                    className="ss-slider"
                  />
                </div>
                <button
                  onClick={downloadSceneHtml}
                  title="3DモデルをHTMLファイルとしてエクスポートします"
                  disabled={!sceneCode}
                  className={`w-full mt-4 py-3 bg-[var(--bg-btn)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] tracking-widest flex items-center justify-center gap-2 ${sceneCode ? "hover:bg-[var(--bg-btn-active)] text-blue-500 hover:text-blue-400 cursor-pointer" : "opacity-50 text-[var(--text-base)] cursor-not-allowed"}`}
                >
                  <Download size={14} /> EXPORT 3D
                </button>
              </>
            )}

            {activeRightTab === "data" && (
              <>
                <div className="ss-label">
                  <span className="ss-number">04</span>
                  <span className="ss-title">{t("labelHistory")}</span>
                </div>
                <div className="flex-1 flex flex-col gap-2 overflow-y-scroll">
                  {history.length > 0 ? (
                    history.map((sn, idx) => (
                      <div
                        key={sn.id + "-" + idx}
                        className="ss-panel p-1 cursor-pointer hover:border-[#4d5e7a] group bg-black/40 border-black/50 relative"
                      >
                        <img
                          src={sn.image}
                          onClick={() => loadSnapshot(sn)}
                          className="w-full h-16 object-cover opacity-60 group-hover:opacity-100 transition-all shadow-lg mix-blend-screen"
                          alt="Thumb"
                        />
                        <div className="p-1 text-[7px] truncate opacity-40 group-hover:opacity-100 mt-1 flex justify-between items-center">
                          <span
                            className="truncate flex-1"
                            onClick={() => loadSnapshot(sn)}
                            title={sn.title}
                          >
                            {sn.title}
                          </span>
                          <button
                            className="ml-1 p-1 hover:text-red-500 hover:bg-black/50 rounded flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setHistory((h) =>
                                h.filter((item) => item.id !== sn.id),
                              );
                            }}
                            title="Remove from history"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 border border-dashed border-[#1d2533] p-4 flex items-center justify-center opacity-30">
                      <span className="text-[9px] text-[var(--border-base)] rotate-90 uppercase tracking-widest">
                        Cache_Empty
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 border-t border-[var(--border-base)] pt-4">
                  <button
                    onClick={handleSaveToCache}
                    title="現在の3D設定と画像をキャッシュに保存します"
                    disabled={!imageData}
                    className={`w-full py-2 bg-[var(--bg-btn)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] tracking-widest flex items-center justify-center mb-2 ${imageData ? "hover:bg-[var(--bg-btn-active)] text-[var(--active-color)] hover:opacity-80 cursor-pointer" : "opacity-50 text-[var(--text-base)] cursor-not-allowed"}`}
                  >
                    SAVE TO CACHE
                  </button>
                  <button
                    onClick={() => {
                      setSceneCode(null);
                      setViewMode("image");
                      setHistory([]);
                    }}
                    title="キャッシュと3Dプレビューをリセットします"
                    className="w-full py-2 mb-2 bg-[var(--bg-btn)] hover:bg-[var(--bg-btn-active)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] text-red-500 hover:text-red-400 tracking-widest flex items-center justify-center"
                  >
                    CLEAR CACHE
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* FOOTER BAR */}
      <footer className="p-3 border-t border-[var(--border-base)] bg-[var(--bg-panel)] shrink-0 flex gap-3 h-[60px]">
        <button
          onClick={copyToClipboard}
          title="3Dモデルを描画するHTMLソースコードをクリップボードにコピーします"
          className="flex-1 bg-[var(--bg-btn)] hover:bg-[var(--bg-btn-active)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] text-[var(--text-base)] hover:text-[var(--text-bright)] tracking-widest flex items-center justify-center"
        >
          COPY 3D SOURCE
        </button>
        <button
          onClick={() => handleExport2D(false)}
          title="背景色を含めたPNG画像としてダウンロードします"
          disabled={!imageData}
          className={`flex-1 bg-[var(--bg-btn)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] tracking-widest flex items-center justify-center ${imageData ? "hover:bg-[var(--bg-btn-active)] text-[var(--text-base)] hover:text-[var(--text-bright)] cursor-pointer" : "opacity-50 text-[var(--text-base)] cursor-not-allowed"}`}
        >
          PNG (SOLID)
        </button>
        <button
          onClick={() => handleExport2D(true)}
          title="背景を透過したPNG画像としてダウンロードします"
          disabled={!imageData}
          className={`flex-1 bg-[var(--bg-btn)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] tracking-widest flex items-center justify-center ${imageData ? "hover:bg-[var(--bg-btn-active)] text-[var(--text-base)] hover:text-[var(--text-bright)] cursor-pointer" : "opacity-50 text-[var(--text-base)] cursor-not-allowed"}`}
        >
          PNG (ALPHA)
        </button>
        <button
          onClick={clearAllTabs}
          title="すべてのタブをリセットします"
          className="flex-1 bg-[var(--bg-btn)] hover:bg-[var(--bg-btn-active)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] text-red-500 hover:text-red-400 tracking-widest flex items-center justify-center gap-2"
        >
          <Eraser size={14} /> CLEAR ALL
        </button>
      </footer>
      {/* DEBUG STRIP */}
      <div className="ss-status-bar h-5 shrink-0 px-6 bg-[var(--bg-panel)] border-t border-[var(--border-base)] flex items-center">
        <div className="flex gap-6 flex-1 text-[var(--text-bright)]">
          <span className="flex items-center gap-1 text-[var(--active-color)] uppercase font-bold">
            <CheckCircle2 size={10} /> KERNEL_ACTIVE
          </span>
          <span className="opacity-90 font-bold">
            NODE_LOAD: {status === "idle" ? "1.84%" : "94.12%"}
          </span>
          <span className="opacity-90 uppercase font-bold">
            Canvas: {resolution}px Grid
          </span>
          {errorMsg && (
            <span className="text-red-500 opacity-100 uppercase">
              {errorMsg}
            </span>
          )}
        </div>
        <div className="text-[var(--text-bright)] opacity-90 text-[9px] tracking-widest uppercase font-bold">
          © 2026 SOLID_TYPOGRAPHY
        </div>
      </div>
    </div>
  );
};

export default App;
