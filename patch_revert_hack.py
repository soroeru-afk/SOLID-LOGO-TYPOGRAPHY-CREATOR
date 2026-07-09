import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Revert 2D transform
content = content.replace(
    'transform: `translate(${imagePan.x + globalOffsetX}px, ${imagePan.y + globalOffsetY}px) scale(${imageZoom * 0.5})`,',
    'transform: `translate(${imagePan.x}px, ${imagePan.y}px) scale(${imageZoom * 0.5})`,'
)

# Revert 3D imagePan passing
content = content.replace(
    '            imagePan.x + globalOffsetX,\n            imagePan.y + globalOffsetY,\n          );\n          setSceneCode(code);',
    '            imagePan.x,\n            imagePan.y,\n          );\n          setSceneCode(code);'
)
content = content.replace(
    '          imagePan.x + globalOffsetX,\n          imagePan.y + globalOffsetY,\n        );\n        setSceneCode(code);',
    '          imagePan.x,\n          imagePan.y,\n        );\n        setSceneCode(code);'
)

with open(file_path, 'w') as f:
    f.write(content)

file_path = '/app/applet/services/sceneBuilder.ts'
with open(file_path, 'r') as f:
    content = f.read()

# Revert 3D sceneBuilder viewOffset hack
target = """    const distToFront = window.innerHeight / (2 * Math.tan(22.5 * Math.PI / 180) * pixelsPerUnit);
    
    camera.position.set(0, 0, distToFront + (THICKNESS / 2));
    controls.target.set(0, 0, 0);
    camera.setViewOffset(
      window.innerWidth, window.innerHeight,
      -(${imagePanX}), -(${imagePanY}),
      window.innerWidth, window.innerHeight
    );
    controls.update();"""

replacement = """    const panUnitX = -(${imagePanX}) / pixelsPerUnit;
    const panUnitY = (${imagePanY}) / pixelsPerUnit;
    const distToFront = window.innerHeight / (2 * Math.tan(22.5 * Math.PI / 180) * pixelsPerUnit);
    
    camera.position.set(panUnitX, panUnitY, distToFront + (THICKNESS / 2));
    controls.target.set(panUnitX, panUnitY, 0);
    controls.update();"""

content = content.replace(target, replacement)

with open(file_path, 'w') as f:
    f.write(content)
print("Reverted hacks")
