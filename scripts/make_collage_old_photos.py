
from PIL import Image, ImageOps, ImageDraw, ImageFilter
import os

# Paths
base_dir = r"c:/Users/fmfmf/OneDrive/デスクトップ/AIプロダクト/2nd-Brain/04_アウトプット/99_Images"
output_name = "collage_past_and_future_v2.png"

# Load Images (Hardcoded based on user request)
# 1. Helmet Photo (Old)
img_name_1 = "DSC_0255 (2).JPG"  # Guessing this is helmet based on prev interaction
# 2. Baby Photo (Old)
img_name_2 = "DSC_0099.JPG"      # Guessing this is baby

# But wait, user uploaded MANY files. Let's try to be smarter.
# We will use the 'Helmet' photo and the 'Baby' photo if possible.
# If not sure, we can pick based on file size/date or just take the ones provided.
# Actually, let's use the two oldest distinct high-res photos found.

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

# Explicitly try to find the files that look like the user uploaded ones
# Assuming the user just uploaded them, they might be recent in the folder or have specific names.
# DSC_... usually old camera.
# 2021... 2023... phone photos.

# Let's pick two contrasting 'old' photos from the list provided in the prompt context if possible.
# The user said "Baby" and "Helmet".
# Let's try to use DSC_0255 (2).JPG (Helmet?) and DSC_0099.JPG (Baby?)
# If these fail, we will fallback to the logic of picking distinct old/new.

img_1_path = os.path.join(base_dir, "DSC_0255 (2).JPG")
img_2_path = os.path.join(base_dir, "DSC_0099.JPG")

# Check if they exist
if not os.path.exists(img_1_path):
    # Fallback: Just pick the two largest 'DSC' files
    candidates = [f for f in os.listdir(base_dir) if "DSC" in f]
    candidates.sort(key=lambda x: os.path.getsize(os.path.join(base_dir, x)), reverse=True)
    if len(candidates) >= 2:
        img_1_path = os.path.join(base_dir, candidates[0])
        img_2_path = os.path.join(base_dir, candidates[1])

if not os.path.exists(img_1_path) or not os.path.exists(img_2_path):
    print("Could not find suitable images.")
    exit()

pol_1 = create_polaroid(img_1_path)
pol_2 = create_polaroid(img_2_path)

# Canvas
canvas_w = 1200
canvas_h = 900
canvas = Image.new("RGBA", (canvas_w, canvas_h), (240, 240, 240, 0)) # Transparent

# Rotate and place
pol_1 = pol_1.rotate(8, expand=True, resample=Image.Resampling.BICUBIC)
pol_2 = pol_2.rotate(-8, expand=True, resample=Image.Resampling.BICUBIC)

# Overlap them - Baby (2) behind Helmet (1)? Or side by side.
# Let's put them side by side, slightly overlapping.
canvas.paste(pol_2, (100, 50), pol_2) # Left (Baby?)
canvas.paste(pol_1, (500, 100), pol_1) # Right (Helmet?)

# Save
output_path = os.path.join(base_dir, output_name)
canvas.save(output_path)
print(f"Saved collage to {output_path}")
