[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'Stop'
$base = 'c:\Users\fmfmf\OneDrive\デスクトップ\AIプロダクト\2nd-Brain'

$targets = @{
    '00' = 'TMP_00_システム・運用ルール'
    '01' = 'TMP_01_日誌・スケジュール'
    '02' = 'TMP_02_プロジェクト管理'
    '03' = 'TMP_03_知識ベース・学び'
    '05' = 'TMP_05_音声データ'
    '99' = 'TMP_99_SandBox・一時退避所'
}

# Create temp directories
foreach ($t in $targets.Values) { New-Item -ItemType Directory -Force -Path (Join-Path $base $t) | Out-Null }

function Move-Safe($src, $dst) {
    # If $src is a path string, we process it. If it's an array, process each.
    $srcPath = Join-Path $base $src
    $dstPath = Join-Path $base $dst
    if (Test-Path $srcPath) {
        if ((Get-Item $srcPath) -is [System.IO.DirectoryInfo]) {
            Get-ChildItem -Path $srcPath -Force | ForEach-Object { try { Move-Item -Path $_.FullName -Destination $dstPath -Force } catch {} }
        }
        else {
            try { Move-Item -Path $srcPath -Destination $dstPath -Force } catch {}
        }
    }
}

# 00 システム
Move-Safe '00_システム' $targets['00']
Move-Safe '初期セットアップ.md' $targets['00']
Move-Safe '説明書_Second_Brain.md' $targets['00']

# 01 日誌・スケジュール
Move-Safe '05_日誌' $targets['01']
Move-Safe '06_Schedule' $targets['01']
Get-ChildItem -Path $base -File -Force | Where-Object { $_.Name -match '^\d{4}-\d{2}-\d{2}\.md$' } | ForEach-Object {
    try { Move-Item -Path $_.FullName -Destination (Join-Path $base $targets['01']) -Force } catch {}
}

# 02 プロジェクト管理
Move-Safe '01_プロジェクト' $targets['02']

# 03 知識ベース・学び
Move-Safe '03_知識ベース' $targets['03']
Move-Safe '99_虎の巻_大人の学び直し' $targets['03']
Move-Safe 'note' $targets['03']

# 05 音声データ
Move-Safe '02_音声' $targets['05']

# 99 SandBox・一時退避所
Move-Safe '99_Sbox' $targets['99']
Move-Safe 'Untitled*' $targets['99']
Move-Safe '無題のファイル*' $targets['99']

# Outlier: images directly in root (1294 files) -> moving to 04_アウトプット/99_画像・素材まとめ
$outboxImages = 'c:\Users\fmfmf\OneDrive\デスクトップ\AIプロダクト\2nd-Brain\04_アウトプット\99_画像・素材まとめ'
$srcImgPath = Join-Path $base '画像'
if (Test-Path $srcImgPath) {
    if ((Get-Item $srcImgPath) -is [System.IO.DirectoryInfo]) {
        Get-ChildItem -Path $srcImgPath -Force | ForEach-Object { try { Move-Item -Path $_.FullName -Destination $outboxImages -Force } catch {} }
    }
}

# Cleanup empty old dirs
$oldDirs = @('00_システム', '05_日誌', '06_Schedule', '01_プロジェクト', '03_知識ベース', '99_虎の巻_大人の学び直し', 'note', '02_音声', '99_Sbox', '画像', '無題のフォルダ')
foreach ($dir in $oldDirs) {
    $dPath = Join-Path $base $dir
    if (Test-Path $dPath) {
        $filesAndDirs = Get-ChildItem -Path $dPath -Recurse -Force
        if ($filesAndDirs.Count -eq 0 -or ($filesAndDirs | Where-Object { -not $_.PSIsContainer }).Count -eq 0) {
            Remove-Item -Path $dPath -Recurse -Force
        }
        else {
            Write-Host "WARNING: $dir is not empty"
        }
    }
}

# Rename temporary directories to final names
Rename-Item -Path (Join-Path $base $targets['00']) -NewName '00_システム・運用ルール' -Force
Rename-Item -Path (Join-Path $base $targets['01']) -NewName '01_日誌・スケジュール' -Force
Rename-Item -Path (Join-Path $base $targets['02']) -NewName '02_プロジェクト管理' -Force
Rename-Item -Path (Join-Path $base $targets['03']) -NewName '03_知識ベース・学び' -Force
Rename-Item -Path (Join-Path $base $targets['05']) -NewName '05_音声データ' -Force
Rename-Item -Path (Join-Path $base $targets['99']) -NewName '99_SandBox・一時退避所' -Force

$finalCount = (Get-ChildItem -Path $base -Recurse -File -Force).Count
Write-Host "Done. Final total file count: $finalCount"
