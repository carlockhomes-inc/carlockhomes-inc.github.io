[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "==================================================="
Write-Host "  M-Lab 魔法のお片付けツール（保管庫へ移動）"
Write-Host "==================================================="
Write-Host ""
$baseDir = $PSScriptRoot
$archiveDir = Join-Path $baseDir "03_過去の素材保管庫"
if (-not (Test-Path $archiveDir)) {
    New-Item -ItemType Directory -Path $archiveDir | Out-Null
}
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$targetDir = Join-Path $archiveDir "素材_$timestamp"
$videoDir = Join-Path $baseDir "01_Hedraの動画を入れる"
$musicDir = Join-Path $baseDir "02_Sunoの曲を入れる"
$videos = @(Get-ChildItem -Path $videoDir -Filter "*.mp4")
$musics = @(Get-ChildItem -Path $musicDir | Where-Object { $_.Extension -match "\.(mp3|wav)$" })
$createdMVs = @(Get-ChildItem -Path $baseDir -Filter "完成したMV_*.mp4")
if ($videos.Count -eq 0 -and $musics.Count -eq 0 -and $createdMVs.Count -eq 0) {
    Write-Host "お片付けする素材が見つかりません！すでに空っぽです！"
    Write-Host ""
    exit
}
Write-Host "新しい保管庫フォルダを作成しました: [03_過去の素材保管庫\素材_$timestamp]"
New-Item -ItemType Directory -Path $targetDir | Out-Null
if ($videos.Count -gt 0) {
    Write-Host "動画を保管庫に移動しています..."
    Move-Item -Path "$videoDir\*.mp4" -Destination $targetDir -Force
}
if ($musics.Count -gt 0) {
    Write-Host "曲を保管庫に移動しています..."
    foreach ($m in $musics) {
        Move-Item -Path $m.FullName -Destination $targetDir -Force
    }
}
if ($createdMVs.Count -gt 0) {
    Write-Host "今まで作っていた完成MVも一緒に保管庫へ移動しています..."
    foreach ($mv in $createdMVs) {
        Move-Item -Path $mv.FullName -Destination $targetDir -Force
    }
}
Write-Host ""
Write-Host "==================================================="
Write-Host "  お片付け完了！！！✨"
Write-Host "  これで新しいMVを作る準備ができました！"
Write-Host "==================================================="
