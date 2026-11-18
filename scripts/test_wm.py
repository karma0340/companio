import subprocess
import os

html_abs = os.path.abspath("test_watermark.html")
pdf_abs = os.path.abspath("test_wm.pdf")

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
tmp_dir = os.environ.get("TEMP", r"C:\Users\Dell\AppData\Local\Temp")
user_data_dir = os.path.join(tmp_dir, "chrome_wm_test")

res = subprocess.run([
    chrome, "--headless=new", "--no-sandbox", "--disable-gpu",
    f"--user-data-dir={user_data_dir}",
    f"--print-to-pdf={pdf_abs}", html_abs
], capture_output=True, text=True)
print("PDF generated:", os.path.exists(pdf_abs), "Size:", os.path.getsize(pdf_abs) if os.path.exists(pdf_abs) else 0)
