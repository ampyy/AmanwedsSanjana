import re
with open("AmanSanjana.html", "r") as f:
    content = f.read()
# Let's find context around KANIKA
idx = content.find("KANIKA")
start = max(0, idx - 800)
end = min(len(content), idx + 800)
print(content[start:end])
