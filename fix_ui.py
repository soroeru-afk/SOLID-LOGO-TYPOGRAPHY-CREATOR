import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Reorder Left Sidebar Tabs
tabs_str = """            <button
              onClick={() => setActiveTab("objects")}
              className={`flex-1 py-2 rounded text-[8px] font-bold tracking-wider transition-colors ${activeTab === "objects" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tabObjectsLabel")}
            </button>
            <button
              onClick={() => setActiveTab("mark")}
              className={`flex-1 py-2 rounded text-[8px] font-bold tracking-wider transition-colors ${activeTab === "mark" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tabMarkLabel")}
            </button>
            <button
              onClick={() => setActiveTab("style")}
              className={`flex-1 py-2 rounded text-[8px] font-bold tracking-wider transition-colors ${activeTab === "style" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tabLayoutColorLabel")}
            </button>"""

new_tabs_str = """            <button
              onClick={() => setActiveTab("objects")}
              className={`flex-1 py-2 rounded text-[8px] font-bold tracking-wider transition-colors ${activeTab === "objects" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tabObjectsLabel")}
            </button>
            <button
              onClick={() => setActiveTab("style")}
              className={`flex-1 py-2 rounded text-[8px] font-bold tracking-wider transition-colors ${activeTab === "style" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tabLayoutColorLabel")}
            </button>
            <button
              onClick={() => setActiveTab("mark")}
              className={`flex-1 py-2 rounded text-[8px] font-bold tracking-wider transition-colors ${activeTab === "mark" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tabMarkLabel")}
            </button>"""

content = content.replace(tabs_str, new_tabs_str)

# 2. Right Sidebar Width
content = content.replace('<aside className="w-48 border-l border-[var(--border-base)] bg-[var(--bg-panel)]/40 backdrop-blur-sm flex flex-col shrink-0 overflow-hidden">', 
                          '<aside className="w-64 border-l border-[var(--border-base)] bg-[var(--bg-panel)]/40 backdrop-blur-sm flex flex-col shrink-0 overflow-hidden">')

# Let's save it.
with open(file_path, 'w') as f:
    f.write(content)

print("Fixed tabs and width")
