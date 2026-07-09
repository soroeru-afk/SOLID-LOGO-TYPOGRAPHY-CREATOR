import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    'history.map((sn) => (\n                <div\n                  key={sn.id}',
    'history.map((sn, idx) => (\n                <div\n                  key={sn.id + "-" + idx}'
)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched history key successfully")
