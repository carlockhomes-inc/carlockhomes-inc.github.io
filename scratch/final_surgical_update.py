import sys
import re
import os
import shutil

src = r'01_採用ハブ_最新\CLH_FINAL_FULL.html'
dst = r'01_採用ハブ_最新\CLH_PROPOSAL_TOPICS.html'

# 1. Byte-level Reset
shutil.copy2(src, dst)

# 2. UTF-8 Read (the most safe for web)
with open(dst, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# 3. Surgical Replacement using Regex (WITH DOTALL TO MATCH NEWLINES)
# Badge
content = re.sub(
    r'(<div\s+style="display:inline-block;background:#fff;color:#FF4444;padding:6px 20px;border-radius:100px;font-size:12px;font-weight:900;margin-bottom:20px;">).*?(</div>)',
    r'\1TOPICS\2',
    content,
    flags=re.DOTALL
)

# Title
content = re.sub(
    r'(<h1 style="font-size:36px;font-weight:900;line-height:1.4;margin:0 0 16px;">).*?(</h1>)',
    r'<h1 style="font-size:28px;font-weight:900;line-height:1.4;margin:0 0 16px;">【特別公開】<br>街のセーフティネット構想</h1>',
    content,
    flags=re.DOTALL
)

# Paragraph
content = re.sub(
    r'(<p style="font-size:15px;opacity:\.95;line-height:2;">).*?(</p>)',
    r'<p style="font-size:14px;opacity:0.95;line-height:1.6;">外部パートナー企業様による特別寄稿。CLHの最新ビジョンと社会貢献の舞台裏に迫ります。</p>',
    content,
    flags=re.DOTALL
)

# Yellow Box (News)
content = re.sub(
    r'(<div style="font-size:13px;font-weight:900;opacity:\.8;">).*?(</div>)',
    r'\1NEWS\2',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'(<div style="font-size:32px;font-weight:900;">).*?(</div>)',
    r'<div style="font-size:16px;font-weight:900;line-height:1.3;text-decoration:underline;cursor:pointer;" onclick="window.open(\'https://shachomeikan.jp/industry_article/5444\', \'_blank\')">弊社代表 上野原が<br>『社長名鑑』に登場！</div>',
    content,
    flags=re.DOTALL
)

# 4. UTF-8 Write (No BOM)
with open(dst, 'w', encoding='utf-8') as f:
    f.write(content)

print('SUCCESS_SURGICAL_FIX_FINAL')
