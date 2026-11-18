import urllib.request
import ssl
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json, text/plain, */*'
}

endpoints = [
    'https://api.trycompanio.in/',
    'https://api.trycompanio.in/api',
    'https://api.trycompanio.in/v1',
    'https://api.trycompanio.in/docs',
    'https://api.trycompanio.in/health',
    'https://api.trycompanio.in/companions',
    'https://api.trycompanio.in/cities',
    'https://api.trycompanio.in/auth/status',
    'https://api.trycompanio.in/passes',
    'https://api.trycompanio.in/bookings'
]

for ep in endpoints:
    try:
        req = urllib.request.Request(ep, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=6) as resp:
            print(f"{ep:40} -> Status: {resp.status}, Type: {resp.headers.get('Content-Type')}")
            body = resp.read(200).decode('utf-8', errors='ignore').strip()
            print(f"   {body[:100]}")
    except urllib.error.HTTPError as e:
        print(f"{ep:40} -> HTTP {e.code}")
    except Exception as e:
        print(f"{ep:40} -> Error: {e}")
