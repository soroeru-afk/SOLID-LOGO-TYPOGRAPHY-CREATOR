import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

target = """    const proposedWidth = maxX - minX;
    const proposedHeight = maxY - minY;
    canvas.width = Math.min(12000, Math.max(1024, proposedWidth));
    canvas.height = Math.min(12000, Math.max(1024, proposedHeight));
    const originX = -minX;
    const originY = -minY;"""

replacement = """    const maxAbsX = Math.max(Math.abs(minX), Math.abs(maxX));
    const maxAbsY = Math.max(Math.abs(minY), Math.abs(maxY));
    const proposedWidth = maxAbsX * 2;
    const proposedHeight = maxAbsY * 2;
    canvas.width = Math.min(12000, Math.max(1024, proposedWidth));
    canvas.height = Math.min(12000, Math.max(1024, proposedHeight));
    const originX = canvas.width / 2;
    const originY = canvas.height / 2;"""

content = content.replace(target, replacement)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched origin successfully")
