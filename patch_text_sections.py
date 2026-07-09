import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add states
state_target = """  const [collapsedOrnaments, setCollapsedOrnaments] = useState<boolean[]>([false, false, false]);"""
state_replacement = """  const [collapsedMark, setCollapsedMark] = useState(false);
  const [collapsedMain, setCollapsedMain] = useState(false);
  const [collapsedSub, setCollapsedSub] = useState(false);
  const [collapsedOrnaments, setCollapsedOrnaments] = useState<boolean[]>([false, false, false]);"""
content = content.replace(state_target, state_replacement)

# 2. Patch AI MARK
mark_target_start = """                {attachedMark && (
                  <div className="ss-panel p-3 animate-fade-in">
                    <div className="ss-label mb-2 mt-1 flex justify-between items-center w-full">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="ss-number">01</span>
                        <span className="ss-title">AI MARK</span>
                        <button
                          onClick={() => setAttachedMark(null)}
                          className="opacity-50 hover:opacity-100 p-1 transition-opacity text-[var(--text-base)] hover:text-white"
                          title={t("markDeleteTooltip")}
                        >
                          <Trash2 size={12} />
                        </button>
                        <div className="flex-1"></div>
                        <span className="flex items-center gap-1">
                          EDGE{" "}
                          <input
                            type="color"
                            value={outlineMark}
                            onChange={(e) => setOutlineMark(e.target.value)}
                            className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0"
                          />
                        </span>
                        <span className="flex items-center gap-1">
                          COLOR{" "}
                          <input
                            type="color"
                            value={colorMark}
                            onChange={(e) => setColorMark(e.target.value)}
                            className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0"
                          />
                        </span>
                      </div>
                    </div>"""

mark_replacement_start = """                {attachedMark && (
                  <div className="ss-panel p-3 animate-fade-in">
                    <div className="ss-label mb-2 mt-1 flex justify-between items-center w-full">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="ss-number">01</span>
                        <span className="ss-title">AI MARK</span>
                        <button
                          onClick={() => setAttachedMark(null)}
                          className="opacity-50 hover:opacity-100 p-1 transition-opacity text-[var(--text-base)] hover:text-white mr-1"
                          title={t("markDeleteTooltip")}
                        >
                          <Trash2 size={12} />
                        </button>
                        <div className="flex-1"></div>
                        <span className="flex items-center gap-1 text-[9px] mr-2">
                          EDGE{" "}
                          <input
                            type="color"
                            value={outlineMark}
                            onChange={(e) => setOutlineMark(e.target.value)}
                            className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0"
                          />
                        </span>
                        <span className="flex items-center gap-1 text-[9px]">
                          COLOR{" "}
                          <input
                            type="color"
                            value={colorMark}
                            onChange={(e) => setColorMark(e.target.value)}
                            className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0"
                          />
                        </span>
                        <button
                          onClick={() => setCollapsedMark(!collapsedMark)}
                          className="p-1 ml-1 text-[var(--text-base)] hover:text-[var(--active-color)] opacity-70 hover:opacity-100"
                        >
                          {collapsedMark ? "＋" : "−"}
                        </button>
                      </div>
                    </div>
                    {!collapsedMark && (
                      <>"""

mark_target_end = """                      className="ss-slider mb-2"
                    />
                  </div>
                )}"""
mark_replacement_end = """                      className="ss-slider mb-2"
                    />
                      </>
                    )}
                  </div>
                )}"""

content = content.replace(mark_target_start, mark_replacement_start)
content = content.replace(mark_target_end, mark_replacement_end)


# 3. Patch MAIN TEXT
main_target_start = """                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1">
                    <span className="ss-number">
                      {attachedMark ? "02" : "01"}
                    </span>
                    <span className="ss-title flex-1">
                      {t("labelMainText")}
                    </span>
                    <span className="flex items-center gap-1 mx-2">
                      EDGE{" "}
                      <input
                        type="color"
                        value={outlineMain}
                        onChange={(e) => setOutlineMain(e.target.value)}
                        className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0"
                      />
                    </span>
                    <span className="flex items-center gap-1">
                      COLOR{" "}
                      <input
                        type="color"
                        value={colorMain}
                        onChange={(e) => setColorMain(e.target.value)}
                        className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0"
                      />
                    </span>
                  </div>"""

