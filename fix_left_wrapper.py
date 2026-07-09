import sys

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# The empty container is:
#           <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
#                                                           
#           </div>

# We want to replace the `</div>` there with nothing.
empty_container_target = """          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                                                          
          </div>"""

# Let's verify if the exact string exists
if empty_container_target in content:
    print("Found exact empty container.")
else:
    # use regex
    import re
    content = re.sub(
        r'<div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">\s*</div>', 
        '<div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative">', 
        content
    )

# Now we need to insert the closing </div> before the Export/Import grid.
# The export/import grid looks like:
#           <div className="p-3 border-t border-[var(--border-base)] shrink-0 bg-[var(--bg-panel)] backdrop-blur-md grid grid-cols-2 gap-2">
#             <button
#               onClick={exportSettings}

grid_target = '<div className="p-3 border-t border-[var(--border-base)] shrink-0 bg-[var(--bg-panel)] backdrop-blur-md grid grid-cols-2 gap-2">'
if grid_target in content:
    content = content.replace(grid_target, "          </div>\n" + grid_target)
    print("Added closing div.")

with open(file_path, 'w') as f:
    f.write(content)

print("Wrapper fixed")
