import sys
import re

src = r'01_採用ハブ_最新\CLH_FINAL_FULL.html'
dst = r'01_採用ハブ_最新\CLH_PROPOSAL_TOPICS.html'

# Try reading as Shift-JIS (cp932)
try:
    with open(src, 'r', encoding='cp932') as f:
        content = f.read()
    print('READ_SUCCESS: CP932')
except Exception as e:
    print(f'READ_FAILED_CP932: {e}')
    # Try UTF-8 as fallback
    with open(src, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    print('READ_SUCCESS: UTF-8 (Fallback)')

# 1. Update Hero Section (Title & Paragraph)
# We use regex to find the elements to avoid dependency on exact text if it was mangled
content = re.sub(r'<div style="display:inline-block;background:#fff;color:#FF4444;padding:6px 20px;border-radius:100px;font-size:12px;font-weight:900;margin-bottom:20px;">.*?</div>',
                 '<div style="display:inline-block;background:#fff;color:#FF4444;padding:6px 20px;border-radius:100px;font-size:12px;font-weight:900;margin-bottom:20px;">TOPICS</div>',
                 content)

content = re.sub(r'<h1 style="font-size:36px;font-weight:900;line-height:1.4;margin:0 0 16px;">.*?</h1>', 
                 '<h1 style="font-size:28px;font-weight:900;line-height:1.4;margin:0 0 16px;">【特別公開】<br>街のセーフティネット構想</h1>', 
                 content)

content = re.sub(r'<p style="font-size:15px;opacity:\.95;line-height:2;">.*?</p>',
                 '<p style="font-size:14px;opacity:0.95;line-height:1.6;">外部パートナー企業様による特別寄稿。CLHの最新ビジョンと社会貢献の舞台裏に迫ります。</p>',
                 content)

# 2. Update Yellow Box (News)
# Searching for the specific padding/color to identify the box
# Target: <div style="font-size:13px;font-weight:900;opacity:.8;">スタッフ平均年齢</div>
content = re.sub(r'<div style="font-size:13px;font-weight:900;opacity:\.8;">.*?</div>',
                 '<div style="font-size:13px;font-weight:900;opacity:0.8;">NEWS</div>',
                 content)

# Target: <div style="font-size:32px;font-weight:900;">45.0歳</div>
content = re.sub(r'<div style="font-size:32px;font-weight:900;">.*?</div>',
                 '<div style="font-size:16px;font-weight:900;line-height:1.3;text-decoration:underline;cursor:pointer;" onclick="window.open(\'https://shachomeikan.jp/industry_article/5444\', \'_blank\')">弊社代表 上野原が<br>『社長名鑑』に登場！</div>',
                 content)

# 3. Save as UTF-8 (Modern Standard)
with open(dst, 'w', encoding='utf-8') as f:
    f.write(content)

print('UPDATE_COMPLETE')
