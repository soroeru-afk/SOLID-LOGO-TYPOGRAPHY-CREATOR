import sys
with open('/app/applet/App.tsx', 'r') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if i > 2515 and i < 2565:
        print(f"{i+1}: {line.rstrip()}")
