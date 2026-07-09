import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Extraction tools
def extract_element(code, start_tag):
    start_idx = code.find(start_tag)
    if start_idx == -1:
        return "", code
    
    # Simple tag extraction considering nested braces and tags, but here we can just use simple regex or find </button>
    if start_tag.startswith("<button"):
        end_idx = code.find("</button>", start_idx) + 9
        return code[start_idx:end_idx], code[:start_idx] + code[end_idx:]
    return "", code


# We want to extract:
# 1. SAVE TO CACHE button
# 2. CLEAR CACHE button
# 3. EXPORT 3D button
# 4. CLEAR ALL button

# 1. Extract SAVE TO CACHE button
save_cache_start = '<button\n          onClick={handleSaveToCache}'
save_cache_btn, content = extract_element(content, save_cache_start)

# 2. Extract CLEAR CACHE button
clear_cache_start = '<button\n          onClick={() => {\n            setSceneCode(null);\n            setViewMode("image");\n            setHistory([]);\n          }}'
clear_cache_btn, content = extract_element(content, clear_cache_start)

# 3. Extract EXPORT 3D button
export_3d_start = '<button\n          onClick={downloadSceneHtml}'
export_3d_btn, content = extract_element(content, export_3d_start)

# 4. Extract CLEAR ALL button (already extracted in previous step? Wait, no, we need to extract from tabs bar but wait, I can just write it again)
# It was removed or is it still there? No, we didn't remove it from tabs bar yet! Wait, I didn't remove it from tabs bar, I only updated its logic.
# Wait, let's find the old CLEAR ALL button.
old_clear_all = """            <button
              onClick={clearAllTabs}
              className="mx-2 my-1 px-4 py-1 text-[var(--text-bright)] opacity-70 hover:opacity-100 border border-[var(--text-bright)] hover:bg-[var(--text-bright)] hover:text-[var(--bg-main)] ml-auto uppercase flex items-center gap-1 transition-all font-bold rounded-sm"
            >
              <Eraser size={10} /> CLEAR ALL
            </button>"""

if old_clear_all in content:
    content = content.replace(old_clear_all, "")

new_clear_all = """        <button
          onClick={clearAllTabs}
          title="すべてのタブをリセットします"
          className="flex-1 bg-[var(--bg-btn)] hover:bg-[var(--bg-btn-active)] border border-[var(--border-base)] rounded shadow-sm transition-all uppercase font-bold text-[11px] text-red-500 hover:text-red-400 tracking-widest flex items-center justify-center gap-2"
        >
          <Eraser size={14} /> CLEAR ALL
        </button>"""

# Put EXPORT 3D at the end of the 3D Engine tab
end_3d_tab = "              </>\n            )}\n\n            {activeRightTab === \"data\""

export_3d_styled = export_3d_btn.replace('className={`flex-1 ', 'className={`w-full mt-4 py-3 ').replace('flex items-center justify-center', 'flex items-center justify-center gap-2').replace('EXPORT 3D', '<Download size={14} /> EXPORT 3D')

content = content.replace(end_3d_tab, f"                {export_3d_styled}\n" + end_3d_tab)

# Put SAVE TO CACHE and CLEAR CACHE at the end of DATA tab
save_cache_styled = save_cache_btn.replace('className={`flex-1 ', 'className={`w-full py-2 ').replace('flex items-center justify-center', 'flex items-center justify-center mb-2')
clear_cache_styled = clear_cache_btn.replace('className="flex-1 ', 'className="w-full py-2 mb-2 ').replace('flex items-center justify-center', 'flex items-center justify-center')

end_data_tab = "              </>\n            )}\n          </div>\n        </aside>"

content = content.replace(end_data_tab, f"                <div className=\"mt-4 border-t border-[var(--border-base)] pt-4\">\n                  {save_cache_styled}\n                  {clear_cache_styled}\n                </div>\n" + end_data_tab)

# Add CLEAR ALL to the footer
# the footer ends at </footer>
footer_end = "      </footer>"
content = content.replace(footer_end, f"{new_clear_all}\n" + footer_end)

with open(file_path, 'w') as f:
    f.write(content)

print("Layout updated.")
