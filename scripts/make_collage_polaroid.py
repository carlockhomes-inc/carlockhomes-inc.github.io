
from PIL import Image, ImageOps, ImageDraw, ImageFilter
import os
import random
import math

# Paths
base_dir = r"c:/Users/fmfmf/OneDrive/デスクトップ/AIプロダクト/2nd-Brain/04_アウトプット/99_Images"
output_name = "collage_past_and_future.png"

# Helper to find images
def find_images(directory):
    files = [f for f in os.listdir(directory) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    new_candidates = [f for f in files if "20260206" in f or "260206" in f]
    old_candidates = [f for f in files if f not in new_candidates and "amazon" not in f.lower()]
    
    # Sort by size (assuming main photos are larger)
    new_candidates.sort(key=lambda x: os.path.getsize(os.path.join(directory, x)), reverse=True)
    old_candidates.sort(key=lambda x: os.path.getsize(os.path.join(directory, x)), reverse=True)
    
    # Select best guess
    # New: Largest file with today's date
    img_new = new_candidates[0] if new_candidates else None
    
    # Old: Look for 'DSC' or just largest old file
    dsc_files = [f for f in old_candidates if "dsc" in f.lower()]
    img_old = dsc_files[0] if dsc_files else (old_candidates[0] if old_candidates else None)
    
    return img_old, img_new

# Helper to make polaroid
def create_polaroid(img_path, caption=""):
    try:
        img = Image.open(img_path)
    except:
        return None
        
    # Resize keeping aspect ratio
    target_size = (600, 600)
    img.thumbnail(target_size, Image.Resampling.LANCZOS)
    
    # Settings
    border_top_side = 30
    border_bottom = 120
    border_color = (255, 255, 255)
    
    w, h = img.size
    new_w = w + border_top_side * 2
    new_h = h + border_top_side + border_bottom
    
    # Create base
    polaroid = Image.new("RGBA", (new_w, new_h), border_color)
    polaroid.paste(img, (border_top_side, border_top_side))
    
    # Add shadow/border line effect manually (grey border)
    draw = ImageDraw.Draw(polaroid)
    draw.rectangle([0, 0, new_w-1, new_h-1], outline=(220, 220, 220), width=1)
    
    return polaroid

# Main process
old_file, new_file = find_images(base_dir)
print(f"Old Image selected: {old_file}")
print(f"New Image selected: {new_file}")

if not old_file or not new_file:
    print("Could not find suitable images.")
    exit()

pol_old = create_polaroid(os.path.join(base_dir, old_file))
pol_new = create_polaroid(os.path.join(base_dir, new_file))

if not pol_old or not pol_new:
    print("Failed to process images.")
    exit()

# Canvas
canvas_w = 1200
canvas_h = 900
canvas = Image.new("RGBA", (canvas_w, canvas_h), (240, 240, 240, 0)) # Transparent background

# Rotate and place
# Old photo on left, tilted left
pol_old = pol_old.rotate(5, expand=True, resample=Image.Resampling.BICUBIC)
# New photo on right, tilted right, overlapping
pol_new = pol_new.rotate(-5, expand=True, resample=Image.Resampling.BICUBIC)

# Positions
x_old = 50
y_old = 50
x_new = 500
y_new = 100

canvas.paste(pol_old, (x_old, y_old), pol_old)
canvas.paste(pol_new, (x_new, y_new), pol_new)

# Save
output_path = os.path.join(base_dir, output_name)
canvas.save(output_path)
print(f"Saved collage to {output_path}")
