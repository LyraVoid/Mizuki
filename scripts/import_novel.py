# -*- coding: utf-8 -*-
"""
小说批量导入脚本
从纯文本文件中自动识别章节并生成独立的 Markdown 文件。

用法：
  # 从单个 txt 文件导入（自动按章节分割）
  python scripts/import_novel.py --input "小说.txt" --name "小说名"

  # 从目录导入（每章一个 txt 文件）
  python scripts/import_novel.py --input "章节目录/" --name "小说名"

  # 指定发布日期和标签
  python scripts/import_novel.py --input "小说.txt" --name "小说名" --date "2025-01-01" --tags "轻小说,异世界"

  # 预览模式（不写入文件）
  python scripts/import_novel.py --input "小说.txt" --name "小说名" --preview
"""

import os
import re
import sys
import argparse
import datetime

# 修复 Windows 控制台编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 输出目录
POSTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'content', 'posts')


# 章节标题正则模式
CHAPTER_PATTERNS = [
    # 第X章 标题 / 第X话 标题 / 第X回 标题
    re.compile(r'^第[零〇一二三四五六七八九十百千万亿\d]+[章话回节幕]\s*.*$'),
    # Chapter X / CHAPTER X
    re.compile(r'^(?:Chapter|CHAPTER)\s*\d+.*$', re.IGNORECASE),
    # 序章/终章/尾声/楔子/番外
    re.compile(r'^(?:序章|终章|尾声|楔子|番外|后记|前言|引子|幕间)\s*.*$'),
]


def is_chapter_title(line):
    """判断一行是否为章节标题"""
    stripped = line.strip()
    if not stripped or len(stripped) > 100:
        return False
    for pattern in CHAPTER_PATTERNS:
        if pattern.match(stripped):
            return True
    return False


def split_single_file(filepath, encoding='utf-8'):
    """从单个 txt 文件中按章节标题分割。
    
    返回 [(章节标题, 章节内容), ...]
    """
    # 尝试不同编码读取
    content = None
    for enc in [encoding, 'utf-8', 'gbk', 'gb18030', 'utf-8-sig']:
        try:
            with open(filepath, 'r', encoding=enc) as f:
                content = f.read()
            break
        except (UnicodeDecodeError, UnicodeError):
            continue
    
    if content is None:
        print(f"  [错误] 无法读取文件: {filepath}")
        return []
    
    lines = content.split('\n')
    chapters = []
    current_title = None
    current_lines = []
    
    for line in lines:
        if is_chapter_title(line):
            # 保存前一章
            if current_title is not None:
                # 使用双换行符连接段落，确保 Markdown 正确渲染为新段落
                body = '\n\n'.join([line.strip() for line in current_lines if line.strip()])
                if body:  # 只保存有内容的章节
                    chapters.append((current_title, body))
            current_title = line.strip()
            current_lines = []
        else:
            current_lines.append(line)
    
    # 保存最后一章
    if current_title is not None:
        body = '\n\n'.join([line.strip() for line in current_lines if line.strip()])
        if body:
            chapters.append((current_title, body))
    
    # 如果没有检测到章节标题，把整个文件当作一章
    if not chapters and content.strip():
        # 用文件名作为标题
        title = os.path.splitext(os.path.basename(filepath))[0]
        # 使用双换行符连接段落
        lines = [line.strip() for line in content.split('\n') if line.strip()]
        body = '\n\n'.join(lines)
        chapters.append((title, body))
    
    return chapters


def load_from_directory(dirpath, encoding='utf-8'):
    """从目录中读取每个 txt 文件作为一章。
    
    文件按名称排序，文件名即为章节标题。
    返回 [(章节标题, 章节内容), ...]
    """
    chapters = []
    files = sorted([f for f in os.listdir(dirpath) if f.endswith('.txt')])
    
    if not files:
        print(f"  [错误] 目录中无 .txt 文件: {dirpath}")
        return []
    
    for fname in files:
        filepath = os.path.join(dirpath, fname)
        title = os.path.splitext(fname)[0].strip()
        
        content = None
        for enc in [encoding, 'utf-8', 'gbk', 'gb18030', 'utf-8-sig']:
            try:
                with open(filepath, 'r', encoding=enc) as f:
                    content = f.read().strip()
                break
            except (UnicodeDecodeError, UnicodeError):
                continue
        
        if content is None:
            print(f"  [警告] 无法读取: {fname}，跳过")
            continue
        
        if content:
            chapters.append((title, content))
    
    return chapters


def extract_chapter_order(title, index):
    """从章节标题中提取序号。优先从标题解析，失败则用索引+1。"""
    # 提取阿拉伯数字
    m = re.search(r'第(\d+)[章话回节幕]', title)
    if m:
        return int(m.group(1))
    
    # 提取中文数字
    m = re.search(r'第([零〇一二三四五六七八九十百千]+)[章话回节幕]', title)
    if m:
        return _chinese_to_int(m.group(1))
    
    # Chapter X
    m = re.search(r'(?:Chapter|CHAPTER)\s*(\d+)', title, re.IGNORECASE)
    if m:
        return int(m.group(1))
    
    # 序章 → 0
    if re.match(r'^(?:序章|楔子|前言|引子)', title):
        return 0
    
    # 默认用索引
    return index + 1


