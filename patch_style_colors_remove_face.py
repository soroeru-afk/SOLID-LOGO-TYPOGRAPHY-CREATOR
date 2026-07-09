import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

target = """                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div>
                      <div className="ss-label mb-1 text-[8px] justify-between">
                        {t("labelFaceColor")}{" "}
                        <ResetBtn
                          onClick={() => {
                            const c = "#F0E6D2";
                            setColorFace(c);
                            setColorMain(c);
                            setColorSub(c);
                            setColorMark(c);
                            setOrnaments(
                              ornaments.map((o) => ({ ...o, color: c })),
                            );
                          }}
                        />
                      </div>
                      <div className="flex bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                        <input
                          type="color"
                          value={colorFace}
                          onChange={(e) => {
                            const c = e.target.value;
                            setColorFace(c);
                            setColorMain(c);
                            setColorSub(c);
                            setColorMark(c);
                            setOrnaments(
                              ornaments.map((o) => ({ ...o, color: c })),
                            );
                          }}
                          className="w-full h-8 cursor-pointer border-none bg-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="ss-label mb-1 text-[8px] justify-between">
                        {t("labelSideColor")}{" "}
                        <ResetBtn onClick={() => setColorSide("#808080")} />
                      </div>
                      <div className="flex bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                        <input
                          type="color"
                          value={colorSide}
                          onChange={(e) => setColorSide(e.target.value)}
                          className="w-full h-8 cursor-pointer border-none bg-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="ss-label mb-1 text-[8px] justify-between">
                        {t("labelBgColor2")}{" "}
                        <ResetBtn onClick={() => setBgColor("#1A1A1A")} />
                      </div>
                      <div className="flex bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-full h-8 cursor-pointer border-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>"""

replacement = """                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div>
                      <div className="ss-label mb-1 text-[8px] justify-between">
                        {t("labelSideColor")}{" "}
                        <ResetBtn onClick={() => setColorSide("#808080")} />
                      </div>
                      <div className="flex bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                        <input
                          type="color"
                          value={colorSide}
                          onChange={(e) => setColorSide(e.target.value)}
                          className="w-full h-8 cursor-pointer border-none bg-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="ss-label mb-1 text-[8px] justify-between">
                        {t("labelBgColor2")}{" "}
                        <ResetBtn onClick={() => setBgColor("#1A1A1A")} />
                      </div>
                      <div className="flex bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-full h-8 cursor-pointer border-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Target not found")
