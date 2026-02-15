import os
import io
import datetime
import pickle
import re
import difflib
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

def get_service():
    """Shows basic usage of the Drive v3 API."""
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists('credentials.json'):
                print("Error: credentials.json not found in current directory.")
                return None
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('drive', 'v3', credentials=creds)
    return service

def get_files_in_folder(service, folder_id):
    """Get all files in a folder."""
    results = []
    page_token = None
    while True:
        try:
            response = service.files().list(
                q=f"'{folder_id}' in parents and trashed = false",
                fields="nextPageToken, files(id, name, mimeType)",
                pageToken=page_token,
                includeItemsFromAllDrives=True,
                supportsAllDrives=True
            ).execute()
            
            results.extend(response.get('files', []))
            page_token = response.get('nextPageToken', None)
            if page_token is None:
                break
        except Exception as e:
            print(f"Error getting files in folder {folder_id}: {e}")
            break
    return results

def find_subfolder(service, parent_id, folder_name):
    """Find a specific subfolder by name."""
    try:
        results = service.files().list(
            q=f"'{parent_id}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '{folder_name}' and trashed = false",
            fields="files(id, name)",
            pageSize=1,
            includeItemsFromAllDrives=True,
            supportsAllDrives=True
        ).execute()
        files = results.get('files', [])
        if files:
            return files[0]['id']
    except Exception as e:
        print(f"Error finding folder {folder_name}: {e}")
    return None

def create_markdown_file(title, video_id, poster_id, output_dir):
    """Creates a markdown post file."""
    
    # Clean title: Remove ONLY leading [digits] blocks (Dates)
    # The user wants to keep [Maker] like [Queen Bee] but remove [251205]
    clean_title = re.sub(r'^\[\d+\]\s*', '', title).strip()
    
    # Sanitize filename (use cleaned title)
    safe_title = "".join([c for c in clean_title if c.isalpha() or c.isdigit() or c in " ._-"]).strip()
    
    # Fallback if cleaning removed everything or resulted in empty safe string
    if not safe_title:
        safe_title = "".join([c for c in title if c.isalpha() or c.isdigit() or c in " ._-"]).strip()
        
    filename = f"{safe_title}.md"
    filepath = os.path.join(output_dir, filename)
    
    if os.path.exists(filepath):
        print(f"Skipping {filename}, already exists.")
        return

    today = datetime.date.today().isoformat()
    
    # Custom iframe embed code
    iframe_embed = f"""<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe 
    src="https://drive.google.com/file/d/{video_id}/preview" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    allow="autoplay; fullscreen"
    allowfullscreen
    frameborder="0">
  </iframe>
</div>"""

    # Image direct link format requested by user
    image_link = f"https://lh3.googleusercontent.com/d/{poster_id}"

    content = f"""---
title: "{clean_title}"
published: {today}
description: ''
image: '{image_link}'
tags: []
category: '里番'
draft: false 
lang: ''
---

{iframe_embed}
"""
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Created post: {filename}")

# Global log for skipped items
skipped_items_log = []

def parse_date_from_filename(filename):
    """Extracts date from [YYMMDD] prefix. Returns ISO string or today's date."""
    match = re.search(r'^\[(\d{2})(\d{2})(\d{2})\]', filename)
    if match:
        year, month, day = match.groups()
        # Assume 20xx for year
        full_year = f"20{year}"
        try:
            date_obj = datetime.date(int(full_year), int(month), int(day))
            return date_obj.isoformat()
        except ValueError:
            pass # Invalid date, fallback
    return datetime.date.today().isoformat()

def _kanji_to_int(kanji):
    """日文汉字数字转阿拉伯数字。支持 一～十、十一～二十。"""
    kanji_map = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
                 '六': 6, '七': 7, '八': 8, '九': 9, '十': 10}
    if kanji in kanji_map:
        return kanji_map[kanji]
    if kanji.startswith('十') and len(kanji) == 2 and kanji[1] in kanji_map:
        return 10 + kanji_map[kanji[1]]
    if kanji == '二十':
        return 20
    return None


