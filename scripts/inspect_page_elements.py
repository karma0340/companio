import os
import re
from bs4 import BeautifulSoup

files = [
    'homepage.html', 'page_how-it-works.html', 'page_become-a-companion.html',
    'page_explore.html', 'page_safety.html', 'page_faq.html', 'page_contact.html'
]

for fn in files:
    if os.path.exists(fn):
        with open(fn, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        
        buttons = [b.get_text(strip=True) for b in soup.find_all('button') if b.get_text(strip=True)]
        links = [(a.get('href', ''), a.get_text(strip=True)) for a in soup.find_all('a') if a.get_text(strip=True)]
        forms = [(form.get('action', ''), form.get('method', 'GET')) for form in soup.find_all('form')]
        inputs = [inp.get('name', inp.get('placeholder', 'unnamed')) for inp in soup.find_all(['input', 'select', 'textarea'])]
        
        print(f"=== {fn} ===")
        print("  Buttons:", buttons[:10])
        print("  Key Links:", links[:6])
        print("  Forms:", forms)
        print("  Input fields:", inputs[:8])
        print()
