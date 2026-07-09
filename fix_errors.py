import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Fix duplicate declaration
target = 'const [activeRightTab, setActiveRightTab] = useState<"3d" | "data">("3d");\n  const [activeRightTab, setActiveRightTab] = useState<"3d" | "data">("3d");'
if target in content:
    content = content.replace(target, 'const [activeRightTab, setActiveRightTab] = useState<"3d" | "data">("3d");')
else:
    # try regex
    content = re.sub(r'(const \[activeRightTab, setActiveRightTab\] = useState<"3d" \| "data">\(.*?\);\n\s*){2,}', '  const [activeRightTab, setActiveRightTab] = useState<"3d" | "data">("3d");\n', content)

# Check for unclosed divs
# The right sidebar was modified:
# The right sidebar ends with:
#           </div>
#         </aside>
#       </div>
# Let's verify right sidebar's {activeRightTab === "3d" && (...)} wrapping.
