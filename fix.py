with open('/app/applet/App.tsx', 'r') as f:
    content = f.read()
import re
content = re.sub(r'\}\)\n\s*</>\n\s*\)\}\n\s*</div>\n</aside>', '})\n          </div>\n        </>\n      )}\n    </div>\n  </aside>', content)
with open('/app/applet/App.tsx', 'w') as f:
    f.write(content)
