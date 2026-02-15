"""
批量更新脚本：扫描已有的 Markdown 文章，自动从标题中检测系列信息，
并将 series / seriesOrder 字段写入 frontmatter。

使用方法:
  python scripts/update_series.py            # 预览模式（只显示会改什么，不实际修改）
  python scripts/update_series.py --apply    # 实际应用修改

功能:
  1. 扫描 src/content/posts/ 下所有 .md 文件
  2. 读取 frontmatter 中的 title
  3. 用 extract_series_info() 从标题提取系列名和集数
  4. 如果文章还没有 series 字段（或 series 为空），则写入
  5. 已有 series 字段的文章不会被覆盖
"""

import os
import re
import sys
import io

# 修复 Windows 终端编码问题
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 文章根目录
POSTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'content', 'posts')

def _kanji_to_int(kanji):
    """日文汉字数字转阿拉伯数字。支持 一～十、十一～二十。"""
    kanji_map = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
                 '六': 6, '七': 7, '八': 8, '九': 9, '十': 10}
    if kanji in kanji_map:
        return kanji_map[kanji]
    # 处理 十一～十九
    if kanji.startswith('十') and len(kanji) == 2 and kanji[1] in kanji_map:
        return 10 + kanji_map[kanji[1]]
    # 处理 二十
    if kanji == '二十':
        return 20
    return None


def extract_series_info(title):
    """从标题中提取系列名和集数。
    
    支持的模式：
    - 第X巻/第X話/第X话/第X集/第X章 (阿拉伯数字)
    - 第一話/第二話/第一章 等 (日文汉字数字)
    - ＃X / #X (全角/半角井号)
    - Vol.X / Volume X
    - Episode X / EP X / EP.X
    - LEVEL：X / LEVEL:X
    - X番ホーム 等编号模式
    - 前編/後編 / 前篇/後篇 → 1/2
    - 上巻/下巻 / 上/下 → 1/2
    - 副标题式系列 (同名基础标题 ～不同副标题～)
    - 标题末尾的纯数字
    
    返回 (series_name, series_order) 或 (None, None)
    """
    # 先清理标题：去掉 [制作公司] 等前缀
    clean = re.sub(r'^(\[.*?\])+\s*', '', title).strip()
    
    # 模式1：第X巻/第X話 等 (阿拉伯数字)
    m = re.search(r'(.+?)\s*第(\d+)[巻話话集章]', clean)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    # 模式2：第一話/第二話 等 (日文汉字数字)
    m = re.search(r'(.+?)\s*第([一二三四五六七八九十]+)[巻話话集章]', clean)
    if m:
        order = _kanji_to_int(m.group(2))
        if order:
            return (m.group(1).strip(), order)
    
    # 模式3：＃X 或 #X (全角/半角井号编号，常见于 OVA 系列)
    m = re.search(r'(.+?)\s*[＃#](\d+)', clean)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    # 模式4：Vol.X / Volume X
    m = re.search(r'(.+?)\s*Vol\.?\s*(\d+)', clean, re.IGNORECASE)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    # 模式5：Episode X / EP X / EP.X
    m = re.search(r'(.+?)\s*(?:Episode|EP)\.?\s*(\d+)', clean, re.IGNORECASE)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    # 模式6：LEVEL：X / LEVEL:X
    m = re.search(r'(.+?)\s*LEVEL[：:]\s*(\d+)', clean, re.IGNORECASE)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    # 模式7：前編/後編/前篇/後篇
    m = re.search(r'(.+?)\s*(前編|前编|前篇|後編|后编|後篇|后篇)', clean)
    if m:
        return (m.group(1).strip(), 1 if '前' in m.group(2) else 2)
    
    # 模式8：上巻/下巻
    m = re.search(r'(.+?)\s+(上巻|下巻|上卷|下卷)', clean)
    if m:
        return (m.group(1).strip(), 1 if '上' in m.group(2) else 2)
    
    # 模式9：上/下（标题末尾）
    m = re.search(r'(.+?)\s+(上|下)$', clean)
    if m:
        return (m.group(1).strip(), 1 if m.group(2) == '上' else 2)
    
    # 模式10：X番ホーム 等日文编号
    m = re.search(r'(.+?)\s+(\d+)番', clean)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    # 模式11：副标题式系列 (标题中 ～副标题～ 的格式)
    # 如 "告白…… ～ふわパイオトナギャル～" 和 "告白…… ～生イキ苛めギャル～"
    # 用 ～ 分割，取主标题部分
    m = re.search(r'^(.+?)\s*[～〜]\s*.+[～〜]$', clean)
    if m:
        base = m.group(1).strip()
        # 至少2个字符的基础标题才算有效
        if len(base) >= 2:
            return (base, 0)  # order=0 表示需要后续去重排序
    
    # 模式12：标题末尾的纯数字 (如 "Sweet and Hot1", "アオハルスナッチ2")
    m = re.search(r'^(.+?)(\d+)$', clean)
    if m:
        base = m.group(1).strip()
        num = int(m.group(2))
        # 排除年份等误匹配 (4位以上数字)
        if num < 100 and len(base) >= 2:
            return (base, num)
    
    # 模式13：X side YYYY 格式 (如 "ハーレム・カルト 3 side HAREM")
    m = re.search(r'(.+?)\s+(\d+)\s+side\s+', clean, re.IGNORECASE)
    if m:
        return (m.group(1).strip(), int(m.group(2)))
    
    # 模式14：其の壱/其の弍/其の参 等古文编号
    kanji_order_map = {'壱': 1, '弍': 2, '弐': 2, '参': 3, '肆': 4, '伍': 5}
    m = re.search(r'(.+?)\s*其の([壱弍弐参肆伍])', clean)
    if m:
        order = kanji_order_map.get(m.group(2))
        if order:
            return (m.group(1).strip(), order)
    
    return (None, None)


