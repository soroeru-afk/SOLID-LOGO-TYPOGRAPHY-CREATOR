import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

target = """    setLetterSpacing(5);
    setLineHeight(1.2);"""

replacement = """    setMainLetterSpacing(5);
    setMainLineHeight(1.2);
    setGlobalOffsetX(0);
    setGlobalOffsetY(0);
    setMainOffsetX(0);
    setMainOffsetY(-50);"""

content = content.replace(target, replacement)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched reset successfully")
