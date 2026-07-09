import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

target = """                      W on B
                    </button>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border-base)]">"""

replacement = """                      W on B
                    </button>
                  </div>

                  <div className="border-t border-[var(--border-base)] mt-4 pt-3 grid grid-cols-2 gap-x-4 gap-y-3">
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
                      <div className="col-span-2">
                        <div className="ss-label text-[9px] mb-1 opacity-80">AI MARK</div>
                        <div className="flex gap-2 w-1/2 pr-2">
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
                      <div className="ss-label text-[9px] mb-1 opacity-80">ORNAMENTS</div>
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

                  <div className="mt-4 pt-3 border-t border-[var(--border-base)]">"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Target not found")

