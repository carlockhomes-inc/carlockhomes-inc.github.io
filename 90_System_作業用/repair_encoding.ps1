$files = Get-ChildItem -Path "CARLOCKHOMES\RISK_MANAGEMENT\*.md"
$sjis = [System.Text.Encoding]::GetEncoding(932)
$utf8 = New-Object System.Text.UTF8Encoding($false)

foreach ($file in $files) {
    Write-Host "Converting: $($file.FullName)"
    $content = [System.IO.File]::ReadAllText($file.FullName, $sjis)
    [System.IO.File]::WriteAllText($file.FullName, $content, $utf8)
}
Write-Host "Repair Complete!"
