import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

url = 'https://getcompanio.in/_next/static/chunks/3017-5079ea42432f8c30.js'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
    code = resp.read().decode('utf-8', errors='ignore')

print(f"Length of 3017: {len(code)}")

# Extract all endpoint paths and methods
# Common API client pattern: get: ..., post: ..., path: ...
paths = re.findall(r'["\'](/[a-zA-Z0-9_\-\/:]+)["\']', code)
print("Detected endpoint paths in 3017:")
unique_paths = sorted(set([p for p in paths if not p.startswith('/_next') and not p.startswith('//')]))
for p in unique_paths:
    print(" ", p)
