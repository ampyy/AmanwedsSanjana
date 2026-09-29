import re
with open("AmanSanjana.html", "r") as f:
    content = f.read()

images = re.findall(r"<img[^>]+src=[\"']([^\"']+)[\"'][^>]*>", content)
for i, img in enumerate(images):
    print(f"Img {i}: {img}")
