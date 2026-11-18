import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

test_urls = [
    'https://api.trycompanio.in/',
    'https://api.getcompanio.in/',
    'https://api.getcompanio.in/health',
    'https://api.trycompanio.in/health',
    'https://getcompanio.in/api/health',
    'https://www.trycompanio.in/api/health'
]

for u in test_urls:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
            print(f"{u:38} -> Status: {resp.status}, Server: {resp.headers.get('Server')}")
            body = resp.read(250).decode('utf-8', errors='ignore').strip()
            print(f"   Body: {body[:150]}")
    except Exception as e:
        print(f"{u:38} -> Error: {e}")
