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

# Find all occurrences of fetch or /api or HTTP methods
matches = re.findall(r'["\'](/(?:api|rt|auth|bookings|hosts|passes|user)[^"\']*)["\']', code)
print("Detected API paths in 422:", set(matches))

# Look for module 1532 which was referenced in 7009: let { token: n } = (0, l.As)()
m1532 = re.search(r'1532:\(e,t,n\)=>', code)
if m1532:
    start = m1532.start()
    print("\nMODULE 1532 (Auth Store):")
    print(code[start:start+1500])
