import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Update labels
content = content.replace('tabObjectsLabel: "OBJECTS",', 'tabObjectsLabel: "OBJECTS",\n    tabMarkLabel: "AI MARK",\n    tabDataLabel: "DATA",')
content = content.replace('tabObjectsLabel: "デザイン＆オブジェクト",', 'tabObjectsLabel: "オブジェクト",\n    tabMarkLabel: "AIマーク",\n    tabDataLabel: "データ",')

# 2. Update activeTab state
target_state = 'const [activeTab, setActiveTab] = useState<"text" | "mark" | "style" | "3d">(\n    "text",\n  );'
replace_state = 'const [activeTab, setActiveTab] = useState<"objects" | "mark" | "style">(\n    "objects",\n  );\n  const [activeRightTab, setActiveRightTab] = useState<"3d" | "data">("3d");'
content = content.replace(target_state, replace_state)
content = content.replace('useState<"text" | "mark" | "style" | "3d">("text");', 'useState<"objects" | "mark" | "style">("objects");\n  const [activeRightTab, setActiveRightTab] = useState<"3d" | "data">("3d");')

if target_state not in content and 'useState<"text" | "mark" | "style" | "3d">("text")' not in content:
    content = re.sub(r'const \[activeTab, setActiveTab\] = useState<[^>]+>\(\s*"[^"]+",\s*\);', replace_state, content)


# 3. Update activeTab references that set "text" to "objects"
content = content.replace('setActiveTab("text");', 'setActiveTab("objects");')
content = content.replace('activeTab === "text"', 'activeTab === "objects"')

with open(file_path, 'w') as f:
    f.write(content)
print("State and labels patched")
