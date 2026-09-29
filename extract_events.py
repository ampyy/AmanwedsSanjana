import sys
import re

with open("AmanSanjana.html", "r") as f:
    content = f.read()

events = re.findall(r'<p[^>]*>([^<]+)</p>', content)
# Just print all p tags content to see what to replace
for e in set(events):
    if len(e) < 50:
        print(e)
