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

# Print the full API factory function
# Usually starts with: function y(e) or similar
print("API Client code excerpt:")
print(code[:4000])
