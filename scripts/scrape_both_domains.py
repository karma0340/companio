import urllib.request
import ssl
import json
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

OUTPUT_DIR = os.path.join(os.getcwd(), "LIVE_SCRAPE_AUDIT")
os.makedirs(OUTPUT_DIR, exist_ok=True)

DOMAINS = [
    {
        "domain": "getcompanio.in",
        "base_url": "https://getcompanio.in",
        "paths": [
            "/",
            "/robots.txt",
            "/sitemap.xml",
            "/safety",
            "/how-it-works",
            "/become-a-host",
            "/hosts",
            "/terms",
            "/privacy",
        ]
    },
    {
        "domain": "trycompanio.in",
        "base_url": "https://www.trycompanio.in",
        "paths": [
            "/",
            "/robots.txt",
            "/sitemap.xml",
            "/explore",
            "/safety",
            "/how-it-works",
            "/become-a-companion",
            "/terms",
            "/privacy",
            "/contact"
        ]
    }
]

def fetch_url(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=12) as resp:
            content = resp.read()
            return resp.status, resp.headers, content
    except Exception as e:
        return None, None, str(e).encode()

def main():
    print("Scraping and analyzing both getcompanio.in and trycompanio.in...")
    summary = {}

    for d in DOMAINS:
        dom_name = d["domain"]
        base = d["base_url"]
        summary[dom_name] = []
        domain_dir = os.path.join(OUTPUT_DIR, dom_name)
        os.makedirs(domain_dir, exist_ok=True)

        for p in d["paths"]:
            target_url = f"{base}{p}"
            safe_name = "index" if p == "/" else p.strip("/").replace("/", "_")
            print(f"Fetching {target_url} ...")
            status, headers, content = fetch_url(target_url)

            if status == 200:
                content_type = headers.get("Content-Type", "")
                ext = ".xml" if "xml" in content_type else (".txt" if "text/plain" in content_type else ".html")
                out_path = os.path.join(domain_dir, f"{safe_name}{ext}")
                with open(out_path, "wb") as f:
                    f.write(content)
                summary[dom_name].append({
                    "path": p,
                    "status": status,
                    "size": len(content),
                    "file": out_path,
                    "content_type": content_type
                })
                print(f"  [SAVED] {safe_name}{ext} ({len(content)} bytes)")
            else:
                summary[dom_name].append({
                    "path": p,
                    "status": status,
                    "error": content.decode('utf-8', errors='ignore')
                })
                print(f"  [FAILED] status={status}")

    with open(os.path.join(OUTPUT_DIR, "scrape_summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("\nScrape complete. Summary written to LIVE_SCRAPE_AUDIT/scrape_summary.json")

if __name__ == "__main__":
    main()
