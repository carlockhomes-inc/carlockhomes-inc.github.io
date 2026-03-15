
# M-Lab Desktop Organizer (Safe Version)
# This script organizes files on your Desktop into folders.

# 1. Set the Target Path (OneDrive Desktop)
$desktopPath = [System.IO.Path]::Combine($env:USERPROFILE, "OneDrive", "Desktop")
# Fallback to standard Desktop if OneDrive path doesn't exist
if (-not (Test-Path $desktopPath)) {
    $desktopPath = [System.IO.Path]::Combine($env:USERPROFILE, "OneDrive", "デスクトップ")
}

Write-Host "Target: $desktopPath" -ForegroundColor Cyan

if (-not (Test-Path $desktopPath)) {
    Write-Host "Error: Desktop folder not found." -ForegroundColor Red
    exit
}

# 2. Create the destination folder
$todayStr = (Get-Date).ToString("yyyy-MM-dd") + "_Sorted"
$baseFolder = Join-Path $desktopPath $todayStr

if (-not (Test-Path $baseFolder)) {
    New-Item -ItemType Directory -Path $baseFolder | Out-Null
    Write-Host "Created folder: $baseFolder" -ForegroundColor Green
}

# 3. Define Rules
$rules = @{
    "Images"       = @(".jpg", ".jpeg", ".png", ".gif", ".bmp")
    "Documents"    = @(".pdf", ".docx", ".doc", ".txt", ".pptx", ".md")
    "Spreadsheets" = @(".xlsx", ".xls", ".csv")
    "Media"        = @(".mp3", ".wav", ".mp4", ".mov")
    "Archives"     = @(".zip", ".rar", ".7z")
}

# 4. Move Files
Get-ChildItem -Path $desktopPath -File | ForEach-Object {
    $file = $_
    $ext = $file.Extension.ToLower()
    $moved = $false

    # Skip the script files themselves
    if ($file.Name -eq "organize_desktop.ps1" -or $file.Name -match ".bat$") { return }

    foreach ($key in $rules.Keys) {
        if ($rules[$key] -contains $ext) {
            $destPath = Join-Path $baseFolder $key
            if (-not (Test-Path $destPath)) { New-Item -ItemType Directory -Path $destPath | Out-Null }
            
            Move-Item -Path $file.FullName -Destination $destPath
            Write-Host "Moving: $($file.Name) -> $key" -ForegroundColor Yellow
            $moved = $true
            break
        }
    }

    # Move other files to 'Others'
    if (-not $moved) {
        $otherPath = Join-Path $baseFolder "Others"
        if (-not (Test-Path $otherPath)) { New-Item -ItemType Directory -Path $otherPath | Out-Null }
        Move-Item -Path $file.FullName -Destination $otherPath
        Write-Host "Moving: $($file.Name) -> Others" -ForegroundColor Gray
    }
}

Write-Host "`nDone! Your desktop is clean." -ForegroundColor Green
