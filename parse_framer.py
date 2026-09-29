import re, json

with open("AmanSanjana.html", "r") as f:
    content = f.read()

match = re.search(r'<script data-framer-hydrate="1">([^<]+)</script>', content)
if match:
    print("Found framer data!")
    # data might be JSON
    try:
        data = json.loads(match.group(1))
        print("Successfully parsed JSON")
    except Exception as e:
        print("Failed to parse JSON", e)
else:
    print("No framer hydrate script found.")
