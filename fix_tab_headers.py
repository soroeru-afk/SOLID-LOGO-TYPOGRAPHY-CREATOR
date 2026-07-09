import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Replace left tab headers
left_tabs_target = """        {/* LEFT SIDEBAR: PARAMETERS */}
        <aside className="w-72 border-r border-[var(--border-base)] bg-[var(--bg-panel)]/40 backdrop-blur-sm flex flex-col shrink-0 overflow-hidden">
          <div className="flex shrink-0 px-4 pt-4 pb-0 gap-1">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 py-2 rounded text-[8px] font-bold tracking-wider transition-colors ${activeTab === "objects" ? "text-white bg-[var(--bg-btn-active)] shadow-sm" : "text-[var(--text-base)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-btn)]"}`}
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
          </div>
          <div className="flex-1 overflow-y-scroll p-4 flex flex-col gap-4">"""

left_tabs_replace = """        {/* LEFT SIDEBAR: PARAMETERS */}
        <aside className="w-72 border-r border-[var(--border-base)] bg-[var(--bg-panel)]/40 backdrop-blur-sm flex flex-col shrink-0 overflow-hidden">
          <div className="flex shrink-0 px-4 pt-4 pb-0 gap-1">
            <button
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
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative">"""

if left_tabs_target in content:
    content = content.replace(left_tabs_target, left_tabs_replace)
    print("Replaced left tab headers")
else:
    # Try regex if exact match fails
    print("Could not find left_tabs_target exactly.")


# Now we also want to add headers to the right sidebar.
# Let's find the right sidebar marker.
right_sidebar_target = """        {/* RIGHT SIDEBAR: HISTORY/PRESETS */}
        <aside className="w-48 border-l border-[var(--border-base)] bg-[var(--bg-panel)]/40 backdrop-blur-sm p-4 flex flex-col gap-4 shrink-0 overflow-y-auto">"""

right_sidebar_replace = """        {/* RIGHT SIDEBAR: SETTINGS & HISTORY */}
        <aside className="w-48 border-l border-[var(--border-base)] bg-[var(--bg-panel)]/40 backdrop-blur-sm flex flex-col shrink-0 overflow-hidden">
          <div className="flex shrink-0 px-4 pt-4 pb-0 gap-1 border-b border-[var(--border-base)] pb-3 mb-1">
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
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative">"""

if right_sidebar_target in content:
    content = content.replace(right_sidebar_target, right_sidebar_replace)
    print("Replaced right tab headers")
else:
    print("Could not find right_sidebar_target exactly.")


with open(file_path, 'w') as f:
    f.write(content)

