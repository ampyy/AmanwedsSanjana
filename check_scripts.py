import re
with open("AmanSanjana.html", "r") as f:
    content = f.read()

scripts = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
for s in scripts:
    if "framerusercontent" in s or "ABHISHEK" in s or "__framer" in s:
        print("Found matching inline script, length:", len(s))
        
script_tags = re.findall(r'<script[^>]+src="([^"]+)"', content)
for t in script_tags:
    print("External script:", t)