def extract_series_info(title):
    """从标题中提取系列名和集数。
    
    支持的模式：
    - 第X巻/第X話 等 (阿拉伯数字)
    - 第一話/第二話 等 (日文汉字数字)
    - ＃X / #X (全角/半角井号)
    - Vol.X / Episode X / EP X
    - LEVEL：X
    - 前編/後編 / 上巻/下巻 / 上/下
    - 副标题式系列 / 标题末尾数字
    - 其の壱/弍/参 等古文编号
    
    返回 (series_name, series_order) 或 (None, None)
    """
    clean = re.sub(r'^(\[.*?\])+\s*', '', title).strip()
    
    m = re.search(r'(.+?)\s*第(\d+)[巻話话集章]', clean)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    m = re.search(r'(.+?)\s*第([一二三四五六七八九十]+)[巻話话集章]', clean)
    if m:
        order = _kanji_to_int(m.group(2))
        if order:
            return (m.group(1).strip(), order)
    
    m = re.search(r'(.+?)\s*[＃#](\d+)', clean)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    m = re.search(r'(.+?)\s*Vol\.?\s*(\d+)', clean, re.IGNORECASE)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    m = re.search(r'(.+?)\s*(?:Episode|EP)\.?\s*(\d+)', clean, re.IGNORECASE)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    m = re.search(r'(.+?)\s*LEVEL[：:]\s*(\d+)', clean, re.IGNORECASE)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    m = re.search(r'(.+?)\s*(前編|前编|前篇|後編|后编|後篇|后篇)', clean)
    if m:
        return (m.group(1).strip(), 1 if '前' in m.group(2) else 2)
    
    m = re.search(r'(.+?)\s+(上巻|下巻|上卷|下卷)', clean)
    if m:
        return (m.group(1).strip(), 1 if '上' in m.group(2) else 2)
    
    m = re.search(r'(.+?)\s+(上|下)$', clean)
    if m:
        return (m.group(1).strip(), 1 if m.group(2) == '上' else 2)
    
    m = re.search(r'(.+?)\s+(\d+)番', clean)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    m = re.search(r'^(.+?)\s*[～〜]\s*.+[～〜]$', clean)
    if m:
        base = m.group(1).strip()
        if len(base) >= 2:
            return (base, 0)
    
    m = re.search(r'^(.+?)(\d+)$', clean)
    if m:
        base = m.group(1).strip()
        num = int(m.group(2))
        if num < 100 and len(base) >= 2:
            return (base, num)
    
    m = re.search(r'(.+?)\s+(\d+)\s+side\s+', clean, re.IGNORECASE)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    kanji_order_map = {'壱': 1, '弍': 2, '弐': 2, '参': 3, '肆': 4, '伍': 5}
    m = re.search(r'(.+?)\s*其の([壱弍弐参肆伍])', clean)
    if m:
        order = kanji_order_map.get(m.group(2))
        if order:
            return (m.group(1).strip(), order)
    
    return (None, None)

def create_markdown_file(title, video_id, poster_id, output_dir, date_str=None, tags=None):
    """Creates a markdown post file."""
    
    # Clean title: Remove ONLY leading [digits] blocks (Dates)
    clean_title = re.sub(r'^\[\d+\]\s*', '', title).strip()
    
    # Sanitize filename
    safe_title = "".join([c for c in clean_title if c.isalpha() or c.isdigit() or c in " ._-"]).strip()
    if not safe_title:
        safe_title = "".join([c for c in title if c.isalpha() or c.isdigit() or c in " ._-"]).strip()
        
    filename = f"{safe_title}.md"
    filepath = os.path.join(output_dir, filename)
    
    if os.path.exists(filepath):
        print(f"Skipping {filename}, already exists.")
        return

    # Use parsed date if provided, else today
    published_date = date_str if date_str else datetime.date.today().isoformat()
    
    # 自动提取系列信息
    series_name, series_order = extract_series_info(clean_title)
    
    # Custom iframe embed code
    iframe_embed = f"""<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe 
    src="https://drive.google.com/file/d/{video_id}/preview" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    allow="autoplay; fullscreen"
    allowfullscreen
    frameborder="0">
  </iframe>
</div>"""

    # Image direct link format requested by user
    image_link = ""
    if poster_id:
        image_link = f"https://lh3.googleusercontent.com/d/{poster_id}"

    # Format tags for YAML
    tag_str = "[]"
    if tags:
        tag_items = ", ".join([f"'{t}'" for t in tags])
        tag_str = f"[{tag_items}]"

    # 构建系列字段
    series_fields = ""
    if series_name:
        series_fields = f"series: '{series_name}'\nseriesOrder: {series_order}\n"
        print(f"  [Series] '{series_name}' #{series_order}")

    content = f"""---
title: "{clean_title}"
published: {published_date}
description: ''
image: '{image_link}'
tags: {tag_str}
category: '里番'
{series_fields}draft: false 
lang: ''
---

{iframe_embed}
"""
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Created post: {filename} (Date: {published_date})")