def _chinese_to_int(cn):
    """中文数字转阿拉伯数字（支持到9999）"""
    cn_map = {'零': 0, '〇': 0, '一': 1, '二': 2, '三': 3, '四': 4,
              '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
              '百': 100, '千': 1000, '万': 10000}
    
    # 简单处理：纯个位数
    if len(cn) == 1 and cn in cn_map:
        return cn_map[cn]
    
    # 处理十几
    if cn.startswith('十'):
        if len(cn) == 1:
            return 10
        return 10 + cn_map.get(cn[1], 0)
    
    # 通用处理
    result = 0
    current = 0
    for char in cn:
        val = cn_map.get(char, 0)
        if val >= 10:
            if current == 0:
                current = 1
            result += current * val
            current = 0
        else:
            current = val
    result += current
    return result if result > 0 else 1


def sanitize_filename(name):
    """清理文件名中的非法字符"""
    # 替换 Windows 不允许的字符
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    # 移除多余空格
    name = re.sub(r'\s+', ' ', name).strip()
    return name


def create_chapter_md(title, content, series_name, order, date_str, tags, output_dir, preview=False):
    """创建单章的 Markdown 文件"""
    # 文件名：补零的章节号 + 标题
    safe_title = sanitize_filename(title)
    filename = f"{safe_title}.md"
    filepath = os.path.join(output_dir, filename)
    
    # 处理标签
    tags_str = '["小说"'
    if tags:
        for t in tags:
            tags_str += f', "{t.strip()}"'
    tags_str += ']'
    
    # 转义标题中的引号
    escaped_title = title.replace('"', '\\"')
    
    # 构建 frontmatter
    # 只有第一章显示在列表中，其他章节隐藏
    is_hidden = "true" if order > 1 else "false"
    
    frontmatter = f'''---
title: "{escaped_title}"
published: {date_str}
category: "小说"
series: '{series_name}'
seriesOrder: {order}
tags: {tags_str}
hidden: {is_hidden}
---

{content}
'''
    
    if not preview:
        os.makedirs(output_dir, exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(frontmatter)
    
    return filepath


def main():
    parser = argparse.ArgumentParser(description='小说批量导入脚本')
    parser.add_argument('--input', '-i', required=True, help='输入文件路径（txt 文件或目录）')
    parser.add_argument('--name', '-n', required=True, help='小说名称（用于 series 字段和文件夹名）')
    parser.add_argument('--date', '-d', default=None, help='发布日期，格式 YYYY-MM-DD（默认今天）')
    parser.add_argument('--tags', '-t', default='', help='额外标签，逗号分隔')
    parser.add_argument('--encoding', '-e', default='utf-8', help='输入文件编码（默认 utf-8）')
    parser.add_argument('--preview', action='store_true', help='预览模式，不写入文件')
    
    args = parser.parse_args()
    
    # 处理日期
    date_str = args.date or datetime.date.today().isoformat()
    
    # 处理标签
    tags = [t.strip() for t in args.tags.split(',') if t.strip()] if args.tags else []
    
    # 输出目录
    output_dir = os.path.join(POSTS_DIR, 'novels', sanitize_filename(args.name))
    
    print(f"\n{'='*60}")
    print(f"  小说导入工具")
    print(f"{'='*60}")
    print(f"  小说名: {args.name}")
    print(f"  输入: {args.input}")
    print(f"  输出: {output_dir}")
    print(f"  日期: {date_str}")
    print(f"  标签: {['小说'] + tags}")
    if args.preview:
        print(f"  模式: 预览（不写入文件）")
    print(f"{'='*60}\n")
    
    # 读取章节
    input_path = args.input
    if os.path.isdir(input_path):
        print(f"  [目录模式] 从目录读取章节文件...")
        chapters = load_from_directory(input_path, args.encoding)
    elif os.path.isfile(input_path):
        print(f"  [单文件模式] 自动检测章节标题...")
        chapters = split_single_file(input_path, args.encoding)
    else:
        print(f"  [错误] 路径不存在: {input_path}")
        sys.exit(1)
    
    if not chapters:
        print(f"  [错误] 未检测到任何章节！")
        sys.exit(1)
    
    print(f"  检测到 {len(chapters)} 个章节\n")
    
    # 生成文件
    created = 0
    for idx, (title, content) in enumerate(chapters):
        order = extract_chapter_order(title, idx)
        filepath = create_chapter_md(
            title=title,
            content=content,
            series_name=args.name,
            order=order,
            date_str=date_str,
            tags=tags,
            output_dir=output_dir,
            preview=args.preview
        )
        
        # 输出章节信息
        content_preview = content[:50].replace('\n', ' ')
        status = "[预览]" if args.preview else "[已创建]"
        print(f"  {status} #{order:>4d} | {title}")
        if idx < 5 or idx >= len(chapters) - 2:
            print(f"         {content_preview}...")
        elif idx == 5:
            print(f"         ... (省略中间章节) ...")
        created += 1
    
    print(f"\n{'='*60}")
    if args.preview:
        print(f"  预览完成！共 {created} 章")
        print(f"  要实际导入，去掉 --preview 参数即可")
    else:
        print(f"  导入完成！共创建 {created} 个 Markdown 文件")
        print(f"  文件位置: {output_dir}")
    print(f"{'='*60}\n")


if __name__ == '__main__':
    main()
