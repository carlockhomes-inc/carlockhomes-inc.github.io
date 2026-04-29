$src = "01_採用ハブ_最新\CLH_FINAL_FULL.html"
$dst = "preview_perfect.html"
$c = Get-Content -LiteralPath $src -Raw -Encoding UTF8
$c = $c -replace 'RECRUIT 2026', 'TOPICS'
$c = $c -replace 'スタッフ平均年齢', 'NEWS'
$c = $c -replace 'font-size:36px;font-weight:900;line-height:1.4;margin:0 0 16px;">.*?', 'font-size:28px;font-weight:900;line-height:1.4;margin:0 0 16px;">【特別公開】<br>街のセーフティネット構想</h1><!--'
$c | Out-File -LiteralPath $dst -Encoding utf8
