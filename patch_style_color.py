import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

target = """                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1">
                    <span className="ss-number">01</span>
                    <span className="ss-title">{t("labelColorSettings")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
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
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        const c = "#000000";
                        setColorFace(c);
                        setColorMain(c);
                        setColorSub(c);
                        setColorMark(c);
                        setOrnaments(
                          ornaments.map((o) => ({ ...o, color: c })),
                        );
                        setColorSide("#333333");
                        setBgColor("#FFFFFF");
                      }}
                      className="flex-1 ss-btn py-1 px-2 border border-[var(--border-base)] text-[9px] hover:bg-[var(--text-bright)] hover:text-[var(--bg-main)] flex items-center justify-center gap-1 transition-colors"
                    >
                      <div className="w-2 h-2 bg-black border border-gray-400"></div>{" "}
                      B on W
                    </button>
                    <button
                      onClick={() => {
                        const c = "#FFFFFF";
                        setColorFace(c);
                        setColorMain(c);
                        setColorSub(c);
                        setColorMark(c);
                        setOrnaments(
                          ornaments.map((o) => ({ ...o, color: c })),
                        );
                        setColorSide("#808080");
                        setBgColor("#1A1A1A");
                      }}
                      className="flex-1 ss-btn py-1 px-2 border border-[var(--border-base)] text-[9px] hover:bg-[var(--text-bright)] hover:text-[var(--bg-main)] flex items-center justify-center gap-1 transition-colors"
                    >
                      <div className="w-2 h-2 bg-white border border-gray-400"></div>{" "}
                      W on B
                    </button>
                  </div>
                </div>"""

replacement = """                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1">
                    <span className="ss-number">01</span>
                    <span className="ss-title">{t("labelColorSettings")}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div>
                      <div className="ss-label mb-1 text-[8px] justify-between">
                        ALL FACE
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
                  </div>

                  <div className="flex gap-2 mt-3 mb-4">
                    <button
                      onClick={() => {
                        const c = "#000000";
                        setColorFace(c);
                        setColorMain(c);
                        setColorSub(c);
                        setColorMark(c);
                        setOrnaments(
                          ornaments.map((o) => ({ ...o, color: c })),
                        );
                        setColorSide("#333333");
                        setBgColor("#FFFFFF");
                      }}
                      className="flex-1 ss-btn py-1 px-2 border border-[var(--border-base)] text-[9px] hover:bg-[var(--text-bright)] hover:text-[var(--bg-main)] flex items-center justify-center gap-1 transition-colors"
                    >
                      <div className="w-2 h-2 bg-black border border-gray-400"></div>{" "}
                      B on W
                    </button>
                    <button
                      onClick={() => {
                        const c = "#FFFFFF";
                        setColorFace(c);
                        setColorMain(c);
                        setColorSub(c);
                        setColorMark(c);
                        setOrnaments(
                          ornaments.map((o) => ({ ...o, color: c })),
                        );
                        setColorSide("#808080");
                        setBgColor("#1A1A1A");
                      }}
                      className="flex-1 ss-btn py-1 px-2 border border-[var(--border-base)] text-[9px] hover:bg-[var(--text-bright)] hover:text-[var(--bg-main)] flex items-center justify-center gap-1 transition-colors"
                    >
                      <div className="w-2 h-2 bg-white border border-gray-400"></div>{" "}
                      W on B
                    </button>
                  </div>

                  <div className="border-t border-[var(--border-base)] pt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <div className="ss-label text-[9px] mb-1 opacity-80">{t("labelMainText")}</div>
                      <div className="flex gap-2">
                        <label className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]">
                          FACE
                          <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                            <input type="color" value={colorMain} onChange={(e) => setColorMain(e.target.value)} className="w-full h-4 cursor-pointer border-none bg-transparent" />
                          </div>
                        </label>
                        <label className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]">
                          EDGE
                          <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                            <input type="color" value={outlineMain} onChange={(e) => setOutlineMain(e.target.value)} className="w-full h-4 cursor-pointer border-none bg-transparent" />
                          </div>
                        </label>
                      </div>
                    </div>
                    <div>
                      <div className="ss-label text-[9px] mb-1 opacity-80">{t("labelSubText")}</div>
                      <div className="flex gap-2">
                        <label className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]">
                          FACE
                          <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                            <input type="color" value={colorSub} onChange={(e) => setColorSub(e.target.value)} className="w-full h-4 cursor-pointer border-none bg-transparent" />
                          </div>
                        </label>
                        <label className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]">
                          EDGE
                          <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                            <input type="color" value={outlineSub} onChange={(e) => setOutlineSub(e.target.value)} className="w-full h-4 cursor-pointer border-none bg-transparent" />
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    {attachedMark && (
                      <div>
                        <div className="ss-label text-[9px] mb-1 opacity-80">AI MARK</div>
                        <div className="flex gap-2">
                          <label className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]">
                            FACE
                            <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                              <input type="color" value={colorMark} onChange={(e) => setColorMark(e.target.value)} className="w-full h-4 cursor-pointer border-none bg-transparent" />
                            </div>
                          </label>
                          <label className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]">
                            EDGE
                            <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                              <input type="color" value={outlineMark} onChange={(e) => setOutlineMark(e.target.value)} className="w-full h-4 cursor-pointer border-none bg-transparent" />
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                    
                    <div className="col-span-2 mt-1">
                      <div className="ss-label text-[9px] mb-1 opacity-80">{t("labelOrnaments")}</div>
                      <div className="flex gap-2">
                        {ornaments.map((ornament, idx) => (
                          <label key={idx} className="flex-1 flex flex-col items-start text-[8px] text-[var(--text-base)]">
                            {t(`labelOrnament${idx + 1}` as any) || `ORN ${idx + 1}`}
                            <div className="flex w-full mt-1 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-base)]">
                              <input 
                                type="color" 
                                value={ornament.color} 
                                onChange={(e) => {
                                  const newOrn = [...ornaments];
                                  newOrn[idx].color = e.target.value;
                                  setOrnaments(newOrn);
                                }} 
                                className="w-full h-4 cursor-pointer border-none bg-transparent" 
                              />
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>"""

content = content.replace(target, replacement)
with open(file_path, 'w') as f:
    f.write(content)
print("Updated color settings panel")