def parse_frontmatter(content):
    """解析 markdown 文件的 frontmatter 和 body。
    返回 (frontmatter_str, body_str, title)
    """
    if not content.startswith('---'):
        return None, content, None
    
    # 找到第二个 ---
    end_idx = content.find('---', 3)
    if end_idx == -1:
        return None, content, None
    
    fm_str = content[3:end_idx].strip()
    body = content[end_idx + 3:]
    
    # 提取 title
    title = None
    for line in fm_str.split('\n'):
        line = line.strip()
        if line.startswith('title:'):
            # 去掉 title: 前缀和引号
            title = line[6:].strip().strip('"').strip("'")
            break
    
    return fm_str, body, title


def has_series_field(fm_str):
    """检查 frontmatter 是否已有 series 字段（且不为空）"""
    for line in fm_str.split('\n'):
        line = line.strip()
        if line.startswith('series:'):
            value = line[7:].strip().strip('"').strip("'")
            return len(value) > 0
    return False


def add_series_to_frontmatter(fm_str, series_name, series_order):
    """在 frontmatter 中添加 series 和 seriesOrder 字段。
    插入到 category 字段之后（如果有的话），否则插入到末尾。
    """
    lines = fm_str.split('\n')
    new_lines = []
    inserted = False
    
    for line in lines:
        new_lines.append(line)
        # 在 category 行之后插入
        if not inserted and line.strip().startswith('category:'):
            new_lines.append(f"series: '{series_name}'")
            new_lines.append(f"seriesOrder: {series_order}")
            inserted = True
    
    # 如果没有 category 字段，在 tags 后面插入
    if not inserted:
        final_lines = []
        for line in new_lines:
            final_lines.append(line)
            if not inserted and line.strip().startswith('tags:'):
                final_lines.append(f"series: '{series_name}'")
                final_lines.append(f"seriesOrder: {series_order}")
                inserted = True
        if inserted:
            new_lines = final_lines
    
    # 最后兜底：直接追加到末尾
    if not inserted:
        new_lines.append(f"series: '{series_name}'")
        new_lines.append(f"seriesOrder: {series_order}")
    
    return '\n'.join(new_lines)


