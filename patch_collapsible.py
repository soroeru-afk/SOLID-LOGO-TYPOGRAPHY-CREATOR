import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add state
state_target = """  const [ornaments, setOrnaments] = useState<"""
state_replacement = """  const [collapsedOrnaments, setCollapsedOrnaments] = useState<boolean[]>([false, false, false]);
  const [ornaments, setOrnaments] = useState<"""
content = content.replace(state_target, state_replacement)

# 2. Update UI loop
ui_target = """                      <div className="flex items-center gap-1">"""
ui_replacement = """                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setCollapsedOrnaments((prev) => {
                              const next = [...prev];
                              next[idx] = !next[idx];
                              return next;
                            });
                          }}
                          className="p-1 text-[var(--text-base)] hover:text-[var(--active-color)] opacity-70 hover:opacity-100 mr-2"
                        >
                          {collapsedOrnaments[idx] ? "＋" : "−"}
                        </button>"""
content = content.replace(ui_target, ui_replacement)

# 3. Collapse body
select_target = """                    <select
                      value={ornament.type}"""
select_replacement = """                    {!collapsedOrnaments[idx] && (
                      <>
                        <select
                          value={ornament.type}"""
content = content.replace(select_target, select_replacement)

end_target = """                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}"""
end_replacement = """                          </div>
                        </div>
                      </div>
                    )}
                      </>
                    )}
                  </div>
                ))}"""
content = content.replace(end_target, end_replacement)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched collapsible successfully")
