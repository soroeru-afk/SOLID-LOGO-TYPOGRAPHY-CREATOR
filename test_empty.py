with open('/app/applet/App.tsx', 'r') as f:
    content = f.read()

objects_block = content[content.find('{activeTab === "objects" && ('):]
objects_block = objects_block[:objects_block.find('{activeTab === "mark" && (')]
print("Objects block begins:")
print(objects_block[:300])
