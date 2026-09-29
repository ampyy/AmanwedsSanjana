import re
with open("AmanSanjana.html", "r") as f:
    content = f.read()

img_tags = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', content)
for i in img_tags:
    if "dulha" in i.lower():
        print("Found:", i)
