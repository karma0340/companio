import urllib.request
import ssl
import os
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

BASE_DIR = os.path.join(os.getcwd(), "public", "assets")
MOMENTS_DIR = os.path.join(BASE_DIR, "moments")
HOSTS_DIR = os.path.join(BASE_DIR, "hosts")

os.makedirs(MOMENTS_DIR, exist_ok=True)
os.makedirs(HOSTS_DIR, exist_ok=True)

# 1. Moment tiles from cdn.trycompanio.in
# Live scrape references m01 through m32
MOMENT_URLS = [
    f"https://cdn.trycompanio.in/assets/landing/moments/m{i:02d}.webp" for i in range(1, 33)
]

# 2. Host images from img.getcompanio.in
HOST_IMAGES = [
    {"filename": "kashish.webp", "url": "https://img.getcompanio.in/1793032286565-1a00dae80141230cabe7ec9b.webp"},
    {"filename": "shameera.webp", "url": "https://img.getcompanio.in/1794162621867-57b7cba476194ae62149e7b4.webp"},
    {"filename": "akash.webp", "url": "https://img.getcompanio.in/1793193494415-519f2a0e9d1ed9c8b008e2cb.webp"},
    {"filename": "samridhi.webp", "url": "https://img.getcompanio.in/1793611206938-ea7892cbd4801cbee8534684.webp"},
    {"filename": "vanshika.webp", "url": "https://img.getcompanio.in/1794760287749-8fbb7de6ed7557beef7334fe.webp"},
    {"filename": "locked_kritika.webp", "url": "https://img.getcompanio.in/b-0fde944a4cd6a4fe87d41fbdc0446391.webp"}
]

def download_file(url, dest_path):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
        return True, os.path.getsize(dest_path)
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            content = resp.read()
            if len(content) > 500:
                with open(dest_path, "wb") as f:
                    f.write(content)
                return True, len(content)
            return False, 0
    except Exception as e:
        return False, str(e)

def main():
    print("=" * 60)
    print("MIRRORING LIVE ASSETS FROM COMPANIO CDNS TO LOCAL STORAGE")
    print("=" * 60)
    
    downloaded_moments = 0
    for url in MOMENT_URLS:
        fname = os.path.basename(url)
        dest = os.path.join(MOMENTS_DIR, fname)
        ok, res = download_file(url, dest)
        if ok:
            downloaded_moments += 1
            print(f"[MOMENT] {fname} -> {res} bytes")
        else:
            print(f"[WARN] Failed to download {fname}: {res}")

    downloaded_hosts = 0
    for h in HOST_IMAGES:
        dest = os.path.join(HOSTS_DIR, h["filename"])
        ok, res = download_file(h["url"], dest)
        if ok:
            downloaded_hosts += 1
            print(f"[HOST] {h['filename']} -> {res} bytes")
        else:
            print(f"[WARN] Failed to download {h['filename']}: {res}")

    print("\n" + "=" * 60)
    print(f"ASSET MIRRORING SUMMARY: {downloaded_moments}/{len(MOMENT_URLS)} Moments, {downloaded_hosts}/{len(HOST_IMAGES)} Hosts saved to public/assets/")
    print("=" * 60)

if __name__ == "__main__":
    main()
