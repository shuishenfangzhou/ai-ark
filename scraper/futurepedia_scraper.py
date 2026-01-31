import requests
from bs4 import BeautifulSoup
import json
import time
import random
import os

# --- Configuration ---
BASE_URL = "https://www.futurepedia.io"
OUTPUT_FILE = "scraped_futurepedia.json"
MAX_PAGES = 5  # Default limit to prevent infinite scraping during testing
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
]

def get_headers():
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://www.google.com/"
    }

def scrape_page(page_num):
    url = f"{BASE_URL}/ai-tools?page={page_num}"
    print(f"🔄 Scraping page {page_num}: {url}")
    
    try:
        response = requests.get(url, headers=get_headers(), timeout=15)
        response.raise_for_status()
    except Exception as e:
        print(f"❌ Failed to fetch page {page_num}: {e}")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    tools = []

    # Method 1: Try to find Next.js data (Best method for Next.js sites)
    next_data = soup.find("script", {"id": "__NEXT_DATA__"})
    if next_data:
        try:
            data = json.loads(next_data.string)
            # Traverse the JSON structure to find tools list
            # Note: The path might vary, this is a common pattern check
            props = data.get('props', {}).get('pageProps', {})
            # Futurepedia specific structure might need adjustment here based on inspection
            # Often it's in props.tools or similar. 
            # If we can't guess the structure blindly, we fallback to HTML parsing.
            
            # For robustness in this blind script, let's rely on HTML parsing which is more visual
            # but keep this placeholder if user wants to debug.
            pass 
        except:
            pass

    # Method 2: HTML Parsing (General fallback)
    # Look for tool cards. Classes are likely dynamic (Tailwind), so we look for structure.
    # We look for links that look like tool details.
    
    # Assuming cards are in a grid
    # This selector is a guess based on common Tailwind structures. 
    # We might need to adjust this after first run or user feedback.
    # But often cards have an anchor to the tool detail page.
    
    # Let's try to find elements that look like tool cards
    # A generic approach: find all articles or divs with specific text/links
    
    # *Correction*: Without visual access, I will write a generic heuristic scraper 
    # that looks for common patterns in directory sites.
    
    cards = soup.find_all('div', class_=lambda x: x and 'tool-card' in x if x else False) # Example class
    
    # If explicit class search fails, try finding links that contain '/tool/'
    if not cards:
        links = soup.find_all('a', href=lambda x: x and '/tool/' in x)
        # Uniqueify parent divs
        processed_urls = set()
        for link in links:
            tool_url = link['href']
            if tool_url in processed_urls:
                continue
            processed_urls.add(tool_url)
            
            # Extract info from the link's parent container
            card = link.find_parent('div') 
            if not card: continue
            
            tool_data = extract_tool_info(card, tool_url)
            if tool_data:
                tools.append(tool_data)
    
    return tools

def extract_tool_info(card, relative_url):
    try:
        # Name: usually in an h3 or h4
        name_tag = card.find(['h3', 'h4'])
        name = name_tag.get_text(strip=True) if name_tag else "Unknown"
        
        # Description: usually in a p tag
        desc_tag = card.find('p')
        desc = desc_tag.get_text(strip=True) if desc_tag else ""
        
        # Categories: looking for small text or badges
        # This is hard to guess blindly, defaulting to 'General'
        category = "General" 
        
        # Image
        img_tag = card.find('img')
        logo = ""
        if img_tag:
            # 优先尝试获取 srcset 中的高清图
            if 'srcset' in img_tag.attrs:
                try:
                    # srcset 格式通常为 "url 1x, url 2x" 或 "url 640w, url 1080w"
                    # 取最后一个通常是最高清的
                    srcset = img_tag['srcset']
                    candidates = srcset.split(',')
                    last_candidate = candidates[-1].strip()
                    logo = last_candidate.split(' ')[0]
                except:
                    pass
            
            # 如果 srcset 解析失败或没有，尝试 src 和 data-src
            if not logo or logo.startswith('data:image'):
                logo = img_tag.get('src') or img_tag.get('data-src') or ""
                
            # 处理相对路径
            if logo and logo.startswith('/'):
                logo = f"{BASE_URL}{logo}"
        
        return {
            "name": name,
            "desc": desc,
            "url": f"{BASE_URL}{relative_url}", # This is the detail page URL
            "website_url": "", # We might need to visit detail page to get real URL
            "cat": category,
            "logo": logo,
            "tags": ["Scraped"],
            "pricing": "Unknown"
        }
    except Exception as e:
        # print(f"Error extracting tool: {e}")
        return None

def main():
    print("🚀 Starting Futurepedia Scraper...")
    all_tools = []
    
    for page in range(1, MAX_PAGES + 1):
        tools = scrape_page(page)
        if not tools:
            print(f"⚠️ No tools found on page {page}. Structure might have changed or end of list.")
            # If method 2 failed entirely, let's try a very broad search just to get *something* for the user to see
            # Or stop if it's truly empty
            if page == 1:
                print("💡 Tip: The website structure might be different. Please inspect the page source and update selectors.")
            break
            
        print(f"✅ Found {len(tools)} tools on page {page}")
        all_tools.extend(tools)
        
        # Be polite
        time.sleep(random.uniform(1, 3))
        
    # Save to file
    if all_tools:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(all_tools, f, indent=4, ensure_ascii=False)
        print(f"\n🎉 Scraping complete! Saved {len(all_tools)} tools to {OUTPUT_FILE}")
    else:
        print("\n❌ No tools scraped. Please check the website structure.")

if __name__ == "__main__":
    main()
