
from PIL import Image, ImageOps, ImageDraw, ImageFilter
import os
import glob
import random

# Paths
base_dir = r"c:/Users/fmfmf/OneDrive/デスクトップ/AIプロダクト/2nd-Brain/04_アウトプット/99_Images"
output_name = "collage_17th_birthday_timeline.png"

def create_polaroid(img_path, caption="", angle=0):
    try:
        img = Image.open(img_path)
    except:
        return None
        
    img = ImageOps.exif_transpose(img)

    # Resize keeping aspect ratio, make it look like a photo print
    # Target height 600
    base_h = 600
    ratio = img.width / img.height
    base_w = int(base_h * ratio)
    
    img = img.resize((base_w, base_h), Image.Resampling.LANCZOS)
    
    # Polaroid/Photo Border
    border = 20
    p_w = base_w + border * 2
    p_h = base_h + border * 2
    
    # White background
    polaroid = Image.new("RGBA", (p_w, p_h), (255, 255, 255, 255))
    polaroid.paste(img, (border, border))
    
    # Drop shadow simulation (simple gray border)
    draw = ImageDraw.Draw(polaroid)
    draw.rectangle([0, 0, p_w-1, p_h-1], outline=(200, 200, 200), width=1)
    
    # Rotate
    polaroid = polaroid.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    
    return polaroid

# 1. Identify Files (Heuristic)
files = []

# A. Oldest (Newborn) - DSC_0099.JPG
files.append(os.path.join(base_dir, "DSC_0099.JPG"))

# B. Old (Helmet) - DSC_0255 (2).JPG
files.append(os.path.join(base_dir, "DSC_0255 (2).JPG"))

# C. Middle (Keeper/Retro?) - Try to find something from 2019-2022
# Scanning for dated files
mids = glob.glob(os.path.join(base_dir, "202*.jpg"))
mids.sort()
if mids:
    # Pick one from the middle
    files.append(mids[len(mids)//2]) 
else:
    # Fallback to DSC
    dscs = glob.glob(os.path.join(base_dir, "DSC_*.JPG"))
    dscs.sort()
    if len(dscs) > 2:
        files.append(dscs[2])

# D. Recent (Desk/Box) - PXL_2026...
# Get the absolute latest PXL file
pxls = glob.glob(os.path.join(base_dir, "PXL_*.jpg"))
pxls.sort(key=os.path.getmtime, reverse=True)

# We want 5 photos total.
# 1. Newborn
# 2. Helmet
# 3. Middle 1
# 4. Middle 2
# 5. Latest

# Reset list to fill properly
selected_paths = []

# 1. First: Always DSC_0099 (Newborn)
p1 = os.path.join(base_dir, "DSC_0099.JPG")
if os.path.exists(p1): selected_paths.append(p1)

# 2. Second: DSC_0255 (2) (Helmet)
p2 = os.path.join(base_dir, "DSC_0255 (2).JPG")
if os.path.exists(p2): selected_paths.append(p2)

# 5. Last: Newest PXL
p5 = pxls[0] if pxls else None

# 3 & 4. Fillers
# Get all jpgs
all_jpgs = glob.glob(os.path.join(base_dir, "*.jpg")) + glob.glob(os.path.join(base_dir, "*.JPG"))
# Exclude known ones
excludes = [p1, p2, p5]
pool = [f for f in all_jpgs if f not in excludes]
# Sort by modified time
pool.sort(key=os.path.getmtime)

# Pick two distinct points in the middle of the timeline
if len(pool) >= 2:
    idx1 = len(pool) // 3
    idx2 = (len(pool) * 2) // 3
    selected_paths.append(pool[idx1])
    selected_paths.append(pool[idx2])
elif len(pool) == 1:
    selected_paths.append(pool[0])

# Append Last
if p5: selected_paths.append(p5)

print(f"Selected {len(selected_paths)} photos.")

# Canvas
canvas_w = 2000
canvas_h = 1000 # Landscape strip
canvas = Image.new("RGBA", (canvas_w, canvas_h), (245, 245, 245, 255))

x_offset = 50
y_base = 200

for i, path in enumerate(selected_paths):
    # Oscillate angle
    angle = random.randint(-10, 10)
    pol = create_polaroid(path, angle=angle)
    if pol:
        # Resize to fit 5 across roughly
        # Target width approx 350
        ratio = 350 / pol.width
        new_size = (int(pol.width * ratio), int(pol.height * ratio))
        pol = pol.resize(new_size, Image.Resampling.LANCZOS)
        
        # Stagger Y
        y = y_base + random.randint(-50, 50)
        
        canvas.paste(pol, (x_offset, y), pol)
        x_offset += 300 # Overlap slightly

# Save
output_path = os.path.join(base_dir, output_name)
canvas = canvas.convert("RGB")
canvas.save(output_path)
print(f"Saved timeline collage to {output_path}")
