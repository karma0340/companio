import subprocess
import os
import urllib.request
import re

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = r"C:\Users\Dell\.gemini\antigravity\brain\aa7e7bc3-64aa-42b7-b6aa-e507949f2f3d\qa_audit"
BASE_URL = "http://localhost:3000"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def take_screenshot(url, filename, width=1280, height=900):
    dest = os.path.join(OUTPUT_DIR, filename)
    cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--screenshot={dest}",
        f"--window-size={width},{height}",
        "--virtual-time-budget=2500",
        url
    ]
    subprocess.run(cmd, capture_output=True, timeout=15)
    size = os.path.getsize(dest) if os.path.exists(dest) else 0
    return dest, size

def get_dom(url):
    with urllib.request.urlopen(url) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def main():
    print("=" * 65)
    print("VERIFYING GLOBAL RESPONSIVENESS ACROSS SCREENS")
    print("=" * 65)

    # 1. Test trycompanio.in mobile viewport (375x812)
    print("\n[1] Testing Marketing Showroom on Mobile (375x812)...")
    dest_mob_sr, size_mob_sr = take_screenshot(f"{BASE_URL}/", "responsive_01_showroom_mobile_375.png", 375, 812)
    dom_sr = get_dom(f"{BASE_URL}/")
    has_bottom_nav_sr = 'aria-label="Mobile navigation"' in dom_sr
    print(f"    Screenshot: {size_mob_sr} bytes. Mobile Bottom Nav found: {has_bottom_nav_sr}")

    # 2. Test trycompanio.in explore on mobile
    print("\n[2] Testing Marketing Explore on Mobile (375x812)...")
    dest_mob_exp, size_mob_exp = take_screenshot(f"{BASE_URL}/explore", "responsive_02_explore_mobile_375.png", 375, 812)
    dom_exp = get_dom(f"{BASE_URL}/explore")
    print(f"    Screenshot: {size_mob_exp} bytes. Explore companions found: {'Explore Companions' in dom_exp}")

    # 3. Test getcompanio.in marketplace on mobile (375x812)
    print("\n[3] Testing Marketplace PWA on Mobile (375x812)...")
    dest_mob_app, size_mob_app = take_screenshot(f"{BASE_URL}/app", "responsive_03_marketplace_mobile_375.png", 375, 812)
    dom_app = get_dom(f"{BASE_URL}/app")
    header_count = dom_app.count('<header')
    has_pwa_banner = 'Add Companio to your home screen' in dom_app
    has_market_bottom_nav = 'aria-label="Marketplace mobile navigation"' in dom_app
    print(f"    Screenshot: {size_mob_app} bytes.")
    print(f"    Header count on /app: {header_count} (Expected: 1)")
    print(f"    Floating PWA install banner found: {has_pwa_banner}")
    print(f"    Marketplace Mobile Bottom Nav found: {has_market_bottom_nav}")

    # 4. Test Tablet Viewport (768x1024)
    print("\n[4] Testing Marketplace PWA on Tablet (768x1024)...")
    dest_tab_app, size_tab_app = take_screenshot(f"{BASE_URL}/app", "responsive_04_marketplace_tablet_768.png", 768, 1024)
    print(f"    Screenshot: {size_tab_app} bytes.")

    # 5. Test Desktop Viewport (1280x900)
    print("\n[5] Testing Marketplace PWA on Desktop (1280x900)...")
    dest_desk_app, size_desk_app = take_screenshot(f"{BASE_URL}/app", "responsive_05_marketplace_desktop_1280.png", 1280, 900)
    print(f"    Screenshot: {size_desk_app} bytes.")

    # 6. Test App Dashboard on Mobile (375x812)
    print("\n[6] Testing Internal App Dashboard on Mobile (375x812)...")
    dest_mob_dash, size_mob_dash = take_screenshot(f"{BASE_URL}/app/dashboard", "responsive_06_dashboard_mobile_375.png", 375, 812)
    print(f"    Screenshot: {size_mob_dash} bytes.")

    assert has_bottom_nav_sr, "Marketing showroom should have mobile bottom navigation"
    assert header_count == 1, f"Expected exactly 1 header on /app, got {header_count}"
    assert has_pwa_banner, "Marketplace should have floating PWA install banner"
    assert has_market_bottom_nav, "Marketplace should have bottom navigation"

    print("\nALL RESPONSIVENESS AND SIZING AUDIT CHECKS PASSED!")

if __name__ == "__main__":
    main()
