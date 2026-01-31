import json
import os
import re

SCRAPED_FILE = "scraped_aibot.json"
JS_DATA_FILE = "src/tools_data.js"

def merge_data():
    # 1. Load Scraped Data
    if not os.path.exists(SCRAPED_FILE):
        print("❌ Scraped file not found.")
        return
    with open(SCRAPED_FILE, 'r', encoding='utf-8') as f:
        scraped_tools = json.load(f)
    
    # Index scraped tools by name for easy lookup
    scraped_map = {t['name'].lower().strip(): t for t in scraped_tools}
    print(f"📦 Loaded {len(scraped_tools)} scraped tools.")

    # 2. Load Existing Data
    # Parse the JS file manually to avoid eval
    try:
        with open(JS_DATA_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
            # Extract the array content
            match = re.search(r'(?:export\s+)?const\s+aiToolsData\s*=\s*(\[.*\]);', content, re.DOTALL)
            if match:
                existing_data = json.loads(match.group(1))
            else:
                print("❌ Could not find aiToolsData array.")
                return
    except Exception as e:
        print(f"❌ Error reading existing JS: {e}")
        return

    print(f"📂 Loaded {len(existing_data)} existing tools.")

    # 3. Merge
    # Strategy: 
    # - Loop through existing tools, try to find image in scraped data.
    # - Then, add remaining scraped tools as new entries.
    
    existing_names = set()
    
    for tool in existing_data:
        name_key = tool['name'].lower().strip()
        existing_names.add(name_key)
        
        # Try to find match
        if name_key in scraped_map:
            scraped = scraped_map[name_key]
            
            # Update Logo if needed
            # Current logo might be "assets/logos/..." or empty
            current_logo = tool.get('logo', '')
            scraped_logo = scraped.get('logo', '')
            
            # Use scraped logo if current is missing or local asset that might not exist
            # Or just prefer scraped logo as user asked to "supplement images"
            if scraped_logo and (not current_logo or 'assets/logos' in current_logo):
                tool['logo'] = scraped_logo
                
    # 4. Add new tools
    # We need to assign IDs and map categories
    current_max_id = max([t.get('id', 0) for t in existing_data]) if existing_data else 0
    
    # Category Keywords Mapping
    cat_keywords = {
        'text': ['写作', 'chat', 'gpt', '文案', '对话', 'text'],
        'image': ['绘', '图', 'image', 'diffu', 'art', 'design', '设计'],
        'video': ['视频', 'video', '剪辑', '生成'],
        'audio': ['音', 'audio', 'voice', 'music', '歌'],
        'code': ['代码', 'code', '编程', 'dev'],
        'office': ['办公', 'ppt', 'excel', 'doc', 'pdf'],
        'search': ['搜', 'search'],
    }
    
    count_added = 0
    for s_tool in scraped_tools:
        name_key = s_tool['name'].lower().strip()
        if name_key in existing_names:
            continue
            
        # Create new tool entry
        current_max_id += 1
        
        # Guess category
        cat = 'all'
        combined_text = (s_tool['name'] + s_tool['desc']).lower()
        for c_key, keywords in cat_keywords.items():
            if any(k in combined_text for k in keywords):
                cat = c_key
                break
        
        new_entry = {
            "id": current_max_id,
            "name": s_tool['name'],
            "category": cat,
            "desc": s_tool['desc'],
            "url": s_tool['url'],
            "logo": s_tool['logo'],
            "tags": ["New"],
            "pricing": "未知",
            "visits": "Hot",
            "rating": 4.5
        }
        
        existing_data.append(new_entry)
        count_added += 1

    print(f"➕ Added {count_added} new tools.")

    # 5. Write Back
    js_content = f"""
import {{ }} from './style.css'; // Keep style import if needed by bundler, or just data

// ==========================================
// Updated Data File (Merged with ai-bot.cn)
// Total Tools: {len(existing_data)}
// ==========================================
export const aiToolsData = {json.dumps(existing_data, indent=4, ensure_ascii=False)};
"""
    # Clean up the import line in output
    js_content = js_content.replace("import { } from './style.css';", "")
    
    with open(JS_DATA_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print("✅ Merge complete.")

if __name__ == "__main__":
    merge_data()
