import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

pattern = re.compile(r'\s*<div className="flex gap-2 mt-3">\s*<button\s*onClick=\{\(\) => \{\s*const c = "#000000";\s*setColorFace\(c\);\s*setColorMain\(c\);\s*setColorSub\(c\);\s*setColorMark\(c\);\s*setOrnaments\(\s*ornaments.map\(\(o\) => \(\{ \.\.\.o, color: c \}\)\),\s*\);\s*setColorSide\("#333333"\);\s*setBgColor\("#FFFFFF"\);\s*\}\}\s*className="flex-1 ss-btn py-1 px-2 border border-\[var\(--border-base\)\] text-\[9px\] hover:bg-\[var\(--text-bright\)\] hover:text-\[var\(--bg-main\)\] flex items-center justify-center gap-1 transition-colors"\s*>\s*<div className="w-2 h-2 bg-black border border-gray-400"></div>\{" "\}\s*B on W\s*</button>\s*<button\s*onClick=\{\(\) => \{\s*const c = "#FFFFFF";\s*setColorFace\(c\);\s*setColorMain\(c\);\s*setColorSub\(c\);\s*setColorMark\(c\);\s*setOrnaments\(\s*ornaments.map\(\(o\) => \(\{ \.\.\.o, color: c \}\)\),\s*\);\s*setColorSide\("#CCCCCC"\);\s*setBgColor\("#000000"\);\s*\}\}\s*className="flex-1 ss-btn py-1 px-2 border border-\[var\(--border-base\)\] text-\[9px\] hover:bg-\[var\(--text-bright\)\] hover:text-\[var\(--bg-main\)\] flex items-center justify-center gap-1 transition-colors"\s*>\s*<div className="w-2 h-2 bg-white border border-gray-400"></div>\{" "\}\s*W on B\s*</button>\s*</div>')

if pattern.search(content):
    content = pattern.sub("", content)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Target not found")
