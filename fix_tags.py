import sys

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

target = """                    onChange={(e) => setSubOffsetY(Number(e.target.value))}
                    className="ss-slider mb-2"
                  />
                </div>

                <div className="ss-panel p-3 animate-fade-in">"""

replacement = """                    onChange={(e) => setSubOffsetY(Number(e.target.value))}
                    className="ss-slider mb-2"
                  />
                    </>
                  )}
                </div>

                <div className="ss-panel p-3 animate-fade-in">"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Fixed SUB TEXT tags")
else:
    print("Target not found")
