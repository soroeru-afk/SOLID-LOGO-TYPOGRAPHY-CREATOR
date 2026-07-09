import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

target = """    const proposedWidth = maxX - minX;
    const proposedHeight = maxY - minY;

    canvas.width = Math.min(12000, Math.max(1024, proposedWidth));
    canvas.height = Math.min(12000, Math.max(1024, proposedHeight));

    const originX = -minX;
    const originY = -minY;

    // Clear background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(originX, originY);"""

replacement = """    const maxAbsX = Math.max(Math.abs(minX), Math.abs(maxX)) + Math.abs(globalOffsetX);
    const maxAbsY = Math.max(Math.abs(minY), Math.abs(maxY)) + Math.abs(globalOffsetY);
    const proposedWidth = maxAbsX * 2;
    const proposedHeight = maxAbsY * 2;

    canvas.width = Math.min(12000, Math.max(1024, proposedWidth));
    canvas.height = Math.min(12000, Math.max(1024, proposedHeight));

    const originX = canvas.width / 2;
    const originY = canvas.height / 2;

    // Clear background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(originX + globalOffsetX, originY + globalOffsetY);"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Target not found")
