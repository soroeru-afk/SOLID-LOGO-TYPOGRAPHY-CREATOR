with open('/app/applet/App.tsx', 'r') as f:
    content = f.read()

import re

content = re.sub(
    r'const \[collapsedMark, setCollapsedMark\] = useState\(false\);',
    r'const [collapsedMark, setCollapsedMark] = useState(true);',
    content
)

content = re.sub(
    r'const \[collapsedMain, setCollapsedMain\] = useState\(false\);',
    r'const [collapsedMain, setCollapsedMain] = useState(true);',
    content
)

content = re.sub(
    r'const \[collapsedSub, setCollapsedSub\] = useState\(false\);',
    r'const [collapsedSub, setCollapsedSub] = useState(true);',
    content
)

content = re.sub(
    r'const \[collapsedOrnaments, setCollapsedOrnaments\] = useState<boolean\[\]>\(\[\s*false,\s*false,\s*false,\s*\]\);',
    r'const [collapsedOrnaments, setCollapsedOrnaments] = useState<boolean[]>([\n    true,\n    true,\n    true,\n  ]);',
    content
)

with open('/app/applet/App.tsx', 'w') as f:
    f.write(content)
