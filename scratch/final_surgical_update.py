import os

# Paths
src_path = r'01_採用ハブ_最新\CLH_FINAL_FULL.html'
dst_path = r'01_採用ハブ_最新\CLH_PROPOSAL_TOPICS.html'

# Read original
with open(src_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Surgical replacements
# 1. Badge
content = content.replace('RECRUIT 2026', 'TOPICS')

# 2. Hero Title
# We use a pattern match to find the specific <h1>
target_title = 'あなたE人生経験、Ebr>活かせる場所があります、E'
# If mojibake or different encoding, we try to match the parts.
if target_title not in content:
    # Try searching for the flex/grid markers around it
    import re
    content = re.sub(r'<h1 style="font-size:36px;font-weight:900;line-height:1.4;margin:0 0 16px;">.*?</h1>', 
                     '<h1 style="font-size:28px;font-weight:900;line-height:1.4;margin:0 0 16px;">【特別公開】<br>街のセーフティネット構想</h1>', 
                     content)
else:
    content = content.replace(target_title, '【特別公開】<br>街のセーフティネット構想')

# 3. Hero Paragraph
target_para = '45、E5代中忁E活躍中。経験E問いません。多様な働き方をご提案します、E'
if target_para not in content:
    content = re.sub(r'<p style="font-size:15px;opacity:\.95;line-height:2;">.*?</p>',
                     '<p style="font-size:14px;opacity:0.95;line-height:1.6;">外部パートナー企業様による特別寄稿。CLHの最新ビジョンと社会貢献の舞台裏に迫ります。</p>',
                     content)
else:
    content = content.replace(target_para, '外部パートナー企業様による特別寄稿。CLHの最新ビジョンと社会貢献の舞台裏に迫ります。')

# 4. Yellow Box
content = content.replace('スタチE平坁E齢', 'NEWS')
content = content.replace('45.0歳', '<div style="font-size:16px;text-decoration:underline;cursor:pointer;" onclick="window.open(\'https://shachomeikan.jp/industry_article/5444\', \'_blank\')">弊社代表 上野原が社長名鑑に登場！</div>')

# Ensure yellow text is readable (some previous versions had color issues)
content = content.replace('background:#FFB800;border-radius:24px;padding:25px 32px;color:#664400;', 'background:#FFB800;border-radius:24px;padding:25px 32px;color:#111;')

# Save as UTF-8 (NO BOM)
with open(dst_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("UPDATE_COMPLETE")
