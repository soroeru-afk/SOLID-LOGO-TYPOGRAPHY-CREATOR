import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

target = """    return [
      {
        type: "solid_circle",
        offsetX: 0,
        offsetY: 0,
        scale: 0.35,
        width: 1.0,
        thickness: 13,
        dash: 15,
        color: "#000000",
      },
      {
        type: "none",
        offsetX: 0,
        offsetY: 90,
        scale: 1.0,
        width: 2.2,
        thickness: 5,
        dash: 0,
        color: "#000000",
      },
    ];"""

replacement = """    return [
      {
        type: "solid_circle",
        offsetX: 0,
        offsetY: 0,
        scale: 0.35,
        width: 1.0,
        thickness: 13,
        dash: 15,
        color: "#000000",
      },
      {
        type: "none",
        offsetX: 0,
        offsetY: 90,
        scale: 1.0,
        width: 2.2,
        thickness: 5,
        dash: 0,
        color: "#000000",
      },
      {
        type: "none",
        offsetX: 0,
        offsetY: -90,
        scale: 1.0,
        width: 2.2,
        thickness: 5,
        dash: 0,
        color: "#000000",
      },
    ];"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Patched state successfully")
else:
    print("State target not found")
