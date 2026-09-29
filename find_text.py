import sys

with open("AmanSanjana.html", "r") as f:
    content = f.read()

def find_context(query, context_len=100):
    idx = content.find(query)
    if idx != -1:
        start = max(0, idx - context_len)
        end = min(len(content), idx + len(query) + context_len)
        print(f"--- MATCH for '{query}' ---")
        print(content[start:end])
    else:
        print(f"--- NO MATCH for '{query}' ---")

find_context("Buy Now")
find_context("ABHISHEK")
find_context("KANIKA")
find_context("INR 3999")
find_context("Rajni Gupta")
find_context("Shri Pradeep")
find_context("delighted")
