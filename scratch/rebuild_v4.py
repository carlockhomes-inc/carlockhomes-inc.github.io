import os
import re

src = r'C:\Users\fmfmf\OneDrive\デスクトップ\AIプロダクト\2nd-Brain\01_採用ハブ_最新\CLH_FINAL_FULL.html'
dst = r'C:\Users\fmfmf\OneDrive\デスクトップ\AIプロダクト\2nd-Brain\topics_v4.html'

with open(src, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Replace Badge
content = content.replace('RECRUIT 2026', 'TOPICS')

# Replace Title
content = re.sub(r'<h1 style="font-size:36px;font-weight:900;line-height:1.4;margin:0 0 16px;">.*?</h1>', 
                 '<h1 style="font-size:28px;font-weight:900;line-height:1.4;margin:0 0 16px;">【特別公開】<br>街のセーフティネット構想</h1>', 
                 content, flags=re.DOTALL)

# Replace Paragraph
content = re.sub(r'<p style="font-size:15px;opacity:\.95;line-height:2;">.*?</p>',
                 '<p style="font-size:14px;opacity:0.95;line-height:1.6;">外部パートナー企業様による特別寄稿。CLHの最新ビジョンと社会貢献の舞台裏に迫ります。</p>',
                 content, flags=re.DOTALL)

# Replace News
content = content.replace('スタッフ平均年齢', 'NEWS')
content = content.replace('45.0歳', '<div style="font-size:16px;font-weight:900;line-height:1.3;text-decoration:underline;cursor:pointer;" onclick="window.open(\'https://shachomeikan.jp/industry_article/5444\', \'_blank\')">弊社代表 上野原が<br>『社長名鑑』に登場！</div>')

with open(dst, 'w', encoding='utf-8') as f:
    f.write(content)

print("V4_REBUILD_SUCCESS")
