import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

start_idx = content.find('      {/* FOOTER BAR */}')
end_idx = content.find('      {/* DEBUG STRIP */}')

new_footer = """      {/* FOOTER BAR */}
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
"""

content = content[:start_idx] + new_footer + content[end_idx:]

with open(file_path, 'w') as f:
    f.write(content)
print("Footer rewritten.")
