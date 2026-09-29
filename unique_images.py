import re
with open("AmanSanjana.html", "r") as f:
    content = f.read()

# Find all img src urls and print them out uniquely to see which ones are the portraits
urls = re.findall(r'<img[^>]*src="([^"]+)"', content)
unique_urls = []
for u in urls:
    if u not in unique_urls:
        unique_urls.append(u)
        print(u)
