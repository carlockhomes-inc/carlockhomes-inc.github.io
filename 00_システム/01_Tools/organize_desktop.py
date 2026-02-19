
import os
import shutil
import datetime

# 🌟 M-Lab デスクトップ整理ツール (Desktop Organizer)
# 
# 【使い方】
# 1. このスクリプトをダブルクリックしてください。
# 2. デスクトップにあるファイルが、自動で「種類別」のフォルダに移動します。
# 3. これでデスクトップは常にピカピカです！✨

# 整理のルール辞書
RULES = {
    "🖼️ Images": [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
    "📄 Documents": [".pdf", ".docx", ".doc", ".txt", ".pptx", ".md"],
    "📊 Spreadsheets": [".xlsx", ".xls", ".csv"],
    "🎵 Media": [".mp3", ".wav", ".mp4", ".mov"],
    "📦 Archives": [".zip", ".rar", ".7z"]
}

def organize_desktop():
    # 🌟 OneDriveのデスクトップを指定（ここが大事！）
    desktop_path = r"C:\Users\fmfmf\OneDrive\デスクトップ"
    
    print(f"🔍 お掃除ターゲット: {desktop_path}")
    
    if not os.path.exists(desktop_path):
        print(f"❌ エラー: デスクトップが見つかりません！パスを確認してください: {desktop_path}")
        return

    # 今日の日付でフォルダを作る（例: 2026-02-19_Sorted）
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    base_folder = os.path.join(desktop_path, f"{today_str}_Sorted")
    
    if not os.path.exists(base_folder):
        os.makedirs(base_folder)
        print(f"📁 整理用フォルダ作成: {base_folder}")

    # ファイルを移動する処理
    for filename in os.listdir(desktop_path):
        src_path = os.path.join(desktop_path, filename)
        
        # フォルダやショートカット(.lnk)は無視する
        if os.path.isdir(src_path) or filename.endswith(".lnk") or filename == f"{today_str}_Sorted":
            continue
            
        file_ext = os.path.splitext(filename)[1].lower()
        
        moved = False
        for folder_name, extensions in RULES.items():
            if file_ext in extensions:
                dest_folder = os.path.join(base_folder, folder_name)
                if not os.path.exists(dest_folder):
                    os.makedirs(dest_folder)
                
                shutil.move(src_path, os.path.join(dest_folder, filename))
                print(f"✅ Moved: {filename} -> {folder_name}")
                moved = True
                break
        
        # ルールにないファイルは「その他」へ
        if not moved:
            other_folder = os.path.join(base_folder, "📂 Others")
            if not os.path.exists(other_folder):
                os.makedirs(other_folder)
            shutil.move(src_path, os.path.join(other_folder, filename))
            print(f"📦 Moved: {filename} -> Others")

if __name__ == "__main__":
    organize_desktop()
