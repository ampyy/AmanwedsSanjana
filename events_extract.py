import re
with open("AmanSanjana.html", "r") as f:
    content = f.read()

events = ["Mehendi", "Haldi", "Cocktail", "Shaadi", "Reception", "Engagement"]
for e in events:
    # Find the index of event
    idx = content.find(f">{e}</p>")
    if idx != -1:
        # extract 300 chars before and 1000 after
        start = max(0, idx - 100)
        end = min(len(content), idx + 800)
        print(f"=== {e} ===")
        print(content[start:end])
