import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

ui_replacement = """            {activeTab === "text" && (
              <>
                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1">
                    <span className="ss-title flex-1">{t("labelOffset")}</span>
                  </div>
                  <div className="ss-label mb-2 mt-3 text-[9px] flex items-center">
                    <span>{t("labelOffsetX")}</span>
                    <span className="ml-auto opacity-70 mr-2">{globalOffsetX}PX</span>
                    <ResetBtn onClick={() => setGlobalOffsetX(0)} />
                  </div>
                  <input type="range" min="-1000" max="1000" step="10" value={globalOffsetX} onChange={(e) => setGlobalOffsetX(Number(e.target.value))} className="ss-slider mb-4" />
                  <div className="ss-label mb-2 text-[9px] flex items-center">
                    <span>{t("labelOffsetY")}</span>
                    <span className="ml-auto opacity-70 mr-2">{globalOffsetY}PX</span>
                    <ResetBtn onClick={() => setGlobalOffsetY(0)} />
                  </div>
                  <input type="range" min="-1000" max="1000" step="10" value={globalOffsetY} onChange={(e) => setGlobalOffsetY(Number(e.target.value))} className="ss-slider" />
                </div>
"""

content = content.replace(
    '            {activeTab === "text" && (\n              <>',
    ui_replacement
)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched UI successfully")
