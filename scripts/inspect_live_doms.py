from bs4 import BeautifulSoup
import os
import json
import re

def analyze_dom(filename, label):
    path = os.path.join("LIVE_SCRAPE_AUDIT", filename)
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    soup = BeautifulSoup(html, "html.parser")
    
    print(f"\n========================================================")
    print(f"ANATOMY AUDIT: {label}")
    print(f"========================================================")
    
    # Title & Metadata
    title = soup.title.string.strip() if soup.title else ""
    print(f"Title: {title}")
    
    # Header / Navigation
    nav = soup.find("nav") or soup.find("header")
    if nav:
        nav_links = [a.get_text(strip=True) for a in nav.find_all("a") if a.get_text(strip=True)]
        nav_buttons = [b.get_text(strip=True) for b in nav.find_all("button") if b.get_text(strip=True)]
        print(f"Navigation Links: {nav_links}")
        print(f"Navigation Buttons: {nav_buttons}")
        print(f"Nav Classes: {nav.get('class', [])}")
        
    # Main Sections
    main = soup.find("main") or soup.body
    sections = main.find_all(["section", "div"], recursive=False) if main else []
    print(f"Top-level Main Sections count: {len(sections)}")
    
    # Headings
    h1s = [h.get_text(strip=True) for h in soup.find_all("h1")]
    h2s = [h.get_text(strip=True) for h in soup.find_all("h2")]
    print(f"H1: {h1s}")
    print(f"H2 ({len(h2s)} total): {h2s[:8]}")
    
    # Images & Assets
    imgs = soup.find_all("img")
    print(f"Images count: {len(imgs)}")
    for img in imgs[:8]:
        src = img.get("src", "")
        alt = img.get("alt", "")
        w = img.get("width", "")
        h = img.get("height", "")
        cls = " ".join(img.get("class", []))
        print(f"  Img: src={src[:60]}... | alt='{alt}' | dims={w}x{h} | class={cls[:40]}")
        
    # Buttons & CTAs
    buttons = [b.get_text(strip=True) for b in soup.find_all("button") if b.get_text(strip=True)]
    print(f"Buttons sample: {buttons[:10]}")
    
    # Footer
    footer = soup.find("footer")
    if footer:
        footer_links = [a.get_text(strip=True) for a in footer.find_all("a") if a.get_text(strip=True)]
        print(f"Footer links count: {len(footer_links)}, sample: {footer_links[:10]}")

analyze_dom("getcompanio_live_dom.html", "getcompanio.in (Marketplace Web App)")
analyze_dom("trycompanio_live_dom.html", "trycompanio.in (Marketing Showroom)")
