
import os
import shutil
import time
from PIL import Image
from datetime import datetime

# Paths
source_dir = r"c:/Users/fmfmf/OneDrive/デスクトップ/AIプロダクト/2nd-Brain/04_アウトプット/99_Images"
dest_base_dir = r"c:/Users/fmfmf/OneDrive/デスクトップ/AIプロダクト/2nd-Brain/04_アウトプット/99_Images/Sorted_By_Date"

def get_date_taken(path):
    """画像から撮影日時を取得する。取得できない場合は更新日時を返す。"""
    try:
        img = Image.open(path)
        # 36867 is the Exif tag for DateTimeOriginal
        exif = img._getexif()
        if exif:
            date_str = exif.get(36867)
            if date_str:
                # Format: YYYY:MM:DD HH:MM:SS
                return datetime.strptime(date_str, "%Y:%m:%d %H:%M:%S")
    except Exception:
        pass
    
    # Fallback to file modification time
    timestamp = os.path.getmtime(path)
    return datetime.fromtimestamp(timestamp)

def organize_photos():
    print(f"Start organizing photos from {source_dir}...")
    
    if not os.path.exists(dest_base_dir):
        os.makedirs(dest_base_dir)
        
    files = [f for f in os.listdir(source_dir) if os.path.isfile(os.path.join(source_dir, f))]
    count = 0
    
    for filename in files:
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            src_path = os.path.join(source_dir, filename)
            
            # Get date
            date_taken = get_date_taken(src_path)
            
            # Create Year/Month Folder
            year_str = date_taken.strftime("%Y")
            month_str = date_taken.strftime("%m")
            dest_dir = os.path.join(dest_base_dir, year_str, month_str)
            
            if not os.path.exists(dest_dir):
                os.makedirs(dest_dir)
                
            # Create new filename: YYYYMMDD_HHMMSS_OriginalName
            date_prefix = date_taken.strftime("%Y%m%d_%H%M%S")
            new_filename = f"{date_prefix}_{filename}"
            dest_path = os.path.join(dest_dir, new_filename)
            
            # Copy file (Don't delete original for safety)
            try:
                shutil.copy2(src_path, dest_path)
                count += 1
                print(f"Copied: {filename} -> {year_str}/{month_str}/{new_filename}")
            except Exception as e:
                print(f"Error copying {filename}: {e}")
                
    print(f"Finished! Organized {count} photos into {dest_base_dir}")

if __name__ == "__main__":
    organize_photos()