def process_sim_folder(service, folder_id, output_dir, folder_name_for_log="Unknown", year_tag=None):
    """Processes a folder. Tries CHS/Posters structure first, then Flat structure."""
    print(f"Processing folder: {folder_name_for_log} ({folder_id})")
    
    # Init lists
    video_map = {}
    image_map = {}
    
    # 1. Find folders
    print("Looking for Video folder ('CHS' or '720p')...")
    # Try 'CHS' first
    video_folder_id = find_subfolder(service, folder_id, 'CHS')
    
    if not video_folder_id:
        # Try '720p'
        video_folder_id = find_subfolder(service, folder_id, '720p')

    if not video_folder_id:
        # Fallback case-insensitive check
        all_files_check = get_files_in_folder(service, folder_id)
        for f in all_files_check:
            if f['mimeType'] == 'application/vnd.google-apps.folder':
                fname_upper = f['name'].upper()
                if fname_upper == 'CHS' or fname_upper == '720P':
                     video_folder_id = f['id']
                     break
    
    if video_folder_id:
        # --- STRUCTURED MODE ---
        print(f"  Found Video folder: {video_folder_id}, using Structured Mode.")
        
        print("Looking for Image folder ('海报', 'Posters', '封面')...")
        poster_id = find_subfolder(service, folder_id, '海报')
        if not poster_id:
            poster_id = find_subfolder(service, folder_id, 'Posters')
        if not poster_id:
            poster_id = find_subfolder(service, folder_id, '封面')
            
        # Fuzzy poster search
        if not poster_id:
            all_files = get_files_in_folder(service, folder_id)
            for f in all_files:
                if f['mimeType'] == 'application/vnd.google-apps.folder':
                    fname = f['name']
                    if '海报' in fname or 'Poster' in fname or 'poster' in fname or '封面' in fname:
                        poster_id = f['id']
                        break
        
        # List files in subfolders
        videos = get_files_in_folder(service, video_folder_id)

        if not poster_id:
            msg = f"Warning: {folder_name_for_log}: Video folder found but No Posters folder found. Posts will have no covers."
            print(f"  {msg}")
            skipped_items_log.append(msg)
            images = [] # No images
        else:
            images = get_files_in_folder(service, poster_id)
        
    else:
        # --- FLAT MODE ---
        print("  No 'CHS' or '720p' folder, using Flat Mode (scanning current folder).")
        all_files = get_files_in_folder(service, folder_id)
        videos = [f for f in all_files if 'video' in f['mimeType'] or f['name'].lower().endswith(('.mp4', '.mkv', '.avi', '.mov'))]
        images = [f for f in all_files if 'image' in f['mimeType'] or f['name'].lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]

    # Populate Maps
    for v in videos:
        name = os.path.splitext(v['name'])[0]
        if name.lower().endswith('.chs'):
            name = name[:-4]
        video_map[name.strip()] = v
        
    for i in images:
        name = os.path.splitext(i['name'])[0]
        image_map[name.strip()] = i

    print(f"  Found {len(video_map)} videos and {len(image_map)} images.")
    
    if len(video_map) == 0:
        msg = f"Skipped {folder_name_for_log}: No videos found."
        print(f"  {msg}")
        skipped_items_log.append(msg)
        return False

    # Special Case: 1 Video + 1 Image = Forced Match
    if len(video_map) == 1 and len(image_map) == 1:
        vid_name = list(video_map.keys())[0]
        video = list(video_map.values())[0]
        poster = list(image_map.values())[0]
        
        print(f"  Single video and single image found. Forced matching: {vid_name} <-> {poster['name']}")
        
        date_str = parse_date_from_filename(vid_name)
        
        # Prepare tags list
        current_tags = []
        if year_tag:
            current_tags.append(year_tag)
            
        create_markdown_file(vid_name, video['id'], poster['id'], output_dir, date_str, current_tags)
        return True

    # Standard Matching Logic
    count = 0
    
    def normalize_string(s):
        # Remove anything that is NOT alphanumeric (A-Z, 0-9, Japanese/Chinese chars)
        # aggressive removal of symbols including fullwidth
        # Added: 〜 (U+301C), ［ (U+FF3B), ］ (U+FF3D), ◯ (U+25EF), 〇 (U+3007)
        s = re.sub(r'[\[\]\(\)\{\}【】（）\s\._\-\+\？\！\!○・：:～~=＝#&〜［］◯〇]+', '', s)
        return s.lower()

    for vid_name, video in video_map.items():
        poster = None
        
        # 1. Exact Match
        if vid_name in image_map:
            poster = image_map[vid_name]
        
        # 2. Strip [prefixes] (e.g. [2024][Maker] Title -> Title)
        if not poster:
            clean_vid_name = re.sub(r'^(\[.*?\])+', '', vid_name).strip()
            if clean_vid_name in image_map:
                poster = image_map[clean_vid_name]
        
        # 3. Substring (Image in Video OR Video in Image)
        if not poster:
            for img_name, img_file in image_map.items():
                if img_name in vid_name or vid_name in img_name:
                    poster = img_file
                    break
        
        # 4. Fuzzy Clean Match (Strip spaces)
        if not poster:
             clean_vid_name = re.sub(r'^(\[.*?\])+', '', vid_name).strip()
             for img_name, img_file in image_map.items():
                if clean_vid_name.replace(' ', '') == img_name.replace(' ', ''):
                    poster = img_file
                    break

        # 5. Super Fuzzy Normalized Match (Remove all special chars/brackets)
        if not poster:
            norm_vid = normalize_string(vid_name)
            for img_name, img_file in image_map.items():
                norm_img = normalize_string(img_name)
                # Check if one contains the other (e.g. "Title" in "251211_Title_Cover")
                if len(norm_img) > 3 and (norm_img in norm_vid):
                     poster = img_file
                     print(f"  [Fuzzy Match] '{img_name}' matches '{vid_name}'")
                     break
                if len(norm_vid) > 3 and (norm_vid in norm_img):
                     poster = img_file
                     print(f"  [Fuzzy Match] '{img_name}' matches '{vid_name}'")
                     break

        # 6. Strip Content Inside Brackets Match (Requested by user)
        # e.g. Video: "[Maker] Title" vs Poster: "[Tag] Title" -> Match "Title" == "Title"
        if not poster:
            def strip_brackets(s):
                # Remove [content] and 【content】
                s = re.sub(r'(\[.*?\]|【.*?】)', '', s)
                return s.strip()
            
            core_vid = strip_brackets(vid_name).replace(' ', '')
            for img_name, img_file in image_map.items():
                core_img = strip_brackets(img_name).replace(' ', '')
                # Ensure we have enough chars left to avoid matching empty strings or "part1" generic stuff
                if len(core_vid) > 2 and core_vid == core_img:
                    poster = img_file
                    print(f"  [Bracket Strip Match] '{img_name}' matches '{vid_name}'")
                    break

        # 7. Similarity Match (difflib) - Standard Library
        # Handles cases like "video name" vs "video name censored" where substrings don't match
        if not poster:
            norm_vid = normalize_string(vid_name)
            best_ratio = 0.0
            best_match = None
            
            for img_name, img_file in image_map.items():
                norm_img = normalize_string(img_name)
                # Skip if strings are too short to be meaningful
                if len(norm_vid) < 3 or len(norm_img) < 3:
                     continue
                     
                ratio = difflib.SequenceMatcher(None, norm_vid, norm_img).ratio()
                if ratio > best_ratio:
                    best_ratio = ratio
                    best_match = img_file
            
            # Threshold 0.7 (70% similarity)
            if best_ratio > 0.7:
                 poster = best_match
                 print(f"  [Similarity Match {best_ratio:.2f}] '{poster['name']}' matches '{vid_name}'")
        
        date_str = parse_date_from_filename(vid_name)
        
        # Prepare tags list
        current_tags = []
        if year_tag:
            current_tags.append(year_tag)
        
        if poster:
            create_markdown_file(vid_name, video['id'], poster['id'], output_dir, date_str, current_tags)
        else:
            # Generate WITHOUT poster
            msg = f"Generated (No Cover): {folder_name_for_log} - '{vid_name}'"
            skipped_items_log.append(msg)
            
            # Debug: Print what we tried to match against
            print(f"  [Failed Match] Video: '{vid_name}'")
            # print(f"    Available Images: {list(image_map.keys())}") 
            
            create_markdown_file(vid_name, video['id'], None, output_dir, date_str, current_tags)
            
        count += 1
            
    print(f"  Generated {count} posts in {os.path.basename(output_dir)}.")
    return True

