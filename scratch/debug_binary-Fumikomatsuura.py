import os
path = r'01_採用ハブ_最新\CLH_FINAL_FULL.html'
if not os.path.exists(path):
    print(f"PATH_NOT_FOUND: {path}")
else:
    with open(path, 'rb') as f:
        raw = f.read()
        idx = raw.find(b'RECRUIT 2026')
        if idx != -1:
            print(f"FOUND_AT: {idx}")
            snippet = raw[idx-300:idx+600]
            print(snippet)
        else:
            print("NOT_FOUND_IN_BINARY")
