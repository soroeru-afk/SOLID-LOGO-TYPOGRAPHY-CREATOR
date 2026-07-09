import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

target = """                  </div>
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
                        setColorSide("#CCCCCC");
                        setBgColor("#000000");
                      }}
                      className="flex-1 ss-btn py-1 px-2 border border-[var(--border-base)] text-[9px] hover:bg-[var(--text-bright)] hover:text-[var(--bg-main)] flex items-center justify-center gap-1 transition-colors"
                    >
                      <div className="w-2 h-2 bg-white border border-gray-400"></div>{" "}
                      W on B
                    </button>
                  </div>"""

replacement = """                  </div>"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Target not found")
