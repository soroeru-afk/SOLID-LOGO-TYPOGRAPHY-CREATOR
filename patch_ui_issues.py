import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Fix wrapping issue on ornament title
target_title = '<span className="ss-title">{t(`labelOrnament${idx + 1}` as any) || `ORNAMENT ${idx + 1}`}</span>'
replacement_title = '<span className="ss-title whitespace-nowrap flex-shrink-0">{t(`labelOrnament${idx + 1}` as any) || `ORNAMENT ${idx + 1}`}</span>'
content = content.replace(target_title, replacement_title)

# Increase extrude depth MAX
target_extrude = 'max="20"\n                    step="0.5"\n                    value={thickness}'
replacement_extrude = 'max="100"\n                    step="0.5"\n                    value={thickness}'
content = content.replace(target_extrude, replacement_extrude)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched App.tsx successfully")
