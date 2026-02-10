from PIL import Image
import os
import glob

# Source directory (where the uploaded images are)
source_dir = r"C:\Users\fmfmf\.gemini\antigravity\brain\5370ccd8-abe6-4781-aebe-7903f8f480c8"
# Output file
output_path = r"c:\Users\fmfmf\OneDrive\デスクトップ\AIプロダクト\2nd-Brain\04_アウトプット\SNS\Images\TimeSaving_Food_Animation.gif"

# Get all jpg images
image_paths = sorted(glob.glob(os.path.join(source_dir, "*.jpg")))

if not image_paths:
    print("No images found.")
    exit()

images = []
target_size = (800, 800)  # Target size for the GIF

for path in image_paths:
    img = Image.open(path)
    # Resize to fit within 800x800 while maintaining aspect ratio
    img.thumbnail(target_size, Image.Resampling.LANCZOS)
    
    # Create a white background image of target_size to center the photo (instagram style)
    background = Image.new('RGB', target_size, (255, 255, 255))
    
    # Calculate position to center
    bg_w, bg_h = background.size
    img_w, img_h = img.size
    offset = ((bg_w - img_w) // 2, (bg_h - img_h) // 2)
    
    background.paste(img, offset)
    images.append(background)

# Save as GIF
if images:
    images[0].save(
        output_path,
        save_all=True,
        append_images=images[1:],
        duration=1000,  # 1 second per frame
        loop=0
    )
    print(f"GIF created successfully at: {output_path}")
else:
    print("Failed to create GIF.")
