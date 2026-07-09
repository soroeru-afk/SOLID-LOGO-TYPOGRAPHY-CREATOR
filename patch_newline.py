import sys, re

file_path = '/app/applet/services/sceneBuilder.ts'
with open(file_path, 'r') as f:
    content = f.read()

target = "const pixelsPerUnit = (img.width * finalScale2D) / w;    const panUnitX = -(${imagePanX}) / pixelsPerUnit;"
replacement = "const pixelsPerUnit = (img.width * finalScale2D) / w;\n    const panUnitX = -(${imagePanX}) / pixelsPerUnit;"
content = content.replace(target, replacement)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched newline")
