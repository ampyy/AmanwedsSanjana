import re
with open("AmanSanjana.html", "r") as f:
    content = f.read()

events = ["Mehendi", "Haldi", "Cocktail", "Shaadi", "Reception", "Engagement"]
for e in events:
    # Find the index of event
    idx = content.find(f">{e}</p>")
    if idx != -1:
        # Extract the string representing Date and Time and Event name.
        # Let's find all <p> tags after the event name up to next 1000 chars
        snippet = content[idx:idx+800]
        paragraphs = re.findall(r'<p[^>]*>([^<]+)</p>', snippet)
        print(f"=== {e} ===")
        print(paragraphs)
