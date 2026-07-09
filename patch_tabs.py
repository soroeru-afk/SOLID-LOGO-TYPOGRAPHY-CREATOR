import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Update en labels
content = content.replace('tabMarkLabel: "AI MARK",', 'tabObjectsLabel: "OBJECTS",')
content = content.replace('tabStyleLabel: "DESIGN",', 'tabLayoutColorLabel: "LAYOUT & COLOR",')

# Update ja labels
content = content.replace('tabMarkLabel: "AIマーク",', 'tabObjectsLabel: "デザイン＆オブジェクト",')
content = content.replace('tabStyleLabel: "デザイン",', 'tabLayoutColorLabel: "レイアウト＆カラー",')

# Update Tab Bar
tab_bar_target = """          <div className="flex shrink-0 px-4 pt-4 pb-0 gap-1">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 py-2 rounded text-[9px] font-bold tracking-wider transition-colors ${activeTab === "text" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tabTextLabel")}
            </button>
            <button
              onClick={() => setActiveTab("mark")}
              className={`flex-1 py-2 rounded text-[9px] font-bold tracking-wider transition-colors ${activeTab === "mark" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tabMarkLabel")}
            </button>
            <button
              onClick={() => setActiveTab("style")}
              className={`flex-1 py-2 rounded text-[9px] font-bold tracking-wider transition-colors ${activeTab === "style" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tabStyleLabel")}
            </button>
            <button
              onClick={() => setActiveTab("3d")}
              className={`flex-1 py-2 rounded text-[9px] font-bold tracking-wider transition-colors ${activeTab === "3d" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tab3dLabel")}
            </button>
          </div>"""

tab_bar_replace = """          <div className="flex shrink-0 px-4 pt-4 pb-0 gap-1">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 py-2 rounded text-[8px] font-bold tracking-wider transition-colors ${activeTab === "text" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tabTextLabel")}
            </button>
            <button
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
          </div>"""

content = content.replace(tab_bar_target, tab_bar_replace)

# We need to change {activeTab === "mark"} to {activeTab === "objects"} for AI Mark generator stuff
content = content.replace('{activeTab === "mark" && (', '{activeTab === "objects" && (')

with open(file_path, 'w') as f:
    f.write(content)
print("Updated Tabs")
