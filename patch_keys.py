import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Fix addTab ID
content = content.replace(
    'const newId = "tab-" + Date.now();\n    const index = tabs.length + 1;',
    'const newId = "tab-" + Date.now() + "-" + Math.random().toString(36).substring(2,6);\n    const index = tabs.length + 1;'
)

# Fix clearAllTabs ID
content = content.replace(
    'const newId = "tab-" + Date.now();\n    setTabs([{ id: newId, name: "TAB 01", settings: null }]);',
    'const newId = "tab-" + Date.now() + "-" + Math.random().toString(36).substring(2,6);\n    setTabs([{ id: newId, name: "TAB 01", settings: null }]);'
)

# Fix history ID
content = content.replace(
    'id: Date.now().toString(),\n      image: thumb,',
    'id: Date.now().toString() + "-" + Math.random().toString(36).substring(2,6),\n      image: thumb,'
)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched keys successfully")
