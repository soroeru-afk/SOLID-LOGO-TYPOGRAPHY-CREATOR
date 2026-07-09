import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

start_marker = '{/* RIGHT SIDEBAR: SETTINGS & HISTORY */}'
end_marker = '{/* FOOTER BAR */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_sidebar = """{/* RIGHT SIDEBAR: SETTINGS & HISTORY */}
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
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative">
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
                  <div className="flex flex-col gap-1 overflow-y-auto">
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
              </>
            )}
            
            {activeRightTab === "data" && (
              <>
                <div className="ss-label">
                  <span className="ss-number">04</span>
                  <span className="ss-title">{t("labelHistory")}</span>
                </div>
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
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
              </>
            )}
          </div>
        </aside>
      </div>

      """

content = content[:start_idx] + new_sidebar + content[end_idx:]

with open(file_path, 'w') as f:
    f.write(content)
print("Replaced completely")