def main():
    service = get_service()
    if not service:
        return

    print("Google Drive API Authenticated successfully.")
    
    root_folder_id = input("Please enter the Google Drive Folder ID (the shared folder ID): ").strip()
    
    if not root_folder_id:
        print("No folder ID provided. Exiting.")
        return

    print(f"Scanning folder ID: {root_folder_id}...")
    
    # Get root folder name
    try:
        folder_metadata = service.files().get(
            fileId=root_folder_id,
            fields="name",
            supportsAllDrives=True
        ).execute()
        root_folder_name = folder_metadata.get('name', 'Unknown_Folder')
        safe_root_name = "".join([c for c in root_folder_name if c.isalpha() or c.isdigit() or c in " ._-"]).strip()
        print(f"Root Folder Name: {safe_root_name}")
        
        # Extract Year Tag from Root Folder Name
        # Look for 4 digits: 20xx
        year_match = re.search(r'(20\d{2})', root_folder_name)
        year_tag = None
        if year_match:
            year_tag = year_match.group(1)
            print(f"Detected Year Tag: {year_tag}")
        else:
            print("No year detected in root folder name, no tag will be added.")
            
    except Exception as e:
        print(f"Error getting folder name: {e}")
        safe_root_name = "Drive_Imports"
        year_tag = None

    posts_root = os.path.join(os.getcwd(), 'src', 'content', 'posts')

    # Detect Mode: Check if Root contains CHS
    has_chs = False
    chs_id = find_subfolder(service, root_folder_id, 'CHS')
    if not chs_id:
        all_files = get_files_in_folder(service, root_folder_id)
        for f in all_files:
             if f['mimeType'] == 'application/vnd.google-apps.folder' and f['name'].upper() == 'CHS':
                 has_chs = True
                 break
    else:
        has_chs = True

    if has_chs:
        print("--- Single Folder Mode Detected ---")
        target_dir = os.path.join(posts_root, safe_root_name)
        process_sim_folder(service, root_folder_id, target_dir, safe_root_name, year_tag)
    else:
        print("--- Batch/Flat Mode Detected ---")
        # Could be a flattened year folder (multiple subfolders) OR a single flat folder (no subfolders, just files)
        # Let's count subfolders
        all_files = get_files_in_folder(service, root_folder_id)
        subfolders = [f for f in all_files if f['mimeType'] == 'application/vnd.google-apps.folder']
        
        if len(subfolders) == 0:
             print("No subfolders found. Treating as Single Flat Folder.")
             target_dir = os.path.join(posts_root, safe_root_name)
             process_sim_folder(service, root_folder_id, target_dir, safe_root_name, year_tag)
        else:
            print(f"Found {len(subfolders)} subfolders. Scanning recursive...")
            for sub in subfolders:
                sub_name = sub['name']
                safe_sub_name = "".join([c for c in sub_name if c.isalpha() or c.isdigit() or c in " ._-"]).strip()
                # posts/Root/Sub
                target_dir = os.path.join(posts_root, safe_root_name, safe_sub_name)
                process_sim_folder(service, sub['id'], target_dir, sub_name, year_tag)

    # Write Skipped Log
    if skipped_items_log:
        # Save log in the Root Folder of this batch (e.g., src/content/posts/2015/)
        batch_root_dir = os.path.join(posts_root, safe_root_name)
        if not os.path.exists(batch_root_dir):
            os.makedirs(batch_root_dir)
            
        log_path = os.path.join(batch_root_dir, 'skipped_items.md')
        
        with open(log_path, 'w', encoding='utf-8') as f:
            f.write("# Skipped Items Log\n\n")
            f.write(f"Generated at: {datetime.datetime.now()}\n\n")
            for item in skipped_items_log:
                f.write(f"- {item}\n")
        print(f"\nWarning: {len(skipped_items_log)} items were skipped. See details in: {log_path}")

if __name__ == '__main__':
    main()
