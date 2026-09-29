import re
with open("AmanSanjana.html", "r") as f:
    content = f.read()

# Find context around ABHISHEK or KANIKA
idx1 = content.find("ABHISHEK")
if idx1 != -1:
    print("Found ABHISHEK")
    snippet = content[max(0, idx1-2000):idx1+2000]
    imgs = re.findall(r'<img[^>]*src="([^"]+)"', snippet)
    print("Images near ABHISHEK:", imgs)

idx2 = content.find("We are both so delighted")
if idx2 != -1:
    print("Found delighted text")
    snippet = content[max(0, idx2-2000):idx2+2000]
    imgs = re.findall(r'<img[^>]*src="([^"]+)"', snippet)
    print("Images near delighted text:", imgs)
