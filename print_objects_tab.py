with open('/app/applet/App.tsx', 'r') as f:
    content = f.read()
import re
match = re.search(r'\{activeTab === "objects" && \(\s*<>\s*(.*?)\s*</>\s*\)\}', content, re.DOTALL)
if match:
    print(match.group(1)[:500])
    print("...")
    print(match.group(1)[-500:])
else:
    print("Not found")
