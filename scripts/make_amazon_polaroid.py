
from PIL import Image, ImageOps, ImageDraw, ImageFont
import os

# Paths
base_dir = r"c:/Users/fmfmf/OneDrive/デスクトップ/AIプロダクト/2nd-Brain/04_アウトプット/99_Images"
screenshot_name = "スクリーンショット 2026-02-06 234944.png"
output_name = "amazon_sale_polaroid.png"

# Load Image
img_path = os.path.join(base_dir, screenshot_name)
if not os.path.exists(img_path):
    print(f"Error: {img_path} not found.")
    exit()

img = Image.open(img_path)

# Resize to reasonable size if too big
max_size = (800, 800)
img.thumbnail(max_size, Image.Resampling.LANCZOS)

# Polaroid Border Settings
border_top_side = 20
border_bottom = 100
border_color = "white"

# Add Border
# ImageOps.expand adds equal borders, so we do it manually for unequal bottom
w, h = img.size
new_w = w + border_top_side * 2
new_h = h + border_top_side + border_bottom

polaroid = Image.new("RGB", (new_w, new_h), border_color)
polaroid.paste(img, (border_top_side, border_top_side))

# Add Text
draw = ImageDraw.Draw(polaroid)
try:
    # Try to load a font, fall back to default
    font = ImageFont.truetype("arial.ttf", 36)
except IOError:
    font = ImageFont.load_default()

text = "Fate! 29,800 yen"
text_bbox = draw.textbbox((0, 0), text, font=font)
text_w = text_bbox[2] - text_bbox[0]
text_h = text_bbox[3] - text_bbox[1]

# Center text in the bottom area
text_x = (new_w - text_w) // 2
text_y = h + border_top_side + (border_bottom - text_h) // 2

# Draw text (black or dark gray)
draw.text((text_x, text_y), text, fill=(50, 50, 50), font=font)

# Save
output_path = os.path.join(base_dir, output_name)
polaroid.save(output_path)
print(f"Saved polaroid to {output_path}")
