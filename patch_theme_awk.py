import sys

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if '<div className="ss-label">' in line and '06' in lines[i+1] and 'themeLabel' in lines[i+2]:
        skip = True
    
    if skip and '<div className="h-[1px] bg-[var(--border-base)] my-2"></div>' in line:
        skip = False
        continue # skip this line too
        
    if not skip:
        new_lines.append(line)

content = "".join(new_lines)

header_target = """        <div className="flex items-center gap-4 w-1/4 justify-end">
          <div className="flex items-center gap-1 border border-[var(--border-base)] rounded overflow-hidden">"""
          
header_replace = """        <div className="flex items-center gap-4 w-1/4 justify-end">
          <div className="flex items-center gap-1 border border-[var(--border-base)] rounded overflow-hidden">
            {Object.keys(themeClasses).map((th) => (
              <button
                key={th}
                onClick={() => setUiTheme(th)}
                className={`px-2 py-0.5 text-[9px] font-bold ${uiTheme === th ? "bg-[var(--text-bright)] text-[var(--bg-main)]" : "text-[#4e5d74] hover:text-[var(--text-bright)]"} transition-colors`}
              >
                {th}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 border border-[var(--border-base)] rounded overflow-hidden">"""

if header_target in content:
    content = content.replace(header_target, header_replace)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Theme successfully moved to header.")
else:
    print("Failed to replace header target")
