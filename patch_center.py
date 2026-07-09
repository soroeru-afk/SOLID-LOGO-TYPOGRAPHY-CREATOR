import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

target = """              ) : viewMode === "image" && imageData ? (
                <div className="w-full h-full flex items-center justify-center overflow-hidden relative cursor-grab active:cursor-grabbing">
                  <div
                    className="relative flex items-center justify-center pointer-events-none"
                    style={{
                      transform: `translate(${imagePan.x}px, ${imagePan.y}px) scale(${imageZoom * 0.5})`,
                    }}
                  >"""

replacement = """              ) : viewMode === "image" && imageData ? (
                <div className="w-full h-full overflow-hidden relative cursor-grab active:cursor-grabbing">
                  <div
                    className="absolute top-1/2 left-1/2 pointer-events-none flex items-center justify-center"
                    style={{
                      transform: `translate(calc(-50% + ${imagePan.x}px), calc(-50% + ${imagePan.y}px)) scale(${imageZoom * 0.5})`,
                    }}
                  >"""

content = content.replace(target, replacement)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched center successfully")
