from bs4 import BeautifulSoup
import os
import json

def analyze_site(site_name):
    site_dir = os.path.join('LIVE_SCRAPE_AUDIT', site_name)
    if not os.path.exists(site_dir):
        return {}
    files = [f for f in os.listdir(site_dir) if f.endswith('.html')]
    data = {}
    for fname in files:
        fpath = os.path.join(site_dir, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        
        title = soup.title.string.strip() if soup.title else ''
        h1s = [h.get_text(strip=True) for h in soup.find_all('h1')]
        h2s = [h.get_text(strip=True) for h in soup.find_all('h2')]
        imgs = [{'src': img.get('src'), 'alt': img.get('alt'), 'class': img.get('class')} for img in soup.find_all('img') if img.get('src')]
        links = [{'text': a.get_text(strip=True), 'href': a.get('href')} for a in soup.find_all('a') if a.get('href') and a.get_text(strip=True)]
        buttons = [b.get_text(strip=True) for b in soup.find_all('button') if b.get_text(strip=True)]
        
        data[fname] = {
            'title': title,
            'h1': h1s,
            'h2': h2s[:10],
            'image_count': len(imgs),
            'images_sample': imgs[:8],
            'buttons': list(set(buttons))[:15],
            'unique_links': len(set([l['href'] for l in links]))
        }
    return data

result = {
    'getcompanio.in': analyze_site('getcompanio.in'),
    'trycompanio.in': analyze_site('trycompanio.in')
}

with open(os.path.join('LIVE_SCRAPE_AUDIT', 'deep_analysis.json'), 'w', encoding='utf-8') as f:
    json.dump(result, f, indent=2)

print('Deep analysis complete across all HTML pages of both domains.')
for site, pages in result.items():
    print(f'\n=== {site} ({len(pages)} pages analyzed) ===')
    for p, info in pages.items():
        print(f'  {p}: Title="{info["title"][:40]}" | Images={info["image_count"]} | H1={info["h1"][:2]}')
