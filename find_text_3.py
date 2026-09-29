import sys
import re

with open("AmanSanjana.html", "r") as f:
    content = f.read()

def find_context(query, context_len=200):
    idx = content.find(query)
    if idx != -1:
        start = max(0, idx - context_len)
        end = min(len(content), idx + len(query) + context_len)
        print(f"--- MATCH for '{query}' ---")
        print(content[start:end])
    else:
        print(f"--- NO MATCH for '{query}' ---")

find_context("Sita Devi")
find_context("feb")
find_context("Bhaat")
find_context("Haldi")
find_context("10:00")
find_context("AM")
find_context("PM")
