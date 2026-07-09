import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

def extract_conditional_block(content, start_str):
    start = content.find(start_str)
    if start == -1: return "", content
    brace_count = 0
    end_idx = -1
    for i in range(start, len(content)):
        if content[i] == '{': brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                end_idx = i + 1
                break
    block = content[start:end_idx]
    new_content = content[:start] + content[end_idx:]
    return block, new_content

# The file has TWO {activeTab === "objects" && (
# We will extract both.
first_objects_block, content = extract_conditional_block(content, '{activeTab === "objects" && (')
second_objects_block, content = extract_conditional_block(content, '{activeTab === "objects" && (')

# Strip the {activeTab === "objects" && ( <> ... </> )} wrappers
def unwrap(block):
    inner = block[block.find('(')+1 : block.rfind(')')].strip()
    if inner.startswith('<>'): inner = inner[2:].strip()
    if inner.endswith('</>'): inner = inner[:-3].strip()
    return inner

if first_objects_block:
    inner_first = unwrap(first_objects_block)
else:
    inner_first = ""

if second_objects_block:
    inner_second = unwrap(second_objects_block)
else:
    inner_second = ""

# `inner_second` contains the Mark Generator AND the Mark Edge/Scale settings AND the Ornaments settings.
# Wait, let's extract them from `inner_second`.
# 1. Mark Edge/Scale settings (starts with `{attachedMark && (` inside inner_second)
# 2. Ornaments (starts with `{ornaments.map((ornament, idx) => (` inside inner_second)

mark_settings_block, inner_second = extract_conditional_block(inner_second, '{attachedMark && (')
ornaments_block, inner_second = extract_conditional_block(inner_second, '{ornaments.map((ornament, idx) => (')

# Now we rebuild the tabs.
# "objects" tab should have: inner_first (Text stuff) + ornaments_block + mark_settings_block
# "mark" tab should have: inner_second (Mark generator)

new_objects_tab = f"""
            {{activeTab === "objects" && (
              <>
                {inner_first}
                {ornaments_block}
                {mark_settings_block}
              </>
            )}}
"""

new_mark_tab = f"""
            {{activeTab === "mark" && (
              <>
                {inner_second}
              </>
            )}}
"""

# We also need to insert them back into content where they were extracted.
# They were originally right before `{activeTab === "style" && (`
insert_point = '{activeTab === "style" && ('
if insert_point in content:
    content = content.replace(insert_point, new_objects_tab + new_mark_tab + insert_point)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Tabs content fixed")
else:
    print("Insert point not found")

