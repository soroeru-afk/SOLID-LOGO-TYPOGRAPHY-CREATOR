import sys

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace('FilePlus,\n, Shapes', 'FilePlus,\nShapes')

with open(file_path, 'w') as f:
    f.write(content)

