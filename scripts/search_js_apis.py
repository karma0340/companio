import urllib.request
import ssl
import re
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

# Chunks from getcompanio.in
chunks = [
    'https://getcompanio.in/_next/static/chunks/app/(site)/page-6ea7405d0d90719c.js',
    'https://getcompanio.in/_next/static/chunks/app/(site)/layout-35db09e085c4b98b.js',
    'https://getcompanio.in/_next/static/chunks/422-1b70a21e4fb48f17.js',
    'https://getcompanio.in/_next/static/chunks/4512-139a29ac863d6efb.js',
    'https://getcompanio.in/_next/static/chunks/3017-5079ea42432f8c30.js'
]

api_patterns = []

for c in chunks:
    try:
        req = urllib.request.Request(c, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            text = resp.read().decode('utf-8', errors='ignore')
            # Find URLs, endpoints, and fetch calls
            endpoints = set(re.findall(r'["\'](/api/[^"\']+)["\']', text))
            external_apis = set(re.findall(r'https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^"\'\s)]*', text))
            if endpoints:
                print(f"Endpoints in {c.split('/')[-1]}:", endpoints)
            # Filter external APIs for companio
            comp_apis = [a for a in external_apis if 'companio' in a or 'razorpay' in a or 'cashfree' in a]
            if comp_apis:
                print(f"Company APIs in {c.split('/')[-1]}:", comp_apis[:10])
    except Exception as e:
        print(f"Error {c}: {e}")
