import sys, re

file_path = '/app/applet/App.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add state
content = content.replace(
    'const [mainOffsetX, setMainOffsetX] = useState(0);',
    'const [globalOffsetX, setGlobalOffsetX] = useState(0);\n  const [globalOffsetY, setGlobalOffsetY] = useState(0);\n  const [mainOffsetX, setMainOffsetX] = useState(0);'
)

# 2. Add to loadSettings
content = content.replace(
    'if (setts.mainOffsetX !== undefined) setMainOffsetX(setts.mainOffsetX);',
    'if (setts.globalOffsetX !== undefined) setGlobalOffsetX(setts.globalOffsetX);\n    if (setts.globalOffsetY !== undefined) setGlobalOffsetY(setts.globalOffsetY);\n    if (setts.mainOffsetX !== undefined) setMainOffsetX(setts.mainOffsetX);'
)

# 3. Add to getCurrentSettings
content = content.replace(
    '    mainOffsetX,',
    '    globalOffsetX,\n    globalOffsetY,\n    mainOffsetX,'
)

# 4. Add to importSettings
content = content.replace(
    '        if (settings.mainOffsetX !== undefined)\n          setMainOffsetX(settings.mainOffsetX);',
    '        if (settings.globalOffsetX !== undefined)\n          setGlobalOffsetX(settings.globalOffsetX);\n        if (settings.globalOffsetY !== undefined)\n          setGlobalOffsetY(settings.globalOffsetY);\n        if (settings.mainOffsetX !== undefined)\n          setMainOffsetX(settings.mainOffsetX);'
)

# 5. Add to dependency arrays for scene building
content = content.replace(
    '    imagePan.x,\n    imagePan.y,\n  ]);',
    '    imagePan.x,\n    imagePan.y,\n    globalOffsetX,\n    globalOffsetY,\n  ]);'
)

# 6. Pass globalOffsetX + imagePan.x to buildThreeJsScene
content = content.replace(
    '            imagePan.x,\n            imagePan.y,\n          );\n          setSceneCode(code);',
    '            imagePan.x + globalOffsetX,\n            imagePan.y + globalOffsetY,\n          );\n          setSceneCode(code);'
)
content = content.replace(
    '          imagePan.x,\n          imagePan.y,\n        );\n        setSceneCode(code);',
    '          imagePan.x + globalOffsetX,\n          imagePan.y + globalOffsetY,\n        );\n        setSceneCode(code);'
)

# 7. Add UI for globalOffsetX and globalOffsetY
ui_target = """                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1 flex justify-between items-center w-full">"""

ui_replacement = """                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1">
                    <span className="ss-title flex-1">{t("labelOffset")}</span>
                  </div>
                  <div className="ss-label mb-2 mt-3 text-[9px] flex items-center">
                    <span>{t("labelOffsetX")}</span>
                    <span className="ml-auto opacity-70 mr-2">{globalOffsetX}PX</span>
                    <ResetBtn onClick={() => setGlobalOffsetX(0)} />
                  </div>
                  <input type="range" min="-1000" max="1000" step="10" value={globalOffsetX} onChange={(e) => setGlobalOffsetX(Number(e.target.value))} className="ss-slider mb-4" />
                  <div className="ss-label mb-2 text-[9px] flex items-center">
                    <span>{t("labelOffsetY")}</span>
                    <span className="ml-auto opacity-70 mr-2">{globalOffsetY}PX</span>
                    <ResetBtn onClick={() => setGlobalOffsetY(0)} />
                  </div>
                  <input type="range" min="-1000" max="1000" step="10" value={globalOffsetY} onChange={(e) => setGlobalOffsetY(Number(e.target.value))} className="ss-slider mb-4" />
                </div>
                
                <div className="ss-panel p-3 animate-fade-in">
                  <div className="ss-label mb-2 mt-1 flex justify-between items-center w-full">"""
                  
content = content.replace(ui_target, ui_replacement)

# 8. Update 2D view transform to include global offset
content = content.replace(
    'transform: `translate(${imagePan.x}px, ${imagePan.y}px) scale(${imageZoom * 0.5})`,',
    'transform: `translate(${imagePan.x + globalOffsetX}px, ${imagePan.y + globalOffsetY}px) scale(${imageZoom * 0.5})`,'
)

with open(file_path, 'w') as f:
    f.write(content)
print("Patched successfully")
