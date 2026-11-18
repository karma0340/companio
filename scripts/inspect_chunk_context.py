import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

url = 'https://getcompanio.in/_next/static/chunks/422-1b70a21e4fb48f17.js'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
    code = resp.read().decode('utf-8', errors='ignore')

# Search for api.getcompanio.in with 150 chars context
for m in re.finditer(r'api\.getcompanio\.in', code):
    start = max(0, m.start() - 200)
    end = min(len(code), m.end() + 200)
    print("MATCH CONTEXT:")
    print(code[start:end])
    print("-" * 50)