def scan_and_update(apply=False):
    """扫描所有文章，检测并更新系列信息。"""
    
    updated_count = 0
    skipped_existing = 0
    no_series = 0
    series_groups = {}  # 统计系列分组
    no_series_titles = []  # 未匹配系列模式的文章
    errors = 0
    
    for root, dirs, files in os.walk(POSTS_DIR):
        for fname in files:
            if not fname.endswith('.md'):
                continue
            
            filepath = os.path.join(root, fname)
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception as e:
                print(f"  [错误] 无法读取 {filepath}: {e}")
                errors += 1
                continue
            
            fm_str, body, title = parse_frontmatter(content)
            
            if fm_str is None or title is None:
                continue
            
            # 检查是否已有 series 字段
            if has_series_field(fm_str):
                skipped_existing += 1
                continue
            
            # 提取系列信息
            series_name, series_order = extract_series_info(title)
            
            if series_name is None:
                no_series += 1
                # 记录未匹配的文章标题和路径
                rel_path = os.path.relpath(filepath, POSTS_DIR)
                no_series_titles.append((title, rel_path))
                continue
            
            # 记录系列分组
            if series_name not in series_groups:
                series_groups[series_name] = []
            series_groups[series_name].append((series_order, title, filepath))
            
            if apply:
                # 实际修改文件
                new_fm = add_series_to_frontmatter(fm_str, series_name, series_order)
                new_content = f"---\n{new_fm}\n---{body}"
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                print(f"  [已更新] #{series_order} {title}")
            else:
                print(f"  [预览] #{series_order} {title}")
            
            updated_count += 1
    
    # 打印摘要
    print("\n" + "=" * 60)
    print("[统计] 扫描结果")
    print("=" * 60)
    print(f"  检测到系列文章: {updated_count} 篇")
    print(f"  已有 series 字段（跳过）: {skipped_existing} 篇")
    print(f"  无系列模式（跳过）: {no_series} 篇")
    if errors:
        print(f"  读取错误: {errors} 个")
    
    if series_groups:
        print(f"\n[系列] 检测到 {len(series_groups)} 个系列")
        print("-" * 60)
        for sname, episodes in sorted(series_groups.items()):
            episodes.sort(key=lambda x: x[0])
            ep_nums = [str(e[0]) for e in episodes]
            print(f"  {sname}")
            print(f"    集数: {', '.join(ep_nums)} (共{len(episodes)}集)")
    
    if not apply and updated_count > 0:
        print(f"\n[!] 以上为预览模式，未实际修改文件。")
        print(f"    要应用修改，请运行: python scripts/update_series.py --apply")
    elif apply and updated_count > 0:
        print(f"\n[OK] 已成功更新 {updated_count} 篇文章的 series 字段！")
    elif updated_count == 0:
        print(f"\n[OK] 没有需要更新的文章。")
    
    # 输出未匹配系列模式的文章到日志文件
    if no_series_titles:
        log_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'no_series_posts.txt')
        with open(log_path, 'w', encoding='utf-8') as f:
            f.write(f"未匹配系列模式的文章（共 {len(no_series_titles)} 篇）\n")
            f.write(f"生成时间: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("=" * 80 + "\n\n")
            f.write("这些文章没有被自动检测到系列模式。\n")
            f.write("如果其中有属于同一系列的，可以手动在 frontmatter 中添加：\n")
            f.write("  series: '系列名'\n")
            f.write("  seriesOrder: 集数\n\n")
            f.write("-" * 80 + "\n")
            for title, rel_path in sorted(no_series_titles):
                f.write(f"  {title}\n")
                f.write(f"    -> {rel_path}\n\n")
        print(f"\n[日志] 未匹配文章列表已保存到: {log_path}")


if __name__ == '__main__':
    apply_mode = '--apply' in sys.argv
    
    if apply_mode:
        print("[应用模式] 将实际修改文件...")
    else:
        print("[预览模式] 不会修改任何文件...")
    
    print(f"[目录] {POSTS_DIR}\n")
    
    scan_and_update(apply=apply_mode)
