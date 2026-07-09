import sys

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if '<div className="flex shrink-0 px-4 pt-4 pb-0 gap-1">' in line and i > 2500 and i < 2600:
        new_lines.append(line)
        new_lines.append("""            <button
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
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
""")
        skip = True
    elif skip and '<div className="flex-1 overflow-y-scroll p-4 flex flex-col gap-4">' in line:
        skip = False
    elif not skip:
        new_lines.append(line)

with open(file_path, 'w') as f:
    f.writelines(new_lines)
print("Left tabs updated.")
