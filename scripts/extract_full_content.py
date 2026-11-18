from bs4 import BeautifulSoup
import os
import json

def extract_getcompanio():
    with open(os.path.join("LIVE_SCRAPE_AUDIT", "getcompanio.in", "index.html"), "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
    
    # Extract sections
    sections = []
    for sec in soup.find_all(["section", "div"]):
        h2 = sec.find("h2")
        if h2:
            title = h2.get_text(strip=True)
            text_blocks = [p.get_text(strip=True) for p in sec.find_all(["p", "li", "span"]) if len(p.get_text(strip=True)) > 15]
            sections.append({
                "heading": title,
                "content_sample": text_blocks[:8]
            })
    
    # Extract FAQs
    faqs = []
    for details in soup.find_all(["details", "div"]):
        q = details.find(["summary", "h3", "h4", "button"])
        p = details.find("p")
        if q and p and "?" in q.get_text():
            faqs.append({
                "question": q.get_text(strip=True),
                "answer": p.get_text(strip=True)
            })
            
    return {
        "title": soup.title.string.strip() if soup.title else "",
        "h1": [h.get_text(strip=True) for h in soup.find_all("h1")],
        "sections": sections,
        "faqs": faqs
    }

def extract_trycompanio():
    with open(os.path.join("LIVE_SCRAPE_AUDIT", "trycompanio.in", "index.html"), "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
        
    sections = []
    for sec in soup.find_all(["section", "div"]):
        h2 = sec.find("h2")
        if h2:
            title = h2.get_text(strip=True)
            text_blocks = [p.get_text(strip=True) for p in sec.find_all(["p", "li", "span"]) if len(p.get_text(strip=True)) > 15]
            sections.append({
                "heading": title,
                "content_sample": text_blocks[:8]
            })

    faqs = []
    for details in soup.find_all(["details", "div"]):
        q = details.find(["summary", "h3", "h4", "button"])
        p = details.find("p")
        if q and p and "?" in q.get_text():
            faqs.append({
                "question": q.get_text(strip=True),
                "answer": p.get_text(strip=True)
            })

    return {
        "title": soup.title.string.strip() if soup.title else "",
        "h1": [h.get_text(strip=True) for h in soup.find_all("h1")],
        "sections": sections,
        "faqs": faqs
    }

data = {
    "getcompanio": extract_getcompanio(),
    "trycompanio": extract_trycompanio()
}

with open(os.path.join("LIVE_SCRAPE_AUDIT", "content_comparison.json"), "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Extracted content comparison successfully.")
print(f"getcompanio sections found: {len(data['getcompanio']['sections'])}, FAQs: {len(data['getcompanio']['faqs'])}")
print(f"trycompanio sections found: {len(data['trycompanio']['sections'])}, FAQs: {len(data['trycompanio']['faqs'])}")
