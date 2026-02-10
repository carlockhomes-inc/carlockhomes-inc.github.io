
from PIL import Image, ImageOps, ImageDraw, ImageFilter, ImageFont
import os
import glob

# Paths
base_dir = r"c:/Users/fmfmf/OneDrive/デスクトップ/AIプロダクト/2nd-Brain/04_アウトプット/99_Images"
output_name = "collage_17th_birthday_v3.png"

def create_polaroid(img_path, caption="", angle=0):
    try:
        img = Image.open(img_path)
    except:
        return None
        
    # Handle orientation
    img = ImageOps.exif_transpose(img)

    # Resize keeping aspect ratio, crop to square-ish
    target_size = (800, 800)
    img_ratio = img.width / img.height
    
    if img_ratio > 1:
        # Landscape
        new_height = target_size[1]
        new_width = int(new_height * img_ratio)
    else:
        # Portrait
        new_width = target_size[0]
        new_height = int(new_width / img_ratio)
        
    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    # Center crop
    left = (new_width - target_size[0])/2
    top = (new_height - target_size[1])/2
    right = (new_width + target_size[0])/2
    bottom = (new_height + target_size[1])/2
    img = img.crop((left, top, right, bottom))
    
    # Polaroid Base
    border_top_side = 40
    border_bottom = 160
    
    p_w = target_size[0] + border_top_side * 2
    p_h = target_size[1] + border_top_side + border_bottom
    
    polaroid = Image.new("RGBA", (p_w, p_h), (255, 255, 255, 255))
    polaroid.paste(img, (border_top_side, border_top_side))
    
    # Add light border/shadow
    draw = ImageDraw.Draw(polaroid)
    draw.rectangle([0,0, p_w-1, p_h-1], outline=(220,220,220), width=2)
    
    # Add Caption if possible (simple text)
    # Skipping complex text rendering for now to avoid font issues, focusing on visuals
    
    # Rotate
    polaroid = polaroid.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    
    return polaroid

# Find Images
# 1. Baby Photo: DSC_0099.JPG
baby_photo_path = os.path.join(base_dir, "DSC_0099.JPG")

# 2. Box Photo: Look for the most recent PXL file from 2026/02/06
# Using glob to find recent PXL files
pxl_files = glob.glob(os.path.join(base_dir, "PXL_20260206*.jpg"))
if not pxl_files:
     # Fallback to any recent PXL
    pxl_files = glob.glob(os.path.join(base_dir, "PXL_*.jpg"))
    pxl_files.sort(key=os.path.getmtime, reverse=True)

box_photo_path = pxl_files[0] if pxl_files else None

# Check existence
if not os.path.exists(baby_photo_path):
    print(f"Baby photo not found at {baby_photo_path}")
    # Try finding any DSC file as fallback
    dsc_files = glob.glob(os.path.join(base_dir, "DSC_*.JPG"))
    if dsc_files:
        baby_photo_path = dsc_files[0]

if not box_photo_path or not os.path.exists(box_photo_path):
    print("Box photo not found")
    exit()

print(f"Using Baby Photo: {os.path.basename(baby_photo_path)}")
print(f"Using Box Photo: {os.path.basename(box_photo_path)}")

# Create Polaroids
pol_baby = create_polaroid(baby_photo_path, angle=-10)
pol_box = create_polaroid(box_photo_path, angle=6)

# Canvas
canvas_w = 1920
canvas_h = 1080
bg_color = (245, 245, 240, 255) # Off-white background
canvas = Image.new("RGBA", (canvas_w, canvas_h), bg_color)

# Paste
# Baby on left, Box on right
if pol_baby:
    # Resize if too huge
    pol_baby.thumbnail((800, 800))
    canvas.paste(pol_baby, (100, 150), pol_baby)

if pol_box:
    pol_box.thumbnail((800, 800))
    canvas.paste(pol_box, (800, 120), pol_box)

# Add "17 Years" text graphic (Simple drawing)
draw = ImageDraw.Draw(canvas)
# Just a connector line or something simple
# draw.line(...) 

# Save
output_path = os.path.join(base_dir, output_name)
canvas = canvas.convert("RGB")
canvas.save(output_path)
print(f"Saved collage to {output_path}")
