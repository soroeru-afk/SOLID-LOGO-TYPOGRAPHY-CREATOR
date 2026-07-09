with open('/app/applet/App.tsx', 'r') as f:
    content = f.read()

idx = content.find("Cache_Empty")
print(repr(content[idx:idx+200]))
