
from PIL import Image, ImageDraw, ImageFont, ImageOps
import os

# Paths
base_dir = r"c:/Users/fmfmf/OneDrive/デスクトップ/AIプロダクト/2nd-Brain/04_アウトプット/99_Images"
output_name = "thumbnail_ai_sorting_magic.png"

# Canvas Settings
width = 1200
height = 630
bg_color = (255, 255, 255) # White

canvas = Image.new("RGB", (width, height), bg_color)
draw = ImageDraw.Draw(canvas)

# 1. Background Gradient (Subtle Blue/Teal for "Tech/Clean" feel)
for y in range(height):
    r = 240
    g = 248 - int(y * 0.05)
    b = 255
    draw.line([(0, y), (width, y)], fill=(r, g, b))

# 2. Add "Before" Representation (Messy Files)
# Draw random overlapping rectangles with "DSC..." text
font_path = "C:/Windows/Fonts/arial.ttf"
try:
    font_small = ImageFont.truetype("meiryo.ttc", 14)
    font_large_bold = ImageFont.truetype("meiryo.ttc", 60)
    font_medium = ImageFont.truetype("meiryo.ttc", 30)
except:
    font_small = ImageFont.load_default()
    font_large_bold = ImageFont.load_default()
    font_medium = ImageFont.load_default()

import random
for i in range(15):
    x = random.randint(50, 400)
    y = random.randint(100, 500)
    w = 80
    h = 60
    draw.rectangle([x, y, x+w, y+h], fill=(220, 220, 220), outline=(150,150,150))
    draw.text((x+5, y+20), "DSC...", fill=(100,100,100), font=font_small)

# 3. Add "After" Representation (Neat Folders)
# Draw neatly stacked folder icons (yellow rectangles)
start_x = 750
start_y = 150
for i in range(3):
    y = start_y + i * 120
    # Folder body
    draw.rectangle([start_x, y, start_x+300, y+80], fill=(255, 220, 100), outline=(200, 180, 50))
    # Folder tab
    draw.rectangle([start_x, y-15, start_x+100, y], fill=(255, 220, 100), outline=(200, 180, 50))
    
    # Text
    year = 2010 + i * 5
    draw.text((start_x+20, y+20), f"📂 {year}年", fill=(50,50,50), font=font_medium)
    draw.text((start_x+150, y+30), "sorted!", fill=(0,150,0), font=font_small)

# 4. Arrow and "AI Magic" Text
# Arrow
draw.line([(450, 315), (700, 315)], fill=(50, 50, 50), width=5)
draw.polygon([(700, 315), (680, 300), (680, 330)], fill=(50, 50, 50))

# Title Text
title_text = "AIが一瞬で写真整理！？"
sub_text = "「あの写真どこ？」が3秒で解決。"

# Draw Title (Centered top)
# Using simple estimation for center
draw.text((300, 50), title_text, fill=(0, 0, 0), font=font_large_bold)
draw.text((350, 550), sub_text, fill=(50, 50, 50), font=font_medium)

# Save
output_path = os.path.join(base_dir, output_name)
canvas.save(output_path)
print(f"Saved thumbnail to {output_path}")
