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

m = re.search(r'6575:\(e,t,n\)=>', code)
if m:
    start = m.start()
    print("MODULE 6575 & 7009 CODE:")
    print(code[start:start+2500])
