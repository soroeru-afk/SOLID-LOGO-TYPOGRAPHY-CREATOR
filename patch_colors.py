import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Remove colors from AI MARK
mark_target = """                        <div className="flex-1"></div>
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
                        </span>"""
mark_replacement = """                        <div className="flex-1"></div>"""
content = content.replace(mark_target, mark_replacement)

# 2. Remove colors from MAIN TEXT
main_target = """                      <div className="flex-1"></div>
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
                      </span>"""
main_replacement = """                      <div className="flex-1"></div>"""
content = content.replace(main_target, main_replacement)

# 3. Remove colors from SUB TEXT
sub_target = """                      <div className="flex-1"></div>
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
                      </span>"""
sub_replacement = """                      <div className="flex-1"></div>"""
content = content.replace(sub_target, sub_replacement)

# 4. Remove colors from Ornaments
orn_target = """                        <span className="ss-title whitespace-nowrap flex-shrink-0">{t(`labelOrnament${idx + 1}` as any) || `ORNAMENT ${idx + 1}`}</span>
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
                        )}"""
orn_replacement = """                        <span className="ss-title whitespace-nowrap flex-shrink-0">{t(`labelOrnament${idx + 1}` as any) || `ORNAMENT ${idx + 1}`}</span>"""
content = content.replace(orn_target, orn_replacement)

with open(file_path, 'w') as f:
    f.write(content)
print("Removed color pickers from headers")
