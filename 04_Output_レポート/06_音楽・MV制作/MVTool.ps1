[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "==================================================="
Write-Host "  M-Lab 専用MV自動結合ツール（フェーズ3 - フル機能版）"
Write-Host "==================================================="
Write-Host ""

$baseDir = $PSScriptRoot
$ffmpegPath = Join-Path $baseDir "ffmpeg.exe"
$ffprobePath = Join-Path $baseDir "ffprobe.exe"

if (-not (Test-Path $ffmpegPath) -or -not (Test-Path $ffprobePath)) {
    Write-Host "[1/5] プロ用動画エンジン（FFmpeg/FFprobe）の拡張部品をダウンロードしています..."
    Write-Host "      （※数十秒～数分かかります。そのままお待ちください）"
    Invoke-WebRequest "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip" -OutFile "ffmpeg.zip"
    Expand-Archive ffmpeg.zip -DestinationPath . -Force
    Copy-Item "ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe" ".\ffmpeg.exe" -Force
    Copy-Item "ffmpeg-master-latest-win64-gpl\bin\ffprobe.exe" ".\ffprobe.exe" -Force
    Remove-Item "ffmpeg-master-latest-win64-gpl" -Recurse -Force
    Remove-Item "ffmpeg.zip" -Force
    Write-Host "      準備完了！"
}

Write-Host "[2/5] 動画と曲を探し、各種サイズと時間を分析しています..."
$videoDir = Join-Path $baseDir "01_Hedraの動画を入れる"
$videos = @(Get-ChildItem -Path $videoDir -Filter "*.mp4" | Sort-Object Name)

if ($videos.Count -eq 0) {
    Write-Host "[エラー] 動画が見つかりません！" -ForegroundColor Red
    return
}

$musicDir = Join-Path $baseDir "02_Sunoの曲を入れる"
$musics = @(Get-ChildItem -Path $musicDir | Where-Object { $_.Extension -match "\.(mp3|wav)$" })
if ($musics.Count -eq 0) {
    Write-Host "[エラー] Sunoの曲（MP3 または WAV）が見つかりません！" -ForegroundColor Red
    return
}
$musicPath = $musics[0].FullName

# 各動画の長さを計算して、全体のトータル時間を出す
$totalDuration = 0
foreach ($vid in $videos) {
    $durStr = & $ffprobePath -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $vid.FullName
    if (-not [string]::IsNullOrWhiteSpace($durStr)) {
        $dur = [double]::Parse($durStr, [System.Globalization.CultureInfo]::InvariantCulture)
        $totalDuration += $dur
    }
}
$totalDuration = [Math]::Floor($totalDuration)
$fadeStartTime = $totalDuration - 3
if ($fadeStartTime -lt 0) { $fadeStartTime = 0 }

Write-Host "合計ショート動画時間: 約 $totalDuration 秒"
Write-Host "（※賢いAIが、自動的に最後の3秒間で映像と音楽をフェードアウトさせます！）"

Write-Host ""
Write-Host "==================================================="
Write-Host "[3/5] 💡 【サビ合わせ】音楽の使う部分を指定！"
Write-Host "==================================================="
$rawStartTime = Read-Host "曲の開始時間（例 1:15 または 0:30 など）を入れてEnter（最初からの場合はそのままEnter）"
$startTime = ""
if (-not [string]::IsNullOrWhiteSpace($rawStartTime)) {
    $startTime = $rawStartTime.Trim().Replace("\r", "").Replace("\n", "")
}

Write-Host ""
Write-Host "==================================================="
Write-Host "[4/5] 音楽を必要な長さに切り出しています..."
Write-Host "==================================================="

$tempAudio = Join-Path $baseDir "temp_audio.m4a"
$audioTrimArgs = @("-y")
if (-not [string]::IsNullOrWhiteSpace($startTime)) {
    $audioTrimArgs += "-ss", $startTime
}
# 動画の長さ＋1秒のところまでで音楽をカットする（無駄なエンコードを防ぐ）
$audioTrimArgs += "-t", "$($totalDuration + 1)"
$audioTrimArgs += "-i", $musicPath, "-vn", "-c:a", "aac", $tempAudio

& $ffmpegPath $audioTrimArgs

Write-Host ""
Write-Host "==================================================="
Write-Host "[5/5] 最強の合体（レンダリング）を開始します！！"
Write-Host "==================================================="
Write-Host "（※画角の統一と調整を行うため、完了までしばらくお待ちください...）"

# サイズがバラバラの動画を「1080x1920（TikTok/インスタ縦型サイズ）」に合わせる複雑な呪文（フィルタ）を生成
$filterComplex = ""
$concatInputs = ""
for ($i = 0; $i -lt $videos.Count; $i++) {
    $filterComplex += "[$($i):v]fps=30,scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1[v$i]; "
    $concatInputs += "[v$i]"
}
$filterComplex += "$($concatInputs)concat=n=$($videos.Count):v=1:a=0[vcat]; "
$filterComplex += "[vcat]fade=t=out:st=$($fadeStartTime):d=3[vout]; "

# 音楽のフェードアウト処理を追加
$audioIndex = $videos.Count
$filterComplex += "[$($audioIndex):a]afade=t=out:st=$($fadeStartTime):d=3[aout]"

$processArgs = @("-y")
foreach ($vid in $videos) {
    $processArgs += "-i", $vid.FullName
}
$processArgs += "-i", $tempAudio
$processArgs += "-filter_complex", $filterComplex
$processArgs += "-map", "[vout]", "-map", "[aout]"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outputFile = "完成したMV_$timestamp.mp4"

$processArgs += "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", "-shortest", $outputFile

& $ffmpegPath $processArgs

if (Test-Path $tempAudio) { Remove-Item $tempAudio -Force }

Write-Host ""
Write-Host "==================================================="
Write-Host "  完成しました！！！"
Write-Host "  このフォルダの中にある「$outputFile」を確認してください！"
Write-Host "==================================================="
