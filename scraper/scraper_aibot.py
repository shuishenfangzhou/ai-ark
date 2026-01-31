import json
from bs4 import BeautifulSoup
import re

HTML_FILE = "aibot_home.html"
OUTPUT_FILE = "scraped_aibot.json"

def main():
    try:
        with open(HTML_FILE, 'r', encoding='utf-8', errors='ignore') as f:
            html = f.read()
    except FileNotFoundError:
        print(f"❌ File {HTML_FILE} not found. Please run the curl/python command to download it first.")
        return

    soup = BeautifulSoup(html, 'html.parser')
    tools = []
    
    # Iterate over all categories or sections if possible
    # OneNav theme usually structures it as: 
    # <h4 class="text-gray"><i class="tag-icon ..."></i> Category Name</h4>
    # <div class="row"> ... cards ... </div>
    
    # Let's find all cards first, and try to deduce category from context or just gather them all
    
    cards = soup.find_all('div', class_='url-card')
    print(f"🔍 Found {len(cards)} cards in total.")
    
    for card in cards:
        try:
            # 1. Name
            name_tag = card.find('strong')
            name = name_tag.get_text(strip=True) if name_tag else "Unknown"
            
            # 2. Description
            desc_tag = card.find('p', class_='overflowClip_1') # Based on snippet
            desc = desc_tag.get_text(strip=True) if desc_tag else ""
            if not desc:
                # Try generic p
                desc_tag = card.find('div', class_='url-info').find('p')
                desc = desc_tag.get_text(strip=True) if desc_tag else ""

            # 3. URL
            a_tag = card.find('a')
            url = a_tag['href'] if a_tag else ""
            
            # 4. Logo
            img_tag = card.find('img')
            logo = ""
            if img_tag:
                logo = img_tag.get('data-src') or img_tag.get('src') or ""
            
            # 5. Category (Heuristic)
            # Find the closest preceding ID or Header
            # This is tricky with simple find_all. 
            # Let's try to map categories if we can, otherwise default to "Uncategorized"
            # Or we can rely on the existing mapping in the merge script.
            category = "General" 
            
            # Attempt to find parent section
            # parent_section = card.find_parent('div', class_='tab-pane') ...
            
            tools.append({
                "name": name,
                "desc": desc,
                "url": url,
                "logo": logo,
                "category": category,
                "visits": "N/A", # Not scraped
                "rating": 4.5,   # Default
                "tags": []
            })
            
        except Exception as e:
            print(f"⚠️ Error parsing card: {e}")
            continue

    # Post-process to map categories based on name keywords if possible
    # or just leave them for the merger to handle (maybe merger can keep existing category)
    
    print(f"✅ Extracted {len(tools)} tools.")
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(tools, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    main()
