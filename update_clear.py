with open('/app/applet/App.tsx', 'r') as f:
    content = f.read()

old_clear = """  const clearAllTabs = () => {
    if (window.confirm(t("confirmClearAll"))) {
      const newId =
        "tab-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
      setTabs([{ id: newId, name: "TAB 01", settings: null }]);
      setActiveTabId(newId);
      clearCanvas();
    }
  };"""

new_clear = """  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const clearAllTabs = () => {
    setShowClearConfirm(true);
  };
  const executeClearAll = () => {
    const newId =
      "tab-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
    setTabs([{ id: newId, name: "TAB 01", settings: null }]);
    setActiveTabId(newId);
    clearCanvas();
    setShowClearConfirm(false);
  };"""

content = content.replace(old_clear, new_clear)

# now add the modal before the main viewport end.
# searching for </main>
end_main = "        </main>"
modal_str = """
          {showClearConfirm && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[var(--bg-panel)] border border-[var(--border-base)] p-6 w-full max-w-sm rounded shadow-2xl flex flex-col gap-4 animate-fade-in">
                <div className="text-[12px] font-bold text-[var(--text-bright)] mb-2">
                  {t("confirmClearAll")}
                </div>
                <div className="flex gap-3 justify-end mt-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 text-[10px] uppercase font-bold border border-[var(--border-base)] text-[var(--text-base)] hover:bg-[var(--bg-btn)] transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={executeClearAll}
                    className="px-4 py-2 text-[10px] uppercase font-bold bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 transition-colors"
                  >
                    CLEAR ALL
                  </button>
                </div>
              </div>
            </div>
          )}
"""

content = content.replace(end_main, modal_str + end_main)

with open('/app/applet/App.tsx', 'w') as f:
    f.write(content)

print("Updated clearAllTabs and added modal.")
