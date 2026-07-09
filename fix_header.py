import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

header_right_old = """        <div className="flex items-center gap-4 flex-1 justify-end shrink-0">
          <div className="flex items-center gap-1 border border-[var(--border-base)] rounded overflow-hidden shrink-0">
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
          <div className="flex items-center gap-1 border border-[var(--border-base)] rounded overflow-hidden shrink-0">
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-0.5 text-[9px] font-bold ${lang === "en" ? "bg-white text-black" : "text-[#4e5d74] hover:text-[var(--text-bright)]"} transition-colors`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("ja")}
              className={`px-2 py-0.5 text-[9px] font-bold ${lang === "ja" ? "bg-white text-black" : "text-[#4e5d74] hover:text-[var(--text-bright)]"} transition-colors`}
            >
              JP
            </button>
          </div>"""

header_right_new = """        <div className="flex items-center gap-3 flex-1 justify-end shrink-0 min-w-max">
          <div className="flex items-center border border-[var(--border-base)] rounded overflow-hidden shrink-0">
            {Object.keys(themeClasses).map((th) => (
              <button
                key={th}
                onClick={() => setUiTheme(th)}
                className={`px-3 py-1 text-[10px] whitespace-nowrap font-bold ${uiTheme === th ? "bg-[var(--text-bright)] text-[var(--bg-main)]" : "text-[#4e5d74] hover:text-[var(--text-bright)]"} transition-colors`}
              >
                {th}
              </button>
            ))}
          </div>
          <div className="flex items-center border border-[var(--border-base)] rounded overflow-hidden shrink-0">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 text-[10px] whitespace-nowrap font-bold ${lang === "en" ? "bg-white text-black" : "text-[#4e5d74] hover:text-[var(--text-bright)]"} transition-colors`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("ja")}
              className={`px-3 py-1 text-[10px] whitespace-nowrap font-bold ${lang === "ja" ? "bg-white text-black" : "text-[#4e5d74] hover:text-[var(--text-bright)]"} transition-colors`}
            >
              JP
            </button>
          </div>"""

if header_right_old in content:
    content = content.replace(header_right_old, header_right_new)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Header fixed.")
else:
    print("Header right old not found.")
