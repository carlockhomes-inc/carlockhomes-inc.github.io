import re
import os

path = r'01_採用ハブ_最新\CLH_RECRUIT_TOPICS_PERFECT.html'

with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# 1. Title
content = re.sub(
    r'(<h1.*?font-size:36px;font-weight:900;line-height:1.4;margin:0 0 16px;.*?>).*?(</h1>)',
    r'<h1 style="font-size:28px;font-weight:900;line-height:1.4;margin:0 0 16px;">【特別公開】<br>街のセーフティネット構想</h1>',
    content,
    flags=re.DOTALL
)

# 2. Paragraph
content = re.sub(
    r'(<p.*?opacity:\.95;line-height:2;.*?>).*?(</p>)',
    r'<p style="font-size:14px;opacity:0.95;line-height:1.6;">外部パートナー企業様による特別寄稿。CLHの最新ビジョンと社会貢献の舞台裏に迫ります。</p>',
    content,
    flags=re.DOTALL
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SURGICAL_FIX_DONE")