main_replacement_start = """                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1 flex justify-between items-center w-full">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="ss-number">
                        {attachedMark ? "02" : "01"}
                      </span>
                      <span className="ss-title flex-shrink-0">
                        {t("labelMainText")}
                      </span>
                      <div className="flex-1"></div>
                      <span className="flex items-center gap-1 text-[9px] mr-2">
                        EDGE{" "}
                        <input
                          type="color"
                          value={outlineMain}
                          onChange={(e) => setOutlineMain(e.target.value)}
                          className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0"
                        />
                      </span>
                      <span className="flex items-center gap-1 text-[9px]">
                        COLOR{" "}
                        <input
                          type="color"
                          value={colorMain}
                          onChange={(e) => setColorMain(e.target.value)}
                          className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0"
                        />
                      </span>
                      <button
                        onClick={() => setCollapsedMain(!collapsedMain)}
                        className="p-1 ml-1 text-[var(--text-base)] hover:text-[var(--active-color)] opacity-70 hover:opacity-100"
                      >
                        {collapsedMain ? "＋" : "−"}
                      </button>
                    </div>
                  </div>
                  {!collapsedMain && (
                    <>"""

main_target_end = """                    onChange={(e) => setMainOffsetY(Number(e.target.value))}
                    className="ss-slider mb-2"
                  />
                </div>"""
main_replacement_end = """                    onChange={(e) => setMainOffsetY(Number(e.target.value))}
                    className="ss-slider mb-2"
                  />
                    </>
                  )}
                </div>"""

content = content.replace(main_target_start, main_replacement_start)
content = content.replace(main_target_end, main_replacement_end)


# 4. Patch SUB TEXT
sub_target_start = """                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1">
                    <span className="ss-number">
                      {attachedMark ? "03" : "02"}
                    </span>
                    <span className="ss-title flex-1">{t("labelSubText")}</span>
                    <span className="flex items-center gap-1 mx-2">
                      EDGE{" "}
                      <input
                        type="color"
                        value={outlineSub}
                        onChange={(e) => setOutlineSub(e.target.value)}
                        className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0"
                      />
                    </span>
                    <span className="flex items-center gap-1">
                      COLOR{" "}
                      <input
                        type="color"
                        value={colorSub}
                        onChange={(e) => setColorSub(e.target.value)}
                        className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0"
                      />
                    </span>
                  </div>"""

sub_replacement_start = """                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1 flex justify-between items-center w-full">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="ss-number">
                        {attachedMark ? "03" : "02"}
                      </span>
                      <span className="ss-title flex-shrink-0">{t("labelSubText")}</span>
                      <div className="flex-1"></div>
                      <span className="flex items-center gap-1 text-[9px] mr-2">
                        EDGE{" "}
                        <input
                          type="color"
                          value={outlineSub}
                          onChange={(e) => setOutlineSub(e.target.value)}
                          className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0"
                        />
                      </span>
                      <span className="flex items-center gap-1 text-[9px]">
                        COLOR{" "}
                        <input
                          type="color"
                          value={colorSub}
                          onChange={(e) => setColorSub(e.target.value)}
                          className="w-4 h-4 cursor-pointer border-none bg-transparent p-0 m-0"
                        />
                      </span>
                      <button
                        onClick={() => setCollapsedSub(!collapsedSub)}
                        className="p-1 ml-1 text-[var(--text-base)] hover:text-[var(--active-color)] opacity-70 hover:opacity-100"
                      >
                        {collapsedSub ? "＋" : "−"}
                      </button>
                    </div>
                  </div>
                  {!collapsedSub && (
                    <>"""

sub_target_end = """                    onChange={(e) => setSubOffsetY(Number(e.target.value))}
                    className="ss-slider mb-2"
                  />
                </div>
              </div>
            )}"""
sub_replacement_end = """                    onChange={(e) => setSubOffsetY(Number(e.target.value))}
                    className="ss-slider mb-2"
                  />
                    </>
                  )}
                </div>
              </div>
            )}"""

content = content.replace(sub_target_start, sub_replacement_start)
content = content.replace(sub_target_end, sub_replacement_end)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched App.tsx text sections successfully")
