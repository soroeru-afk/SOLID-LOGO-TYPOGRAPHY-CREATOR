import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

start_marker = '<div className="ss-panel p-3 animate-fade-in">\n                  <div className="ss-label mb-2 mt-1 flex justify-between items-center">\n                    <div className="flex items-center gap-2">\n                      <span className="ss-number">02</span>'
end_marker = '<div className="ss-panel p-3 animate-fade-in">\n                  <div className="ss-label mb-2 mt-1 flex justify-between items-center">\n                    <div>\n                      <span className="ss-number">07</span>'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    sys.exit(1)

replacement = """                {ornaments.map((ornament, idx) => (
                  <div key={`ornament-${idx}`} className="ss-panel p-3 animate-fade-in">
                    <div className="ss-label mb-2 mt-1 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="ss-number">{String(idx + 2).padStart(2, "0")}</span>
                        <span className="ss-title">{t(`labelOrnament${idx + 1}` as any) || `ORNAMENT ${idx + 1}`}</span>
                        {ornament.type !== "none" && (
                          <span className="flex items-center gap-1 ml-2 text-[var(--text-base)]">
                            COLOR{" "}
                            <input
                              type="color"
                              value={ornament.color}
                              onChange={(e) => {
                                const newOrn = [...ornaments];
                                newOrn[idx].color = e.target.value;
                                setOrnaments(newOrn);
                              }}
                              className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0"
                            />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {idx > 0 && (
                          <button
                            onClick={() => {
                              const newOrn = [...ornaments];
                              const temp = newOrn[idx - 1];
                              newOrn[idx - 1] = newOrn[idx];
                              newOrn[idx] = temp;
                              setOrnaments(newOrn);
                            }}
                            className="p-1 hover:text-[var(--active-color)] opacity-70 hover:opacity-100"
                            title="Move Up (Render Below)"
                          >
                            ↑
                          </button>
                        )}
                        {idx < ornaments.length - 1 && (
                          <button
                            onClick={() => {
                              const newOrn = [...ornaments];
                              const temp = newOrn[idx + 1];
                              newOrn[idx + 1] = newOrn[idx];
                              newOrn[idx] = temp;
                              setOrnaments(newOrn);
                            }}
                            className="p-1 hover:text-[var(--active-color)] opacity-70 hover:opacity-100"
                            title="Move Down (Render Above)"
                          >
                            ↓
                          </button>
                        )}
                        <ResetBtn
                          onClick={() => {
                            const newOrn = [...ornaments];
                            newOrn[idx] = {
                              type: "none",
                              offsetX: 0,
                              offsetY: 0,
                              scale: 1.0,
                              width: 1.0,
                              thickness: 15,
                              dash: 0,
                              color: "#000000"
                            };
                            setOrnaments(newOrn);
                          }}
                        />
                      </div>
                    </div>
                    <select
                      value={ornament.type}
                      onChange={(e) => {
                        const newOrn = [...ornaments];
                        newOrn[idx].type = e.target.value;
                        setOrnaments(newOrn);
                      }}
                      className="ss-select w-full mb-3"
                    >
                      {ORNAMENTS.map((o) => (
                        <option key={o.id} value={o.id}>
                          {t(o.labelKey as any)}
                        </option>
                      ))}
                    </select>

                    {ornament.type !== "none" && (
                      <div className="animate-fade-in mt-2 border-t border-[var(--border-base)] pt-3">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <div className="ss-label mb-2 text-[9px] flex items-center">
                              <span>{t("labelHorizontalPos")}</span>
                              <span className="ml-auto opacity-70 mr-1">
                                {ornament.offsetX}
                              </span>
                              <ResetBtn
                                onClick={() => {
                                  const newOrn = [...ornaments];
                                  newOrn[idx].offsetX = 0;
                                  setOrnaments(newOrn);
                                }}
                              />
                            </div>
                            <input
                              type="range"
                              min="-1000"
                              max="1000"
                              step="10"
                              value={ornament.offsetX}
                              onChange={(e) => {
                                const newOrn = [...ornaments];
                                newOrn[idx].offsetX = Number(e.target.value);
                                setOrnaments(newOrn);
                              }}
                              className="ss-slider mb-4"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="ss-label mb-2 text-[9px] flex items-center">
                              <span>{t("labelVerticalPos")}</span>
                              <span className="ml-auto opacity-70 mr-1">
                                {ornament.offsetY}
                              </span>
                              <ResetBtn
                                onClick={() => {
                                  const newOrn = [...ornaments];
                                  newOrn[idx].offsetY = 0;
                                  setOrnaments(newOrn);
                                }}
                              />
                            </div>
                            <input
                              type="range"
                              min="-1000"
                              max="1000"
                              step="10"
                              value={ornament.offsetY}
                              onChange={(e) => {
                                const newOrn = [...ornaments];
                                newOrn[idx].offsetY = Number(e.target.value);
                                setOrnaments(newOrn);
                              }}
                              className="ss-slider mb-4"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <div className="flex-1">
                            <div className="ss-label mb-2 text-[9px] flex items-center">
                              <span>{t("labelOrnamentScale")}</span>
                              <span className="ml-auto opacity-70 mr-1">
                                {ornament.scale.toFixed(1)}
                              </span>
                              <ResetBtn
                                onClick={() => {
                                  const newOrn = [...ornaments];
                                  newOrn[idx].scale = 1.0;
                                  setOrnaments(newOrn);
                                }}
                              />
                            </div>
                            <input
                              type="range"
                              min="0.1"
                              max="5.0"
                              step="0.1"
                              value={ornament.scale}
                              onChange={(e) => {
                                const newOrn = [...ornaments];
                                newOrn[idx].scale = Number(e.target.value);
                                setOrnaments(newOrn);
                              }}
                              className="ss-slider mb-4"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="ss-label mb-2 text-[9px] flex items-center">
                              <span>{t("labelOrnamentWidth")}</span>
                              <span className="ml-auto opacity-70 mr-1">
                                {ornament.width.toFixed(1)}
                              </span>
                              <ResetBtn
                                onClick={() => {
                                  const newOrn = [...ornaments];
                                  newOrn[idx].width = 1.0;
                                  setOrnaments(newOrn);
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
                                const newOrn = [...ornaments];
                                newOrn[idx].width = Number(e.target.value);
                                setOrnaments(newOrn);
                              }}
                              className="ss-slider mb-4"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <div className="flex-1">
                            <div className="ss-label mb-2 text-[9px] flex items-center">
                              <span>{t("labelOrnamentThickness")}</span>
                              <span className="ml-auto opacity-70 mr-1">
                                {ornament.thickness}
                              </span>
                              <ResetBtn
                                onClick={() => {
                                  const newOrn = [...ornaments];
                                  newOrn[idx].thickness = 15;
                                  setOrnaments(newOrn);
                                }}
                              />
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="100"
                              step="1"
                              value={ornament.thickness}
                              onChange={(e) => {
                                const newOrn = [...ornaments];
                                newOrn[idx].thickness = Number(e.target.value);
                                setOrnaments(newOrn);
                              }}
                              className="ss-slider mb-2"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="ss-label mb-2 text-[9px] flex items-center">
                              <span>{t("labelOrnamentDash")}</span>
                              <span className="ml-auto opacity-70 mr-1">
                                {ornament.dash}
                              </span>
                              <ResetBtn
                                onClick={() => {
                                  const newOrn = [...ornaments];
                                  newOrn[idx].dash = 0;
                                  setOrnaments(newOrn);
                                }}
                              />
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={ornament.dash}
                              onChange={(e) => {
                                const newOrn = [...ornaments];
                                newOrn[idx].dash = Number(e.target.value);
                                setOrnaments(newOrn);
                              }}
                              className="ss-slider mb-2"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
"""

new_content = content[:start_idx] + replacement + content[end_idx:]

with open(file_path, 'w') as f:
    f.write(new_content)
print("Patched UI successfully")
