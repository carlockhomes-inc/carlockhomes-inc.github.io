
import os
import moviepy.editor as mp

def extract_audio(video_path, output_path):
    print(f"Extracting audio from {video_path}...")
    clip = mp.VideoFileClip(video_path)
    clip.audio.write_audiofile(output_path)
    clip.close()
    print(f"Finished! Audio saved to {output_path}")

if __name__ == "__main__":
    v_path = r"c:\Users\fmfmf\OneDrive\デスクトップ\AIプロダクト\2nd-Brain\02_音声\20220529_130113.mp4"
    o_path = r"c:\Users\fmfmf\OneDrive\デスクトップ\AIプロダクト\2nd-Brain\02_音声\processed\20220529_130113.wav"
    
    if os.path.exists(v_path):
        extract_audio(v_path, o_path)
    else:
        print("Video file not found.")
