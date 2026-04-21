import os
import re

src = r'01_採用ハブ_最新\CLH_FINAL_FULL.html'
dst = r'backup_topics\preview_sjis.html'

if not os.path.exists(os.path.dirname(dst)):
    os.makedirs(os.path.dirname(dst))

# Use the last RESTORED CLEAN VERSION we know we have
# Actually, I'll just read the current CLH_FINAL_FULL.html 
# which was hopefully restored by the previous command.
try:
    with open(src, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    print("READ_SUCCESS")
except Exception as e:
    print(f"READ_FAILED: {e}")
    sys.exit(1)

# Apply Updates
content = content.replace('charset="UTF-8"', 'charset="Shift_JIS"')
content = content.replace('RECRUIT 2026', 'TOPICS')

# Surgical Regex
content = re.sub(r'<h1 style="font-size:36px;font-weight:900;line-height:1.4;margin:0 0 16px;">.*?</h1>', 
                 '<h1 style="font-size:28px;font-weight:900;line-height:1.4;margin:0 0 16px;">【特別公開】<br>街のセーフティネット構想</h1>', 
                 content, flags=re.DOTALL)

content = re.sub(r'<p style="font-size:15px;opacity:\.95;line-height:2;">.*?</p>',
                 '<p style="font-size:14px;opacity:0.95;line-height:1.6;">外部パートナー企業様による特別寄稿。CLHの最新ビジョンと社会貢献の舞台裏に迫ります。</p>',
                 content, flags=re.DOTALL)

# Yellow News
content = re.sub(r'<div style="font-size:13px;font-weight:900;opacity:\.8;">.*?</div>',
                 '<div style="font-size:13px;font-weight:900;opacity:0.8;">NEWS</div>',
                 content, flags=re.DOTALL)

content = re.sub(r'<div style="font-size:32px;font-weight:900;">.*?</div>',
                 '<div style="font-size:16px;font-weight:900;line-height:1.3;text-decoration:underline;cursor:pointer;" onclick="window.open(\'https://shachomeikan.jp/industry_article/5444\', \'_blank\')">弊社代表 上野原が<br>『社長名鑑』に登場！</div>',
                 content, flags=re.DOTALL)

# 4. Save as Shift-JIS (cp932)
try:
    with open(dst, 'w', encoding='cp932', errors='replace') as f:
        f.write(content)
    print("FILE_WRITTEN_SUCCESSFULLY")
except Exception as e:
    print(f"WRITE_FAILED: {e}")
