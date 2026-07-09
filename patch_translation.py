import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    'labelOrnament2: "ORNAMENT 2",',
    'labelOrnament2: "ORNAMENT 2",\n    labelOrnament3: "ORNAMENT 3",'
)

content = content.replace(
    'labelOrnament2: "装飾 2",',
    'labelOrnament2: "装飾 2",\n    labelOrnament3: "装飾 3",'
)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched translation successfully")
