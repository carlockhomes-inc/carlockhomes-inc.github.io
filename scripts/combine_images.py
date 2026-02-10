from PIL import Image, ImageOps
import os

# 画像のパス
image_paths = [
    r"C:/Users/fmfmf/.gemini/antigravity/brain/cdced3b7-4700-49af-a88d-8d10db431ebe/uploaded_media_0_1770004476873.jpg",
    r"C:/Users/fmfmf/.gemini/antigravity/brain/cdced3b7-4700-49af-a88d-8d10db431ebe/uploaded_media_1_1770004476873.jpg",
    r"C:/Users/fmfmf/.gemini/antigravity/brain/cdced3b7-4700-49af-a88d-8d10db431ebe/uploaded_media_2_1770004476873.jpg",
    r"C:/Users/fmfmf/.gemini/antigravity/brain/cdced3b7-4700-49af-a88d-8d10db431ebe/uploaded_media_3_1770004476873.jpg"
]

# 出力先
output_dir = r"c:\Users\fmfmf\OneDrive\デスクトップ\AIプロダクト\2nd-Brain\04_アウトプット\05_Instagram"
output_path = os.path.join(output_dir, "combined_lunch_post.jpg")

# 1枚あたりのサイズ (Instagram向けの正方形)
target_size = (1080, 1080)

def process_image(img_path):
    try:
        img = Image.open(img_path)
        # 中央で正方形にクロップしてリサイズ
        img = ImageOps.fit(img, target_size, method=Image.Resampling.LANCZOS)
        return img
    except Exception as e:
        print(f"Error processing {img_path}: {e}")
        return None

# 画像を読み込んで処理
images = [process_image(p) for p in image_paths]
images = [img for img in images if img is not None]

if len(images) == 4:
    # 2x2 のキャンバスを作成
    # 間に少し余白を入れる (例えば20px)
    padding = 20
    canvas_width = target_size[0] * 2 + padding * 3
    canvas_height = target_size[1] * 2 + padding * 3
    
    # 背景は白
    canvas = Image.new('RGB', (canvas_width, canvas_height), (255, 255, 255))
    
    # 配置
    canvas.paste(images[0], (padding, padding))
    canvas.paste(images[1], (target_size[0] + padding * 2, padding))
    canvas.paste(images[2], (padding, target_size[1] + padding * 2))
    canvas.paste(images[3], (target_size[0] + padding * 2, target_size[1] + padding * 2))
    
    # 保存
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    canvas.save(output_path, quality=95)
    print(f"Image saved to: {output_path}")
else:
    print(f"Error: Expected 4 images, processed {len(images)}")
