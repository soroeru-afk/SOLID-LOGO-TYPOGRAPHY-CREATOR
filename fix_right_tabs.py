import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# We need to wrap 3D engine stuff (panels 01, 02, 03) in {activeRightTab === "3d" && ( ... )}
# And wrap History/Data stuff (label 04 and the flex-1 list) in {activeRightTab === "data" && ( ... )}

# The content of the right sidebar is from:
#           <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative">
# to:
#         </aside>

start_marker = '<div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative">'
start_idx = content.find(start_marker)
if start_idx != -1:
    end_idx = content.find('</aside>', start_idx)
    inner_content = content[start_idx + len(start_marker) : end_idx]
    
    # Let's split by History label:
    # <div className="ss-label">
    #   <span className="ss-number">04</span>
    #   <span className="ss-title">{t("labelHistory")}</span>
    # </div>
    history_marker = '<div className="ss-label">\n            <span className="ss-number">04</span>'
    history_idx = inner_content.find(history_marker)
    
    part_3d = inner_content[:history_idx]
    part_data = inner_content[history_idx:-17] # Exclude trailing `          </div>\n        ` 
    
    # Need to be careful. The right sidebar container has `flex-1 flex flex-col gap-2 overflow-y-auto` inside `part_data`, and then a `</div>` that closes the main content area? 
    # Let's look at the dump:
    # 210-          </div>
    # 211-        </aside>
    
    # Yes, the very last `</div>` before `</aside>` closes the `<div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative">`.
    # Actually wait. Let's look at line 167: `<div className="flex-1 flex flex-col gap-2 overflow-y-auto">`.
    # So `part_data` includes the history list and its closing `</div>`.
    # The last `</div>` belongs to the `start_marker` div.
    
    new_inner_content = f"""
            {{activeRightTab === "3d" && (
              <>
                {part_3d}
              </>
            )}}
            {{activeRightTab === "data" && (
              <>
                {inner_content[history_idx : inner_content.rfind('</div>')]}
              </>
            )}}
          </div>
"""
    
    content = content[:start_idx + len(start_marker)] + new_inner_content + content[end_idx:]
    with open(file_path, 'w') as f:
        f.write(content)
    print("Right tabs content fixed")
else:
    print("Start marker not found")

