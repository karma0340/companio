import socket
import ssl
import urllib.request
import json

domains = [
    'trycompanio.in',
    'www.trycompanio.in',
    'getcompanio.in',
    'www.getcompanio.in',
    'api.trycompanio.in',
    'api.getcompanio.in',
    'cdn.trycompanio.in',
    'img.getcompanio.in'
]

print("=" * 85)
print("LIVE NETWORK & INFRASTRUCTURE RECONNAISSANCE")
print("=" * 85)
print(f"{'DOMAIN':24} | {'IP ADDRESS':16} | {'SERVER':12} | {'HTTP STATUS':12} | {'DETAILS'}")
print("-" * 85)

for d in domains:
    try:
        ip = socket.gethostbyname(d)
    except Exception as e:
        ip = 'DNS FAIL'
    
    server = 'N/A'
    status = 'N/A'
    details = ''
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        req = urllib.request.Request(f'https://{d}/', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=6) as resp:
            server = resp.headers.get('Server', 'Unknown')
            status = f"HTTP {resp.status}"
            content_type = resp.headers.get('Content-Type', '')
            body_sample = resp.read(60).decode('utf-8', errors='ignore').strip()
            details = f"{content_type}; Body: '{body_sample}'"
    except urllib.error.HTTPError as e:
        status = f"HTTP {e.code}"
        server = e.headers.get('Server', 'Unknown')
        details = f"HTTP Error {e.code}"
    except Exception as e:
        status = 'Error'
        details = str(e)
    
    print(f"{d:24} | {ip:16} | {server:12} | {status:12} | {details[:30]}")

print("=" * 85)
