import sys

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

theme_block_target = """          <div className="ss-label">
            <span className="ss-number">06</span>
            <span className="ss-title">{t("themeLabel")}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(themeClasses).map((th) => (
              <button
                key={th}
                onClick={() => setUiTheme(th)}
                className={`ss-btn py-1.5 ${uiTheme === th ? "ss-btn-active" : ""}`}
              >
                {th}
              </button>
            ))}
          </div>
          <div className="h-[1px] bg-[var(--border-base)] my-2"></div>"""

if theme_block_target in content:
    content = content.replace(theme_block_target, "")
    
    header_target = """        <div className="flex items-center gap-4 w-1/4 justify-end">
          <div className="flex items-center gap-1 border border-[var(--border-base)] rounded overflow-hidden">"""
          
    header_replace = """        <div className="flex items-center gap-4 w-1/4 justify-end">
          <div className="flex items-center gap-1 border border-[var(--border-base)] rounded overflow-hidden">
            {Object.keys(themeClasses).map((th) => (
              <button
                key={th}
                onClick={() => setUiTheme(th)}
                className={`px-2 py-0.5 text-[9px] font-bold ${uiTheme === th ? "bg-[var(--text-bright)] text-[var(--bg-main)]" : "text-[#4e5d74] hover:text-[var(--text-bright)]"} transition-colors`}
              >
                {th}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 border border-[var(--border-base)] rounded overflow-hidden">"""
          
    content = content.replace(header_target, header_replace)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Theme patched")
else:
    print("Theme block not found")
