import sys
import shutil

src = r'01_採用ハブ_最新\CLH_FINAL_FULL.html'
dst = r'01_採用ハブ_最新\CLH_TOPICS_V1.html'

# Copy clean production
shutil.copy2(src, dst)

with open(dst, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

# Red Box
lines[678] = '              TOPICS</div>\n'
lines[679] = '            <h1 style="font-size:28px;font-weight:900;line-height:1.4;margin:0 0 16px;">【特別公開】<br>街のセーフティネット構想</h1>\n'
lines[680] = '            <p style="font-size:14px;opacity:.95;line-height:1.6;">外部パートナー企業様による特別寄稿。CLHの最新ビジョンと社会貢献の舞台裏に迫ります。</p>\n'

# Yellow Box
lines[687] = '                <div style="font-size:13px;font-weight:900;opacity:.8;">NEWS</div>\n'
lines[688] = '                <div style="font-size:16px;font-weight:900;line-height:1.3;text-decoration:underline;cursor:pointer;" onclick="window.open(\'https://shachomeikan.jp/industry_article/5444\', \'_blank\')">弊社代表 上野原が<br>『社長名鑑』に登場！</div>\n'

with open(dst, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("FILE_CREATED: CLH_TOPICS_V1.html")
