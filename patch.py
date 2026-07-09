import sys, re

file_path = '/app/applet/services/sceneBuilder.ts'
with open(file_path, 'r') as f:
    content = f.read()

replacement = """    const distToFront = window.innerHeight / (2 * Math.tan(22.5 * Math.PI / 180) * pixelsPerUnit);
    
    camera.position.set(0, 0, distToFront + (THICKNESS / 2));
    controls.target.set(0, 0, 0);
    camera.setViewOffset(
      window.innerWidth, window.innerHeight,
      -(${imagePanX}), -(${imagePanY}),
      window.innerWidth, window.innerHeight
    );
    controls.update();"""

content = re.sub(
    r'\s*const panUnitX = -.*?;.*?controls\.update\(\);',
    replacement,
    content,
    flags=re.DOTALL
)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched successfully")
