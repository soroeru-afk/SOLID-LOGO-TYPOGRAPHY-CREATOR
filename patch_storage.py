import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

target = """  >(() => {
    try {
      const saved = localStorage.getItem("solid_typography_ornaments");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ["""

replacement = """  >(() => {
    try {
      const saved = localStorage.getItem("solid_typography_ornaments");
      if (saved) {
        const parsed = JSON.parse(saved);
        while (parsed.length < 3) {
          parsed.push({
            type: "none",
            offsetX: 0,
            offsetY: parsed.length === 1 ? 90 : -90,
            scale: 1.0,
            width: 2.2,
            thickness: 5,
            dash: 0,
            color: "#000000",
          });
        }
        return parsed;
      }
    } catch (e) {}
    return ["""

content = content.replace(target, replacement)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched storage successfully")
