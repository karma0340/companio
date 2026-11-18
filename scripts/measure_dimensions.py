import subprocess
import json
import os

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = os.path.join(os.getcwd(), "LIVE_SCRAPE_AUDIT")

SCRIPT_JS = """
(() => {
    const data = {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        nav: null,
        hero: null,
        cards: [],
        buttons: []
    };
    
    const header = document.querySelector('header') || document.querySelector('nav');
    if (header) {
        const r = header.getBoundingClientRect();
        const s = window.getComputedStyle(header);
        data.nav = {
            height: r.height,
            width: r.width,
            bg: s.backgroundColor,
            position: s.position,
            zIndex: s.zIndex
        };
    }
    
    const h1 = document.querySelector('h1');
    if (h1) {
        const r = h1.getBoundingClientRect();
        const s = window.getComputedStyle(h1);
        data.hero = {
            h1Text: h1.innerText,
            fontSize: s.fontSize,
            lineHeight: s.lineHeight,
            fontWeight: s.fontWeight,
            color: s.color,
            fontFamily: s.fontFamily
        };
    }
    
    document.querySelectorAll('img').forEach((img, i) => {
        if (i < 10) {
            const r = img.getBoundingClientRect();
            data.cards.push({
                src: img.src,
                alt: img.alt,
                renderedWidth: r.width,
                renderedHeight: r.height,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight
            });
        }
    });
    
    document.querySelectorAll('button').forEach((b, i) => {
        if (i < 5) {
            const r = b.getBoundingClientRect();
            const s = window.getComputedStyle(b);
            data.buttons.push({
                text: b.innerText,
                width: r.width,
                height: r.height,
                bg: s.backgroundColor,
                color: s.color,
                borderRadius: s.borderRadius,
                boxShadow: s.boxShadow
            });
        }
    });
    
    return JSON.stringify(data);
})();
"""

import subprocess
import json
import os
import tempfile

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = os.path.join(os.getcwd(), "LIVE_SCRAPE_AUDIT")

URLS = [
    {"name": "getcompanio", "url": "https://getcompanio.in/"},
    {"name": "trycompanio", "url": "https://www.trycompanio.in/"}
]

def audit_url(target):
    name = target["name"]
    url = target["url"]
    screenshot_path = os.path.join(OUTPUT_DIR, f"{name}_live_screenshot.png")
    
    # 1. Capture full screenshot
    subprocess.run([
        CHROME_PATH,
        "--headless=new",
        f"--screenshot={screenshot_path}",
        "--window-size=1280,1024",
        "--virtual-time-budget=3000",
        url
    ], capture_output=True, timeout=20)
    
    # 2. Dump DOM
    res = subprocess.run([
        CHROME_PATH,
        "--headless=new",
        "--dump-dom",
        "--virtual-time-budget=3000",
        url
    ], capture_output=True, text=True, encoding="utf-8", errors="ignore", timeout=20)
    
    dom_path = os.path.join(OUTPUT_DIR, f"{name}_live_dom.html")
    with open(dom_path, "w", encoding="utf-8") as f:
        f.write(res.stdout)
        
    print(f"Captured {name}: Screenshot ({os.path.getsize(screenshot_path) if os.path.exists(screenshot_path) else 0} bytes), DOM ({len(res.stdout)} chars)")

def main():
    print("Measuring rendered DOM dimensions and assets for both getcompanio.in and trycompanio.in...")
    for item in URLS:
        try:
            audit_url(item)
        except Exception as e:
            print(f"Error auditing {item['name']}: {e}")

if __name__ == "__main__":
    main()

