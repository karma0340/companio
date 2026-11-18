import re

with open('LIVE_SCRAPE_AUDIT/trycompanio_live_dom.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

m = re.search(r'<nav aria-label="Mobile navigation"[^>]*>.*?</nav>', html, re.DOTALL)
if m:
    print("MATCH FOUND:")
    print(m.group(0))
else:
    print("NO MATCH")
