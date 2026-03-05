[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "==================================================="
Write-Host "  M-Lab 専用: Hedra用・曲を8秒ずつにスライスする魔法 🪄"
Write-Host "==================================================="
Write-Host ""

$baseDir = $PSScriptRoot
$ffmpegPath = Join-Path $baseDir "ffmpeg.exe"

if (-not (Test-Path $ffmpegPath)) {
    Write-Host "[エラー] ffmpeg.exe が見つかりません。先に MVTool.ps1 を一度実行して準備を完了させてください！" -ForegroundColor Red
    pause
    return
}

$musicDir = Join-Path $baseDir "02_Sunoの曲を入れる"
$musics = @(Get-ChildItem -Path $musicDir | Where-Object { $_.Extension -match "\.(mp3|wav|m4a)$" })

if ($musics.Count -eq 0) {
    Write-Host "[エラー] 02_Sunoの曲を入れる フォルダに曲（MP3など）が見つかりません！" -ForegroundColor Yellow
    Write-Host "曲を入れてから、もう一度このツールを実行してください。" -ForegroundColor Yellow
    pause
    return
}

$musicPath = $musics[0].FullName
Write-Host "【対象の曲】: $($musics[0].Name)"

$outputDir = Join-Path $baseDir "03_Hedra用に切った曲"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}
else {
    # 既存のファイルをクリアするかは迷うところだが、今回はそのまま残す（上書き）
}

Write-Host "曲を8秒ごとに切り分けています...（魔法の包丁でスパッと🔪✨）"

# FFmpegを使って8秒ごとに分割 (segment)
$timestamp = Get-Date -Format "HHmmss"
$outputPattern = Join-Path $outputDir "$($musics[0].BaseName)_%03d.mp3"

$processArgs = @(
    "-y",
    "-i", $musicPath,
    "-f", "segment",
    "-segment_time", "8",
    "-c", "copy",
    $outputPattern
)

& $ffmpegPath $processArgs

Write-Host ""
Write-Host "==================================================="
Write-Host "  スライス完了！！！🎉"
Write-Host "  「03_Hedra用に切った曲」フォルダの中に、8秒ごとのピースができました！"
Write-Host "  これを順番にHedraに読み込ませて、画像を動かしてください！"
Write-Host "==================================================="
pause
