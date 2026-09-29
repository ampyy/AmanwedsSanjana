import re
with open("AmanSanjana.html", "r") as f:
    content = f.read()

img_tags = re.findall(r'<img[^>]+dulhadulhanimage[^>]*>', content)
print(img_tags[0] if img_tags else "Not found")
