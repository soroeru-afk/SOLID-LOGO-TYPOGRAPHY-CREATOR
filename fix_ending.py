import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = re.sub(r'\)\}\s*</>\s*\)\}\s*</div></aside>', ')}\n          </div>\n        </>\n      )}\n    </div>\n  </aside>', content)

with open(file_path, 'w') as f:
    f.write(content)
print("Done")
