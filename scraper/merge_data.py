import json
import os

# Files
SCRAPED_FILE = "scraped_futurepedia.json"
JS_DATA_FILE = "src/tools_data.js"

def load_scraped_data():
    if not os.path.exists(SCRAPED_FILE):
        print(f"❌ Scraped file not found: {SCRAPED_FILE}")
        return []
    with open(SCRAPED_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def merge_data():
    # 1. Load existing JS data
    # This is a hacky way to read the JS object, ideal way is to use a proper parser or keep data in JSON
    # But we stick to the user's format
    try:
        with open(JS_DATA_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
            start = content.find("[")
            end = content.rfind("]") + 1
            if start == -1 or end == -1:
                print("❌ Could not parse existing tools_data.js")
                return
            existing_data = json.loads(content[start:end])
    except Exception as e:
        print(f"❌ Error reading existing data: {e}")
        return

    # 2. Load new scraped data
    new_tools = load_scraped_data()
    if not new_tools:
        print("⚠️ No new tools to merge.")
        return

    print(f"📦 Existing tools: {len(existing_data)}")
    print(f"📥 New tools to merge: {len(new_tools)}")

    # 3. Deduplicate and Merge
    existing_urls = {t['url'] for t in existing_data}
    count_added = 0
    
    current_max_id = max([t.get('id', 0) for t in existing_data]) if existing_data else 0

    for tool in new_tools:
        # Simple deduplication by URL or Name
        if tool['url'] in existing_urls:
            continue
            
        # Add necessary fields if missing
        tool['id'] = current_max_id + 1
        current_max_id += 1
        
        if 'visits' not in tool:
            tool['visits'] = "N/A"
        if 'rating' not in tool:
            tool['rating'] = 4.0
        
        existing_data.append(tool)
        existing_urls.add(tool['url'])
        count_added += 1

    # 4. Write back to JS file
    js_content = f"""
// ==========================================
// Updated Data File
// Total Tools: {len(existing_data)}
// ==========================================
export const aiToolsData = {json.dumps(existing_data, indent=4, ensure_ascii=False)};
"""
    with open(JS_DATA_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"✅ Successfully added {count_added} new tools.")
    print(f"📊 Total tools now: {len(existing_data)}")

if __name__ == "__main__":
    merge_data()
