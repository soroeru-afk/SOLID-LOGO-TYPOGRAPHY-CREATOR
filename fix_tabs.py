import re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Left tabs
left_tabs_search = """          <div className="flex shrink-0 px-4 pt-4 pb-0 gap-1">
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
            <button
              onClick={() => setActiveTab("mark")}
              className={`flex-1 py-2 rounded text-[8px] font-bold tracking-wider transition-colors ${activeTab === "mark" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tabMarkLabel")}
            </button>
          </div>"""

left_tabs_replace = """          <div className="flex shrink-0 px-4 pt-4 pb-0 gap-2">
            <button
              onClick={() => setActiveTab("objects")}
              className={`flex-1 ss-btn py-2 flex justify-center text-[8px] ${activeTab === "objects" ? "ss-btn-active" : ""}`}
            >
              {t("tabObjectsLabel")}
            </button>
            <button
              onClick={() => setActiveTab("style")}
              className={`flex-1 ss-btn py-2 flex justify-center text-[8px] ${activeTab === "style" ? "ss-btn-active" : ""}`}
            >
              {t("tabLayoutColorLabel")}
            </button>
            <button
              onClick={() => setActiveTab("mark")}
              className={`flex-1 ss-btn py-2 flex justify-center text-[8px] ${activeTab === "mark" ? "ss-btn-active" : ""}`}
            >
              {t("tabMarkLabel")}
            </button>
          </div>"""

content = content.replace(left_tabs_search, left_tabs_replace)

# Right tabs
right_tabs_search = """          <div className="flex shrink-0 px-4 pt-4 pb-0 gap-1 border-b border-[var(--border-base)] pb-3 mb-1">
            <button
              onClick={() => setActiveRightTab("3d")}
              className={`flex-1 py-1.5 rounded text-[8px] font-bold tracking-wider transition-colors ${activeRightTab === "3d" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tab3dLabel")}
            </button>
            <button
              onClick={() => setActiveRightTab("data")}
              className={`flex-1 py-1.5 rounded text-[8px] font-bold tracking-wider transition-colors ${activeRightTab === "data" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
            >
              {t("tabDataLabel")}
            </button>
          </div>"""

right_tabs_replace = """          <div className="flex shrink-0 px-4 pt-4 pb-0 gap-2 border-b border-[var(--border-base)] pb-3 mb-1">
            <button
              onClick={() => setActiveRightTab("3d")}
              className={`flex-1 ss-btn py-1.5 flex justify-center text-[8px] ${activeRightTab === "3d" ? "ss-btn-active" : ""}`}
            >
              {t("tab3dLabel")}
            </button>
            <button
              onClick={() => setActiveRightTab("data")}
              className={`flex-1 ss-btn py-1.5 flex justify-center text-[8px] ${activeRightTab === "data" ? "ss-btn-active" : ""}`}
            >
              {t("tabDataLabel")}
            </button>
          </div>"""

content = content.replace(right_tabs_search, right_tabs_replace)

with open(file_path, 'w') as f:
    f.write(content)

